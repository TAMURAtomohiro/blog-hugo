+++
date = "2019-12-25T03:09:34+09:00"
draft = true
title = "Amazon Athena のクエリ結果CSVをストリーム処理で変換する"
tags = ['aws','go']
+++

Amazon Athena は S3 上に配置した CSV ファイルなどに対しSQLによるクエリが実行できるというサービスです。
たとえば CloudFront のアクセスログは S3 に保存しますが、
このログに対しステータスコードの割合や、アクセス数の集計などが行えます。

Athena の結果もまた CSV として S3 に保存されます。
[組込み関数](https://docs.aws.amazon.com/athena/latest/ug/presto-functions.html)も使えますし、
最近では[Amazon Athena がユーザー定義関数 (UDF) のサポートを追加](https://aws.amazon.com/jp/about-aws/whats-new/2019/11/amazon-athena-adds-support-for-user-defined-functions-udf/)した
ということで、
Athena を大規模データの変換処理に使うことも(変換処理の内容によっては)可能です。

ところが Athena のクエリ結果CSVを再度 Athena で利用しようと思うと少し難があります。
すべてのカラムがダブルクォートで囲まれており、
このCSVを Athena で読み込もうと思うと、
**すべてのカラムを文字列として扱うことになる**からです。

クエリ中で明示的に数値への変換などを書きつつ集計処理を書く、ということもできそうですが、
素直にクエリを書けないので面倒です。

また、Athena を変換処理として使う場合、集計とは違って結果CSVのサイズが大きくなりがちなことも嫌なところです。
Athena の料金体系がクエリで読み込んだバイト数に応じるので、圧縮はしておきたいです。

(ヘッダ行が出力されることも面倒なところではありますが、Athena 側の設定で対応可能です。参考： [Amazon Athenaがヘッダ行のスキップをサポートしました！](https://dev.classmethod.jp/cloud/aws/amazon-athena-support-for-skip-header-line-count-property/))

そこで本記事では、
S3上のファイルを取得し、ダウンロード完了を待たずに届いたデータを順次変換・圧縮してアップロードする、
というコマンドを Go 言語で実装してみます。

なお、作ってから気付いたことですが、
AWS CLI の s3 コマンドでも標準入出力を使った上でパイプでやりとりすれば似たようなことが実現できます。

```
aws s3 cp s3://bucket/target-file - | \
  sed 's/"//g' | \
  gzip -dc - | \
  aws s3 cp - s3://bucket/target-file
```

<!--more-->
