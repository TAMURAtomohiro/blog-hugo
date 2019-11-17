+++
date = "2019-11-17T19:23:56+09:00"
draft = false
title = "GCP認定資格 Associate Cloud Engineer と Professional Cloud Architect を取得した感想"
tags = ["gcp"]
+++

2019年7月、平年よりも長く続く梅雨の最中、
[GCP 認定](https://cloud.google.com/certification/)のひとつである
Professional Cloud Architect を受験し、
合格したので顛末を残しておこうと思います。
有効期限が来たら再度試験を受けることになるため自分用のメモでもあります。
Associate Cloud Engineer のほうは先んじて 2019 年 5 月に取得しております。

[試験利用規約](https://cloud.google.com/certification/terms?hl=ja)上、
試験内容については開示できないので、以下のようなことを書きます。

- 準備として何をやったか
- 試験会場の雰囲気
- 知識がない問題に当たったとき考えたこと
- 感想

<!--more-->

# 試験準備

前提として、
AWS 認定資格の「ソリューションアーキテクト – プロフェッショナル」を2017年に取得してありました。
なのでクラウドサービスを使う際の勘所と言いますか、
「Webサービスの可用性を上げるには？」とか
「会社でクラウドを利用するとして、権限の与え方はどうするの？」
みたいな、どういうことが問題として出るかということについて知見はありました。

Google Cloud Next も参加して色々聞いてました。
ただ、GCP そのものはほとんど触らないままでした。

## Coursera

[Google Cloud Platform Fundamentals for AWS Professionals](https://ja.coursera.org/learn/gcp-fundamentals-aws)
と
[Architecting with Google Cloud Platform 日本語版](https://ja.coursera.org/specializations/gcp-architecture-jp)
を受講しました。

Architecting with Google Cloud Platform 日本語版 のほうは中に6コースあります。
この講座は月額課金なので集中して学習できるなら費用も抑えられます。
内容としては短かめの動画がたくさんあり、各テーマの終わりに数問の問題を解き、
Qwiklabs というサービスによる GCP を実際に使う演習をやってみる、という感じです。
大事な点を網羅的に学べますし、動画を見るだけなら電車移動中などでも可能なので、
通勤の時間を利用していました。

認定取得後に知ったことですが、[Preparing for the Google Cloud Professional Cloud Architect Exam](https://ja.coursera.org/learn/preparing-cloud-professional-cloud-architect-exam)という
認定試験にフォーカスした講義もあったので、こちらをやってみるのがよいと思います。

## ケーススタディ

[試験ガイド](https://cloud.google.com/certification/guides/professional-cloud-architect/?hl=ja)にある
ケーススタディのサンプルについて検討しました。

- [Dress4Win](https://cloud.google.com/certification/guides/cloud-architect/casestudy-dress4win-rev2?hl=ja)
- [TerramEarth](https://cloud.google.com/certification/guides/cloud-architect/casestudy-terramearth-rev2?hl=ja)
- [MountkirkGames](https://cloud.google.com/certification/guides/cloud-architect/casestudy-mountkirkgames-rev2?hl=ja)

Cloud Architect は、まだクラウドを活用していないお客様に対して
「こうすればクラウドに移行できて、今抱えている問題を解決できますよ」
という提案を求められる立場なんじゃないかと思います。

なので上にあるような、現実にありそうなケースに対してクラウドの活用方法を考えるというのは重要です。

聞いた話では[Preparing for the Google Cloud Professional Cloud Architect Exam](https://ja.coursera.org/learn/preparing-cloud-professional-cloud-architect-exam)で
ケーススタディに対するサンプル構成を教えてくれるそうです。

## 模擬試験

AWS の模擬試験と違って GCP の模擬試験は何度でも受けられます。
問題が変わらないので何度も受けて正解を把握できたりもしますが、
せっかくなので各問題について正解とその理由を答えられるようにしておきました。

# 試験当日

## 会場の雰囲気と試験の進め方

試験センターにて身分証と試験番号を提示し、
スマートフォンやカバンはロッカーにしまい、
身分証と受験票のみを持って試験の部屋に入ります。

受験者ごとの個室ではないので、音が気になる方は耳栓代わりのヘッドホンなどを借りることもできます。

試験はウェブ画面に表示される問題文を読み、選択肢の中から正解だと思うものをチェックして次の問題に進む、という流れです。
前の問題に戻る、あるいは問題番号一覧画面へ移る、といったことが可能です。
各問題ではあとで見直すためにマークでき、
問題番号一覧画面でマークした問題を選んで再度回答し直せます。
また、画面には残り時間が表示されカウントダウンされています。

自分は、判断に迷う問題が出たときにはとりあえずマークの上で暫定的に選択肢をチェックして次に進みました。
時間が足りずに後半の問題を解ききれない...というのを避けるためです。

問題すべてに回答し終わってみると半分近くマークしてしまってましたが、
時間もかなり余っていたので、いったん御手洗に行った上で一通り再考しました。

## 知識が足りない問題に当たって考えたこと

自分がマークした問題は、知識があいまいだったり、あるいはまったく無かったりで即断できないものでした。
こういった問題に対してどうしたかというと、GCP の試験に限った話ではないですが、**「消去法で解く」**というアプローチを取りました。

**「問題文の要件を満たさない選択肢を消す」**という形です。
たとえば「新規インスタンスを作らずに実現したい」と問題文にあったとして、
選択肢で「新規インスタンスを作る」となっているものがあったりしたと思います。
(実際に出た問題の内容は、時間が経ったこともありすべて忘れたので、自分が適当に作った例です)

このように問題文と矛盾しているので消去したものもありましたし、
自分が持っている拙い知識からの推測で「これは違うんじゃ...」と消したものもありました。

というわけで、判断に迷う場合でも、自分なりのロジックで正解であろう選択肢を選びました。

# 感想

## 難易度

試験時間や問題数が少なかったこともあり、
AWS の試験よりはやさしかった、という印象です。
まあロードバランサーの後ろにインスタンスを並べて冗長化する...などはクラウドプラットフォームによって違いが出る部分ではないので、
そのあたりの知識が流用できて楽だったというのはあります。

## Associate Cloud Engineer と Professional Cloud Architect の違い

なんとなく Associate Cloud Engineer から取得しましたが、
Professional Cloud Architect の下位資格かというとそうでもないので、
いきなり Professional Cloud Architect でも良かったか、と思いました。

というのも Associate Cloud Engineer のほうはかなり実務的な知識、
たとえば発行するコマンドとして正しいのはどれか？みたいなことまで訊かれます。
一方で Professional Cloud Architect はどういう構成がよいか？
という問題になるので、既にクラウドプラットフォームでの構成に慣れ親しんでいるのであれば、
いきなり Professional Cloud Architect の取得でも良いかと思います。

## もっとやっておけば良かったと思うこと

効果があるのは公式ドキュメントの読み込みだと思います。
自信を持って回答できなかった問題について、
あとから調べてみるとドキュメントに書いてあったり...というのは往々にしてあります。

ただ、試験対策として網羅的にドキュメントを読めるかというと、個人的には難しい、という印象です。
あてもなくドキュメントを読んでいくだけでポイントを覚えていく、というのが自分はどうにも苦手です。

業務で必要になってドキュメントを当たったことで知識として身について...というのが理想ですが、
業務だけで試験範囲すべてをカバーするような経験ができるかというとそれも違うでしょう。

必要なことはすべてドキュメントに書いてありますが、
試験対策としてまとめられているわけではないので、
現実的には Coursera の講義や、どこかしらの企業が提供しているトレーニングがよろしいかと思います。
