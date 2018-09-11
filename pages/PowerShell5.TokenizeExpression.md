---
title: PowerShell5.TokenizeExpression
---
[<--Back](PowerShell5)

# Overview
The next problem is an implementation of the [The Shunting Yard Algorithm Kata](Katas.ShuntingYardAlgorithm). To implement this algorithm, we need to be able to break a complex expression into its logical parts. For example:
^
| Expression |
|4+5|4|+|5|
|a * 3 + 1|a|*|3|+|1|
|(4 + 5) * x|(|4|+|5|)|*|x|
|f(g(q^6))|f|(|g|(|q|^|6|)|)|

Here are some notes and observations from these examples:
* Generally, whitespace is ignored, and isn't even necessary
* Whitespace is not allowed between the name of a function and the ( that starts the list of parameters

Initially, we only want to break expressions into their logical parts. Notice, we should simply make sure everything uses whitespace, but since we're practicing TDD, we can use this as a good place to start.

# Getting Started
Create a directory into which we will store all of the test code and the production. Given that this example leads into the [The Shunting Yard Algorithm Kata](Katas.ShuntingYardAlgorithm), I'll create C:\Users\Brett\shunting_yard_algorithm.

* [First Failing Test](PowerShell5-Tokenize_Expression-First_Failing_Test)
* [Simple Binary Expressions](PowerShell5-Tokenize_Expression-Simple_Binary_Expressions)
* [First Stab At Parentheses](PowerShell5-Tokenize_Expression-First_Stab_At_Parentheses)
* [FunctionCalls](PowerShell5-Tokenize_Expression-Function_Calls)
* [Convert Tokenizer to an Enumerator](PowerShell5-Tokenize_Expression-Convert_Tokenizer_To_An_Enumeratr)
* [My Final-ishVersion](PowerShell5-Tokenize_Expression-Finalish_Version)
* [Tutorial As One Page](PowerShell5-Tokenize_Expression-As_One_Page)

[<--Back](PowerShell5)

