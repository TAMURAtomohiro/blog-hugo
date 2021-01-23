+++
date = "2017-10-29T22:09:32+09:00"
draft = true
title = "テンプレート"
tags = []
+++

<!--more-->

```
com.amazonaws.services.cloudfront.model.InvalidLambdaFunctionAssociationException: The function ARN must reference a specific function version. (The ARN must end with the version number.) ARN: arn:aws:lambda:ap-northeast-1:800247480372:function:akikan_event-cat:$LATEST (Service: AmazonCloudFront; Status Code: 400; Error Code: InvalidLambdaFunctionAssociation; Request ID: d02f7ece-bba9-11e7-9f24-2d2cc09091d9)
```

`$LATEST`でなくバージョン番号を陽に指定する。


```
com.amazonaws.services.cloudfront.model.InvalidLambdaFunctionAssociationException: The function must be in region 'us-east-1'. ARN: arn:aws:lambda:ap-northeast-1:800247480372:function:akikan_event-cat:1 (Service: AmazonCloudFront; Status Code: 400; Error Code: InvalidLambdaFunctionAssociation; Request ID: 100225e1-bbaa-11e7-bb94-3f3bd11766cc)
```

`us-east-1`にデプロイする。


```
com.amazonaws.services.cloudfront.model.InvalidLambdaFunctionAssociationException: The function has an invalid runtime for functions that are triggered by a CloudFront event: nodejs4.3 Expecting: nodejs6.10 Function: arn:aws:lambda:us-east-1:800247480372:function:akikan_event-cat:1 (Service: AmazonCloudFront; Status Code: 400; Error Code: InvalidLambdaFunctionAssociation; Request ID: 994cc886-bbaa-11e7-bb94-3f3bd11766cc)
```

runtime を node 6.10 にする。


```
com.amazonaws.services.cloudfront.model.InvalidLambdaFunctionAssociationException: The function timeout is larger than the maximum allowed for functions that are triggered by a CloudFront event: 30 Max allowed: 1 Function: arn:aws:lambda:us-east-1:800247480372:function:akikan_event-cat:2 (Service: AmazonCloudFront; Status Code: 400; Error Code: InvalidLambdaFunctionAssociation; Request ID: 0a573ac2-bbab-11e7-bb94-3f3bd11766cc)
```

[Lambda@Edge の制限](http://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html)


```
com.amazonaws.services.cloudfront.model.InvalidLambdaFunctionAssociationException: The function cannot have environment variables. Function: arn:aws:lambda:us-east-1:800247480372:function:akikan_event-cat:3 (Service: AmazonCloudFront; Status Code: 400; Error Code: InvalidLambdaFunctionAssociation; Request ID: aac41b86-bbab-11e7-bd2f-21a20d2e6c66)
```

Lambda@Edge に設定する関数は Environment Variables を持っていてはいけません。


```
com.amazonaws.services.cloudfront.model.InvalidLambdaFunctionAssociationException: The function execution role must be assumable with edgelambda.amazonaws.com as well as lambda.amazonaws.com principals. Update the IAM role and try again. Role: arn:aws:iam::800247480372:role/akikan_lambda_function (Service: AmazonCloudFront; Status Code: 400; Error Code: InvalidLambdaFunctionAssociation; Request ID: 0a576cb2-bbac-11e7-96ca-ebd929fb976c)
```

Lambda がロールを引き受けられるよう信頼ポリシーを設定する
http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-edge.html#lambda-edge-permissions
