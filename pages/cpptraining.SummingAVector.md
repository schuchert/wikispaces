---
title: cpptraining.SummingAVector
---
{:toc}
[<-- Back]({{ site.pagesurl}}/CppTraining#vector)

# Overview
This is a series of examples that demonstrate how to get the sum of a vector of primitives, then objects, and finally shared pointers to objects. It starts with one typical way of accomplishing the task. It then goes into several more examples. The final example will probably seem like quite a huge leap over the next to last example. At that point, there will be another series of examples that builds up to that final example.

# Requirements
These examples use The Eclipse CDT, mingw, CppUTest 2.1 and gcc 4.4. If you need to setup the entire environment, here are those steps:
* [Getting The CDT Running]({{ site.pagesurl}}/cpptraining.GettingStartedWithEclipseCdt)
* [Getting CppUTest Compiled Using CDT Tool Set]({{ site.pagesurl}}/cpptraining.GettingCppUTestCompiledUsingCDTToolSet)
* [Getting CppUTest Running]({{ site.pagesurl}}/cpptraining.GettingCppUTestRunning)
* [Getting and Building Boost in minggw]({{ site.pagesurl}}/cpptraining.GettingAndBuildingBoostInMingw)
* [Using Boost With mingw And Eclipse]({{ site.pagesurl}}/cpptraining.UsingBoostWithMingwAndEclipse)
* [Configuring gcc to use C++0x in Eclipse Cdt]({{ site.pagesurl}}/cpptraining.ConfiguringGccToUseCpp0xInEclipseCdt)

# Getting Started
Here is a trivial example of creating a sum over a vector of ints:
//**SummingVectorOfInts.cpp**//
{% highlight cpp %}
# include <vector>

# include <CppUTest/TestHarness.h>

TEST_GROUP(vector_ints) {
};

typedef std::vector<int> v_ints;
typedef v_ints::iterator iterator;

TEST(vector_ints, manually) {
  v_ints values;

  values.push_back(1);
  values.push_back(5);
  values.push_back(7);

  int result = 0;

  for(iterator i = values.begin(); i != values.end(); ++i)
    result += *i;

  LONGS_EQUAL(13, result);
}
{% endhighlight %}

This first example simply demonstrates the mechanics of manually summing up the values of integers. The final result looks quite a bit different. Before we even get there, however, let's move on to vectors with objects rather than primitives.

## Vector of Objects
Here is the same thing with a vector of objects:

//**SummingVectorExample1.cpp**//
{% highlight cpp %}
# include <algorithm>
# include <vector>

# include <CppUTest/Testharness.h>

struct Value_1 {
  Value_1(int v) : v(v) {}
  int v;
};

typedef std::vector<Value_1> v_Value_1;
typedef v_Value_1::iterator iterator;

TEST_GROUP(SummingVectorsExample1) {
};

TEST(SummingVectorsExample1, manual_sum) {
  v_Value_1 values;

  values.push_back(Value_1(1));
  values.push_back(Value_1(7));
  values.push_back(Value_1(5));

  int result = 0;

  for(iterator i = values.begin(); i != values.end(); ++i)
    result += (*i).v;

  LONGS_EQUAL(13, result);
}
{% endhighlight %}

This code seems barely different enough to warrant a whole example. Even so, I'm trying to show the background material you'll need to know to understand the final version. There are several steps along the way.

## Using accumulate with vector of ints
The standard library includes  std::accumulate that accomplishes what we've already shown with std::for_each. Back to primitives before moving to the object:
**//AccumulateVectorOfInts.cpp**//
{% highlight cpp %}
# include <numeric>
# include <vector>

# include <CppUTest/TestHarness.h>

TEST_GROUP(accumulate_vector) {
};

typedef std::vector<int> v_ints;
typedef v_ints::iterator iterator;
TEST(accumulate_vector, of_ints) {
  v_ints values;

  values.push_back(1);
  values.push_back(5);
  values.push_back(7);

  int result = std::accumulate(
      values.begin(),
      values.end(),
      0
  );

  LONGS_EQUAL(13, result);
}
{% endhighlight %}

How does this work? Accumulate iterates over each element of the collection. On the first iteration it adds the "seed" value, which is 0, to the first value in the vector, which is 1. 0 + 1 -> 1, which becomes the new seed value. On the second loop, the seed value is 1, and the second value is 5. 5 + 1 -> 6, which becomes the new seed value. On the final time through the loop, the value 6 is added to the final value in the collection, 7. 6 + 7 -> 13.

In fact, the underlying algorithm uses + to add the values. The seed value is an int. The vector contains ints. The built-in + operator takes two ints and returns an int, so everything works as expected.

## Using accumulate with vectors of objects with custom operator+
Now that you've seen the basic algorithm, let's move on to a vector of objects:
//**SummingVectorsExample2.cpp**//
{% highlight cpp %}
# include <numeric>
# include <vector>

# include <CppUTest/Testharness.h>

struct Value_2 {
  Value_2(int v) : v(v) {}
  int v;
};

typedef std::vector<Value_2> v_Value_2;
typedef v_Value_2::iterator iterator;


int operator+(const int &sum, const Value_2 &current) {
  return sum + current.v;
}

TEST_GROUP(SummingVectorsExample2) {
};

TEST(SummingVectorsExample2, usingAccumulate) {
  v_Value_2 values;

  values.push_back(Value_2(1));
  values.push_back(Value_2(7));
  values.push_back(Value_2(5));

  int result = std::accumulate(
      values.begin(),
      values.end(),
      0
   );
  LONGS_EQUAL(13, result);
}
{% endhighlight %}

The accumulate algorithm needs a + operator that can take the seed value (an int in this case), and a value from the vector (a Value_2 object), add the results and return a value eequivalent to the seed type. That's what this function does:
{% highlight cpp %}
int operator+(const int &sum, const Value_2 &current) {
  return sum + current.v;
}
{% endhighlight %}
This certainly works, but can we do any better than having to write a function? This seems like a common problem.
## Using accumulate with vectors of objects with conversion operator
Another option is to provide a conversion operator. Since we are doing something simple, adding ints, this happens to work:
//**SummingVectorsExample3.cpp**//
{% highlight cpp %}
# include <algorithm>
# include <vector>

# include <CppUTest/Testharness.h>

struct Value_3 {
  Value_3(int v) : v(v) {}
  operator int() { return v; }
  int v;
};

typedef std::vector<Value_3> v_Value_3;
typedef v_Value_3::iterator iterator;

TEST_GROUP(SummingVectorsExample3) {
};

# include <numeric>
TEST(SummingVectorsExample3, usingAccumulate) {
  v_Value_3 values;

  values.push_back(Value_3(1));
  values.push_back(Value_3(7));
  values.push_back(Value_3(5));

  int result = std::accumulate(
      values.begin(),
      values.end(),
      0
   );
  LONGS_EQUAL(13, result);
}
{% endhighlight %}

This works, as mentioned, because all the code is trying to sum on ints stored in an object. However, a conversion operator only works if there's only one way to get an appropriate value. If there were two int values, which would the conversion operator return? There are ways to make that work, but there's an even better way.
## Using accumulate and calling a member
This is going to be a bit of a leap. After this, there's a series of much smaller steps showing how to get to the final version.
//**SummingVectorsExample4.cpp**//
{% highlight cpp %}
# include <algorithm>
# include <vector>
# include <numeric>
# include <boost/bind.hpp>

# include <CppUTest/Testharness.h>

struct Value_4 {
  Value_4(int v) : v(v) {}
  int getValue() { return v; }
  int v;
};

typedef std::vector<Value_4> v_Value_4;
typedef v_Value_4::iterator iterator;

TEST_GROUP(SummingVectorsExample4) {
};

TEST(SummingVectorsExample4, usingAccumulate) {
  v_Value_4 values;

  values.push_back(Value_4(1));
  values.push_back(Value_4(7));
  values.push_back(Value_4(5));

  int result = std::accumulate(
      values.begin(),
      values.end(),
      0,
      boost::bind(std::plus<int>(), _1, boost::bind(&Value_4::getValue, _2))
   );
  LONGS_EQUAL(13, result);
}
{% endhighlight %}

What?! This is the large leap mentioned above. In a nutshell, the code passes in a function object, std::plus<int>(), that takes 2 parameters. The first parameter, being the seed (or sum), which is an int, is handled as is (_1). The second parameter is acquired by calling the instance member Value_4::getValue().

That complex expresion is a composition of function objects.
# Building up to the Complex Composition & Beyond
The final version is a huge jump from the immediately proceeding version. How can we go from one to the next?

## This is Where C++0x comes into play
These next examples use type inference, one of the features in C++0x. If you followed the steps mentioned above, you'll be able to take this code as is and get it to compile. (All of the examples here come from compiling code with all of the tests passing.)

## The Infrastructure
First, the top of the source file:
{% highlight cpp %}
# include <boost/bind.hpp>
# include <numeric>
# include <boost/shared_ptr.hpp>
# include <CppUTest/TestHarness.h>

using boost::bind;

struct Value {
  Value(int v) : v(v) {}
  int getValue() const { return v; }
  operator int() { return v; }
  int v;
};

TEST_GROUP(plusAndBind) {
};
{% endhighlight %}

Notice that the Value class has both getValue() and operator int(). The conversion operator (operator int()) is used in one of the examples but not the final version.)

