---
title: AspectJEX1Explained
---
[[AspectJEX1SoWhatIsHappening|<--Back]] [[AspectJVMConfigurationBlackMagic|Next-->]]

## Example 1 Explained
Capturing method execution is often what people first think of when considering AOP.

In this example, we intercept each method called on a class called MethodExecutionExample. Before each method call we print a message, we call the method and then print another message after returning from the method.

Aspect oriented Programming is about two things: Where, What.

**What:** What is it you want to do that is different from the normal program flow? Initially this is the easier part of the equation. It can get quite difficult but for this example it is trivial; print a message before and after a method execution.

**Where:** Where to you want to change the normal program flow. This is often the most difficult part of the equation. This is the skill to hone first. In this first example we simply pick out all public methods on a class. However, in my experience, the “where” is almost always as hard as or harder than the "what."

Main.java is simply a driver and MethodExecutionExample.java is a simple class with some methods on it. In both cases, they are just Plain Old Java Objects (POJOs).

I did not show you three things:
* MethodExecutionAspect.java
* aop.xml
* The Java Virtual Machine is configured to give AspectJ a chance to modify classes as the VM loads them

----
## MethodExecutionAspect.java
```java
01: package ex1;
02: 
03: import org.aspectj.lang.ProceedingJoinPoint;
04: import org.aspectj.lang.annotation.Around;
05: import org.aspectj.lang.annotation.Aspect;
06: import org.aspectj.lang.annotation.Pointcut;
07: 
08: @Aspect
09: public class MethodExecutionAspect {
10:     @Pointcut("execution(* ex1.MethodExecutionExample.*(..))")
11:     void allMethods() {
12:     }
13: 
14:     @Around("allMethods()")
15:     public Object reportMethodExecution(ProceedingJoinPoint thisJoinPoint)
16:             throws Throwable {
17:         System.out.printf("Entering: %s\n", thisJoinPoint.getSignature());
18:         try {
19:             return thisJoinPoint.proceed();
20:         } finally {
21:             System.out.printf("Leaving %s\n", thisJoinPoint.getSignature());
22:         }
23:     }
24: }
```
### Interesting Lines
||Lines||Description||
||8||This class is an AspectJ aspect class. It will need to be registered in the aop.xml file to take effect.||
||10||Define a **pointcut**. This is **where** the aspect applies. In this case it applies to execution of methods of any access level (the first *), in the class ex1.MethodExecutionExample, with any name (the second *) taking any parameters (..).||
||11||Give the pointcut a name, any name. The empty method has code placed into it that represents the pointcut. It is used later on line 14.||
||14||**Around** the exeuction of a pointcut do something. Around logic replaces the method. The around takes care of everything, including calling the original code. This around logic applies to all **joinpoints** captured by the **pointcut** called allMethods().||
||15||This is the method that replaces the underlying method execution (all methods in the class ex1.MethodExecutionExample). It takes one parameter, a ProceedingJoinPoint, which is automatically provided by AspectJ. (More on what parameters can go here later.)||
||19||Call proceed() on "thisJoinPoint" to actually perform the original method execution.||
----
## aop.xml
```xml
01: <aspectj>
02: 	<aspects>
03: 		<aspect name="ex1.MethodExecutionAspect"/>
04: 	</aspects>
05: 	<weaver>
06: 		<include within="ex1.*"/>
07: 	</weaver>
08: </aspectj>
```
### Interesting Lines
||Lines||Description||
||3||Register ex1.MethodExecutionAspect as an apsect to apply to this VM||
||6||Only apply the registered aspects with classes whose package starts with ex1.||
Note, this file needs to be in a directory called META-INF in the classpath. Here's an easy way to make this happen in eclipse:
# Create a folder called META-INF under a source directory
# Create a file called aop.xml in that folder
# Cut and paste the contents

[[AspectJEX1SoWhatIsHappening|<--Back]] [[AspectJVMConfigurationBlackMagic|Next-->]]