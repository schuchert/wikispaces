---
title: cpptraining.GettingCppUTestCompiledUsingCDTToolSet.Juno
---
[<--back]({{ site.pagesurl}}/cpptraining)
# Overview
These instructions assume you have already followed [these instructions]({{ site.pagesurl}}/cpptraining.GettingStartedWithEclipseCdt.Juno).

## Instructions
* Download [CppUTest](http://sourceforge.net/projects/cpputest/files/cpputest/v3.1/CppUTest-v3.1.zip/download) (as of this writing, I'm using version 3.1.
* Extract the zip somewhere. I'm using// **c:\learncpp\cpputest**// for these instructions.
* Start a command shell.
* Go to where you extracted the files, which in my case is:// **c:\learncpp\cpputest**//
* Make using make:
```
C:\learncpp\cpputest>make
compiling AllTests.cpp
compiling AllocLetTestFreeTest.cpp
compiling AllocationInCppFile.cpp
compiling CheatSheetTest.cpp
compiling CommandLineArgumentsTest.cpp
compiling CommandLineTestRunnerTest.cpp
compiling JUnitOutputTest.cpp
compiling MemoryLeakDetectorTest.cpp
compiling MemoryLeakOperatorOverloadsTest.cpp
compiling MemoryLeakWarningTest.cpp
compiling NullTestTest.cpp
compiling PluginTest.cpp
compiling PreprocessorTest.cpp
compiling SetPluginTest.cpp
compiling SimpleStringTest.cpp
compiling TestFailureTest.cpp
compiling TestFilterTest.cpp
compiling TestHarness_cTest.cpp
compiling TestInstallerTest.cpp
compiling TestMemoryAllocatorTest.cpp
compiling TestOutputTest.cpp
compiling TestRegistryTest.cpp
compiling TestResultTest.cpp
compiling UtestTest.cpp
compiling AllocLetTestFree.c
compiling AllocationInCFile.c
compiling TestHarness_cTestCFile.c
compiling CommandLineArguments.cpp
compiling CommandLineTestRunner.cpp
compiling JUnitTestOutput.cpp
compiling MemoryLeakDetector.cpp
compiling MemoryLeakWarningPlugin.cpp
compiling SimpleString.cpp
compiling TestFailure.cpp
compiling TestFilter.cpp
compiling TestHarness_c.cpp
compiling TestMemoryAllocator.cpp
compiling TestOutput.cpp
compiling TestPlugin.cpp
compiling TestRegistry.cpp
compiling TestResult.cpp
compiling Utest.cpp
compiling UtestPlatform.cpp
Building archive lib/libCppUTest.a
C:\learncpp\MinGW\bin\ar.exe: creating lib/libCppUTest.a
a - objs/src/CppUTest/CommandLineArguments.o
a - objs/src/CppUTest/CommandLineTestRunner.o
a - objs/src/CppUTest/JUnitTestOutput.o
a - objs/src/CppUTest/MemoryLeakDetector.o
a - objs/src/CppUTest/MemoryLeakWarningPlugin.o
a - objs/src/CppUTest/SimpleString.o
a - objs/src/CppUTest/TestFailure.o
a - objs/src/CppUTest/TestFilter.o
a - objs/src/CppUTest/TestHarness_c.o
a - objs/src/CppUTest/TestMemoryAllocator.o
a - objs/src/CppUTest/TestOutput.o
a - objs/src/CppUTest/TestPlugin.o
a - objs/src/CppUTest/TestRegistry.o
a - objs/src/CppUTest/TestResult.o
a - objs/src/CppUTest/Utest.o
a - objs/src/Platforms/Gcc/UtestPlatform.o
Linking CppUTest_tests
Running CppUTest_tests
.........................!........................
..................................................
.........!........................................
..................................................
..................................................
...................!.....!!...................
OK (296 tests, 291 ran, 794 checks, 5 ignored, 0 filtered out, 47 ms)


C:\learncpp\cpputest>
```

[<--back]({{ site.pagesurl}}/cpptraining)