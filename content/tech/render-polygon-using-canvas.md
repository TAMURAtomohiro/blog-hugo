+++
draft = false
title = "Canvas(Fabric.js)でポリゴンを描画する"
tags = ["JavaScript"]
date = "2017-06-21T10:28:21+09:00"
+++

「プログラミング言語 Go」の練習問題に `sin(r) / r` で表される面を描画するというものがあります(ここで、`r`は原点からの距離)。
SVGで描画するとこんな感じです。

<img src="/img/surface-mono.svg"></img>

基本的には原点から離れるほど振幅が小さくなりますが、`r < 1` の部分では大きくなるという図です。

SVGでは、要素が文書中に現れた順に描画され、領域が被っていれば上書きされます。
ここではこれを利用して、奥側のポリゴンからSVG上に配置することで、手前の高くなっている部分が奥側を上書きするようにし、
立体的に描画しています。

本記事は同じことを HTML5 の Canvas でやってみたサンプルです(`Fabric.js`を利用してます)。

知見としては以下のような感じです。

* 1個ずつ `canvas.add` すると重い
* `canvas.add.apply(canvas, polygons)` のようにまとめて `apply` で描画するときは配列の長さに注意するべし

<!--more-->

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.7.11/fabric.min.js"></script>
<script type="text/javascript" src="/js/canvas-surface.js"></script>

<a href="/js/canvas-surface.js">コード例</a>

<canvas id="canvas-surface" width="640" height="320"> </canvas>

# "Uncaught RangeError: Maximum call stack size exceeded" というエラーが出る場合について

上のコード例では 1 辺に 100 個のポリゴンとしています。
全体では 100 * 100 で 10000 個のポリゴンです。

コードの構造としては以下のような感じです。

```
  var canvas = new fabric.Canvas('canvas-surface');
  var polygons = [];
  for (var i = 0; i < cells; i++) {
    for (var j = 0; j < cells; j++) {
      ...
      var polygon = new fabric.Polygon([pa, pb, pc, pd]);
      ...
      polygons.push(polygon);
    }
  }
  canvas.add.apply(canvas,polygons);
```

二重ループの中で`canvas.add`をしていないのは、1個ごとに描画するのが重いためです。
30 * 30 でも 5 秒とかになってしまうので、100 * 100 ともなると待てませんでした。

なのでいったん配列にまとめて `apply` で渡すことにしました。
この場合 100 * 100 でも手元の環境(CPU 3.1GHz, Google Chrome バージョン: 59.0.3071.104)では 800 ms くらいの実行時間で、
余裕がありそうだったので数を増やしていったのですが、
251 * 251 で `Maximum call stack size exceeded` エラーとなりました。

[Mozilla のドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)でも言及されていますが、
`apply` に配列として渡した引数群は、スタックに積み直されるため、長すぎる場合はスタックがあふれてエラーとなるわけです。
上限は処理系によって異なるため、適度に分割して渡す必要が出てきます。
