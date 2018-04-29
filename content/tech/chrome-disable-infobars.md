+++
draft = false
title = "Protractor での E2E テスト時に Google Chrome の通知バーを消す"
tags = ["node.js", "angular"]
date = "2017-04-06T19:44:06+09:00"
+++

# 結論

- Google Chrome の起動オプションに `--disable-infobars` を渡す

<!--more-->

# 経緯

バージョン 57.0.2987.133(64-bit) あたりの Google Chrome と
Selenium Chrome driver 2.28 でE2Eテストを実行すると
"Chrome is being controlled by automated test software" とか
"Chrome は自動テスト ソフトウェアによって制御されています" とかいう黄色い通知バーが出てくるようになりました。

まあ画面キャプチャには入らないですし、出てくること自体はいいんですけれども、
そのせいで失敗する E2E テストが出てきて、おいおい誰だよこんなコード書いたの、やろう、ぶっころしてやる、
と込み上げてくる怒りを糧に調べた解決法をこの記事へ記す次第です。

結局 Google Chrome の起動オプションに `--disable-infobars` を渡して表示しないようにしました。

protorator を使用する場合は設定ファイルに以下のような内容があれば OK です。

```
capabilities: [
  chromeOptions: {
    args: ['disable-infobars'],
  },
]
```

# Mac で Google Chrome に"自動テストが云々"の通知バーを出す方法

ターミナルで以下のように打つと起動している Chrome すべてに通知バーが出てきて嫌な気持ちになります。

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-automation
```

# 通知バーが出ているときの window の高さ

以下のコードで高さを見てみると、通知バーの有無で 40px 違っていました。

```
angular.element(window).height()
```

# E2E テスト失敗の原因

- E2Eテストのコードがウィンドウの高さに強く依存していた(スクロール量がピクセル値でハードコーディングされている、など)

参考：

- [Chrome driver 2.28 “Chrome is being controlled by automated test software” notification .Can it be removed?](http://sqa.stackexchange.com/questions/26051/chrome-driver-2-28-chrome-is-being-controlled-by-automated-test-software-notif)
