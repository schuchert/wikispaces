---
Title: Open/Closed Exercise Hints
---

### Example of before/after test
The tests will all be converted to using the new API of the calculator. One way to do that is below in the after example.

**Test Example Before Applying OCP**
```java
    @Test
    public void addsNumbersCorrectly() {
        calculator.enter(BigDecimal.valueOf(13));
        calculator.enter(BigDecimal.valueOf(-2));
        calculator.add();
        assertEquals(BigDecimal.valueOf(11), calculator.x());
    }
```

**Test Example After Applying OCP**
```java
    @Test
    public void addsNumbersCorrectly() {
        calculator.enter(BigDecimal.valueOf(13));
        calculator.enter(BigDecimal.valueOf(-2));
        calculator.execute("add");
        assertEquals(BigDecimal.valueOf(11), calculator.x());
    }
```

Notice, you can do this in small steps. Assuming adding `execute(String)`, you could:
* Update `addsNumbersCorrectly` to call a new, as yet undefined method.
  * Another reasonable apporach is to create a new test rather than change an exsiting test
* Add the missing method
* The first version simply calls the add method:
```java
public void execute(String operatorName) {
    add();
}
* Find other tests that use the `add()` method and update them to instead call `execute("add")`
* Update another operator, say `subtract`.
* Update the `execute` method:
```java
public void execute(String operatorName) {
    if("add".equals(operatorName))
        add();
    if("subtract".equqls(operatorName))
        subtract();
}
* Update all uses of the `subtract()` method.
* Continue until none of the named operator methods are used in the test.
* Make those named operator methods private to confirm they are no longer used.

### Example of test for unknown operators
Every solution introduces problems. The change in the API of the `RpnCalculator` introduces 
a few issues:
* We've replaced compile-time checking with either no checking or runtime checking
* A simple error like `Add` versus `add` might be hard to notice

While this is not "the final" version, we can begin to address some of these things
with some tests. Here's one such test that at least addresses mis-named operators.

```java
    @Test
    public void handlesUnknownOperator() {
        String badOperatorName = "--BOGUS--";

        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> calculator.execute(badOperatorName)
        );

        assertEquals("Operator: '" + badOperatorName + "' does not exist", illegalArgumentException.getMessage());
    }
```
