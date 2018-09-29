---
title: Template Method Pattern Hints
---

* Create an abstract base class called `BinaryOperator`
* It should implement the `Operator` interface
* Copy th method from one of the existing binary operator class, e.g., `Add::execute`
* Put the result calculation it its own step, e.g., `calculate(BigDecimal lhs, BigDecimal rhs)`, as an abstract method
* One at a time, change the implementation of the various binary operator classes
  * Extend your new abstract base calss
  * Remove their `execute` method
  * Implement the `calcualte` method
  * Remove the implementation of the `Operator` interface
  * Check your tests

### Example of BinaryOperator
```java
public abstract class BinaryOperator implements Operator {
    @Override
    public void execute(RpnStack values) {
        BigDecimal rhs = values.pop();
        BigDecimal lhs = values.pop();
        
        BigDecimal result = calculate(lhs, rhs);
        
        values.push(result);
    }

    abstract BigDecimal calculate(BigDecimal lhs, BigDecimal rhs);
}
```

### Example of Add
```java
public class Add extends BinaryOperator {
    @Override
    BigDecimal calculate(BigDecimal lhs, BigDecimal rhs) {
        return lhs.add(rhs);
    }
}
```