## Calling the functor Directly
This first test demonstrates simply calling add with two arguments:
{% highlight cpp %}
TEST(plusAndBind, callDirectly) {
  Value v(42);
  std::plus<int> add;
  int result = add(10, v.getValue());
  LONGS_EQUAL(52, result);
}
{% endhighlight %}
This works because// **std::plus**// implements// **operator()**//. This is significant because when an instance of// **std::plus**// is passed into a template method, the template method can execute it as if it were a function. Consider the following:
{% highlight cpp %}
int foo(int a, int b) {
  return a + b;
}

int bar() {
  return foo(10, 42);
}

int baz() {
  int (*f_pointer)(int,int) = foo;
  return f_pointer(10, 42);
}

int muchBetter() {
  std::plus<int> functor;
  return functor(10, 42);
}
{% endhighlight %}
Initially, theres a definition for// **foo**//, which simply adds two values. The function// **bar**// calls// **foo**// directly. The function// **baz**// creates a pointer to a function, called// **f_pointer**//, and initializes it with// **foo**//. It then calls// **foo**// through the pointer to a function.

The function// **muchBetter**// demonstrates the same thing using a functor,// **std::plus**//, that has an// **operator()**// as part of its definition.

Why all of this background? Well what if I have the following template method:
{% highlight cpp %}
template<class F> int execute(F f) {
  return f(10, 42);
}

