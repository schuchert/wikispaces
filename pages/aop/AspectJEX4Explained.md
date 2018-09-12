---
title: AspectJEX4Explained
---
[<--Back](AspectJEX4SoWhatIsHappening) [Next-->](AspectJEX4ApplyYourself)

# Example 4 Explained
This example combines all of the previous examples together. In this example, we add Introductions (adding an interface + implementation of that interface to an existing class) and field setting as well as method execution. In the Field Setting example we simply reported existing and new values. Now we use that information and track whether an object has changed.

First, we introduce an interface, ITrackedObject, to Address. The implementation of this interface provides a single boolean field, changed, and the methods to maintain that field. Then, as fields are set, we check the existing value and and the new value. If there is a change, we set the changed state. Finally, we have a simulated Dao (Data Access Object) that can save the Address object. We intercept calls to the save() method and do not actually save the Dao if it is changed. We also change the state back to changed=false after a call to Dao.save().

----
## Main.java
This is the driver class that starts everything. Looking at this code, it does not seem to do too much...and it doesn't. 
{% highlight java %}
01: package ex3;
02: 
03: public class Main {
04: 	public static void main(String args[]) {
05: 		Address a = new Address();
06: 		Dao.save(a);
07: 		a.setZip(null);
08: 		Dao.save(a);
09: 		a.setZip("75001");
10: 		Dao.save(a);
11: 		Dao.save(a);
12: 	}
13: }
{% endhighlight %}

### Interesting Lines
There are no interesting lines here. Something to point out about this example is the significant change that happens without making changes to existing Java classes.

----

