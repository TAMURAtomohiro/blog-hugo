+++
draft = false
title = "Go言語で union とか直和型のようなデータを表現したいときは interface を使う"
tags = ['go']
date = "2017-03-29T22:46:34+09:00"
+++

たとえば Haskell では以下のようなデータ型を定義できます。

```
data Tree = Leaf | Branch Tree Tree
```

C言語で言えばタグ付き共用体(union)のような感じです。

<!-- ``` -->
<!-- union Tree { -->
<!--   struct Leaf { -->
<!--     tag int; -->
<!--   } leaf; -->
<!--   struct Branch { -->
<!--     tag int; -->
<!--     left *Tree; -->
<!--     right *Tree; -->
<!--   } branch; -->
<!-- } -->
<!-- ``` -->

この記事は、こんな感じで木構造などを表現したい時
Go 言語ではどうするのか？という点について調べてみたメモです。
結論としては`type Tree interface{ ... }`を定義します。

`data Tree a` のように汎用的なコンテナを作る方法については言及しません。

<!--more-->

# Leaf と Branch に対して行いたい操作

ここでは`Tree`中の`Leaf`を数える`Count`という関数を考えてみます。
Haskell だったらパターンマッチで分岐です。

```haskell
count :: Tree -> Int
count Leaf = 1
count (Branch l r) = count l + count r
```

今Go言語で実現したいのは以下のような内容です。

* `Leaf`か`Branch`のどちらかのデータ構造を引数に取る
* `Leaf`か`Branch`かによって処理を分岐する

そこで登場するのが `interface` です。
ここで`Leaf`と`Branch`は`count`という共通のインタフェースを持っているわけなので、
そういうふうに書きます。

そんなわけでコードは以下の通りです。

{{< gist tmrtmhr 3134ee6b7201197471e33f98780e1285 >}}

# まとめ

ということでGo言語で木構造のような直和型のデータ構造を扱う小さな例を示しました。
