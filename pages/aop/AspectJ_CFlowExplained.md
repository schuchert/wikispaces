---
title: AspectJ_CFlowExplained
---
[<--Back](AspectJ_CFlowSoWhatIsHappening) [Next-->](AspectJ_CFlowApplyYourself)

## CFlow
CFlow, or control flow, allows the selection of pointcuts based on the program flow at runtime. Most of the pointcuts you've reviewed so far have probably been selectable at weave time. For example, call matches pointcuts that call a particular method; execution matches the execution of code whose signature matches. AspectJ determines both of these examples without having to execute the program.

What about wanting to capture a pointcut so long as it is not called while in another method? In our example, we want to disable change tracking if changes occur either directly in a constructor or are called as a result of a (below in the stack trace) of a constructor. For example:
{% highlight java %}
01 public Address() {
02    this.name = "Brett";
03    setName("Schuchert");
04    someMethod();
05 }
06 
07 public void setName(String name) {
08    this.name = name;
09 }
10 
11 public void someMethod() {
12    String someRandomName = generateRandomName(); // source left to reader as an exercise
13    setName(someRandomName);
14 }
15
16 public static void main() {
17    Address a = new Address();
18    a.setName("Brett");
19    a.someMethod();
20 }
{% endhighlight %}

The pointcut "set(* Address.name)" matches lines 2 and 8. In this code example, we have the following sequences that cause the pointcut to be encountered at runtime:
{% highlight terminal %}
    a. 17 --> 2               // no change tracking
    b.        3 --> 8         // no change tracking
    c.        4 --> 13 --> 8  // no change tracking
    d. 18 --> 8               // no change tracking
    e. 19 --> 13 --> 8        // no change tracking
{% endhighlight %}
So in the dynamic execution of this program, we encounter a pointcut matching set(* Address.name) a total of 5 times (these are labeled a through e in the example). Of these 5 paths to the pointcut, which ones cause change tracking to occur? In our example, we ignore "cflow(execution(cf.ITrackedObject+.new (..)))" - or all constructors under the ITrackedObject interface.

So any of the above lines that pass through the constructor in Address will be ruled out. That includes: a, b and c. The other two, d and e, get to the same pointcuts. However, they do not pass through the constructor, so they are not excluded by the cflow expression.

What follows is a breakdown of all the code for this example.

