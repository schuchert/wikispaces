[[JUnit 4.x#Before|<--Back]]

# @Before=
The @Before annotation applies to methods. You put it on a method and JUnit will execute it before each unit test. This is equivalent to the setUp method from JUnit bfore 4.0 that was defined as protected in TestCase.

```
19:     @Before
20:     public void setup() {
21:         type = new VehicleType("Luxury");
22:         state = new IssuingState("Iowa");
23:         license = new VehicleLicense("LRX24J", state);
24:     }
```
In this case, the method setup will execute before each unit test. This before comes from a class with only one unit test, so it will only execute once.

This is how we would have accomplished the same effect in JUnit 3.8.1 (and before):
```
20:     protected void setUp() {
            super.setUp();
21:         type = new VehicleType("Luxury");
22:         state = new IssuingState("Iowa");
23:         license = new VehicleLicense("LRX24J", state);
24:     }
```

Not much different, but here are a few differences:
* If there are any base classes with a method that has the @Before annotation, those methods will execute first. So in the second example we explicitly called super.setUp(), but in JUnit 4.x, this is automatic.
* This class would have to inherit from TestCase (not shown).
* The method has to have the name setUp, whereas in JUnit 4.x, it does not.
* You can have more than one in JUnit 4.1 by using @Before more than once.

[[JUnit 4.x#Before|<--Back]]