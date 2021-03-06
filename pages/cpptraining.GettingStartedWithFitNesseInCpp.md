---
title: cpptraining.GettingStartedWithFitNesseInCpp
---
{% include nav prev="CppTraining#FitNesse" %}

## Initial Downloads
### Download [cslim from github](http://github.com/dougbradbury/cslim/tree/master)
This requires a git client. 
* Create a top-level directory in which to work (this example uses ~/src/cpp_fitnesse)

{% highlight terminal %}
[~]% cd src
/Users/schuchert/src
[~/src]% mkdir cpp_fitnesse
[~/src]% cd cpp_fitnesse 
/Users/schuchert/src/cpp_fitnesse
{% endhighlight %}

* Use the public clone url to make a clone of the repository (as of this writing, it is: http://github.com/dougbradbury/cslim.git):

{% highlight terminal %}
[~/src/cpp_fitnesse]% git clone http://github.com/dougbradbury/cslim.git
got f463e11c5d718a50a6986a64714342b59c566d02
walk f463e11c5d718a50a6986a64714342b59c566d02
<snip>
walk 9362f2b10fd30590a8f14c1caebf76cd2fcbe3ca
walk 4ac0cbd8d58cfe9c353142a5363bd39718f43acf
{% endhighlight %}

### Get CppUTest
The README.txt in the root of the cslim directory just created uses CppUTest.
* [Download CppUTest from sourceforge](http://sourceforge.net/projects/cpputest/)
* Extract the zip, creating a sibling directory to cslim called cpputest. The top-level directory name should be ~/src/cpp_fitnesse/cpputest
* Switch to that directory and build cpputest:

{% highlight terminal %}
[~/src/cpp_fitnesse/cpputest]% make
compiling AllTests.cpp
compiling CommandLineArgumentsTest.cpp
<snip>
compiling Utest.cpp
compiling UtestPlatform.cpp
Building archive lib/libCppUTest.a
ar: creating archive lib/libCppUTest.a
a - src/CppUTest/CommandLineArguments.o
<snip>
a - src/Platforms/Gcc/UtestPlatform.o
Linking CppUTest_tests
Running CppUTest_tests
.......!!.........................................
.............................................!....
..................................................
...!.................
OK (171 tests, 167 ran, 599 checks, 4 ignored, 0 filtered out, 10 ms)
{% endhighlight %}

### Get FitNesse
* [Download fitnesse.jar](http://fitnesse.org/FrontPage.FitNesseDevelopment.DownLoad), these instructions were created using the edge build #398, dated July 11, 2010, 12:49, but the release at fitnesse.org should work fine.
* Move fitnesse.jar into ~src/cpp_fitnesse/
* The directory should look like this before you run fitnesse for the first time:

{% highlight terminal %}
[~/src/cpp_fitnesse]% ls
cpputest/	cslim/		fitnesse.jar
{% endhighlight %}
## Building cslim
* Go to ~/src/cpp_fitnesse/cslim
* Type make:

{% highlight terminal %}
[~/src/cpp_fitnesse/cslim]% make
compiling FixtureInCpp.cpp
<snip>
compiling TcpComLink.c
Building archive lib/libCSlim.a
ar: creating archive lib/libCSlim.a
a - src/CSlim/ListExecutor.o
<snip>
a - src/Com/TcpComLink.o
Linking CSlim_cslim
[~/src/cpp_fitnesse/cslim]% 
{% endhighlight %}

## Run FitNesse
The first time you run FitNesse, it will extract a base wiki and then start. After the first execution, it will just start. If you replace the fitnesse.jar with a new version, starting FitNesse the first time after that will update the base wiki, but leave the pages you created alone.
* The first execution looks like this

{% highlight terminal %}
[~/src/cpp_fitnesse]% java -jar fitnesse.jar -p 8080
Unpacking new version of FitNesse resources.  Please be patient.
.........<snip>..........FitNesse (v20100711) Started...
	port:              8080
	root page:         fitnesse.wiki.FileSystemPage at ./FitNesseRoot
	logger:            none
	authenticator:     fitnesse.authentication.PromiscuousAuthenticator
	html page factory: fitnesse.html.HtmlPageFactory
	page version expiration set to 14 days.
{% endhighlight %}

* The directory structure after running FitNesse the first time should now look like this:

{% highlight terminal %}
[~/src/cpp_fitnesse]% ls
FitNesseRoot/	cpputest/	cslim/		fitnesse.jar
{% endhighlight %}
* The next time you start FitNesse, you'll simply see the following:

{% highlight terminal %}
[~/src/cpp_fitnesse]% java -jar fitnesse.jar -p 8080
FitNesse (v20100711) Started...
	port:              8080
	root page:         fitnesse.wiki.FileSystemPage at ./FitNesseRoot
	logger:            none
	authenticator:     fitnesse.authentication.PromiscuousAuthenticator
	html page factory: fitnesse.html.HtmlPageFactory
	page version expiration set to 14 days.
{% endhighlight %}

## Create Top-Level Page
This assumes you're running FitNesse on port 8080. Update the url with your port as necessary.
* Create a new top-level page at: <http://localhost:8080/CslimFirstExamples>
* Edit the contents. Set it to (note, update**/User/schuchert** with your top-level directory):

{% highlight terminal %}
!contents -R2 -g -p -f -h

!define TEST_SYSTEM {slim}
!define TEST_RUNNER {/Users/schuchert/src/cpp_fitnesse/cslim/CSlim_cslim}
{% raw %}
!define COMMAND_PATTERN {%m}
{% endraw %}
!define SLIM_VERSION {0.2}
{% endhighlight %}

* Save the page.
* Create a sub-page at the following URL: <http://localhost:8080/CslimFirstExamples.DecisionTableExample>
* Edit the contents. Set it to (note, to make the columns line up, use the**Format** button):

{% highlight terminal %}
|Modulus                 |
|value|divisor|remainder?|
|6    |2      |0         |
|13   |27     |13        |
|5    |2      |1         |
{% endhighlight %}
If you click the**Test** Button, you'll see a bit of yellow. It's time to write a fixture.

## Writing the Fixture

This example originated from the one provided with cslim. It's been somewhat simplified and moved closer to C++. You can review the original example in ~/src/cpp_fitnesse/cslim/fixtures/FixtureInCpp.cpp.
* Go to the fixtures directory under your cslim installation (cd ~/src/cpp_fitnesse/cslim/fixtures).
* Create a new file, Modulus.cpp:

{% highlight cpp %}
#include <stdlib.h>
#include <stdio.h>
#include "SlimList.h"
#include "Fixtures.h"

struct Modulus
{
	Modulus() { 
		lastValue[0] = 0;
	}
	int remainder() {
		return value % divisor;
	}
	static Modulus *from(void *voidSelf) {
		return reinterpret_cast<Modulus*>(voidSelf);
	}
	char lastValue[32];
	int value;
	int divisor;
};

static int getInt(SlimList* args) {
	return atoi(SlimList_GetStringAt(args, 0));
}

extern "C" {
void* Modulus_Create(StatementExecutor* errorHandler, SlimList* args) {
	return new Modulus;
}

void Modulus_Destroy(void* self) {
	delete Modulus::from(self);
}

static char* setValue(void* voidSelf, SlimList* args) {
	Modulus *self = Modulus::from(voidSelf);
	self->value = getInt(args);
	return self->lastValue;
}

static char* setDivisor(void* voidSelf, SlimList* args) {
	Modulus *self = Modulus::from(voidSelf);
	self->divisor = getInt(args);
	return self->lastValue;
}

static char* remainder(void* voidSelf, SlimList* args) {
	Modulus *self = Modulus::from(voidSelf);
	int result = self->remainder();
	snprintf(self->lastValue, sizeof(self->lastValue), "%d", result);
	return self->lastValue;
}

SLIM_CREATE_FIXTURE(Modulus) 
	SLIM_FUNCTION(setValue)
	SLIM_FUNCTION(setDivisor)
	SLIM_FUNCTION(remainder)
SLIM_END

}
{% endhighlight %}

* Update the fixture registry in Fixtures.c. This file is in the same directory. You'll see something close to this:

{% highlight cpp %}
#include "Fixtures.h"

SLIM_FIXTURES
  SLIM_FIXTURE(Division)
  SLIM_FIXTURE(Count)
  SLIM_FIXTURE(EmployeePayRecordsRow)
  SLIM_FIXTURE(ExceptionsExample)
  SLIM_FIXTURE(Multiplication)
SLIM_END
{% endhighlight %}

* You need to add your new fixture, Modulus, in the list somewhere:

{% highlight cpp %}
#include "Fixtures.h"

SLIM_FIXTURES
  SLIM_FIXTURE(Modulus)
  SLIM_FIXTURE(Division)
  SLIM_FIXTURE(Count)
  SLIM_FIXTURE(EmployeePayRecordsRow)
  SLIM_FIXTURE(ExceptionsExample)
  SLIM_FIXTURE(Multiplication)
SLIM_END
{% endhighlight %}

* Make your CSlim_cslim executable. Switch to ~/src/cpp_fixtures/cslim and type make:

{% highlight terminal %}
[~/src/cpp_fitnesse/cslim/fixtures]% cd ..
/Users/schuchert/src/cpp_fitnesse/cslim
[~/src/cpp_fitnesse/cslim]% make
compiling Modulus.cpp
compiling Fixtures.c
Linking CSlim_cslim
{% endhighlight %}

* Go back to your page and hit the**Test** button.

If you see mostly green, congratulations. As of this writing, there's an exception on the slim protocol version. Once this gets fixed, I'll update these instructions


{% include nav prev="CppTraining#FitNesse" %}
