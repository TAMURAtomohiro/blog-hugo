+++
date = "2017-03-01T18:23:51+09:00"
draft = true
title = "なぜドメイン登録に AWS Route53 を選んだか"
+++

本サイトのドメインは AWS Route53 で管理しています。
ドメインの料金だけだと[お名前.com](www.onamae.com)などのように Route53 より安いところもありますが、


AWS Certificate Manager で SSL 証明書を

SSL証明書の料金も

詰まったところ
CloudFront に Alternate CNAME 設定し忘れ
http://blog.ybbo.net/2015/04/11/how-to-fix-error-of-error-the-request-could-not-be-satisfied-generated-by-cloudfront-cloudfront-on-aws-cloud-front/
