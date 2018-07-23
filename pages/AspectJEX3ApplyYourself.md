---
title: AspectJEX3ApplyYourself
---
[[AspectJEX3Explained|<--Back]] [[AspectJEX3AssignmentApplications|Next-->]]

# Apply Yourself
Here are some assignments to practice and reinforce what you've learned.

----
## Experiment
Manually make the Die class implement Serializable and run the example. Describe what happens.

**Opinion:** Based on what you observed, is there anything you'd change about your pointcut?
----
## Optional thought exercise
Let's say we wanted to extend Externalizable instead of Serializable. What would you have to be able to do to make that happen? Note, if you're not familiar with Externalizable, have a look at the Java docs.
----
## Introduce a different interface
Add another interface to the Die class, have it implement Cloneable instead of Serializable. Verify that you can now clone your object.

**Optional:** Better yet, write a unit test to verify that a Die class can be cloned. When you run the unit test for the first time, it should fail. Next, update the aspect to introduce Cloneable. Verify that your unit test now passes.
----
## Introduce two interfaces
Now change the aspect so that Die implements **both** Cloneable and Serializable.

[[AspectJEX3Explained|<--Back]] [[AspectJEX3AssignmentApplications|Next-->]]