+++
date = "2017-03-29T10:51:18+09:00"
draft = true
title = "なぜGO言語が例外を採用しなかったのか"
+++
GO言語といえば例外機構を持たない


<!--more-->
[package errors](https://godoc.org/github.com/pkg/errors)

[Golang Error Handling lesson by Rob Pike](http://jxck.hatenablog.com/entry/golang-error-handling-lesson-by-rob-pike)
[Errors are values](https://blog.golang.org/errors-are-values)
[Golangのエラー処理とpkg/errors](http://deeeet.com/writing/2016/04/25/go-pkg-errors/)

https://dave.cheney.net/paste/gocon-spring-2016.pdf

sentinel error
io.EOF のような pre defined なエラー
err == io.EOF のような同値性判定で分岐する
fmt.Errorf で情報を追加して返す
err.Error() で得られる文字列は human readable なものであって code のためのものではない
> To check if an error is equal to `io.EOF`, your code must import the `io` package.
sentinel error はモジュール間に依存性を作るのでよくない

error type に応じたディスパッチも結局依存性を作るのでよくない

opacue error
x, err := bar.Foo()
if err != nil { return err } のように処理で何か起きたことだけを判断するエラーハンドリング

http://www.thedotpost.com/2015/11/rob-pike-simplicity-is-complicated

例外について
[Cleaner, more elegant, and harder to recognize](https://blogs.msdn.microsoft.com/oldnewthing/20050114-00/?p=36693)
* エラーコードベースで良いコードを書くのは難しいが例外ベースではさらに難しい
* 例外ベースでは良いコードと悪いコードを見分けるのも難しい

[Joel on software 2013/10/13](https://www.joelonsoftware.com/2003/10/13/13/)
> They are invisible in the source code. Looking at a block of code, including functions which may or may not throw exceptions, there is no way to see which exceptions might be thrown and from where. This means that even careful code inspection doesn’t reveal potential bugs.
> They create too many possible exit points for a function. To write correct code, you really have to think about every possible code path through your function. Every time you call a function that can raise an exception and don’t catch it on the spot, you create opportunities for surprise bugs caused by functions that terminated abruptly, leaving data in an inconsistent state, or other code paths that you didn’t think about.

memory usage after a call to free (dangling pointer) or before a call to malloc (wild pointer), calling free twice ("double free"),

個人的に面白いなと思ったのは「組込み機器のようにリソースの乏しい機器では、スタックを巻きとるのに時間がかかるためリアルタイム性が損なわれる」というもの。
[Swift がなぜ例外機構を持たないのか](http://softwareengineering.stackexchange.com/questions/258012/why-design-a-modern-language-without-an-exception-handling-mechanism)
[もう少し例外を使用しても良いのではないか...](http://qiita.com/MasayaMizuhara/items/98c0d490f1633d9b636f)


[Swift 2.0 の try, catch ファーストインプレッション](http://qiita.com/koher/items/0c60b13ff0fe93220210)

[Swiftのエラー4分類が素晴らしすぎるのでみんなに知ってほしい](http://qiita.com/koher/items/a7a12e7e18d2bb7d8c77)

[Why use Exception?](https://isocpp.org/wiki/faq/exceptions#why-exceptions)
