---
title: javascript.UnitTestingWithJsTestDriver
---
## Overview
I'm learning JavaScript (again, and for real this time, I hope). After reading [JavaScript: The Good Parts](http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742) and several online pages, I set out to try some basic TDD in JavaScript. For these instructions (and the soon to be created instructional video), I'm using the following tool set:
* Chrome (configured for auto updating)
* Terminal (OS X Lion)
* Java (to execute use the test runner)
* Eclipse (to edit my files)
* ViPlugin in Eclipse

This is my first stab at this and I hope to both get a better workflow and better at JavaScript.
## Getting Setup
[Setup JsTestDriver](http://code.google.com/p/js-test-driver/wiki/GettingStarted). Instructions summarized here for convenience.
* [Download the jar](http://code.google.com/p/js-test-driver/downloads/list)
* Create basic project structure:
{% highlight terminal %}
% mkdir -p RpnCalcDemo/src
% mkdir -p RpnCalcDemo/src-test
% cd RpnCalcDemo 
{% endhighlight %}
* For convenience, I copied the downloaded JsTestDriver jar to this directory. The name of the version I downloaded is: //**JsTestDriver-1.3.3d.jar**//
* Create basic configuration file:
## jsTestDriver.conf
{% highlight terminal %}
server: http://localhost:9876

load:
  - src/*.js
  - src-test/*.js
{% endhighlight %}
* In a separate terminal instance, start the test runner:
{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --port 9876
{% endhighlight %}
* Open up browser/create a tab and then browse to localhost:9876.
* Click on the //**[Capture This Browser](http://localhost:9876/capture)**// link. You'll see a window with the following information:
{% highlight terminal %}
                 JsTestDriver
Last:1326495229968 | Next:1997 | Server:Waiting...
{% endhighlight %}
## First Test: Initial X Value is 0
* Create a first test in the src-test directory:
### src-test/rpn_calculator_test.js
{% highlight javascript %}
rpn_calculator_test = TestCase("rpn_calculator");

rpn_calculator_test.prototype.testShouldInitiallyBe0 = function() {
	var calc = rpn_calculator();
	assertEquals(0, calc.x());
};
{% endhighlight %}
* Run your tests (they fai):
{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --tests all
java.lang.IllegalArgumentException: The patterns/paths /Users/Thoughtworks/src
/workspaces/ RpnCalcDemo/src (/Users/Thoughtworks/src/workspaces/RpnCalcDemo/
src)  used in the configuration file didn't match any file, the files patterns/
paths need to be relative /Users/Thoughtworks/src/workspaces/RpnCalcDemo
	at com.google.jstestdriver.PathResolver.expandGlob(PathResolver.java:170)
	at com.google.jstestdriver.PathResolver.resolve(PathResolver.java:109)
	at com.google.jstestdriver.config.ParsedConfiguration.resolvePaths(
ParsedConfiguration.java:98)
	at com.google.jstestdriver.config.Initializer.initialize(Initializer.java:84)
	at com.google.jstestdriver.JsTestDriver.runConfigurationWithFlags(
JsTestDriver.java:259)
	at com.google.jstestdriver.JsTestDriver.runConfiguration(
JsTestDriver.java:211)
	at com.google.jstestdriver.JsTestDriver.main(JsTestDriver.java:144)
Unexpected Runner Condition: The patterns/paths /Users/Thoughtworks/src/
workspaces/RpnCalcDemo/src (/Users/Thoughtworks/src/workspaces/RpnCalcDemo/src)
 used in the configuration file didn't match any file, the files patterns/
paths need to be relative /Users/Thoughtworks/src/workspaces/RpnCalcDemo
 Use --runnerMode DEBUG for more information.
{% endhighlight %}
* The system complains that the pattern "- src/*.js" does not match any files. So fix that:
### src/rpn_calculator.js
{% highlight javascript %}
var rpn_calculator = function() {
	var that = {};
	that.x = function() {
		return 0;
	};
	return that;
};
{% endhighlight %}
* Make a directory called logs and send (JUnit-formated XML-based) test output results there:
{% highlight terminal %}
% mkdir logs
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
.
Total 1 tests (Passed: 1; Fails: 0; Errors: 0) (1.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 1 tests (Passed: 1; Fails: 0; Errors 0) (1.00 ms)
% ls logs
TEST-Chrome_16091275_Mac_OS.rpn_calculator.xml
{% endhighlight %}
* The resulting log file on my machine:
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="Chrome_16091275_Mac_OS.rpn_calculator" errors="0" failures="0" tests="1" time="0.0010">
<testcase classname="Chrome_16091275_Mac_OS.rpn_calculator" name="testShouldInitiallyBe0" time="0.0010"/>
</testsuite>
{% endhighlight %}

## Next Test: Last Value Entered is X
* Add a second test:

### append to src-test/rpn_calculator_test.js
{% highlight javascript %}
rpn_calculator_test.prototype.testXShouldBeLastValueEntered = function() {
  var calc = rpn_calculator();
  calc.enter(42);
  assertEquals(42, calc.x());
};
{% endhighlight %}
* See the tests fail:
{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
.E
Total 2 tests (Passed: 1; Fails: 0; Errors: 1) (0.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 2 tests (Passed: 1; Fails: 0; Errors 1) (0.00 ms)
    rpn_calculator.testXShouldBeLastValueEntered error (0.00 ms): TypeError: 
Object #<Object> has no method 'enter'
      TypeError: Object #<Object> has no method 'enter'
          at [object Object].testXShouldBeLastValueEntered (http://localhost:9876/test
/src-test/rpn_calculator_test.js:10:7)

Tests failed: Tests failed. See log for details.
{% endhighlight %}

* Add the missing method (and update the implementation a touch):

### src/rpn_calculator.js
{% highlight javascript %}
var rpn_calculator = function() {
	var that = {};
	that.value = 0;
	that.x = function() {
		return that.value;
	};
	that.enter = function(value) {
		that.value = value;
	};
	return that;
};
{% endhighlight %}

* Run the tests, see the pass:

{% highlight javascript %}
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
..
Total 2 tests (Passed: 2; Fails: 0; Errors: 0) (0.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 2 tests (Passed: 2; Fails: 0; Errors 0) (0.00 ms)
{% endhighlight %}

* Refactor the rpn_calculator function, hide value:
{% highlight javascript %}
var rpn_calculator = function() {
	var that = {};
	var value = 0;
	that.value = 0;
	that.x = function() {
		return value;
	};
	that.enter = function(newValue) {
		value = newValue;
	};
	return that;
};
{% endhighlight %}

* Check, tests still pass?

{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
..
Total 2 tests (Passed: 2; Fails: 0; Errors: 0) (1.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 2 tests (Passed: 2; Fails: 0; Errors 0) (1.00 ms)
{% endhighlight %}

* Refactor the tests, remove duplication (this is multiple refactorings on my end):
{% highlight javascript %}
rct = {};
rpn_calculator_test = TestCase("rpn_calculator", {
	setUp : function() {
		rct.calc = rpn_calculator();
	},
	tearDown : function() {
		rct.calc = undefined;
	}
});

rpn_calculator_test.prototype.testShouldInitiallyBe0 = function() {
	assertEquals(0, rct.calc.x());
};

rpn_calculator_test.prototype.testXShouldBeLastValueEntered = function() {
	rct.calc.enter(42);
	assertEquals(42, rct.calc.x());
};
{% endhighlight %}

* Verify the tests still pass:
{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
..
Total 2 tests (Passed: 2; Fails: 0; Errors: 0) (1.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 2 tests (Passed: 2; Fails: 0; Errors 0) (1.00 ms)
{% endhighlight %}

## Can Handle Multiple Numbers Entered
* Now create a new test:

### Appended to src-test/rpn_calculator_test.js
{% highlight javascript %}
rpn_calculator_test.prototype.testStoresMultipleValues = function() {
  rct.calc.enter(42);
  rct.calc.enter(9);
  rct.calc.drop();
  assertEquals(42, rct.calc.x());
};
{% endhighlight %}
* This test will fail because there is no drop() method nor is this functionality supported.
{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
..E
Total 3 tests (Passed: 2; Fails: 0; Errors: 1) (0.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 3 tests (Passed: 2; Fails: 0; Errors 1) (0.00 ms)
    rpn_calculator.testStoresMultipleValues error (0.00 ms): TypeError: Object #<Object> 
has no method 'drop'
      TypeError: Object #<Object> has no method 'drop'
          at Object.testStoresMultipleValues (http://localhost:9876/test/src-test/
rpn_calculator_test.js:23:11)

Tests failed: Tests failed. See log for details.
{% endhighlight %}
* After a little effort, we have this:

### src/rpn_calculator.js
{% highlight javascript %}
var rpn_calculator = function() {
	var that = {};
	var values = [0];
	that.value = values;
	that.x = function() {
		return values[values.length-1];;
	};
	that.enter = function(newValue) {
		values.push(newValue);
	};
	that.drop = function() {
		values.pop()
	};
	return that;
};
{% endhighlight %}

* And the test are back to passing:
{% highlight terminal %}

% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
...
Total 3 tests (Passed: 3; Fails: 0; Errors: 0) (1.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 3 tests (Passed: 3; Fails: 0; Errors 0) (1.00 ms)
{% endhighlight %}

## One More Check
* Notice the feature envy in the x function? I uses values the variable, the length of values and also has direct knowledge that the size is 0-based. This is not a huge deal, but there are defects in the system as written. Here's a test to demonstrate a problem:
{% highlight javascript %}
rpn_calculator_test.prototype.testCalculatorAlwaysHasValues = function() {
  rct.calc.drop();
  rct.calc.drop();
  assertEquals(0, rct.calc.x());
};
{% endhighlight %}
* Notice the failing test:
{% highlight terminal %}
java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
...F
Total 4 tests (Passed: 3; Fails: 1; Errors: 0) (1.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 4 tests (Passed: 3; Fails: 1; Errors 0) (1.00 ms)
    rpn_calculator.testCalculatorAlwaysHasValues failed (0.00 ms): AssertError: expected 0 
but was [undefined]
      AssertError: expected 0 but was [undefined]
          at Object.testCalculatorAlwaysHasValues (http://localhost:9876/test/src-test/
rpn_calculator_test.js:30:2)
{% endhighlight %}
* On both of my 2 HP calculators, I can drop all day long and nothing much happens (somewhat simplified, but reasonable for this demonstation. Conceptually, the so-called (by the documentation) "operand stack" is never empty. Here's a way to implement that:

### Update x method
{% highlight javascript %}
  that.x = function() {
    if(values.length > 0)
      return values[values.length-1];;
    return 0;
  };
{% endhighlight %}
* This gets the job done but now this method is exhibiting feature envy even stronger:
  * It checks the length twice
  * It knows that the array is 0-based
  * It uses "value." twice and values 1, so values three times.
* A typical fix for feature envy is to push the responsibility into the object that has the data. To do that, we'll introduce a new object: rpn_stack.

## rpn_stack
* We'll begin with a few TDD cycles:

### rpn_stack_test.js
{% highlight javascript %}
rpn_stack_test = TestCase("rpn_stack");

rpn_stack_test.prototype.testPopOnNewStackReturns0 = function() {
	assertEquals(0, rpn_stack().pop());
};
{% endhighlight %}

* This fails (there's no rpn_stack() function:
{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
....E
Total 5 tests (Passed: 4; Fails: 0; Errors: 1) (1.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 5 tests (Passed: 4; Fails: 0; Errors 1) (1.00 ms)
    rpn_stack.testPopOnNewStackReturns0 error (1.00 ms): ReferenceError: rpn_stack
 is not defined
      ReferenceError: rpn_stack is not defined
          at [object Object].testPopOnNewStackReturns0 (http://localhost:9876/test/
src-test/rpn_stack_test.js:4:18)
{% endhighlight %}

* Fix this by making one and giving it an implementation:
{% highlight javascript %}
var rpn_stack = function() {
	that = {};
	that.pop = function() {
		return 0;
	};
	return that;
};
{% endhighlight %}

* Now the tests pass:
{% highlight terminal %}
% java -jar JsTestDriver-1.3.3d.jar --tests all --testOutput logs
.....
Total 5 tests (Passed: 5; Fails: 0; Errors: 0) (1.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 5 tests (Passed: 5; Fails: 0; Errors 0) (1.00 ms)
{% endhighlight %}

* Next, we want to make sure that the last value entered is the one that pop returns:

## Append new test to rpn_stack_test.js
{% highlight javascript %}
rpn_stack_test.prototype.testPopReturnsLastValuePushed = function() {
  var values = rpn_stack();
  values.push(42);
  assertEquals(42, values.pop());
};
{% endhighlight %}
* This fails, so fix it:
{% highlight javascript %}
var rpn_stack = function() {
  that = {};
  var values = [0];
  that.pop = function() {
    return values.pop();
  };
  that.push = function(value) {
    values.push(value);
  };
  return that;
};
{% endhighlight %}

* Check that it works:
{% highlight terminal %}
......
Total 6 tests (Passed: 6; Fails: 0; Errors: 0) (0.00 ms)
  Chrome 16.0.912.75 Mac OS: Run 6 tests (Passed: 6; Fails: 0; Errors 0) (0.00 ms)
{% endhighlight %}

* Do these tests seem familiar? They are almost straight out of **src-test/rpn_calculator_test.js**. Along those lines, here's a check similar to the last one we wrote on rpn_calculator:
{% highlight javascript %}
rpn_stack_test.prototype.testSeveralDropsAndPopIsStill0 = function() {
  var values = rpn_stack();
  values.drop();
  values.drop();
  values.drop();
  assertEquals(0, values.pop());
};
{% endhighlight %}

* Run the tests, you'll notice you the result is undefined instead of 0. This is a quick fix:

{% highlight javascript %}
var rpn_stack = function() {
  that = {};
  var values = [];
  that.pop = function() {
    if(values.length > 0)
      return values.pop();
    return 0;
  };
  that.push = function(value) {
    values.push(value);
  };
  return that;
};
{% endhighlight %}

* Run the tests, you should be back to passing.

* A quick check of rpn_calculator.js and you'll notice that while there's a use of ".length", this has been pushed into the new rpn_stack class. However, there's also a need to get the top without removing it. So two more TDD cycles:
{% highlight javascript %}
rpn_stack_test.prototype.testTopOfNewStack0 = function() {
  assertEquals(0, rpn_stack().top());
};
{% endhighlight %}

* And top version 1:
{% highlight javascript %}
  that.top = function() {
    return 0;
  };
{% endhighlight %}

* Then something similar to what we did for pop:
{% highlight javascript %}
rpn_stack_test.prototype.testTopReturnsLastValuePushed = function() {
  var values = rpn_stack();
  values.push(19);
  assertEquals(19, values.top());
};
{% endhighlight %}

* And a fix:
{% highlight javascript %}
  that.top = function() {
    if(values.length > 0)
      return values[values.length-1];
    return 0;
  };
{% endhighlight %}
* Notice that there's some duplication between top and pop. When I know JavaScript well enough, I'll remove it. Until then, let's use this new object in rpn_calculator.

## Using rpn_stack in rpn_calculator
* Make a few updates to the rpn_calculator class:
{% highlight javascript %}
var rpn_calculator = function() {
  var that = {};
  var values = rpn_stack();
  that.value = values; 
  that.x = function() {
    return values.top();
  };
  that.enter = function(newValue) {
    values.push(newValue);
  };
  that.drop = function() {
    values.pop()
  };  
  return that;
};
{% endhighlight %}

* Run the tests, everything should be passing. Here's the full version of rpn_stack.js:
{: #helpremovedryviolation}
### src/rpn_stack.js
{% highlight javascript %}
var rpn_stack = function() {
  that = {}; 
  var values = [];
  that.pop = function() {
    if(values.length > 0)
      return values.pop();
    return 0;
  }
  that.push = function(value) {
    values.push(value);
  };
  that.top = function() {
    if(values.length > 0)
      return values[values.length-1];
    return 0;
  };
  return that;
};
{% endhighlight %}
