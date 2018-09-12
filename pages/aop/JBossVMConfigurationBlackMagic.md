---
title: JBossVMConfigurationBlackMagic
---
[<--Back](JBossEX1Explained) [Next-->](JBossEX1ApplyYourself)

## VM Configuration: Black Magic
This section describes the black magic that actually binds the MethodInterceptor class to the MethodExecutionExample class. You can safely skip it but it is here just in case you are interested in what’s happening.

These examples work on a Java 5 VM. The Java 5 VM has a new command line option, javaagent. You can provide a so-called Java Agent Jar on the command line. When the VM starts up, it will look at the provided Jar file’s manifest. The manifest describes a class to hook into the Java Classloader. When there is a registered Java Agent, the following happens during class loading:
* The class loader finds a class
* The class loader retrieves the class’ byte codes into memory
* The class loader passes the byte codes to the Java Agent
* The Java Agent can make arbitrary changes to the byte codes
* The Java Agent returns the byte codes to the class loader
* The class loader then defines and initializes the class.

The Java Agent provided by JBoss AOP will modify classes based on the jboss-aop.xml file. Our jboss-aop.xml file mentions MethodExecutionExample. When the Classloader finds that class on disk, it retrieves it, passes it to the JBoss AOP Java Agent, which changes all of the methods to have calls into MethodInterceptor and then returns the modified class back to the class loader.

[<--Back](JBossEX1Explained) [Next-->](JBossEX1ApplyYourself)
