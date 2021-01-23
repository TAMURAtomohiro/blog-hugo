+++
draft = false
title = "Hugo でマテリアルアイコンを使うための ShortCode"
date = "2017-03-08T08:52:50+09:00"
tags = ["hugo"]
+++

[Hugo](https://gohugo.io/) で任意の HTML を生成したい場合は [ShortCode](https://gohugo.io/extras/shortcodes/) を書くことになります。

本サイトでは使い道はさておきマテリアルアイコンを読み込んでいるので、
ShortCode で使えるようにしてみました。
<!--more-->
# Hugo からマテリアルアイコンを使う手順

まず `themes/${テーマ名}/layouts/partials/header.html` などに以下を追記してマテリアルアイコンのフォントを読み込みます。

```
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

`layouts/shortcodes/md-icon.html` として以下の内容を用意し、ShortCode として使えるようにします。

{{< gist tmrtmhr 90cff33e3e18fbc10f8daf9dac753b30 >}}

ここで、`vertical-align: bottom;` はアイコンと文章の高さをそろえるための指定です。
また、`.Get 0` で ShortCode の引数を取得しています。

Markdown ファイル中では以下のように書きます。これにより `favorite` が `.Get 0` の部分に埋め込まれた HTML を生成します。

{{&lt; md-icon favorite &gt;}}

{{< md-icon favorite >}}{{< md-icon favorite >}}{{< md-icon favorite >}}
表示はこんな感じです
{{< md-icon favorite >}}{{< md-icon favorite >}}{{< md-icon favorite >}}

# なぜ Raw HTML ではなく ShortCode を書くのか

Markdown は [HTMLを埋め込める](http://daringfireball.net/projects/markdown/syntax#html)ため、
アイコン表示の HTML (前述の Gist)を直接書いても表示されます。

ではなぜ ShortCode として用意するのかというと、
[公式サイトの説明](https://gohugo.io/extras/shortcodes/)にある通り、
以下のような利点があるためです。

* 定型のHTMLを毎回書かずにすむ
* ShortCode を変更することで該当の HTML 部分がすべて置き換わるので更新が楽にすむ

そんなわけで、一生に一度の HTML だと心に決めている、というのでなければ、
ShortCode 化して再利用するほうが良いかと思います。
