+++
draft = false
title = "AWS Lambda 上で AWS CLI を動かして S3 sync する"
tags = ["aws"]
date = "2017-12-03T16:11:45+09:00"
+++

発端は S3 バケット間を `sync` したいという要件です。
基本は日次実行ですが、アドホックな実行もサポートしたいので、
コピー元の特定ファイルアップロードをトリガーに Lambda で `aws s3 sync` できるとうれしいのです。

AWS Lambda の実行環境には AWS CLI が用意されていません。
まあ外部プロセス呼び出しでコマンドを実行して……とかやろうとするためには
実行環境に何のコマンドが入っているか気にかけなければいけなくなるので、
自分たちの機能コードだけ持ちこめばいいという Lambda の思想にも反すると思います。
コンテナも肥大化しますし。
そんなわけで AWS Lambda の実行環境に AWS CLI が用意されることは将来的にも望み薄でしょう。

じゃあ SDK で実装するか……とざっと調べたところ AWS SDK には `s3 sync` がありません(ないよね？)。
したがって、差分だけアップロードするとか、コピー元で削除されているものはコピー先でも削除するなどの機能は、
SDK を使って自分たちで再実装するなどしないといけません。

それはちょっとねぇ……というわけで紆余曲折あって作成した AWS Lambda 上で AWS CLI を実行できるパッケージ([awscli-on-lambda](https://github.com/tmrtmhr/awscli-on-lambda))を置いておきます。

注意点ですが、このパッケージは Lambda の実行環境が変更されることでいきなり動かなくなる可能性があります。
たとえば、`aws` コマンドが `/usr/bin/python` を見に行くため、このへんを変更されるとアウトです。

<!--more-->

# AWS CLI が動く Lambda パッケージ作成手順について

AWS CLI は Python で実装されているため、`aws` コマンドに必要なライブラリを
すべて Lambda パッケージに含めて適切にロードされるようにすれば Lambda 上で動きます。

作成環境としては [Lambda環境と実行できるライブラリ](http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/current-supported-versions.html) にある
AMI (`amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2`) を使用しました。

また、作成手順としては以下のブログを参考にさせていただきました。

* [Running aws-cli Commands Inside An AWS Lambda Function](https://alestic.com/2016/11/aws-lambda-awscli/)

手順の差分は以下の通りです。

* 事前に `sudo yum instal libyaml-devel` が必要(`PyYAML`のため)
* PyYAML が `lib64` 以下にインストールされるので、そのあたりをパッケージに含めることが必要 ( `(cd $virtualenv/lib64/python2.7/site-packages; zip -r9 $zipfile .)` )

# その他のアプローチ

* AWS CLI の該当部分を `import` して使う

`sync` が実装されている部分を特定するのが面倒そうだったので保留。

* DataPipeline を使う

DataPipeline から EC2 インスタンスを起動して AWS CLI を走らせることもできます。
EC2インスタンスの料金も秒単位になったので悪くないと思います。
そもそも Lambda だと実行時間の上限(300秒)があるので大規模データの場合は DataPipeline を使うことになるでしょう。
