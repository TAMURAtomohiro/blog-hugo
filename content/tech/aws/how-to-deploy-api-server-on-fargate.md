+++
date = "2018-12-02T17:38:31+09:00"
draft = true
title = "テンプレート"
tags = []
+++

<!--more-->

リポジトリ名を指定してリポジトリを作る。

`aws` コマンドでは適宜プロファイルを指定すること。( `--profile XXX` を付ける)

```
$(aws ecr get-login --no-include-email --region ap-northeast-1)
docker build -t prodriver-locator-api .
docker tag prodriver-locator-api:latest 896062197090.dkr.ecr.ap-northeast-1.amazonaws.com/prodriver-locator-api:latest
docker push 896062197090.dkr.ecr.ap-northeast-1.amazonaws.com/prodriver-locator-api:latest
```
