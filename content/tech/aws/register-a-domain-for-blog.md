+++
draft = false
title = "ブログに使うドメインを AWS で取得する"
tags = ["aws"]
date = "2017-03-14T17:03:40+09:00"
+++

せっかくなので本サイトのドメインを AWS Route53 で管理するようにした際のメモです。

やったことは以下の通り。

* [Route 53](https://aws.amazon.com/jp/route53/) でドメインを取得
* [SES](https://aws.amazon.com/jp/ses/) で対象ドメインのメールアドレスにて受信
* [Certificate Manager](https://aws.amazon.com/jp/certificate-manager/) で対象ドメインのSSL証明書を取得
* [CloudFront](https://aws.amazon.com/jp/cloudfront/) に取得したSSL証明書を設定

なお、今のところ CloudFront のオリジンサーバとしては [S3](https://aws.amazon.com/jp/s3/) ではなく [GitHub Pages](https://pages.github.com/) を使用しています。

* 2018/01/08 追記:

Certificate Manager で SSL証明書を取得する際、
メールではなく DNS レコードによってドメイン所有を検証することが可能になっていました
([Use DNS to Validate Domain Ownership](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html))。
なので SES の設定は不要かと思います。

<!--more-->

# なぜ AWS でドメインを取得したか

ドメインの料金だけだと[お名前.com](www.onamae.com)などのように Route 53 より安いところもあります。

* 取得したドメインでのメール受信設定( MX レコードの登録)を SES がやってくれるため楽
* SSL証明書が無料かつ自動更新

ということで、要するに設定や管理の手間を省くことを重視したためです。

# Route 53 におけるドメイン管理者情報の公開範囲について

Route 53 でドメインを取得する際、管理者情報を隠すかどうかのチェックボックスがありますが、
トップレベルドメインによって秘匿できる項目が異なります。
(参考：[Route 53で管理するドメインでプライバシー保護できるWHOIS項目は、ドメインによって違うので注意](http://dev.classmethod.jp/cloud/aws/route53-privacy-protection/) )

本サイトのような[.info ドメイン](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar-tld-list.html#info) の場合は
名前だけが公開されます。
残りの項目はドメインレジストラである [Gandi](https://www.gandi.net/) の情報に置換されます。

# ドメイン取得時に登録するメールアドレスについて

今回、ドメイン取得時に登録するメールアドレスについても該当ドメインを使用することにしました( a&#100;mi&#110;&#64;&#116;m&#114;tmhr.in&#102;o )。
当然ながらドメイン取得申請の段階ではこのメールアドレスで受信することはできません。
ドメインを申請すると Route 53 からメールが送信され、本文中の URL にアクセスすることで取得完了となりますが、
期限に猶予があるため、その間に SES の設定を済ませることになります。

Route 53 でドメイン申請 {{< md-icon arrow_forward >}} SES で MX レコード登録 {{< md-icon arrow_forward >}} Route 53 から送られてくるメール本文の URL にアクセス、という流れです。

ここで、Certificate Manager での SSL 証明書取得を予定していて、かつドメインの管理者情報を秘匿している場合は注意が必要です。
Certificate Manager でもドメイン認証のためにメールが発信されますが、宛先は以下のように固定されます。

1. `whois` で取得できる管理者メールアドレス
1. ドメインに次の接頭辞をつけた 5 個のメールアドレス: `admin@`, `administrator@`,`hostmaster@`, `webmaster@`, `postmaster@`

管理者情報を秘匿した場合は `whois` で取得できるメールアドレスがドメインレジストラのものになりますので、
(2)のアドレスのどれかを登録しておきます。

# SES で受信したメールに対するアクションについて

認証のための URL がわかれば十分であり、
Route 53 と Certificate Manager から送られる二通を読めればよいので、
今回は単純に S3 へ保存しました。

# SSL証明書を取得するリージョンについて

Certificate Manager で取得した SSL 証明書は、取得したリージョンでのみ利用することができます。
CloudFront はグローバルなサービスのため、Webコンソール上でリージョンを選択できませんが、
便宜的に `US East(N. Virginia)` で設定するという扱いのためSSL 証明書もここで取得します。

# 料金について

[ドメインの料金は AWS クレジットでは支払えない](http://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-transfer-to-route-53.html)ため、
クレジットが残っていても料金が発生することに注意が必要です。

# CloudFront が持つキャッシュについて

デフォルトのままの設定だと TTL が 86400 秒となるので、GitHub Pages にデプロイしてから
最大一日程度は古いコンテンツが表示されます。
デプロイの際にスクリプトからキャッシュ削除リクエストを発行するようにすれば良いと思います。
[実装はこちら。]({{< ref "tech/aws/delete-updated-file-cache-on-cloudfront.md" >}})

<!-- 詰まったところ -->
<!-- CloudFront に Alternate CNAME 設定し忘れ -->
<!-- http://blog.ybbo.net/2015/04/11/how-to-fix-error-of-error-the-request-could-not-be-satisfied-generated-by-cloudfront-cloudfront-on-aws-cloud-front/ -->
