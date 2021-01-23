+++
date = "2019-07-17T12:37:37+09:00"
draft = true
title = "Kubernetes 勉強メモ"
tags = []
+++

<!--more-->

ストレージオプション ディシジョン ツリー：

構造化データ？ - No -> Mobile SDK が必要? - No -> Cloud Storage
 |                                     - Yes -> Firebase Storage
 Yes
 v
分析目的？ - Yes -> 更新あり/低レイテンシが必要？ - Yes -> BigTable
 |                                           -> No -> BigQuery
 No
 v
データに関係(リレーション)が必要？ - Yes -> 水平スケールが必要？ - Yes -> Cloud Spanner
 |                                                        - No -> CloudSQL
 No
 v
Mobile SDK が必要? -> No -> Cloud Datastore
 |
 Yes
 v
Firebase Realtime DB

BigTable と Datastore の違い。
BigTable はインスタンスベースなのでノード数に応じた性能を確保できる。
予測可能なレイテンシが必要であれば BigTable。


Cloud BigTable
https://cloud.google.com/bigtable/docs/overview?hl=ja
> 極めて低いレイテンシで単一キーの超大容量データを格納するのに理想的です。 低レイテンシで高い読み取り / 書き込みスループットを実現できるため、MapReduce オペレーションに理想的なデータソースです。
BigTable は Key-Value ストア。

> Cloud Bigtable は非構造化 Key-Value データ（それぞれの値のサイズが 10 MB 以下）を扱う、非常に高いスループットとスケーラビリティを必要とするアプリケーションに最適です。また、MapReduce の一括オペレーション、ストリーム処理と分析、機械学習アプリケーションといった用途におけるストレージ エンジンとしても優れています。
> Cloud Bigtable を使用すると、以下のすべてのタイプのデータを格納してクエリできます。
>
> 時系列データ。複数のサーバーにおける時間の経過に伴う CPU とメモリの使用状況など。
> マーケティング データ。購入履歴やお客様の好みなど。
> 金融データ。取引履歴、株価、外国為替相場など。
> IoT（モノのインターネット）データ。電力量計と家庭電化製品からの使用状況レポートなど。
> グラフデータ。ユーザー間の接続状況に関する情報など。

Bigtable はゾーンに置く
https://cloud.google.com/bigtable/docs/locations?hl=ja

Cloud Dataproc
https://cloud.google.com/dataproc/docs/concepts/overview?hl=ja
> Cloud Dataproc は、オープンソースのデータツールを利用してバッチ処理、クエリ実行、ストリーミング、機械学習を行えるマネージド Spark / Hadoop サービスです。


GCP ケーススタディ
# Mountkirk Games
https://cloud.google.com/certification/guides/cloud-architect/casestudy-mountkirkgames-rev2?hl=ja


技術的要件
[ゲーム バックエンド プラットフォームの要件]

> ゲームのアクティビティに基づいて動的にスケールアップまたはスケールダウンする。
オートスケール。本文中の計画として、コンピュートには GCEらしい。

> トランザクション データベース サービスに接続して、ユーザー プロフィールとゲーム状態を管理する。
モバイルプラットフォームなので Mobile SDK が必要な Firebase RealtimeDB ?
トランザクションからすると CloudSpanner、CloudSQL、Datastore、BigTable が候補。
ゲーム状態のテーブルが UserID をキーにしてリレーションでつなぎそうなので
水平スケールで Cloud Spanner?

> 将来の分析のために、時系列データベース サービスでゲームの更新情報を保存する。
時系列、分析あたりのキーワードは BigTable

> システムが拡張するのに従って、バックログの処理によってデータが失われないことを確認する。
タスクキューを使うという話？ それなら Pub/Sub

> 強化された Linux ディストリビューションを実行する。
OSのカスタマイズ。GCE。強化されたは enhanced ?

[ゲーム分析プラットフォームの要件]

> ゲームのアクティビティに基づいて動的にスケールアップまたはスケールダウンする。
上と同じ。

> 着信データをゲームサーバーから迅速に直接処理する。
arrived data? 要件不明。

> 低速なモバイル ネットワークが原因で遅延したデータを処理する。
Pub/Sub? 要件不明。

> 10 TB 以上の履歴データに対してクエリを実行できるようにする。
ビッグデータへの分析なので BigQuery。

> ユーザーのモバイル デバイスから定期的にアップロードされるファイルを処理する。
Cloud Storage + Cloud Functions ?


