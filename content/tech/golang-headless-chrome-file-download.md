+++
date = "2019-04-08T16:12:36+09:00"
draft = false
title = "Go言語から Headless Chrome を制御してファイルをダウンロードする"
tags = ['go']
+++

世の中にはオープンなデータ(たとえば[国土数値情報ダウンロードサービス](http://nlftp.mlit.go.jp/ksj/index.html)など、公的機関が公開しているデータ)が色々あるもので、
せっかくだからダウンロードして活用を考えてみようとするのですが、
コマンドラインから `curl` や `wget` で直接取得できるようになっていない場合もあります。

Google Chrome には[ヘッドレスモード](https://developers.google.com/web/updates/2017/04/headless-chrome?hl=ja)があり、
ウェブページの操作自動化に利用できます。
実際にブラウザで表示したときと同様に JavaScript を実行してくれるため、
ボタンをクリックしたときに JavaScript の関数が実行されてファイルのダウンロードが始まる、
といったページにも対応できます。

しかしながらセキュリティ上の理由で、
デフォルトではヘッドレスモードにおいてファイルをダウンロードできるようになっていません。

本記事では Go 言語のライブラリ[Agouti](https://github.com/sclevine/agouti/)を使ったときに
ファイルダウンロードを許可するためのコードについて述べます。

<!--more-->

# デフォルトでファイルのダウンロードができない理由

[Issue 696481: Headless mode doesn't save file downloads](https://bugs.chromium.org/p/chromium/issues/detail?id=696481)

のコメント1がその理由かと思いますが、

> We most likely want to this to be something you need to either control or enable via DevTools to avoid letting random websites drop files on your disk just because you're running in headless mode.

ダウンロードの確認プロンプトなしにファイルをダウンロードできるようになっていると、
悪意のあるページを開いた際、無限にファイルをダウンロードさせられる、
といったことが考えられるため、
デフォルトでは無効にしておき、明示的に有効化するようにしましょう、ということのようです(意訳)。

# Go言語で Chrome ヘッドレスモードのファイルダウンロードを許可する方法

まず、ページを開くまでのコードが以下のような形です。
(エラーハンドリングについては適当です)

```
	driver := agouti.ChromeDriver(
		agouti.ChromeOptions("prefs", map[string]interface{}{
			//	"download.default_directory":         "/tmp", // send_command の downloadPath で指定するため、ここは不要
			"download.prompt_for_download":       false,
			"download.directory_upgrade":         true,
			"plugins.plugins_disabled":           "Chrome PDF Viewer",
			"plugins.always_open_pdf_externally": true,
		}),
		agouti.ChromeOptions("args", []string{
			"--headless",
		}),
		agouti.Debug,
	)

	err := driver.Start()
	if err != nil {
		log.Printf("Failed to start driver: %v", err)
	}

	page, err := driver.NewPage(agouti.Browser("chrome"))
	if err != nil {
		log.Printf("Failed to open page: %v", err)
	}
```

開いたページから、セッションを取得し、
ダウンロードを許可するためのコマンドを送信します。

```
	var result interface{}
	params := map[string]interface{}{
		"cmd": "Page.setDownloadBehavior",
		"params": map[string]string{
			"behavior":     "allow",
			"downloadPath": "/tmp",
		},
	}
	session := page.Session()
	if err := session.Send("POST", "chromium/send_command", params, &result); err != nil {
		log.Printf("Failed to Send: %v", err)
	}
```

あとはダウンロードリンクをクリックするなどでOKです。

(参考: [Headless Chromeでファイルをダウンロード](https://qiita.com/zkangaroo/items/1c4d4c11b06e7823e7fe))
<!-- [ChromeDriverのダウンロード](http://chromedriver.chromium.org/downloads) -->
