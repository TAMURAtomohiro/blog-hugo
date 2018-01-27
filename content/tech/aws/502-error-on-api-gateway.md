+++
draft = false
title = "API Gateway で 502 Internal Server Error が出たときにすること"
tags = ["aws"]
date = "2018-01-27T16:54:01+09:00"
+++

API Gateway にカスタムオーサライザを設定して新しいステージ作って……
とやっていたときに "502 Internal Server Error" が出ました。

こんな時はとりあえずログを見ましょう。

1. ステージ選択 > ログ のタブから Cloud Watch ログを有効にして実行ログを出力
1. Cloud Watch のログから "API-Gateway-Execution-Logs_xxx" という名前のものを見る

自分のケースでは、呼ぶ Lambda をステージ変数によって切り替えていましたが、
新しいステージではこの変数が未設定だったことによりエラーとなっていました。

まあこういうミスが起こりうるので諸々の作業はなるべく自動化しましょうという戒めとして
ここにメモしておきます。

<!--more-->
