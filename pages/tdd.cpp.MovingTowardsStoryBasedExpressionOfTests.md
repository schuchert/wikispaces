---
title: tdd.cpp.MovingTowardsStoryBasedExpressionOfTests
---
# Introduction
Bob Martin has an excellent Tdd Kata called [The Prime Factors Kata](http://butunclebob.com/ArticleS.UncleBob.ThePrimeFactorsKata). When I teach Tdd, I often use this as part of the [[RPN Calculator]] problem. I have the students add two operators:
* Sum of the stack
* Prime Factors
Then I have them create a composite operator and build an instance using a sum of prime factors and the prime factors of the sum. Really, this is just an excuse to use the [Composite Pattern](http://en.wikipedia.org/wiki/Composite_pattern) in conjunction with the strategy pattern.

Recently, I took a bit of a different approach to writing the tests as a way to demonstrate alternative approaches to writing unit tests. After the class I continued experimenting with various forms and what I ended up on a plane ride from Cleveland to Chicago was pretty interesting, at least to me. What the rest of this article contains is number of versions of the same tests written in different ways.

# Typical Tests
Typically, I introduce this problem similar to how Bob introduces it (it is his problem after all), with the following test cases:

||~ value||~ expected results||
||1|| ||
||2|| 2 ||
||3|| 3 ||
||4|| 2, 2 ||
||5|| 5 ||
||6|| 2, 3 ||
||7|| 7 ||
||8|| 2, 2, 2||
||1024||2, 2, 2, 2, 2, 2, 2, 2, 2, 2||
 
Here is one way to write these tests using [CppUTest](http://www.cpputest.org/):
**PrimeFactorsOperator.cpp**
```cpp
# include <CppUTest/TestHarness.h>

# include "OperandStack.h"
# include "PrimeFactorsOperator.h"

TEST_GROUP(PrimeFactorsOperatorTest) {
   PrimeFactorsOperator op;
   OperandStack* stack;

   virtual void setup() {
      stack = new OperandStack;
   }

   virtual void teardown() {
      delete stack;
   }
};

TEST(PrimeFactorsOperatorTest, 1ResultsInNothing) {
   stack->push(1);
   op.execute(*stack);
   LONGS_EQUAL(0, stack->top());
}

TEST(PrimeFactorsOperatorTest, 2ResultsIn2) {
   stack->push(2);
   op.execute(*stack);
   LONGS_EQUAL(2, stack->top());
}

TEST(PrimeFactorsOperatorTest, 3ResultsIn3) {
   stack->push(3);
   op.execute(*stack);
   LONGS_EQUAL(3, stack->top());
}

TEST(PrimeFactorsOperatorTest, 4ResultsIn2and2) {
   stack->push(4);
   op.execute(*stack);
   LONGS_EQUAL(2, stack->top());
   stack->pop();
   LONGS_EQUAL(2, stack->top());
}

TEST(PrimeFactorsOperatorTest, 5ResultsIn5) {
   stack->push(5);
   op.execute(*stack);
   LONGS_EQUAL(5, stack->top());
}

TEST(PrimeFactorsOperatorTest, 6ResultsIn2and3) {
   stack->push(6);
   op.execute(*stack);
   LONGS_EQUAL(3, stack->top());
   stack->pop();
   LONGS_EQUAL(2, stack->top());
}

TEST(PrimeFactorsOperatorTest, 7ResultsIn7) {
   stack->push(7);
   op.execute(*stack);
   LONGS_EQUAL(7, stack->top());
}

TEST(PrimeFactorsOperatorTest, 8ResultsIn2and2and2) {
   stack->push(8);
   op.execute(*stack);
   for(int i = 0; i < 3; ++i) {
      LONGS_EQUAL(2, stack->top());
      stack->pop();
   }
}

TEST(PrimeFactorsOperatorTest, 1024ResultsInTen2s) {
   stack->push(1024);
   op.execute(*stack);
   for(int i = 0; i < 10; ++i) {
      LONGS_EQUAL(2, stack->top());
      stack->pop();
   }
}
```

# [DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Violation?
There is a lot of duplication in this test code. Often, test code might have more duplication than production code to make it easier to understand without hunting around. Even so, this really seems to abuse duplication unnecessarily. Here is the same thing simply cleaned up a bit:
```cpp
# include <CppUTest/TestHarness.h>

# include "OperandStack.h"
# include "PrimeFactorsOperator.h"

TEST_GROUP(PrimeFactorsOperatorTest) {
   // snip
   void stackContains(int value) {
      LONGS_EQUAL(value, stack->top());
      stack->pop();
   }
};

TEST(PrimeFactorsOperatorTest, 1ResultsInNothing) {
   evalute(1);
   stackContains(0);
}

TEST(PrimeFactorsOperatorTest, 2ResultsIn2) {
   evalute(2);
   stackContains(2);
}

TEST(PrimeFactorsOperatorTest, 3ResultsIn3) {
   evalute(3);
   stackContains(3);
}

TEST(PrimeFactorsOperatorTest, 4ResultsIn2and2) {
   evalute(4);
   stackContains(2);
   stackContains(2);
}

TEST(PrimeFactorsOperatorTest, 5ResultsIn5) {
   evalute(5);
   stackContains(5);
}

TEST(PrimeFactorsOperatorTest, 6ResultsIn2and3) {
   evalute(6);
   stackContains(3);
   stackContains(2);
}

TEST(PrimeFactorsOperatorTest, 7ResultsIn7) {
   evalute(7);
   stackContains(7);
}

TEST(PrimeFactorsOperatorTest, 8ResultsIn2and2and2) {
   evalute(8);
   for(int i = 0; i < 3; ++i)
      stackContains(2);
}

TEST(PrimeFactorsOperatorTest, 1024ResultsInTen2s) {
   evalute(1024);
   for(int i = 0; i < 10; ++i) 
      stackContains(2);
}
```
This example includes a few support methods to **evaluate()** and then check that the **stackContains()** a given value. The code is more expressive and even 6 lines shorter (just counting the ;'s, not the source lines).

# Multiple Lines for Checking
The next thing worth improving is the multiple lines used to determine what is on the Operand Stack. There are multiple approaches to solving this, here are a few you might consider:
* using several overloaded methods, one for 1 expected value, 2 expected values, ...
* using a method with several (we'd need at least 10) arguments with all but the first value defaulted to 0
* using variable arguments
* constructing a vector<int> with the expected values
* passing in a command separated string of values
* or ...

Here is one example using a (crazy) long list of parameters:
```cpp
# include <CppUTest/TestHarness.h>

# include "OperandStack.h"
# include "PrimeFactorsOperator.h"

TEST_GROUP(PrimeFactorsOperatorTest) {
   // snip

   void evalute(int value) {
      stack->push(value);
      op.execute(*stack);
   }
   
   void checkOneValue(int value) {
      LONGS_EQUAL(value, stack->top());
      stack->pop();
   }

   void stackContains(int v1,int v2=0,int v3=0,int v4=0,int v5=0,int v6=0,int v7=0,int v8=0, int v9=0,int v10=0) {
      checkOneValue(v1);
      checkOneValue(v2);
      checkOneValue(v3);
      checkOneValue(v4);
      checkOneValue(v5);
      checkOneValue(v6);
      checkOneValue(v7);
      checkOneValue(v8);
      checkOneValue(v9);
      checkOneValue(v10);
   }
};

TEST(PrimeFactorsOperatorTest, 1ResultsInNothing) {
   evalute(1);
   stackContains(0);
}

TEST(PrimeFactorsOperatorTest, 2ResultsIn2) {
   evalute(2);
   stackContains(2);
}

TEST(PrimeFactorsOperatorTest, 3ResultsIn3) {
   evalute(3);
   stackContains(3);
}

TEST(PrimeFactorsOperatorTest, 4ResultsIn2and2) {
   evalute(4);
   stackContains(2, 2);
}

TEST(PrimeFactorsOperatorTest, 5ResultsIn5) {
   evalute(5);
   stackContains(5);
}

TEST(PrimeFactorsOperatorTest, 6ResultsIn2and3) {
   evalute(6);
   stackContains(3, 2);
}

TEST(PrimeFactorsOperatorTest, 7ResultsIn7) {
   evalute(7);
   stackContains(7);
}

TEST(PrimeFactorsOperatorTest, 8ResultsIn2and2and2) {
   evalute(8);
   stackContains(2, 2, 2);
}

TEST(PrimeFactorsOperatorTest, 1024ResultsInTen2s) {
   evalute(1024);
   stackContains(2, 2, 2, 2, 2, 2, 2, 2, 2, 2);
}
```
This might seem like an improvement. The ugliness is hidden in one method, **stackContains()**, but the tests look better. However, when I was updating the final test, I had to count the number of 2s several times to make sure I had 10. In fact, the number of numbers on the stack is implicitly specified by the number of numbers passed in to th emethod, but never explicitly checked. This is only a problem if you pass in too few numbers. For example, the final test will pass with anywhere from 1 to 10 2s. Any other number or more than 10 2's (other than extra 0's) and the test will fail. 

It would be nice to be able to specify the total number of elements that should be on the stack after executing the operator. It will actually increase the length of the tests, but it might also make them more expressive.

Consider this version:
```cpp
# include <CppUTest/TestHarness.h>

# include "OperandStack.h"
# include "PrimeFactorsOperator.h"

TEST_GROUP(PrimeFactorsOperatorTest) {
   // snip

   void stackSizeShouldBe(int expectedLength) {
      LONGS_EQUAL(expectedLength, stack->size());
   }
};

TEST(PrimeFactorsOperatorTest, 1ResultsInNothing) {
   evalute(1);
   stackSizeShouldBe(0);
}

TEST(PrimeFactorsOperatorTest, 2ResultsIn2) {
   evalute(2);
   stackSizeShouldBe(1);
   stackShouldContain(2);
}

TEST(PrimeFactorsOperatorTest, 3ResultsIn3) {
   evalute(3);
   stackSizeShouldBe(1);
   stackShouldContain(3);
}

TEST(PrimeFactorsOperatorTest, 4ResultsIn2and2) {
   evalute(4);
   stackSizeShouldBe(2);
   stackShouldContain(2, 2);
}

TEST(PrimeFactorsOperatorTest, 5ResultsIn5) {
   evalute(5);
   stackSizeShouldBe(1);
   stackShouldContain(5);
}

TEST(PrimeFactorsOperatorTest, 6ResultsIn2and3) {
   evalute(6);
   stackSizeShouldBe(2);
   stackShouldContain(3, 2);
}

TEST(PrimeFactorsOperatorTest, 7ResultsIn7) {
   evalute(7);
   stackSizeShouldBe(1);
   stackShouldContain(7);
}

TEST(PrimeFactorsOperatorTest, 8ResultsIn2and2and2) {
   evalute(8);
   stackSizeShouldBe(3);
   stackShouldContain(2, 2, 2);
}

TEST(PrimeFactorsOperatorTest, 1024ResultsInTen2s) {
   evalute(1024);
   stackSizeShouldBe(10);
   stackShouldContain(2, 2, 2, 2, 2, 2, 2, 2, 2, 2);
}
```

# Now we can improve that Ugly Method
The method taking 10 parameters was just a temporary solution. Now we can rewrite it using variable arguments. A problem with variable arguments is that you need some way to know when to stop reading. Putting in the **stackSizeShouldBe()** method gives us a natural way to express the number of variable arguments:
```cpp
//snip
# include <stdarg.h>

TEST_GROUP(PrimeFactorsOperatorTest) {
   int expectedStackLength;

   //snip

   void stackSizeShouldBe(int expectedLength) {
      expectedStackLength = expectedLength;
      LONGS_EQUAL(expectedLength, stack->size());
   }

   void stackShouldContain(int expected, ...) {
      checkOneValue(expected);

      va_list others;
      va_start(others, expected);

      for(int i = 1; i < expectedStackLength; ++i) 
         checkOneValue(va_arg(others, int));

      va_end(others);
   }
};
```

These tests are somewhat influenced by BDD and some experience I've had using [RSpec](http://rspec.info). One thing these tests exhibit from my RSpec experience is that some of the steps with the test have a side-effect of storing intermediate information used later in the test. This often happens within an RSpec example as well. You can see several detailed [Ruby examples here]({{ site.pagesurl}}/ruby.tutorials) for some examples of this style of testing.
# Story-Runner Influenced Tests
Here is another, probably over the top, version of the tests using more of a story-runner influence. This comes from my recent experience working through a beta version of [The RSpec Book](http://www.pragprog.com/titles/achbd/the-rspec-book) and specifically using [Cucumber](http://wiki.github.com/aslakhellesoy/cucumber).

For these unit tests, I believe this is overkill. However, it does show another way to express tests:
```cpp
# include <CppUTest/TestHarness.h>

# include "OperandStack.h"
# include "PrimeFactorsOperator.h"

# include <stdarg.h>
# include <string>
using namespace std;

TEST_GROUP(PrimeFactorsOperatorTest) {
   PrimeFactorsOperator op;
   OperandStack* stack;
   int expectedStackLength;
   int operand;

   virtual void setup() {
      stack = new OperandStack;
   }

   virtual void teardown() {
      delete stack;
   }

   void checkOneValue(int value) {
      LONGS_EQUAL(value, stack->top());
      stack->pop();
   }

   void stackSizeShouldBe(int expectedLength) {
      expectedStackLength = expectedLength;
      LONGS_EQUAL(expectedLength, stack->size());
   }

   void report(const string &) {
      // do something interesting here
   }

   void Given(const string &message, int value) {
      report(message);
      operand = value;
   }

   void When(const string &message) {
      report(message);
      stack->push(operand);
      op.execute(*stack);
   }

   void Then(const string &message, int value) {
      report(message);
      stackSizeShouldBe(value);
   }

   void And(const string& message, int value) {
      report(message);
      checkOneValue(value);
   }
};

TEST(PrimeFactorsOperatorTest, 1ResultsInNothing) {
   Given("an operand of", 1);
   When("I calculate its prime factors");
   Then("the stack size should be", 0);
}

TEST(PrimeFactorsOperatorTest, 2ResultsIn2) {
   Given("an operand of", 2);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 2);
}

TEST(PrimeFactorsOperatorTest, 3ResultsIn3) {
   Given("an operand of", 3);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 3);
}

TEST(PrimeFactorsOperatorTest, 4ResultsIn2and2) {
   Given("an operand of", 4);
   When("I calculate its prime factors");
   Then("the stack size should be", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
}

TEST(PrimeFactorsOperatorTest, 5ResultsIn5) {
   Given("an operand of", 5);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 5);
}

TEST(PrimeFactorsOperatorTest, 6ResultsIn2and3) {
   Given("an operand of", 6);
   When("I calculate its prime factors");
   Then("the stack size should be", 2);
   And("the stack should contain", 3);
   And("the stack should contain", 2);
}

TEST(PrimeFactorsOperatorTest, 7ResultsIn7) {
   Given("an operand of", 7);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 7);
}

TEST(PrimeFactorsOperatorTest, 8ResultsIn2and2and2) {
   Given("an operand of", 8);
   When("I calculate its prime factors");
   Then("the stack size should be", 3);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
}

TEST(PrimeFactorsOperatorTest, 1024ResultsInTen2s) {
   Given("an operand of", 1024);
its
   Then("the stack size should be", 10);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
   And("the stack should contain", 2);
}
```
In some respects, this looks close to the original version. BDD makes several suggestions regarding developing systems:
* Work from outside to inside (this is also the message of TDD if you review the original sources, but it's one that might have gotten lost)
* Use a standard (ubiquitous) language to describe examples or stories
* Think in terms of examples or behavior, not tests (this is really more a problem with using the word test in test driven development)

In this example, the thing I've introduced is the use of a ubiquitous language to express the behavior of my system. As I mentioned above, I believe this is overkill for a unit-level test. Even so, it certainly is interesting to me to see a test structured in this way in C++. Among other story runners, [Cucumber](http://wiki.github.com/aslakhellesoy/cucumber) uses the following standard words to express steps in a story or feature:
* Given - an assumption about the setup/pre-conditions of the system before the story unfolds
* When - the event that causes the setup/pre-conditions to be used by the system to produce results
* Then - the expected results/post-conditions
* And - add additional pre-conditions or post-conditions (facts) about the system before or after the event in question.

Unlike Ruby, C++ doesn't really offer a very expressive way to make this look unencumbered. Even so, I like the way this test reads. I don't think I'd do this in practice, but one thing I do like as a take-away is the idea that there can be steps in the middle of a test that store values (storing the stack size), which are then used in later steps. I like this style of test writing because:
* It can make tests more expressive
* It uses the test fixture for setup, teardown and intermediate results - making it a collector or context under which the test operates.

This second point is a bit ironic coming from me. There's a design pattern from Smalltalk called [self-shunt](http://www.objectmentor.com/resources/articles/SelfShunPtrn.pdf). I'm not a big fan of that pattern, but that pattern shares similarities with the second bullet. So I might have to reassess that pattern.

# One Final Version
In Cucumber, often the "And" step includes one thing to check. There's no reason to disallow more than one thing to check. Given the a previous solution using variable arguments, it seems OK to bring that back to clean up the examples that have so many "And" lines:

```cpp
# include <CppUTest/TestHarness.h>

# include "OperandStack.h"
# include "PrimeFactorsOperator.h"

# include <stdarg.h>
# include <string>
using namespace std;

TEST_GROUP(PrimeFactorsOperatorTest) {
   PrimeFactorsOperator op;
   OperandStack* stack;
   int expectedStackLength;
   int operand;

   virtual void setup() {
      stack = new OperandStack;
   }

   virtual void teardown() {
      delete stack;
   }

   void checkOneValue(int value) {
      LONGS_EQUAL(value, stack->top());
      stack->pop();
   }

   void stackSizeShouldBe(int expectedLength) {
      expectedStackLength = expectedLength;
      LONGS_EQUAL(expectedLength, stack->size());
   }

   void report(const string&) {
      // do something interesting here
   }

   void Given(const string& message, int value) {
      report(message);
      operand = value;
   }

   void When(const string& message) {
      report(message);
      stack->push(operand);
      op.execute(*stack);
   }

   void Then(const string& message, int value) {
      report(message);
      stackSizeShouldBe(value);
   }

   void And(const string& message, int expected, ...) {
      report(message);

      checkOneValue(expected);

      va_list others;
      va_start(others, expected);

      for(int i = 1; i < expectedStackLength; ++i)
         checkOneValue(va_arg(others, int));

      va_end(others);
   }
};

TEST(PrimeFactorsOperatorTest, 1ResultsInNothing) {
   Given("an operand of", 1);
   When("I calculate its prime factors");
   Then("the stack size should be", 0);
}

TEST(PrimeFactorsOperatorTest, 2ResultsIn2) {
   Given("an operand of", 2);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 2);
}

TEST(PrimeFactorsOperatorTest, 3ResultsIn3) {
   Given("an operand of", 3);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 3);
}

TEST(PrimeFactorsOperatorTest, 4ResultsIn2and2) {
   Given("an operand of", 4);
   When("I calculate its prime factors");
   Then("the stack size should be", 2);
   And("the stack should contain", 2, 2);
}

TEST(PrimeFactorsOperatorTest, 5ResultsIn5) {
   Given("an operand of", 5);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 5);
}

TEST(PrimeFactorsOperatorTest, 6ResultsIn2and3) {
   Given("an operand of", 6);
   When("I calculate its prime factors");
   Then("the stack size should be", 2);
   And("the stack should contain", 3, 2);
}

TEST(PrimeFactorsOperatorTest, 7ResultsIn7) {
   Given("an operand of", 7);
   When("I calculate its prime factors");
   Then("the stack size should be", 1);
   And("the stack should contain", 7);
}

TEST(PrimeFactorsOperatorTest, 8ResultsIn2and2and2) {
   Given("an operand of", 8);
   When("I calculate its prime factors");
   Then("the stack size should be", 3);
   And("the stack should contain", 2, 2, 2);
}

TEST(PrimeFactorsOperatorTest, 1024ResultsInTen2s) {
   Given("an operand of", 1024);
   When("I calculate its prime factors");
   Then("the stack size should be", 10);
   And("the stack should contain", 2, 2, 2, 2, 2, 2, 2, 2, 2, 2);
}
``` 

# Conclusion
We started with a fairly standard set of tests. There was some duplication, but there is a wide array of opinions on just how much the [DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle impacts the clarity of tests. Duplication is bad, but if [DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself) is the solution, then what problems might it introduce? (One of Jerry Weinberg's principles of problem solving is that "Every Solution introduces problems.") In the case of tests, applying the [DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle can lead to hard to understand tests. 

Even so, the first version seemed to have unnecessary duplication. That's where the second version made some improvements. However, one thing the second version lacked was a good way to check multiple results. It instead called a method each time for each of the expected results. In the last case, 1024, it uses a for-loop. This certainly makes the test pass and it can be interpreted, but that's sort of the point of writing expressive tests; they are easier to read and are expressed in a more natural language.

The next improvement was to allow multiple values to be passed in. There were several options, one taking multiple, default parameters, another using variable arguments. In between, we added an additional check, validating the stack size, which gave the information we needed to handle variable arguments as a side-benefit. I consider these improvements, but that's more in the eye of the reader.

Finally, I wanted to try to express the tests using a story-based style using a ubiquitous language. In reality, my first attempt used macros (example not shown). It worked but was ugly. Then, I wanted to try to make it more general so I created a template base class from which my unit test multiply-inherited. While this may be interesting to a bit-head like myself, it was overkill for a simple example. I chose in this example to just add the methods into the test class directly. I like the result. One thing I did not originally do was allow for multiple parameters into the **And()** method. I like this final version.

Here are a few things I hope you'll take away from reading this:
* There are many ways to express tests
* Even though we want to make tests self-evident, possibly not strictly following the [DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle, there's duplication and then there's// **duplication*//.
* Using intermediate test steps that record information in the test fixture can make for interesting possibilities. It made me personally reevaluate my dislike of the self-shunt pattern.
* You can take it too far. The story-based tests are interesting and appropriate for story/feature level functionality (acceptance tests anyone?) but probably are overkill for unit-level testing.

In the end, if we can write unit tests that are easy to read and easy to maintain, then having several different forms in our tool belt is a good thing.