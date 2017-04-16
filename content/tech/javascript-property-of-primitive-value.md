+++
draft = false
title = "JavaScript でプリミティブ値のプロパティを参照すると対応するオブジェクトが一時的に作られる"
tags = ["javascript"]
date = "2017-04-15T22:46:29+09:00"
+++

JavaScript では以下のように数値のプロパティを参照することはできません。

```javascript
0.foo
// 構文エラー
```

変数に入れると構文上は正しいため参照できます。

```javascript
var x = 0;
console.log(x.foo);
// => undefined
```

あるいは文字列の `length` プロパティを参照することも。

```javascript
"bar".length
// => 3
```

しかしながらプリミティブ値はオブジェクトではないため、プロパティもプロトタイプチェーンもありません。
ではプリミティブ値のプロパティにアクセスしようとしたときに何が起こるかというと、
`Number` などの対応するオブジェクトが生成されます。

本記事は、この挙動が言語仕様のどの部分で言及されているのかのメモです。

<!--more-->

# プリミティブ値のプロパティ参照をするときの挙動

[ECMAScript 2015言語仕様 6.2.3.1節 GetValue(V)](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-getvalue)
の以下の部分です。

> If HasPrimitiveBase(V) is true, then

>  Assert: In this case, base will never be null or undefined.

>  Let base be ToObject(base).

ということで言語仕様としてプリミティブ値のプロパティ参照はエラーじゃないと分かり安心しました。
夜もぐっすり眠れそうです(納期が近くなければ)。

ただし、ここで生成されたオブジェクトはその場限りのものなので、
**プリミティブ値がオブジェクトのように扱えるわけではない**ことには注意が必要です。
具体的には以下のように数値のプロパティに対して代入をしたとしても、
その結果が残りません。

```
var x = 0;
x.foo = 1;
console.log(x.foo);
// => undefined
```
