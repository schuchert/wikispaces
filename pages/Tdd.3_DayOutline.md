---
title: Tdd.3_DayOutline
---
# Introduction
This is approximately the outline I use for a 3-day TDD course. I've used this outline in Java, C# and C++. How far I get depends on the students and the language. The flow can vary based on where the students want to go, their experience, etc.

# Day 1
* Basic TDD
** Use Rpn Calculator to teach basic TDD
** Create: plus, minus, factorial
** Observe feature envy and fix by creating Operand Stack
** Observe violation of OCP based on calculator interface and fix
** Observe violation of SRP based on evaluation:
*** Introduce strategy
*** Introduce factory

# Day 2
** Observe violation of DRY and fix by introducing ABC + template method pattern
*** Use spy classes to build ABC without creating concrete subclasses
*** Update plus/minus to use
** Have them create the following additional "operators"
*** Sum of all elements on operand stack
*** Prime factors
*** Introduce composite pattern, sum of prime factors, prime factors of sum
** General pattern discussion
*** Everything is about polymorphism
*** Compare and contract
*** Design of pattern versus its intent
*** Discuss specific patterns students ask about
* Clean Code
** Change the structure of supplied code (and unit tests) - I could follow my colleague Bob Koss and do this first
** Demonstrate refactoring after the students have done so
** Discuss characterization tests
** Discuss code smell: switch
** Demonstrate refactoring to polymorphism/strategy pattern

# Day 3
* New problem (sometimes I intersperse this one with the sum of the stack and prime factors above): [logging in]({{ site.pagesurl}}/Tdd.Problems.LoggingIn)
** Introduce a mocking library (Rhino Mock for .Net and JMock 2 for Java - hand-rolled for C++).
** Implement enough of this to discuss complexity of logic
** Discuss state pattern
** Refactor to patterns: state pattern
* Wrapup
