---
title: cpptraining.ConfiguringGccToUseCpp0xInEclipseCdt
---
[[cpptraining#cpp0x|<-- Back]]

# Overview
This is a description of why I chose to use C++0x for some examples and how to configure gcc to allow for C++0x. If you are interested in the how, [[cpptraining.ConfiguringGccToUseCpp0xInEclipseCdt#thesteps|just skip to the steps]].

# Background
While working on these materials, I came across a need to write examples using the boost::bind method. The boost::bind method creates a function object that is typically passed in as a parameter to an algorithm. The problem was that to write examples, I wanted to distinguish between the creation of the binding and its execution. 

What I ended up doing and then trashing was using template methods. This made things worse rather than better because it added a level of indirection and moved away from what I wanted to demonstrate. I asked Michael Feathers for his advice and he recommend I use the type inference feature of C++0x. This allowed me to write something like this:
```cpp
int foo() {
  auto functor = boost::bind(....);
  functor(1, 2, 3);
}
```

The first line uses the boost::bind method and creates some opaque type. The second line executes that functor. The underlying requirement of a functor is that it responds to the () operator, as in:
```cpp
class Foo {
public;
  int operator()(int a, int b, int c) { return a + b / c; }
};

int bar() {
  Foo f;
  return f(1, 2, 3);
}
```
[[#thesteps]]
# The Steps
These steps assume you have some project setup using CppUTest. If not, [[cpptraining.ConfiguringGccToUseCpp0xInEclipseCdt#seeblow|see below]].

* Select your project and edit its properties: right-click::edit properties (or alt-enter)
* Go to C/C++ Build::Settings::GCC C++ Settings
* Under miscellaneous add// **-std=c++0x**//. My version already had a setting, so it looks like the following:
```
-c -fmessage-length=0 -std=c++0x
```

[[#seebelow]]
## The Preliminary Steps

These steps assume you are using the latest version of the Eclipse CDT along with mingw and gcc 4.4 or later.  If you need to figure out how to do that, follow these steps:
* [[cpptraining.GettingStartedWithEclipseCdt|Getting The CDT Running]]
* [[cpptraining.GettingCppUTestCompiledUsingCDTToolSet|Getting CppUTest Compiled Using CDT Tool Set]]
* [[cpptraining.GettingCppUTestRunning|Getting CppUTest Running]]
* [[cpptraining.GettingAndBuildingBoostInMingw|Getting and Building Boost in minggw]]
* [[cpptraining.UsingBoostWithMingwAndEclipse|Using Boost With mingw And Eclipse]]

Note, the initial examples do you actually require you to compile boost as they use header-only features of the boost library.

[[cpptraining#cpp0x|<-- Back]]