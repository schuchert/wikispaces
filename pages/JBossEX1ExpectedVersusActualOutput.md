---
title: JBossEX1ExpectedVersusActualOutput
---
[Next-->]({{ site.pagesurl }}/JBoss AOP Example 1|<--Back]] [[JBossEX1FormTheory)

## Expected Output
Did you guess the output would look something like this?
```
   noArgMethod
-------------
   methodWithStringParam: Brett
-------------
   methodCallingOtherMethod
   noArgMethod
-------------
   staticMethod
```

## Actual Output
What if I told you the output was actually this (ignoring line wrapping)?
```
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
```

[Next-->]({{ site.pagesurl }}/JBoss AOP Example 1|<--Back]] [[JBossEX1FormTheory)