---
title: cpptraining.ConfiguringTheProjectToUseBoost
---
[<--Back]({{ site.pagesurl}}/cpptraining)

# Configuring the Project to use Boost
* Edit your project's properties (right-click, properties)
* Select// **C/C++ Build:Settings**//
* Under// **GCC C++ Compiler:Includes**// enter the include directory for boost. 
** Click the page with the green plus. 
** Select// **File system...**//
** Enter or search to the directory. For my install location, the directory is: C:\workspaces\boost_1_43_0.
* Under// **MinGW C++ Linker:Libraries**//, enter both a library path as well as a library (for this example, we'll use boost date_time).
** Under// **Libraries (-l)**//, click on the page with a green plus
** Enter the name of the library (minus "lib" and ".lib"):// **boost_date_time-mgw44-mt-1_43**//
** Under// **Library search path (-L)**//, click on the page with a green plus
** Enter the directory where the library is located. On my machine it is// **C:\workspaces\boost_1_43_0\stage\lib**// 
* Click OK
* Verify these settings.
** Create a new file: BoostDateTimeSmokeTest.cpp:
```cpp
# include <boost/date_time/gregorian/gregorian.hpp>

# include <CppUTest/TestHarness.h>

TEST_GROUP(Dates) {

};

TEST(Dates, CanBeLinkedIn) {
  using namespace boost::gregorian;
  std::string s("2001-10-9");
  date d(from_simple_string(s));
}
```
* Important: The CppUTest header files need to be included// **last**//.
* Build and run your tests. You're really just checking that you can compile and link.

[<--Back]({{ site.pagesurl}}/cpptraining)
