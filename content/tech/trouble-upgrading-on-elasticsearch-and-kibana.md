+++
draft = false
title = "docker-compose 環境の ElasticSearch + Kibana を 5.3.0 から 5.5.2 にしたときつまづいたところ"
tags = ["docker"]
date = "2017-08-28T17:17:00+09:00"
+++

しばらくぶりに ElasticSearch を触ることになったため、以前 Docker コンテナで作ってあった環境を見直してみました。
すると ElasticSearch + Kibana の新バージョンとして 5.5.2 が出ていたので、
せっかくなので更新するかとバージョンを上げてみたところ素直に動作しませんでした。

結論から言えば ElasticSearch + Kibana に起因するものではなく、
`docker-compose.yml` のコンテナ間ネットワークの設定を間違えたことが原因です。

結論としては以下のような感じです。

* 5.3.0 の頃にあった `links` によるコンテナ間接続は不要
* `networks` 指定により ElasticSearch と Kibana コンテナを同一ネットワークに置く

公式ドキュメント([Install Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/docker.html))を見て
ElasticSearch の設定だけを修正しても動かないので注意してください。

最終的な `docker-compose.yml` については [docker-compose で Kibana 5.x を使う](http://christina04.hatenablog.com/entry/2017/04/12/013556) を参考にしました。

<!--more-->

5.3.0 の頃に使用していた `docker-compose.yml` では kibana コンテナに以下のように設定していました。

```
services:
  kibana:
    links:
      - elasticsearch
```

で、今回 5.5.2 に切り替えるにあたり、[Install Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/docker.html)
を参考にして「**ElasticSearch コンテナ**」の設定に以下のような記述を加えました。
また、トップレベルにネットワーク設定を(よく理解しないまま)追加しました。
(厳密に言うと他の設定も色々変わっていますが、今回のトラブルとは無関係なので割愛します。)

```
services:
  elasticsearch:
    networks:
      - esnet

networks:
  esnet:
```

それで `docker-compose up` してみると起動しません。
症状としては以下のようなログが出ており、どうも kibana から elasticsearch への接続ができていないようでした。

```
kibana_1         | {"type":"log","@timestamp":"2017-08-28T06:45:01Z","tags":["warning","elasticsearch","admin"],"pid":7,"message":"Unable to revive connection: http://elasticsearch:9200/"}
```

kibana コンテナの `/etc/hosts` や環境変数を確認すると `elasticsearch` の登録がありません。
自分の理解は `links` に指定した内容がこのあたりに書き込まれることでコンテナ間のエイリアスによるアクセスができる、
というところで止まっていたので、はて……？と混乱しました。

で、そもそも `networks` って何ぞや、と [Docker コンテナ・ネットワークの理解](http://docs.docker.jp/engine/userguide/networking/dockernetworks.html) を見て気づきました。
上記の設定では ElasticSearch コンテナと Kibana コンテナが違うネットワークにいるため `elasticsearch` というドメイン名ではアクセスできないというわけです。

正しい設定は以下のどちらかです。

* ElasticSearch と Kibana コンテナの両方で `networks` を指定する
* ElasticSearch と Kibana コンテナの両方で `networks` を指定せず、Kibana コンテナに `links` を設定する

ただし、`links`は廃止予定のようなので、`networks`を指定するのが良いでしょう。

じゃあユーザ定義ネットワークの外部からアクセスするにはどう設定するのかというところは未調査です。すみません。

## 参考

* [docker-compose で Kibana 5.x を使う](http://christina04.hatenablog.com/entry/2017/04/12/013556)
* [Docker コンテナ・ネットワークの理解](http://docs.docker.jp/engine/userguide/networking/dockernetworks.html)
