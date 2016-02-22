+++
date = "2016-02-22T16:08:13+09:00"
draft = false
title = "Angular2 から Web Components を使う"

+++
[Angular2](https://angular.io/)が
[昨年12月に Beta リリース](http://angularjs.blogspot.jp/2015/12/angular-2-beta.html)されたため、
色々触りながら調べています。

Angular2 の設計ドキュメントのひとつ([Data Binding with Web Components](https://docs.google.com/document/d/1kpuR512G1b0D8egl9245OHaG0cFh0ST0ekhD_g8sxtI/edit#heading=h.ptbnyo3pqsmq))
を見かけ、Web Components との併用を考慮しているようだったので、
使い方を調べてみることにしました。

この記事の[サンプルコード(TypeScript)](https://github.com/TAMURAtomohiro/angular2-with-web-components)をGitHubで公開しています。

# 題材

[Google Map Web Component](https://elements.polymer-project.org/elements/google-map)(以下 google-map と表記) を Angular2 から使用します。
やりたいことは以下の三種類です。

* DOM のプロパティを介して Web Components に値を渡す
* DOM のメソッドを呼ぶ
* DOM から上がってくるイベントを捕捉する

# コンポーネントの構成

Angular2 では Component(コンポーネント)という単位でモジュールを分けるようになりました。
ざっくり言うとテンプレートHTMLを持つ Directive を Component と呼びます。

今回のコードでは `AppComponent`(`app.component.ts`) と `GoogleMapWebComponent`(`googlemap.component.ts`) の二種類です。

`AppComponent` では google-map に渡す値やイベントハンドラを定義します。

`GoogleMapWebComponent` は Angular2 から google-map を触るために DOM 要素を保持します。

# DOM のプロパティを介して Web Components に値を渡す

`AppComponent` のテンプレートにある `[latitude]="lat"` のような記述により google-map に Angular の値を渡すことができます。

```
<google-map [latitude]="lat" [longitude]="lng"></google-map>
```

値は同じく `AppComponent` で以下のように定義してあります。右辺の `lat`、`lng` はこれを参照しています。

```
constructor() {
    this.lat = 35.71;
    this.lng = 139.98;
}
```

## [ ] 記法

`[latitude]="lat"` は property binding と呼ばれ、
DOM のプロパティに右辺の式を一方向バインディングするという意味を持ちます。

つまり、以下のようなコードで Angular2 のプロパティを更新すると、
`google-map` HTML要素の `longitude` プロパティも合わせて更新されます。

```
goWest() {
    this.lng = this.lng - 0.1; // Angular 側のプロパティ更新が Web Components に反映される
}
```

しかし、地図をドラッグして移動しても、Angular2 の `lat`、`lng` プロパティは更新されません。
追従するためには `google-map-dragend` のイベントを捕捉し、明示的に更新処理を書く必要があります。

ここで、`GoogleMapWebComponent` に `@Input` デコレータを「書かない」ことに注意しましょう。
`@Input` デコレータを書くとコンポーネントのプロパティに設定するようになり、
DOM のプロパティに設定されなくなってしまいます。

# DOM のメソッドを呼ぶ

## DOM を取得する

DOM のメソッドを呼ぶにはまず DOM を取得する必要があります。
(一休さんで言うところの、虎を捕まえるからまず屏風から虎を追い出してくれ、みたいな話です)

古文書によればこれは `document.getElementById(...)` などで実現できますが、
今風の書き方だと `GoogleMapWebComponent` 内の以下のような記述になります。

```
constructor(elRef:ElementRef) {
    this.elem = elRef.nativeElement;
}
```

ルート要素が取得できるため、これをコンポーネントのプロパティに保持しておきます。

## 子コンポーネントのプロパティに触る

子コンポーネントにアクセスするには
[ViewChild](https://angular.io/docs/js/latest/api/core/ViewChild-var.html) などを使います。
適切に import などを行った上で、``AppComponent`` のプロパティとして以下のように宣言します。

```
@ViewChild(GoogleMapWebComponent)
googlemap: GoogleMapWebComponent;
```

使えるようになるタイミングには注意が必要で、
子コンポーネントの作成が親コンポーネントよりあとに起こるため、
`ngAfterViewInit` というメソッドが呼ばれた時点で `googlemap` にセットされます。

# DOM から上がってくるイベントを捕捉する

`( )`記法でイベント名を指定し、対応する処理を右辺に書きます。
たとえば `google-map-dragend` イベントを捕捉するには以下のように書きます。
`[dragEvents]="true"` はドラッグ関係のイベントを ON にするための設定です。

```
[dragEvents]="true" (google-map-dragend)="dragendHandler($event)"
```

あとはハンドラで Angular のプロパティを更新しましょう。

```
dragendHandler(event) {
    console.log('dragend');
    this.lat = event.target.latitude;
    this.lng = event.target.longitude;
}
```

# プロパティバインディングの捕捉

## {{ }} 記法の変換

Angular.js に慣れていると以下のように書きたくなるかもしれません。

```
latitude="{{lat}}"
```

この書き方でも問題なく動作します。
Angular2 は `{{ }}` 記法を以下のように `[ ]`記法へ変換します。

```
[latitude]="lat"
```

これは以下のようなテキストコンテンツでも同様です。

```
<div> My Name is {{ name }} </div>
```

以下のようになります。

```
<div [textContent]="'My Name is ' + name"></div>
```

## 属性の削除

`[latitude]` や `(google-map-dragend)` などの属性は Angular2 によって削除されるため、
ブラウザの開発コンソールで HTML を見ても載っていません。

# まとめ

Angular2 から Web Components を使ってみました。
対応するコンポーネントを作って DOM 要素に触れるようにしておけば、
あとはコンポーネント間のやりとりで実現できます。

# 参照

* [Angular2: Template Syntax](https://angular.io/docs/ts/latest/guide/template-syntax.html)
* [ViewChildren and ContentChildren in Angular 2](http://blog.mgechev.com/2016/01/23/angular2-viewchildren-contentchildren-difference-viewproviders)
