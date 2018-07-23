---
title: AspectJVMConfigurationBlackMagic
---
[Next-->]({{ site.pagesurl }}/AspectJEX1Explained|<--Back]] [[AspectJEX1ApplyYourself)

## VM Configuration: Black Magic
This section describes the black magic that actually binds the MethodExecutionAspect class to the MethodExecutionAspect class. You can safely skip it but it is here just in case you are interested in what’s happening.

These examples work on a Java 5 VM. The Java 5 VM has a new command line option, javaagent. You can provide a so-called Java Agent Jar on the command line. When the VM starts up, it will look at the provided Jar file’s manifest. The manifest describes a class to hook into the Java Classloader. When there is a registered Java Agent, the following happens during class loading:
* The class loader finds a class
* The class loader retrieves the class’ byte codes into memory
* The class loader passes the byte codes to the Java Agent
* The Java Agent can make arbitrary changes to the byte codes
* The Java Agent returns the byte codes to the class loader
* The class loader then defines and initializes the class.

The Java Agent provided by AspectJ will modify classes based on the aop.xml file. Our aop.xml file mentions MethodExecutionExample. When the Classloader finds that class on disk, it retrieves it, passes it to the AspectJ Java Agent, which changes all of the methods to have calls into MethodExecutionAspect and then returns the modified class back to the class loader.

## More Details
We've used several terms: **joinpoint**, **pointcut**, **aspect**.

### joinpoint
> What is a joinpoint? It is a place in code that can be uniquely identified and somehow modified. Java VM's execute bytecodes. A joinpoint, therefore, is a Java bytecode. Not all bytecodes can be uniquely identified. Not because they are not somehow look-up-able, but because the designers of AspectJ made a decision about where they will allow aspects to apply. This decision is the **joinpoint model**.

### pointcut
> A pointcut is simply a collection of joinpoints. In our first example, the execution of all methods in a class called ex1.MethodExecutionExample. We'll see more of these later. A pointcut is how you define **what**.

### aspect
> An aspect is something that describes **where** to do **what**. In our first example, we used a joinpoint for **where** and what AspectJ refers to as **advice** for the **what**.

### Advice: Bad Name?
> Advice is the metaphor that AspectJ uses to describe **what** should happen when a pointcut is encountered. Ask your self this question, when given advice (or giving), it is always followed? Because it IS in AspectJ.

[Next-->]({{ site.pagesurl }}/AspectJEX1Explained|<--Back]] [[AspectJEX1ApplyYourself)