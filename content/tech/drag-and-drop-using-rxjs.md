+++
draft = false
title = "HTML要素をドラッグアンドドロップ(D&D)中にブラウザ外に出た場合、D&Dを終了するよう RxJS 5 を用いて実装する"
tags = ["javascript","rxjs"]
date = "2017-04-04T17:24:23+09:00"
+++

HTML要素をドラッグアンドドロップ(以降 D&D)で移動させようと思ったときは、
対象要素に対する `mousedown`、`mousemove`、`mouseup` のイベントを使って実装するかと思います。

しかしながらウィンドウ外では対象要素の `mouseup` を捕捉できないため、
単純な実装ではウィンドウ外でD&Dをやめて戻った際、再度クリックなどして`mouseup`が発生するまで要素が追従してしまいます。

本記事では以下の挙動を [RxJS](https://github.com/ReactiveX/rxjs) で実装してみた例です。

* D&D 終了時は初期位置に移動する
* ウィンドウ外で D&D 終了(`mouseup`)を検知する

<!--more-->

とりあえず触ってみてください。Google Chrome 57.0.2987.133 (64-bit) でしか動作確認してません。

<script src="https://code.jquery.com/jquery-3.2.0.min.js"
  integrity="sha256-JAW99MJVpJBGcbzEuXk4Az05s/XyDdBomFqNlM3ic+I="
  crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.0.0/rxjs.umd.js"></script>
<script type="text/javascript" src="/js/drag-and-drop.js"></script>

<div id="dnd-container" style="position: relative; width: 512px; height:64px;">
<div id="dnd-target" class="z-depth-2" style="width:32px; height: 32px; background-color: blue; position:absolute; top: 16px; left: 240px; z-index: 999;"></div>
</div>

[「RxJS」初心者入門 – JavaScriptの非同期処理の常識を変えるライブラリ](https://liginc.co.jp/web/js/151272)
にあるコードとほぼ同じですが、終了条件のストリームを `mouseup` だけでなく `$(window)` の `mouseup` からも作っています。

```javascript
  // 終了条件を表すストリーム
  var terminateDndStream = Rx.Observable.merge(
    mouseUpStream,
    Rx.Observable.fromEvent($(window), 'mouseup')
  );
```

今回用いた技術的なポイントは以下の通りです。

- `window` 内でドラッグを開始した場合、ウィンドウ外での `mouseup` や `mousemove` を捕捉できる
- イベントストリームをマージして OR 条件を表現する

参考：

- [「RxJS」初心者入門 – JavaScriptの非同期処理の常識を変えるライブラリ](https://liginc.co.jp/web/js/151272)
- [マウスをウィンドウ外で離されてもイベントを受け取る](http://qiita.com/tyfkda/items/228934160b0951a8e732)
- [How to detect a MouseUp event outside the window?](http://stackoverflow.com/questions/14912515/how-to-detect-a-mouseup-event-outside-the-window)

Gist も貼っておきます。
{{< gist tmrtmhr d02aaa74e54a6fa684137ae8d4d8b16e >}}
