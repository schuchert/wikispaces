---
title: cpptraining.dependencyinjection.dicegame.templatearguments
---
## Version 1
One template parameter, LoadedDie that can return two values.


## Version 2
In this version, the Dice Game takes two template parameters. Notice that because of this, we cannot put them into a vector.

//**DiceGame_TwoTemplateParametersTest.h**//
{% highlight cpp %}
#include <CppUTest/TestHarness.h>

#include "DiceGame_TwoTemplateParameters.h"

template<int v1>
class HardCodedDie {
public:
  void roll() {}
  int faceValue() {
    return v1;
  }
};

TEST_GROUP(DiceGame_TwoTemplateParameters) { };

TEST(DiceGame_TwoTemplateParameters, WinningShouldIncreaeBalance) {
  DiceGame_TwoTemplateParameters<HardCodedDie<4>> diceGame;
  diceGame.play();
  LONGS_EQUAL(1, diceGame.getBalance());
}

TEST(DiceGame_TwoTemplateParameters, LosingShouldDecreaseBalance) {
  DiceGame_TwoTemplateParameters<HardCodedDie<3>> diceGame;
  diceGame.play();
  LONGS_EQUAL(-1, diceGame.getBalance());
}

TEST(DiceGame_TwoTemplateParameters, PushShouldLeaveBalanceUnchanged) {
  DiceGame_TwoTemplateParameters<HardCodedDie<3>, HardCodedDie<4>> diceGame;
  diceGame.play();
  LONGS_EQUAL(0, diceGame.getBalance());
}
{% endhighlight %}

//**DiceGame_TwoTemplateParameters.h**//
{% highlight cpp %}
#pragma once

#include "Die.h"
#include <vector>

template<class T1=Die, class T2=T1>
class DiceGame_TwoTemplateParameters {
public:
  DiceGame_TwoTemplateParameters();
  ~DiceGame_TwoTemplateParameters();
  void play();
  int getBalance() const { return balance; }

private:
  T1 d1;
  T2 d2;
  int balance;
};

template<class T1, class T2>
DiceGame_TwoTemplateParameters<T1, T2>::DiceGame_TwoTemplateParameters() : balance(0) {
}

template<class T1, class T2>
DiceGame_TwoTemplateParameters<T1, T2>::~DiceGame_TwoTemplateParameters() {
}

template<class T1, class T2>
void DiceGame_TwoTemplateParameters<T1, T2>::play() {
  d1.roll();
  d2.roll();
  int total = d1.faceValue() + d2.faceValue();
  if(total > 7)
    ++balance;
  else if(total < 7)
    --balance;
}
{% endhighlight %}

## Version 3
In this version, the LoadedDie are instead "LoadedDieWithTwoAlternatinvValues", where the two values are template parameters. The DiceGame takes one template parameter.
//**DiceGame_UsingTemplatesTest.cpp**//
{% highlight cpp %}
#include <CppUTest/TestHarness.h>

#include "DiceGame_UsingTemplates.h"

template<int v1, int v2 = v1>
class LoadedDieWithTwoAlternativingValues {
public:
  LoadedDieWithTwoAlternativingValues() {
    values[0] = v1;
    values[1] = v2;
  }

  void roll() {}

  int faceValue() {
    return values[++count%2];
  }

private:
  static int count;
  int values[2];
};

template<int v1, int v2> int LoadedDieWithTwoAlternativingValues<v1, v2>::count = -1;

TEST_GROUP(DiceGame_UsingTemplates) { };

TEST(DiceGame_UsingTemplates, WinningShouldIncreaeBalance) {
  DiceGame_UsingTemplates<LoadedDieWithTwoAlternativingValues<4>> diceGame;
  diceGame.play();
  LONGS_EQUAL(1, diceGame.getBalance());
}

TEST(DiceGame_UsingTemplates, LosingShouldDecreaseBalance) {
  DiceGame_UsingTemplates<LoadedDieWithTwoAlternativingValues<3>> diceGame;
  diceGame.play();
  LONGS_EQUAL(-1, diceGame.getBalance());
}

TEST(DiceGame_UsingTemplates, PushShouldLeaveBalanceUnchanged) {
  DiceGame_UsingTemplates<LoadedDieWithTwoAlternativingValues<3, 4>> diceGame;
  diceGame.play();
  LONGS_EQUAL(0, diceGame.getBalance());
}
{% endhighlight %}

//**DiceGame_UsingTemplates.h**//
{% highlight cpp %}
#pragma once

#include "Die.h"
#include <vector>

template<class T=Die>
class DiceGame_UsingTemplates {
public:
  DiceGame_UsingTemplates();
  ~DiceGame_UsingTemplates();
  void play();
  int getBalance() const { return balance; }

private:
  typedef std::vector<T> DiceCollection;
  DiceCollection dice;
  int balance;
};

template<class T>
DiceGame_UsingTemplates<T>::DiceGame_UsingTemplates() : balance(0) {
  dice.push_back(T());
  dice.push_back(T());
}

template<class T>
DiceGame_UsingTemplates<T>::~DiceGame_UsingTemplates() {
}

#include <tr1/functional>
#include <numeric>
using namespace std;
using namespace tr1;
using namespace placeholders;
template<class T>
void DiceGame_UsingTemplates<T>::play() {
  for_each(dice.begin(), dice.end(), bind(&T::roll, _1));
  int total = accumulate(dice.begin(), dice.end(), 0, bind(plus<int>(), _1, bind(&T::faceValue, _2)));
  if(total > 7)
    ++balance;
  else if(total < 7)
    --balance;
}
{% endhighlight %}