# Dress4Win
https://cloud.google.com/certification/guides/cloud-architect/casestudy-dress4win-rev2?hl=ja


## ビジネス要件
> 本番環境を柔軟にスケールできる、信頼性と再現性の高い環境を構築する。
オートスケール。オンプレのデータセンターで稼動しているサーバー(非コンテナ)があるため、GCE？
OSS を利用しているようなので GKE もあり。
Apache Hadoop/Spark クラスタは Cloud Dataproc。

> クラウドに最適なセキュリティ ポリシーと Identity and Access Management（IAM）を定義し、それらを遵守することでセキュリティを強化する。
IAM ロール。
バケット ACL。

> 新しいリソースを迅速にプロビジョニングし、ビジネスの俊敏性とイノベーションのスピードを向上させる。
GCE や GKE でOK? 要件不明。

> アーキテクチャを分析し、クラウドでのパフォーマンス向上のために改善する。
要件不明

## 技術的要件
> クラウドで非本番環境を簡単に作成する。

> リソースをクラウドにプロビジョニングするための自動化フレームワークを実装する。
GKE で kubectl ?

> オンプレミス データセンターまたはクラウドへのアプリケーションのデプロイのための継続的なデプロイ プロセスを実装する。
オンプレ、クラウドのハイブリッド構成、というところからすると kubernetes のような...

> 緊急時にクラウドへの本番環境のフェイルオーバーをサポートする。
ハイブリッド構成？ Anthos がそういう目的だが、新しすぎる。

> 転送時も保存時もデータを暗号化する。
暗号化オプションは3つ。
- デフォルト暗号化
- Cloud KMS を利用した CMEK (Custmer Managed Encryption Key)
- 取得/保存時に指定する CSEK (Customer Specified Encryption Key)

> データセンターの本番環境とクラウド環境の間を複数のプライベート接続でつなぐ。
オンプレとのネットワーキング。
https://cloud.google.com/hybrid-connectivity/?hl=ja

- Cloud interconnect: 10GB/s
GCP の VPC とオンプレを接続する。
- Cloud VPN: 3GB/s
- Direct Peering
- Career Peering
ダイレクトピアリングは Internet を経由せずに G Suite などのサービスを利用できる。
> Google とのダイレクト ピアリングでは、Google とお客様のオンプレミス ネットワーク間の BGP ルートを交換します。ダイレクト ピアリングが確立すると、お客様のオンプレミス ネットワークから、Google Cloud Platform プロダクトのフルパッケージを含む Google サービスに、直接アクセスできます。


# TerramEarch
https://cloud.google.com/certification/guides/cloud-architect/casestudy-terramearth-rev2?hl=ja
グローバル企業
2000万台の車両からの1秒あたり120項目のセンシングデータ。メンテナンス時にダウンロード。
20万台はモバイル回線で接続。1 日あたり合計約 9 TB。


## ビジネス要件
> 車両の計画外停止時間を 1 週間未満に短縮する。
20万台から送られてくるストリーミングデータは BigTable ?
クォータがあるので難しいか。
https://cloud.google.com/bigtable/quotas?hl=ja#storage-per-node
BigQuery にストリーミングデータを投入できるのでこのケースではこちら。
https://cloud.google.com/bigquery/streaming-data-into-bigquery?hl=ja

> 自社製品の使われ方に関してさらに多くのデータをディーラー網に提供し、新しい製品やサービスをより適切に提案できるようにする。
BigQuery に蓄積したデータを様々な方法で集計？

> 急成長を続ける農業ビジネスでの種子供給業者や肥料供給業者との提携を中心にさまざまな企業と提携し、魅力的な製品やサービスを共同で顧客に提供できるようになる。
要件不明。

## 技術的要件
> 単一のデータセンターでの管理にとどまらず、アメリカの中西部と東海岸へのレイテンシを短縮する。


> バックアップ戦略を作成する。
Cloud Storage にセンサーデータを保存するなら Coldline。
BigQuery からの export なら Dataflow かも。

> 機器からデータセンターへのデータ転送のセキュリティを向上させる。
Cloud IoT Core
https://cloud.google.com/iot-core/?hl=ja

> データ ウェアハウス内のデータ品質を向上させる。
要件不明

> お客様のデータと機器のデータを使用して、お客様のニーズを予測する。
BigQuery ML？
Cloud Machine Leaning Engine (現在の AI Platform)
MLモデルを作成してデバイスに配布する。



