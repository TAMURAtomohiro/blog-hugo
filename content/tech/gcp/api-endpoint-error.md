+++
date = "2021-01-23T15:31:09+09:00"
draft = true
title = "Cloud Endpoints のエラー 'INTERNAL:Calling Google Service Control API failed with: 403 and body: \b\u0007\u0012#The caller does not have permission'"
tags = ['gcp']
+++

Cloud Endpoints を設定した API を呼び出したとき、以下のようなエラーが出ていたので、その対応を書きます。

```
{"code":500,"message":"INTERNAL:Calling Google Service Control API failed with: 403 and body: \b\u0007\u0012#The caller does not have permission"}
```

必要な設定は以下です。

* Cloud Run のサービスアカウント(デフォルトでは `*-compute@developer.gserviceaccount.com`) に Cloud Endpoints サービスエージェント をつける
* 該当プロジェクトで Service Control API を有効にする

<!--more-->

GCP の[Cloud Endpoints](https://cloud.google.com/endpoints?hl=ja)は、
自作の API にAPIキーによる認証(キーの有無およびリファラー制限やIP制限)を追加することができます。

以前ベータ版だった頃にデプロイしたものがあったのですが、
新たにIP制限を追加したところ、許可されていないIPでも呼び出しに成功してしまったので、
再度デプロイをしてみたところ以下のようなエラーが出るように。

```
{"code":500,"message":"INTERNAL:Calling Google Service Control API failed with: 403 and body: \b\u0007\u0012#The caller does not have permission"}
```

Cloud Endpoint の認証は Cloud Run のサービスとして動くので、
当初は Cloud Run が使用するサービスアカウントに権限が足りないのかと思って色々試したんですが解決せず。

まず必要な権限は[Service Control API のアクセス制御](https://cloud.google.com/service-infrastructure/docs/service-control/access-control?hl=ja)にあるとおり、
`servicemanagement.services.check`などです。
これは "Cloud Endpoints サービスエージェント" ロールを追加すればOKです。
しかしこれを付けてもエラーメッセージに変化なし。
あらためてドキュメントを読んでいると「Service Control API を有効にする」という手順があったので遷移してみると...

該当プロジェクトで Service Control API が有効になっていませんでした。
有効にすると解決しました。

ベータ版の頃にデプロイしたままだったので、環境のほうが変わっていたという感じですね。
