---
title: Parameterized_Test
---
[<--Back]({{ site.pagesurl}}/TDD_Example_Catalog)

Imagine we have a series of tests where for each test we perform some operation and then verify the results. The only thing that varies is the data we send into the operation and the expected result. Here's how we might brute force this:

**BlankLineTest.java**

```java
package com.objectmentor.parameterized;

import static org.junit.Assert.assertEquals;
import junit.framework.JUnit4TestAdapter;

import org.junit.Test;

public class BlankLineTest {
    public static junit.framework.Test suite() {
        return new JUnit4TestAdapter(BlankLineTest.class);
    }

    public final static String regex = "^\\s*$";

    @Test
    public void emptyLineInBlank() {
        assertEquals(true, "".matches(regex));
    }

    @Test
    public void spaceTabIsBlank() {
        assertEquals(true, " \t".matches(regex));
    }

    @Test
    public void spacesAreBlank() {
        assertEquals(true, "  ".matches(regex));
    }

    @Test
    public void justNewlineIsBlank() {
        assertEquals(true, "\n".matches(regex));
    }

    @Test
    public void justAIsNotBlank() {
        assertEquals(false, "a".matches(regex));
    }

    @Test
    public void spacesNotSpaceNotBlank() {
        assertEquals(false, "    q".matches(regex));
    }
}
```

For each test we have a string we test and an expected result (true or false). Here are each of those values:
^
|**Literal String**|**Expected**|**Test Name**|
|""|true|emptyLineInBlank|
|"  \t   "|true|spaceTabIsBlank|
|"   "|true|spacesAreBlank|
|"\n"|true|justNewlineIsBlank|
|"a"|false|justAIsNotBlank|
|"    q"|false|spacesNotSpaceNotBlank|

As you can imagine, every time we want to verify another combination we add another test method.

JUnit has an idiom for this kind of test. Use a parameterized test. To do so, we use the following steps:
^
|1|5|Replace the default runner using the annotation @RunWith|
|2|11 - 12|Add a public static method annotated with @Parameters that returns a Collection|
|3|13 - 20|Build a collection where each entry is an array of values|
|4|27 - 30|Add a constructor that takes parameters whose types are compatible with the values in the arrays stored in the collection and store the values passed|
|5|32 - 35|Add a single test method that uses those values passed in to the constructor|

That's a lot of steps. Here's an example:
**BlankLineParameterizedTest.java**
```java
01: package com.objectmentor.parameterized;
02: 
03: import static org.junit.Assert.assertEquals;
04: 
05: import java.util.ArrayList;
06: import java.util.Collection;
07: 
08: import junit.framework.JUnit4TestAdapter;
09: 
00: import org.junit.Test;
01: import org.junit.runner.RunWith;
02: import org.junit.runners.Parameterized;
03: import org.junit.runners.Parameterized.Parameters;
04: 
05: @RunWith(Parameterized.class)
06: public class BlankLineParameterizedTest {
07:     public static junit.framework.Test suite() {
08:         return new JUnit4TestAdapter(BlankLineParameterizedTest.class);
09:     }
10: 
11:     @Parameters
12:     public static Collection data() {
13:         ArrayList<Object[]> values = new ArrayList<Object[]>();
14:         values.add(new Object[] { "", true });
15:         values.add(new Object[] { "  \t   ", true });
16:         values.add(new Object[] { "   ", true });
17:         values.add(new Object[] { "\n", true });
18:         values.add(new Object[] { "a", false });
19:         values.add(new Object[] { "    q", false });
20:         return values;
21:     }
22: 
23:     public final static String regex = "^\\s*$";
24:     String line;
25:     boolean expectedResult;
26: 
27:     public BlankLineParameterizedTest(String line, boolean expectedResult) {
28:         this.line = line;
29:         this.expectedResult = expectedResult;
30:     }
31: 
32:     @Test
33:     public void checkPattern() {
34:         assertEquals(expectedResult, line.matches(regex));
35:     }
36: }
```

[<--Back]({{ site.pagesurl}}/TDD_Example_Catalog)
