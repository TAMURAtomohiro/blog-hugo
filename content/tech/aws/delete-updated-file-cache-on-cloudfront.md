+++
date = "2017-03-08T17:40:24+09:00"
draft = true
title = "git diff を利用して更新のあったファイルのみ CloudFront のキャッシュを削除する"
tags = ["hugo", "aws"]
+++
本サイトは Hugo で生成したものを GitHub Pages に push して公開し、
CloudFront を利用して配信しています。
CloudFront はキャッシュサーバとして働くので、
何もしなければ TTL が切れるまでは古いコンテンツが表示されます。

単純にキャッシュ全削除という手もありますが、
せっかくなので更新のあったファイルのみキャッシュを削除してみました。
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

```
# subtree として管理している場合
git diff --diff-filter=d --name-only HEAD^ HEAD public
```

# AWS CLI を使用した CloudFront のキャッシュ削除


```
aws cloudfront create-invalidation --distribution-id "ET2NM45TDGVIY" \
  --paths
```
