+++
date = "2017-04-04T15:15:37+09:00"
draft = true
title = "GO言語でのエラーハンドリングについて"
+++

自分の理解のためのメモです。

# モジュール作成者としてのテクニック

# 自分が作るモジュールのエラーとして何を export すべきか

##

# 自分が作るモジュールのエラーとして何を export すべきかのアンチパターン

### sentinel error

`io.EOF` のような別モジュールのエラーを返すようにすると、

```
import (
  "mymodule"
  "io"
)
```

のようにふたつとも `import` しないとエラーの比較ができず、良くない。

### error type

# モジュールを使う側としてのテクニック

<!--more-->
[package errors](https://godoc.org/github.com/pkg/errors)

[Errors are values](https://blog.golang.org/errors-are-values)
[Golang Error Handling lesson by Rob Pike](http://jxck.hatenablog.com/entry/golang-error-handling-lesson-by-rob-pike)
[Golangのエラー処理とpkg/errors](http://deeeet.com/writing/2016/04/25/go-pkg-errors/)

[Gocon spring 2016(PDF)](https://dave.cheney.net/paste/gocon-spring-2016.pdf)

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

[Swiftのエラー4分類が素晴らしすぎるのでみんなに知ってほしい](http://qiita.com/koher/items/a7a12e7e18d2bb7d8c77)
[エラー・ハンドリングについて](http://text.baldanders.info/golang/error-handling/#fnref:nil)

[Defer, Panic and Recover](https://blog.golang.org/defer-panic-and-recover)
> The convention in the Go libraries is that even when a package uses panic internally, its external API still presents explicit error return values.
