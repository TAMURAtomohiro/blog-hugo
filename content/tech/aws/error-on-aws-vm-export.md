+++
date = "2019-03-19T01:17:45+09:00"
draft = true
title = "AWS VM Export のエラー"
tags = ['aws']
+++

<!--more-->

コマンド例:

```
aws \
  --region ap-northeast-1 \
  --profile infra_studio_goga_tamura \
  ec2 create-instance-export-task \
  --instance-id i-0fc5d284146e9487c \
  --target-environment vmware \
  --export-to-s3-task DiskImageFormat=VMDK,ContainerFormat=ova,S3Bucket=infra-studio,S3Prefix=vm-export/
```


```
An error occurred (AuthFailure) when calling the CreateInstanceExportTask operation: vm-import-export@amazon.com must have WRITE and READ_ACL permission on the S3 bucket.
```

アクセス権限 > アクセスコントロールリスト > 他のAWSアカウントのアクセス

で 以下のアカウントに「オブジェクトの書き込み」と「バケットのアクセス権限の読み取り」をつける。

`vm-import-export@amazon.com`

```
{
    "ExportTask": {
        "ExportTaskId": "export-i-087153f36b3b9c32d",
        "ExportToS3Task": {
            "ContainerFormat": "ova",
            "DiskImageFormat": "vmdk",
            "S3Bucket": "infra-studio",
            "S3Key": "vm-export/export-i-087153f36b3b9c32d.ova"
        },
        "InstanceExportDetails": {
            "InstanceId": "i-0fc5d284146e9487c",
            "TargetEnvironment": "vmware"
        },
        "State": "active"
    }
}
```

```
aws ec2 describe-export-tasks --export-task-ids export-i-087153f36b3b9c32d
```

```
{
    "ExportTasks": [
        {
            "ExportTaskId": "export-i-087153f36b3b9c32d",
            "ExportToS3Task": {
                "ContainerFormat": "ova",
                "DiskImageFormat": "vmdk",
                "S3Bucket": "infra-studio",
                "S3Key": "vm-export/export-i-087153f36b3b9c32d.ova"
            },
            "InstanceExportDetails": {},
            "State": "active"
        }
    ]
}
```


```
{
    "ExportTasks": [
        {
            "ExportTaskId": "export-i-087153f36b3b9c32d",
            "ExportToS3Task": {
                "ContainerFormat": "ova",
                "DiskImageFormat": "vmdk",
                "S3Bucket": "infra-studio",
                "S3Key": "vm-export/export-i-087153f36b3b9c32d.ova"
            },
            "InstanceExportDetails": {},
            "State": "completed"
        }
    ]
}
```
