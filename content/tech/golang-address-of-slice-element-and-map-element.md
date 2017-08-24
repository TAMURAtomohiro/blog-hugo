+++
date = "2017-04-18T00:10:17+09:00"
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

- スライスの基底配列も新たなメモリ位置に移動しうるが、参照があれば古い基底配列も残る

というものです。

挿入の際、スライスでは新たなスライスが生成される可能性があります。

```
sliceNew = append(sliceOld, 1)
```

```
type slice struct {
	array unsafe.Pointer
	len   int
	cap   int
}
```


一方、マップでは内部のポインタのみが変更され、新たなマップは生成されません。

```
hashMap[k] = 1
```

```
type hmap struct {
	// Note: the format of the Hmap is encoded in ../../cmd/internal/gc/reflect.go and
	// ../reflect/type.go. Don't change this structure without also changing that code!
	count     int // # live cells == size of map.  Must be first (used by len() builtin)
	flags     uint8
	B         uint8  // log_2 of # of buckets (can hold up to loadFactor * 2^B items)
	noverflow uint16 // approximate number of overflow buckets; see incrnoverflow for details
	hash0     uint32 // hash seed

	buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
	oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
	nevacuate  uintptr        // progress counter for evacuation (buckets less than this have been evacuated)

	// If both key and value do not contain pointers and are inline, then we mark bucket
	// type as containing no pointers. This avoids scanning such maps.
	// However, bmap.overflow is a pointer. In order to keep overflow buckets
	// alive, we store pointers to all overflow buckets in hmap.overflow.
	// Overflow is used only if key and value do not contain pointers.
	// overflow[0] contains overflow buckets for hmap.buckets.
	// overflow[1] contains overflow buckets for hmap.oldbuckets.
	// The first indirection allows us to reduce static size of hmap.
	// The second indirection allows to store a pointer to the slice in hiter.
	overflow *[2]*[]*bmap
}

```


<!--more-->

[Why does go forbid taking the address of (&) map member, yet allows (&) slice element?](http://stackoverflow.com/questions/32495402/why-does-go-forbid-taking-the-address-of-map-member-yet-allows-slice-el)

[reflect.CanAddr のドキュメント](https://golang.org/pkg/reflect/#Value.CanAddr)
> CanAddr reports whether the value's address can be obtained with Addr. Such values are called addressable. A value is addressable if it is an element of a slice, an element of an addressable array, a field of an addressable struct, or the result of dereferencing a pointer. If CanAddr returns false, calling Addr will panic.
