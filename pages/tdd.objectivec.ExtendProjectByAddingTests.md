---
title: tdd.objectivec.ExtendProjectByAddingTests
---
## Background
This material assumes you have already [created an XCode project with these steps]({{ site.pagesurl}}/tdd.objectivec.XCodeProjectSetup).

## Continue with next test
The next test adds the ability to set the accumulator's value:
{% highlight c %}
-(void)testAllowItsAccumulatorToBeSet {
	RpnCalculator *calculator = [[RpnCalculator alloc] init];
	calculator.accumulator = 42;
	STAssertEquals(42, calculator.accumulator, @"");
	[calculator release];
}
{% endhighlight %}

This test fails because the accumulator property is currently read only. Remove that restriction by updating RpnCalculator.h from:
{% highlight c %}
@property (readonly) int accumulator;
{% endhighlight %}

To:
{% highlight c %}
@property int accumulator;
{% endhighlight %}

## First Refactoring: Clean up duplication
In each of the tests, the code:
* Allocates and initializes an RpnCalculator instance
* Does some "real" work
* Validates the results
* Releases the memory allocated.

The first and last step are common, so we'll refactor the code using the Test Class as a full-fledged test fixture.

* Update ANewlyCreatedRpnCalculatorShould.h:
{% highlight c %}
# import <SenTestingKit/SenTestingKit.h>
# import "RpnCalculator.h"

@interface ANewlyCreatedRpnCalculatorShould : SenTestCase {
	RpnCalculator *calculator;
}

-(void)setUp;
-(void)tearDown;

@end
{% endhighlight %}

This adds an instance variable that will be available to each test method. It also declares that the unit testing's setUp and tearDown hook methods will be used.

* Now, update ANewlyCreatedRpnCalculatorShould.m:
{% highlight c %}
# import "ANewlyCreatedRpnCalculatorShould.h"
# import "RpnCalculator.h"

@implementation ANewlyCreatedRpnCalculatorShould

-(void)setUp {
	calculator = [[RpnCalculator alloc] init];
}

-(void)tearDown {
	[calculator release];
}
@end
{% endhighlight %}

This adds support to remove common code, but we have not yet changed any of the unit tests.

* Build your system.

Notice that the tests actually pass, but there are several warnings. The problem is that there is a local variable called calculator that hided the instance variable. While this "works" it's bad form. Since we now have support for common setup and tear down, simply update both of the unit tests:

{% highlight c %}
-(void)testHave0InItsAccumulator {
	STAssertEquals(0, calculator.accumulator, @"");
}

-(void)testAllowItsAccumulatorToBeSet {
	calculator.accumulator = 42;
	STAssertEquals(42, calculator.accumulator, @"");
}
{% endhighlight %}

* Build your system again.

Everything is back to green.

## Supporting basic math operations: addition
