---
title: JUnit_4.xAtAfter
---
[<--Back](JUnit_4.x#AtAfter)

## @After
@After is the opposite of [@Before](JUnit_4.xAtBefore). It is executed after each unit test. JUnit prior to version 4.0 had an equivalent method, tearDown, you could optionally define in a test class to get similar behavior. There are differences:
* You can call your method anything you want.
* You can have more than one.
* Any methods annotated with @After in superclasses are executed **after** methods in the derived class. That is, they execute bottom to top, just the opposite of top to bottom.
* This method must be public in JUnit 4.0 whereas tearDown in JUnit before 4.0 was protected (or public).

Here is the example:
{% highlight java %}
59:     @After
60:     public void removeCreatedRateplan() {
61:         if (createdRatePlanName != null && createdRatePlanVehicleType != null) {
62:             component.removeRatePlan(createdRatePlanName, createdRatePlanVehicleType);
63:         }
64: 
65:     }
{% endhighlight %}
And here's the equivalent in JUnit before 4.0.
{% highlight java %}
60:     protected void tearDown() {
61:         if (createdRatePlanName != null && createdRatePlanVehicleType != null) {
62:             component.removeRatePlan(createdRatePlanName, createdRatePlanVehicleType);
63:         }
64: 
65:     }
{% endhighlight %}

[<--Back](JUnit_4.x#AtAfter)
