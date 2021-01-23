+++
date = "2020-01-23T21:27:28+09:00"
draft = false
title = "Fargate で環境変数に改行コードを含む文字列を渡すときの注意点"
tags = ["aws", "python"]
+++

AWS の Fargate を使っていて、改行コードを含む文字列を環境変数にセットしたいとふと思った。

もっと具体的に言えば CloudFront 用の 署名付き Cookie を生成するために
プライベートキー(PEM)を渡したかった。
PEM は以下のように改行を含む。

```
-----BEGIN RSA PRIVATE KEY-----
XXX
YYY
-----END RSA PRIVATE KEY-----
```

<!--more-->

最初はこれを以下のような感じで Fargate の environments に渡せばいいか、と思って試した。

```
{
  "name": "PRIVATE_KEY"
  "value": "-----BEGIN RSA PRIVATE KEY-----\nXXX\nYYY\n-----END RSA PRIVATE KEY-----"
}
```

これはプログラム側での扱いにちょっと注意が必要だった。

この値をプログラム言語の文字列リテラルとして書くとか、
シェルに書くなどすればエスケープシーケンスとして解釈され、
`\`と`n`という二文字が `0x0A` というバイトに変換される。

Fargate の環境変数に渡しただけでは変換が起こらないので、
二文字のままである。
つまり改行コードになっていない。

今回、プログラム言語は Python を使っていたので、以下のように置換した。

```
os.environ.get("PRIVATE_KEY").replace("\\n", "\n")
```

# PEMキーを改行コードなしで渡せるか？

`XXXYYY`のように改行なしの文字列として渡せないかなー、と思ったが、
少なくとも `pycrypto` の `Crypto.PublicKey.RSA.importKey` ではダメだった。
原理的には、Base64 デコード後のバイト列が得られさえすればいいので、
ライブラリに用意されている関数次第では何とかなりそうではある。
