---
title: NotesOnCppULite
---
# Using CppULite

There are three parts to using CppULite
* Creating a main
* Writing a test
* Including headers
* Linking in library

## Creating a main
This is a one-time thing in any project. This example runs a text runner and reports errors:
{% highlight cpp %}
# include <CppUTest/CommandLineTestRunner.h>

int main(int argc, char* argv[]) {
   CommandLineTestRunner::RunAllTests(argc, argv);
}
{% endhighlight %}

## Creating a test
Here's part of a file to test code to validate logging in using the state pattern:
{% highlight cpp %}
# include <CppUTest/TestHarness.h>

# include "Accounts.h"

# include "LoggingInState.h"
# include "StateBasedLoginValidator.h"
# include "WaitingForLoginState.h"
# include "FirstFailedLoginAttemptState.h"

TEST_GROUP(StateBasedLoginValidator) {
   Accounts *accounts;
   StateBasedLoginValidator *validator;

   TEST_SETUP() {
      accounts = buildAccounts();
      validator = new StateBasedLoginValidator(accounts, new WaitingForLoginState());
   }

   Accounts *buildAccounts() {
      Accounts *accounts = new Accounts();
      accounts->addAccount("brett", "foo");
      accounts->addAccount("bob", "bar");
      accounts->addAccount("cindy", "baz");
      return accounts;
   }
   TEST_TEARDOWN() {
      delete accounts;
      delete validator;
   }
};

TEST(StateBasedLoginValidator, firstLoginSuccessful) {
   validator->validateLogin("brett", "foo");
   Account *account = accounts->retrieveAccountFor("brett");
   CHECK(account->loggedIn);
}
{% endhighlight %}
### TEST_GROUP
A test group is how you create a [test fixture](http://xunitpatterns.com/test%20fixture%20-%20xUnit.html). This actually creates a class with **CppUTestGroup** as a prefix. So this creates the following definitions:
{% highlight cpp %}
int externTestGroupStateBasedLoginValidator = 0;
struct CppUTestGroupStateBasedLoginValidator : public Utest
{% endhighlight %}
What follows is {};, which finish off the creation of the class

There are several things worth pointing out:
* **TEST_SETUP** is a per-test [fixture setup](http://xunitpatterns.com/fixture%20setup.html) function. that is, each time one of the tests run, this setup method will be called.
* **TEST_TEARDOWN** is a per-test [fixture teardown](http://xunitpatterns.com/fixture%20teardown.html). After the test executes, this code is called.

If you happen to use any classes that use things from std:: such as std::string std::vector, you'll find out that you'll want to use new and delete in the setup and teardown methods, or CppUTest will report some memory leaks.

**Important**, the ";" is necessary after the closing } on the definition of a test group.

### TEST
A test is an individual, focused test. You first mention its test group and then its name. This actually creates a class prefixed with "testGroup" and suffixed with Test. So in this example, we end up with the following definition:
{% highlight cpp %}
class testGroupfirstLoginSuccessfulTest : public CppUTestGroupfirstLoginSuccessful { /* ... */ };
{% endhighlight %}

Note:
* **CHECK** verifies that some Boolean condition is true. This is one of number of available [assertion methods](http://xunitpatterns.com/Assertion%20Method.html).

CppUTest [assertion methods](http://xunitpatterns.com/Assertion%20Method.html):

|**Macro**|**Parameters**|**Description**|
|CHECK|condition|Verify condition is true. If not, report the name and line of the file where the condition fails using the preprocessor-defined macros ``__FILE__``, ``__LINE__``.|
|CHECK_LOCATION|condition,file,line|Verify condition is true. If not, report the file and line provided to th macro.|
|CHECK_EQUAL|expected,actual|Check that actual is equal to expected and report if they are not. For this to work, expected and actual are compared using != and when an error is reported, there needs to be a function called StringFrom that converts the result to a SimpleString (see SimpleString.h) or a const char*.|
|STRCMP_EQUAL|expected,actual|Compare two char*'s using strcmp. If they are not equal, report the ``__FILE__ ``and ``__LINE__`` where the check was made.|
|STRCMP_EQUAL_LOCATION|expected,actual,file,line|Same as STRCMP_EQUAL, you provide the file and line information..|
|LONGS_EQUAL|expected,actual|Compare two integer values (long or smaller) for equality. If they are not equal, report the ``__FILE__`` and ``__LINE__`` where the check occurred.|
|LONGS_EQUAL_LOCATION|expected,actual,file,line|Same as LONGS_EQUAL, you define the file and line information.|
|DOUBLES_EQUAL|expected,actual|Same as LONGS_EQUAL but using doubles.|
|DOUBLES_EQUAL_LOCATION|expected,actual,file,line|Same as DOUBLES_EQUAL, you provide the file and line information.|
|FAIL|text|Fail at this line and report text as the reason.|
|FAIL_LOCATION|text,file,line|Same as FAIL, you provide the file and line information.|
|FAIL_TEST|text,file,line|Same as FAIL_LOCATION.|
|FAIL_TEST_LOCATION|text,file,line|Same as FAIL_LOCATION.|
