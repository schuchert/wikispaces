---
title: JUnit_4.xAtAfterClass
---
[<--Back](JUnit_4.x#AtAfterClass)

# @AfterClass
There is no analog to @AfterClass before JUnit 4.0. It is run once after all unit tests in a given class have executed.

The @AfterClass in the most derived class executes first, then the immediate superclass and so on. The most base class's @AfterClass annotated methods execute last.

Notice that the method is both public and static. This is required:
{% highlight java %}
47:     @AfterClass
48:     public static void removeTestVehicleType() {
49:         vtComponent.removeVehicleTypeNamed(TEST_VEHICLE_TYPE_NAME);
50:         vtComponent.removeVehicleTypeNamed(TEST_VEHICLE_TYPE_NAME_2);
51:     }
{% endhighlight %}

[<--Back](JUnit_4.x#AtAfterClass)
