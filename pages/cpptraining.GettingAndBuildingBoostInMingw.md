---
title: cpptraining.GettingAndBuildingBoostInMingw
---
[<--Back](CppTraining#boost)

# Overview
At this point you should have:
* [installed the Eclipse CDT](cpptraining.GettingStartedWithEclipseCdt), 
* [built CppUTest](cpptraining.GettingCppUTestCompiledUsingCDTToolSet), and 
* [cpptraining.GettingCppUTestRunningrun_your_first_test](cpptraining.GettingCppUTestRunningrun_your_first_test).

Next, you'll download and build the boost library.

# The Steps
* Download the Boost build tool bjam: [BJam Download Page](http://sourceforge.net/projects/boost/files/boost-jam/). As of this writing, I used 3.1.18.
* Extract this zip file somewhere. In my case, I extracted to C:\workspaces, which created C:\workspaces\boost-jam-3.1.18-1-ntx86.
* Download the Boost library from [Boost download page](http://sourceforge.net/projects/boost/files/boost/1.43.0/). As of this writing, I used 1.43.0.
* Extract this zip file somewhere. In my case I extracted to C:\workspaces, which created C:\workspaces\boost_1_43_0.  (Note that you'll need roughly 3 gb of storage to extract and build the boost library.)
* Make sure that BJam, mingw\bin and msys\bin are in your PATH. Here is a batch file that can do that:
{% highlight terminal %}
set PATH="\Program Files\eclipse\mingw";%PATH%
set PATH="\Program Files\eclipse\msys";%PATH%
set PATH=C:\workspaces\boost-jam-3.1.18-1-ntx86;%PATH%
{% endhighlight %}
* Switch to the boost directory:
{% highlight terminal %}
C:\>cd \workspaces\boost_1_43_0

C:\workspaces\boost_1_43_0>
{% endhighlight %}
* Build boost:
{% highlight terminal %}
C:\workspaces\boost_1_43_0>bjam --tool=gcc

... after much output ...


The Boost C++ Libraries were successfully built!

The following directory should be added to compiler include paths:

    C:\workspaces\boost_1_43_0

The following directory should be added to linker library paths:

    C:\workspaces\boost_1_43_0\stage\lib
{% endhighlight %}
* Verify that there are several library files in lib stage\lib directory under the boost directory
{% highlight terminal %}
C:\workspaces\boost_1_43_0\stage\lib>dir
 Volume in drive C has no label.
 Volume Serial Number is A8D5-BA48

 Directory of C:\workspaces\boost_1_43_0\stage\lib

06/11/2010  09:20 AM    <DIR>          .
06/11/2010  09:20 AM    <DIR>          ..
06/08/2010  04:55 PM           127,556 libboost_date_time-mgw44-mt-1_43.a
06/08/2010  04:54 PM           571,258 libboost_date_time-mgw44-mt-d-1_43.a
06/11/2010  09:15 AM           597,310 libboost_date_time-vc90-mt-1_43.lib
... and so on ...
06/11/2010  09:13 AM        99,148,416 libboost_wave-vc90-mt-gd-1_43.lib
06/11/2010  09:13 AM        99,148,416 libboost_wave-vc90-mt-gd.lib
06/11/2010  09:20 AM        45,626,710 libboost_wave-vc90-mt.lib
06/08/2010  05:00 PM           784,720 libboost_wserialization-mgw44-mt-1_43.a
06/08/2010  04:52 PM         7,823,906 libboost_wserialization-mgw44-mt-d-1_43.a

06/11/2010  09:18 AM         7,854,990 libboost_wserialization-vc90-mt-1_43.lib
06/11/2010  09:12 AM        18,498,372 libboost_wserialization-vc90-mt-gd-1_43.l
ib
06/11/2010  09:12 AM        18,498,372 libboost_wserialization-vc90-mt-gd.lib
06/11/2010  09:18 AM         7,854,990 libboost_wserialization-vc90-mt.lib
             130 File(s)  1,032,926,286 bytes
               2 Dir(s)   4,791,799,808 bytes free

C:\workspaces\boost_1_43_0\stage\lib>
{% endhighlight %}


[<--Back](CppTraining#boost)
