+++
date = "2018-05-14T10:04:08+09:00"
draft = true
title = "Amazon Sumerian の Preview"
tags = ["aws"]
+++

[Amazon Sumerian](https://aws.amazon.com/jp/sumerian/)は
AR/VR もしくは WebGL といった3Dコンテンツの開発環境であり、コンテンツ配信サービスです。

VR コンテンツであれば WebVR として公開されるため、
Sumerian で開発・公開する → URL をブラウザで開く → Vive などの VR デバイスが起動し体験できる、という流れになります。

<!--more-->

# Sumerian のサンプル WebVR を体験する方法について

[Sumerian](https://aws.amazon.com/jp/sumerian/)の製品ページにあるサンプルシーンを Firefox で開きます。

最新版の Chrome でも WebVR の設定ができるようになったはずですが、2018-05-07時点の筆者の環境では動作しませんでした。
- 参考: [2018-04-23: 最新版Chrome、VR対応を大幅拡大 主要PC用ヘッドセットへ](https://www.moguravr.com/google-chrome-66-web-vr/)

# 料金体系について

Sumerian エディタは無料で利用できます。

Sumerian の課金モデルは、
3D モデルなどのデータサイズに応じたストレージ料金(`0.06 USD/GB`)と、
配信時のトラフィックに応じたデータ転送料金(`0.38 USD/GB`)です。
また、コンテンツ内でのガイド役などの目的で Polly(音声認識) と Lex(自然言語理解) を利用する場合には



[Sumerian の料金](https://aws.amazon.com/jp/sumerian/pricing/) 0.06 USD/GB

[S3の料金](https://aws.amazon.com/jp/s3/pricing/)は東京リージョン 0.025 USD/GB では

[CloudFrontの料金](https://aws.amazon.com/jp/cloudfront/pricing/) 0.140 USD/GB

# マネタイズをどうするか

ASIN B000SAGNT4 のようなモデルがある。
Amazon で販売している製品のモデルを Sumerian コンテンツに登場させ、
そこからAmazonへの導線を作るという広告プラットフォーム？

配信は CloudFront を利用するらしい
なので署名つきURLによるアクセスコントロールが可能

アプリ広告を出したりアプリ内課金を作るなら
スマホアプリ側のコードが必要？

動画配信プラットフォームとしての可能性
Oculus Go の

<!-- Unity との大きな違いは WebVR で公開できること -->

- ARKit、ARCore に両対応できる
- 動いているシェーダをウェブで公開できる
