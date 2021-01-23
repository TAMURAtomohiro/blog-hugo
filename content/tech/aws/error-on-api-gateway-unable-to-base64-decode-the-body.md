+++
draft = false
title = "API Gateway の 'Unable to base64 decode the body' エラー"
tags = ['aws']
date = "2018-02-17T01:02:32+09:00"
+++

とある事情で S3 に HTML を置き、 CloudFront から API Gateway 経由(AWSサービス統合)でアクセスしたときの話です。
500 エラーが返ってくるので CloudWatch のログを見てみると、
S3 からは正常に取得できているようでしたが、
最後に以下のようなエラーが出ていました。

```
Execution failed due to configuration error: Unable to base64 decode the body.
```

どうやら Base64 デコードをしようとして失敗しているようです。
結果的に AWS 統合から Lambda 統合に変えて S3 オブジェクトを取得するようにしたら直ったのですが、
こういう挙動をする理由についての公式ドキュメントなどは見つけられていません。

<!--more-->

最初はメタデータの Content-Type がおかしいのかと思いましたが、
確認してみても `text/html` だったので混乱しつつまずはエラーメッセージで検索してみました。
見つけたのは Stack overflow の以下の記事。

[API Gateway unable to decode base64](https://stackoverflow.com/questions/43325993/api-gateway-unable-to-decode-base64)

AWS 統合だと API Gateway はレスポンスが Base64 エンコードされていることを期待するよ、
とか書いてあるように見えたので Lambda 統合にして Lambda を経由するようにしたら直りました。

謎です。
