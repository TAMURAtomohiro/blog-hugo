#!/bin/bash
# https://gohugo.io/tutorials/github-pages-blog/
# の deploy.sh
echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the project.
hugo -t castaway # if using a theme, replace by `hugo -t <yourtheme>`

# Go To Public folder
cd public
# Add changes to git.
git add -A
cd -

# Commit changes.
msg="rebuilding site `date +"%Y/%m/%d %H:%k:%m"`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master
git subtree push --prefix=public git@github.com:tmrtmhr/tmrtmhr.github.io.git master

# 更新のあったファイルリストを抽出し CloudFront InvalidationBatch のリクエストJSONを生成
cat json/cloudfront-invalidation.json |
  filljson int InvalidationBatch.Paths.Quantity <(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | wc -l) |
  filljson [string] InvalidationBatch.Paths.Items <(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | sed -e 's/^public//g') |
  filljson string InvalidationBatch.CallerReference <(date +"osone3-%Y/%m/%d-%H:%k:%m" | tr -d '\n') |
  jq . > request.json

aws --profile osone3 cloudfront create-invalidation --cli-input-json file://request.json
