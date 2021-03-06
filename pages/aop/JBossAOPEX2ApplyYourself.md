---
title: JBossAOPEX2ApplyYourself
---
{% include nav prev="JBossAOPEX2Explained" next="JBossAOPEX2AssignmentApplications" %}

## Apply Yourself
Here are some assignments to practice and reinforce what you've learned.

----
### Extending type support
Change the zip-code attribute to an integer. Verify that changing the zip-code does not cause isChanged() to return true. Fix the jboss-aop.xml to capture the zip-code by changing the type from java.lang.String to *. Verify that changing the zip-code does produce any output.

**Challenge:** Write a unit test using JUnit to verify that changing the zip-code does not cause the aspect to be called. Remember that the unit test should produce no output. Make sure to write the test, run the test to verify it fails, then change aop.xml and verify that the test now passes.
----
### Do Not Allow Null Assignment
Change the SetInterceptor class so that if the provided parameter is null, it does not allow the assignment. You can do this by conditionally not calling invocation.invokeNext() and instead just returning null.

**Challenge:** Write a unit test that verifies that it is not possible to change a variable from non-null to null after you’ve made your changed. Better yet, write a unit test first, make sure it fails, make your change and make sure it passes.
----
### Whole new class
Using the provided Die class, write a program that rolls the die 1000 times. Next, write an aspect that captures each time a die’s value is set and keep a running total. Finally, when each die has been rolled, display a summary of the number of times each value was rolled. (Given a six-sided die, you should get the number of times 1 was rolled, the number of times 2 was rolled, etc. up to 6).

**Challenge:** Instead of rolling the Die object, roll the provide Dice class instead. Figure out a way to track each of the sums of the two dice rather than the individual die values. This time the output will be the number of times 2 was rolled, the number of times 3 was rolled, etc. up to 12.
----
### Thought Problem
In Monopoly there is a rule that if you roll three consecutive doubles during a turn, the player goes to jail. Think about ways you might begin to approach this problem using AOP. Once you’ve done that, ask yourself it if makes sense to do so. Is this a cross-cutting concern?

{% include nav prev="JBossAOPEX2Explained" next="JBossAOPEX2AssignmentApplications" %}
