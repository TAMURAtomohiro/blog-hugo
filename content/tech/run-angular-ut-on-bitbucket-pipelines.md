+++
draft = false
title = "BitBucket Pipelines で Angular の Unit Test を動かす"
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

# その他つまづいたところ

## Rx.js のビルドエラー

```
Error on fetch for rxjs/operators at file:///opt/atlassian/pipelines/agent/build/frontend/node_modules/rxjs/operators.js`
```

参考：[angular-seed の Issue #2105](https://github.com/mgechev/angular-seed/issues/2105)

`package.json` の `rxjs` を `^5.4.3` から `5.4.3` に修正。

## `tools/utils/seed/clean.ts` で型エラー

以下のようなエラーが出て TypeScript のコンパイルに失敗するケース。

```
TSError: ⨯ Unable to compile TypeScript
tools/utils/seed/clean.ts (24,32): Property 'bgRed' does not exist on type 'typeof "/opt/atlassian/pipelines/agent/build/frontend/node_modules/@types/gulp-util/node_modules/...'. (2339)
tools/utils/seed/clean.ts (31,47): Property 'yellow' does not exist on type 'typeof "/opt/atlassian/pipelines/agent/build/frontend/node_modules/@types/gulp-util/node_modules/...'. (2339)
tools/utils/seed/clean.ts (39,40): Property 'red' does not exist on type 'typeof "/opt/atlassian/pipelines/agent/build/frontend/node_modules/@types/gulp-util/node_modules/...'. (2339)
```

[DefinitelyTyped の issue #21004](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21004)を見ると
`chalk@2.2.0`から自前で型定義ファイルを提供するようになり、DefinitelyTyped で提供していたものと不整合が……という話のようでした。
取り急ぎ `clean.ts` で `bgRed` などを使わないよう修正して対処しました。
