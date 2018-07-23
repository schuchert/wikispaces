---
title: Red_Green_Refactor
---
Red:Green:Refactor comes from JUnit. A Red bar means one or more tests failed. Green means all tests passed. You refactor when things are green so you know you didn't break anything
* Red: Write one test, the test probably won't compile
* Red: Get the test to compile, the test probably won't pass
* Green: Get the test to pass
* Refactor: Clean up duplication and [[Hide the Ugly]]

It's useful when starting out to use time-boxing to help keep things simple:
1. Red < x minutes
2. Green < 2x minutes
3. Refactor < 3x minutes

"x" should be small--1-5 minutes*. The idea is to write code in as simple of chunks as you can, growing the complexity intentionally from previous code that already works. It's much easier to go back to a "known good state" if you haven't coded for long.

The "2x" limit has a two-fold purpose: to help drive the test to test simple stuff (how long will take to make the assertions pass?) and to help keep the code focused and not overly elaborate until it actually works.

The "3x" limit is to remind us that, while there's no limit to the amount of time we could spend refactoring, there usually is a limit to how valuable it is to do so.

* Some c++ developers might groan at a short time limit because incremental builds can take a very long time (more than 5 minutes!). Chose "x" appropriate to the cost of your cycle time....