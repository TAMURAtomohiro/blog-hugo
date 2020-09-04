+++
date = "2018-06-11T15:11:40+09:00"
draft = true
title = "Lambda@Edge ログのリージョン/API Gateway の CloudWatch ログを有効化したときのリージョン"
tags = ['aws']
+++

[Amazon API Gateway](https://aws.amazon.com/jp/api-gateway/)では、
ステージごとに「CloudWatch ログを有効化」という設定が行えます。
ログを有効化すると CloudWatch ログに `API-Gateway-Execution-Logs-{APIのID}/{ステージ名}` という名前のロググループが作られます。

[API Gateway の API ログ作成をセットアップする](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/set-up-logging.html)

[【小ネタ】Lambda@Edgeのログはどこに…？](https://ceblog.mediba.jp/post/164439720802/%E5%B0%8F%E3%83%8D%E3%82%BFlambdaedge%E3%81%AE%E3%83%AD%E3%82%AF-%E3%81%AF%E3%81%A8-%E3%81%93%E3%81%AB)

<!--more-->
