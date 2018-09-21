---
title: cpptraining.BuildingCppUTestForVisualStudio
---
[<--Back](CppTraining#gettingfirsttestrunningvisualstudio)

Now it is time to build the library you will be using for writing micro tests:
* [Download CppUTest V 2.3](http://sourceforge.net/projects/cpputest/files/cpputest/v2.3/CppUTest-v2.3.zip/download)
  * Note: You can go to <http://sourceforge.net/projects/cpputest/> and click the download button. These instructions are based off of CppUTest 2.3, so the link above is a direct download of v 2.3.
* Extract the zip to a directory, for the remainder of these and subsequent instructions, the installation directory will be// **C:\projects\CppUTest**//
  * Note: the zip does not contain a top-level directory, so you'll want to create one.
* Find the solution file (C:\projects\CppUTest\CppUTest.sln) and open it in Visual Studio
* If asked to convert the project, do so by following the project conversion wizard
* Build the solution (ctrl-shift-b)
* Run the solution (ctrl-f5)
* You should see output similar to the following:
{% highlight terminal %}
.......!!.........................................
..................................................
..............................................!...
..................................................
..........................!.................
OK (244 tests, 240 ran, 711 checks, 4 ignored, 0 filtered out, 0 ms)

Press any key to continue . . .
{% endhighlight %}
* Move on to the next step: [Getting CppUTestRunning in Visual Studio](cpptraining.GettingCppUTestRunningInVisualStudio)

[<--Back](CppTraining#gettingfirsttestrunningvisualstudio)
