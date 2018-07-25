---
title: Full_Coverage_when_Expecting_an_Exception
---
[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)

In JUnit 4 we might write the following:
```java
@Test(expected=RuntimeException.class)
public void methodThatWeExpectAnException() {
    throw new RuntimeException();
}
```

This test will pass. Yes it's trivial, of course it would pass. (In reality the single line of code would instead send a message to some object that ultimately would need to generate a RuntimeException for a "real" test to pass.) Fine. That's not the point.

So what's the problem with this? Nothing, except that some coverage tools will report the last "line" (the close curly-brace) as not being covered since we did not exit the method cleanly.

Here's a way to rewrite the above test so that you can assure coverage:
```java
@Test
public void methodThatWeExpectWillThrowAnException() {
    boolean expectedThrown = false;

    try {
        throw new RuntimeException();
    } catch (RuntimeException e) {
        expectedThrown = true;
    }

    assertTrue(expectedThrown);
}
```

This version is a bit longer, isn't it? 

Here are some comments I'd like to hear from you:
* Is it any better?
* Does is express our intent any better?
* Isn't it just silly to run coverage tools on your test code?
* Is anybody having Pascal flashbacks? (If you don't get this question...you poor &*$^@~).

[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)
