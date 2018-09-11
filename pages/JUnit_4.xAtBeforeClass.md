---
title: JUnit_4.xAtBeforeClass
---
[<--Back](JUnit_4.x#AtBeforeClass)

# @BeforeClass

There is no analog to @BeforeClass before JUnit 4.0. This is initialization code that is executed once. That is, if you have 1 unit tests or 100, this will execute one time before the very first test execution.

@BeforeClass annotated methods in superclasses will execute first.

Notice that the method is both public and static. That's required:
{% highlight java %}
40:     @BeforeClass
41:     public static void createTestVehicleType() {
42:         vtComponent = new VehicleTypeComponent();
43:         vtComponent.createVehicleType(TEST_VEHICLE_TYPE_NAME, ValidState.valid);
44:         vtComponent.createVehicleType(TEST_VEHICLE_TYPE_NAME_2, ValidState.valid);
45:     }
{% endhighlight %}

[<--Back](JUnit_4.x#AtBeforeClass)
