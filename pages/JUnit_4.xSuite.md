---
title: JUnit_4.xSuite
---
[[JUnit 4.x|<--Back to JUnit 4.x]]

# Suite Method for Backwards Compatibility

In Eclipse, I can right-click on a Java class and use Run As:JUnit Test in one of a few situations:
* The class inherits from TestClass
* The class has a public static Test suite() {..} method
* If I happen to be selecting a package I can do the same

Since few IDE's are JUnit 4 aware, JUnit 4 offers a class for backwards compatibility. It is JUnit4TestAdapter. Simply adding the method shown below, lines 38 - 40, will provide backwards-compatibility with Eclipse 2.x and 3.x:
```
04: import junit.framework.JUnit4TestAdapter;
13: 
14: public class TestVehicle {
32: 
33:     /**
34:      * Provide backwards-compatibility with JUnit runner in Eclipse.
35:      * 
36:      * @return
37:      */
38:     public static junit.framework.Test suite() {
39:         return new JUnit4TestAdapter(TestVehicle.class);
40:     }
```
## Interesting Lines
||Line||Description||
||4||This is the import for the JUnit4TestAdapter. Of course, if your in Eclipse, you can just start typing JUnit4 then hit ctrl-space for command line completing (assuming JUnit 4 is in the project's class path||
||38 - 40||Nearly boilerplate code. The only thing you'll need to change is the parameter passed in to the constructor. Instead of TestVehicle.class, you'll pass in YourClass.class.||

If you have added the suite method and at least one method with the [[JUnit 4.xAtTest|@Test]] annotation, you are ready to run your first JUnit 4 test.

[[JUnit 4.x|<--Back to JUnit 4.x]]