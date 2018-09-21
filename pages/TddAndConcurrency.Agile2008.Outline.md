---
title: TddAndConcurrency.Agile2008.Outline
---
## Part 0
Begin running driver that exercises [ObjectWithValue](TddAndConcurrency.ObjectWithValue) before the start.

At start, David Nunn will present himself and myself.
## Part 1: Prove it's broken

* Show trivial code example ([ObjectWithValue](TddAndConcurrency.ObjectWithValue))
* Show results of running driver, the code is broken
* Ask by table:
  * Help me demonstrate that this code is broken with a test
  * Here are a few candidate characteristics of a good test: Fast, Independent, Reliable, Self-validating, Timely. Which of these apply to your approach? Do all of these apply?
  * Start running demo in XP under Parallels so I can discuss those results
* Poll Tables
  * Collect their ideas (added to results of workshop)
    * Ask if anybody has coded it and if so do they want to demo it?
    * If not, anybody want to pair on this?
    * Collect group testing ideas
  * Demo my test, walk through it. Run it with 2 threads, 10000 loops.
    * Run with OS X 1.5 and 1.6 JVM, run with Parallels-based XP running JDK ?
    * Relate examples from developing course
    * Discuss a few findings
    * Reduce numbers to 2 and 20 and then run it with ConTest
    * Question: How do we trade-off repeatability and fast in this context?

## Part 2: Deadlock and Dining Philosophers

Problem: Imagine you have two pooled resources: one bucket of MQ connections and one bucket of database connections. Also imagine 4 operations: CRUD, each of which uses one connection and one database. Finally, assume these operations are fronted by some threaded environment, e.g. a web-server:
* In your groups discuss the following:
  * Is deadlock possible?
  * Describe a specific scenario that causes it?
  * How can you guarantee it cannot happen?
  * How can you demonstrate deadlock occurring via a test?
  * How can you show that it probably isn't going to happen?
  * 10-minute table-top discussion

Dining Philosophers:
* Describe the problem
* Describe one solution
* Describe the conditions for deadlock (summarize)
* List the big three algorithms
* Quesitons/Comments

## Part 3: Refactorig to SRP to test

Show example system that is not performing.
* How can I assert my desired goal
* How can I approach it
* How can I test for it?

What should I do to make this testable?
