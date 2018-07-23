---
title: JUnit_4.x
---
# JUnit 4.1
{:toc}
If you've used JUnit prior to version 4.0 (e.g. you've been using JUnit in Eclipse version 2.0 to 3.1.2) then here is the first place you want to go to get up to speed: [JUnit 4.0 in 10 Minutes](http://www.instrumentalservices.com/index.php?option=com_content&task=view&id=45&Itemid=52). If you are not somewhat familiar with JUnit 4, you can probably follow this material. However, after code examples that use JUnit 4 specific features, you'll notice a [[Click Here]] link that will give you more detailed information.

Now that I've used it a bit in Eclipse 3.1.2, I've got an initial recommendation and some examples:
* Using the [assert*]({{ site.pagesurl}}/JUnit 4.x#assertAsterisk) methods
* Using a [TimeBomb]({{ site.pagesurl}}/JUnit 4.x#TimeBomb) as a test place holder.
* [TimeBomb Generic Code Explained]({{ site.pagesurl}}/JUnit 4.xTimeBombGenericCodeExplained)

[[#assertAsterisk]]
## Using the assert* methods
In JUnit 3.8.1, test classes inherited from TestCase. Among other things, doing so gave the code access to several assert methods like assertEquals. JUnit 4.x no longer makes this requirement. Of course every solution introduces problems. In this case, I no longer have easy access to assertEquals and other such methods.

### Java 5 to the rescue
The recommendation from [JUnit 4.0 in 10 Minutes](http://www.instrumentalservices.com/index.php?option=com_content&task=view&id=45&Itemid=52) is to use [static imports](http://java.sun.com/j2se/1.5.0/docs/guide/language/static-import.html)from the org.junit.Assert class to get methods like assertEquals. The following excerpt is taken from [Example 1]({{ site.pagesurl}}/JUnit 4.x#example1) below. Note the line numbers are from the original example. Line 3 is the static import, which is used on lines 29 and 30:
```
     03: import static org.junit.Assert.assertEquals;
     14: public class TestVehicle {
     26:     @Test
     27:     public void createSimpleVehicle() {
     28:         Vehicle v = new Vehicle("Ford", "Focus", 2005, "Green", type, license);
     29:         assertEquals(type, v.getType());
     30:         assertEquals(license, v.getLicense());
     31:     }
     41: }
```
[[#AtTest]]
[Click Here for more information on @Test.]({{ site.pagesurl}}/JUnit 4.xAtTest)

This works fine until you try to organize imports in Eclipse or use name completion (ctrl-space). Eclipse will not allow you to use name completion on something like assertFalse. You have to manually type in the name, and then manually add the import and things work fine. I'm lazy and I don't want to do this. My first attempt to fix this was the following:
```
     03: import static org.junit.Assert.*;
```
Now I can use name completion on things like "assert" and Eclipse will give me my list of names. This works great until you organize imports. As soon as you do the line that contained the .* is replaced by one to many lines, one each for each of the assert* methods you've used.

Since these methods are in the class org.junit.Assert, I've decided to switch to having my test classes inherit from Assert. This works just fine. It sort of defeats the purpose of using annotations to avoid having to use inheritance but it works well with my development environment so I'm happy. Here's an example taken from [Example 2]({{ site.pagesurl}}/JUnit 4.x#example2). Notice that by extending on line 17, I have easy access to assertEquals on lines 39 and 40. I understand that this violates the is-a interpretation of inheritance. It is not my preference but until we get better IDE support, it makes writing my tests a bit easier. Anything that supports writing tests is a good thing as far as I'm concerned.
```
05: import org.junit.Assert;
17: public class VehicleTypeComponentTest extends Assert {
33: 
34:     @Test
35:     public void createVehicleTypeWhenNoneExist() {
36:         component.clearAll();
37:         component.createVehicleType("Test1", ValidState.valid);
38:         VehicleType vt = component.getVehicleTypeNamed("Test1");
39:         assertEquals(vt.getName().getValue(), "Test1");
40:         assertEquals(vt.getState().getValue(), ValidState.valid);
41:     }
101: }
```
[[#TimeBomb]]
## TimeBomb
What is a TimeBomb? Let's begin with an example. This is an excerpt from [Example 2]({{ site.pagesurl}}/JUnit 4.x#example2):
```
05: import org.junit.Assert;
15: import vehicle.util.TimeBomb;
16: 
17: public class VehicleTypeComponentTest extends Assert { 
92:     @Test(expected = ObjectInUse.class)
93:     public void removeUsedValidType() {
94:         TimeBomb.throwUntil(16, 6, 2006, new ObjectInUse(VehicleType.class, "key"));
95:     }
96:
```
[[#AtTestExpected]]
[Click here for more information on @Test(expected = ObjectInUse.class)]({{ site.pagesurl}}/JUnit 4.xAtTestWithExpected)

This example probably needs a little more background. As mentioned in [JUnit 4.0 in 10 Minutes](http://www.instrumentalservices.com/index.php?option=com_content&task=view&id=45&Itemid=52), we use the @Test annotation to denote a method as a test case. It can take an optional argument of //**expected**//. This test is meant to attempt to remove a VehicleType that is used by other ob jets. So, in this case, read @Test(expected = ObjectInUse.class) as "when this test executes, I expect the exception ObjectInUse to be thrown."

If I had a Dao (data access object) that used an underlying database, the request would generate a low-level SQL exception related to a constraint violation. Right now I'm just mocking everything out so I don't have that underlying support. I'll add it to the mock but until I do, I want a place holder for this test.

I do not have a try block and I did not add a throws clause to the method signature, so how does this example compile? ObjectInUse is a RuntimeException. The ``@Test(expected = ...)`` does not obviate the need to handle exceptions properly. If I was expecting a checked exception, then along with @Test(expected=SomeCheckedException.class), I'd have to add "throws SomeCheckedException" to the method signature. I could catch the exception in the test case, but I don't recommend that. Let JUnit report exceptions properly. That's one of the things it does for you.

What happens when you do not have the infrastructure in place for a unit test, what are your options?
# Write the test, run the tests with that test failing until the infrastructure is in place
# Wait to add the test to the suite
# Use a TODO comment or some such IDE feature
# Add the test and get the infrastructure in place right now
# Use a TimeBomb

**Option 1**
The first option is fine if I'm the only person working on the system. However if I'm working in a team then it really isn't. If you happen to be using continuous integration, this option is even less appealing since the build will remain broken until I can fix this test.

**Option 2**
The second option is good but I'm worried I might forget to add the test in. The way my brain works, once I've generally finished a suite of tests in an area I only go back when I start having failures of some kind or if I think of a test I missed. I like having a place holder. Sure, I can look over all of the user stories and the acceptance tests to make sure I didn't miss anything, but I'd rather just stub out all of the tests I'm going to need to write, write a few, get them to compile and run, then write a few more. Your experience may be different.

**Option3**
The third option is a good one. The IDE can remind me to do something. It's somewhat passive since it doesn't force me to do anything. In my experience as a consultant, large projects end up with numerous warnings and todo's. They end up being noise rather than useful information. I don't like this trend but it's what I've experienced. So I'm not keen on this option alone. I think, however, it might be used in conjunction with other options.

**Option 4**
If you can use the forth option, that's the way to go. For this example, which I have taken from some work I'm doing right now, I don't have this option yet. I'm not ready to get to that building block. It will happen in a few days to a week depending on my free time. So for me, this option is not applicable for this situation. If it were, I'd use it.

**Option 5**
This leaves the TimeBomb example. This test expects an exception to be thrown. I'm using the TimeBomb class to throw the necessary exception until some time in the future. If I have not remembered to go back and write this test by that future date, TimeBomb will stop throwing the exception and the test will start to fail. It allows me to put a place holder in with an //**active**// reminder to fix it at some point in the future.

I've used this on what has grown to a team of around 60 people (from 6) all working on different applications based on a common architecture. We've been using this kind of thing now for over 3 years and it seems to remain a valuable technique. You can review the code for [TimeBomb]({{ site.pagesurl}}/JUnit 4.x#TimeBombCode) below. Since I've written it from scratch on this example, it's pretty small. As I need more methods, I'll add them. It's the idea that is valuable, not the implementation.

If you're interested in a complex and detailed explanation of the implementation of TimeBomb, [click here for a detailed description.]({{ site.pagesurl}}/JUnit 4.xTimeBombGenericCodeExplained)

----
## Complete Examples
This section contains the full code for the examples mentioned above.
----
[[#example1]]
### Example 1
**TestVehicle.java**
```java
01: package ztest.vehicle.domain;
02: 
03: import static org.junit.Assert.assertEquals;
04: import junit.framework.JUnit4TestAdapter;
05: 
06: import org.junit.Before;
07: import org.junit.Test;
08: 
09: import vehicle.domain.IssuingState;
10: import vehicle.domain.Vehicle;
11: import vehicle.domain.VehicleLicense;
12: import vehicle.domain.VehicleType;
13: 
14: public class TestVehicle {
15:     private IssuingState state;
16:     private VehicleLicense license;
17:     private VehicleType type;
```
[[#AtBefore]]
[For a description of @Before, click here.]({{ site.pagesurl}}/JUnit 4.xBefore)
```java
19:     @Before
20:     public void setup() {
21:         type = new VehicleType("Luxury");
22:         state = new IssuingState("Iowa");
23:         license = new VehicleLicense("LRX24J", state);
24:     }
```
[For a description of @Test, click here.]({{ site.pagesurl}}/JUnit 4.xAtTest)
```java
26:     @Test
27:     public void createSimpleVehicle() {
28:         Vehicle v = new Vehicle("Ford", "Focus", 2005, "Green", type, license);
29:         assertEquals(type, v.getType());
30:         assertEquals(license, v.getLicense());
31:     }
```
[For a description of the suite method, click here.]({{ site.pagesurl}}/JUnit 4.xSuite)
```java
33:     /**
34:      * Provide backwards-compatibility with JUnit runner in Eclipse.
35:      * 
36:      * @return
37:      */
38:     public static junit.framework.Test suite() {
39:         return new JUnit4TestAdapter(TestVehicle.class);
40:     }
41: }
```
----
[[#example2]]
### Example 2
**VehicleTypeComponentTest.java**
```java
01: package ztest.vehicle.component.vehicletype;
02: 
03: import junit.framework.JUnit4TestAdapter;
04: 
05: import org.junit.Assert;
06: import org.junit.Before;
07: import org.junit.Test;
08: 
09: import vehicle.component.vehicletype.VehicleTypeComponent;
10: import vehicle.domain.VehicleType;
11: import vehicle.domain.ValidState;
12: import vehicle.exception.ObjectDoesNotExist;
13: import vehicle.exception.ObjectExists;
14: import vehicle.exception.ObjectInUse;
15: import vehicle.util.TimeBomb;
16: 
17: public class VehicleTypeComponentTest extends Assert {
18: 
19:     private VehicleTypeComponent component;
20: 
21:     public static junit.framework.Test suite() {
22:         return new JUnit4TestAdapter(VehicleTypeComponentTest.class);
23:     }
24: 
25:     @Before
26:     public void setup() {
27:         component = new VehicleTypeComponent();
28:         component.createVehicleType("PreExisting1", ValidState.valid);
29:         component.createVehicleType("PreExisting2", ValidState.valid);
30:         component.createVehicleType("PreExisting3", ValidState.invalid);
31:         component.createVehicleType("PreExisting4", ValidState.valid);
32:     }
33: 
34:     @Test
35:     public void createVehicleTypeWhenNoneExist() {
36:         component.clearAll();
37:         component.createVehicleType("Test1", ValidState.valid);
38:         VehicleType vt = component.getVehicleTypeNamed("Test1");
39:         assertEquals(vt.getName().getValue(), "Test1");
40:         assertEquals(vt.getState().getValue(), ValidState.valid);
41:     }
42: 
43:     @Test
44:     public void createVehicleTypeWhenSomeExist() {
45:         component.createVehicleType("Test1", ValidState.valid);
46:         VehicleType vt = component.getVehicleTypeNamed("Test1");
47:         assertEquals(vt.getName().getValue(), "Test1");
48:         assertEquals(vt.getState().getValue(), ValidState.valid);
49:     }
50: 
51:     @Test(expected = ObjectExists.class)
52:     public void createVehicleTypeWhenNameAlreadyExists() {
53:         component.createVehicleType("PreExisting1", ValidState.valid);
54: 
55:     }
56: 
57:     @Test(expected = ObjectExists.class)
58:     public void createVehicleTypeWhenInvalidOneExists() {
59:         component.createVehicleType("PreExisting3", ValidState.invalid);
60:     }
61: 
62:     @Test
63:     public void invalidteValidVehicleType() {
64:         VehicleType vt = component.getVehicleTypeNamed("PreExisting1");
65:         assertEquals(vt.getState().getValue(), ValidState.valid);
66:         component.setVehicleState("PreExisting1", ValidState.invalid);
67:         vt = component.getVehicleTypeNamed("PreExisting1");
68:         assertEquals(vt.getState().getValue(), ValidState.invalid);
69:     }
70: 
71:     @Test
72:     public void invalidteInvalidVehicleType() {
73:         VehicleType vt = component.getVehicleTypeNamed("PreExisting3");
74:         assertEquals(vt.getState().getValue(), ValidState.invalid);
75:         component.setVehicleState("PreExisting1", ValidState.invalid);
76:         vt = component.getVehicleTypeNamed("PreExisting1");
77:         assertEquals(vt.getState().getValue(), ValidState.invalid);
78:     }
79: 
80:     @Test(expected = ObjectDoesNotExist.class)
81:     public void removeUnusedValidVehicleType() {
82:         component.removeVehicleTypeNamed("PreExisting1");
83:         component.getVehicleTypeNamed("PreExisting1");
84:     }
85: 
86:     @Test(expected = ObjectDoesNotExist.class)
87:     public void removeUnusedInvalidVehicleType() {
88:         component.removeVehicleTypeNamed("PreExisting3");
89:         component.getVehicleTypeNamed("PreExisting3");
90:     }
91: 
92:     @Test(expected = ObjectInUse.class)
93:     public void removeUsedValidType() {
94:         TimeBomb.throwUntil(16, 6, 2006, new ObjectInUse(VehicleType.class, "key"));
95:     }
96: 
97:     @Test(expected = ObjectInUse.class)
98:     public void removeUsedInvalidType() {
99:         TimeBomb.throwUntil(16, 6, 2006, new ObjectInUse(VehicleType.class, "key"));
100:     }
101: }
```
----
[[#example3]]
### Example 3
**RatePlanComponentTest.java** (partial)
```java
01: package ztest.vehicle.component.rateplan;
02: 
03: import junit.framework.JUnit4TestAdapter;
04: 
05: import org.junit.After;
06: import org.junit.AfterClass;
07: import org.junit.Assert;
08: import org.junit.Before;
09: import org.junit.BeforeClass;
10: import org.junit.Test;
11: 
26: public class RatePlanComponentTest extends Assert {
27:     private static final String TEST_VEHICLE_TYPE_NAME = "TestVehicleType";
28:     private static final String TEST_VEHICLE_TYPE_NAME_2 = "TestVehicleType2";
29: 
30:     private RatePlanComponent component;
31:     private static VehicleTypeComponent vtComponent;
32: 
33:     private Field<String> createdRatePlanName;
34:     private Field<VehicleType> createdRatePlanVehicleType;
35: 
36:     public static junit.framework.Test suite() {
37:         return new JUnit4TestAdapter(RatePlanComponentTest.class);
38:     }
```
[[#AtBeforeClass]]
[For a description of @BeforeClass, click here.]({{ site.pagesurl}}/JUnit 4.xAtBeforeClass)
```java
40:     @BeforeClass
41:     public static void createTestVehicleType() {
42:         vtComponent = new VehicleTypeComponent();
43:         vtComponent.createVehicleType(TEST_VEHICLE_TYPE_NAME, ValidState.valid);
44:         vtComponent.createVehicleType(TEST_VEHICLE_TYPE_NAME_2, ValidState.valid);
45:     }
```
[[#AtAfterClass]]
[For a description of @AfterClass, click here.]({{ site.pagesurl}}/JUnit 4.xAtAfterClass)
```java
47:     @AfterClass
48:     public static void removeTestVehicleType() {
49:         vtComponent.removeVehicleTypeNamed(TEST_VEHICLE_TYPE_NAME);
50:         vtComponent.removeVehicleTypeNamed(TEST_VEHICLE_TYPE_NAME_2);
51:     }
52: 
53:     @Before
54:     public void setup() {
55:         component = new RatePlanComponent();
56:         disableDeleting();
57:     }
```
[[#AtAfter]]
[For a description of @After, click here.]({{ site.pagesurl}}/JUnit 4.xAtAfter)
```java
59:     @After
60:     public void removeCreatedRateplan() {
61:         if (createdRatePlanName != null && createdRatePlanVehicleType != null) {
62:             component.removeRatePlan(createdRatePlanName, createdRatePlanVehicleType);
63:         }
64: 
65:     }
66: 
67:     @Test
68:     public void createRatePlan() {
69:         RatePlan rp = instantiatePopulatedRatePlan("Test Plan", TEST_VEHICLE_TYPE_NAME, 29, 137.75f, 14, 10, 34);
70:         Result<RatePlan> result = component.createRatePlan(rp);
71:         assertTrue(result.isSuccess());
72:     }
73: 
74:     @Test
75:     public void createRatePlanSameNameDifferentVehicleType() {
76:         RatePlan rp1 = instantiatePopulatedRatePlan("Test Plan", TEST_VEHICLE_TYPE_NAME, 34, 138, 12, 10, 40);
77:         RatePlan rp2 = instantiatePopulatedRatePlan("Test Plan", TEST_VEHICLE_TYPE_NAME_2, 34, 138, 12, 10, 40);
78: 
79:         try {
80:             Result<RatePlan> result1 = component.createRatePlan(rp1);
81:             assertTrue(result1.isSuccess());
82: 
83:             Result<RatePlan> result2 = component.createRatePlan(rp2);
84:             assertTrue(result2.isSuccess());
85:         } finally {
86:             removeRatePlan(rp1);
87:             removeRatePlan(rp2);
88:         }
89:     }
90: 
91:     @Test
92:     public void createRatePlanSameVehicleTypeDifferentName() {
93:         RatePlan rp1 = instantiatePopulatedRatePlan("Test Plan1", TEST_VEHICLE_TYPE_NAME, 34, 138, 12, 10, 40);
94:         RatePlan rp2 = instantiatePopulatedRatePlan("Test Plan2", TEST_VEHICLE_TYPE_NAME, 34, 138, 12, 10, 40);
95: 
96:         try {
97:             Result<RatePlan> result1 = component.createRatePlan(rp1);
98:             assertTrue(result1.isSuccess());
99: 
100:             Result<RatePlan> result2 = component.createRatePlan(rp2);
101:             assertTrue(result2.isSuccess());
102:         } finally {
103:             removeRatePlan(rp1);
104:             removeRatePlan(rp2);
105:         }
106:     }
107: 
108:     @Test(expected = ObjectExists.class)
109:     public void createRatePlanAlreadyExists() {
110:         RatePlan rp = instantiatePopulatedRatePlan("Test Plan1", TEST_VEHICLE_TYPE_NAME, 34, 138, 12, 10, 40);
111:         component.createRatePlan(rp);
112:         component.createRatePlan(rp);
113:     }
```
[[#RegularMethod]]
[What is this doing here? Click here.]({{ site.pagesurl}}/JUnit 4.xRegularMethod)
```java
233:     private RatePlan instantiateBasicRatePlan(String name, String vehicleTypeName) {
234:         createdRatePlanName = new Field<String>(name);
235:         createdRatePlanVehicleType = new Field<VehicleType>(vtComponent.getVehicleTypeNamed(vehicleTypeName));
236: 
237:         return new RatePlan(createdRatePlanName, 0, 0, 0, 0, 0, createdRatePlanVehicleType, ValidState.valid);
238:     }
```
----
[[#TimeBombCode]]
### TimeBomb.java
```java
01: package vehicle.util;
02: 
03: import java.util.Calendar;
04: 
05: public class TimeBomb {
06:     public static<T extends Exception> void throwUntil(int d, int m, int y, T e) throws T {
07:         Calendar now = Calendar.getInstance();
08:         Calendar dateToThrowUntil = Calendar.getInstance();
09:         dateToThrowUntil.set(y, m - 1, d);
10:         
11:         if(dateToThrowUntil.after(now)) {
12:             throw e;
13:         }
14:     }
15: }
```
[Click here for a detailed description of TimeBomb.]({{ site.pagesurl}}/JUnit 4.xTimeBombGenericCodeExplained)