ソリューションのページを読む
https://cloud.google.com/solutions/transferring-big-data-sets-to-gcp?hl=ja
https://cloud.google.com/solutions/ からのリンクがない？


Cloud Architect 受講報告_20181227_伊藤.docx https://drive.google.com/drive/u/0/folders/15AUOONLmpMMCLo0A7Ti1xs6-tTajjEeD

* 70TBのデータをオンプレからGCSにUPしたい。その場合のGoogle推奨はどれか
オンプレからなら gsutil

* GAEのデータベースとしてオンプレのものを使用する必要がある。通信のセキュリティ要件が厳しい場合にどうすれば良いか
GAEのファイアウォールルール？
GAEからVPC - VPN - OnPrem のアクセスは最新の機能っぽいが...
https://medium.com/google-cloud-jp/serverless-whats-announced-in-next19-4e9cc51a178c

* GKEのクラスタ作成とコンテナデプロイをコマンドでどう実施するか
gcloud container clusters create myCluster
kubectl run app --image gcr.io/google-samples/hello-app:1.0

* GCSのストレージクラスを選択する問題

* GCPとオンプレの接続で20Gbps必要な場合にどう接続するのが良いか
Partner interconnect

* spinnakerとjenkinsどちらでアプリをCI/CDした方が良いか
Spinnaker ?
https://cloud.google.com/solutions/continuous-delivery/?hl=ja

* Mountkirk Games をどうGCPサービスで置き換えをしたら良いか：5問くらい
  * 時系列データベースサービスに最適なプロダクト
BigTable

  * トランザクションデータベースに最適なプロダクト
モバイルなので Firebase ?

  * ユーザのレイテンシをどうやって測定したらよいか
  Stackdriver Trace

  * KPIをGCPサービスを利用して算出する方法

  * 将来GCPサービスが拡張された場合に備えてどうしたら良いか

  * インターネットに出れないGCEに対してソフトウェアをインストールしたい場合に、バイナリファイルをどう受け渡せばよいか
  Cloud Shell?

  * 複数のオンプレシステムの散乱しているログファイルを集約し分析するにはどうしたら良いか
  StackDriver Logging

* GDPR対応
  * BigQueryに入ったレコードを一定期間が経過した場合にどう削除したらよいか
  defaultTableExpirationMs というプロパティを設定
  * GCSに格納したファイルを一定期間が経過した場合にどう削除したらよいか
  LifeCycle 設定
  * GCPサービスでGDPRに対応する場合にどうすれば良いか
  サービス次第だがセキュリティ系の問題？ VPN とかアクセス権限設定(バケットACLなど)
* GCEのオートスケールに関する問題
- 平均 CPU 使用率
- 使用率または 1 秒あたりのリクエスト数のいずれかに基づいた HTTP 負荷分散処理機能
- Stackdriver Monitoring の指標

* GCPサービスでPCI/DSSに対応する場合にどうすれば良いか
クレジットカードのセキュリティ基準
ネットワーク制限やデータの保護を行う

* Cloud SQLを高可用性にするにはどうしたら良いか
同リージョン別ゾーンに フェイルオーバーレプリカ

* 2つのリージョンで1VPCをオンプレとVPN接続する場合にどうしたら良いか
Cloud VPN を使う？
Cloud VPN Gateway が Regional External IP を持っているのでここに繋ぐ。
GCPの場合、VPC内では別リージョンでもプライベートIPで接続できる
https://cloud.google.com/vpn/docs/concepts/overview?hl=ja

相互接続タイプの選択
https://cloud.google.com/interconnect/docs/how-to/choose-type?hl=ja

* GCEのヘルスチェックで異常が検知されて2秒ごとに再起動してしまう。Linuxエンジニアが障害を見ようとする場合にどうしたら良いか

* GKEのポッドが異常で再起動を繰り返してしまう。ログをどう見たらよいか
Stackdriver Logging を ON にする

* オンプレのデータをPub/Subを経由してGCPにUPしたい場合、どうセキュリティの設定をすれば良いか。暗号化キーはユーザのものを使用する
暗号化キーをユーザー指定のものにするということなので CSEK ？

* GKEのアプリを最小限の停止で新バージョンにする方法
kubectl set image ...
kubectl -f deployments/deployment.yaml apply
など？ローリングアップデート

* オンプレADを管理用として残してGCPで認証したい場合にどうするか
オンプレなので VPN 系？
Cloud Directory Sync など
https://cloud.google.com/solutions/federating-gcp-with-active-directory-synchronizing-user-accounts?hl=ja
