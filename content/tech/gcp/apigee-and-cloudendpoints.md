+++
date = "2020-03-05T01:55:51+09:00"
draft = true
title = "APIキー認証のために Google Cloud Endpoints と Apigee を使ってみた"
tags = ['gcp']
+++

GCP上に構築したAPIに対し、APIキーでの認証機能を追加したかったので、
Apigee と Cloud Endpoints を使ってみました。

今回の感想としては、以下のような理由で Cloud Endpoints を使うことにしました。

* 支払いが GCP だけで完結する
* APIキーの発行を GCP コンソールから行え、APIキーごとのリファラ制限・IP制限が行える
<!--more-->

# 要件

まず、API サーバを GCP の Cloud Run に構築してありました。
好き勝手に使われるのもまずいので、APIキーを要求し、
できればAPIキーと合わせてIP制限などが欲しいところでした。

自前で実装するのも手間ですし、
AWS でいうと API Gateway のような API キーのチェックやレート制限ができるサービスがあるのは知っていたので、
GCP だったらどうするのかなー、ということで Apigee と Cloud Endpoints を試してみることにしました。

# Apigee

Apigee は2016年に Google が買収したサービスです。
ですので、GCP に限ったサービスではなく、AWS でも Azure でもオンプレでも、
実際にAPIリクエストを処理する場所は自由に指定できます。

Apigee では XML を利用してルールを記述し、
事前に用意されている機能を組み合わせて認証機能などを実現することができます。

APIキーの認証をApigeeで処理することになりますが、
バックエンドのAPIサーバが Apigee からのアクセスだけを許可するようにしないといけないので、
今回は Apigee で JWT を生成してAPIサーバに渡してもらうことにしました。[^ref1]

## Apigee での APIキー要求と JWT 生成

今回実際に組んでみたルールは以下のようになります。

{{< figure src="/img/apigee-and-cloudendpoints/1.png" width="100%" alt="Apigeeの設定画面">}}

- APIキーのチェック

注：APIキーごとにリファラ制限やIP制限が可能かどうかは不明

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<VerifyAPIKey async="false" continueOnError="false" enabled="true" name="verify-api-key">
    <DisplayName>Verify API Key</DisplayName>
    <APIKey ref="request.header.x-api-key"/>
</VerifyAPIKey>
```

- Apigee に設定したメタデータからJWT生成のためのキーを取り出す

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<KeyValueMapOperations async="false" continueOnError="false" enabled="true" name="GetSecretKey" mapIdentifier="secrets">
    <DisplayName>GetSecretKey</DisplayName>
    <Properties/>
    <ExclusiveCache>false</ExclusiveCache>
    <ExpiryTimeInSecs>300</ExpiryTimeInSecs>
    <Get assignTo="private.secretkey" index="1">
        <Key>
            <Parameter>secretkey</Parameter>
        </Key>
    </Get>
    <Scope>environment</Scope>
</KeyValueMapOperations>
```

- 取り出したキーで JWT を生成( Issuer とかは自由に指定できます )

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<GenerateJWT async="false" continueOnError="false" enabled="true" name="Generate-JWT">
    <DisplayName>Generate JWT</DisplayName>
    <Algorithm>HS256</Algorithm>
    <SecretKey>
        <Value ref="private.secretkey"/>
    </SecretKey>
    <Subject>AuthToken</Subject>
    <Issuer>urn://api.endpoint</Issuer>
    <Audience>urn://api.backend</Audience>
    <ExpiresIn>1h</ExpiresIn>
    <OutputVariable>jwt</OutputVariable>
</GenerateJWT>
```

- JWT をリクエストヘッダに付加( `Authorization: Bearer ${JWT}` という形式)

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<AssignMessage async="false" continueOnError="false" enabled="true" name="AddJWTHeader">
    <DisplayName>AddJWTHeader</DisplayName>
    <Set>
        <Headers>
            <Header name="Authorization">Bearer {jwt}</Header>
        </Headers>
    </Set>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <AssignTo createNew="false" transport="http" type="request"/>
</AssignMessage>
```

