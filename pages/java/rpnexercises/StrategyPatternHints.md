---
title: Strategy Pattern Hints
---

There are several things woth noticing about what is common and what is not common:
* Some operators take 2 parameters, e.g., `add`
* Some operators take 1 parameter, e.g., `factorial`
* Currently all operators return a value, given what you know about calculators, is that a safe assumption?
  * Hint, it is not. We will eventually have operatos like `swap` that reverse the top two values, or `drop` that simply gets rid of a values
* Eventually there might be operators that consume no values but actually put values on the stack, e.g., `random`

About the only thing that will ultimately be common across all of the math operators will be that they:
* consume 0 or more operands
* produce 0 or more results

So the only thing that all of the operators have in common will be the `RpnStack`.

