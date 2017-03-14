+++
draft = false
title = "GO言語で雛形JSONの内容をコマンド出力の内容で置換する"
tags = ['aws',"go","node.js","shell script"]
date = "2017-03-14T18:04:09+09:00"
+++

AWS CLI によりコマンドラインから制御したりする際、リクエストパラメータとして JSON ファイルが必要になることがあります。
[CloudFront のキャッシュを削除したいとき]({{< ref "tech/aws/delete-updated-file-cache-on-cloudfront.md">}})なんかがそうです。

AWS CLI のコマンドごとに、リクエストJSONを生成する専用スクリプトを書くという手もありますが、
シェル上でパイプやらリダイレクトやらを駆使していい感じに JSON を生成できるある程度汎用的なスクリプトにならんものか、
という思いから試してみた結果をここに記します。
どこかに既にあるものでしたらすみません。

コマンド引数は以下のようになっていて、JSON ファイルは標準入力から与えます。

```
filljson ${入力の型} ${キーパス} ${入力ファイル名}
```

標準入出力で JSON をやりとりするので以下のようにパイプでつなげることで
中間ファイルを作ることなく最終的なリクエスト JSON が得られます。
入力ファイル名のところには `bash` や `zsh` のプロセス置換機能を利用しています。
プロセス置換機能を使うとプログラム側からは単にファイルパスが渡ってくるように見えるので、
ファイルIOとして処理すればOKです。

```
cat json/cloudfront-invalidation.json |
  filljson int InvalidationBatch.Paths.Quantity <(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | wc -l) |
  filljson [string] InvalidationBatch.Paths.Items <(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | sed -e 's/^public//g') |
  filljson string InvalidationBatch.CallerReference <(date +"osone3-%Y/%m/%d-%H:%k:%m" | tr -d '\n') |
  jq . > request.json
```
<!--more-->

# プログラムの内容

[コードはここ](https://github.com/tmrtmhr/filljson)で、
Go 言語で書いたので `go get github.com/tmrtmhr/filljson` でコマンドをインストールできます。
リポジトリの `js/filljson.js` に node.js で実装したものもあります。

エラーチェックをしていないので、利用する際は十分注意してください。
今のところテストコードも書いてないです。

入力としては配列を想定しておらず、オブジェクトのみなので `map[string]interface{}` 型を `json.Unmarshal` に渡します。
エラーは捨てているので配列が来たら死にます。

```go
var jsonData map[string]interface{}
_ = json.Unmarshal(jsonStr, &jsonData)
```

取り出した値が `interface{}` となっているので再度 `map[string]interface{}`として型アサーションをつけます。
```go
finger = finger[propName].(map[string]interface{})
```

参考：[golang は ゆるふわに JSON を扱えまぁす!](https://www.kaoriya.net/blog/2016/06/25/)

# 雑感

標準入出力は偉大です。

GO言語的には特化した(たとえばCloudFront専用のJSON生成専用)コマンドを作ってきっちり型検査したほうが良さそうですが、
まあこういう書き方もできるということで御参考いただければ幸いです。
