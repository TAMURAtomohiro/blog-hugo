+++
draft = false
title = "Unity: add Exif to Screenshot JPEG"
tags = ["unity","android"]
date = "2018-02-18T19:52:44+09:00"
+++

at 2018-02, Unity has no Exif Library.
and I can't find Unity Exif Assets.

So, if we want to add Exif to screenshot image, we should call Android Library.
(This article shows only how to handle Exif on Android/Unity.
But I think that the same method can be used on iOS/Unity.)

<!--more-->

We use [Android Helper Class](https://docs.unity3d.com/560/Documentation/Manual/PluginsForAndroid.html).
Sample Code (Unity 5.6.5, C#) is following.

```
ExifLocation exifLocation = new ExifLocation(Input.location.lastData);
AndroidJavaObject ex = new AndroidJavaObject("android.media.ExifInterface", path);
ex.Call("setAttribute","GPSLatitudeRef", exifLocation.latitudeRef);
ex.Call("setAttribute","GPSLatitude", exifLocation.latitude);
ex.Call("setAttribute","GPSLongitudeRef", exifLocation.longitudeRef);
ex.Call("setAttribute","GPSLongitude",exifLocation.longitude);
ex.Call("saveAttributes");
```

`ExifLocation` is conversion logic, from `LocationInfo` to Exif format.
I'll present sample code later.
`path` is image file path.

We can get Android Object ("android.media.ExifInterface") by following code.

```
AndroidJavaObject ex = new AndroidJavaObject("android.media.ExifInterface", path);
```

This object handle the image placed on the `path`.
So we just use
```
ex.Call("setAttribute",...);
```
to set arbitrary attributes.
Finally, you write
```
ex.Call("saveAttributes");
```
and save it all.

Exif attribute name (e.g. "GPSLatitude") defined at ExifInterface class on Android ( static constant `TAG_GPS_LATITUDE` ),
but you can pass it as C# String.

Here is sample code (convesion logic to Exif format).

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
