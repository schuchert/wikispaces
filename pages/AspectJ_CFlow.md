[[AspectJ Self Study|<--Back]] [[AspectJ CFlow ExpectedVersusActualOutput|Next-->]]

Source files are here: [[file:AspectJCFlowsrc.zip]]. If you need instructions on what do with these files, try [[ExtractingSourceFilesIntoProject|here]].

# Predict the Output=
In this exercise, you have all of the information you need to predict the output, unlike Examples 1 - 4.

## Code to Review==
 This example closely follows [[AspectJ Example 4]], the only changes are the addition of a constructor to the Address class and an update to the pointcuts in FieldSetAspect.
----
### Address.java===
Note, just a partial listing.
```java
...
public class Address implements Serializable {
    public Address() {
        setAddressLine1("");
    }
...
```
----
### FieldSetAspect.java===
```java
...
@Aspect
public class FieldSetAspect {
    @Pointcut("!set(* cf.TrackedObjectMixin.*)")
    public void skipTrackedObject() {
    }

    @Pointcut("args(rhs) && set(* cf.Address.*)")
    public void allFields(Object rhs) {
    }
    
    @Pointcut("cflow(execution(cf.ITrackedObject+.new (..)))")
    public void constructors() {
    }

    @Around("allFields(rhs) && skipTrackedObject() && !constructors()")
    public Object trackFieldAssignment(ProceedingJoinPoint thisJoinPoint,
            Object rhs) throws Throwable {
...
```
### Main.java===
```java
package cflow;

public class Main {
    public static void main(String args[]) {
        Address a = new Address();
        Dao.save(a);
        a.setZip(null);
        Dao.save(a);
        a.setZip("75001");
        Dao.save(a);
        Dao.save(a);
    }
}
```
## Predict the output==
In the previous version of Address.java, the constructor did nothing, now the constructor sets one of the fields. So is it changed or not? Review the third pointcut in FieldSetAspect.java. Question, what is the output?

[[AspectJ Self Study|<--Back]] [[AspectJ CFlow ExpectedVersusActualOutput|Next-->]]