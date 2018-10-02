+++
date = "2018-09-29T17:06:10+09:00"
draft = true
title = "テンプレート"
tags = []
+++

```
FROM python:3.6
```

```
# python /usr/local/lib/python3.6/ctypes/util.py
libm.so.6
libc.so.6
libbz2.so.1.0
Traceback (most recent call last):
  File "/usr/local/lib/python3.6/ctypes/util.py", line 337, in <module>
    test()
  File "/usr/local/lib/python3.6/ctypes/util.py", line 332, in test
    print(cdll.LoadLibrary("libm.so"))
  File "/usr/local/lib/python3.6/ctypes/__init__.py", line 426, in LoadLibrary
    return self._dlltype(name)
  File "/usr/local/lib/python3.6/ctypes/__init__.py", line 348, in __init__
    self._handle = _dlopen(self._name, mode)
OSError: /usr/lib/x86_64-linux-gnu/libm.so: invalid ELF header
```


<!--more-->

# python /usr/local/lib/python3.6/ctypes/util.py
libm.so.6
libc.so.6
libbz2.so.1.0
Traceback (most recent call last):
  File "/usr/local/lib/python3.6/ctypes/util.py", line 337, in <module>
    test()
  File "/usr/local/lib/python3.6/ctypes/util.py", line 332, in test
    print(cdll.LoadLibrary("libm.so"))
  File "/usr/local/lib/python3.6/ctypes/__init__.py", line 426, in LoadLibrary
    return self._dlltype(name)
  File "/usr/local/lib/python3.6/ctypes/__init__.py", line 348, in __init__
    self._handle = _dlopen(self._name, mode)
OSError: /usr/lib/x86_64-linux-gnu/libm.so: invalid ELF header
