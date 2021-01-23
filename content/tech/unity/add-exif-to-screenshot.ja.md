+++
draft = false
title = "Unity でスクリーンショット画像に Exif 情報を追加する"
tags = ["unity","android"]
date = "2018-02-18T19:54:05+09:00"
+++

2018-02 時点では Unity に Exif を扱えるライブラリがないようです。

なので Android ライブラリを呼び出して実装します。
(iOS では試していないですが、同様のアプローチでいけるんじゃないでしょうか)

<!--more-->

Android での Exif 情報読み書きについては以下の記事を参考にしました。

* [Android開発 | 画像のExif属性に位置情報や撮影日時を保存する方法](http://mussyu1204.myhome.cx/wordpress/it/?p=161)

<!-- そもそもの発端は、 -->
<!-- 2018/03/01 に安らかに眠ることになった Google の Tango を触っていたときに、 -->
<!-- スクリプトから保存した AR 表示スクリーンショットに位置情報をつけたい、というものでした。 -->

<!-- 自分は Unity もスマホアプリ開発も素人でしたので、 -->
<!-- まあそれくらいライブラリあるんじゃないの？と軽い気持ちで調べ始めたのです。 -->

<!-- しかしながらいくら調べてみても Unity での Asset や C# のライブラリが見つからず、 -->
<!-- これは Exif の規格調べて自前でバイト列いじらないといけないのか？ -->
<!-- と悲嘆に暮れていました。 -->

<!-- そんな矢先、天(Google 検索)から一筋の光明が差したのです。 -->
<!-- それが Android ネイティブライブラリ呼び出しでした。 -->

今回のケースでは[Android ヘルパークラス](https://docs.unity3d.com/ja/540/Manual/PluginsForAndroid.html)を利用します。
コード例(Unity 5.6.5, C#)は以下の通りです。

```
ExifLocation exifLocation = new ExifLocation(gps.Location);
AndroidJavaObject ex = new AndroidJavaObject("android.media.ExifInterface", path);
ex.Call("setAttribute","GPSLatitudeRef", exifLocation.latitudeRef);
ex.Call("setAttribute","GPSLatitude", exifLocation.latitude);
ex.Call("setAttribute","GPSLongitudeRef", exifLocation.longitudeRef);
ex.Call("setAttribute","GPSLongitude",exifLocation.longitude);
ex.Call("saveAttributes");
```

ここで、`gps.Location` は Unity で取得できる GPS 情報(`Input.location.lastData`) です。
また、`ExifLocation` はExif形式への変換ロジックです。
これについては後ろのほうにサンプル実装を置いておきます。

まず、
```
AndroidJavaObject ex = new AndroidJavaObject("android.media.ExifInterface", path);
```
として、`path`にあるJPG画像を扱う ExifInterface オブジェクトを作ります。
あとは
```
ex.Call("setAttribute",...);
```
として属性を追加し、最後に
```
ex.Call("saveAttributes");
```
で保存して完了です。

`GPSLatitude` などの Exif 属性名は、Android の ExifInterface クラスで `TAG_GPS_LATITUDE` というスタティックな定数として定義されていますが、
C# の文字列として直接渡してもOKです。

最後に Exif 形式への変換ロジックについてサンプル実装を置いておきます。

```
internal class ExifLocation {
    public String longitudeRef;
    public String longitude;
    public String latitudeRef;
    public String latitude;

    public ExifLocation(LocationInfo location) {
        String[] lonDMS = Convert(location.longitude);
        if (lonDMS[0].IndexOf("-") == 0) {
            this.longitudeRef = "W";
        } else {
            this.longitudeRef = "E";
        }

        this.longitude = ToExifFormat(lonDMS);

        String[] latDMS = Convert(location.latitude);
        if (latDMS[0].IndexOf("-") == 0) {
            this.latitudeRef = "S";
        } else {
            this.latitudeRef = "N";
        }
        this.latitude = ToExifFormat(latDMS);
    }

    public String ToExifFormat(String[] nums) {
        StringBuilder sb = new StringBuilder();
        sb.Append(nums[0].Replace("-", ""));
        sb.Append("/1,");
        sb.Append(nums[1]);
        sb.Append("/1,");
        int index = nums[2].IndexOf('.');
        if (index == -1) {
            sb.Append(nums[2]);
            sb.Append("/1");
        } else {
            int digit = nums[2].Substring(index + 1).Length;
            int second = (int)(Double.Parse(nums[2]) * Math.Pow(10, digit));
            sb.Append(second.ToString());
            sb.Append("/1");
            for (int i = 0; i < digit; i++) {
                sb.Append("0");
            }
        }
        return sb.ToString();
    }

    public String[] Convert(float coord) {
        int degree = (int)coord;
        int minute = (int)((coord - degree) * 60);
        float second = (coord - degree - (minute / 60f)) * 3600;
        return new String[]{ degree.ToString(), minute.ToString(), second.ToString("F7") };
    }
}
```
