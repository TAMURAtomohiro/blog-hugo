+++
date = "2017-03-14T21:40:58+09:00"
draft = true
title = "GO言語を使っていて詰まったところ"
tags = ["go"]
+++

# ユニットテストを書いていて詰まったところ

## 表示が同一でも型が違うケース

値が同じでも型が `int` と `int64` のように異なると `!=` に引っかかるので、
たとえば以下のようにエラー時の印字を書いていると、「値が一緒なんだけど！？」と混乱します(しました)。

```go
	if (got != want) {
		t.Errorf("\ngot %v\nwant %v", got, want)
	}
```

型も印字するようにして気付きました。

```go
	if (got != want) {
		t.Errorf("\ngot %v(%v)\nwant %v(%v)", got, reflect.TypeOf(got), want, reflect.TypeOf(want))
	}
```
