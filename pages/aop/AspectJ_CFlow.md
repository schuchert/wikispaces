---
title: AspectJ_CFlow
---
[<--Back]({{site.pagesurl}}/AspectJ_Self_Study) [Next-->]({{site.pagesurl}}/AspectJ_CFlow_ExpectedVersusActualOutput)

Source files are here: [[file:AspectJCFlowsrc.zip]]. If you need instructions on what do with these files, try [here]({{ site.pagesurl}}/ExtractingSourceFilesIntoProject).

# Predict the Output
In this exercise, you have all of the information you need to predict the output, unlike Examples 1 - 4.

## Code to Review
 This example closely follows [AspectJ_Example_4]({{site.pagesurl}}/AspectJ_Example_4), the only changes are the addition of a constructor to the Address class and an update to the pointcuts in FieldSetAspect.
----
### Address.java
Note, just a partial listing.
{% highlight java %}
...
public class Address implements Serializable {
    public Address() {
        setAddressLine1("");
    }
...
{% endhighlight %}
----
### FieldSetAspect.java
{% highlight java %}
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
{% endhighlight %}
### Main.java
{% highlight java %}
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
{% endhighlight %}
## Predict the output
In the previous version of Address.java, the constructor did nothing, now the constructor sets one of the fields. So is it changed or not? Review the third pointcut in FieldSetAspect.java. Question, what is the output?

[<--Back]({{site.pagesurl}}/AspectJ_Self_Study) [Next-->]({{site.pagesurl}}/AspectJ_CFlow_ExpectedVersusActualOutput)
