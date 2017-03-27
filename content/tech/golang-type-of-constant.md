+++
date = "2017-03-15T17:17:21+09:00"
draft = true
title = "GO言語におけるリテラル/定数式は型がない(untyped)"
tags = ["go"]
+++

各リテラルの型を(`fmt.Printf("%T", 123)` のように)単に印字してみると、以下のような結果が得られます。

- 整数: int
- 浮動小数: float64
- 文字列: string
- ルーン: int32
- 虚数: complex128
- 真偽値: bool

しかしながら、たとえば比較演算子のところで使う場合(`123 == x`)は `x` の型に合わせて解釈されているようだったので、
混乱しました。

そんなわけでGO言語の仕様を調べてみると、定数については「型なし(untyped)」という状態であることがわかりました。

<!--more-->
調べるのに使ったコードは以下の通りです。
{{< gist tmrtmhr d17e3b718dc873661188f14b406b1bba >}}

なぜこれを調べたかというと、
[GO言語でJSONを扱った際]({{< ref "tech/replace-a-part-of-json-with-command-output.md" >}})に
ユニットテストでちょっとつまづいたからです。

具体的には、
以下のように `interface{}` 型の変数に代入した数値を他の数値と比較したとき、
印字した値は同じにみえても型が違うことで同値判定が偽となりました。

```
var x interface{} = 123
var y int64 = 123
fmt.Printf("%v %T %T", x == y, x, y)
// => false int int64
```

しかしながら、変数の型が `interface{}` でない場合、同値判定は型エラーとしてコンパイル時に弾かれます。

```
var x int = 123
var y int64 = 123
fmt.Printf("%v %T %T", x == y, x, y)
// => invalid operation: x == y (mismatched types int and int64)
```

変数の型がインターフェース型の場合、そのインタフェースを実装しているデータ型であれば代入できますが、

> An untyped constant has a default type which is the type to which the constant is implicitly converted in contexts where a typed value is required, for instance, in a short variable declaration such as i := 0 where there is no explicit type. The default type of an untyped constant is bool, rune, int, float64, complex128 or string respectively, depending on whether it is a boolean, rune, integer, floating-point, complex, or string constant.

参考：[Go言語仕様:比較演算子](http://golang.jp/go_spec#Comparison_operators)、[Go言語の型とreflect](http://qiita.com/atsaki/items/3554f5a0609c59a3e10d)

[Go言語仕様: Constants](https://golang.org/ref/spec#Constants)
[The Go Blog: Constants](https://blog.golang.org/constants)
