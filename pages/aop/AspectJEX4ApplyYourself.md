---
title: AspectJEX4ApplyYourself
---
[<--Back]({{ site.pagesurl}}/AspectJEX4Explained) [Next-->]({{ site.pagesurl}}/AspectJEX4AssignmentApplications)

# Apply Yourself
## Avoid unnecessary checking
Change the SetInterceptor so that if the object is already changed, it does not check the current and previous value.
----
[#Unexpected_Recursion]({{site.pagesurl}}/#Unexpected_Recursion)
## Experiment: Unexpected Recursion
Line 13 of [FieldSetAspect.java]({{ site.pagesurl}}/AspectJEX4Explained#FieldSetAspect) file defines a pointcut meant to avoid recursion. Line 21 actually uses that pointcut. Change line 21 by removing “&& skipTrackedObject()” and run main(). Describe why happens.

Make sure to change FieldSetAspect.java back to its original value.
----
## Experiment: Changing what gets passed
Notice that the Dao.save() method checks for null. Instead of not calling Dao.save() if the object is unchanged, pass in null object, which will have the effect of the object not being saved.
----
[#ExperimentConstructorUpdatesAddress]({{site.pagesurl}}/#ExperimentConstructorUpdatesAddress)
## Experiment: Constructor Updates Address
Currently the constructor does not change anything. Update the constructor to set all of the strings to “”. Now run Main.main() and see what has changed. Describe what is happening.
----
## Challenge: Adding Automatic History
Create a class that allows you to keep track of the history of rolls of individual Die objects. Introduce that history class into the Die class and track the history of individual die objects. At the end of the program, display the history information.
----
## Thought: Why return null?
[FieldSetAspect.java]({{ site.pagesurl}}/AspectJEX4Explained#FieldSetAspect) returns null on line 32. Could this cause any side effects? Can you suggest any alternatives?

[<--Back]({{ site.pagesurl}}/AspectJEX4Explained) [Next-->]({{ site.pagesurl}}/AspectJEX4AssignmentApplications)
