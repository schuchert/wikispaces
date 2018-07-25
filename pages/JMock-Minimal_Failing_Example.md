---
title: JMock-Minimal_Failing_Example
---
[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)

```java
@Test
public void aTestThatAlwaysFails() {
    context.checking(new Expectations() {
        {
        }
    });
    testDoubleDie.roll();
}
```

Why does this fail? Assuming two things:
* This test class is annotated with @RunWith(JMock.class)
* The object testDoubleDie was created by a jMock Mockery

The any use of any method not explicitly stated in the Expectations will cause an unexpected invocation.

[<--Back]({{site.pagesurl}}/TDD_Example_Catalog) 
