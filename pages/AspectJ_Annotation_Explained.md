---
title: AspectJ_Annotation_Explained
---
[<--Back]({{ site.pagesurl}}/AspectJ_Annotation_Thinking) [Next-->]({{ site.pagesurl}}/AspectJ_Annotation_Exercises)

# Annotation Explained
## Main.java
```java
01: package annotation;
02: 
03: public class Main {
04:     public static void main(String args[]) {
05:         Address a = new Address();
06:         a.setIgnoredField("Ignored");
07:         Dao.save(a);
08:         a.setZip("75001");
09:         Dao.save(a);
10:     }
11: }
```
### Interesting Lines
There are arguably no interesting lines in this class. All of the work is done via aspects and annotations.

|---|---|
|Line|Description|
|6|This is the first place where we direclty change the address instance. In other examples, changes to Address instance are tracked by the FieldSetAspect. In this case, as we will see, this change is ignored.|

## Dao.java
```java
01: package annotation;
02: 
03: public class Dao {
04:     public static void save(Object o) {
05:         if (o != null) {
06:             System.out.printf("Saving: %s\n", o.getClass());
07:         }
08:     }
09: }
```
### Interesting Lines
This class is unchanged from [Example 4]({{ site.pagesurl}}/AspectJEX4Explained#Dao).

----
## Address.java
```java
01: package annotation;
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
13:     @IgnoreField("Example of a field we ignore")
14:     private String ignoredField;
15: 
16:     public String getIgnoredField() {
17:         return ignoredField;
18:     }
19: 
20:     public void setIgnoredField(String ignoredField) {
21:         this.ignoredField = ignoredField;
22:     }
23: 
24:     public Address() {
25:         setAddressLine1("");
26:     }
27: 
28:     public String getAddressLine1() {
29:         return addressLine1;
30:     }
31: 
32:     public void setAddressLine1(String addressLine1) {
33:         this.addressLine1 = addressLine1;
34:     }
35: 
36:     public String getAddressLine2() {
37:         return addressLine2;
38:     }
39: 
40:     public void setAddressLine2(String addressLine2) {
41:         this.addressLine2 = addressLine2;
42:     }
43: 
44:     public String getCity() {
45:         return city;
46:     }
47: 
48:     public void setCity(String city) {
49:         this.city = city;
50:     }
51: 
52:     public String getState() {
53:         return state;
54:     }
55: 
56:     public void setState(String state) {
57:         this.state = state;
58:     }
59: 
60:     public String getZip() {
61:         return zip;
62:     }
63: 
64:     public void setZip(String zip) {
65:         this.zip = zip;
66:     }
67: }
```
### Interesting Lines
There are 4 changes to this class.
* We've added a new attribute, ignoredField.
* We've added a setter
* We've added a getter
* We applied the @IgnoreField annotation to the ignoredField.

|---|---|
|Line|Description|
|13|@IgnoreField is an annotation that targets fields. We apply the annotation to the field named ignoredField. This does nothing directly to the field. This is just information associated with the field that will later be used by the SetFieldAspect.|

## IgnoreField.java
```java
01: package annotation;
02: 
03: import java.lang.annotation.ElementType;
04: import java.lang.annotation.Retention;
05: import java.lang.annotation.RetentionPolicy;
06: import java.lang.annotation.Target;
07: 
08: /**
09:  * Place on a field to ignore change tracking for that individual field.
10:  * Optionally, add a comment.
11:  */
12: @Retention(RetentionPolicy.RUNTIME)
13: @Target(ElementType.FIELD)
14: public @interface IgnoreField {
15:     String value() default "";
16: }
```

### Interesting Lines
We create a new kind of annotation. This annotation by itself only allows adding information to some element type. In this case, it is a field. This does not actively do anything. However, this annotation and a chagne to the SetFieldAspect combine to cause fields with this annotation to be ignored.

|---|---|
|Line|Description|
|12|This annotation's lifetime is **//RUNTIME//**. This means it is available even after the class has been loaded and used in a VM. Contrast that with **//SOURCE//** - thrown out after compilation and **//CLASS//** - recorded in the class file but not retained by the VM. See [RetentionPolicy](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/annotation/RetentionPolicy.html) for details.|
|13|This annotation targets **//FIELD//**s. There are several other options. For details, see [ElementType](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/annotation/ElementType.html).|

## FieldSetAspect.java
```java
01: package annotation;
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
13:     @Pointcut("set(* annotation.TrackedObjectMixin.*)")
14:     public void trackedObject() {
15:     }
16: 
17:     @Pointcut("args(rhs) && set(!@annotation.IgnoreField * annotation.Address.*)")
18:     public void allFields(Object rhs) {
19:     }
20: 
21:     @Pointcut("cflow(execution(annotation.ITrackedObject+.new (..)))")
22:     public void constructors() {
23:     }
24: 
25:     @Around("allFields(rhs) && !trackedObject() && !constructors()")
26:     public Object trackFieldAssignment(ProceedingJoinPoint thisJoinPoint, Object rhs) throws Throwable {
27:         FieldSignature fs = (FieldSignature) thisJoinPoint.getSignature();
28: 
29:         Object target = thisJoinPoint.getTarget();
30:         Field field = fs.getField();
31:         field.setAccessible(true);
32:         Object currentValue = field.get(target);
33: 
34:         if (equals(currentValue, rhs)) {
35:             return null;
36:         } else {
37:             ((ITrackedObject) target).setChanged(true);
38:             return thisJoinPoint.proceed();
39:         }
40:     }
41: 
42:     private boolean equals(Object lhs, Object rhs) {
43:         if (lhs == null && rhs == null) {
44:             return true;
45:         }
46:         if (lhs == null && rhs != null) {
47:             return false;
48:         }
49:         if (lhs != null && rhs == null) {
50:             return false;
51:         }
52:         return lhs.equals(rhs);
53:     }
54: }
```

### Interesting Lines
The key change to this class is on line 17 where we ignore fields with the annotation IgnoreField. Otherwise this aspect is mostly unchanged from previous examples. (In fact, this verion of the aspect includes changes for the [CFlow]({{ site.pagesurl}}/AspectJ CFlow) exmample on lines 21 - 23.

|---|---|
|Line|Description|
|13 - 15|Define a pointcut that covers the setting of all fields included in the class TrackedObjectMixin. We will use this later with ! to exclude these fields. This is to avoid a recursion problem. The details of why were covered by an exercise. To see that exercise, click [here]({{ site.pagesurl}}/AspectJEX4ApplyYourself#Unexpected Recursion).|
|17 - 19|Define a pointcut that captures the setting of all fields in the AddressClass except for those that have the annotation IgnoreField. AspectJ uses @Annotation to describe an annotation. In this case, we negate it so we're saying "does not have the annotation". This is the only change required to any of the aspects to support skipping individual fields.|
|21 - 23|This is described elsewhere. See [[AspectJ CFlow Explained]].|
|25|This Around advice applies to pointcuts that setters in Address but do not have the annotation IgnoreField AND NOT any pointcuts in the TrackedObjectMixin class AND NOT any pointcuts that happen in in the call of a constructor or anything called by the constructor. It's a lot to deal with, but by breaking it up into smaller pointcuts, it tends to be easier to understand and more manageable.|

## SaveMethodAspect.java
```java
01: package annotation;
02: 
03: import org.aspectj.lang.ProceedingJoinPoint;
04: import org.aspectj.lang.annotation.Around;
05: import org.aspectj.lang.annotation.Aspect;
06: import org.aspectj.lang.annotation.Pointcut;
07: 
08: @Aspect
09: public class SaveMethodAspect {
10:     @Pointcut("execution(* annotation.Dao.save(..))")
11:     public void daoSaveMethod() {
12:     }
13: 
14:     @Around("daoSaveMethod()")
15:     public Object skipSaveIfUnchanged(ProceedingJoinPoint thisJoinPoint) throws Throwable {
16:         Object param = thisJoinPoint.getArgs()[0];
17:         ITrackedObject tracked = (ITrackedObject) param;
18: 
19:         try {
20:             if (tracked.isChanged()) {
21:                 return thisJoinPoint.proceed();
22:             } else {
23:                 System.out.printf("Not saving: %s, it is unchanged\n", param.getClass());
24:                 return null;
25:             }
26:         } finally {
27:             tracked.setChanged(false);
28:         }
29:     }
30: }
```
This Aspect is unchanged from [Example 4]({{ site.pagesurl}}/AspectJ_Example_4). For details, see [Example 4 SaveMethodAspect]({{ site.pagesurl}}/AspectJEX4Explained#SaveMethodAspect).

----
## InnerTypeAspect.java
```java
01: package annotation;
02: 
03: import org.aspectj.lang.annotation.Aspect;
04: import org.aspectj.lang.annotation.DeclareParents;
05: 
06: @Aspect
07: public class InnerTypeAspect {
08:     @DeclareParents(value = "annotation.Address", defaultImpl = annotation.TrackedObjectMixin.class)
09:     ITrackedObject trackedObject;
10: }
```
This Aspect is unchanged from [Example 4 InnerTypeAspect]({{ site.pagesurl}}/AspectJEX4Explained#InnerTypeAspect).

----
## ITrackedObject.java
```java
01: package annotation;
02: 
03: public interface ITrackedObject {
04:     boolean isChanged();
05: 
06:     void setChanged(boolean changed);
07: }
```
This interface is unchanged from [Example 4 ITrackedObject]({{ site.pagesurl}}/AspectJEX4Explained#ITrackedObject).

----
## TrackedObjectMixin.java
```java
01: package annotation;
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
```

This interface is unchanged from [Example 4 TrackedObjectMixin]({{ site.pagesurl}}/AspectJEX4Explained#TrackedObjectMixin).

----
## aop.xml
```
01: <aspectj>
02: 	<aspects>
03: 		<aspect name="annotation.FieldSetAspect"/>
04: 		<aspect name="annotation.InnerTypeAspect"/>
05: 		<aspect name="annotation.SaveMethodAspect"/>
06: 	</aspects>
07: 	<weaver>
08: 		<include within="annotation.*"/>
09: 	</weaver>
10: </aspectj>
```
This file is unchanged from [Example 4 aop.xml]({{ site.pagesurl}}/AspectJEX4Explained#aop).

[<--Back]({{ site.pagesurl}}/AspectJ_Annotation_Thinking) [Next-->]({{ site.pagesurl}}/AspectJ_Annotation_Exercises)
