+++
draft = false
title = "BitBucket Pipelines で Angular の Unit Tes tを動かす"
tags = ['JavaScript','angular','bitbucket']
date = "2017-10-28T15:01:39+09:00"
+++

[angular-seed](https://github.com/mgechev/angular-seed)では、
デフォルトで `Chrome` を使って Unit Test を動かすよう設定されていますが、
BitBucket Pipelines の環境には Chrome がインストールされていないので、
`PhantomJS` で実行するよう修正する必要があります。

本記事はそのためのメモです。

<!--more-->

`karma.conf.js` の `files` に以下を追加。これは `'node_modules/intl/dist/Intl.min.js'`よりもあとに追加する必要があります。

```
files: [
  ...
  // for UT on BitBucket, Intl の読み込みの下に書くこと
  'node_modules/intl/locale-data/jsonp/ja-JP.js',
```

BitBucket 上での実行時のみ `PhatomJS` を使うよう環境変数によって切り替えます。
( 参考：[BitBucket の Environment Variables](https://confluence.atlassian.com/bitbucket/environment-variables-794502608.html))

```
if (process.env.CI) {
  config.browsers = [ 'PhantomJS' ];
}
```
