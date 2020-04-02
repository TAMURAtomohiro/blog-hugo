+++
date = "2020-04-03T01:04:21+09:00"
draft = true
title = "Cloud Run からのアクセスを固定IPにする"
tags = ['gcp']
+++

Cloud Run から外部の HTTP API を呼ぶ機会があり、
そのAPIの呼び出し制限のため、
IP を固定したくなった際のメモです。

現状の Cloud Run では、たとえば Cloud NAT のようなゲートウェイを介するなどしてIPを固定する機能がないため、
何かしら工夫する必要があります。
(Cloud Functions では[そういった機能が提供されている](https://cloud.google.com/functions/docs/networking/network-settings?hl=ja#associate-static-ip)ので、
将来的には CloudRun でも可能になるかもしれません)

概要は以下の通りです。

* 固定IP の GCE インスタンスを作る
* Cloud Run のコンテナ内で上の GCE インスタンスへの SSH ポートフォワーディング(トンネリング) を実行する
* アプリケーションコードが上の SSH ポートフォワーディングを介してリクエストを送るよう設定する

参考： [Cloud Run applications with static outgoing IPs](https://ahmet.im/blog/cloud-run-static-ip/)

<!--more-->

参考までに Dockerfile と

```
FROM python:3.8.1-buster

RUN apt-get install openssh-client

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . .

RUN pip install -r /app/requirements.txt

CMD /app/entrypoint.sh
```

entrypoint.sh の例を置いておきます。
(上のブログ記事とほぼ一緒です)

```
#!/usr/bin/env bash

set -ex

ssh -4 -i /app/ssh_key "tunnel@${GCE_IP?:GCE_IP environment variable not set}" \
    -N -D localhost:5000 \
    -o StrictHostKeyChecking=no &

uvicorn --host 0.0.0.0 --port $PORT --workers 8 main:api &

wait -n
```

今回、自分が書いたプログラムは Python で responder を使っており、 uvicorn の行で起動しているのがアプリケーションサーバです。
また、このアプリケーションサーバは Datastore にもアクセスしています。

# すべてのリクエストをプロキシ経由にすると権限周りで失敗する

さて、上のブログ記事では `HTTPS_PROXY` 環境変数を設定することで、
(Python なら `request[socks]` ライブラリを使うことで)
SSH トンネリングを介してリクエストを送れるようになる...とのことだったのですが、どうもうまくいかず。

Python の場合は [PySocks](https://pypi.org/project/PySocks/) が使える、とのことだったのでそっちを試してみました。

PySocks のページ、Monkeypatching の項にあるように、
すべてのリクエストをプロキシ経由にすることが可能です。

```
import socket
import socks

socks.set_default_proxy(socks.SOCKS5, "localhost", port=5000)
socket.socket = socks.socksocket
```

しかしながらこれを設定してみると以下のようなエラーが出ました。

```
Traceback (most recent call last):
File "/usr/local/lib/python3.8/site-packages/google/auth/compute_engine/credentials.py", line 96,
in refresh self._retrieve_info(request) File "/usr/local/lib/python3.8/site-packages/google/auth/compute_engine/credentials.py", line 76,
in _retrieve_info info = _metadata.get_service_account_info( File "/usr/local/lib/python3.8/site-packages/google/auth/compute_engine/_metadata.py", line 216,
in get_service_account_info return get( File "/usr/local/lib/python3.8/site-packages/google/auth/compute_engine/_metadata.py", line 148,
in get raise exceptions.TransportError( google.auth.exceptions.TransportError: Failed to retrieve http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/?recursive=true from the Google Compute Enginemetadata service. Compute Engine Metadata server unavailable
```

```
File "/usr/local/lib/python3.8/concurrent/futures/_base.py", line 328,
in _invoke_callbacks callback(self) File "/usr/local/lib/python3.8/site-packages/google/auth/transport/grpc.py", line 75,
in wrapped callback(future.result(), None) File "/usr/local/lib/python3.8/concurrent/futures/_base.py", line 432,
in result return self.__get_result() File "/usr/local/lib/python3.8/concurrent/futures/_base.py", line 388,
in __get_result raise self._exception File "/usr/local/lib/python3.8/concurrent/futures/thread.py", line 57,
in run result = self.fn(*self.args, **self.kwargs) File "/usr/local/lib/python3.8/site-packages/google/auth/transport/grpc.py", line 66,
in _get_authorization_headers self._credentials.before_request( File "/usr/local/lib/python3.8/site-packages/google/auth/credentials.py", line 124,
in before_request self.refresh(request) File "/usr/local/lib/python3.8/site-packages/google/auth/compute_engine/credentials.py", line 102,
in refresh six.raise_from(new_exc, caught_exc) File "<string>", line 3,
in raise_from google.auth.exceptions.RefreshError: Failed to retrieve http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/?recursive=true from the Google Compute Enginemetadata service. Compute Engine Metadata server unavailable
```

(注：色々試している間に出たエラーで、試した内容との対応がちゃんと記録されておらず...すみません)

ググってもエラーの内容について説明しているものは見つからず。
文言として権限エラーっぽいことと、
ComputeEngine の権限を確認しようとしていることが推測できます。
Cloud Run のコンテナ内にある Google のライブラリ上で GCE の権限チェックを行おうとしてるようですが、
GCP における権限確認処理の詳細を知らないため、なぜ GCE の権限チェックが走るのか分からず...。

(推測としては、Datastore にアクセス → アクセス元が GCE (IPなどで判断？)なので GCE の認証トークンを要求 → 認証トークンを得るために GCE の権限チェック、みたいな流れかなーと思ってます)

今回は、HTTP リクエストのみをプロキシ経由にすることで回避しました。
コードは以下のような形で、`requests` であればプロキシを指定できました。

```
resp = requests.get(
    url,
    proxies={
        "https": "socks5h://localhost:5000"
    })
```

ただ、プロキシの指定を `"https": "socks5://localhost:5000"` にするとなぜか失敗しました(エラー内容は記録なし)。
socks5 とsocks5h の違いはドメイン名の解決をクライアント側(CloudRun)でやるかプロキシ側(GCE)でやるかの違いのようですが...。

# まとめ

今回は Cloud Run からの HTTP リクエスト元を固定IPにする方法を試してみました。
知見は以下の通りです。

* コンテナからプロキシサーバにSSHトンネルを確立してリクエストを経由する
* すべての通信をプロキシサーバ経由にする場合は GCP 上の権限周りに注意する。

以上、よろしくお願いいたします。
