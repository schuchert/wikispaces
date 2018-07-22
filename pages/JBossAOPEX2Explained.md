[[JBossAOPEX2SoWhatIsHappening|<--Back]] [[JBossAOPEX2ApplyYourself|Next-->]]

# Example 2 Explained=
Accessing a field in Java is a joinpoint exposed by the JBoss AOP joinpoint model. This is different from method execution in that captures things like the following: 
```
   this.aString = "value";              // Writing to a field called aString
   int tempValue = 3 * this.myIntValue; // Reading from a field called myIntValue
```
Notice in both of these examples, we are somehow accessing an instance field of a class.

This example examines all changes to fields on the Address object. When an attempt is made to set a field of a class, the interceptor gets the current field value and then displays the current value and the value on the right hand side of assignment.

Remember that when we’re working with AOP, we have to consider “what” and “where”.  For this example:
> **What:** Capture assignment to fields and display the current value and the next value.
> **Where:** Every field in the Address class.

To make this example work, we need two additional things:
* SetInterceptor.java
* jboss-aop.xml
----
## SetInterceptor.java==
```java
01: package ex2;
02: 
03: import java.lang.reflect.Field;
04: 
05: import org.jboss.aop.advice.Interceptor;
06: import org.jboss.aop.joinpoint.FieldWriteInvocation;
07: import org.jboss.aop.joinpoint.Invocation;
08: 
09: public class SetInterceptor implements Interceptor {
10: 	public String getName() {
11: 		return "SetInterceptor";
12: 	}
13: 
14: 	public Object invoke(Invocation invocation) throws Throwable {
15: 		if (!(invocation instanceof FieldWriteInvocation))
16: 			return invocation.invokeNext();
17: 
18: 		FieldWriteInvocation mi = (FieldWriteInvocation) invocation;
19: 		Object newValue = mi.getValue();
20: 		Object target = mi.getTargetObject();
21: 		Field field = mi.getField();
22: 		Object currentValue = field.get(target);
23: 
24: 		System.out.printf("Setting %s from %s to %s\n", field.getName(),
25: 				currentValue, newValue);
26: 		return invocation.invokeNext();
27: 	}
28: }
```
### Interesting Lines===
||Line||Description||
||14||This is the method called whenever the a field is set that matches the pointcut. We can choose to allow the get/set to continue by calling invocation.invokeNext(). We can do work before or after that depending on our needs.||
||15||We only care about sets, if the type of this invocation is not a FieldWriteInvocation (set), simply return the result of performing the invocation.invokeNext(). The only other option is accessing a field, so allow the access to happen and return the value.||
||19||Get the value on the right-hand side of the assignment operator.||
||20 - 22||Get the current value of the field.||
----
## jboss-aop.xml==
```xml
01: <aop>
02:    <pointcut name="PrivateAttributes" expr="set(private java.lang.String *.Address->*)"/>
03:    
04:    <bind pointcut="PrivateAttributes">
05:        <interceptor class="ex2.SetInterceptor"/>
06:    </bind>
07:    
08: </aop>
```
### Interesting Lines===
||Line||Description||
||3 - 4||Define a pointcut that matches all sets of private fields of type String on all classes called Address. If we wanted to get all types, we could replace "java.lang.String" with "*". If we didn't care if the field was private, simply leave private out.||
||6 - 8||Bind the pointcut defined above to the SetInterceptor class.||

[[JBossAOPEX2SoWhatIsHappening|<--Back]] [[JBossAOPEX2ApplyYourself|Next-->]]