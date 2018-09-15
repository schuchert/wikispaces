---
title: CppRpnCalculatorStrategyPatternExample
---
[<--Back](RpnCalculatorCppExampleImplementation)
## Strategy Pattern Example
Review first the abstract base classes of all strategies (in this case, math operators):
### MathOperator.h
{% highlight cpp %}
# ifndef MATHOPERATOR_H
# define MATHOPERATOR_H

class OperandStack;

class MathOperator
{
public:
   MathOperator();
   virtual ~MathOperator();
   virtual void execute(OperandStack& stack) = 0;
};

# endif
{% endhighlight %}

This defines that any operator can perform its work by having its **execute** method called passing in an OperandStack. An operand stack is a regular stack that:
* Returns 0 if it is empty
* Is as big as memory allows.

Here is an example of a concrete implementation, a factorial method:
### Factorial.cpp
{% highlight cpp %}
void Factorial::execute(OperandStack& stack) {
   int count = stack.pop();

   if(count < 0)
      throw InvalidOperandException();

   int result = 1;

   for(int i = 0; i < count; ++i)
      result *= (i + 1);

   stack.enter(result);
}
{% endhighlight %}

Here are the tests that verify it works as expected(using CppUTest):
### FactorialTest.cpp
{% highlight cpp %}
# include "CppUTest/TestHarness.h"

# include "OperandStack.h"
# include "Factorial.h"
# include "InvalidOperandException.h"

TEST_GROUP(Factorial) {
   void assertFactorialOfIs(int number, int expectedValue) {
      OperandStack stack;
      stack.enter(number);
      Factorial factorial;
      factorial.execute(stack);
      LONGS_EQUAL(expectedValue, stack.top());
   }
};

TEST(Factorial, 0factorial) {
   assertFactorialOfIs(0, 1);
}

TEST(Factorial, nFactorial) {
   assertFactorialOfIs(7, 5040);
}

TEST(Factorial, factorialOfNegativeNumber) {
   try {
      assertFactorialOfIs( - 7, 0);
   } catch(InvalidOperandException &) {
      return ;
   }
   FAIL("Should have thrown InvalidOperandException");
}
{% endhighlight %}

In the next section, **Template Method Pattern Example**, each of the subclasses are all examples of the strategy as well.

[<--Back](RpnCalculatorCppExampleImplementation)
