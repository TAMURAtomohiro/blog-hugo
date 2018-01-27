+++
date = "2018-01-15T19:12:58+09:00"
draft = true
title = "Go言語で S3 PutObject をした際の「NotImplemented」エラー"
tags = ["aws","golang"]
+++

エラーメッセージは以下の通りです。

```
NotImplemented: A header you provided implies functionality that is not implemented
```

今回自分が間違えたのは `Reader` でなく `Buffer` を渡していたというもの。

* 間違ったコード
```
	buf := bytes.NewBuffer(bs)
	_, err := s3Cli.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(putKey),
		Body:   aws.ReadSeekCloser(buf),
	})
```

* 正しいコード

```
	reader := bytes.NewReader(bs)
	_, err := s3Cli.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(putKey),
		Body:   aws.ReadSeekCloser(reader),
	})
```

`Buffer`の`length`は以下のように計算されるので、どこまで読んだかに影響を受けます。

```
func (b *Buffer) Len() int { return len(b.buf) - b.off }
```



<!--more-->
