[[AspectJ Annotation Start|<--Back]] [[AspectJ Annotation Observation|Next-->]]

# AspectJ Annotation: Experience=
Here is the full source for this example: [[file:AspectJAnnotationsSrc.zip]]. If you'd like to know how to set up a project using it, [[ExtractingSourceFilesIntoProject|click here]].

This example is written in a way that it is meant to follow: [[AspectJ Example 3]] and [[AspectJ Example 4]]. I specifically leave out details unchanged from those examples.

Now we'll introduce selecting pointcuts augmented by annotations. Begin by reviewing the following Java files and the expected output. Based on all of that information, your assignment is to describe what is happening and try to guess how it is happening. Note that the code provided here is somewhat stripped down to reduce what you have to look at. Later, we provide the full source in the [[AspectJ Annotation Explained|Explained]] section.
----
## Main.java==
```java
public class Main {
    public static void main(String args[]) {
        Address a = new Address();
        a.setIgnoredField("Ignored");
        Dao.save(a);
        a.setZip("75001");
        Dao.save(a);
    }
}
```
----
## Dao.java==
```java
public class Dao {
    public static void save(Object o) {
        if (o != null) {
            System.out.printf("Saving: %s\n", o.getClass());
        }
    }
}
```
----
## The Output==
```
Not saving: class annotation.Address, it is unchanged
Saving: class annotation.Address
```
----
## IgnoreField.java - the annotation==
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface IgnoreField {
    String value() default "";
}
```
----
## FieldSetAspect.java==
```java
@Aspect
public class FieldSetAspect {
    @Pointcut("set(* annotation.TrackedObjectMixin.*)")
    public void trackedObject() {
    }

    @Pointcut("args(rhs) && set(!@annotation.IgnoreField * annotation.Address.*)")
    public void allFields(Object rhs) {
    }

    @Pointcut("cflow(execution(annotation.ITrackedObject+.new (..)))")
    public void constructors() {
    }

    @Around("allFields(rhs) && !trackedObject() && !constructors()")
    public Object trackFieldAssignment(ProceedingJoinPoint thisJoinPoint, Object rhs) throws Throwable {
       // ...
    }
```
----
```java
public class Address implements Serializable {
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String zip;

    @IgnoreField("Example of a field we ignore")
    private String ignoredField;

    public String getIgnoredField() {
        return ignoredField;
    }
```

[[AspectJ Annotation Start|<--Back]] [[AspectJ Annotation Observation|Next-->]]