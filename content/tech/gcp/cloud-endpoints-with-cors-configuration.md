+++
date = "2020-03-05T01:02:10+09:00"
draft = true
title = "Google Cloud Endpoints で CORS 対応をするのに苦労した"
tags = ['gcp']
+++

注：Cloud Endpoints で使用する ESP というコンテナがベータ版であるため、本記事の内容は一時的なワークアラウンドです。

GCP上に構築したAPIに対し、APIキーでの認証機能を追加したかったので、
Apigee と Cloud Endpoints を使ってみました。

今回の感想としては、以下のような理由で Cloud Endpoints を使うことにしました。

* 支払いが GCP だけで完結する
* APIキーの発行を GCP コンソールから行え、APIキーごとのリファラ制限・IP制限が行える

<!--more-->

#
