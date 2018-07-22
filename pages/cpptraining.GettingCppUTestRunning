[[cpptraining#gettingfirsttestrunning|<--Back]]

# Introduction
Now it is time to get a simple example running to verify everything works.

# Before Continuing
Make sure you have [[cpptraining.GettingStartedWithEclipseCdt|already installed the CDT]] and [[cpptraining.GettingCppUTestCompiledUsingCDTToolSet|built CppUTest]]. For the remainder of this discussion, I'll assume that CppUTest was downloaded and built in the following directory: c:\workspaces\CppUTest2_1
[[include page="cpptraining.SettingUpInitialProject"]]
[[include page="cpptraining.ConfiguringTheProjectForCppUTest"]]
# Creating A Test
* Now, add another source file called ActualSmokeTest.cpp:
```cpp
# include <CppUTest/TestHarness.h>

TEST_GROUP(Foo) {
};

TEST(Foo, 1Equals1) {
	LONGS_EQUAL(1, 1);
}
```
* Run your project again and see that the one test is passing:
```
OK (1 tests, 1 ran, 1 checks, 0 ignored, 0 filtered out, 0 ms)
```
[[cpptraining#gettingfirsttestrunning|<--Back]]