void callBoth() {
  execute(foo);
  execute(std::plus<int>());
}
{% endhighlight %}
This template method,// **execute**//, imposes one requirement on its type F; Instances of f must respond to// **operator()**//. A function like// **foo**// does, as demonstrated in the first line of// **callBoth**//. The instance of the functor// **std::plus<int>**// also responds to// **operator()**//. This code compiles and defines two implementations of the// **execute**// function.
## Binding Both Parameters
Notice how the template method// **execute**// hard-codes the values of the parameters called on either// **foo**// or// **std::plus<int>**//? This is called [Currying](http://en.wikipedia.org/wiki/Currying). This code demonstrates the same thing using// **boost::bind**//:
{% highlight cpp %}
TEST(plusAndBind, bindBothParameters) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, 10, v.getValue());
  int result = functor();
  LONGS_EQUAL(52, result);
}
{% endhighlight %}
The call to// **boost::bind**// creates an instance of a functor, which is stored in a type-inferred variable called functor (this name is meant to be self-explaining, but is otherwise not significant). This instance internally stores three things:
* A copy of add
* A copy of 10
* A copy of the result of calling v.getValue(), or 42.

Since the two parameters required by std::plus have been stored internally, executing// **functor**// requires no parameters.
## Binding the second parameter
What if we want to bind the second parameter, but allow the first one to be provided by the caller:
{% highlight cpp %}
TEST(plusAndBind, bindSecondParameter) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, _1, v.getValue());
  int result = functor(10);
  LONGS_EQUAL(52, result);
}
{% endhighlight %}
This accomplishes that. Note that we could use std::bind1st. I prefer boost::bind because it's more general and works well with other parts of the boost library. In this case, the object returned from bind:
* Stores add
* Stores _1, which really means use the first parameter passed into the call of operator()
* Stores the result of calling v.getValue(), which is 42.

