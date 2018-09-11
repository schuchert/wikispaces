---
title: cpptraining.GettingCppUTestCompiledUsingCDTToolSet
---
[<--Back](CppTraining#gettingfirsttestrunning)

# Background
These steps assume you are using the CDT's tool set. Before following these instructions, please make sure you have [followed these instructions first.](cpptraining.GettingStartedWithEclipseCdt)

# Steps
* Update your path to include the// **bin**// directories under mingw and msys. These directories were installed under the Eclipse directory when installing the [wascana plugin](http://code.google.com/a/eclipselabs.org/p/wascana/). In my particular case, I installed Eclipse under C:\learncpp\eclipse, so I added to my path for all DOS shells: 
>> //**C:\learncpp\eclipse\mingw\bin;C:\learncpp\eclipse\msys\bin **//

* Download CppUTest (version 2.3 as of this writing): [CppUTest at Sourceforge](http://sourceforge.net/projects/cpputest/)
* Extract the zip somewhere (I'll be using c:\learncpp\CppUTest23 for this example)
* Switch to the install directory
{% highlight terminal %}
c:>cd C:\learncpp\cpputest23
{% endhighlight %}
* We don't have a unix shell but we are using unix tools, so neither of the install scripts do exactly what we need. Manually set the variable CPP_U_TEST:
{% highlight terminal %}
cd C:\learncpp\cpputest23>set CPP_U_TEST=c:\learncpp\cpputest23
{% endhighlight %}
* Note: you probably need to add the following line to the makefile (depends on a few variables, it is safe to always add it):
{% highlight terminal %}
CC=gcc
{% endhighlight %}
* Now it's a matter of using make:
{% highlight terminal %}
C:\learncpp\cpputest23>make clean
C:\learncpp\cpputest23>make all
{% endhighlight %}

Note, you should be able to simply type "make clean all", that did not work so I just used 2 commands.

* Here's a trace from my machine:
{% highlight terminal %}
C:\workspaces\CppUTest>make clean
Making clean
File not found - *.gcov

C:\workspaces\CppUTest>make all
compiling AllTests.cpp
compiling CommandLineArgumentsTest.cpp
compiling CommandLineTestRunnerTest.cpp
compiling FailureTest.cpp
compiling JUnitOutputTest.cpp
compiling MemoryLeakDetectorTest.cpp
compiling MemoryLeakWarningTest.cpp
compiling NullTestTest.cpp
compiling PluginTest.cpp
compiling SetPluginTest.cpp
compiling SimpleStringTest.cpp
tests/SimpleStringTest.cpp: In member function 'virtual void SimpleString_String
FromFormatLarge_Test::testBody()':
tests/SimpleStringTest.cpp:275: warning: deprecated conversion from string const
ant to 'char*'
compiling TestHarness_cTest.cpp
compiling TestInstallerTest.cpp
compiling TestOutputTest.cpp
compiling TestRegistryTest.cpp
compiling TestResultTest.cpp
compiling UtestTest.cpp
compiling SimpleStringExtensionsTest.cpp
compiling SimpleStringFromStdintTest.cpp
compiling TestOrderedTest.cpp
compiling CommandLineArguments.cpp
compiling CommandLineTestRunner.cpp
compiling Failure.cpp
compiling JUnitTestOutput.cpp
compiling MemoryLeakDetector.cpp
compiling MemoryLeakWarningPlugin.cpp
compiling SimpleString.cpp
compiling TestHarness_c.cpp
compiling TestOutput.cpp
compiling TestPlugin.cpp
compiling TestRegistry.cpp
compiling TestResult.cpp
compiling Utest.cpp
compiling UtestPlatform.cpp
compiling OrderedTest.cpp
compiling SimpleStringExtensions.cpp
compiling SimpleStringFromStdint.cpp
Building archive lib/libCppUTest.a
c:\Program Files\eclipse\mingw\bin\ar.exe: creating lib/libCppUTest.a
a - src/CppUTest/CommandLineArguments.o
a - src/CppUTest/CommandLineTestRunner.o
a - src/CppUTest/Failure.o
a - src/CppUTest/JUnitTestOutput.o
a - src/CppUTest/MemoryLeakDetector.o
a - src/CppUTest/MemoryLeakWarningPlugin.o
a - src/CppUTest/SimpleString.o
a - src/CppUTest/TestHarness_c.o
a - src/CppUTest/TestOutput.o
a - src/CppUTest/TestPlugin.o
a - src/CppUTest/TestRegistry.o
a - src/CppUTest/TestResult.o
a - src/CppUTest/Utest.o
a - src/Platforms/Gcc/UtestPlatform.o
a - src/CppUTest/Extensions/OrderedTest.o
a - src/CppUTest/Extensions/SimpleStringExtensions.o
a - src/CppUTest/Extensions/SimpleStringFromStdint.o
Linking CppUTest_tests
Running CppUTest_tests
.................!................................
..............!...................................
..........................................!!......
..............!..............
OK (179 tests, 174 ran, 610 checks, 5 ignored, 0 filtered out, 15 ms)


C:\workspaces\CppUTest>
{% endhighlight %}


[<--Back](CppTraining#gettingfirsttestrunning)
