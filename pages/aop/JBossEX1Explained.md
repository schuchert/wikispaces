---
title: JBossEX1Explained
---
[<--Back](JBossEX1SoWhatIsHappening) [Next-->](JBossVMConfigurationBlackMagic)

## Example 1 Explained
Capturing method execution is often what people first think of when considering AOP. This example is modified from one provided with the JBoss AOP documentation under docs/aspect-framework/examples/method-execution.

In this example, we intercept each method called on a class called MethodExecutionExample. Before each method call we print a message, we call the method and then print another message after returning from the method.

Aspect oriented Programming is about two things: Where, What.

**What:** What is it you want to do that is different from the normal program flow? Initially this is the easier part of the equation. It can get quite difficult but for this example it is trivial; print a message before and after a method execution.

**Where:** Where to you want to change the normal program flow. This is often the most difficult part of the equation. This is the skill to hone first. In this first example we simply pick out all public methods on a class. However, in my experience, the “where” is almost always as hard as or harder than the "what."

Main.java is simply a driver and MethodExecutionExample.java is a simple class with some methods on it. In both cases, they are just Plain Old Java Objects (POJOs).

I did not show you three things:
* MethodInterceptor.java
* Jboss-aop.xml
* The Java Virtual Machine is configured to give JBoss AOP a chance to 

----
### MethodInterceptor.java
{% highlight java %}
01: package com.valtech.methodexecution; 
02: 
03: import org.jboss.aop.joinpoint.Invocation; 
04: import org.jboss.aop.joinpoint.MethodInvocation; 
05: import org.jboss.aop.advice.Interceptor; 
06: 
07: public class MethodInterceptor implements Interceptor { 
08:    public String getName() { 
09:       return "MethodInterceptor"; 
10:    } 
11: 
12:    public Object invoke(Invocation invocation) throws Throwable { 
13:       MethodInvocation mi = (MethodInvocation) invocation; 
14:       String methodName = mi.getMethod().toString(); 
15: 
16:       try { 
17:          System.out.printf("Entering: %s\n", methodName); 
18:          return invocation.invokeNext(); 
19:       } finally { 
20:          System.out.printf("Leaving: %s\n", methodName); 
21:       } 
22:    } 
23: } 
{% endhighlight %}
Calls to the MethodInterceptor.invoke() method are placed into target classes based on the jboss-aop.xml file. In this case, all we do is get the name of the method, print it, call the target method, and then print again.

|Lines|Description|
|18|This line calls the provided invocation object's invokeNext() method. Since we only have one aspect, this calls the target method. If we had multiple aspects targeting the same method, invoke next would call the next aspect to do its thing. What happens if instead of calling invocation.invokeNext() you just return? Well the method will not be called. If you do this, you must return something that can be converted to the expected return type.|
|12|Note the signature returns Object. If the underlying method has a void return or if it returns a primitive, you still use Object. The details are taken care of for you.|

### jboss-aop.xml
{% highlight xml %}
01: <aop> 
02:    <pointcut name="MethodExecution" 
03:      expr="execution(public * *.MethodExecutionExample->*(..))"/> 
04:     
05:    <bind pointcut="MethodExecution"> 
06:       <interceptor 
07:         class="com.valtech.methodexecution.MethodInterceptor"/> 
08:    </bind> 
09: </aop> 
{% endhighlight %}

|Lines|Description|
|2 – 3|Define a pointcut, a selection of joinpoints. This creates a name, MethodExecution, which matches the execution of all public methods on MethodExecutionExample named anything (->*) taking any parameters (..). Defining a pointcut itself does not make anything happen. Next we associate the pointcut with an interceptor.|
|5 - 8|When any of the joinpoints matched by the MethodExecution pointcut are hit, call the invoke method of the MethodInterceptor class instead. That is, the invoke() method decides what to do instead of the original code.|

[<--Back](JBossEX1SoWhatIsHappening) [Next-->](JBossVMConfigurationBlackMagic)
