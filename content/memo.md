+++
draft = true
title = "書きかけのメモ"
date = "2016-02-22T16:06:53+09:00"
+++
<!--more-->

# CloudFront のキャッシュを削除する
Hugo で更新のあったエントリーについてキャッシュを削除したい


[Angular2 のデザインドキュメント](https://drive.google.com/drive/u/0/folders/0B7Ovm8bUYiUDR29iSkEyMk5pVUk)

[ViewChild と ContentChild](http://stackoverflow.com/questions/34326745/whats-the-difference-between-viewchild-and-contentchild)
[ViewChild ドキュメント](https://angular.io/docs/js/latest/api/core/ViewChild-var.html)

# Angular.js 2.0 のコンセプト / なぜ双方向バインディングが廃止されたか

直近で扱っているのが Angular.js の 1.x 系なので、
Angular.js 2.0 について調べています。

Angular.js の 1 系から 2 系への変化で

Angular.js 2.0 は現在も開発中であり、細部の仕様が fix していないので
拾ったコードを動かそうとしても動かずに苦労するわけですが、

[Victor Savkin氏のエントリ](http://victorsavkin.com/post/118372404541/the-core-concepts-of-angular-2)

# 要約

* digest loop が遅いので、回避する手段ができた
* 属性に [] () がついているのは WebComponent の機能との干渉を避けるため
[カスタムタグの仕様](http://www.w3.org/TR/custom-elements/)

疑問：Angular 1.x のスタイルではなぜだめなのか？

https://pascalprecht.github.io/2014/10/25/integrating-web-components-with-angularjs/
http://pascalprecht.github.io/dont-stop-thinking-about-tomorrow/#/39

<div ng-controller="AppController">
  <label>Please enter your name:</label>
  <special-input value="{{name}}"></special-input>
</div>
このケースでは special-input の初期値として "{{name}}" という文字列リテラルが渡される
special-input の実装が attributeChangeCallback を適切に使用していないと name の更新が反映されない


参考文献

[WebComponentにおけるデータバインディング](https://docs.google.com/document/d/1kpuR512G1b0D8egl9245OHaG0cFh0ST0ekhD_g8sxtI/edit#heading=h.xgjl2srtytjt)
Angular が HTML をなめてごちゃごちゃ処理するが、
このとき WebComponent としてのふるまいを邪魔しないように設計する必要がある。
<pane title="{{exp}}"></pane>
pane が WebComponent であるケースを考える。
WebComponent が "{{exp}}" という文字列リテラルを処理したのちに
Angular が置換するという順序になるとまずい。

なぜ属性名をescapeする必要があるのか？

WebComponent が実装されたら WebComponent の内部には触れない。
なのでデータを渡す方法は属性を利用することのみ。
しかし angular はカスタムタグかどうかの知識や固有属性かどうかを知れない。
解決法：DOM のプロパティにバインディングする。

[Angular.js2 の変更検知](http://qiita.com/laco0416/items/78edd53f5da8ead02e75)

[Shadow DOM 内での JavaScript の挙動](http://robdodson.me/shadow-dom-javascript/)
Shadow DOM 内でもグローバル環境は分離されない。
JavaScript のモジュール化については ES6 以降の機能。
なので WebComponent が導入されたとしても scope の


---
Angular.js の変更検知

# 概要

Angular.js 2 では WebComponent を利用して書くことになります。
1系で言うと `directive` をがしがし書くことになります。
`controller` および `$scope` は廃止されます。

```
<parent>
  <child></child>
</parent>
```


# Angular.js のデータバインディングおさらい

話を単純にするため、単方向データバインディングについてのみ触れておきます。

```
<section ng-controller="HelloController">
{{ message }}, {{ HelloController.name }}
</section>
```

というテンプレートに対し、
以下のようにコントローラでデータを設定します。

```
angular.module('my.angular.app') .controller('HelloController',
['$scope', function($scope) { $scope.message = 'Hello'; this.name = 'Tamura'; }]);
```

MVC で言うところの Model に当たるのが `$scope` サービスと `HelloController のプロパティ` です。
また、Model のデータとテンプレートから実際の HTML を生成する処理は Angular.js のフレームワークが自動で行います。

# View 更新のタイミング

JavaScript の言語処理系にはオブジェクトの更新を検知する仕組みはありません。
(Object.observe というメソッドが提案されていましたが[なくなりました。](http://tech.nitoyon.com/ja/blog/2015/11/18/death-of-oo/)

Angular.js では、あらかじめ監視対象に登録したデータに対し、
更新のありそうなタイミングでチェックをします。
更新のありそうなタイミングというのは以下の4つです。

* ナビゲーション：ブラウザの location 変更時
* ネットワーク：$http, $resource レスポンス受信時
* DOM イベント：ng-click, ng-mouseover などの実行時

* タイマー：$timeout によるタイマー処理の実行時

たとえば `$resource` では、プログラマが渡したコールバック関数のあとで、
いわゆる `$digest` ループを実行して View を更新するように実装されています。
そのため `setTimeout` などを用いて独自のタイミングでデータを更新しただけでは View に反映されません。

# Angular.js 1.x のどこが遅いのか

# Angular.js 2.x のどこが速いのか

Object.observe がなくなった

# 参考文献

http://teropa.info/blog/2015/03/02/change-and-its-detection-in-javascript-frameworks.html
http://victorsavkin.com/post/110170125256/change-detection-in-angular-2
[ChangeDetection](https://docs.google.com/document/d/10W46qDNO8Dl0Uye3QX0oUDPYAwaPl0qNy73TVLjd1WI/edit)

https://www.youtube.com/watch?v=jvKGQSFQf10&feature=youtu.be
* コンポーネントの依存関係をツリーに
Angular1 でサイクルができる、という点がよくわからない
<parent prop1="myProp">
  <child prop2="myProp"></child>
</parent>


* 多相的な変更検知ルーチンをやめて、コンポーネントごとに Detector を生成する
-> VM の最適化が効きやすい
* Immutable
Immutable データを使うと、変更のあったデータはルートまでのパスのすべてのオブジェクトが新たに生成される
そのため変更があったかどうかのチェックにはアドレスの比較でよい

* Observable

# メモ
First-gen JS: Manual Re-rendering

jQuery を用いて生DOMをいじる
Model と View の同期はプログラマが担保する


Ember.js: Data Binding

* get/set を用いてプロパティにアクセスする
  set のときに get で登録されたリスナーを呼ぶ

React: Virtual DOM
プログラマは Virtual DOM と呼ばれる 

* Virtual DOM を

---
Angular.js 2.0 と WebComponent


Angular.js 1.x でのイベントハンドリング
[ngClick の実装](http://qiita.com/shuhei/items/b632cd5103bcca1c8cfe)


一方で、開発が進められている Angular.js 2.0 では、
Web Component を念頭に置いて設計されているようなので、
この辺りについて調べてみました。

さて Web Components を利用する際は(HTML Import によりモジュールを読み込んだ上で)
対象のカスタムタグを挿入します。

```
<x-foo param1="hello"></x-foo>
```

Web Components ではこのルート要素のプロパティや
発行されるイベントがインタフェースとして公開されるのみで、
内部の DOM にはアクセスできません。

[Web Components 仕様の状況](https://www.w3.org/standards/techs/components#w3c_all)

HTML Import 機能でモジュールを読み込み、
必要な箇所へカスタムタグの要素を追加すれば利用できます。

```
<x-foo param1="hello"></x-foo>
```

http://www.slideshare.net/armorik83/angular3-gdgkobe150429

Shadow DOM
Custom Elements

[ngBind と ngModel ディレクティブもどきを自作する (書きかけ)](http://kichipoyo.hatenablog.com/entry/2013/12/01/045519)



Angular2 では controller や $scope が廃止され、これらの役割を directive に統合し、component と呼ぶようになっています。

あるいは `google-map` が `directive` で、`scope` への `binding` が以下のように定義されているとしたら、

```
angular.module('myApp')
  .directive('google-map', function () {
    return {
      restrict: 'E',
      scope: { latitude: '=', longitude: '='},
    };
})
```

以下のような書き方になるでしょう。

```
<google-map latitude="angularLat" longitude="angularLng"></google-map>
```

これは google-map directive 内のプロパティ latitude と、
外部のプロパティ angularLat との双方向データバインディングです。



[Angular 2入門：NgModelに触れてみる](http://qiita.com/shinsukeimai/items/c96382ed00da0c3ae13f)

* Angular2 Template Syntax

`*ngIf` などは template タグを用いる構文糖。
template タグの利点は画像のロードなどが走らないこと。


* デザインパターン

+++
date = "2015-12-07T17:58:31+09:00"
draft = true
title = "デザインパターンまとめ"

+++

# Abstract Factory
同じインタフェースを持つオブジェクトは同じように扱える。
親(抽象)クラスでインタフェースを定義しておいて子クラスでオーバーライド。

# Builder
builder.buildFunction に渡す引数を決め打ちにした director を作る。
クロージャを作ればよいだけのような。

# Singleton
メモ化

# Flyweight
メモ化。Singleton の複数バージョン。

# Facade
複数モジュールから構成されるモジュールに、
インターフェイスとなるクラスを作る。


+++
date = "2015-12-05T12:50:13+09:00"
draft = true
title = "Singleton パターン再考"

+++

いわゆる GoF 本が出たのは20年くらい前のことで、
[15年後のインタビュー](http://www.informit.com/articles/article.aspx?p=1404056)
では「Singleton パターンの使用は危険な兆候」とまで言われてパターンから外されています。
しかしながら Singleton パターンで使用しているメモ化の手法は自分もよく使っており、
有用であると考えます。
というよりあれは Singleton パターンという名前をつけるまでもなくメモ化です。

Singleton パターンについての言及では「インスタンスが1つしか生成されないように保証する」という表現をよく見かけます(個人の感想です)。
自分の考える Singleton パターンのポイントは以下の2つです。
* 実行結果をキャッシュする
* キャッシュを保持するための領域は外から触れないように隠蔽する
実行するのはインスタンスの生成でも

Singleton パターン[Wikipedia](https://ja.wikipedia.org/wiki/Singleton_%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3)
はWebアプリを含む GUI アプリケーション全般でよく使っているのかもしれない、
と気付いたのでメモしておきます。

Singleton パターンの目的としては、
唯一のインスタンスであることを保証するため、というような表現が多いと思います(個人の感想です)。
しかしここではもう少し風呂敷を広げて、
「ある処理の実行が高々一回であることを保証するため」という表現にします。

インスタンスの生成というニュアンスが抜けたのは、オブジェクト指向に限ったパターンではないからです。
また、高々一回という表現にしたのは、実行されないこともある、という含みを持たせたかったからです。

# シチュエーション

具体的なシチュエーションを考え、それに対する愚直なコードを書き、
それを Singleton パターンに直してみます。

Web アプリにおいて、ユーザからのアクションに応じて API 呼び出しを行うというケースはよくあります。
ユーザは気まぐれなのでどこから触るか予測できませんが、
A を触っても B を触っても同じ API 呼び出しをする、という状況を仮定します。
まあ以下のようなハンドラが設定されていると思ってください。
また、説明のために API は同期呼び出しとします。


```
function APICall() { return real_API_Call(); }

function handlerA() {
  var response = APICall();
  ... // handlerA 固有の処理
}

function handlerB() {
  var response = APICall();
  ... // handlerB 固有の処理
}
```

APICall を一度しか実行しないためにはどうすべきでしょうか。
愚直に考えれば実行されたかどうかのフラグを持っておけばよさそうです。
ここでは実行結果があるかどうかで判断することにします。

```
function APICall() { return real_API_Call(); }

var cache = null;
function handlerA() {
  if (cache === null) {
    cache = APICall();
  }
  var response = cache;
  ... // handlerA 固有の処理
}

function handlerB() {
  if (cache === null) {
    cache = APICall();
  }
  var response = cache;
  ... // handlerB 固有の処理
}
```

なんとか実現できました。
しかしながら `APICall()` のある箇所すべてにこのような分岐を書くのはだるいです。
なので `APICall()` の中で判断してもらうことにします。

```
var cache = null;
function APICall() {
  if (cache === null) {
    cache = real_API_call();
  }
  return cache;
}

function handlerA() {
  var response = APICall();
  ... // handlerA 固有の処理
}

function handlerB() {
  var response = APICall();
  ... // handlerB 固有の処理
}
```

ということで `real_API_call()` の実行を一度だけに押さえ、
かつ実行されたかどうかの判断を `APICall` にまとめることに成功しました。

`cache` がグローバル変数なのがださいですし、
せっかくなのでクロージャを作って外から触れないようにしておきます。

```
var APICall = (function() {
  var cache = null;
  return function() {
    if (cache === null) {
      cache = real_API_call();
    }
    return cache;
  }
})();
```

以上です。

# まとめ

Singleton パターンのポイントは以下のふたつです。
オブジェクト指向言語かどうかは関係ありません。
* 実行結果をキャッシュする
* 実行済かどうかの判断をカプセル化する

# 補足：スレッドセーフでないことについて

マルチスレッド環境では以下のコードが不可分に実行されないといけません。
```
if (cache === null) {
  cache = real_API_call();
}
```
JavaScript はシングルスレッド環境なのでこの点については割愛いたしました。


[クラスのインスタンスを1つに保つ（Singletonパターン）](http://www.atmarkit.co.jp/ait/articles/0408/10/news088.html)


+++
date = "2015-12-11T19:28:33+09:00"
draft = true
title = "MVC再訪"

+++

#
[Fluxアーキテクチャ](http://facebook.github.io/flux/docs/overview.html#content)
を調べるに当たって

MVCについての元論文[A Cookbook for Using the Model-View-Controller User Interface Paradigm in Smalltalk-80](http://www.ics.uci.edu/~redmiles/ics227-SQ04/papers/KrasnerPope88.pdf)
を当たってみました。

# 確認したかったこと

* 何のために分けるのか
* Model View Controller それぞれの役割は何か

# 何のためにわけるのか

モジュールの再利用性を高めるためです。

# Model View Controller それぞれの役割は何か


+++
date = "2016-02-17T12:12:52+09:00"
draft = true
title = "Angular2 の [ ] 記法"

+++
[Angular2](https://angular.io/)が
[昨年12月に Beta リリース](http://angularjs.blogspot.jp/2015/12/angular-2-beta.html)されたため、
色々触りながら調べています。

いきなり余談ですが Angular2 は JavaScript の他に TypeScript や Dart でも書けるので
AngularJS 2 ではなく Angular2 for JavaScript という名前です。
以下、1 系は AngularJS、2 系は Angular2 と呼びます。

* コンポーネントベース
* テンプレートが Angular によって処理された後でブラウザによって処理される
* index.html は Angular による処理が入らない
** root component で ng-content が使えない

AngularJS から Angular2 では Template Syntax が様変わりしています。
たとえば [Google Maps の Web Components](https://elements.polymer-project.org/elements/google-map]) を使う際は
以下のような書き方になります。

```
<google-map [latitude]="angularLat" [longitude]="angularLng"></google-map>
```

# なぜ括弧をつけなければならないのか？

`google-map` Web Components のプロパティ名は `latitude` と `longitude` ですが、
余計なカッコ `[]` が付いています。
AngularJS に慣れている方は以下のように `{{ }}` での挿入を考えるでしょう。

```
<google-map latitude="{{angularLat}}" longitude="{{angularLng}}"></google-map>
```

しかしこの書き方では Web Components の挙動とそぐわない場面が出てきます。
というわけでもしこの記述のままいこうとしたら何がまずいのかを見ていきます。

# AngularJS の挙動

AngularJS では上のような HTML をパースし `{{angularLat}}` の部分を置換するとともに、
`angularLat` の変更を監視する処理を登録します。
この監視処理が `$http` などのレスポンス受信時やクリックなどのユーザ操作時に実行され、
変更があれば属性に反映されるという寸法です。

# Web Components の挙動

基本的にHTML属性は初期値であり、`input`タグなどでの値の更新は DOM プロパティに反映されます。

属性は HTML をパースし DOM を構築する段階で用いられ、
以降、値の変更は DOM プロパティに反映されます。
そのため `{{angularLat}}` という文字列が Web Components に渡されたあとで、
AngularJS による置換処理が起こります。

Web Components が `attributeChangedCallback` を設定していれば
AngularJS による置換が反映されますが、Web Components 次第ですので
AngularJS 側の設計として `attributeChangedCallback` を頼りにすることはできません。

# Angular2 の設計と挙動

上で述べたように属性を介してデータをやりとりするのは問題が起きます。
また、Angular2 からすると、あるカスタムタグが Web Components かどうかが判断できないため、
そこで処理を切り替えるということもできません。
というわけで Angular2 では `[latitude]` あるいは `bind-latitude` のように目的の名前(`latitude`)をエスケープした属性名を目印にして、
DOM のプロパティに右辺(`angularLat`)の評価結果をセットします。

また、もし `latitude="{{angularLat}}"` と書いた場合は `[latitude]="angulraLat"` と解釈されます。
`<div> latitude is {{angularLat}} </div>` のようなケースでも `<div [textContent]="'latitude is '+angularLat"></div>`となります。
つまり、`{{}}` 記法は `[]`記法 の構文糖です。

注：双方向バインディングについての言及はここではしませんが、
`[]`記法は `angularLat` から `latitude` への一方向バインディングです。

# まとめ

* Angular2 Component では template 
* Angular2 は属性値を変更せず、DOM プロパティのみ変更する

ということです。

# 疑問

公式ドキュメントに以下のような記載があり、`{{ }}` 記法が `[ ]` 記法に変換される、と読めるのですが、

> In fact, Angular translates those interpolations into the corresponding property bindings before rendering the view.

`<google-map latitude="{{angularLat}}">` のように書いた場合に、
Angular2 による変換は Web Components の初期化のあとで起こるため`{{ }}`記法を使うべきでないのか？
といったあたりは未確認です。


# 参照

* [Angular2: Template Syntax](https://angular.io/docs/ts/latest/guide/template-syntax.html)
* [Data Binding with Web Components](https://docs.google.com/document/d/1kpuR512G1b0D8egl9245OHaG0cFh0ST0ekhD_g8sxtI/edit#heading=h.ptbnyo3pqsmq)


+++
date = "2016-02-17T17:05:06+09:00"
draft = true
title = "Angular2 の [ ] 記法"

+++
[Angular2](https://angular.io/)が
[昨年12月に Beta リリース](http://angularjs.blogspot.jp/2015/12/angular-2-beta.html)されたため、
色々触りながら調べています。

AngularJS では `{{...}}` という記法でデータを表示することができました。


```
<input type="text" ng-model="name">
<div>My Name is {{name}}</div>
```


AngularJS から Angular2 では Template Syntax が様変わりしています。


* コンポーネントベース
* テンプレートが Angular によって処理された後でブラウザによって処理される
* index.html は Angular による処理が入らない
** root component で ng-content が使えない

たとえば [Google Maps の Web Components](https://elements.polymer-project.org/elements/google-map]) を使う際は
以下のような書き方になります。

```
<google-map [latitude]="angularLat" [longitude]="angularLng"></google-map>
```

# なぜ括弧をつけなければならないのか？

`google-map` Web Components のプロパティ名は `latitude` と `longitude` ですが、
余計なカッコ `[]` が付いています。
AngularJS に慣れている方は以下のように `{{ }}` での挿入を考えるでしょう。

```
<google-map latitude="{{angularLat}}" longitude="{{angularLng}}"></google-map>
```

しかしこの書き方では Web Components の挙動とそぐわない場面が出てきます。
というわけでもしこの記述のままいこうとしたら何がまずいのかを見ていきます。

# AngularJS の挙動

AngularJS では上のような HTML をパースし `{{angularLat}}` の部分を置換するとともに、
`angularLat` の変更を監視する処理を登録します。
この監視処理が `$http` などのレスポンス受信時やクリックなどのユーザ操作時に実行され、
変更があれば属性に反映されるという寸法です。

# Web Components の挙動

基本的にHTML属性は初期値であり、`input`タグなどでの値の更新は DOM プロパティに反映されます。

属性は HTML をパースし DOM を構築する段階で用いられ、
以降、値の変更は DOM プロパティに反映されます。
そのため `{{angularLat}}` という文字列が Web Components に渡されたあとで、
AngularJS による置換処理が起こります。

Web Components が `attributeChangedCallback` を設定していれば
AngularJS による置換が反映されますが、Web Components 次第ですので
AngularJS 側の設計として `attributeChangedCallback` を頼りにすることはできません。

# Angular2 の設計と挙動

上で述べたように属性を介してデータをやりとりするのは問題が起きます。
また、Angular2 からすると、あるカスタムタグが Web Components かどうかが判断できないため、
そこで処理を切り替えるということもできません。
というわけで Angular2 では `[latitude]` あるいは `bind-latitude` のように目的の名前(`latitude`)をエスケープした属性名を目印にして、
DOM のプロパティに右辺(`angularLat`)の評価結果をセットします。

また、もし `latitude="{{angularLat}}"` と書いた場合は `[latitude]="angulraLat"` と解釈されます。
`<div> latitude is {{angularLat}} </div>` のようなケースでも `<div [textContent]="'latitude is '+angularLat"></div>`となります。
つまり、`{{}}` 記法は `[]`記法 の構文糖です。

注：双方向バインディングについての言及はここではしませんが、
`[]`記法は `angularLat` から `latitude` への一方向バインディングです。

# まとめ

* Angular2 Component では template 
* Angular2 は属性値を変更せず、DOM プロパティのみ変更する

ということです。

# 疑問

公式ドキュメントに以下のような記載があり、`{{ }}` 記法が `[ ]` 記法に変換される、と読めるのですが、

> In fact, Angular translates those interpolations into the corresponding property bindings before rendering the view.

`<google-map latitude="{{angularLat}}">` のように書いた場合に、
Angular2 による変換は Web Components の初期化のあとで起こるため`{{ }}`記法を使うべきでないのか？
といったあたりは未確認です。


# 参照

* [Angular2: Template Syntax](https://angular.io/docs/ts/latest/guide/template-syntax.html)
* [Data Binding with Web Components](https://docs.google.com/document/d/1kpuR512G1b0D8egl9245OHaG0cFh0ST0ekhD_g8sxtI/edit#heading=h.ptbnyo3pqsmq)



+++
date = "2016-02-16T16:34:40+09:00"
draft = true
title = "Angular2 - 双方向バインディングの廃止"

+++

Angular2 では AngularJS1 の Controller や $scope が廃止され、
Component という単位でモジュールを作ります。
Component は1系で言うところのテンプレートを持つ directive です。

さて、以下のようなカスタムタグの directive を例に取ってみます。

```
angular.module('angular1app')
.directive('child', function () {
    return {
        restrict: 'E',
        scope: {fuga: '='}
    };
})
```

```
<child fuga="parent.hoge"></child>
```

ここでは `child` の `scope.fuga` と `parent.hoge` が双方向バインディングされています。
つまり、両方を Angular が監視しており、変更があればもう一方へ伝播させます。

Angular2 では以下のようになります。

```
@Component({
   selector: 'child',
   template: ...,
}
export class ChildComponent {
  @Input() fuga;
}
```

```
<child [fuga]="parent.hoge"></child>
```

こちらでは `parent.hoge` から `fuga` への一方向バインディングです。
つまり、`fuga` への変更は `parent.hoge` に伝播しません。


+++
date = "2016-01-27T12:15:02+09:00"
draft = true
title = "Angular 2.0 と Web Components の併用"

+++
Web Components は Web アプリにおける UI のモジュールで、
このモジュール化を実現するための仕様が策定中です。
これはHTML周りの仕様であるため、フロントエンド開発フレームワークによらず利用できます。

一方で、開発が進められている Angular.js 2.0 では、
Web Component を念頭に置いて設計されているようなので、
この辺りについて調べてみました。




```
<x-foo param1="hello"></x-foo>
```

[Web Components 仕様の状況](https://www.w3.org/standards/techs/components#w3c_all)

HTML Import 機能でモジュールを読み込み、
必要な箇所へカスタムタグの要素を追加すれば利用できます。

```
<x-foo param1="hello"></x-foo>
```



Shadow DOM
Custom Elements

+++
date = "2016-01-05T19:54:35+09:00"
draft = true
title = "ShadowDOM における JavaScript の挙動"

+++

参考文献
[](http://robdodson.me/shadow-dom-javascript/)

