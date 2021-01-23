+++
date = "2017-12-03T18:11:19+09:00"
draft = true
title = "Go言語でスライス要素のアドレスは取得できるがマップ要素のアドレスは取得できない"
tags = ["go"]
+++
Go言語では、マップ要素のアドレスは取得できませんが、スライス要素のアドレスは取得できます。
本記事は、この仕様の違いについて調べたメモです。

「プログラミング言語Go」4.3節「マップ」での一文を引用します。

> マップの要素のアドレスが得られない理由の一つは、マップが大きくなる際に既存の要素が再びハッシングされて新たなメモリ位置へ移動するかもしれず、アドレスが無効になる可能性があるからです。

この文を読んだときに受かんだ疑問は、スライスの基底配列も新たなメモリ位置に移動するのでは？というものでした。
結論としては、

- スライスの基底配列も新たなメモリ位置に移動しうるが、参照があれば古い基底配列も残る(GCで回収されない)

というものです。

<!--more-->

挿入の際、スライスでは新たなスライスが生成される可能性があります。

```
sliceNew = append(sliceOld, 1)
```

一方、マップでは内部のポインタのみが変更され、新たなマップは生成されません。
以下のコードでは、`k` が存在しなかった場合内部的に要素が追加されることになるため、

```
hashMap[k] = 1
```

# Go言語の内部実装

## `slice` の定義

`github.com/golang/go/src/runtime/slice.go` にあります。

```
type slice struct {
	array unsafe.Pointer
	len   int
	cap   int
}
```

スライスの場合、各スライスが基底配列へのポインタを持っています。
また、スライスを拡張してるっぽい関数を見てみると新たに `slice` を生成して返しています。

```
func growslice(et *_type, old slice, cap int) slice {
    ...
  	return slice{p, old.len, newcap}
}
```

## `map` の定義

`github.com/golang/go/src/runtime/hashmap.go` にあります。
コメント部分は適当に削除しました。

```
type hmap struct {
	count     int
	flags     uint8
	B         uint8
	noverflow uint16
	hash0     uint32
	buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
	oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
	nevacuate  uintptr
	overflow *[2]*[]*bmap
}

```

ポイントは `buckets` と `oldBuckets` でしょう。
スライスと同様にそれっぽい関数のそれっぽい箇所を見てみると、
返り値がなく、引数で与えた `map` を上書きしていることが分かります。

```
func hashGrow(t *maptype, h *hmap) {
    ...
	oldbuckets := h.buckets
	newbuckets := newarray(t.bucket, 1<<(h.B+bigger))
    ...
	h.oldbuckets = oldbuckets
	h.buckets = newbuckets
```

参考：

* [Why does go forbid taking the address of (&) map member, yet allows (&) slice element?](http://stackoverflow.com/questions/32495402/why-does-go-forbid-taking-the-address-of-map-member-yet-allows-slice-el)

[reflect.CanAddr のドキュメント](https://golang.org/pkg/reflect/#Value.CanAddr)
> CanAddr reports whether the value's address can be obtained with Addr. Such values are called addressable. A value is addressable if it is an element of a slice, an element of an addressable array, a field of an addressable struct, or the result of dereferencing a pointer. If CanAddr returns false, calling Addr will panic.
