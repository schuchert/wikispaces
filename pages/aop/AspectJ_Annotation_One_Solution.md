---
title: AspectJ_Annotation_One_Solution
---
{% include nav prev="AspectJ_Annotation_Possibilities" next="AspectJ_Annotation_AllCode" %}

## One Solution
This example is about using annotations so we will go with the 6th option. First, here’s what adding a field that we want to ignore might look like:

{% highlight java %}
    @IgnoreField("Example of a field we ignore")
    private String ignoredField;

    public String getIgnoredField() {
        return ignoredField;
    }

    public void setIgnoredField(String ignoredField) {
        this.ignoredField = ignoredField;
    }
{% endhighlight %}
Notice that the setter and the getter are normal. The only change is the addition of an annotation to the field called “ignoredField”.

Here’s the annotation @IgnoreField:
{% highlight java %}
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface IgnoreField {
        String value() default "";
    }
{% endhighlight %}
Of course, to make this change happen, we actually need to update our pointcut. When we want to refer to annotations, we use the @ to indicate an annotation in a pointcut. Here’s an updated version of FieldSetAspect:
{% highlight java %}
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
{% endhighlight %}
The first pointcut, trackedObject, picks out all fields defined in the TrackedObjectMixin class. As mentioned elsewhere, this avoids infinite recursion.

The second pointcut, allFields, includes the new syntax. Notice the first part of the set:
{% highlight terminal %}
!@annotation.IgnoreField
{% endhighlight %}
@annotation.IgnoreField is the fully-qualified name of the annotation. ! means not. Read this as “the setting of any fields that do NOT have the annotation IgnoreField on them.”

{% include nav prev="AspectJ_Annotation_Possibilities" next="AspectJ_Annotation_AllCode" %}
