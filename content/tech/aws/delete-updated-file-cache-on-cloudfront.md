+++
draft = false
title = "git diff を利用して更新のあったファイルのみ CloudFront のキャッシュを削除する"
tags = ["hugo", "aws"]
date = "2017-03-14T17:15:21+09:00"
+++
本サイトは Hugo で生成したものを GitHub Pages に push して公開し、
CloudFront を利用して配信しています。
CloudFront はキャッシュサーバとして働くので、
何もしなければ TTL が切れるまでは古いコンテンツが表示されます。

単純にキャッシュ全削除という手もありますが、
せっかくなので更新のあったファイルのみキャッシュを削除してみました。

やっていることは以下のような感じです。

* `git diff` で更新のあったファイル一覧を取得
* 一覧を加工して AWS CLI 用の JSON ファイルを生成
* AWS CLI の `aws cloudfront create-invalidation` でキャッシュ削除

<!--more-->

# 前提：ブログデータを管理するリポジトリの構成

本サイトの構成では以下の二種類のリポジトリが登場します。

* Markdown などを管理するリポジトリ(`blog-hugo`)
* 生成したHTMLを GitHub Pages で公開するリポジトリ(`tmrtmhr.github.io`)

`blog-hugo/public` に `tmrtmhr.github.io` を `subtree` として取り込んでいます。

この構成は、昔[「Hugo チュートリアル：GitHub Pages で個人ページを公開する」](http://gohugo.io/tutorials/github-pages-blog/#hosting-personal-organization-pages)
を参考にして言われるがままに構成したのですが、
現在は `submodule` として取り込んで、`public` 以下のみ `push` するようになっており、
Markdown のほうの管理には言及がなくなったようです。

# 更新のあったファイル一覧の取得

Hugo で生成した HTML ファイル群は `public` ディレクトリ以下に出来上がりますが、
全記事を再生成するのでタイムスタンプがほぼ同じとなります。
なので、`find public -mmin -5`のようにして5分以内に更新のあったファイルを探して……というアプローチではうまくいきません。

というわけで `git diff` を使います。
`--diff-filter=M` で更新のあったファイルのみの抽出、`--name-only`でパスのみの表示、`HEAD^ HEAD` で一つ前と最新との比較、`public` で対象のディレクトリを指定します。

```
git diff --diff-filter=M --name-only HEAD^ HEAD public
```

参考：[gitで差分ファイルを抽出する](http://qiita.com/kaminaly/items/28f9cb4e680deb700833)、[git diff のオプション](https://git-scm.com/docs/git-diff)

# ファイル一覧を JSON ファイルへ加工

AWS CLI で CloudFront にキャッシュ削除したいファイルパスを送る際、
コマンド引数として `--paths` も利用できますが、
ファイル数が増えてくると[コマンド引数の長さ制限](https://www.ecoop.net/memo/archives/2010-01-26-1.html)に引っかかりそうなので、
JSON を構築することにします。

AWS CLI から CloudFront にキャッシュ削除リクエストを投げるための雛形JSONが以下のコマンドで得られます。

```
aws cloudfront create-invalidation --generate-cli-skeleton
```

注： AWS CLI のバージョン `aws-cli/1.11.58` においても `cloudfront` コマンドはプレビュー版なので
`aws configure set preview.cloudfront true` とコマンドを打って設定ファイルを書き換えてください。

```
{
    "DistributionId": "",
    "InvalidationBatch": {
        "Paths": {
            "Quantity": 0,
            "Items": [
                ""
            ]
        },
        "CallerReference": ""
    }
}
```

* `DistributionId`: 対象とする CloudFront ディストリビューションID
* `Items`: ファイルパスのリスト
* `Quantity`: ファイルパスの数
* `CallerReference`: こちらで自由に指定するリクエストのID

`CallerReference` は、[AWS CLI のリファレンス](http://docs.aws.amazon.com/cli/latest/reference/cloudfront/create-invalidation.html)によると
「間違って同じリクエストが重複しないよう」に使われます。
まったく同じリクエストを投げた場合は新しい Invalidation Batch は作られず、
`CallerReference`が重複していて `Items` の内容が異なるような場合は `InvalidationBatchAlreadyExists` となるようです。
とりあえず時刻に基いて生成すれば良いかと思います。

この雛形JSONに対しコマンド出力をはめこんでリクエストを作ります。
[この加工のためのスクリプト]({{< ref "tech/replace-a-part-of-json-with-command-output.md" >}})は別記事にしていますので
詳細についてはそちらをご参照ください。

こういったスクリプトがあると、以下のようにして、雛形となるJSONにコマンドの出力を当てはめていって最終的なリクエストJSONを得られます。
(`DistributionId` についてはあらかじめ JSON に書いてあります)

```
cat json/cloudfront-invalidation.json |
  filljson int InvalidationBatch.Paths.Quantity <(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | wc -l) |
  filljson [string] InvalidationBatch.Paths.Items <(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | sed -e 's/^public//g') |
  filljson string InvalidationBatch.CallerReference <(date +"tmrtmhr-%Y/%m/%d-%H:%k:%m" | tr -d '\n') |
  jq . > request.json
```

# AWS CLI を使用した CloudFront のキャッシュ削除

前項でリクエストJSONを生成したので、それを投げます。
使用する profile については適宜指定してください。

```
aws cloudfront create-invalidation --cli-input-json file://request.json
```

# Invalidation の注意点

月間 1000 ファイルパスまでは無料、以降は $0.005 / 1パスとなるようなので、
更新が頻繁にある・更新ファイル数が多いなどで Invaliation を乱発するケースでは追加で料金が発生します。

参考：[CLOUD FRONT の INVALIDATION が有料だなんて知らんかった](http://dev.sukimash.com/aws/cloud-front-invalidation/)、[CloudFront: 料金](https://aws.amazon.com/jp/cloudfront/pricing/)

# まとめ

`git diff` の結果から CloudFront のキャッシュ削除を行う例を示しました。
リクエストのための JSON 生成については[補助スクリプト]({{< ref "tech/replace-a-part-of-json-with-command-output.md" >}})を作って公開しています。
