---
title: cpptraining.cpputest.vs2008
---
## Overview
These instructions are for Version 2.3 of CppUTest and Visual Studio 2008.

## Setup for Visual Studio 2008
* [Download CppUTest](http://sourceforge.net/projects/cpputest/files/cpputest/v2.3/CppUTest-v2.3.zip/download)
* Extract the zip file somewhere, I'll be using**C:\libs\CppUTest**
* Go to the extracted CppUTest and open the file**CppUTest.sln**
* Build the solution:**ctrl-shift-b**
* Run all of the tests:**ctrl-F5**
* Verify the output resembles:
{% highlight terminal %}
.......!!.........................................
..................................................
..............................................!...
..................................................
..........................!.................
OK (244 tests, 240 ran, 711 checks, 4 ignored, 0 filtered out, 0 ms)

Press any key to continue . . .
{% endhighlight %}
* Press any key to close the cmd window opened while running your tests
* Close the Solution:**File:Close Solution**

## Creating a new Solution
* Start Visual Studio 2008
* Select:**File:New:Project**
* Under **Project Types**, select**Visual C++**
* Under **Templates**, select**Win32 Console Application**
* Enter a project name, I'll use**Example** for these instructions
* Enter a directory, I'll use**C:\workspaces**
* Click**OK** to continue configuring the project.
* The **Win32 Application Wizard** window opens. Click**Nexrt**
* On the **Application Settings**, select**Empty Project** under **Additional options:**
* Confirm that the**Console Application** radio button is selected.
* Click**Finish**.

## Getting the Test Environment Configured
To setup some of the C++ properties, your project must have one .cpp file in in. We'll create that first and then finish setting up the project to be able to run unit tests.

* Select your project, in my case its name is **Example**
* Right-click and select**Add:New Item**
* In the second column under **Templates** select**C++ File (.cpp)**
* For its**Name**, enter**RunAllTests.cpp**
* Click**Add**
* Edit the contents of the file, add the following code:
{% highlight cpp %}
#include <CppUTest/CommandLineTestRunner.h>

int main() {
  const char* args[] = { "", "-v" };
  return CommandLineTestRunner::RunAllTests(2, args);
}
{% endhighlight %}

Now several project options are available to be set.

* Select your project, **Example** in my case
* Right-click and select**Properties**
* Open**Configuration Properties:C/C++**
* On the right, the top entry is for **Additional Include Directories**. Edit that value and add the include directory for CppUTest. The actual directory should be the extracted directory for CppUTest with "\include" added. In my case, that's**C:\libs\CppUTest\include**
* Open**Configuration Properties:Linker:Input**
* On the right, the top entry is **Additional Dependencies**. Edit that value and add the following two libraries:**winmm.lib CppUTest.lib**
* Open**Configuration Properties:Linker:General**
* On the right, near the bottom third of the list, you'll notice **Additional Library Directories**. Edit that value and include the lib directory for CppUTest. The actual directory should be the extracted directory for CppUTest with "\lib" added. In my case, that's**C:\libs\CppUTest\lib**
* Open**Configuration Properties:C/C++:Preprocessor**
* On the right, the top entry is **Preprocessor Definitions**. Edit that value andd the following:**;CPPUTEST_USE_STD_CPP_LIB=0**. The full value of that field will be**WIN32;_DEBUG;_CONSOLE;CPPUTEST_USE_STD_CPP_LIB=0**
* Click**OK** to apply all of your changes.
* Verify that you can build your solution:**Ctrl-shift-b**
* You can now run your solution:**Ctrl-F5** and you should see:
{% highlight terminal %}
OK (0 tests, 0 ran, 0 checks, 0 ignored, 0 filtered out, 0 ms)

Press any key to continue . . .
{% endhighlight %}

## Add a Test File
Now we'll add a single test file to verify that your system is up and running, although at this point if you have a running solution everything should work fine.

Note: We will be using just source files for our test code.

* Add a source file to your project (see above for details on how). Call the file**FooTest.cpp**
* Edit its contents:
{% highlight cpp %}
#include <CppUTest/TestHarness.h>
 
TEST_GROUP(FooTest) {
};
 
TEST(FooTest, TestName) {
  LONGS_EQUAL(1, 1);
}
{% endhighlight %}
* Build and run your tests:**Ctrl-F5**. You should see:
{% highlight terminal %}
TEST(FooTest, TestName) - 0 ms

OK (1 tests, 1 ran, 1 checks, 0 ignored, 0 filtered out, 0 ms)

Press any key to continue . . .
{% endhighlight %}

Congratulations, you're ready to get going.
