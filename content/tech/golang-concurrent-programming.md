+++
date = "2018-04-29T23:00:42+09:00"
draft = true
title = "Go 言語における並行プログラムのすすめ"
tags = ["go"]
+++

Go言語は `goroutine` と呼ばれるグリーンスレッドと、
`channel` という `goroutine` 間の通信メカニズムがあることで、
並行プログラムを記述しやすいです。

[Rob Pike氏の講演: "Concurrency is not Parallerism"](https://talks.golang.org/2012/waza.slide#1)
に使われている図を以下に転載します。

{{< figure src="http://talks.golang.org/2012/waza/gophercomplex5.jpg" width="100%" >}}

なぜ並行プログラムにするか？その理由について自分なりにまとめると

* ディスクIO・CPU・ネットワークIO などの各計算機資源の増加に対し、プログラムの構造を変えずにスケールさせるため

これはクラウドプラットフォームを活用する際のパターンの1つである
[Cloud Design Pattern: Queueing Chain](http://aws.clouddesignpattern.org/index.php/CDP:Queuing_Chain%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3)
と似ています。
間にタスクキューを挟み、ボトルネックになっている部分に対してワーカーを追加することでスループットを上げるというものです。

本記事の Go 言語における並行プログラムは、単一の計算機上で実行することを想定しています。
しかしながら、昨今のクラウドプラットフォームではCPUやIOPSを選べるため、
ボトルネックになった部分に対してある程度資源を追加できます。
また、この資源は年々増加していきます。

<!--more-->

# goroutine は軽量だが、ブロックする可能性のある処理に対して無尽蔵に作るべきではない

`goroutine` とカーネルスレッドは多対多の関係にあり、
Go 言語処理系のスケジューラがうまいこと `goroutine` をカーネルスレッドに割り当てて実行してくれます。
しかしながら、ある `goroutine` が IO などでブロックされた場合には、これを実行しているカーネルスレッドがブロックされるということなので、
スケジューラは別のカーネルスレッドを必要とします。
そのためブロックされている `goroutine` が増えるにつれてカーネルスレッドも増えることになります。

* 参考： [why 1000 goroutine generats 1000 os threads?](https://groups.google.com/forum/#!topic/golang-nuts/2IdA34yR8gQ)


* 参考： [When a goroutine blocks on I/O how does the scheduler identify that it has stopped blocking?](https://stackoverflow.com/questions/36489498/when-a-goroutine-blocks-on-i-o-how-does-the-scheduler-identify-that-it-has-stopp)
