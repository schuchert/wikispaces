---
title: DebuggingThreadedCodePart1.Original
---
## Introduction
This page describes some of what it takes to successfully test thread-related code. The primary emphasis here is on supporting technology rather than techniques.

## Broken Code
Here is some simple production code:
**//ClassWithThreadingProblem.java//**
```java
01: package example;
02: 
03: public class ClassWithThreadingProblem {
04:     int lastId;
05: 
06:     public int takeNextId() {
07:         return ++lastId;
08:     }
09: }
```

The name should be a hint that it has problems, and it does. If a single instance of this class is used by more than one thread, it is possible that expression ++lastId on line 7 could fail. How? If one thread starts executing that method and another thread preempts it, than we could lose one of the updates.

Think it is not possible? It is. 
----
## What is an atomic operation in the JVM?
You can safely [skip]({{ site.pagesurl }}/DebuggingThreadedCodePart1.Original#SkipOverBytecodeInformation) this section if you are not interested in the bit-head information.

What is an atomic operation? Any operation that cannot be interrupted from when it starts to when it completes. For example, in the following code, line 5, where 1 is assigned to i, is atomic. It cannot be interrupted:
```java
01: public class Example {
02:    int value;
03:
04:    public void assignOneToValue() {
05:        value = 1;
06:    }
07:}
```

What happens if we change line 5 to use ++ instead? It is still atomic?
```java
01: public class Example {
02:    int value;
03:
04:    public void incrementValueByOne() {
05:        ++value;
06:    }
07:}
```

In this case, the answer is it can be interrupted, it is not atomic.

Before we go any further, here are three definitions that will be important:
||**Term**||**Definition**||
||[call stack](http://java.sun.com/docs/books/jvms/second_edition/html/Instructions.doc.html|frame]]||Every method invocation requires a frame. The frame includes the return address, any parameters passed into the method and the local variables defined in the method. This is a standard technique used to define a [[http://en.wikipedia.org/wiki/Call_stack), which is used by modern languages to allow for basic function/method invocation and to allow for recursive invocation.||
||[Local Variable](http://java.sun.com/docs/books/jvms/second_edition/html/Overview.doc.html#15722)||Any variables defined in the method. All non-static methods have at least one variable,// **this**//, which represents the current object; the object that received the most recent message (in the current thread), which caused the method invocation.||
||[LIFO](http://java.sun.com/docs/books/jvms/second_edition/html/Overview.doc.html#28851|Operand Stack]]||Many of the instructions in the Java Virtual machine take parameters. The operand stack is where those parameters are put. The stack is a standard [[http://en.wikipedia.org/wiki/LIFO) data structure.||
So what constitutes an atomic operation in Java? A simple definition would be: The execution of a single [Java VM Specification](http://java.sun.com/docs/books/jvms/second_edition/html/Instructions.doc.html|Instruction]] as defined in the [[http://java.sun.com/docs/books/jvms/second_edition/html/VMSpecTOC.doc.html). At least that was my old mental model. This is a gross oversimplification - in fact, I don't think it is even a good mental model, but I haven't got one to replace it yet. To really understand what an atomic operation is in Java, you must understand the Java memory model. Suffice it to say, assigning a 32-bit value (in this case an int) into a field is guaranteed to be atomic.

Even so, let's have a look at the details of this one line of Java code. The instruction set for the first example, where we assign 1 to the field value, is:
||**mnemonic**||**description**||**Operand Stack After**||
||ALOAD 0||Load the 0th variable onto the operand stack. What is the 0th variable? It is// **this**//. It is the current object. When this method was called, the receiver of the message, an instance of ClassWithThreadingProblem, was pushed into the local variable array of the [frame](http://java.sun.com/docs/books/jvms/second_edition/html/Instructions.doc.html) created for method invocation. This is always the first variable put in every instance method.||this||
||ICONST_1||Load the constant value 1 onto the operand stack.||this, 1||
||PUTFIELD value||Store the top value on the stack (which is 1) into the field **value** of the object referred to by the object reference one away from the top of the stack.||<empty>||

So isn't that three instructions? It is. However, these three instructions are guaranteed to essentially be atomic because while the thread executing them could be interrupted, the information for the PUTFIELD instruction (the constant value 1 on the top of the stack and the reference to **this** one below the top, along with the field **value**) cannot be touched by another thread so when the assignment occurs, we are guaranteed that the value 1 will be stored in the field i. The operation is atomic.

That same guarantee does// **not//** not apply for 64 bit types (e.g. longs and doubles) since assigning to a 64-bit variables requires two 32-bit assignments.

If we look at the second operation, ++, it gets even worse (assume that value holds 42 at the beginning of this method):
||**mnemonic**||**description**||**Operand Stack After**||
||ALOAD 0||Load// **this**// onto the operand stack.||this||
||DUP ||Copy the top of the stack. We now have two copies of// **this**// on the operand stack.||this, this||
||GETFIELD lastId||Retrieve the value o the field lastId and store it on the stack. d ||this, 42||
||ICONST_1||Add the constant 1 to the stack. ||this, 42, 1||
||IADD||Integer add the top two values on the operand stack and store the result back on the operand stack.||this, 43||
||PUTFIELD value||Store the top value on the operand stack, 43, into the field value of the current object, represented by the next-to-top value on the operand stack,// **this**//.||<empty>||

There are several places where this sequence of steps could be interrupted. One bad case is where two threads both call the same method on the same object. The first thread completes the first three instructions, up to GETFIELD, and the is interrupted. A second thread takes over and performed the entire method, incrementing value by one. Then the first thread picks up where it left off. It has the// **old**// value on its operand stack. It adds one and stores the result. This results in adding one two times and only incrementing by one because two threads stepped on each other.
----
[[#SkipOverBytecodeInformation]]
## Demonstrating the failure with a test
Here's a description of a test that will prove our code is broken:
# Remember the current value of lastId
# Create two threads, both of which call takeNextId() once
# Verify that lastId is two more than what we started with
# Run this until we demonstrate that lastId was only incremented by one, instead of two. 

Here is such a test:
[[#ClassWithThreadingProblemTest]]
**//ClassWithThreadingProblemTest.java//**
```java
01: package example;
02: 
03: import static org.junit.Assert.fail;
04: 
05: import org.junit.Test;
06: 
07: public class ClassWithThreadingProblemTest {
08:     @Test
09:     public void twoThreadsShouldFailEventually() throws Exception {
10:         final ClassWithThreadingProblem classWithThreadingProblem 
                = new ClassWithThreadingProblem();
11: 
12:         Runnable runnable = new Runnable() {
13:             public void run() {
14:                 classWithThreadingProblem.takeNextId();
15:             }
16:         };
17: 
18:         for (int i = 0; i < 50000; ++i) {
19:             int startingId = classWithThreadingProblem.lastId;
20:             int expectedResult = 2 + startingId;
21: 
22:             Thread t1 = new Thread(runnable);
23:             Thread t2 = new Thread(runnable);
24:             t1.start();
25:             t2.start();
26:             t1.join();
27:             t2.join();
28: 
29:             int endingId = classWithThreadingProblem.lastId;
30: 
31:             if (endingId != expectedResult)
32:                 return;
33:         }
34: 
35:         fail("This test should have exposed a threading issue but it did not.");
36:     }
37: }
```
### Interesting Lines
||Line||Description||
||10||Create a single instance of ClassWithThreadingProblem. Note, we must use the final keyword since we use it below in an anonymous inner class||
||12 - 16||Create an anonymous inner class that uses the single instance of ClassWithThreadingProblem||
||18||Run this code "enough" times to demonstrate that the code failed, but not so much that the test "takes too long." This is a balancing act, we don't want to wait too long to demonstrate failure. Picking this number is hard - although later we'll see that we can greatly reduce this number.||
||19||Remember the starting value. This test is trying to prove that the code in ClassWithThreadingProblem is broken. If this test// **passes**//, it proved that the code was// **broken**//. If this test// **fails**//, the test was unable to prove the the code is broken.||
||20||We expect the final value to be 2 more than the current value.||
||22 - 23||Create two threads, both of which use the object we created in lines 12 - 16. This gives us the potential of two threads trying to use our single instance of ClassWithThreadingProblem and interfering with each other.||
||24 - 25||Make our two threads eligible to run.||
||26 - 27||Wait for both threads to finish before we check the results.||
||29||Record the actual final value.||
||31 - 32||Did our endingId differ from what we expected? If so, return - end the test - we've proven that the code is broken. If not, try again.||
||35||If we got to here, our test was unable to prove the production code was broken so we have failed. Either the code is not broken or we didn't run enough iterations to get the failure condition to occur.||
----
OK, I've lied. This test will not reliably (or even frequently) demonstrate that the code we're testing is broken. 

I tried running it with a larger number of iterations and running it multiple times. It did demonstrate the code was broken occasionally, but rarely. In 10 executions with a loop count of 1,000,000, the test failed once. So you can interpret this as roughly a 10% success rate (1 in 10 times demonstrated the failure).

Maybe we could improve our chances. We could change our Runnable() from incrementing the value once to 10, 100 or 1,000,000 times. This could increase our success rate. If that does not work, we could increase the loop on line 18 to 1,000,000. Eventually, we could get this test to prove that the code is broken more reliably, right? If that did not work, we could create 5, 10, 100 threads. That's three different dimensions of flexibility we could use to try and prove this code is broken.

Good luck. Even if you get it to fail with 50% reliability in under 30 seconds on one machine, you'll probably have to re-tune the test with different values to demonstrate the failure on another machine, or operating system, or version of the JVM. Note that this is about as simple as multi-threading gets. If we cannot demonstrate broken code easily here, we are in trouble.

So what approaches can we take to demonstrate this simple failure? And, more importantly, how can we write tests that will demonstrate failures in more complex code? How will we be able to discover if our code has failures when we do not know where to look?

Here are a few ideas:
* Make tests flexible, so they can be tuned. Then run the test over and over - say on a test server - randomly changing the tuning values. If tests ever fail, the code is broken (assuming the tests are correct). Make sure to start writing those tests early so a continuous integration server start running them now. By the way, good luck knowing the conditions under which the test failed.
* Run the test on every one of the target deployment platforms. Repeatedly. Continuously. The longer the tests run without failure, the more confident that either:
** The production code is correct
** The tests aren't adequate to expose problems
* Run the tests on a machine with varying loads. If you can simulate loads close to a production environment, do so.

You should be doing all of these things anyway. If you are writing threaded code and you are not doing all of these things, you have a design debt. By doing all of these things, you are simply getting back to a debt of 0 with respect to thread-based testing.

Yet, even with all of these things, you might still not find threading problems with your code. However, lets work off the assumption you've done your due diligence and you want to significantly increase the chances that you'll find threading problems with your code, can you do so?

Yes.
----
## Tool Support for Thread-Based Code
There is a tool from IBM called [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html) that will instrument classes to make it more likely that such non-thread-safe code more reliably fails.

//Note, I do not have any direct relationship with IBM or the team that developed [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html). A colleague of mine pointed me to it and I've worked with it a little bit. I noticed vast improvement in my ability to find threading issues after a few minutes of using it.//

Here's an outline of how to use [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html):
# Write tests and production code, making sure there are tests specifically designed to simulate multiple users under varying loads, as mentioned above
# Instrument test and production code [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html)
# Run the tests

When I instrumented my code with [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html|ConTest]], my success rate went from roughly 10% to roughly 100%. I think in practice 10% is too high since I happened to see the code fail in one run of a series of 10 back-to-back runs. However, I had not seen it fail before nor since. The value of 100% is probably a bit high as well. I checked the value of the loop variable for several runs, and the test was able to demonstrate that the code was faulty early in the loop. Here are the loop values for several runs of the test: 13, 23, 0, 54, 16, 14, 6, 69, 107, 49, 2. That is, [[http://www.haifa.ibm.com/projects/verification/contest/index.html)-instrumented classes failed much earlier and with much greater reliability. Every time I have run the test after instrumentation, it demonstrates the code failed. However, I cannot say with certainty that the test will expose the problem 100% of the time. Even so, there's at least one order, and probably closer to 2 orders of magnitude improvement in our ability to discover problems in our thread-based code.

At a first glance, that is the primary purpose of [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html|ConTest]]. It instruments your classes so that during execution time, [[http://www.haifa.ibm.com/projects/verification/contest/index.html) adds so-called noise into the execution of your tests. By doing so, it increases the number of ways in which the threads in your tests interleave with each other, which increases the likelihood of exposing unsafe execution orderings. However, it additionally remembers the order in which things occurred, so it is also possible that it can help you figure out why your code broke so you have a better chance of fixing it.

Describing how [publications.](http://www.haifa.ibm.com/projects/verification/contest/index.html|ConTest]] actually accomplishes this, and what other features it offers, is better described by several [[http://www.haifa.ibm.com/projects/verification/contest/publications.html)
----
## Manual Instrumentation is for the Birds
A short time before writing this, I wrote something on using the -javaagent VM argument for dynamic instrumentation ([ConTest]({{ site.pagesurl }}/JavaAgent]]) of classes while they are loaded into the Java VM. I wrote that in support of applying [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html) instrumentation automatically using so-called dynamic instrumentation. I do not not like the manual step of instrumenting my classes with [[http://www.haifa.ibm.com/projects/verification/contest/index.html) every time I was ready to run my tests.

To instrument your classes using [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html), you issue a command like the following:
```terminal
java -classpath ConTest.jar com.ibm.contest.instrumentation.Instrument Class1.class
```

I wanted to avoid having to manually instrument, but while I was working on this, the team supporting ConTest added a class called ClassStreamInstrumentor(), which takes the raw bytes of classes loaded by the class loader and instruments them to work with ConTest.

I was able to us this class to write a very quick dynamic instrumentor. First I wrote a [[JavaAgent]] class for generic registration of classes implementing ClassFileTransformer. Then I wrote an implementation of ClassFileTransformer that:
# Uses a new instance of ClassStreamInstrumentor to instrument loaded classes (checking for classes to skip)
# Return those instrumented bytes

This does require some command-line parameters when starting the JVM (or some one-time IDE configuration). But this works. So my process to use [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html) is this:
# (one time)Configure my IDE to add a few parameters to the execution of the Java VM running my tests
# Write my tests and production code
# Execute my tests

The first (one time) step, makes sure every time my IDE runs the Java VM, it passes parameters to the Java VM. Those parameters cause the registration of a class that uses the [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html) instrumentation infrastructure on each individual class loaded so I can avoid the manual step of instrumentation.

If you want to read more on how that happens, go [here]({{ site.pagesurl }}/JavaAgent).
----
## Trying It Yourself
Here's a jar file you can use that will give you the same results: [[file:Registrar.jar]]

To use this jar:
# Download the file Registrar.jar
# [Download ConTest](http://www.alphaworks.ibm.com/tech/contest/download?open&S_TACT=105AGX59&S_CMP=GR)
# Add the ConTest.jar to your classpath
# Start the VM with the following command (I've added some whitespace to make this readable):
```terminal
java -javaagent:Registrar.jar 
     -Dschuchert.ClassFileTransformer=schuchert.contest.DynamicInstrumentor 
     schuchert.agent.Main
```

You should see results similar to this:
```java
Congratulations, everything appears to be working
```

## Configuration Details
All of the properties ConTest allows you to define are still available. These are just the properties to define for the Java Agent and the ClassFileTransformer.

||**property**||**description**||**default**||
||schuchert.DI.classFilter||A double colon separated list of regular expressions used to match classes. Note that classes are fully-qualified, with / between the packages.||-com.*::-java.*::-org.*||
||schuchert.ClassFileTransformer||The name of a class to load for dynamic instrumentation. This can be a single colon separated list of fully-qualified class names.||None. Must be specified.||
Note that this jar contains several JUnit 4 test cases. If you'd like to run the test, you'll need JUnit 4.4, JMock 2.4 (and all of its jars) and ConTest.jar in your class path.
----
## Questions?
Send me an email at schuchert at yahoo dot com or schuchert at objectmentor dot com.