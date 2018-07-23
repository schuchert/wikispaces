---
title: AspectJ_Annotation_One_Solution
---
[[AspectJ Annotation Possibilities|<--Back]] [[AspectJ Annotation AllCode|Next-->]]

# One Solution
This example is about using annotations so we will go with the 6th option. First, here’s what adding a field that we want to ignore might look like:

```java
    @IgnoreField("Example of a field we ignore")
    private String ignoredField;

    public String getIgnoredField() {
        return ignoredField;
    }

    public void setIgnoredField(String ignoredField) {
        this.ignoredField = ignoredField;
    }
```
Notice that the setter and the getter are normal. The only change is the addition of an annotation to the field called “ignoredField”.

Here’s the annotation @IgnoreField:
```java
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface IgnoreField {
        String value() default "";
    }
```
Of course, to make this change happen, we actually need to update our pointcut. When we want to refer to annotations, we use the @ to indicate an annotation in a pointcut. Here’s an updated version of FieldSetAspect:
```java
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
```
The first pointcut, trackedObject, picks out all fields defined in the TrackedObjectMixin class. As mentioned elsewhere, this avoids infinite recursion.

The second pointcut, allFields, includes the new syntax. Notice the first part of the set:
```
!@annotation.IgnoreField
```
@annotation.IgnoreField is the fully-qualified name of the annotation. ! means not. Read this as “the setting of any fields that do NOT have the annotation IgnoreField on them.”

[[AspectJ Annotation Possibilities|<--Back]] [[AspectJ Annotation AllCode|Next-->]]