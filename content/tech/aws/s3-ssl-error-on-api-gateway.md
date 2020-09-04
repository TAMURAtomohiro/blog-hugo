+++
draft = false
title = "API Gateway から名前にドットを含む S3 バケットへアクセスしたときの SSL 証明書エラー"
tags = ["aws"]
date = "2018-01-27T17:27:31+09:00"
+++

API Gateway では統合リクエストのところで"AWS サービス"として設定することで
S3 のデータを読み書きするようにできます。

たとえば以下のように設定することで S3 オブジェクトを GET することができます。
API Gateway のカスタムオーサライザ機能でのちのち認証を追加したりできるので、
とりあえず間に API Gateway をはさんでおくと便利です。

* AWS サービス： S3
* AWS サブドメイン： バケット名
* HTTP メソッド： `GET`
* パス上書き： `/path/to/resource`

ここで、バケット名にドット(`.`)を含む場合は注意が必要です。
バケット名が `my.bucket.domain` のようになっていると、
S3 へのアクセスの際に `https://my.bucket.domain.s3.amazonaws.com` というドメインが使われ、
S3 側では `*.s3.amazonaws.com` という SSL 証明書を用いているため `my.bucket.domain` のような多段階のサブドメインにマッチせず、
怒られます。

そんなわけで、ドメイン名にドットを含む場合は以下のように設定する必要があります。

* AWS サブドメイン： 空欄
* パス上書き： `my.bucket.domain/path/to/resource`

個人的には、トラブルが起きがちなドット混じりのバケット名は避けようかな、という気持ちになってきました。

参考：[SSL Multilevel Subdomain Wildcard](https://stackoverflow.com/questions/26744696/ssl-multilevel-subdomain-wildcard)

<!--more-->
