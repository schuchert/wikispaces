---
title: JBossEX1ApplyYourself
---
[Next-->]({{ site.pagesurl }}/JBossVMConfigurationBlackMagic|<--Back]] [[JBossEX1AssignmentApplications)

## Apply Yourself
Here is a series of exercises you can try yourself to confirm what you've learned so far. Doing these assignments should really solidify your understanding of this first example.
----
### Stateful Aspect
Track the number of times MethodInterceptor.invoke() is called. Display this information as well as what it currently displays.

**Challenge:** How many instances of MethodInterceptor are there? How can you tell? Make a theory. Test your theory by extending this assignment somehow.
----
### Pointcut Changes
Change the pointcut to select only one particular method. Verify that your change worked.

**Challenge:** Use JUnit plus your knowledge from section 7.5.1 to programmatically test your pointcut.
----
### Whole New Class
Create a simple Java Bean style class. Call it Address. Add the following attributes:
* addressLine1
* addressLine2
* city
* state
* zip

Add setters and getters for each of these attributes. Write a pointcut to select all of the methods starting with “set” and bind that pointcut to a SetMethodInterceptor class you create. Your SetMethodInterceptor.invoke method() should simply display a message: “Calling setter: <name>” where <name> is the name of the setMethod.

**Challenge:** Use string manipulation/regular expressions to convert the name of the method into the name of the attribute and print that instead.
----
### **Challenge:** Monopoly® Output
Currently, the provided Monopoly® source code produces game output in the Game.play() method. Remove that output and instead write a method interceptor to display the same output. You’ll have to figure out which method to write and how to get access to the information you need.

**Assessment:** Does doing this make sense? Is this a cross-cutting concern? How might you apply this kind of idea in a realistic situation?

[Next-->]({{ site.pagesurl }}/JBossVMConfigurationBlackMagic|<--Back]] [[JBossEX1AssignmentApplications)