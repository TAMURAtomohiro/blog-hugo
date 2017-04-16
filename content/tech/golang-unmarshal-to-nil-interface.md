+++
draft = false
title = "Go言語の json.Unmarshal で読み込んだデータをテストするときは数値の型に注意する"
tags = ["go"]
date = "2017-04-16T15:01:48+09:00"
+++

以下のようなコードで `interface{}` に対し数値を読み込んだ際、
数値の型は `float64` になります。
(参考: [公式ドキュメント](https://golang.org/pkg/encoding/json/#Unmarshal))

```
var got []interface{}
json.Unmarshal([]byte("[1,2,null]", &got)
```

しかし、これをテストするために比較対象のデータをリテラルとして用意すると、

```
want := []interface{}{1,2,nil}
```

定数のデフォルト型の宿命で数値の型が `int` になってしまうため、`reflect.DeepEqual` などの比較において失敗してしまいます。

# 解決策

解決策としては以下の2つかな、と考えており、(2)のほうは煩雑なので今のところ(1)でやっています。

1. テストデータも `json.Unmarshal` で作る
1. 明示的に `float64(1)` として変換する

<!--more-->

# コードの挙動確認

以下でコードの挙動を確認できます。
[The Go Playground](https://play.golang.org/p/7U2AtxLORC)

{{< gist tmrtmhr 197cf8ed967cc97c0388464b315cfda0 >}}
