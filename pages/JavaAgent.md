---
title: JavaAgent
---
# Java Agents Transform Classes at Load Times
By now this is old news, but since Java 5, there's been an option to add so-called Java Agents to the class loader. A Java Agent is given the raw bytes of a class file and it is able to transform (instrument) it. You might do this when using [[AOP|Aspect Oriented Programming]], some EJB containers or other light-weight containers. 

There are two parts to a Java Agent:
# The Class File Transformer - a call that implements [[http://java.sun.com/j2se/1.5.0/docs/api/java/lang/instrument/ClassFileTransformer.html|ClassFileTransformer]].
# A class that registers your class file transformer (which is what I'm providing in a Jar file)

## Why do I care?
I've been experimenting with a tool from IBM called [[http://www.haifa.ibm.com/projects/verification/contest/index.html|ConTest]] that assists in finding defects in multi-threaded code. The original version was written for JDK 1.3 and now required JDK 1.4. They are considering adding dynamic instrumentation, but until they do, you have to take your compiled classes and manually instrument them. This is error prone when you're using the tool in an IDE like Eclipse. I have to make sure to remember to instrument the classes before I run my unit tests (if I were using Ant/Maven and the command line it'd be no problem, but I like using IDE's). I want to remove a manual step from my development process.

I've been told they will publish an API to instrument a class, so I'm writing a Java Agent to take advantage of that. When I've done that, I'll be able to run multi-threaded related classes in my favorite IDE without any plug-in by simply specifying a command line option. This will make automating multi-threaded testing in an IDE much less error prone.

## Why Did I Do This?
The addition of the Java Agent to JDK 5 made using things like AspectJ easier. Specifically, if you're using some kind of tool that performs dynamic instrumentation but requires some VM configuration, all you need to do is set so VM properties when you run your unit tests and viola, you get automatic instrumentation.

But that alone is not enough to justify creating a simple jar file with an agent register. That is justified by the fact that to use the -javaagent VM argument, you must supply a jar file. So by creating this simple jar, I'm able to write any kind of custom class file transformer in my own project and run it using the jar file. It removes some project configuration.

Now, when I want to run my tests with some custom instrumentation, all I need to do is:
# Write my unit tests
# Run my unit tests with two command line parameters:
** -javaagent:Registrar.jar
** -Dschuchert.ClassFileTransformer=MyCustomClassFileTransformer, 
>> e.g. -Dschuchert.ClassFileTransformer=schuchert.contest.DynamicInstrumentor


## The Details
Here are the details on how to actually accomplish writing your own Java Agent:
> [[WritingYourOwnJavaAgent]]

Here is a simple jar file you can use that already does the basic work:
> [[AnExampleJavaAgent]]

Here are the guts of the specific agent register provided in [[file:Registrar.jar]].
> [[JavaAgentRedirectorExplained]]