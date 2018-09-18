---
title: cpptraining.GettingCppUTestRunning
---
[<--Back](CppTraining#gettingfirsttestrunning)

# Introduction
Now it is time to get a simple example running to verify everything works.

# Before Continuing
Make sure you have [already installed the CDT](cpptraining.GettingStartedWithEclipseCdt) and [built CppUTest](cpptraining.GettingCppUTestCompiledUsingCDTToolSet). For the remainder of this discussion, I'll assume that CppUTest was downloaded and built in the following directory: c:\workspaces\CppUTest2_1
{% include include_md_file filename="cpptraining.SettingUpInitialProject.md" %}
{% include include_md_file filename="cpptraining.ConfiguringTheProjectForCppUTest.md" %}
# Creating A Test
* Now, add another source file called ActualSmokeTest.cpp:
{% highlight cpp %}
# include <CppUTest/TestHarness.h>

TEST_GROUP(Foo) {
};

TEST(Foo, 1Equals1) {
	LONGS_EQUAL(1, 1);
}
{% endhighlight %}
* Run your project again and see that the one test is passing:
{% highlight terminal %}
OK (1 tests, 1 ran, 1 checks, 0 ignored, 0 filtered out, 0 ms)
{% endhighlight %}
[<--Back](CppTraining#gettingfirsttestrunning)
