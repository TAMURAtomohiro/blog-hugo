+++
date = "2017-03-17T15:46:52+09:00"
draft = true
title = "HTML要素をドラッグアンドドロップ(D&D)中にウィンドウ外に出た場合、D&Dを終了するよう RxJS 5 を用いて実装する"
+++

HTML要素をドラッグアンドドロップ(以降 D&D)で移動させようと思ったときは、
対象要素に対する `mousedown`、`mousemove`、`mouseup` のイベントを使って実装するかと思います。
しかしながらウィンドウ外では `mouseup` を捕捉できないため、
ウィンドウ外でD&Dをやめて

本記事では以下の挙動を RxJS で実装し、解説しています。
タイトルに反して

* D&D 終了時は初期位置に移動する
* カーソルが対象要素外に出て 200ms 経った場合は D&D 終了とする

<!--more-->
<script src="https://code.jquery.com/jquery-3.2.0.min.js"
  integrity="sha256-JAW99MJVpJBGcbzEuXk4Az05s/XyDdBomFqNlM3ic+I="
  crossorigin="anonymous"></script>
<script type="text/javascript" src="https://unpkg.com/rxjs/bundles/Rx.min.js"></script>
<script type="text/javascript" src="/js/drag-and-drop.js"></script>

<div id="dnd-container" style="position: relative; width: 512px; height:64px;">
<div id="dnd-target" class="z-depth-2" style="width:32px; height: 32px; background-color: blue; position:absolute; top: 16px; left: 240px; z-index: 999;"></div>
</div>

参考：[「RxJS」初心者入門 – JavaScriptの非同期処理の常識を変えるライブラリ](https://liginc.co.jp/web/js/151272)


[`window.on('mouseup')を利用したアプローチ`](http://stackoverflow.com/questions/14912515/how-to-detect-a-mouseup-event-outside-the-window)では、
ウィンドウ内でドラッグを開始しウィンドウ外へ出た場合、

<!--
  // window.onmousemove = function(ev) {
  //   console.log(ev);
  // };

  // var blurStream = Rx.Observable.fromEvent(window, 'blur');
  // blurStream.subscribe(function() { console.log('blur'); });
-->