Notice the call to// **functor(10)**//. 10 is the first, and only, parameter. The expression _1 from before will bind to that value.
## Binding no parameters
What if you want to just simply wrap the// **std::plus<int>**// instance:
{% highlight cpp %}
TEST(plusAndBind, doNotBindAnyParameters) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, _1, _2);
  int result = functor(10, v.getValue());
  LONGS_EQUAL(52, result);
}
{% endhighlight %}
This example does that. This time, the return from// **bind**//:
* Stores add
* Stores _1, which will bind to the first parameter passed into// **operator()**//
* Stores _2, which will bind to the second parameter passed into// **operator()**//

Notice the call to// **functor(10, 42)**//. 10 is the first parater, which binds to _1. 42 is the second parameter, which binds to _2.
## Binding the second parameter to a method call
Now things get more complex, and realistic. Rather than calling v.getValue() directly, we'll instead provide a binding to a call to v.getValue(). The call to v.getValue() was happening// **before**// the creation of the functor, in fact, even before the call to// **boost::bind**//. Now it will happen// **after**// the creation of the functor. In fact, it will be called// **during**// the execution of operator():
{% highlight cpp %}
TEST(plusAndBind, bind2ndParameterToMethodCall) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, _1, bind(&Value::getValue, _2));
  int result = functor(10, v);
  LONGS_EQUAL(52, result);
}
{% endhighlight %}
As before, the functor returned from// **bind**//:
* Stores add
* Stores _1, which is a reference the the first parameter passed into operator()
Now, however, it also stores the result of// **bind(&Value::getValue, _2)**//, which is functor object that:
* Stores a pointer to a member function, Value::getValue
* Refers to _2, which is the second parameter passed in to the outer-most call of// **operator()**//.

This is a game-changer. Notice that rather than calling// **functor(10, v.getValue())**//, this is instead calling// **functor(10, v)**//. When the// **operator()**// method executes, it binds 10 to _1. It binds the result of calling// **operator()**// on// **bind(&Value::getValue, _2)**// to _2. So here's what happens (not necessarily in this order):
* The// **operator()**// function first associates 10 with _1 (in reality, _1 is itself a function objects that accesses the first parameter passed into the// **operator()**// method).
* The// **operator()**// function calls// **operator()**// on the functor returned from the inner-most call to// **bind**//. This calls the method// **Value::getValue**// on v, which returns 42 from v. This value, 42, is associated with the final version of _2.
* 10 and 42 are then passed into//**std::plus<int>::operator()**//, which returns 52.
## How you're probably write this in practice
This is how you'd probably write this in practice:
{% highlight cpp %}
TEST(plusAndBind, theWholeThingInline) {
  Value v(42);
  auto functor = bind(std::plus<int>(), _1, bind(&Value::getValue, _2));
  int result = functor(10, v);
  LONGS_EQUAL(52, result);
}
{% endhighlight %}
## Return to// **accumulate**//
With that background, we can now return to// **accumulate**// on an array of Value objects:
{% highlight cpp %}
TEST(plusAndBind, accumulateAnArrayOfValues) {
  std::plus<int> add;
  Value values[] = { Value(10), Value(42) };

  int result = std::accumulate(
      values,
      values + sizeof(values)/sizeof(values[0]),
      0,
      add
  );

  LONGS_EQUAL(52, result);
}
{% endhighlight %}
This invocation of// **std::accumulate**// makes use of the conversion operator// **Value::operator int()**//. As mentioned above, this is not what we want to do. We want to call a method on each instance of value in the array, choses at the time the call to// **std::accumulate**// occurs. However, you already know how to do this from the immediately proceeding example.
## Back to the final solution
Here's the merging of these two results together:
{% highlight cpp %}
TEST(plusAndBind, accumulateOnArrayUsingBind) {
  auto functor = bind(std::plus<int>(), _1, bind(&Value::getValue, _2));
  Value values[] = { Value(10), Value(42) };

  int result = std::accumulate(
      values,
      values + sizeof(values)/sizeof(values[0]),
      0,
      functor
  );

  LONGS_EQUAL(52, result);
}
{% endhighlight %}

