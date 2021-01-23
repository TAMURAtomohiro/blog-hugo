+++
draft = false
title = "AWS Lambda (Node.js v6.10) から DynamoDB に入れた Gzip バイナリデータを展開する"
tags = ['aws', 'node.js']
date = "2017-04-11T21:37:09+09:00"
+++

AWS DynamoDB では指定した IO 性能に応じて料金が発生するため、
クエリなどで使用しないプロパティについては gzip 圧縮などを施してバイナリデータとして格納したほうが、
必要な IO 性能が少なくなるためお得です(参考：[大量の属性値を圧縮する](http://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/GuidelinesForItems.html#GuidelinesForItems.CompressingLargeAttributeValues))。

本記事は、AWS Lambda (Node.js 6.10) から DynamoDB のデータを取得し、
展開する処理のメモです。

<!--more-->

DynamoDB に以下のような形式でデータが入っているとします。

```
{ "hash_id": "string",
  "body": JSON データ文字列を gzip 圧縮したバイナリ }
```

ここでは `hash_id` を partition key として指定しています。
なので以下のように `hash_id` を指定して GET するとデータが取得できます。

```
var dynamodb = new AWS.DynamoDB.DocumentClient();
var params = { TableName: 'dynamedb_table_name', Key: { 'hash_id': 'xxx' } };
dynamodb.get(params, function(err, data) { ... }
```

JSON 形式ではバイナリデータを扱えないので、Base64 形式に直してやりとりします。
しかし、受信した段階で `data.Item.body` は `Buffer` データとなっているようです。
(参考：[AWS SDK for Javascript のドキュメント](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property))

<!--
そのため、DynamoDB からのレスポンスである `data.Item.body` は「Base64 エンコードされたバイナリデータのバイト列(`Buffer`)」という状態です。

なのでこれをデコードしたバイト列を作り、

```
var binary = Buffer.from(data.Item.body.toString(), 'base64');
```
-->

なのでこれを展開します。

```
var body = zlib.gunzipSync(data.Item.body);
```

これも `Buffer` なので、文字列に変換して parse することでようやく元の JSON データとなります。

```
JSON.parse(body.toString())
```

最後に以上の処理を行う AWS Lambda のサンプルを置いておきます。
{{< gist tmrtmhr 3b8b9630ad01a5768c4a8b93ae6a814c >}}
