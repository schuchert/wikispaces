---
title: Katas.ShuntingYardAlgorithm.examples
---

|-----|---|---|
| Example Infix Expression | Expected Postfix Result| Notes |
| <empty string> | <empty string> |A good place to start, you'll create the basic translator class and get a value back.|
| <null> | <empty string> |Make sure you handle one error case, a null string, by returning a reasonable default value of an empty string.|
|45 | 45 |Make sure you can handle a simple, literal number. This test may work out of the box, if not, it should be simple to get it to work.|
| + | + |Make sure you can handle a simple operator. This test will probably work out of the box after getting the previous test to pass. Later on, this test represents a error case of sorts since there are no operands for this operator.|
| 3 + 8 | 3 8 + |Your first "real" test, can you perform some basic translation?|
| 2 + 9 - 6 | 2 9 + 6 - |You probably hard-coded the first example, this makes you do a little more work. And it adds a second operator to boot.|
| 2 + 9 * 6 | 2 9 6 * + |This is the first example where operator precedence makes a difference.|
|2 * 10 ^ 6 |2  10  6  ^  *|The ^ (raised to the power of) operator is typically a right-associative operator.|
| 2 ^ 3 ^ 4 | 2 3 4 ^ ^ |This was a bit of a dud test I added. It immeidately passed. Might consider leaving this one out.|
| a ^ 3 | a 3 ^ |I want my expression evaluator to handle symbols as well as literal numbers. This example forces that behavior.|
| (3 + 4) | 3 4 + |Handle ()'s. First, simply remove them.|
| (3 + 4) * 5 | 3 4 + 5 * |Now make sure that ()s change the order of evaluation since + typically happens// **after**// *.|
| (3+(4-5))*6 | 3 4 5 - + 6 * |A more complex example to verify that the solution is general. Also notice that the spaces between separate tokens has been removed. You'll need to handle both with and without spaces.|
| f(3) | 3 f |This is an example of a function call. Notice, this forces "look ahead" in your algorithm because you do not know if something is a function or a variable unless you look ahead to the next token. |
| f(g(4)) | 4 g f |Is your solution general enough to handle nested functions?|
| f(3, 4, 19) | 3 4 19 f |Can your solution handle multiple parameters to a function call?|
|3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3| 3 4 2 * 1 5 - 2 3 ^ ^ / +|This example is taken from the [Shunting Yard Algorithm writeup on wikipedia](http://en.wikipedia.org/wiki/Shunting_yard_algorithm).|
|f(4+5,1+a^2,(8+b)*10)|4 5 + 1 a 2 ^ + 8 b + 10 * f|I added this some time later. It incorporates just about everything already done and it specifically pushes handling multiple parameters to a function correctly. I expected this to take some time, but it really did not take much (a few minutes).|

