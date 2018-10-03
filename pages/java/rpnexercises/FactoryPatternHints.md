---
title: Factory Method Exercise Hints
---

The `eecute` method in `RpnCalculator` violates the Single Responsibility Principle.
It does different things that change for different reasons.
* Locate an operator given a name, e.g., add, factorial
  Or provide a reasonable error if not found
* Execute the found operator

Breaking these two things into separate responsibilities, e.g., methods, cleans up the code.

Once you've made this improvement, a next step might be to pull the location
responsibility into its own class.

This becomes a factory for operators. The `RpnCalculator` deletages the lookup
of a operator name to the factory, then sends `execute` to an operator.

For this to work easily, it helps that we've already introduced the Strategy Pattern
in the from of a `Operator` interface.

A good end result for `RpnCalculator::execute` could be:
^
```java
public void execute(String operatorName) {
    Operator op = factory.operatorFor(operatorName);
    op.execute(values);
}
```

Things to do:
* Initially re-write the excute method to separate lookup from execution.
* Extract lookup into its own method
* Create a new class called `OperatorFactory
  * It is possible to move the lookup method with refactoring tools
* The OperatorFactory holds the `Map<String, Operator>` field
* The factory pre-poulate the `map` with all of the operators
* Replace the `map` field in RpnCalculator with the an instance of `OperatorFactory`
* Re-write the execute method to use the factory and execute the method as shown above

As a bonus, you can use a library like [Class Graph](https://github.com/classgraph/classgraph)
to dynamically find the classes. Later versions of this project do that.

