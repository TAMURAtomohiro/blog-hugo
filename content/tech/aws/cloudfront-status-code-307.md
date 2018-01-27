+++
date = "2018-01-21T21:42:55+09:00"
draft = true
title = "CloudFront でオリジンに S3/API Gateway を設定したときの 307 ステータスコード"
tags = ["aws"]
+++

# S3 の場合

しばらく経ってから CloudFront のキャッシュを消すと良いです。

S3 エンドポイントのドメイン解決をする際に、リクエストを処理できない施設へルーティングされることがあり、
このときに 307 が返却されるようです。


参考：
* [S3がOriginのCloudFrontを設定したら307 Redirectされる](http://miyasakura.hatenablog.com/entry/2016/12/28/200000)
* [公式ドキュメント：リクエストのリダイレクトと REST API](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/dev/Redirects.html)

# API Gateway の場合

Origin > Origin Protocol Policy の設定を "HTTP Only" にしていると、
HTTPS への転送のため 307 が返却されるようです。

<!--more-->
