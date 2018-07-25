---
title: Katas.ExpressionTokenizer
---
[<--Back]({{ site.pagesurl}}/Katas)
# Background
While working on the [Shunting Yard Algorithm Kata]({{ site.pagesurl}}/Katas.ShuntingYardAlgorithm), it became apparent that one part of the problem is taking an expression and determining its various parts, or turning it into a sequence of tokens. In my original attempts at the Shunting Yard Algorithm, I ignored the problem. I made sure each token in the input string was separated by spaces. For example:
* ( 3 + 4 ) / 5 * f ( g ( 4 , 3 , 2 ) ) instead of
* (3+4)/5*f(g(4,3,2))

While this simplifies the original shunting yard algorithm problem, it seemed quite artificial. In recent (June 2009) attempts, I tried various ways of pre-processing the algorithm:
* Manually adding spaces around "things of significance"
* Manually adding spaces around all operators and the parentheses

The problem with these approaches were:
* They were ugly
* They left too much responsibility in the original algorithm
* They were error prone or ended up having to do some high-level processing (e.g., is == two = operators or one == operator)
* The implementation made heavy use of regular expressions and was getting fairly cryptic

At one point, I tried a spiked refactoring, creating an expression token iterator. I started with some simple tests and worked up to what I though would work, plugged it in to a working implementation of the shunting yard algorithm (it worked) and then I decided to try it again and came up with an even better implementation. Each of the next two times I tried the problem, I made significant changes. The last form was a total of 33 source lines making heavy use of regular expressions (with 6 lines dedicated to making the regular expressions easier to understand).

What follows is a description of the problem in terms of tests and expected results. Note that as of this writing, the tests drive the implementation from taking a single string and creating an iterator that gives you a series of tokens as strings. It is reasonable to build some kind of "token" object rather than just a string. However, this kata does not go in that direction.