In practice, using a temporary is not how you'd probably write this code:
{% highlight cpp %}
TEST(plusAndBind, accumulateHowYoudProbablyWriteIt) {
  Value values[] = { Value(10), Value(42) };

  int result = std::accumulate(
      values,
      values + sizeof(values)/sizeof(values[0]),
      0,
      bind(std::plus<int>(), _1, bind(&Value::getValue, _2))
  );

  LONGS_EQUAL(52, result);
}
{% endhighlight %}
# Working with vectors of shared_ptr
Let's look at one final example. Imagine you want to have a vector of dynamically-allocated objects. Instead of storing raw pointers, you might think to use some kind of smart pointer, such as// **std::auto_ptr**//. However, you cannot put// **std::auto_pointer**// into standard collections. So instead, you decide to use// **boost::shared_ptr**//. Here's a final example that does all of that:
{% highlight cpp %}
# include <vector>
# include <boost/shared_ptr.hpp>

typedef boost::shared_ptr<Value> sp_Value;
typedef std::vector<sp_Value> vsp_Value;

TEST(plusAndBind, vsp_Value) {
  vsp_Value values;

  values.push_back(sp_Value(new Value(10)));
  values.push_back(sp_Value(new Value(42)));

  int result = std::accumulate(
      values.begin(),
      values.end(),
      0,
      bind(std::plus<int>(), _1, bind(&Value::getValue, _2))
  );

  LONGS_EQUAL(52, result);
}
{% endhighlight %}
This is a place where// **boost::bind**// shines over// **std::bind1st**// (or// **std::bind2nd**//). It's smart enough to just work in this situation. This example is packed with a lot of details:
* Using typedefs to give (hopefully) better names to types.
* Dynamic allocation without an apparent deallocation by using// **boost::shared_ptr**//
* Function currying and nesting
* An actual, executing and passing unit test.
# The Whole File
Each of these examples are pulled from one larger, compiling C++ source file. Here's the whole file:
//**PlusAndBindTest.cpp**//
{% highlight cpp %}
# include <boost/bind.hpp>
# include <numeric>
# include <boost/shared_ptr.hpp>
# include <CppUTest/TestHarness.h>

using boost::bind;

struct Value {
  Value(int v) : v(v) {}
  int getValue() const { return v; }
  operator int() { return v; }
  int v;
};

TEST_GROUP(plusAndBind) {
};

TEST(plusAndBind, callDirectly) {
  Value v(42);
  std::plus<int> add;
  int result = add(10, v.getValue());
  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, bindBothParameters) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, 10, v.getValue());
  int result = functor();
  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, bindSecondParameter) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, _1, v.getValue());
  int result = functor(10);
  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, doNotBindAnyParameters) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, _1, _2);
  int result = functor(10, v.getValue());
  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, bind2ndParameterToMethodCall) {
  Value v(42);
  std::plus<int> add;
  auto functor = bind(add, _1, bind(&Value::getValue, _2));
  int result = functor(10, v);
  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, theWholeThingInline) {
  Value v(42);
  auto functor = bind(std::plus<int>(), _1, bind(&Value::getValue, _2));
  int result = functor(10, v);
  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, accumulateAnArrayOfValues) {
  std::plus<int> add;
  Value values[] = { Value(10), Value(42) };

  int result = std::accumulate(
      values,
      values + sizeof(values)/sizeof(values[0]),
      0,
      add
  );

  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, accumulateOnArrayUsingBind) {
  auto functor = bind(std::plus<int>(), _1, bind(&Value::getValue, _2));
  Value values[] = { Value(10), Value(42) };

  int result = std::accumulate(
      values,
      values + sizeof(values)/sizeof(values[0]),
      0,
      functor
  );

  LONGS_EQUAL(52, result);
}

TEST(plusAndBind, accumulateHowYoudProbablyWriteIt) {
  Value values[] = { Value(10), Value(42) };

  int result = std::accumulate(
      values,
      values + sizeof(values)/sizeof(values[0]),
      0,
      bind(std::plus<int>(), _1, bind(&Value::getValue, _2))
  );

  LONGS_EQUAL(52, result);
}

# include <vector>
# include <boost/shared_ptr.hpp>
typedef boost::shared_ptr<Value> sp_Value;
typedef std::vector<sp_Value> vsp_Value;
TEST(plusAndBind, vsp_Value) {
  vsp_Value values;

  values.push_back(sp_Value(new Value(10)));
  values.push_back(sp_Value(new Value(42)));

  int result = std::accumulate(
      values.begin(),
      values.end(),
      0,
      bind(std::plus<int>(), _1, bind(&Value::getValue, _2))
  );

  LONGS_EQUAL(52, result);
}
{% endhighlight %}

[<-- Back]({{ site.pagesurl}}/CppTraining#vector)
