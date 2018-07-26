---
title: cpptraining.GettingCppUTestRunning
---
[<--Back]({{ site.pagesurl}}/CppTraining#gettingfirsttestrunning)

# Introduction
Now it is time to get a simple example running to verify everything works.

# Before Continuing
Make sure you have [already installed the CDT]({{ site.pagesurl}}/cpptraining.GettingStartedWithEclipseCdt) and [built CppUTest]({{ site.pagesurl}}/cpptraining.GettingCppUTestCompiledUsingCDTToolSet). For the remainder of this discussion, I'll assume that CppUTest was downloaded and built in the following directory: c:\workspaces\CppUTest2_1
[include_page="cpptraining.SettingUpInitialProject"]({{site.pagesurl}}/include_page="cpptraining.SettingUpInitialProject")
[include_page="cpptraining.ConfiguringTheProjectForCppUTest"]({{site.pagesurl}}/include_page="cpptraining.ConfiguringTheProjectForCppUTest")
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
[<--Back]({{ site.pagesurl}}/CppTraining#gettingfirsttestrunning)
