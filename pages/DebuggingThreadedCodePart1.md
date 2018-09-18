---
title: DebuggingThreadedCodePart1
---
## Background
Writing unit tests for threaded code is hard. What follows is a simple example, along with instructions on how to improve your chances of finding threading errors in your code. I've updated this as of February 2010. [If you are looking for the original material, click here](DebuggingThreadedCodePart1.Original).

### Introduction
This page describes some of what it takes to successfully test thread-related code. The primary emphasis here is on supporting technology rather than techniques.

[If you just want to get to the step-by-step instructions, click here.](DebuggingThreadedCodePart1#StepByStepInstructions)
### Broken Code
Here is some simple production code:

#### ClassWithThreadingProblem.java

{% highlight java %}
01: package com.om.concurrent.example;
02: 
03: public class ClassWithThreadingProblem {
04:     int lastId;
05: 
06:     public int takeNextId() {
07:         return ++lastId;
08:     }
09: }
{% endhighlight %}

The name should be a hint that it has problems, and it does. If a single instance of this class is used by more than one thread, it is possible that expression ++lastId on line 7 could fail. How? If one thread starts executing that method and another thread preempts it, then one of the updates could get lost.

Think it is not possible? It is. 

### What is an atomic operation in the JVM?
You can safely [skip](DebuggingThreadedCodePart1#SkipOverBytecodeInformation) this section if you are not interested in the bit-head information.

What is an atomic operation? Any operation that cannot be interrupted from when it starts to when it completes. For example, in the following code, line 5, where 1 is assigned to value, is atomic. It cannot be interrupted:

{% highlight java %}
01: public class Example {
02:    int value;
03:
04:    public void assignOneToValue() {
05:        value = 1;
06:    }
07:}
{% endhighlight %}

What happens if we change line 5 to use ++ instead? It is still atomic?

{% highlight java %}
01: public class Example {
02:    int value;
03:
04:    public void incrementValueByOne() {
05:        ++value;
06:    }
07:}
{% endhighlight %}

In this case, the answer is it can be interrupted, it is not atomic.

Before we go any further, here are three definitions that will be important:

^
|---|---|
|**Term**|**Definition**|
|[frame](http://java.sun.com/docs/books/jvms/second_edition/html/Instructions.doc.html)|Every method invocation requires a frame. The frame includes the return address, any parameters passed into the method and the local variables defined in the method. This is a standard technique used to define a [call stack](http://en.wikipedia.org/wiki/Call_stack), which is used by modern languages to allow for basic function/method invocation and to allow for recursive invocation.|
|[Local Variable](http://java.sun.com/docs/books/jvms/second_edition/html/Overview.doc.html#15722)|Any variables defined in the method. All non-static methods have at least one variable,// **this**//, which represents the current object; the object that received the most recent message (in the current thread), which caused the method invocation.|
|[Operand Stack](http://java.sun.com/docs/books/jvms/second_edition/html/Overview.doc.html#28851)|Many of the instructions in the Java Virtual machine take parameters. The operand stack is where those parameters are put. The stack is a standard [LIFO](http://en.wikipedia.org/wiki/LIFO) data structure.|

So what constitutes an atomic operation in Java? A simple definition would be: The execution of a single [Instruction](http://java.sun.com/docs/books/jvms/second_edition/html/Instructions.doc.html) as defined in the [Java VM Specification](http://java.sun.com/docs/books/jvms/second_edition/html/VMSpecTOC.doc.html). At least that was my old mental model. This is a gross oversimplification - in fact, I don't think it is even a good mental model, but I haven't got one to replace it yet. To really understand what an atomic operation is in Java, you must understand the Java memory model. Suffice it to say, assigning a 32-bit value (in this case an int) into a field is guaranteed to be atomic.

Even so, let's have a look at the details of this one line of Java code. The instruction set for the first example, where we assign 1 to the field value, is:

|**mnemonic**|**description**|**Operand Stack After**|
|ALOAD 0|Load the 0th variable onto the operand stack. What is the 0th variable? It is// **this**//. It is the current object. When this method was called, the receiver of the message, an instance of ClassWithThreadingProblem, was pushed into the local variable array of the [frame](http://java.sun.com/docs/books/jvms/second_edition/html/Instructions.doc.html) created for method invocation. This is always the first variable put in every instance method.|this|
|ICONST_1|Load the constant value 1 onto the operand stack.|this, 1|
|PUTFIELD value|Store the top value on the stack (which is 1) into the field **value** of the object referred to by the object reference one away from the top of the stack.|<empty>|

So isn't that three instructions? It is. However, these three instructions are guaranteed to essentially be atomic because while the thread executing them could be interrupted, the information for the PUTFIELD instruction (the constant value 1 on the top of the stack and the reference to **this** one below the top, along with the field **value**) cannot be touched by another thread so when the assignment occurs, we are guaranteed that the value 1 will be stored in the field i. The operation is atomic.

That same guarantee does// **not//** not apply for 64 bit types (e.g. longs and doubles) since assigning to a 64-bit variables requires two 32-bit assignments.

If we look at the second operation, ++, it gets even worse (assume that value holds 42 at the beginning of this method):

|**mnemonic**|**description**|**Operand Stack After**|
|ALOAD 0|Load// **this**// onto the operand stack.|this|
|DUP |Copy the top of the stack. We now have two copies of// **this**// on the operand stack.|this, this|
|GETFIELD lastId|Retrieve the value o the field lastId and store it on the stack. d |this, 42|
|ICONST_1|Add the constant 1 to the stack. |this, 42, 1|
|IADD|Integer add the top two values on the operand stack and store the result back on the operand stack.|this, 43|
|PUTFIELD value|Store the top value on the operand stack, 43, into the field value of the current object, represented by the next-to-top value on the operand stack,// **this**//.|<empty>|

There are several places where this sequence of steps could be interrupted. One bad case is where two threads both call the same method on the same object. The first thread completes the first three instructions, up to GETFIELD, and the is interrupted. A second thread takes over and performed the entire method, incrementing value by one. Then the first thread picks up where it left off. It has the// **old**// value on its operand stack. It adds one and stores the result. This results in adding one two times and only incrementing by one because two threads stepped on each other.

[#SkipOverBytecodeInformation](#SkipOverBytecodeInformation)
### Demonstrating the failure with a test

Here's a description of a test that will prove our code is broken:
* Remember the current value of lastId
* Create two threads, both of which call takeNextId() once
* Verify that lastId is two more than what we started with
* Run this until we demonstrate that lastId was only incremented by one, instead of two. 

Here is such a test:
[#ClassWithThreadingProblemTest](#ClassWithThreadingProblemTest)
#### ClassWithThreadingProblemTest.java

{% highlight java %}
01: package com.om.concurrent.example;
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
31:             if (endingId != expectedResult) {
32:                 System.out.printf("Problem discovered at iteration: %d\n", i);
33:                 return;
34:             }
35: 
36:         fail("This test should have exposed a threading issue but it did not.");
37:     }
38: }
{% endhighlight %}
#### Interesting Lines

|Line|Description|
|10|Create a single instance of ClassWithThreadingProblem. Note, we must use the final keyword since we use it below in an anonymous inner class|
|12 - 16|Create an anonymous inner class that uses the single instance of ClassWithThreadingProblem|
|18|Run this code "enough" times to demonstrate that the code failed, but not so much that the test "takes too long." This is a balancing act, we don't want to wait too long to demonstrate failure. Picking this number is hard - although later we'll see that we can greatly reduce this number.|
|19|Remember the starting value. This test is trying to prove that the code in ClassWithThreadingProblem is broken. If this test// **passes**//, it proved that the code was// **broken**//. If this test// **fails**//, the test was unable to prove the the code is broken.|
|20|We expect the final value to be 2 more than the current value.|
|22 - 23|Create two threads, both of which use the object we created in lines 12 - 16. This gives us the potential of two threads trying to use our single instance of ClassWithThreadingProblem and interfering with each other.|
|24 - 25|Make our two threads eligible to run.|
|26 - 27|Wait for both threads to finish before we check the results.|
|29|Record the actual final value.|
|31 - 35|Did our endingId differ from what we expected? If so, return - end the test - we've proven that the code is broken. If not, try again. Report the iteration number at which we demonstrated the error.|
|36|If we got to here, our test was unable to prove the production code was broken so we have failed. Either the code is not broken or we didn't run enough iterations to get the failure condition to occur.|

OK, I've lied. This test will not reliably (or even frequently) demonstrate that the code we're testing is broken. 

I tried running it with a larger number of iterations and running it multiple times. It did demonstrate the code was broken occasionally, but rarely. In 10 executions with a loop count of 1,000,000, the test failed once. So you can interpret this as roughly a 10% success rate (1 in 10 times demonstrated the failure). Really, it's much worse than 10% as we will see.

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

### Tool Support for Thread-Based Code
There is a tool from IBM called [ConTest](http://www.alphaworks.ibm.com/tech/contest?open&S_TACT=105AGX59&S_CMP=GR&ca=dgr-lnxw03awcontest) that will instrument classes to make it more likely that such non-thread-safe code more reliably fails.

//Note, I do not have any direct relationship with IBM or the team that developed [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html). A colleague of mine pointed me to it and I've worked with it a little bit. I noticed vast improvement in my ability to find threading issues after a few minutes of using it.//

Here's an outline of how to use [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html):
* Write tests and production code, making sure there are tests specifically designed to simulate multiple users under varying loads, as mentioned above
* Instrument test and production code [ConTest](http://www.alphaworks.ibm.com/tech/contest?open&S_TACT=105AGX59&S_CMP=GR&ca=dgr-lnxw03awcontest)
* Run the tests

When I instrumented my code with [ConTest](http://www.alphaworks.ibm.com/tech/contest?open&S_TACT=105AGX59&S_CMP=GR&ca=dgr-lnxw03awcontest), my success rate went from roughly 10% to roughly 100%. I think in practice 10% is too high since I happened to see the code fail in one run of a series of 10 back-to-back runs. However, I had not seen it fail before nor since. The value of 100% is probably a bit high as well. I checked the value of the loop variable for several runs, and the test was able to demonstrate that the code was faulty early in the loop. Here are the loop values for several runs of the test: 13, 23, 0, 54, 16, 14, 6, 69, 107, 49, 2. That is, [ConTest](http://www.alphaworks.ibm.com/tech/contest?open&S_TACT=105AGX59&S_CMP=GR&ca=dgr-lnxw03awcontestl)-instrumented classes failed much earlier and with much greater reliability. Every time I have run the test after instrumentation, it demonstrates the code failed. However, I cannot say with certainty that the test will expose the problem 100% of the time. Even so, there's at least one order, and probably closer to 2 orders of magnitude improvement in our ability to discover problems in our thread-based code.

At a first glance, that is the primary purpose of [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html). It instruments your classes so that during execution time, [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html) adds so-called noise into the execution of your tests. By doing so, it increases the number of ways in which the threads in your tests interleave with each other, which increases the likelihood of exposing unsafe execution orderings. However, it additionally remembers the order in which things occurred, so it is also possible that it can help you figure out why your code broke so you have a better chance of fixing it.

Describing how [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html) actually accomplishes this, and what other features it offers, is better described by several [publications.](http://www.haifa.ibm.com/projects/verification/contest/publications.html)
----
[#StepByStepInstructions](#StepByStepInstructions)
### Getting it Working

First the steps in a nutshell:

* Download [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html), note you may need to create an account to do so.
* Create a project in your favorite IDE (I'll use Eclipse)
* Configure your test execution to include a command line parameter.
* Configure the "KingProperties" file to include your classes to be instrumented.

#### Download [ConTest](http://www.haifa.ibm.com/projects/verification/contest/index.html)
As of this writing, what you ultimately download is a zip file. That zip file contains a single directory, JavaConTest. Extract that file to a convenient location. In my case, I put that directory under the project in my Eclipse workspace directory. Specifically, my workspace directory is ~/src/ConTestFeb2010. I created a project called ConTestDemo, which created ~/src/ConTestFeb2010/ConTestDemo. I extracted the zip file to that directory, which created ~/src/ConTestFeb2010/ConTestFeb2010/JavaConTest.

#### Create Project
* Create a standard Java project in your IDE
* Create the problem class and test above in some package. (Here are the files without the line numbers for easy copying)
#### ClassWithThreadingProblem

{% highlight java %}
package com.om.concurrent.example;

public class ClassWithThreadingProblem {
    int lastId;

    public int takeNextId() {
        return ++lastId;
    }
}
{% endhighlight %}

#### ClassWithThreadingProblem

{% highlight java %}
package com.om.concurrent.example;

import static org.junit.Assert.fail;

import org.junit.Test;

public class ClassWithThreadingProblemTest {
    @Test
    public void twoThreadsShouldFailEventually() throws Exception {
        final ClassWithThreadingProblem classWithThreadingProblem 
            = new ClassWithThreadingProblem();

        Runnable runnable = new Runnable() {
            public void run() {
                classWithThreadingProblem.takeNextId();
            }
        };

        for (int i = 0; i < 50000; ++i) {
            int startingId = classWithThreadingProblem.lastId;
            int expectedResult = 2 + startingId;

            Thread t1 = new Thread(runnable);
            Thread t2 = new Thread(runnable);
            t1.start();
            t2.start();
            t1.join();
            t2.join();

            int endingId = classWithThreadingProblem.lastId;

            if (endingId != expectedResult) {
                System.out.printf("Problem discovered at iteration: %d\n", i);
                return;
            }
        }

        fail("This test should have exposed a threading issue but it did not.");
    }
}
{% endhighlight %}

For the purpose of the following instructions, the package is: com.om.concurrent.example

#### Configure Test Execution

These instructions are for eclipse. Your IDE will have a similar feature. The import thing is the VM argument below.

* Run the test for the first time. This will probably fail (if not, you got lucky).
* Pull down the// **Run**// menu and select// **Run Configurations...**//
* Find the run configuration (under// **JUnit**//, it will be named the same as your test class name// **ClassWithThreadingProblemTest**//)
* Click the arguments tab
* Enter the following in the VM arguments:

{% highlight terminal %}
-javaagent:JavaConTest/Lib/ConTest.jar
{% endhighlight %}

Note, this is a relative directory under the current project. If you placed ConTest in another directory, you'll have to make sure to use the correct directory. Run your test again, it will fail and you'll notice output (somewhat shortened):

{% highlight terminal %}
>>> ConTest: ConTest for Java, version 3.5.2.3
>>> ConTest:    build: 02 September 2009 10:40:13
>>> ConTest: (c) Copyright IBM Corporation (1999, 2009), ALL RIGHTS RESERVED.

<<<snip>>

>>> ConTest: Found 0 listener registery files
>>> ConTest: id for this run is: [1266514450576]
!!! ConTest: system error: aborting ConTest:
!!! ConTest usage error: following exception was thrown:
com.ibm.contest.instrumentation.TargetSpecificationException: target classes not specified in preferences
	at com.ibm.contest.instrumentation.TargetHandler.<init>(TargetHandler.java:103)
	at com.ibm.contest.instrumentation.InstrumentationAction.<init>(InstrumentationAction.java:311)
<<snip>>
{% endhighlight %}

The exception is the subject of the next section.

#### Configure KingProperties
* Find the directory containing ConTest.jar (in my case it is ~/src/ConTestFeb2010/ConTestFeb2010/JavaConTest/Lib)
* Edit the file KingProperties, find the following line:

{% highlight terminal %}
targetClasses = *
{% endhighlight %}
* Replace the * with the package of your test, using / instead of ., e.g.:

{% highlight terminal %}
targetClasses = com/om/concurrent/example
{% endhighlight %}

### See the test pass
Run the test, you should see it pass (meaning it was able to detect a threading problem).

### Questions?
Send me an email at schuchert at yahoo dot com or schuchert at objectmentor dot com.
