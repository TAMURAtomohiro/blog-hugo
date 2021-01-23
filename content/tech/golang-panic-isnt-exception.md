+++
date = "2017-04-04T14:03:30+09:00"
draft = true
title = "Go言語の panic と例外機構との違い"
tags = ["go"]
+++

例外機構については[この記事]({{< ref "why-does-golang-not-have-exceptions.md" >}})
で色々書きました。

挙動を比べてみると、

例外が投げられたときの挙動：

- コールスタックを戻りつつ `catch` ブロックを探して実行する

`panic` が投げられたときの挙動：

- コールスタックを戻りつつ `defer` された処理を実行する

となっており、機能面では似たようなものです。`panic` では関数内でのジャンプはできないですが。

重要なのは、Go言語では `panic` をエラー返却の手段として使わない、という点です。
`panic` は再帰関数のコールスタックを一気に戻る場面で使います。
[Defer, Panic, and Recover](https://blog.golang.org/defer-panic-and-recover)では JSON のデコード関数を例として挙げています。

<!--more-->

もしあなたが複数人のプロジェクトに参加していて、自分の作ったモジュールを誰かに使ってもらうのであれば、
`panic` は `recover` で捉えてエラー値を返すようにし、モジュールの外に出すべきではありません。

もし自分だけが使うスクリプトを書いているのであれば、`panic`を投げてプロセスを殺し、単にスタックトレースを表示するのも良いと思います。


参考：

- [Semipredicate problem](https://en.wikipedia.org/wiki/Semipredicate_problem)
- [Defer, Panic, and Recover](https://blog.golang.org/defer-panic-and-recover)
- [panic はともかく recover に使いどころはほとんどない](http://qiita.com/ruiu/items/ff98ded599d97cf6646e)
- [golangのpanicは例外ではないのか？](http://h3poteto.hatenablog.com/entry/2015/12/11/221431)
- [Golang の defer 文と panic/recover 機構について](http://blog.amedama.jp/entry/2015/10/11/123535)
- [スタック追跡とパニック・ハンドリング](http://text.baldanders.info/golang/stack-trace-and-panic-handling/)
