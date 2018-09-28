+++
date = "2018-06-13T16:04:26+09:00"
draft = true
title = "EC2: t2.large と m5.large の比較"
tags = ["aws"]
+++

EC2 のインスタンスタイプを選ぶ機会があったので改めて確認したところ、
t2.large と m5.large では価格差が月2ドル程度とほぼなく、
CPU・ネットワーク帯域ともに m5.large のほうが良い性能でありました。

M5 は東京リージョンでは2018/04に提供開始した
参考: [新しい世代のEC2インスタンスタイプ M5/C5 が東京リージョンで利用可能になりました](https://dev.classmethod.jp/cloud/aws/ec2-m5-c5-in-ap-northeast-1/)


<!--more-->

2018/06/11時点で[Amazon EC2 料金](https://aws.amazon.com/jp/ec2/pricing/on-demand/)を見ると、
以下のようになっており、ひと月(31日)の料金で2ドルも変わりません。

インスタンスタイプ | vCPU | ECU | メモリ | インスタンスストレージ | Linux/UNIX 料金
---							 | --- | ---	| ---		| ---									| ---
t2.large | 2 | 可変 | 8 | EBS のみ | $0.1216 /1 時間
m5.large | 2 | 10 | 8 | EBS のみ | $0.124 /1 時間


[CPUクレジットおよびベースラインパフォーマンス](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/t2-credits-baseline-concepts.html)

[S3の値下げと、低冗長化ストレージからの移行について](http://aws.typepad.com/sajp/2016/12/s3-price-down-and-migratiion.html)

<!-- t2.large -->
<!-- ``` -->
<!-- [ec2-user@ip-172-31-42-5 ~]$ cat /proc/cpuinfo -->
<!-- pocessor	: 0 -->
<!-- vendor_id	: GenuineIntel -->
<!-- cpu family	: 6 -->
<!-- model		: 79 -->
<!-- model name	: Intel(R) Xeon(R) CPU E5-2686 v4 @ 2.30GHz -->
<!-- stepping	: 1 -->
<!-- microcode	: 0xb00002a -->
<!-- cpu MHz		: 2295.087 -->
<!-- cache size	: 46080 KB -->
<!-- physical id	: 0 -->
<!-- siblings	: 2 -->
<!-- core id		: 0 -->
<!-- cpu cores	: 2 -->
<!-- apicid		: 0 -->
<!-- initial apicid	: 0 -->
<!-- fpu		: yes -->
<!-- fpu_exception	: yes -->
<!-- cpuid level	: 13 -->
<!-- wp		: yes -->
<!-- flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx rdtscp lm constant_tsc rep_good nopl xtopology cpuid pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm cpuid_fault invpcid_single pti fsgsbase bmi1 avx2 smep bmi2 erms invpcid xsaveopt -->
<!-- bugs		: cpu_meltdown spectre_v1 spectre_v2 -->
<!-- bogomips	: 4600.13 -->
<!-- clflush size	: 64 -->
<!-- cache_alignment	: 64 -->
<!-- address sizes	: 46 bits physical, 48 bits virtual -->
<!-- power management: -->

<!-- processor	: 1 -->
<!-- vendor_id	: GenuineIntel -->
<!-- cpu family	: 6 -->
<!-- model		: 79 -->
<!-- model name	: Intel(R) Xeon(R) CPU E5-2686 v4 @ 2.30GHz -->
<!-- stepping	: 1 -->
<!-- microcode	: 0xb00002a -->
<!-- cpu MHz		: 2295.087 -->
<!-- cache size	: 46080 KB -->
<!-- physical id	: 0 -->
<!-- siblings	: 2 -->
<!-- core id		: 1 -->
<!-- cpu cores	: 2 -->
<!-- apicid		: 2 -->
<!-- initial apicid	: 2 -->
<!-- fpu		: yes -->
<!-- fpu_exception	: yes -->
<!-- cpuid level	: 13 -->
<!-- wp		: yes -->
<!-- flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx rdtscp lm constant_tsc rep_good nopl xtopology cpuid pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm cpuid_fault invpcid_single pti fsgsbase bmi1 avx2 smep bmi2 erms invpcid xsaveopt -->
<!-- bugs		: cpu_meltdown spectre_v1 spectre_v2 -->
<!-- bogomips	: 4600.13 -->
<!-- clflush size	: 64 -->
<!-- cache_alignment	: 64 -->
<!-- address sizes	: 46 bits physical, 48 bits virtual -->
<!-- power management: -->
<!-- ``` -->


<!-- m5.large -->
<!-- ``` -->
<!-- [ec2-user@ip-172-31-42-5 ~]$ cat /proc/cpuinfo -->
<!-- processor	: 0 -->
<!-- vendor_id	: GenuineIntel -->
<!-- cpu family	: 6 -->
<!-- model		: 85 -->
<!-- model name	: Intel(R) Xeon(R) Platinum 8175M CPU @ 2.50GHz -->
<!-- stepping	: 4 -->
<!-- microcode	: 0x200003a -->
<!-- cpu MHz		: 3049.929 -->
<!-- cache size	: 33792 KB -->
<!-- physical id	: 0 -->
<!-- siblings	: 2 -->
<!-- core id		: 0 -->
<!-- cpu cores	: 1 -->
<!-- apicid		: 0 -->
<!-- initial apicid	: 0 -->
<!-- fpu		: yes -->
<!-- fpu_exception	: yes -->
<!-- cpuid level	: 13 -->
<!-- wp		: yes -->
<!-- flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm mpx avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves ida arat pku ospke -->
<!-- bugs		: cpu_meltdown spectre_v1 spectre_v2 -->
<!-- bogomips	: 5000.00 -->
<!-- clflush size	: 64 -->
<!-- cache_alignment	: 64 -->
<!-- address sizes	: 46 bits physical, 48 bits virtual -->
<!-- power management: -->

<!-- processor	: 1 -->
<!-- vendor_id	: GenuineIntel -->
<!-- cpu family	: 6 -->
<!-- model		: 85 -->
<!-- model name	: Intel(R) Xeon(R) Platinum 8175M CPU @ 2.50GHz -->
<!-- stepping	: 4 -->
<!-- microcode	: 0x200003a -->
<!-- cpu MHz		: 3111.582 -->
<!-- cache size	: 33792 KB -->
<!-- physical id	: 0 -->
<!-- siblings	: 2 -->
<!-- core id		: 0 -->
<!-- cpu cores	: 1 -->
<!-- apicid		: 1 -->
<!-- initial apicid	: 1 -->
<!-- fpu		: yes -->
<!-- fpu_exception	: yes -->
<!-- cpuid level	: 13 -->
<!-- wp		: yes -->
<!-- flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm mpx avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves ida arat pku ospke -->
<!-- bugs		: cpu_meltdown spectre_v1 spectre_v2 -->
<!-- bogomips	: 5000.00 -->
<!-- clflush size	: 64 -->
<!-- cache_alignment	: 64 -->
<!-- address sizes	: 46 bits physical, 48 bits virtual -->
<!-- power management: -->

<!-- ``` -->

```
sudo yum -y install perl perl-Time-HiRes gcc
wget https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/byte-unixbench/UnixBench5.1.3.tgz
tar zxvf UnixBench5.1.3.tgz
cd UnixBench
```

m5.large
```
[ec2-user@ip-172-31-42-48 UnixBench]$ time ./Run
make all
make[1]: Entering directory `/home/ec2-user/benchmark/UnixBench'
Checking distribution of files
./pgms  exists
./src  exists
./testdir  exists
./tmp  exists
./results  exists
make[1]: Leaving directory `/home/ec2-user/benchmark/UnixBench'
sh: 3dinfo: command not found

   #    #  #    #  #  #    #          #####   ######  #    #   ####   #    #
   #    #  ##   #  #   #  #           #    #  #       ##   #  #    #  #    #
   #    #  # #  #  #    ##            #####   #####   # #  #  #       ######
   #    #  #  # #  #    ##            #    #  #       #  # #  #       #    #
   #    #  #   ##  #   #  #           #    #  #       #   ##  #    #  #    #
    ####   #    #  #  #    #          #####   ######  #    #   ####   #    #

   Version 5.1.3                      Based on the Byte Magazine Unix Benchmark

   Multi-CPU version                  Version 5 revisions by Ian Smith,
                                      Sunnyvale, CA, USA
   January 13, 2011                   johantheghost at yahoo period com


1 x Dhrystone 2 using register variables  1 2 3 4 5 6 7 8 9 10

1 x Double-Precision Whetstone  1 2 3 4 5 6 7 8 9 10

1 x Execl Throughput  1 2 3

1 x File Copy 1024 bufsize 2000 maxblocks  1 2 3

1 x File Copy 256 bufsize 500 maxblocks  1 2 3

1 x File Copy 4096 bufsize 8000 maxblocks  1 2 3

1 x Pipe Throughput  1 2 3 4 5 6 7 8 9 10

1 x Pipe-based Context Switching  1 2 3 4 5 6 7 8 9 10


1 x Process Creation  1 2 3

1 x System Call Overhead  1 2 3 4 5 6 7 8 9 10

1 x Shell Scripts (1 concurrent)  1 2 3

1 x Shell Scripts (8 concurrent)  1 2 3

2 x Dhrystone 2 using register variables  1 2 3 4 5 6 7 8 9 10

2 x Double-Precision Whetstone  1 2 3 4 5 6 7 8 9 10

2 x Execl Throughput  1 2 3

2 x File Copy 1024 bufsize 2000 maxblocks  1 2 3

2 x File Copy 256 bufsize 500 maxblocks  1
 2 3

2 x File Copy 4096 bufsize 8000 maxblocks  1 2 3

2 x Pipe Throughput  1 2 3 4 5 6 7 8 9 10

2 x Pipe-based Context Switching  1 2 3 4 5 6 7 8 9 10

2 x Process Creation  1 2 3

2 x System Call Overhead  1 2 3 4 5 6 7 8 9 10

2 x Shell Scripts (1 concurrent)  1 2 3

2 x Shell Scripts (8 concurrent)  1 2 3

========================================================================
   BYTE UNIX Benchmarks (Version 5.1.3)

   System: ip-172-31-42-48.ap-northeast-1.compute.internal: GNU/Linux
   OS: GNU/Linux -- 4.14.33-59.37.amzn2.x86_64 -- #1 SMP Thu May 3 21:25:31 UTC 2018
   Machine: x86_64 (x86_64)
   Language: en_US.utf8 (charmap="UTF-8", collate="UTF-8")
   CPU 0: Intel(R) Xeon(R) Platinum 8175M CPU @ 2.50GHz (5000.0 bogomips)
          Hyper-Threading, x86-64, MMX, Physical Address Ext, SYSENTER/SYSEXIT, SYSCALL/SYSRET
   CPU 1: Intel(R) Xeon(R) Platinum 8175M CPU @ 2.50GHz (5000.0 bogomips)
          Hyper-Threading, x86-64, MMX, Physical Address Ext, SYSENTER/SYSEXIT, SYSCALL/SYSRET
   06:01:06 up 2 days, 33 min,  1 user,  load average: 0.01, 0.01, 0.00; runlevel 5

------------------------------------------------------------------------
Benchmark Run: 水  6月 13 2018 06:01:06 - 06:29:10
2 CPUs in system; running 1 parallel copy of tests

Dhrystone 2 using register variables       37162629.5 lps   (10.0 s, 7 samples)
Double-Precision Whetstone                     4653.9 MWIPS (9.9 s, 7 samples)
Execl Throughput                               4304.9 lps   (30.0 s, 2 samples)
File Copy 1024 bufsize 2000 maxblocks        705262.6 KBps  (30.0 s, 2 samples)
File Copy 256 bufsize 500 maxblocks          186988.5 KBps  (30.0 s, 2 samples)
File Copy 4096 bufsize 8000 maxblocks       2071145.0 KBps  (30.0 s, 2 samples)
Pipe Throughput                              978391.0 lps   (10.0 s, 7 samples)
Pipe-based Context Switching                  69288.7 lps   (10.0 s, 7 samples)
Process Creation                              10994.2 lps   (30.0 s, 2 samples)
Shell Scripts (1 concurrent)                   7331.7 lpm   (60.0 s, 2 samples)
Shell Scripts (8 concurrent)                   1153.1 lpm   (60.0 s, 2 samples)
System Call Overhead                         734192.8 lps   (10.0 s, 7 samples)

System Benchmarks Index Values               BASELINE       RESULT    INDEX
Dhrystone 2 using register variables         116700.0   37162629.5   3184.5
Double-Precision Whetstone                       55.0       4653.9    846.2
Execl Throughput                                 43.0       4304.9   1001.1
File Copy 1024 bufsize 2000 maxblocks          3960.0     705262.6   1781.0
File Copy 256 bufsize 500 maxblocks            1655.0     186988.5   1129.8
File Copy 4096 bufsize 8000 maxblocks          5800.0    2071145.0   3570.9
Pipe Throughput                               12440.0     978391.0    786.5
Pipe-based Context Switching                   4000.0      69288.7    173.2
Process Creation                                126.0      10994.2    872.6
Shell Scripts (1 concurrent)                     42.4       7331.7   1729.2
Shell Scripts (8 concurrent)                      6.0       1153.1   1921.8
System Call Overhead                          15000.0     734192.8    489.5
                                                                   ========
System Benchmarks Index Score                                        1116.4

------------------------------------------------------------------------
Benchmark Run: 水  6月 13 2018 06:29:10 - 06:57:21
2 CPUs in system; running 2 parallel copies of tests

Dhrystone 2 using register variables       48859465.6 lps   (10.0 s, 7 samples)
Double-Precision Whetstone                     8146.3 MWIPS (10.0 s, 7 samples)
Execl Throughput                               6271.8 lps   (30.0 s, 2 samples)
File Copy 1024 bufsize 2000 maxblocks       1034869.0 KBps  (30.0 s, 2 samples)
File Copy 256 bufsize 500 maxblocks          271501.9 KBps  (30.0 s, 2 samples)
File Copy 4096 bufsize 8000 maxblocks       2972956.0 KBps  (30.0 s, 2 samples)
Pipe Throughput                             1444426.6 lps   (10.0 s, 7 samples)
Pipe-based Context Switching                 309783.2 lps   (10.0 s, 7 samples)
Process Creation                              16736.1 lps   (30.0 s, 2 samples)
Shell Scripts (1 concurrent)                   8605.1 lpm   (60.0 s, 2 samples)
Shell Scripts (8 concurrent)                   1165.7 lpm   (60.0 s, 2 samples)
System Call Overhead                        1167592.8 lps   (10.0 s, 7 samples)

System Benchmarks Index Values               BASELINE       RESULT    INDEX
Dhrystone 2 using register variables         116700.0   48859465.6   4186.8
Double-Precision Whetstone                       55.0       8146.3   1481.1
Execl Throughput                                 43.0       6271.8   1458.5
File Copy 1024 bufsize 2000 maxblocks          3960.0    1034869.0   2613.3
File Copy 256 bufsize 500 maxblocks            1655.0     271501.9   1640.5
File Copy 4096 bufsize 8000 maxblocks          5800.0    2972956.0   5125.8
Pipe Throughput                               12440.0    1444426.6   1161.1
Pipe-based Context Switching                   4000.0     309783.2    774.5
Process Creation                                126.0      16736.1   1328.3
Shell Scripts (1 concurrent)                     42.4       8605.1   2029.5
Shell Scripts (8 concurrent)                      6.0       1165.7   1942.9
System Call Overhead                          15000.0    1167592.8    778.4
                                                                   ========
System Benchmarks Index Score                                        1732.0
```
