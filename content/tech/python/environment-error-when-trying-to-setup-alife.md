+++
date = "2018-10-13T21:13:12+09:00"
draft = true
title = "「作って動かすALife」の実行環境をセットアップしたときのエラー"
tags = ["python"]
+++

環境は以下の通り。

- macOS High Sierra (10.13.6)
- Homebrew でインストールした python 3系 (3.6.4)

以下のようにライブラリをインストールしようとしたところ、
```
sudo pip install pyglet pymunk vispy keras tensorflow
```

以下のようなエラーが得られました。
```
Could not install packages due to an EnvironmentError: [Errno 1] Operation not permitted: '/bin/futurize'
```
<!--more-->

最近の Mac では `/bin` 以下にルート権限でもファイルが置けないようで、それに起因したエラーのようです。
(参考：[OS X 10.11ではrootでも/usrや/bin以下に書き込みできない](https://apple.srad.jp/story/15/09/30/1529213/))

ですので `/bin` 以下にファイルを置こうとするライブラリなら同様のエラーが発生します。
実際、`pip install --upgrade pip` をしようとしても以下のように叱られたので、何か自分の環境がおかしいようです。

```
Could not install packages due to an EnvironmentError: [Errno 1] Operation not permitted: '/bin/pip'
```


対策としては `--user` オプションをつけてインストールすることです。

```
pip install --user pyglet pymunk vispy keras tensorflo
```

これにより以下のような場所へファイルが配置されます。
```
$ which futurize
/Users/username/Library/Python/3.6/bin/futurize
```

もし環境変数 PATH へ `/Users/username/Library/Python/3.6/bin` が追加されていないようであれば、追加しましょう。
