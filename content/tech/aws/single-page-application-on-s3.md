+++
draft = false
title = "SPA(シングルページアプリケーション)をS3で動かす"
tags = ["aws","angular"]
date = "2017-11-09T10:07:21+09:00"
+++

静的コンテンツについては S3 だけでサーブできます。
ですので、たとえば[Angular](https://angular.io/)で作成したフロントエンドのコードは S3 に置けばいいよ、という話になります。

しかし Single Page Application の場合、表示内容とともに URL を書き換えます。
なので `https://example.com/blog` のような URL でページが表示されていたとしても、
対応するファイルがないためブラウザリロードすると `404` エラーになってしまいます。
認証が必要で、別ページに callback URL を持って遷移して認証後に戻ってくる、みたいなケースでもこのことが問題になります。

調べてみると以下のやり方が良いようです。

* CloudFront のカスタムエラーレスポンスで、S3 の `404` エラーに対し `/index.html` へ転送するよう設定する

英語ですが、以下のブログにスクリーンショット付きで手順が載っていました。

* 参考：[Hosting a Single-Page App on S3, with proper URLs](https://keita.blog/2015/11/24/hosting-a-single-page-app-on-s3-with-proper-urls/)

<!--more-->

# S3 に存在しないファイルをリクエストした際 Access Denied (403) エラーになる場合

バケットポリシーのミスでした。`GetObject` だけでなく `ListBucket` の権限が必要です。

* バケットポリシーのサンプル

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity XXX"
      },
      "Resource": "arn:aws:s3:::your.domain"
    },
    {
      "Sid": "S3GetObject",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity XXX"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your.domain/*"
    }
  ]
}
```
