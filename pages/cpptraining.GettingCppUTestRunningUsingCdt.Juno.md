---
title: cpptraining.GettingCppUTestRunningUsingCdt.Juno
---
[[cpptraining|<--back]]
# Overview
These instructions assume you have already worked through:[[cpptraining.GettingStartedWithEclipseCdt.Juno|this]] and then [[cpptraining.GettingCppUTestCompiledUsingCDTToolSet.Juno|that]]. 

With a working Eclipse Juno + CDT and MinGW and CppUTest built, you are ready to create your first project.

## Steps
### Basic Project Creation
* Start eclipse and select a project directory. For this example, I'll use// **c:\learncpp\workspaces\first_example**//
* Close the Welcome window
* In the **Project Explorer** (left-most column), right-click and select **New::C++ Project**
* For the project name, enter **SimpleExample**
* Under **Project Type**, expand **Executable** and select **Empty Project**

What you select next depends on your environment
#### Windows
* Select **MingGW GCC**
#### OS X and *nix
* Selecte **Cross GCC** (guess)

* Click **FInish**
### Creating First Main
* Select the project **SimpleExample**, right-click and select **New::File**
* Enter **RunAllTests.cpp** for the name
* Enter the following code:
```cpp
# include <CppUTest/CommandLineTestRunner.h>

int main(int argc, char *argv[]) {
	return CommandLineTestRunner::RunAllTests(argc, argv);
}
```
* This does not compile, time for projet settings
### Project Settings
This includes both project settings and recommended workspace settings
* Right-click on the project **SimpleExample** and select **Properties**
* Open up **C/C++ Build** then **Settings**
* Under **GCC C++ Compiler** first select **Includes**
* Under **Include Paths (-I) add a new entry:// **c:\learncpp\cpputest\include**\\
* Again in **C/C++ Build** then ** Miscellaneous** add **-std=c++0x** to **Other flags** - note you need to add a space first.
* Next, go to **MinGW C++ Linker** and select **Libraries**
* Under **Libraries (-l)** add **cpputest**
* Under **Library searh path (-L)** add **c:\learncpp\cpputest\lib**
* Finally, save all of your changes by clicking on **OK**

While your should be able to compile, you should make a few more changes.
* Set workspace preferences (Windows **Window::Preferences**)
* Under **General** select **Workspace**
* Enable: **Refresh using native hooks or polling**, **Refresh on access**, **Save automatically before build**

If having the editor complete things like "" and {} bother you:
* Under **C/C++**, **Editor**, **Typing**
* Disable any of of the checkboxes under **Automatically close** as you see fit

* Save all of your changes by clicking on **OK**

### Build and Run
Hit ctrl-F11 to build and run your tests:
```
OK (0 tests, 0 ran, 0 checks, 0 ignored, 0 filtered out, 0 ms)
```
[[cpptraining|<--back]]