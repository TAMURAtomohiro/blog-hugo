+++
date = "2018-04-29T01:28:34+09:00"
draft = true
title = "Angular の AOT ビルドで 'Exported variable 'X' has or is using name 'Y' from external module \"/path/to/module\" but cannot be named.' エラーが出たときのこと"
tags = ['angular', 'typescript']
+++

[angular-seed](https://mgechev.github.io/angular-seed/)で AOT コンパイルをしようとしたときの話です。

```
error TS4023: Exported variable 'X' has or is using name 'Y' from external module "/path/to/module" but cannot be named.
```

このエラーは、
モジュール`/path/to/module` が export しようとしている変数`X`の型を決めようとして、
`Y`という型のエイリアスもしくは内部に含んでいる、ということまでは突きとめたけれども、
`Y`がどこから import されたものか特定できない、という状態のようです。

<!--more-->

[](https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but)

[](https://github.com/mgechev/angular-seed/issues/2145)