----
{: #Address}
### Address.java
{% highlight java %}
01: package cf;
02: 
03: import java.io.Serializable;
04: 
05: @SuppressWarnings("serial")
06: public class Address implements Serializable {
07:     private String addressLine1;
08:     private String addressLine2;
09:     private String city;
10:     private String state;
11:     private String zip;
12:     
13:     public Address() {
14:         setAddressLine1("");
15:     }
16: 
17:     public String getAddressLine1() {
18:         return addressLine1;
19:     }
20: 
21:     public void setAddressLine1(String addressLine1) {
22:         this.addressLine1 = addressLine1;
23:     }
24: 
25:     public String getAddressLine2() {
26:         return addressLine2;
27:     }
28: 
29:     public void setAddressLine2(String addressLine2) {
30:         this.addressLine2 = addressLine2;
31:     }
32: 
33:     public String getCity() {
34:         return city;
35:     }
36: 
37:     public void setCity(String city) {
38:         this.city = city;
39:     }
40: 
41:     public String getState() {
42:         return state;
43:     }
44: 
45:     public void setState(String state) {
46:         this.state = state;
47:     }
48: 
49:     public String getZip() {
50:         return zip;
51:     }
52: 
53:     public void setZip(String zip) {
54:         this.zip = zip;
55:     }
56: }
{% endhighlight %}
#### Interesting Lines
^
|---|---|
|Line|Description|
|14|This line causes a field to be set. If we did not do this, then we would not see any changes to the address object at construction time and this cflow example would have no motivation.|

{: #Dao}
### Dao.java
{% highlight java %}
01: package cf;
02: 
03: public class Dao {
04:     public static void save(Object o) {
05:         if (o != null) {
06:             System.out.printf("Saving: %s\n", o.getClass());
07:         }
08:     }
09: }
{% endhighlight %}
#### Interesting Lines
This class is unchanged from [Example 4](AspectJEX4Explained#Dao).

----
{: #FieldSetAspect}
### FieldSetAspect.java
{% highlight java %}
01: package cf;
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
13:     @Pointcut("!set(* cf.TrackedObjectMixin.*)")
14:     public void skipTrackedObject() {
15:     }
16: 
17:     @Pointcut("args(rhs) && set(* cf.Address.*)")
18:     public void allFields(Object rhs) {
19:     }
20:     
21:     @Pointcut("cflow(execution(cf.ITrackedObject+.new (..)))")
22:     public void constructors() {
23:     }
24: 
25:     @Around("allFields(rhs) && skipTrackedObject() && !constructors()")
26:     public Object trackFieldAssignment(ProceedingJoinPoint thisJoinPoint,
27:             Object rhs) throws Throwable {
28:         FieldSignature fs = (FieldSignature) thisJoinPoint.getSignature();
29: 
30:         Object target = thisJoinPoint.getTarget();
31:         Field field = fs.getField();
32:         field.setAccessible(true);
33:         Object currentValue = field.get(target);
34: 
35:         if (equals(currentValue, rhs)) {
36:             return null;
37:         } else {
38:             ((ITrackedObject) target).setChanged(true);
39:             return thisJoinPoint.proceed();
40:         }
41:     }
42: 
43:     private boolean equals(Object lhs, Object rhs) {
44:         if (lhs == null && rhs == null) {
45:             return true;
46:         }
47:         if (lhs == null && rhs != null) {
48:             return false;
49:         }
50:         if (lhs != null && rhs == null) {
51:             return false;
52:         }
53:         return lhs.equals(rhs);
54:     }
55: }
{% endhighlight %}

#### Interesting Lines
^
|-|-|
|Line|Description|
|21 - 23|We define a pointcut called constructors. Working right to left, we have: cf.ITrackedObject+.new (..), which means constructors (new) taking any parameters (..) off of the class cf.ITrackedObject+, or any class that implements ITrackedObject. We introduce this class to Address via another Aspect (see {: #InnerTypeAspect}). Next, we have: (execution(cf.ITrackedObject+.new (..))), which means the execution of this method. So we are modifying the bytecode associated with the constructor, not the call of the constructor. Finally, we put that whole thing in cflow(...). This says any pointcuts that we hit from the execution of all constructors in any class that implements ITrackedObject. If we wanted to keep the pointcuts in the constructor but capture anything below that, we could have used **//cflowbelow//**.|
|25|This is where we actually use the constructors pointcut. Notice we negate it using !. This means that the following Around advice, called trackFieldAssignment, will not execute if we happen to hit any of the constructor pointcuts. Since the around advice does not apply to constructors, any changes that happen there or below will NOT cause change tracking to occur.|

{: #InnerTypeAspect}
### InnerTypeAspect.java
{% highlight java %}
01: package cf;
02: 
03: import org.aspectj.lang.annotation.Aspect;
04: import org.aspectj.lang.annotation.DeclareParents;
05: 
06: @Aspect
07: public class InnerTypeAspect {
08:     @DeclareParents(value = "cf.Address", defaultImpl = cf.TrackedObjectMixin.class)
09:     ITrackedObject trackedObject;
10: }
{% endhighlight %}
#### Interesting Lines
None. This is unchanged from [Example 4](AspectJEX4Explained#InnerTypeAspect).

----
{: #ITrackedObject}
### ITrackedObject.java
{% highlight java %}
01: package cf;
02: 
03: public interface ITrackedObject {
04:     boolean isChanged();
05: 
06:     void setChanged(boolean changed);
07: }
{% endhighlight %}
#### Interesting Lines
None. This is unchanged from [Example 4](AspectJEX4Explained#ItrackedObject).

----
{: #Main}
### Main.java
{% highlight java %}
01: package cf;
02: 
03: public class Main {
04:     public static void main(String args[]) {
05:         Address a = new Address();
06:         Dao.save(a);
07:         a.setZip(null);
08:         Dao.save(a);
09:         a.setZip("75001");
10:         Dao.save(a);
11:         Dao.save(a);
12:     }
13: }
{% endhighlight %}

#### Interesting Lines
^
|-|-|
|Line|Description|
|5|We construct an address. In [[AspectJ_Example_4] this did not cause a change because construction did not cause anything to be initialized. In [ this exercise](AspectJEX4ApplyYourself#ExperimentConstructorUpdatesAddress) we found out that if it had, it would cause Address to be changed. We managed to change that by using cflow.|

{: #SaveMethodAspect}
### SaveMethodAspect.java
{% highlight java %}
01: package cf;
02: 
03: import org.aspectj.lang.ProceedingJoinPoint;
04: import org.aspectj.lang.annotation.Around;
05: import org.aspectj.lang.annotation.Aspect;
06: import org.aspectj.lang.annotation.Pointcut;
07: 
08: @Aspect
09: public class SaveMethodAspect {
10:     @Pointcut("execution(* cf.Dao.save(..))")
11:     public void daoSaveMethod() {
12:     }
13: 
14:     @Around("daoSaveMethod()")
15:     public Object skipSaveIfUnchanged(ProceedingJoinPoint thisJoinPoint)
16:             throws Throwable {
17:         Object param = thisJoinPoint.getArgs()[0];
18:         ITrackedObject tracked = (ITrackedObject) param;
19: 
20:         try {
21:             if (tracked.isChanged()) {
22:                 return thisJoinPoint.proceed();
23:             } else {
24:                 System.out.printf("Not saving: %s, it is unchanged\n", param
25:                         .getClass());
26:                 return null;
27:             }
28:         } finally {
29:             tracked.setChanged(false);
30:         }
31:     }
32: }
{% endhighlight %}

#### Interesting Lines
None. This class is unchanged from [Example 4](AspectJEX4Explained#SaveMethodAspect).

----
{: #TrackedObjectMixin}
### TrackedObjectMixin.java
{% highlight java %}
01: package cf;
02: 
03: public class TrackedObjectMixin implements ITrackedObject {
04:     private boolean changed = false;
05: 
06:     public TrackedObjectMixin() {
07:     }
08: 
09:     public boolean isChanged() {
10:         return changed;
11:     }
12: 
13:     public void setChanged(boolean changed) {
14:         this.changed = changed;
15:     }
16: }
{% endhighlight %}

#### Interesting Lines
None. This class is unchanged from [[AspectJEX4Explained#TrackedObjectMixin|Example 4].

----
{: #aop}
### aop.xml
{% highlight terminal %}
01: <aspectj>
02: 	<aspects>
03: 		<aspect name="cf.FieldSetAspect"/>
04: 		<aspect name="cf.InnerTypeAspect"/>
05: 		<aspect name="cf.SaveMethodAspect"/>
06: 	</aspects>
07: 	<weaver>
08: 		<include within="cf.*"/>
09: 	</weaver>
10: </aspectj>
{% endhighlight %}

#### Interesting Lines
None. This class is unchanged from [Example 4](AspectJEX4Explained#aop).

[<--Back](AspectJ_CFlowSoWhatIsHappening) [Next-->](AspectJ_CFlowApplyYourself)
