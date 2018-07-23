---
title: Cxx_TDD_Monopoly
---
# Introduction

This tutorial takes you from the ground up working with a unit testing tool called [[http://cxxtest.sourceforge.net/|CxxTest]]. It uses the user stories and acceptance tests from [[Monopoly(r)]] as the basis of requirements and works through four iterations. We'll use the traditional Red:Green:Refactor approach to TDD.

## Assumptions
* Writing reliable code is more important than writing "efficient" code
* Writing maintainable code is more important that writing "efficient" code
* Writing testable code is more important that writing "efficient" code

"Efficient" is quoted because while I care about efficiency, I am more concerned about being able to write high-quality, well tested code that works "fast enough." If the code I write is not "fast enough" then I'll use tools to find bottlenecks and improve efficiency. I'll know that I have not broken anything because I'll have a suite of tests that will serve as my safety net.

If you find yourself not agreeing with the last paragraph, then you might want to consider saving yourself the time of reading this tutorial.

By the way, I recently found out that my Pentium-M processor takes on the order of pico-seconds to invoke a Java method (the equivalent of a virtual function in C++). It's not that I don't care about efficiency, I do. It's just that I don't buy the typical arguments that non-virtual functions are faster. Of course they are, but who cares. That fact without the context of your application is irrelevant.

If your curiosity is piqued, read on.

## Background
This tutorial is not meant to teach you C++. It is meant to teach you how to apply TDD using C++. However, along the way you might pick up a few things about C++. If you are a long-time C++ user, you will probably argue with many of the parts of the solution for a number of reasons:
* "Unnecessary" use of virtual functions
* "Unnecessary" use of pointers and dynamic memory when defining stuff on the stack would "suffice"
* The ordering of the development is all wrong, in fact it's downright backwards.

If you can get past this and actually give it a try, you might just end up really liking it. I can say from my own personal experience that I did not pick up anything like TDD in a strict sense until about early 2005. I used C++ from 1989 - 1997 and started picking it back up again in 2007. Java from 1996 - ???. You can also add Smalltalk, some Self and a few other languages including C#. For some time I was big into formal design before coding. I have been writing some form of unit tests since around 1998 or so, but writing unit tests after writing you code, while effective, is not the same as TDD. I would go so far as to say not only is it not the same, it is not as effective.

TDD drives you to develop your code differently. You will end up writing code that is testable. You might have seen this notion of testability, well when we start introducing Mocks and Stubs, you'll see what this testability really means.

In this example, I've used the following tools:
* Cygwin 1.5.24-2
* g++ 3.4.4
* make built in to Cygwin
* makedepend built into Cygwin
* Subversion client built into Cygwin
* [Subversion server]({{ site.pagesurl }}/Subversion on XP)
* [[http://cxxtest.sourceforge.net/|CxxTest]] version 3.10.1

## Overview
When we talk about TDD, you'll often hear "Red, Green, Refactor." This is a light-weight way to remind us of the steps we take while practicing TDD. In practice there are more than three steps:
||**Color**||**You do what?**||**What can you expect?**||
||Red||Write a test||The test will not compile yet, because there's no supporting code||
||Red||Get the test to compile||Add minimal code to get your test to compile. It sill will not pass.||
||Green||Get the test to pass||Write enough code to get the test to pass. Try not to write any more than necessary.||
||Refactor||Remove code smells||See if you have any code smells such as duplicated code, long methods, etc. and change the code without change its behavior||

(The Red, Green come from JUnit, which is Java-centric unit test tool with a long history.)

These are the basic steps for TDD. In the bigger picture of a team development effort you might be practicing continuous integration. If so, there are a few more steps we should add to integrate our code with the existing code base. That is out of the scope of what we're trying to do here, though occasionally you notice comments about when it might be a good idea to check in.

What you can expect over the next several parts of this tutorial are a series of tests following these four basic steps: Red (Write Test), Red (Get It To Compile), Green(Get It To Pass), Refactor(clean up after yourself).

We will break our work across several iterations. Each iteration will last from a few to several hours. Within each iteration we will work on several "user stories" - or short statements about things we'd like to be able to observe in our system. Along with each user story we will have user acceptance criteria - things that if we can demonstrate, will show our system satisfies the user stories.

So here's our algorithm for addressing each iteration:
```
  For each user story in iteration
    For each user acceptance test in user story
      if current user acceptance test is big/complex
        parts := break user acceptance test into pieces
      else 
        parts = user acceptance test
      endif 
      
      for each part
        write test // Red
        get test to compile // Red
        get test to pass // Green
        remove code smells // Refactor
      end
    end
   end
```

## The Iterations
If you are ready to move on, here are the four iterations:
* [C++ TDD Iteration 1]({{ site.pagesurl }}/Cxx Tdd Iteration 1)
* [C++ TDD Iteration 2]({{ site.pagesurl }}/Cxx Tdd Iteration 2)
* [C++ TDD Iteration 2 - The Demo]({{ site.pagesurl }}/Cxx Tdd Iteration 2 - The Demo)
* [C++ TDD Iteration 3]({{ site.pagesurl }}/Cxx Tdd Iteration 3)
* [C++ TDD Iteration 4]({{ site.pagesurl }}/Cxx Tdd Iteration 4)
