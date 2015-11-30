+++
date = "2015-11-20T13:00:29+09:00"
draft = false
title = "Emacs から外部プロセスを呼び出して結果をエコーエリアに表示する"

+++
学生時代からの習慣と宗教上の理由から普段使いのエディタは Emacs
(ここでは [GNU Emacs for Mac OS X](http://emacsformacosx.com/))
です。

設定ファイルを除いて自分で Emacs Lisp を書いて機能を追加したことはこれまで無かったのですが、
このたび必要にかられて追加いたしました。

ど素人なので作法やらベストプラクティスやらがわからないですが、まあ動きます。
[Gist](https://gist.github.com/TAMURAtomohiro/18cd0fb0ae33baa48625) にも置いてあります。

# 経緯

とあるプロジェクトで JavaScript のソフトウェアメトリクスを測り、
コード改善のときの目安とすることになりました。
そこで[Plato](http://es-analysis.github.io/plato/examples/marionette/index.html)を導入したわけですが、
このツールでは今まさに自分が変更したファイルのメトリクスを確認するのが面倒です。

どうせなら書いたそばから教えていただければ「もうちょっとメトリクス上げてみようか」という気分にもなるわけです。
before-save-hook などで保存時に何かしらの処理をフックできることは知っていましたので、
前述の plato を呼んで結果を表示するくらいのことはすぐできるだろう……と作り始めました。

# メトリクスを取り出す

plato には「結果を標準出力に出す」ようなオプションがなかったため、
とりあえずごり押しで plato の結果を取り出してみます。
生成された HTML から Average Maintainability の部分を取り出せれば細かいことはとやかく言いません。
(一時ファイルの名前やらが決め打ちじゃ並列実行したときおかしくなるぞ、とか)

```
#!/bin/sh
TMPFILE=/tmp/js-metrics.js
REPORT_DIR=/tmp
cat - > ${TMPFILE}
plato -d ${REPORT_DIR} ${TMPFILE} > /dev/null
grep 'class="stat"' ${REPORT_DIR}/index.html | tail -n 1 | sed -e "s/<p class=\"stat\">//g" | sed -e "s/<\/p>//g" | sed -e "s/ //g" | tr -d '\n'
```

# 現在のバッファの内容を外部プロセスに渡し、結果をエコーエリアに表示する

`call-process-region` という関数を使うと現在のバッファの内容を標準入力として外部プロセスに渡せるのでこれを使います。
ただ、エコーエリアに表示しようとして、結果の出力先バッファを `*Messages*` とするやり方はうまくいかず(`*Messages*`バッファが read-only になっていて書き込めない)、
`message` 関数を使うことになりました。

なので出力先バッファを用意しなきゃいけないですが、
自分で管理するのは面倒なので `with-temp-buffer` を使ってみます。
これを使うと新たなバッファが作られ、一連の処理が終わったあとに破棄してくれます。
カレントバッファが切り替わってしまうので今回の目的のためには
元バッファの JavaScript コードを取得しておいて転記する必要があります。

ということで今回の成果物を以下の通りです。

```
(defun jsmetrics ()
    (if (derived-mode-p 'js-mode) ; JavaScript ファイルが js-mode で開かれることを前提として JavaScript のみを対象とする
        (let ((jscode (buffer-string))) ; カレントバッファの内容を取得しておき
            (with-temp-buffer
                (insert jscode)         ; 一時バッファに書き込む
                (call-process-region (point-min) (point-max) "js-metrics.sh" t t nil) ; 一時バッファの内容を外部プロセスの結果で置き換える
                (message (buffer-string)))))) ; 結果をエコーエリアに表示

(add-hook 'js-mode-hook
    (lambda () (add-hook 'after-save-hook 'jsmetrics)))
```

# まとめ

標準入出力という偉大なインタフェースのおかげで Emacs Lisp 内で完結させる必要がなく、
他言語のモジュールを利用できるのが素晴らしいです。
