---
title: JBossEX1ExpectedVersusActualOutput
---
[<--Back]({{site.pagesurl}}/JBoss_AOP_Example_1) [Next-->]({{ site.pagesurl}}/JBossEX1FormTheory)

## Expected Output
Did you guess the output would look something like this?
{% highlight terminal %}
   noArgMethod
-------------
   methodWithStringParam: Brett
-------------
   methodCallingOtherMethod
   noArgMethod
-------------
   staticMethod
{% endhighlight %}

## Actual Output
What if I told you the output was actually this (ignoring line wrapping)?
{% highlight terminal %}
Entering: public void ex1.MethodExecutionExample.noArgMethod()
	noArgMethod
Leaving: public void ex1.MethodExecutionExample.noArgMethod()
-------------
Entering: public void ex1.MethodExecutionExample.methodWithStringParam(java.lang.String)
	methodWithStringParam: Brett
Leaving: public void ex1.MethodExecutionExample.methodWithStringParam(java.lang.String)
-------------
Entering: public void ex1.MethodExecutionExample.methodCallingOtherMethod()
	methodCallingOtherMethod
Entering: public void ex1.MethodExecutionExample.noArgMethod()
	noArgMethod
Leaving: public void ex1.MethodExecutionExample.noArgMethod()
Leaving: public void ex1.MethodExecutionExample.methodCallingOtherMethod()
-------------
Entering: public static void ex1.MethodExecutionExample.staticMethod()
	staticMethod
Leaving: public static void ex1.MethodExecutionExample.staticMethod()
{% endhighlight %}

[<--Back]({{site.pagesurl}}/JBoss_AOP_Example_1) [Next-->]({{ site.pagesurl}}/JBossEX1FormTheory)
