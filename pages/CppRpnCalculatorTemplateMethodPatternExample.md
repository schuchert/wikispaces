---
title: CppRpnCalculatorTemplateMethodPatternExample
---
[[RpnCalculatorCppExampleImplementation|<--Back]]
## Template Method Pattern Example
Review the method BinaryOperator::execute. Notice how it is concrete, but it refers to a method called executeImpl, which is declared pure virtual. That's the extension point. Review Plus, Minus, Multiply, Divide to see how each extends the base class by only implementing the method executeImpl.

**Note**: All of the classes in this section are subclasses of MathOperator, which is a base class for strategies. BinaryOperator uses template method, so this is an implementation of a strategy that uses the template method pattern.

**BinaryOperator.h**
```cpp
# ifndef BINARYOPERATOR_H
# define BINARYOPERATOR_H

# include "MathOperator.h"

class BinaryOperator: public MathOperator {
public:
   ~BinaryOperator();
   virtual void execute(OperandStack &stack);

protected:
   virtual int executeImpl(int lhs, int rhs) = 0;

};
# endif
```

**BinaryOperator.cpp**
```cpp
# include "BinaryOperator.h"

# include "OperandStack.h"

BinaryOperator::~BinaryOperator() {
}

void BinaryOperator::execute(OperandStack& stack) {
   int rhs = stack.pop();
   int lhs = stack.pop();
   int result = executeImpl(lhs, rhs);
   stack.enter(result);
}
```

**Why Use Template Method Pattern?**
Every binary operator follows the same pattern:
* Retrieve the right-hand-side of the operator
* Retrieve the left-hand-side of the operator
* Calculate a result
* Push the result back on the stack

Rather than duplicate the first, second and fourth line, push the responsibility of the 3rd line to an abstract (pure virtual) method/extension point. The subclasses write only one line. It reduces duplication and avoids violating the DRY principle.

**Divide.cpp**
```cpp
int Divide::executeImpl(int lhs, int rhs) {
   return lhs / rhs;
}
```

**Minus.cpp**
```cpp
int Minus::executeImpl(int lhs, int rhs) {
   return lhs - rhs;
}
```

**Multiply.cpp**
```cpp
int Multiply::executeImpl(int lhs, int rhs) {
   return lhs * rhs;
}
```

**Plus.cpp**
```cpp
int Plus::executeImpl(int lhs, int rhs) {
   return lhs + rhs;
}
```

[[RpnCalculatorCppExampleImplementation|<--Back]]