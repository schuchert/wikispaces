---
title: PowerShell5.TokenizeExpression
---
[<--Back]({{ site.pagesurl}}/PowerShell5)

# Overview
The next problem is an implementation of the [The Shunting Yard Algorithm Kata]({{ site.pagesurl}}/Katas.ShuntingYardAlgorithm). To implement this algorithm, we need to be able to break a complex expression into its logical parts. For example:
|~ Expression|
|4+5|4|+|5|
|a * 3 + 1|a|*|3|+|1|
|(4 + 5) * x|(|4|+|5|)|*|x|
|f(g(q^6))|f|(|g|(|q|^|6|)|)|

Here are some notes and observations from these examples:
* Generally, whitespace is ignored, and isn't even necessary
* Whitespace is not allowed between the name of a function and the ( that starts the list of parameters

Initially, we only want to break expressions into their logical parts. Notice, we should simply make sure everything uses whitespace, but since we're practicing TDD, we can use this as a good place to start.

# Getting Started
Create a directory into which we will store all of the test code and the production. Given that this example leads into the [The Shunting Yard Algorithm Kata]({{ site.pagesurl}}/Katas.ShuntingYardAlgorithm), I'll create C:\Users\Brett\shunting_yard_algorithm.

## [First FailingTest]({{ site.pagesurl}}/PowerShell5 Tokenize Expression First Failing Test)
## [Simple Binary Expressions]({{ site.pagesurl}}/PowerShell5.TokenizeExpression.SimpleBinaryExpressions)
## [First Stab At Parentheses]({{ site.pagesurl}}/PowerShell5.TokenizeExpression.FirstStabAtParentheses)
## [FunctionCalls]({{ site.pagesurl}}/PowerShell5.TokenizeExpression.FunctionCalls)
## [Convert Tokenizer to an Enumerator]({{ site.pagesurl}}/PowerShell5.TokenizeExpression.ConvertTokenizerToAnEnumerator)
## [My Final-ishVersion]({{ site.pagesurl}}/PowerShell5.TokenizeExpression.FinalishVersion)
## [Tutorial As One Page]({{ site.pagesurl}}/PowerShell5.TokenizeExpression.AtOnePage)
[<--Back]({{ site.pagesurl}}/PowerShell5)