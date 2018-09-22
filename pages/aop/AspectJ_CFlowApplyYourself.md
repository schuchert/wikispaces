---
title: AspectJ_CFlowApplyYourself
---
{% include nav prev="AspectJ_CFlowExplained" next="AspectJ_CFlowAssignmentApplications" %}

## Apply Yourself

----
### Research/Experiment
Do our pointcuts treat the following two code examples the same way?
{% highlight terminal %}
    public Address() {
        setAddressLine1("");
    }
{% endhighlight %}
versus.
{% highlight terminal %}
   private String addressLine1 = "";
{% endhighlight %}
----
### Custom Business Method
Add a method to the Address class. Make sure the method changes the Address in some way. Extend the cflow pointcut definition to include this new method. Verify that calling this method does not cause change tracking to occur.
----
### Advanced: Generic Disabling
This assignment comes from an actual experience.

Sometimes during normal program flow, I want to avoid change tracking (an actual need derived from requirements). Create a method in some class (say a static method on a utility class). Include that method in the cflow pointcut expression so when it is called, it does not cause change tracking to occur.

Next, make that method use reflection or anonymous inner classes. When you call that method, it calls either a method provided by name (reflrction), or it executes a method on an instance passed in (anonymous inner class). This allows any functionality to be executed while still avoidibg change tracking.
----
{% include nav prev="AspectJ_CFlowExplained" next="AspectJ_CFlowAssignmentApplications" %}