[#Dao](#Dao)
## Dao.java
This Dao is simulated. The point of this example is that we can intercept calls to some thing, a DAO in this case, and change the path of execution based on any condition. This class is unaware of any introductions. 
{% highlight java %}
01: package ex3;
02: 
03: public class Dao {
04: 	public static void save(Object o) {
05: 		if (o != null) {
06: 			System.out.printf("Saving: %s\n", o.getClass());
07: 		}
08: 	}
09: }
{% endhighlight %}
### Interesting Lines
Again, there are no interesting lines. The client, Main.main(), did not change. The Dao.save() method also did not change. However, we are tracking whether or not objects changed and not calling Dao.save() if the object is not changed.

----
## Address.java
The thing to notice is that it is unaware of whether it is changed or not. This is a simple java bean style class with attributes, setters and getters and a no-argument constructor (in this case a default constructor). 
{% highlight java %}
01: package ex4;
02: 
03: import java.io.Serializable;
04: 
05: @SuppressWarnings("serial")
06: public class Address implements Serializable {
07: 	private String addressLine1;
08: 	private String addressLine2;
09: 	private String city;
10: 	private String state;
11: 	private String zip;
12: 
13: 	public String getAddressLine1() {
14: 		return addressLine1;
15: 	}
16: 
17: 	public void setAddressLine1(String addressLine1) {
18: 		this.addressLine1 = addressLine1;
19: 	}
20: 
21: 	public String getAddressLine2() {
22: 		return addressLine2;
23: 	}
24: 
25: 	public void setAddressLine2(String addressLine2) {
26: 		this.addressLine2 = addressLine2;
27: 	}
28: 
29: 	public String getCity() {
30: 		return city;
31: 	}
32: 
33: 	public void setCity(String city) {
34: 		this.city = city;
35: 	}
36: 
37: 	public String getState() {
38: 		return state;
39: 	}
40: 
41: 	public void setState(String state) {
42: 		this.state = state;
43: 	}
44: 
45: 	public String getZip() {
46: 		return zip;
47: 	}
48: 
49: 	public void setZip(String zip) {
50: 		this.zip = zip;
51: 	}
54: }
{% endhighlight %}
### Interesting Lines
Again, doesn't really apply. However, it *is* interesting that we know whether or not this object has changed even though looking at the class it's hard to see how.

----
[#InnerTypeAspect](#InnerTypeAspect)
## InnerTypeAspect.java
{% highlight java %}
01: package ex4;
02: 
03: import org.aspectj.lang.annotation.Aspect;
04: import org.aspectj.lang.annotation.DeclareParents;
05: 
06: @Aspect
07: public class InnerTypeAspect {
08:     @DeclareParents(value = "ex4.Address", defaultImpl = ex4.TrackedObjectMixin.class)
09:     ITrackedObject trackedObject;
10: }
{% endhighlight %}
### Interesting Lines
^
|-|-|
|Line|Description|
|6|This is an aspect.|
|8|We are adding a parent interface to the class ex4.Address. This interface will have methods that must be implemented. The implementation of those methods will be provided by ex4.TrackedObjectMixin.|
|9|The class ex4.Address will implement the interface ex4.ITrackedObject. As alreay mentioned, ex4.ITrackedObject has methods that must be implemented; and they will be by ex4.TrackedObjectMixin.|

[#ItrackedObject](#ItrackedObject)
## ITrackedObject.java
This is simply an interface that has the methods for a Java-bean style boolean interface.
{% highlight java %}
01: package ex4;
02: 
03: public interface ITrackedObject {
04:    boolean isChanged();
05:    void setChanged(boolean changed);
06: }
{% endhighlight %}

### InterestingLines
There are really no interesting lines, just the definition of an interface.

----
[#TrackedObjectMixin](#TrackedObjectMixin)
## TrackedObjectMixin.java
This is an implementation of ITrackedObject. Our goal is to augment Address with this interface/implementation without Address' knowledge. Furthermore, we want to augment Dao.save(..) to not save unnecessarily; we do this without its knowledge as well.
{% highlight java %}
01: package ex4;
02: 
03: public class TrackedObjectMixin implements ITrackedObject {
04:    private boolean changed = false;
05: 
06:    public TrackedObjectMixin() {
07:    }
08: 
09:    public boolean isChanged() {
10:       return changed;
11:    }
12: 
13:    public void setChanged(boolean changed) {
14:       this.changed = changed;
15:    }
16: }
{% endhighlight %}
----
[#FieldSetAspect](#FieldSetAspect)
## FieldSetAspect.java
{% highlight java %}
01: package ex4;
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
13:     @Pointcut("!set(* ex4.TrackedObjectMixin.*)")
14:     public void skipTrackedObject() {
15:     }
16: 
17:     @Pointcut("args(rhs) && set(* ex4.Address.*)")
18:     public void allFields(Object rhs) {
19:     }
20: 
21:     @Around("allFields(rhs) && skipTrackedObject()")
22:     public Object trackFieldAssignment(ProceedingJoinPoint thisJoinPoint,
23:             Object rhs) throws Throwable {
24:         FieldSignature fs = (FieldSignature) thisJoinPoint.getSignature();
25: 
26:         Object target = thisJoinPoint.getTarget();
27:         Field field = fs.getField();
28:         field.setAccessible(true);
29:         Object currentValue = field.get(target);
30: 
31:         if (equals(currentValue, rhs)) {
32:             return null;
33:         } else {
34:             ((ITrackedObject) target).setChanged(true);
35:             return thisJoinPoint.proceed();
36:         }
37:     }
38: 
39:     private boolean equals(Object lhs, Object rhs) {
40:         if (lhs == null && rhs == null) {
41:             return true;
42:         }
43:         if (lhs == null && rhs != null) {
44:             return false;
45:         }
46:         if (lhs != null && rhs == null) {
47:             return false;
48:         }
49:         return lhs.equals(rhs);
50:     }
51: }
{% endhighlight %}

### Interesting Lines
^
|-|-|
|Line|Description|
|11|This is an aspect.|
|13|Define a pointcut called "skipTrackedObject" that excludes all fields in TrackedObjectMixin. Why? See the exercises section.|
|17|Define a pointcut called "allFields" that will match all fields in the ex4.Address class.|
|21|Around all pointcuts that are "allFields" but not any fields in TrackedObjectMixin execute the method trackFieldAssignment().|
|23|Notice Object rhs is a parameter. AspectJ fills that in with the object appearing on the right side of the assignment operator (=). Thus the name rhs, for Right Hand Side.|
|24|Beause of how I defined the pointcut, I know I only match field setting, so I can downcast this to give me more specific methods.|
|26 - 29|Retrieve the current value of the field being set.|
|31 - 36|If the current value equals the value on the right side of the assignment operator, do not perform the set, just return. Otherwise perform the set and make the underling target object, an instance of the Address class, as changed.|
|39 - 50|A simple utility method to handle comparison of 2 objects where either object might be null.|

[#SaveMethodAspect](#SaveMethodAspect)
## SaveMethodAspect.java
The SaveMethodAspect surrounds all calls to Dao.save(..). When called, it checks to see if the object passed into Dao.save(..) is or is not changed. If it is not changed, the call to Dao.save(..) never happens. Before completing, the changed state is set to false since either it was already false or it was true but then saved. As with the FieldSetAspect, SaveMethodAspect is using behavior that has been introduced. Specifically, it uses isChanged() and setChanged(). 
{% highlight java %}
01: package ex4;
02: 
03: import org.aspectj.lang.ProceedingJoinPoint;
04: import org.aspectj.lang.annotation.Around;
05: import org.aspectj.lang.annotation.Aspect;
06: import org.aspectj.lang.annotation.Pointcut;
07: 
08: @Aspect
09: public class SaveMethodAspect {
10:     @Pointcut("execution(* ex4.Dao.save(..))")
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
### Interesting Lines
^
|-|-|
|Line|Description|
|8|This is an aspect|
|10|Create a pointcut called daoSaveMethod that matched a method of any access level, *, named ex4.Dao.save, taking any parameters "(..)".|
|14|Around all joinpoints defined by daoSaveMethod, execute the method skipSaveIfUnchanged.|
|17|For this example, we know we only call save() with an Address object. Get the address object that was passed to the save() method from thisJoinPoint.|
|18|We know Address implements ITrackedObject because we have an aspect that introduces that interface. Address, however, is not aware of this fact.|
|21 - 27|Check to see if the Address instance is changed. If it is, call the save() method. If not, do not call the save method and instead report that the object is unchanged.|
|29|Regardless of what happened, set the object back to unchanged. Is this always safe?|

[#aop](#aop)
## aop.xml
{% highlight terminal %}
01: <aspectj>
02: 	<aspects>
03: 		<aspect name="ex4.FieldSetAspect"/>
04: 		<aspect name="ex4.InnerTypeAspect"/>
05: 		<aspect name="ex4.SaveMethodAspect"/>
06: 	</aspects>
07: 	<weaver>
08: 		<include within="ex4.*"/>
09: 	</weaver>
10: </aspectj>
{% endhighlight %}
### Interesting Lines
^
|-|-|
|Line|Description|
|3 - 5|List the 3 aspects we want to have woven in.|
|8|We want to weave all classes whose package starts with ex4.|

[<--Back](AspectJEX4SoWhatIsHappening) [Next-->](AspectJEX4ApplyYourself)
