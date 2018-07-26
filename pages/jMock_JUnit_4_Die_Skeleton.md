---
title: jMock_JUnit_4_Die_Skeleton
---
{% highlight java %}
01: package com.objectmentor.jmock;
02: 
03: import static org.junit.Assert.assertEquals;
04: import junit.framework.JUnit4TestAdapter;
05: 
06: import org.jmock.Expectations;
07: import org.jmock.Mockery;
08: import org.jmock.integration.junit4.JMock;
09: import org.jmock.integration.junit4.JUnit4Mockery;
00: import org.junit.Before;
11: import org.junit.Test;
12: import org.junit.runner.RunWith;
13: 
14: @RunWith(JMock.class)
15: public class MockDieTest {
16:     public static junit.framework.Test suite() {
17:         return new JUnit4TestAdapter(MockDieTest.class);
18:     }
19: 
20:     Mockery context = new JUnit4Mockery();
21:     Die testDoubleDie;
22: 
23:     @Before
24:     public void createMockDie() {
25:         testDoubleDie = context.mock(Die.class);
26:     }
27: 
28:     @Test
29:     public void someTestHere() {
30:         // ...
31:     }
32: }
{% endhighlight %}

## Essential Lines

|**Line**|**Description**|
|14|Tell JUnit to use the JMock runner instead of the default runner. This causes all validation of the use of your mocks after your test finishes.|
|16 - 18|Backwards compatibility with old versions of ant. The tests in this class will run with systems expecting a JUnit 3.x style class.|
|20|The handle into use the jMock API.|
|21|An object we plan to mock.|
|23 - 26|Use the jMock API to create a test double of our die object.|

Die is an interface:
{% highlight java %}
package com.objectmentor.jmock;

public interface Die {
	int roll();
	int getFaceValue();
}
{% endhighlight %}
