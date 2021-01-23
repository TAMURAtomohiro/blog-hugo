+++
draft = false
title = "AWS Lambda で xmlsec を利用する"
tags = ["aws","go"]
date = "2017-12-03T16:41:17+09:00"
+++

AWS Lambda 上で、署名された XML 文書の検証をしたい、とふと思いました。
もっと言うと SAML2 のサービスプロバイダとして AuthResponse の検証を
サーバレスでやってみよう、というところから出発して、
まずは XML 文書の署名が検証できないことにはお話になりませんね、ということです。

本記事は以下のことをやるための手順メモです。

* [apex](https://github.com/apex/apex)、[go-apex](https://github.com/apex/go-apex)、[go-xmlsec](https://github.com/crewjam/go-xmlsec) を使って GO 言語でプログラムを書く
* xmlsec を静的リンクしたバイナリを作る

より一般的には、AWS Lambda の実行環境に入っていないネイティブライブラリを使いたい場合は静的リンクして持ち込む、という話です。

<!--more-->

# Lambda とEC2 インスタンスの作成

[Lambda の実行環境のAMIを調べ](http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/current-supported-versions.html)、
EC2インスタンスを作ります。
たとえば `amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2` という AMI ID のものを Community AMI から探して起動します。

# Go言語環境のセットアップ

参考： [Go開発環境/ビルド環境としてAmazon Linuxをセットアップする手順](https://dev.classmethod.jp/cloud/aws/amazon-linux-go-setup/)

```
sudo yum install golang
mkdir $HOME/go
echo 'export GOPATH=$HOME/go' >> .bashrc
source .bashrc
```

# 各種ライブラリのインストール

`configure`のオプションについては[crewjam/go-xmlsec](https://github.com/crewjam/go-xmlsec)のまま。
途中で失敗するところがいくつかあったので手順を足しています。

## 静的リンク用 glibc のインストール

これは go-xmlsec には出てこなかった手順です。

```
sudo yum install glibc-static.x86_64
```

## libxml2 のインストール

```
cd
curl -sL ftp://xmlsoft.org/libxml2/libxml2-2.9.6.tar.gz | tar -xzf -
cd libxml2-2.9.6
./configure --enable-static --disable-shared --without-gnu-ld --with-c14n --without-catalog --without-debug --without-docbook  --without-fexceptions  --without-ftp --without-history --without-html --without-http --without-iconv --without-icu --without-iso8859x --without-legacy --without-mem-debug --without-minimum --with-output --without-pattern --with-push --without-python --without-reader --without-readline --without-regexps --without-run-debug --with-sax1 --without-schemas --without-schematron --without-threads --without-thread-alloc --with-tree --without-valid --without-writer --without-xinclude --without-xpath --with-xptr --without-modules --without-zlib --without-lzma --without-coverage
sudo make install
```

## openssl のインストール

go-xmlsec の手順だけでは `libcrypto.a` が配置されなかったため、それを追加しています。

```
cd
curl -sL ftp://ftp.openssl.org/source/openssl-1.1.0f.tar.gz | tar -xzf -
cd openssl-1.1.0f
./config no-shared no-weak-ssl-ciphers no-ssl2 no-ssl3 no-comp no-idea no-dtls no-hw no-threads no-dso
sudo make depend install
sudo mkdir /usr/local/ssl/lib
sudo cp ./libcrypto.a /usr/local/ssl/lib/
```

## xmlsec のインストール

```
cd
curl -sL http://www.aleksey.com/xmlsec/download/xmlsec1-1.2.25.tar.gz | tar -xzf -
cd xmlsec1-1.2.25/
./configure --enable-static --disable-shared --disable-crypto-dl --disable-apps-crypto-dl --enable-static-linking --without-gnu-ld --with-default-crypto=openssl --with-openssl=/usr/local/ssl --with-libxml=/usr/local --without-nss --without-nspr --without-gcrypt --without-gnutls --without-libxslt
sudo make -C src install
sudo make -C include install
sudo make install-pkgconfigDATA
```

## `PKG_CONFIG_PATH` に色々追加

これも go-xmlsec にはない手順です。

```
cd
echo 'export PKG_CONFIG_PATH=/usr/lib64/pkgconfig:/usr/local/lib64/pkgconfig:/usr/share/pkgconfig:/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH' >> ~/.bashrc
source .bashrc
```

## ビルドの動作確認

```
go get github.com/crewjam/go-xmlsec
cd go/src/github.com/crewjam/go-xmlsec
go build -tags static -ldflags '-s -extldflags "-static"' -o ~/xmldsig-static.bin ./examples/xmldsig.go
```

# xmlsec の使い方

諸々説明できるほど理解していないので取り急ぎコマンドだけ掲載しますと以下のような感じです。

```
xmlsec1 verify --id-attr:ID "urn:oasis:names:tc:SAML:2.0:protocol:Response" --trusted-pem x509.cert SamlResponse.xml
```
