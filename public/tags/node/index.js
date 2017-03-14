<!DOCTYPE html>
<html lang="ja-JP">
<head>
<meta charset="utf-8">
<meta name="generator" content="Hugo 0.18.1" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Droid+Sans+Mono">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css">

  
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js"></script>
          
<link rel="stylesheet" href="/css/base.css">

<link rel="alternate" href="/index.xml" type="application/rss+xml" title="嵐の小舟より">
<title>Node.Js - 嵐の小舟より</title>
</head>
<body>
  
<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-92780964-1', 'auto');
ga('send', 'pageview');
</script>
<script async src='//www.google-analytics.com/analytics.js'></script>

  <div class="">
  <header class="castaway-header-bar">
    <nav>
      <div class="nav-wrapper castaway-site-logo">
        <div>
          <a href="/" class="brand-logo right">
            <i class="material-icons" style="margin-right: 5px;">rowing</i>
            <span class="castaway-site-title">嵐の小舟より</span>
          </a>
        </div>
      </div>
    </nav>
  </header>

  


	<main role="main">
    
    

    <div class="row">
      <div class="col s12 m12 l6 offset-l3">
        <article itemscope itemtype="http://schema.org/Blog" class="card castaway-card-link">

          <div class="card-title indigo darken-3 castaway-card-title">
            <div class="card-content">
              <div class="white-text" itemprop="headline">
                GO言語で雛形JSONの内容をコマンド出力の内容で置換する
              </div>
            </div>
          </div>
            
          <div class="card-content castaway-card-summary blue-grey-text">
            
            <div class="row">
              <div class="col castaway-date-published">
                <span>公開日: </span>
                <i class="material-icons" style="vertical-align: middle;">today</i>
                <time itemprop="datePublished" datetime="2017-03-14">2017/03/14</time>
                <span style="margin-left: 10px;"> タグ: </span>
                
                <a href="/tags/aws">
                  <div class="tag-aws waves-effect waves-teal chip">
                    aws
                  </div>
                </a>
                
                <a href="/tags/go">
                  <div class="tag-go waves-effect waves-teal chip">
                    go
                  </div>
                </a>
                
                <a href="/tags/node.js">
                  <div class="tag-node.js waves-effect waves-teal chip">
                    node.js
                  </div>
                </a>
                
                <a href="/tags/shell-script">
                  <div class="tag-shell script waves-effect waves-teal chip">
                    shell script
                  </div>
                </a>
                
              </div>
            </div>
            <p>AWS CLI によりコマンドラインから制御したりする際、リクエストパラメータとして JSON ファイルが必要になることがあります。
<a href="https://tmrtmhr.info/tech/aws/delete-updated-file-cache-on-cloudfront/">CloudFront のキャッシュを削除したいとき</a>なんかがそうです。</p>

<p>AWS CLI のコマンドごとに、リクエストJSONを生成する専用スクリプトを書くという手もありますが、
シェル上でパイプやらリダイレクトやらを駆使していい感じに JSON を生成できるある程度汎用的なスクリプトにならんものか、
という思いから試してみた結果をここに記します。
どこかに既にあるものでしたらすみません。</p>

<p>コマンド引数は以下のようになっていて、JSON ファイルは標準入力から与えます。</p>

<pre><code>filljson ${入力の型} ${キーパス} ${入力ファイル名}
</code></pre>

<p>標準入出力で JSON をやりとりするので以下のようにパイプでつなげることで
中間ファイルを作ることなく最終的なリクエスト JSON が得られます。
入力ファイル名のところには <code>bash</code> や <code>zsh</code> のプロセス置換機能を利用しています。
プロセス置換機能を使うとプログラム側からは単にファイルパスが渡ってくるように見えるので、
ファイルIOとして処理すればOKです。</p>

<pre><code>cat json/cloudfront-invalidation.json |
  filljson int InvalidationBatch.Paths.Quantity &lt;(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | wc -l) |
  filljson [string] InvalidationBatch.Paths.Items &lt;(git diff --ignore-all-space --diff-filter=M --name-only HEAD^ HEAD  public | sed -e 's/^public//g') |
  filljson string InvalidationBatch.CallerReference &lt;(date +&quot;osone3-%Y/%m/%d-%H:%k:%m&quot; | tr -d '\n') |
  jq . &gt; request.json
</code></pre>

<p></p>
          </div>

          <div class="card-action castaway-card-footer">
            <a class="btn waves-effect waves-light" href="/tech/replace-a-part-of-json-with-command-output/">この記事を読む</a>
          </div>
		    </article>
      </div>
    </div>
      
    

	</main>


</div>
</body>
</html>