# The Problem
A mathematical expression consists of a sequence of numbers, variables, operators, function calls and parentheses. Processing such an expression requires clearly knowing its various parts. One way to process such an expression is to develop a [B.N.F](http://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) representation and then use some kind of parser library (e.g., [Y.A.C.C.](http://en.wikipedia.org/wiki/Yacc)) to parse it.

Alternatively, you can build a parser from the ground up using a series of more expressive micro tests, and that's what kata is about. As with the [Shunting Yard Algorithm Kata]({{ site.pagesurl}}/Katas.ShuntingYardAlgorith), this one is designed around a series of examples and expected results. 

What follows is a series of examples to drive your work and some supplemental materials you may choose to use to create further tests.

## The Examples
Here is a list of examples that should build the majority of the tokenizer:

| Example | Resulting Tokens | Description|
|<empty>|<empty>|Standard first test. Creates production code. Begins creation of API.|
|"42"|"42"|Handle a single token.|
|"123+"|"123", "+"|Handle more than one token|
|"99-134"|"99", "-", "134"|Generalize to handle a number of tokens.|
|99 - 134"|"99", "-", "134"|Handle spaces within an expression.|
|"  99\t -\t 134 "|"99", "-", "134"|Skip whitespace at the beginning and end of an expression.|
|"a == b"|"a", "==", "b"|Make sure to handle multi-character operators.|
|<null>|<empty>|Handle a null expression gracefully.|
|"'"|<should throw exception>|Handle an unknown character gracefully.|
|"()"|"(", ")"|Make sure to handle ()s|
|"(3.42 + 6) * a"|"(", "3.42", "+", "6", ")", "*", "a"|Verify floating point numbers work.|
|"a_13(f(4+5,1+a*2,(8+b)*10))"|"a_13", "(", "f", "(", "4", "+", "5", ",", "1", "+", "a", "*", "2", ",", "(", "8", "+", "b", ")", "*", "10", ")", ")"|A final "scary" expression to make sure it will work for the final shunting yard algorithm.|
[[#MoreExamples]]
## More Examples
After releasing some of this into the wild, I started getting some feedback from, among other people Mitch B (<http://cleverlytitled.blogspot.com/>). What follows are a few more tests for edge conditions and other no-so-happy-path-related things. Thanks to Mitch for pointing out these tests as well as providing an improved implementation:

| Example | Results | Description |
|"4 + 5 *  '"|"4", "+", "5", "*", <error>|The trailing single-tick is not a valid token so the tokenizer should generate an error upon reaching that token. It should be possible to get the tokens before it:  "4", "+", "5", "*".|
|"value+++4"|"value", "++", "+", "4"|This is valid Java/C++. Notice that the largest token it taken from +++. This is how both Java and C++ would parse such an expression.|
|"5~€"|<error>|This may be a duplicate of the first example. I added several different tests. However, there's no whitespace, so this might force your implementation a little bit.|
|"(3+2)*7"|"(", "3", "+", "2", ")", "*", "7"|This seems like other tests and your solution might work out of the box. Mine originally did, but when I make more heavy use of the regular expression implementation in Java// **and**// used the new for syntax to read the tokens, this failed because my implementation of hasNext() was not [Idempotent](http://en.wikipedia.org/wiki/Idempotent).|
|"3@+2"|"3", <error>|This is similar to the previous error conditions but it involves an embedded error rather than something at the end of an expression. As I made heavier use of the regular expression library, I broke what was passing.|

## Peek
One final thing you might want to consider is the ability to "look ahead". When handling function calls in an expression, without having a previous definition of functions, you cannot tell whether a symbol is a function call or a reference to a variable. I solved this by looking ahead to the next token to see if it was an open parenthesis: (. If it is, then the symbol represents a function call. If not, then it's just a variable.

Here's one such test:
```java
   @Test
   public void itCanPeekAhead() {
      ExpressionTokenizer tokenizer = new ExpressionTokenizer("f(3)");
      assertEquals("f", tokenizer.next());
      assertEquals("(", tokenizer.peek());
      assertEquals("(", tokenizer.next());
      assertEquals("3", tokenizer.next());
   }
```

## Additional Information
Here is a list of potential operators you might want to make sure you can handle:

| Operators| Description|
|++ ``  `` --|Increment/Decrement|
|[]|Array subscripting|
|.|Element selection through object or reference|
|->|Element access through pointer|
|+ -|Unary plus/minus, add a sign to a number|
|! ~|Logical not, bitwise not|
|*|Dereference|
|&|Address of|
| / * % |Division, multiplication, modulus|
|+ -|Addition and subtraction|
|<< >>|Bitwise shift left/right|
| <= <|Less than or equal to, less than|
| >= >|Greater than or equal to, greater than|
| ``==``  ``!=`` |Equal, not equal|
|&|Bitwise AND|
|^|Bitwise XOR|
| \| |Bitwise OR|
|&&|Logical AND|
| \|\| | Logical OR|
|? :|Ternary conditional|
|=|Assignment|
|+= -=|Add to, subtract from.|
|*= /= %=|Multiply by, divide by, mod by|
|<<= >>=|Left shift by, right shift by|
|&= ^= \|=|Bitwise add by, bitwise xor by, bitwise or by|
|,|Comma operator/function parameter separator.|

# The Approach
Use the examples provided as a basis for the first tests. For each of the tests:
* Add the next one on the list (it will probably fail)
* While keeping the code compiling and all previouslly written tests passing, get the new test to pass
* Review your production code, refactor as necessary (you probably have not refactored it enough)
* Review your test code, refactor as necessary
* Work on the tests in the order listed
* When you have all the tests passing, refactor the hell out of your code (when you're done, you probably still have not refactored it enough)

My first version was long (don't have a count). My next version was shorter (127 lines). My next version was shorter still (93) lines. I found an intermediate form that was roughly 50 lines. My final version was 26 lines and I lengthened it to 33 lines to make the regular expressions easier to follow. In all cases, the numbers are for// **text**// lines, which include the package statement, import statements, blank lines, etc. The shortest version I wrote (by couting source lines) was 7 lines of code (email me and I'll provide it).

Oh, and the longest method in my final version has 4 lines (including one blank line), there are two conditionals in the entire solution. Of course, that's making heavy use of the regular expression support in Java.

[<--Back]({{ site.pagesurl}}/Katas)
