---
title: Katas.ShuntingYardAlgorithm
---
[[Katas|<--Back]]
# Background
The [[http://en.wikipedia.org/wiki/Shunting_yard_algorithm|Shunting Yard Algorithm]], written by [[http://en.wikipedia.org/wiki/Edsger_Dijkstra|Dijkstra]], converts an infix expression into a post-fix expression. For example, the expression:
>> $$
3 + 4
$$
>> becomes
>> $$
3\;4\;+
$$

# Precedence and Associativity
What makes this difficult is that operators, generally, have some notion of precedence in most languages. For example, multiplication typically has a higher precedence than addition. So the expression 3 + 5 * 6 is 33 (multiplication happens first) rather than 40.

There's also the issue of associativity. For example, 3 + 4 + 5 happens left-to-right, or it is left-associative. On the other hand, assignment is right-associative. For example, a = b = c = 4, all values receive the value 4 because c = 4 is performed first, while b is assigned to the// **result**// of the assignment of c, which is 4.

For the purposes of this exercise, consider these [[http://en.wikipedia.org/wiki/Operators_in_C_and_C%2B%2B#Operator_precedence|precednece rules from C++]].

Note: This kata is in flux, I've added the link to the C++ operators but the examples use ^ as "to the power of" rather than bitwise negate. Follow the examples until I update the list of tests.

# Examples
Here is a series of examples with expected results:
>> [[include page="Katas.ShuntingYardAlgorithm.examples"]]

# One Approach
The examples above are taken from a recent (June 2009) personal walk-through of the algorithm. I was surprised by my results and the ease with which I was able to implement the algorithm. 

I recommend the following approach when trying this problem:
* Use the examples with the expected results shown above
* Work top to bottom in the order shown
* Add// **one**// example at a time and get all tests to pass
* Review both your test code and production code, refactoring as you see fit

One note, when I worked on this, I used Java with JUnit 4's parameterized tests. Here's what the final test file looks like:
```java
package com.om.example;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Collection;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class InfixToPostfixConverterTest {
   private final String infix;
   private final String expectedPostfix;

   @Parameters
   public static Collection<String[]> data() {
      ArrayList<String[]> values = new ArrayList<String[]>();

      addTestCase(values, null, "");
      addTestCase(values, "", "");
      addTestCase(values, "45", "45");
      addTestCase(values, "+", "+");
      addTestCase(values, "3 + 8", "3 8 +");
      addTestCase(values, "2 + 9 - 6", "2 9 + 6 -");
      addTestCase(values, "2 + 9 * 6", "2 9 6 * +");
      addTestCase(values, "2 * 10 ^ 6", "2 10 6 ^ *");
      addTestCase(values, "2 ^ 3 ^ 4", "2 3 4 ^ ^");
      addTestCase(values, "a ^ 3", "a 3 ^");
      addTestCase(values, "(3 + 4)", "3 4 +");
      addTestCase(values, "(3 + 4) * 5", "3 4 + 5 *");
      addTestCase(values, "(3+(4-5))*6", "3 4 5 - + 6 *");
      addTestCase(values, "f(3)", "3 f");
      addTestCase(values, "f(g(4))", "4 g f");
      addTestCase(values, "f(3, 4, 19)", "3 4 19 f");
      addTestCase(values, "3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3", "3 4 2 * 1 5 - 2 3 ^ ^ / +");
      addTestCase(values, "3+4*2/(1-5)^2^3", "3 4 2 * 1 5 - 2 3 ^ ^ / +");
      addTestCase(values, "f(4+5,1+a^2,(8+b)*10)","4 5 + 1 a 2 ^ + 8 b + 10 * f");

      return values;
   }

   private static void addTestCase(ArrayList<String[]> values, String infix,
         String expectedPostfix) {
      values.add(new String[] { infix, expectedPostfix });
   }

   public InfixToPostfixConverterTest(String infix, String expectedPostfix) {
      this.infix = infix;
      this.expectedPostfix = expectedPostfix;
   }

   @Test
   public void checkTranslation() {
      InfixToPostfixConverter converter = new InfixToPostfixConverter();
      String result = converter.translate(infix);

      assertEquals(expectedPostfix, result);
   }
}
```

This worked OK, but occasionally I wanted to run just one test. This does not seem to be supported, so I had to comment out various lines in the// **data()**// method. The next time I work on this, I'll probably use individual test methods.

# Getting Started
Here is one possible start to this problem (with the first three tests added and passing):
**The Test**
Note: Occasionally I experiment with different ways of writing unit tests with JUnit. This is one such example where I attempt to simulate the [[http://www.martinfowler.com/bliki/BusinessReadableDSL.html|domain specific language]] used by [[http://cukes.info/|cucumber]].
```java
package com.om.shuntingyardalgorithm;

import static junit.framework.Assert.assertEquals;

import org.junit.Test;

public class PostfixToInfixTranslatorTest {
   private PostfixToInfixTranslator translator = new PostfixToInfixTranslator();
   private String givenInfixExpression;
   private String actualPostfixResult;

   private void given(String infixExpression) {
      this.givenInfixExpression = infixExpression;
   }

   private void whenTranslating() {
      actualPostfixResult = translator.convert(givenInfixExpression);
   }

   private void thenTheResultShouldBe(String expectedPostfixResult) {
      assertEquals(expectedPostfixResult, actualPostfixResult);
   }

   @Test
   public void itShouldReturnAnEmptyStringWhenGivenAnEmptyString() {
      given("");
      whenTranslating();
      thenTheResultShouldBe("");
   }

   @Test
   public void itShouldReturnAnEmptyStringWhenGivenNull() {
      given(null);
      whenTranslating();
      thenTheResultShouldBe("");
   }

   @Test
   public void itShouldReturnLiteralNumberWhenGivenLiteralNumber() {
      given("45");
      whenTranslating();
      thenTheResultShouldBe("45");
   }
}
```

**The Production Code**
And here's the results after the first three tests:
```java
package com.om.shuntingyardalgorithm;

public class PostfixToInfixTranslator {
   public String convert(String givenInfixExpression) {
      if (givenInfixExpression == null)
         return "";

      return givenInfixExpression;
   }
}
```

# Hints
I take the approach of splitting the expression into individual tokens and then processing them one by one. To do this, I use regular expressions and to format the output, I use String.format(...). Here are a few hints along those lines:
* "3 + 4".split("\\s") - slits the string into an array: {"3", "+", "4"}.
* "3  +  4".split("\\s+") - same as above, but allows for 1 or more spaces.
* String.format("%s %s %s", "3", "4", "+") --> "3 4 +". Consider using String.format to format your output.
* When searching for operators using regular expressions, remember to escape them. E.g., "\\+". You can generally escape any character.
* Eventually, splitting the expression will be complex enough that it will warrant its own class with its own micro tests.
* The operators have difference associativity and precedence. Eventually, you'll probably want to create a class for that.
* Eventually you'll probably want a simple factory that can map a string into an operator.
* If you want to validate a number, you can use a regular expression or, in my case, the DecimalFormat class.

[[#ExampleSource]]
# What We Accomplished
Here's a zip of the source files we created during the dojo:
[[file:dojo.zip]]

Here's a version I've worked on a bit more:
[[file:ShuntingYardAlgorithm.zip]]
[[Katas|<--Back]]