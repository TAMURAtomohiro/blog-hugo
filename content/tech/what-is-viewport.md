+++
date = "2019-12-24T02:17:57+09:00"
draft = true
title = "viewport って何？"
tags = ['Web','CG']
+++

この記事は、
ウェブ系エンジニアであるところの筆者が
ARやらVRやらあるいはWebGLやらについて調べていたら混乱してきたので
整理のために書き出すものである。

<!--more-->

昨今の(レスポンシブデザインなどの)ウェブページでは、ビューポート( viewport )という指定が現れる。
まあ以下のようにしておけばOKというあのアレである。

```
<meta name="viewport" content="width=device-width,initial-scale=1">
```

一方で、コンピュータグラフィックス( CG )用語の用語としても viewport という用語があり、
これは、最終的に描画する対象のデバイス(モニタとか)のサイズを指す(らしい)。

ウェブページも HTML と CSS で定義したデータをレンダリングするものだから、
おそらくブラウザ開発者や仕様策定者はCG分野に精通しているものと思う。
何らかのグラフィックライブラリ(DirextXとかOpenGLとか？)を使わないと、
モニタに最高にクールなボタン(陰影がついてて盛り上がって見える "ユーザーに押したくさせる" ようなやつ)を
表示するすることはできないはずだ。
(もっとも、かつてそういうボタンは画像で用意していたから、
3Dオブジェクトのレンダリングとは違うけども)

つまりブラウザっていうのはHTMLをレンダリングするプログラムなんでしょ？
っていうことだ。

でもウェブアプリケーション開発しか経験のない我々からすると、
「レンダリングって何？」ということになる。
実際のところ、知らなくても生きていけるものではある。

# CGにおけるレンダリング

レンダリングのゴールは、モニタの各ピクセルに表示する色を決めることである。


1. 3Dモデルを作る。

2. 3Dモデルを配置する。これはワールド座標系と呼ばれる空間で、3Dモデルの基準点の位置を決める。

3. カメラの位置を決める。

4. カメラに映る範囲を決める。

5. (4)で決めた範囲を、実際のモニタ



たとえば Google のスマートフォン Pixel4 の解像度は 1080×2280 だ。


* CG用語としてのウィンドウ: ワールド座標系において描画する範囲
* CG用語としてのビューポート: デバイス座標系における表示エリアサイズ
<