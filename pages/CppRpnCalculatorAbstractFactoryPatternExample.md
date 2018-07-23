---
title: CppRpnCalculatorAbstractFactoryPatternExample
---
[[RpnCalculatorCppExampleImplementation|<--Back]]

## Abstract Factory Pattern Example
This section has an example of an abstract factory and two concrete implementations. The abstract factory returns math operators used by a calculator. The operators are examples of the Strategy pattern, aka function object, functor. 

Here's the abstract factory class:
**MathOperatorFactory.h**
```cpp
# ifndef MATHOPERATORFACTORY_H
# define MATHOPERATORFACTORY_H

class MathOperator;

# include <string>

class MathOperatorFactory
{
public:
   MathOperatorFactory();
   virtual ~MathOperatorFactory();
   virtual MathOperator& getOperatorNamed(const std::string& operatorName) = 0;
};

# endif
```

**MathoOperatorFactory.cpp**
```cpp

# include "MathOperatorFactory.h"

MathOperatorFactory::MathOperatorFactory(void)
{
}

MathOperatorFactory::~MathOperatorFactory(void)
{
}
```

Here's a basic factory that provides MathOperators using conditional and static variables within a method:
**IfBasedMathOperatorFactory.cpp**
```cpp
# include "IfBasedMathOperatorFactory.h"
# include "Plus.h"
# include "Minus.h"
# include "Multiply.h"
# include "Divide.h"
# include "Factorial.h"

IfBasedMathOperatorFactory::IfBasedMathOperatorFactory(){}

IfBasedMathOperatorFactory::~IfBasedMathOperatorFactory(){}

MathOperator &IfBasedMathOperatorFactory::getOperatorNamed(const std::string &operatorName) {
   static Plus plus;
   static Minus minus;
   static Divide divide;
   static Multiply multiply;
   static Factorial factorial;

   if("+" == operatorName)
      return plus;

   if("-" == operatorName)
      return minus;

   if("*" == operatorName)
      return multiply;

   if("!" == operatorName)
      return factorial;

   if("/" == operatorName)
      return divide;
}
```

And here's one that uses words like "plus" and "factorial" instead of "+" and "!":
**FullyNamedMathOperatorFactory**
```cpp
# include "FullyNamedMathOperatorFactory.h"

# include "Plus.h"
# include "Minus.h"
# include "Multiply.h"
# include "Divide.h"
# include "Factorial.h"

FullyNamedMathOperatorFactory::FullyNamedMathOperatorFactory(void) {
   nameToOperator["plus"] = new Plus();
   nameToOperator["minus"] = new Minus();
   nameToOperator["divide"] = new Divide();
   nameToOperator["multiply"] = new Multiply();
   nameToOperator["factorial"] = new Factorial();
}

FullyNamedMathOperatorFactory::~FullyNamedMathOperatorFactory(void) {
   for(MapType::iterator iter = nameToOperator.begin(); iter != nameToOperator.end(); ++iter)
      delete (*iter).second;
}

MathOperator &FullyNamedMathOperatorFactory::getOperatorNamed(const std::string &operatorName) {
   MathOperator *mathOperator = nameToOperator[operatorName];
   return  *mathOperator;
}

```
[[RpnCalculatorCppExampleImplementation|<--Back]]