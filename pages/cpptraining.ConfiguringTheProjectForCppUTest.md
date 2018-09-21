---
title: cpptraining.ConfiguringTheProjectForCppUTest
---
## Configuring the Project for CppUTest
* Edit your project's properties (right-click, properties)
* Select**C/C++ Build:Settings**
#include Directories
* Under**GCC C++ Compiler:Includes** enter the include directory of CppUTest.
  * Click the page with the green plus.
  * Select**File system...**
  * Enter or search to the directory. For my install location, the directory is: C:\workspaces\CppUTest2_1\includes.
### CppUTest Library
* Under**MinGW C++ Linker:Libraries**, enter both a library path as well as a library
* Under**Libraries (-l)**, click on the page with a green plus
* Enter the name of the library (minus "lib" and ".lib"):**CppUTest**
### Library Path
* Under**Library search path (-L)**, click on the page with a green plus
* Enter the directory where the library is located. On my machine it is**C:\workspaces\CppUTest2_1\lib**
* Click OK
### Update main
You won't notice any changes unless you use CppUTest.
* CppUTest uses the main() to execute its tests. So update the file with main() (CppUTestHasItsSmoke.cpp):
{% highlight cpp %}
#include <CppUTest/CommandLineTestRunner.h>

int main(int argc, char **argv) {
	return CommandLineTestRunner::RunAllTests(argc, argv);
}
{% endhighlight %}
* You can run your program as a Local C++ Application again:
{% highlight terminal %}
OK (0 tests, 0 ran, 0 checks, 0 ignored, 0 filtered out, 0 ms)
{% endhighlight %}

### Alternative main()
If you'd like to see a list of tests and the time each takes to run, you can either:
* Provide command-line arguments when you run the program in Eclipse
* Use an updated main to make it happen every time:
{% highlight cpp %}
#include <CppUTest/CommandLineTestRunner.h>

int main() {
	const char* args[] = { "", "-v" };
	return CommandLineTestRunner::RunAllTests(2, args);
}
{% endhighlight %}
