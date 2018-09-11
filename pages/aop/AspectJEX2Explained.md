---
title: AspectJEX2Explained
---
[<--Back]({{ site.pagesurl}}/AspectJEX2SoWhatIsHappening) [Next-->]({{ site.pagesurl}}/AspectJEX2ApplyYourself)

# Example 2 Explained
Accessing a field in Java is a joinpoint exposed by the AspectJ joinpoint model. This is different from method execution in that captures things like the following: 
{% highlight terminal %}
   this.aString = "value";              // Writing to a field called aString
   int tempValue = 3 * this.myIntValue; // Reading from a field called myIntValue
{% endhighlight %}
Notice in both of these examples, we are somehow accessing an instance field of a class.

This example examines all changes to fields on the Address object. When an attempt is made to set a field of a class, the aspect gets the current field value and then displays the current value and the value on the right hand side of assignment.

Remember that when we’re working with AOP, we have to consider “what” and “where”.  For this example:
* **What:** Capture assignment to fields and display the current value and the next value.
* **Where:** Every field in the Address class.

To make this example work, we need two additional things:
* FieldSetaspect.java
* aop.xml

----
## FieldSetAspect.java
{% highlight java %}
01: package ex2;
02: 
03: import java.lang.reflect.Field;
04: 
05: import org.aspectj.lang.ProceedingJoinPoint;
06: import org.aspectj.lang.annotation.Around;
07: import org.aspectj.lang.annotation.Aspect;
08: import org.aspectj.lang.annotation.Pointcut;
09: import org.aspectj.lang.reflect.FieldSignature;
10: 
11: @Aspect
12: public class FieldSetAspect {
13: 
14:     @Pointcut("args(rhs) && set(java.lang.String ex2.Address.*)")
15:     public void allFields(Object rhs) {
16:     }
17: 
18:     @Around("allFields(rhs)")
19:     public Object reportFieldAssignment(ProceedingJoinPoint thisJoinPoint,
20:             Object rhs) throws Throwable {
21:         FieldSignature fs = (FieldSignature) thisJoinPoint.getSignature();
22: 
23:         Object target = thisJoinPoint.getTarget();
24:         Field field = fs.getField();
25:         field.setAccessible(true);
26:         Object currentValue = field.get(target);
27:         System.out.printf("Setting %s from %s to %s\n", fs.getName(),
28:                 currentValue, rhs);
29: 
30:         return thisJoinPoint.proceed();
31:     }
32: }
{% endhighlight %}

### Interesting Lines
^
|-|-|
|Line|Description|
|10|This class is an aspect. This annotation denotes the following class as an aspect.|
|14|This is a pointcut. There is one argument, rhs, of type Object (see line 15). We are capturing "set()", or fields being written. We are watching all fields of the type java.lang.String in the class ex2.Address.|
|15|This pointcut is named allFields.|
|18|The next method, reportFieldAssignment(), will be called in lieu of the set, or around the set. This is the same thing we used in [AspectJ_Example_1]({{site.pagesurl}}/AspectJ_Example_1). We have other options including before, after, and a few others as well.|
|19|This method is called around all attempts to set fields in the ex2.Address class. It takes ProceedingJoinPoint (optional but typically used) and an Object, rhs (Right Hand Side). The second parameter is what appears on the right side of the assignment operator, e.g. this.myField ``=`` "aString", rhs == "aString".|
|21|We know we bound this method to a set() joinpoint, so we can down-cast to FieldSignature and get more specific, relevant information.|
|23 - 26|Get the current value of the underlying field being set.|
|30|Actually perform the set|

## aop.xml
{% highlight xml %}
01: <aspectj>
02: 	<aspects>
03: 		<aspect name="ex2.FieldSetAspect"/>
04: 	</aspects>
05: 	<weaver>
06: 		<include within="ex2.*"/>
07: 	</weaver>
08: </aspectj>
{% endhighlight %}

### Interesting Lines
^
|-|-|
|Line|Description|
|3|Tell the weaver to use the aspect of type ex2.FieldSetAspect|
|6|Apply this aspect only to classes whose package start with ex2.|

[<--Back]({{ site.pagesurl}}/AspectJEX2SoWhatIsHappening) [Next-->]({{ site.pagesurl}}/AspectJEX2ApplyYourself)