と、ここまでで Apigee 上で発行した API キーを要求しつつ、
認証が通ったものに対してリクエストヘッダの Authorization に JWT を追加して
APIサーバに渡す、ということが実現できるので、
APiサーバ側で JWT を検証し、
JWTがないとか Issuer がおかしいとかを弾けばOKです。
(JWT の期限 `ExpiresIn` が 1h(1時間)になってますが、実際は数秒とかで十分でしょう)

また、上に貼ったスクリーンショットでは、レスポンスに対し CORS 対応のための
Access-Control-Allow-Origin ヘッダなどを追加しています。

# Cloud Endpoints 

Cloud Endpoints は GCP に統合されたサービスで、
Apigee と同様に API キーのチェックや統計データの可視化などを提供します。
収益化の機能はないです。

Cloud Endpoints では、まず OpenAPI 使用に基いて API 定義を記述します。
GCP 独自の拡張として、`x-google-backend` といった項目があり、
実際に API リクエストを処理する GCP 内のサービス(Cloud Run や Cloud Functions)を指定できます。

参考：[Cloud Endpoints のアーキテクチャの概要](https://cloud.google.com/endpoints/docs/openapi/architecture-overview?hl=ja)

API キーのチェックなどには ESP (Extensible Service Proxy)というコンテナを利用します。
ESP は Cloud Run にデプロイします。
ESP を公開、APIサーバは非公開として、
ESP に API サーバである Cloud Run の呼出し権限をつけるという構図です。
**GCP の権限管理の枠組みでアクセス制限ができる**ので、今回のケースで Apigee にて必要だった JWT の生成が不要となりました。

ESP を構築する手順についてはドキュメントがしっかり用意されているのでこれに従えばよいでしょう。

[Cloud Run での Endpoints スタートガイド](https://cloud.google.com/endpoints/docs/openapi/get-started-cloud-run?hl=ja)

OpenAPI 定義の先頭部分を抜粋すると以下のようになります。
`api-endpoint-xxx.a.run.app` が Cloud Run にデプロイした ESP、
`https://xxx.a.run.app` が同じく Cloud Run にデプロイした API サーバ、という感じです。

```
swagger: '2.0'

info:
  version: "0.0.1"
  title: xxx API
  description: xxx API

host: api-endpoint-xxx.a.run.app

schemes:
  - https
produces:
  - application/json
x-google-backend:
  address: "https://xxx.a.run.app"

# 認証情報
securityDefinitions:
  keyAuth:
    type: apiKey
    name: key
    in: query

security:
  - keyAuth: []

paths:
  ...
```

## Cloud Endpoints の素敵なところ

[Cloud Endpoints](https://cloud.google.com/endpoints?hl=ja)の特長：APIキーに以下のような記述があります。

> Google Cloud Platform Console で API キーを生成し、すべての API 呼び出しで検証を行います。API を他のデベロッパーと共有すると、共有相手が独自のキーを生成できるようになります。

これが意味するところは、Cloud Endpoints で作成した API に対し、
**他の GCP API と同様に「APIとサービス」で管理できる**ということです。

[Cloud Endpoints クイックスタート](https://cloud.google.com/endpoints/docs/quickstart-endpoints?hl=ja)にて
"Airport Codes" というAPIを Cloud Endpoints に作りますが、
これを有効化すると、

{{< figure src="/img/apigee-and-cloudendpoints/4.png" width="100%" alt="APIの有効化">}}

ダッシュボードなどにも現れますし、認証情報としてAPIキーを作成した際に、
APIキーの制限として指定することもできます。

{{< figure src="/img/apigee-and-cloudendpoints/2.png" width="100%" alt="APIキーの制限">}}

フロントエンドから使う場合はリファラ制限をかけたAPIキー、
バックエンドから使う場合はIP制限をかけたAPIキー、という具合にアクセス制限が実現できるので、非常に便利です。

# まとめ

今回は Apigee と Cloud Endpoints を使ってみました。
2つとも、APIを運用する上で必要になる幅広いサービスを提供しており、
片方にしかない機能(Apigeeで言えば収益化周り、Cloud Endpoins で言えば GCP との統合)もあるので、
使いわけの参考になれば幸いです。

[^ref1]:Apigee が使用している IPレンジ をまとめて許可するなどのアプローチも考えましたが、ぱっと見つからず...。
