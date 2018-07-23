---
title: scala.example.rpn
---
I'm back to learning Scala. I'm starting with [[Rpn+Calculator.WithRefactoringAndPatterns]]. Here are a few examples of the code I've create. I'd appreciate feedback of any kind.

SpecTest looks nice as do Scala specs. I wanted a basic unit testing framework and it turns out the number of moving parts for Java is small, so I'm using it and I"ll be using scala specs for more rejection-check orientation.

//**RpnCalculatorShould.scala**//
```scala
package ex
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.CoreMatchers.is
import org.junit.Assert.assertThat
import org.junit.Before
import org.junit.Test

class RpnCalculatorShould {
  var calculator: RpnCalculator = null
  
  @Before
  def init = {
    calculator = new RpnCalculator
  }

  @Test
  def addTwoNumbers = {
    calculator.receive("3")
    calculator.receive("0")
    calculator.perform("enter")
    calculator.receive("4")
    calculator.perform("+")
    assertThat(calculator.xRegister, is(equalTo("34")))
  }

  @Test
  def subtractTwoNumbers = {
    calculator.receive("3")
    calculator.receive("0")
    calculator.perform("enter")
    calculator.receive("4")
    calculator.perform("-")
    assertThat(calculator.xRegister, is(equalTo("26")))
  }

  @Test
  def calculateTheFactorialOf5As120 {
    calculator.receive("5")
    calculator.perform("!")
    assertThat(calculator.xRegister, is(equalTo("120")))
  }

  @Test
  def calculateDivideCorrectly() {
    calculator.receive("3")
    calculator.receive("0")
    calculator.perform("enter")
    calculator.receive("4")
    calculator.perform("/")
    assertThat(calculator.xRegister, is(equalTo("7.5")))
  }

  @Test
  def calculateMultiplyCorrectly() {
    calculator.receive("3")
    calculator.receive("0")
    calculator.perform("enter")
    calculator.receive("4")
    calculator.perform("*")
    assertThat(calculator.xRegister, is(equalTo("120")))
  }
}
```

//**MathOperator.scala**//
```scala
package ex

abstract class MathOperator {
  def apply(values: RpnStack)
}
```

//**BinaryMathOperator.scala**//
```scala
package ex

import java.math.BigDecimal

class BinaryOperator(private val expression: (BigDecimal, BigDecimal) => BigDecimal) extends MathOperator {
  def apply(values: RpnStack) = {
    val rhs = values.pop
    val lhs = values.pop
    values push expression(lhs, rhs)
  }
}
```

//**RealOperatorFactory.scala**//
```scala
package ex

object RealMathOperatorFactory extends MathOperatorFactory {
  var operatorsByName = Map[String, MathOperator](
    "enter" -> new Enter,
    "+" -> new BinaryOperator((lhs, rhs) => lhs.add(rhs)),
    "-" -> new BinaryOperator((lhs, rhs) => lhs.subtract(rhs)),
    "!" -> new Factorial,
    "/" -> new BinaryOperator((lhs, rhs) => lhs.divide(rhs)),
    "*" -> new BinaryOperator((lhs, rhs) => lhs.multiply(rhs)))

  def apply(operatorName: String) = operatorsByName(operatorName)
}
```

//**RpnCalculator.scala**//
```scala
package ex

import java.math.BigDecimal

class RpnCalculator(private val factory: MathOperatorFactory) {
  def this() = this(RealMathOperatorFactory)

  val values = new RpnStack

  def receive(number: String) = {
    var current = values.pop.toPlainString
    current += number
    values push new BigDecimal(current)
  }

  def perform(operatorName: String) = factory(operatorName)(values)

  def xRegister() =  values.top.toPlainString
}
```

//**RpnStack.scala**//
```scala
package ex

import java.math.BigDecimal

import scala.collection.mutable.Stack

class RpnStack {
  def pop() = if(values.size > 0) values pop else BigDecimal.ZERO
  def top() = if(values.size > 0) values top else BigDecimal.ZERO
  def push(number: BigDecimal) = values push number
  def size() = values size
  
  val values = Stack[BigDecimal]();
}
```