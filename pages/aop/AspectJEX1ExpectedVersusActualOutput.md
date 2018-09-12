---
title: AspectJEX1ExpectedVersusActualOutput
---
[<--Back](AspectJ_Example_1) [Next-->](AspectJEX1FormTheory)

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
Entering: void ex1.MethodExecutionExample.noArgMethod()
	noArgMethod
Leaving void ex1.MethodExecutionExample.noArgMethod()
-------------
Entering: void ex1.MethodExecutionExample.methodWithStringParam(String)
	methodWithStringParam: Brett
Leaving void ex1.MethodExecutionExample.methodWithStringParam(String)
-------------
Entering: void ex1.MethodExecutionExample.methodCallingOtherMethod()
	methodCallingOtherMethod
Entering: void ex1.MethodExecutionExample.noArgMethod()
	noArgMethod
Leaving void ex1.MethodExecutionExample.noArgMethod()
Leaving void ex1.MethodExecutionExample.methodCallingOtherMethod()
-------------
Entering: void ex1.MethodExecutionExample.staticMethod()
	staticMethod
Leaving void ex1.MethodExecutionExample.staticMethod()
{% endhighlight %}

[<--Back](AspectJ_Example_1) [Next-->](AspectJEX1FormTheory)



