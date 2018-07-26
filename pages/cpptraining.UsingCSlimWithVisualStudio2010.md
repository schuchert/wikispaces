---
title: cpptraining.UsingCSlimWithVisualStudio2010
---
{:toc}
[<--Back]({{ site.pagesurl}}/CppTraining#FitNesse)

//**September 2011**//

I've had a few requests to get CSlim working with Visual Studio. I've done so but with Visual Studio 2010. I did not try using Visual Studio 2008 because it appears to lack support for regular expressions. If you're looking to working with Visual Studio 2008, you are on your own for that.

What follows are instructions to get you started. Consider these Alpha instructions. I'm not sure I'll be doing more with this any time soon because of deadlines. In any case, this should get you started.

What follows are the instructions for building the supplied cslim examples and getting them to (mostly) run. After that, you'll be on your own to get a project up and running in Visual Studio.

# Building The Examples
You can now build cslim using the command line tools of visual studio. I made my own clone of the github project so I could make a few minor changes. The changes include things that should be able to be moved into the main github repository. I've submitted a pull request. If the updates do get pulled, I'll update these notes accordingly.

Now for the detailed instructions.
* Start a command shell using the Visual Studio Command Prompt (2010)
* Create a top-level directory for your work, I'll be using C:\cslim_vs2010 for these instructions
{% highlight terminal %}
C:\>cd src
C:\src>mkdir cslim_vs2010
C:\src>cd cslim_vs2010
C:\src\cslim_vs2010>
{% endhighlight %}
* Grab the source from github (<https://github.com/dougbradbury/cslim>)
* The url for the the clone is: **git@github.com:schuchert/cslim.git**
{% highlight terminal %}
C:\src\cslim_vs2010>git clone git@github.com:schuchert/cslim.git
Initialized empty Git repository in C:/src/cslim_vs2010/cslim/.git/
remote: Counting objects: 542, done.
remote: Compressing objects: 100% (244/244), done.
remote: Total 542 (delta 276), reused 515 (delta 263)
Receiving objects: 100% (542/542), 130.10 KiB, done.
Resolving deltas: 100% (276/276), done.

C:\src\cslim_vs2010>
{% endhighlight %}
* That will create a directory called// **cslim**//, go there.
* Type **nmake -f NMakefile**
{% highlight terminal %}
C:\src\cslim_vs2010\cslim>nmake -f NMakefile

Microsoft (R) Program Maintenance Utility Version 10.00.30319.01
Copyright (C) Microsoft Corporation.  All rights reserved.

        cd C:\src\cslim_vs2010\cslim\fixtures
        cl /MT /EHsc /Zi /IC:\src\cslim_vs2010\cslim\include\CSlim /IC:\src\csli
m_vs2010\cslim\include\Com  /IC:\src\cslim_vs2010\cslim\include\VS2010 -Dsnprint
f=_snprintf /FIstring.h /TP /c  -DCPP_COMPILING=1 *.c *.cpp
Microsoft (R) 32-bit C/C++ Optimizing Compiler Version 16.00.30319.01 for 80x86
Copyright (C) Microsoft Corporation.  All rights reserved.

DecisionTableExample.c
ExceptionsExample.c
Fixtures.c
Main.c
QueryTableExample.c
ScriptTableExample.c
FixtureInCpp.cpp
Generating Code...
        cd C:\src\cslim_vs2010\cslim\src\CSlim
        cl /MT /EHsc /Zi /IC:\src\cslim_vs2010\cslim\include\CSlim /IC:\src\csli
m_vs2010\cslim\include\Com  /IC:\src\cslim_vs2010\cslim\include\VS2010 -Dsnprint
f=_snprintf /FIstring.h /TP /c  -DCPP_COMPILING=1 *.c
Microsoft (R) 32-bit C/C++ Optimizing Compiler Version 16.00.30319.01 for 80x86
Copyright (C) Microsoft Corporation.  All rights reserved.

ListExecutor.c
SlimConnectionHandler.c
SlimList.c
SlimListDeserializer.c
SlimListSerializer.c
SlimUtil.c
StatementExecutor.c
SymbolTable.c
Generating Code...
        cd C:\src\cslim_vs2010\cslim
        cd C:\src\cslim_vs2010\cslim\src\ComWin32
        cl /MT /EHsc /Zi /IC:\src\cslim_vs2010\cslim\include\CSlim /IC:\src\csli
m_vs2010\cslim\include\Com  /IC:\src\cslim_vs2010\cslim\include\VS2010 -Dsnprint
f=_snprintf /FIstring.h /TP /c  -DCPP_COMPILING=1 *.c
Microsoft (R) 32-bit C/C++ Optimizing Compiler Version 16.00.30319.01 for 80x86
Copyright (C) Microsoft Corporation.  All rights reserved.

SocketServer.c
TcpComLink.c
Generating Code...
        cd C:\src\cslim_vs2010\cslim
        cd C:\src\cslim_vs2010\cslim
        lib /out:C:\src\cslim_vs2010\cslim\Lib\CSlim.lib src\CSlim\*.obj src\Com
Win32\*.obj
Microsoft (R) Library Manager Version 10.00.30319.01
Copyright (C) Microsoft Corporation.  All rights reserved.

        cd C:\src\cslim_vs2010\cslim
        link /DEBUG /SUBSYSTEM:CONSOLE /OUT:C:\src\cslim_vs2010\cslim\fixtures\s
lim.exe C:\src\cslim_vs2010\cslim\Lib\CSlim.lib C:\src\cslim_vs2010\cslim\src\Co
mWin32\*.obj C:\src\cslim_vs2010\cslim\fixtures\*.obj "C:\Program Files\Microsof
t SDKs\Windows\v7.0A\Lib\WS2_32.Lib"
Microsoft (R) Incremental Linker Version 10.00.30319.01
Copyright (C) Microsoft Corporation.  All rights reserved.


C:\src\cslim_vs2010\cslim>
{% endhighlight %}
* This should create a file under the fixtures directory called slim.exe
{% highlight terminal %}
C:\src\cslim_vs2010\cslim>dir fixtures\slim.exe
 Volume in drive C has no label.
 Volume Serial Number is A8D5-BA48

 Directory of C:\src\cslim_vs2010\cslim\fixtures

08/08/2010  10:11 PM           250,880 slim.exe
               1 File(s)        250,880 bytes
               0 Dir(s)  32,129,187,840 bytes free

C:\src\cslim_vs2010\cslim>
{% endhighlight %}

Now that you have a compiled collection of fixtures, you are ready to install FitNesse, copy some pages and get tests to pass.
# Install FitNesse
* Download the fitnesse.jar from <http://fitnesse.org/FrontPage.FitNesseDevelopment.DownLoad>. I use the EDGE build all of the time as its release criterion are the same as for the "official" release.
* Copy (or move) the jar file you just downloaded into your top-level working directory (**C:\src\cslim_vs2010**)
* Your directory should resemble the following:
{% highlight terminal %}
C:\src\cslim_vs2010>dir
 Volume in drive C has no label.
 Volume Serial Number is A8D5-BA48

 Directory of C:\src\cslim_vs2010

08/08/2010  10:14 PM    <DIR>          .
08/08/2010  10:14 PM    <DIR>          ..
08/08/2010  10:09 PM    <DIR>          cslim
08/08/2010  06:51 PM         3,934,696 fitnesse.jar
               1 File(s)      3,934,696 bytes
               3 Dir(s)  32,125,247,488 bytes free
{% endhighlight %}
* Make sure you are in the top level directory and start FitNesse with the following command: **java -jar fitnesse.jar -p 8080**
{% highlight terminal %}
C:\src\cslim_vs2010>java -jar fitnesse.jar -p 8080
Unpacking new version of FitNesse resources.  Please be patient.
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
..................................................FitNesse (v20100728) Started..
.
        port:              8080
        root page:         fitnesse.wiki.FileSystemPage at ./FitNesseRoot
        logger:            none
        authenticator:     fitnesse.authentication.PromiscuousAuthenticator
        html page factory: fitnesse.html.HtmlPageFactory
        page version expiration set to 14 days.
{% endhighlight %}
**Note:** The first time you run FitNesse, it will expand the help wiki. This will not happen upon subsequent runs unless you replace fitnesse.jar with a newer version.
## Copy Example Pages
* Create a new shell (because you're running FitNesse in your original shell)
* The cslim distribution comes with some example pages. You'll want to copy a directory from one place to another to see those tests
* The directory to copy// **from**// is: **cslim\fixtures\pages\**
* The directory to copy// **to**// is a bit more involved. You'll want to copy the directory to a directory// **under**// the FitNesseRoot directory created when you started fitnesse in the previous shell.// **However**//, you'll need to name the directory as a valid wiki word (starts with a capital letter, has at least one more capital letter, does not have 2 or more consecutive capital letters). For this example, I'll recommend you copy it as// **CslimExamples**//. Notice that only// **C**// and// **E**// in examples are capital letters. That's important.
* You can use the explorer or some tool. Here's what you're copying:
{% highlight terminal %}
C:\src\cslim_vs2010>dir cslim\fixtures\pages
 Volume in drive C has no label.
 Volume Serial Number is A8D5-BA48

 Directory of C:\src\cslim_vs2010\cslim\fixtures\pages

08/08/2010  10:09 PM    <DIR>          .
08/08/2010  10:09 PM    <DIR>          ..
08/08/2010  10:09 PM                26 content.txt
08/08/2010  10:09 PM    <DIR>          CounterTest
08/08/2010  10:09 PM    <DIR>          DivisionTest
08/08/2010  10:09 PM    <DIR>          ExceptionsTest
08/08/2010  10:09 PM    <DIR>          FirstCslimTest
08/08/2010  10:09 PM    <DIR>          MultiplicationTest
08/08/2010  10:09 PM    <DIR>          PayRollTest
08/08/2010  10:09 PM               284 properties.xml
               2 File(s)            310 bytes
               8 Dir(s)  32,117,592,064 bytes free
{% endhighlight %}
* Here's what things should look like after the copy (I have some unix tools installed, so I used cp):
{% highlight terminal %}
C:\src\cslim_vs2010>cp -r cslim/fixtures/pages FitNesseRoot/CslimExamples

C:\src\cslim_vs2010>dir FitNesseRoot\CslimExamples
 Volume in drive C has no label.
 Volume Serial Number is A8D5-BA48

 Directory of C:\src\cslim_vs2010\FitNesseRoot\CslimExamples

08/08/2010  10:23 PM    <DIR>          .
08/08/2010  10:23 PM    <DIR>          ..
08/08/2010  10:23 PM                26 content.txt
08/08/2010  10:23 PM    <DIR>          CounterTest
08/08/2010  10:23 PM    <DIR>          DivisionTest
08/08/2010  10:23 PM    <DIR>          ExceptionsTest
08/08/2010  10:23 PM    <DIR>          FirstCslimTest
08/08/2010  10:23 PM    <DIR>          MultiplicationTest
08/08/2010  10:23 PM    <DIR>          PayRollTest
08/08/2010  10:23 PM               284 properties.xml
               2 File(s)            310 bytes
               8 Dir(s)  32,117,567,488 bytes free
{% endhighlight %}
# Configure The Slim Implementation
* You can now browse to the following URL to open up those examples: <http://localhost:8080/CSlimExamples>
* You'll need to edit the page you just created and set its contents to:
{% highlight terminal %}
!contents -R2 -g -p -f -h

!define TEST_SYSTEM {slim}
!define TEST_RUNNER {c:\src\cslim_vs2010\cslim\fixtures\slim.exe}
{% raw %}
!define COMMAND_PATTERN {%m}
{% endraw %}

!define SLIM_VERSION {0.0}
{% endhighlight %}
* Now you can hit the// **Suite**// button. You will see some passing tests, missing fixtures and Exceptions.
** If you get an exception related to a difference in the version of the slim protocol implemented by cslim versus the one expected by FitNesse, you'll need to change the "!define SLIM_VERSION {0.0}" to the version used by what cslim is implementing.
** There are problems with exception handling. I'll be looking into that but that causes the fixture called ExceptionsExample to fail. (These are alpha instructions after all!)
** The class TestSlim is part of the examples and it seems to be missing.
# Where to go from here
If you want to use this in your own project, and use VS 2010, here are some bullets to get you started.
* You'll need to link the library CSlim.lib created by the NMakefile
* You'll need to add cslim\include\CSlim to your include path
* You'll need to add cslim\include\Com to your include path
* You'll need to add a -DCPP_COMPILING to your build
* You'll need to copy the contents of the fixtures directory into your solution. You can remove the example fixtures but keep Main.c and Fixtures.c (just update it).

Hope this helps you get started. 

[<--Back]({{ site.pagesurl}}/CppTraining#FitNesse)
