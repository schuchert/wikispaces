---
title: ruby.tutorials.tdd.UsingTddToDevelopABasicAlgorithm
---
{% include nav prev="ruby.Tutorials" %}
{% include toc %}

## Overview
This tutorial presents the mechanics of TDD, refactoring and touches on continuous integration by implementing the **[Shunting Yard Algorithm](http://en.wikipedia.org/wiki/Shunting_yard_algorithm)**. The point of this tutorial is **not** to write a solution to this algorithm. The algorithm is a vehicle for practicing the mechanics of TDD. Having said that, you will end up solving much of the algorithm.

This tutorial has been written for you to actually read and type. The [Kinesthetic Learning](http://en.wikipedia.org/wiki/Kinesthetic_learning) experience of actually typing the code, running the tests and checking in the work significantly reinforces learning habits that will serve you well. Much of what you practice in this tutorial can eventually become habit/muscle memory with enough practice. Consider this an opportunity to start. You'll get frequent feedback throughout. And while this may represent a very different way of working from what you are used to, here are a few comments:
* What you are practicing now is just something you've learned, so this really is no different.
* Try it for the duration of this tutorial. It will only be a few hours of your time, so if you find it useless after that time, stop doing it.

Good Luck!

## Introduction
Synopsis: The Shunting Yard Algorithm takes an expression in infix notation and converts it to reverse polish notation.

Here are a few examples:
^
|-|-|
|Infix |RPN |
| 1 + 3 | 1 3 + |
| 1 + 3 - 4 | 1 3 + 4 - |
| 1 + 3 * 2 | 1 3 2 * + |
| 3 + 1 * 4 - 2 / 3 | 3 1 4 * + 2 3 / - |
| a + b | a b + |
| ( 4 + 5 ) * 3 | 4 5 + 3 * |
| ( ( 1 + 3 ) / ( 9 - 5 ) ) * ( 2 + 3 ) | 1 3 + 9 5 - / 2 3 + * |
| f ( 3 ) | 3 f |
| f ( 4 , 1 , a , d ) | 4 1 a d f |
| f ( g ( ( 1 + 3 ) * 4 ) / x ( y ( z ) ) ) | 1 3 + 4 * g z y x / f |
| a = b += 5 | a b 5 += = |

To better understand the algorithm, consider spending some time reading it [here](http://en.wikipedia.org/wiki/Shunting_yard_algorithm). However, after reviewing the algorithm, you might come up with several issues that your code will need to handle. Here's a list of those issues:
#### Basics
* Read tokens from a string (assume space-separated for now)
* Return space-separated tokens in a string

#### Tokens
* Numbers/variables [e.g., 5, x]
* function calls [e.g. f(), f(3, 1), f(a, b, 3)]
* Operators

#### Operators
* unary [e.g., 3 !], binary [e.g. 4 + 5], ternary [ 5 > 3 ? a : b ]
* Might just be one, [e.g., 4 + 5], or many, [e.g. 4 * 6 / 5 + 2 ^ 6]
* Precedence, [e.g., * / before + -, before = +=]
* Operators are associative, left -> right [e.g., +], or right -> left [e.g., ^ =]

#### Parenthesis
* Used for precedence [e.g., ( 1 + 4 ) * 6]
* Used in function calls [e.g., f ( 4 , 5 ) ]

#### Expressions
* Simple expressions, [e.g., (x + y)]
* Arbitrarily nestable, [e.g., ( 8 * ( 4 + 1 ) / ( 9 - 12 ) )]
* With function calls, [e.g., f ( ( a + b ) ^ q / g ( 5, a, 1 ) )]

Even with the published algorithm, this is a lot of work. You do have the option of just coding up the algorithm as stated but will you know that it works? If you're not sure, then you'll probably want to write some tests. This approach can work and having tests is certainly better than not having tests. However, this tutorial will allow you to use Test Driven Development to approach this problem using very small steps. There are many reasons to do so:
* See results quickly
* Verify expected versus actual behavior
* Provide a form of regression to know if something you just did broke was was already working
* Check in code often so if you completely mess up, you can use the repository how it was meant to be used
* You can take breaks often, so interruptions do not impact your work as much

## Getting Started
To follow all of the steps in this tutorial you will need three things:
* A Ruby interpreter (you can type ruby at the command line and it is found or you know how to use Ruby in your favorite IDE)
* A text editor (emacs, vi, or full-features IDE's like Eclipse or IntelliJ
* A revision control tool (strictly speaking this is optional, however there will be several places where I recommend you check your work in, even if you don't normally do so, consider trying working outside of your comfort zone)

For this exercise, you're going to keep things fairly simple:
* Create a directory somewhere that can hold your Ruby source code
* In that directory, create a file called shunting_yard_algorithm_test.rb with the following contents:
{% highlight ruby %}
require 'test/unit'
class ShuntingYardAlgorithmTest < Test::Unit::TestCase
end
{% endhighlight %}

* Save that file and type "ruby shunting_yard_algorithm_test.rb":
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
F
Finished in 0.004895 seconds.
  1) Failure:
default_test(ShuntingYardAlgorithmTest) [shunting_yard_algorithm_test.rb:3]:
No tests were specified.
1 tests, 1 assertions, 1 failures, 0 errors
Macintosh-7%
{% endhighlight %}

Congratulations, you have successfully written a unit test class in Ruby. It's missing any actual test methods, and that's what this error indicates. Next, it's time to write your first test method.

## The 0th Test
You will create a test whose primary purpose is to get the production class created with its usage documented in an executable form. This first test creates a skeleton, but it's an excellent way to start because you get something created and working almost immediately. From there, it's all about adding features while keeping your code clean. It is much easier to modify something that exists than something that does not exist.

* Add a test method to get your unit test passing:
{% highlight ruby %}
  def test_empty_string_results_in_same
  end
{% endhighlight %}

{% include aside/collapsed id="rubyfileusingspaces" title="Ruby Files Use Spaces" filename="ruby.sidebar.RubyFilesUseSpaces" %}

Note: In Test::Unit, a test class must inherit from Test::Unit::TestCase and all all methods you want to be executed as test must start with the name "test".

* Run your test again:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
.
Finished in 0.000928 seconds.
1 tests, 0 assertions, 0 failures, 0 errors
Macintosh-7%
{% endhighlight %}

At this point, you have a complete test class with all of its methods passing. You want to get back to this condition frequently. You need to create a test that somehow drives the development of new production code. Every unit test you'll write will have at least three parts:
* **Setup**
Create everything necessary for a test to execute. Create instances, connect objects, put things into a well-defined, known starting point. For this exercise, you'll always start with a fresh "converter" before each test.

* **Execution**
Given a known-starting point, exercise the production code in some way with the intent of generating an expected result.

* **Validation**
You knew the starting point (you control that), you know how you exercised the production code, verify that the production code did what you expected it to do

* **Teardown**
Not always necessary, you should write your tests such that they leave no footprint that could cause other tests to fail. For this tutorial, you will not have any teardown requirements because every test will begin with an in-memory object create before **each** test executes.

You're going to take small steps to keep things running and passing often. Sometimes these small steps will seem too small. When you think that, ask yourself "compared to what?". If something is too small, that's because you're expecting to work in larger chunks. Fine, try this and see if it fits. At the end of the tutorial if you haven't warmed up to the idea, you still learned something useful.

### Setup
* Update your test to resemble the following:
{% highlight ruby %}
def test_empty_string_results_in_same
  algorithm = ShuntingYardAlgorithm.new
end
{% endhighlight %}

* Run your test (it will fail)
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
E
Finished in 0.001021 seconds.
  1) Error:
test_empty_string_results_in_same(ShuntingYardAlgorithmTest):
NameError: uninitialized constant ShuntingYardAlgorithmTest::ShuntingYardAlgorithm
    shunting_yard_algorithm_test.rb:5:in `test_empty_string_results_in_same'
1 tests, 0 assertions, 0 failures, 1 errors
Macintosh-7% 
{% endhighlight %}

Your test is back to failing. In this case, the line you just added makes reference to a class that does not exist. This is a normal occurrence in TDD - write test code to exercise production code that does not yet exist, then write just enough production code to get the test to pass.

For this first example, you can work in a single text file.

* At the top of the file add the class (here's the whole file):
{% highlight ruby %}
require 'test/unit'
class ShuntingYardAlgorithm
end
class ShuntingYardAlgorithmTest < Test::Unit::TestCase
  def test_empty_string_results_in_same
    algorithm = ShuntingYardAlgorithm.new
  end
end
{% endhighlight %}

* Run your test:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
.
Finished in 0.000778 seconds.
1 tests, 0 assertions, 0 failures, 0 errors
Macintosh-7%
{% endhighlight %}

This is all that is required for setup for this test. Next, you need to execute some code.
### Execute
* Update your test as follows:
{% highlight ruby %}
  def test_empty_string_results_in_same
    algorithm = ShuntingYardAlgorithm.new
    result = algorithm.convert('')
  end
{% endhighlight %}

* Run you test:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
E
Finished in 0.00109 seconds.
  1) Error:
test_empty_string_results_in_same(ShuntingYardAlgorithmTest):
NoMethodError: undefined method `convert' for #<ShuntingYardAlgorithm:0x53688>
    shunting_yard_algorithm_test.rb:9:in `test_empty_string_results_in_same'
1 tests, 0 assertions, 0 failures, 1 errors
Macintosh-7%
{% endhighlight %}

Once again, your test is failing. Instead of a missing class it's due to a missing method.

* Add that method to the ShuntingYardAlgorithm:
{% highlight ruby %}
class ShuntingYardAlgorithm
  def convert(expression)
  end
end
{% endhighlight %}

* Run your tests:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
.
Finished in 0.000929 seconds.
1 tests, 0 assertions, 0 failures, 0 errors
Macintosh-7%
{% endhighlight %}

Great, your test is back to working. You just finished the execution part. Now it is time to have your test verify the results it expected, and that's the next step.
### Verify
* Update your test to perform validation:

{% highlight ruby %}
  def test_empty_string_results_in_same
    algorithm = ShuntingYardAlgorithm.new
    result = algorithm.convert('')
    assert_equal('', result)
  end
{% endhighlight %}

* Run your test:

{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
F
Finished in 0.04386 seconds.
  1) Failure:
test_empty_string_results_in_same(ShuntingYardAlgorithmTest) [shunting_yard_algorithm_test.rb:12]:
<""> expected but was
<nil>.
1 tests, 1 assertions, 1 failures, 0 errors
Macintosh-7%
{% endhighlight %}

The test is back to failing. To get your test to pass, you'll simply change the ShuntingYardAlgorithm.convert method return a value that will cause the test to pass.

* Update your production code:
{% highlight ruby %}
class ShuntingYardAlgorithm
  def convert(expression)
    ''
  end
end
{% endhighlight %}

* Run your test:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
.
Finished in 0.001019 seconds.
1 tests, 1 assertions, 0 failures, 0 errors
Macintosh-7% 
{% endhighlight %}

Congratulations, you've made it through a complete TDD cycle. Now is a great time to commit this work in to a repository before moving on.
### Check In
A great time to check in is anytime your tests are passing. So after you've written a new unit test and got it to pass, check in your work. Why?
* If you mess up, you can use the revision tool to compare what you have with what was already checked in to better pinpoint the problem.
* If you subsequently mess up, you can revert back using the tool
* Other people can see your work sooner (that can be scary, but since you're writing unit tests now, you're already a leg up on the average bear)

This tutorial briefly demonstrated [git](http://git.or.cz/). I **strongly** encourage you to use some revision control tool throughout. This goes back to learning by doing. Thinking about doing this will not activate your brain in the same way doing it will. If you want more details on using git, read [the git tutorial](http://www.kernel.org/pub/software/scm/git/docs/gittutorial.html).

* Add this directory into a revision control system and make sure it is checked in:
{% highlight terminal %}
Macintosh-7% git init
Initialized empty Git repository in /Users/schuchert/src/ruby/tutorial1/.git/
Macintosh-7% git add shunting_yard_algorithm_test.rb 
Macintosh-7% git commit
Created initial commit 043d347: initial checkin
 1 files changed, 15 insertions(+), 0 deletions(-)
 create mode 100644 shunting_yard_algorithm_test.rb
Macintosh-7% 
{% endhighlight %}

### Summary
Here's what you have created so far:
{% highlight ruby %}
require 'test/unit'

class ShuntingYardAlgorithm
  def convert(expression)
    ''
  end
end

class ShuntingYardAlgorithmTest < Test::Unit::TestCase
  def test_empty_string_results_in_same
    algorithm = ShuntingYardAlgorithm.new
    result = algorithm.convert('')
    assert_equal('', result)
  end
end
{% endhighlight %}

This probably seems small, however you have described the API of the class used to translate between an infix and RPN notation.

In addition, you practiced Martin's three laws of TDD (paraphrased):
* Write no production code without a failing test
* Write only enough of a test so that it fails
* Write only enough production code to make the test pass

This is what you did.
* You first created a basic unit test that referred to a missing class (laws 1 and 2)
* You added a basic definition of that missing class for the test to pass (law 3)
* You sent that new class a message that it did not yet implement (laws 1 and 2)
* You then added that missing method without a body (law 3)
* You added a check to your unit test to make sure your results were as expected (laws 1 and 2) - they were not
* You hard-coded the method to actually return a value to make the test pass (law 3)

Now is a great time to take a break.

## Test: Constants
Now you'll work with both constants and basic operators like + and -. As you work though these next few examples, you'll end up writing code, changing it and cleaning it up. You will be adding refactoring to your tool set. This particular kind of refactoring might vary from your refactoring experiences. You will be performing simple refactoring that takes seconds and minutes not hours, days or weeks.

* Add a new test to your test class (the location is irrelevant, however for your purposes consider adding new test methods after the last test added):
{% highlight ruby %}
  def test_constant_value_results_in_same
    algorithm = ShuntingYardAlgorithm.new
    result = algorithm.convert('42')
    assert_equal('42', result)
  end
{% endhighlight %}

Notice that it was OK to write this entire test before stopping to check. The test does not add any new methods to the existing class. Indeed, going forward with this example you can write complete test methods. This is because the thing you are writing has a simple API. Even so, eventually your test writing will get to this point on any unit under test.

* Run your tests:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb   
Loaded suite shunting_yard_algorithm_test
Started
F.
Finished in 0.01324 seconds.
  1) Failure:
test_constant_value_results_in_same(ShuntingYardAlgorithmTest) [shunting_yard_algorithm_test.rb:19]:
<"42"> expected but was
<"">.
2 tests, 2 assertions, 1 failures, 0 errors
Macintosh-7%
{% endhighlight %}

The new test fails but the original test is intact. Now you need find a way to change the production code such that you do not break existing tests and make the new test pass.

There are a few more things to consider:
* The order in which tests execute is, by design, unknown. This means you should write tests independently of each other. If there is a need for common setup, there are ways to accomplish that.
* Try to avoid backtracking. Break no existing tests. Why? A test describes a contract or a promise of a certain behavior. Breaking a test, while sometimes necessary, should be carefully considered.

* In this case, it is a simple change to support the old test, and get the new test passing. Make the following change:
{% highlight ruby %}
class ShuntingYardAlgorithm
  def convert(expression)
    expression
  end
end
{% endhighlight %}

* Run your tests to make sure things pass:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
..
Finished in 0.001374 seconds.
2 tests, 2 assertions, 0 failures, 0 errors
Macintosh-7%
{% endhighlight %}

Congratulations, you've just made it through another application of the three laws of TDD. Since all tests are passing, now is a great time to check in your work.

* So, check in your work already::
{% highlight terminal %}
Macintosh-7% git add shunting_yard_algorithm_test.rb
Macintosh-7% git commit
Created commit a284610: Added support for constants
 1 files changed, 7 insertions(+), 1 deletions(-)
Macintosh-7%
{% endhighlight %}
### Refactor The Unit Tests
{% include aside/collapsed id="howmanysteps" title="How Many Steps Are Normal" filename="ruby.sidebar.HowManyStepsAreNormal" %}

* Update your unit test by adding a setup method:
{% highlight ruby %}
  def setup
    @algorithm = ShuntingYardAlgorithm.new
  end
{% endhighlight %}

* Run your tests to verify you have not broken anything:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
..
Finished in 0.001487 seconds.
2 tests, 2 assertions, 0 failures, 0 errors
Macintosh-7%
{% endhighlight %}

* Now update the first test to use the @algorithm instance variable:
{% highlight ruby %}
  def test_empty_string_results_in_same
    @algorithm = ShuntingYardAlgorithm.new
    result = @algorithm.convert('')
    assert_equal('', result)
  end
{% endhighlight %}

* Run your tests to verify you have not broken anything:
{% highlight ruby %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
..
Finished in 0.001463 seconds.
2 tests, 2 assertions, 0 failures, 0 errors
Macintosh-7%
{% endhighlight %}

* Notice that both tests do the same thing. Write a support method that does the same thing:
{% highlight ruby %}
  def assert_expression_becomes(expression, expected)
    result = @algorithm.convert(expression)
    assert_equal(expected, result)
  end
{% endhighlight %}

* Run your tests to verify you have not broken anything:
{% highlight ruby %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
..
Finished in 0.00145 seconds.
2 tests, 2 assertions, 0 failures, 0 errors
Macintosh-7%
{% endhighlight %}

* Use this new support method in the first test:
{% highlight ruby %}
  def test_empty_string_results_in_same
    assert_expression_becomes('', '')
  end
{% endhighlight %}

* Run your tests to verify you have not broken anything:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
..
Finished in 0.001443 seconds.
2 tests, 2 assertions, 0 failures, 0 errors
Macintosh-7% 
{% endhighlight %}

* Finally update your second test to use this support method:
{% highlight ruby %}
  def test_constant_value_results_in_same
    assert_expression_becomes('42', '42')
  end
{% endhighlight %}

* Run your tests to verify you have not broken anything:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
..
Finished in 0.001236 seconds.
2 tests, 2 assertions, 0 failures, 0 errors
Macintosh-7% 
{% endhighlight %}

Congratulations, you're done refactoring (for now) and the tests are passing. (Are you thinking "time to check in?")

Here is the whole thing after these steps:
{% highlight ruby %}
require 'test/unit'
class ShuntingYardAlgorithm
  def convert(expression)
    expression
  end
end
class ShuntingYardAlgorithmTest < Test::Unit::TestCase
  def setup
    @algorithm = ShuntingYardAlgorithm.new
  end
  def assert_expression_becomes(expression, expected)
    result = @algorithm.convert(expression)
    assert_equal(expected, result)
  end
  def test_empty_string_results_in_same
    assert_expression_becomes('', '')
  end
  def test_constant_value_results_in_same
    assert_expression_becomes('42', '42')
  end
end
{% endhighlight %}

* Finally, now is a great time to check in your work with a comment like "Removed duplication in the test code."
{% highlight terminal %}
Macintosh-7% git add .
Macintosh-7% git commit
Created commit bec791e: Removed duplication in the test code.
 1 files changed, 11 insertions(+), 6 deletions(-)
Macintosh-7% 
{% endhighlight %}

{% include aside/collapsed id="refactoring" title="Refactoring" filename="ruby.sidebar.Refactoring" %}

Now is a great time to kick back, listen to some tunes, get a glass of ice tea and add TDD to your resume.

## Test: An Actual Operator
Now seems like a good time to test a complete expression. This test represents a "happy path", or a path through the system that generates a good result. At some point you'll need to consider negative tests so you can define how an invalid use of the system behaves (gracefully somehow, hopefully).

Now you'll add a test of addition:
{% highlight ruby %}
  def test_adding_two_values()
    assert_expression_becomes('1 + 3', '1 3 +')
  end
{% endhighlight %}

{% include aside/collapsed id="parens" title="Ruby and Parens" filename="ruby.sidebar.RubyAndParens" %}

* Run your tests to see how it fails:
{% highlight terminal %}
Macintosh-7% ruby shunting_yard_algorithm_test.rb
Loaded suite shunting_yard_algorithm_test
Started
F..
Finished in 0.013613 seconds.
  1) Failure:
test_adding_two_values(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:16:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:28:in `test_adding_two_values']:
<"1 3 +"> expected but was
<"1 + 3">.
3 tests, 3 assertions, 1 failures, 0 errors
Macintosh-7%
{% endhighlight %}

This result makes sense, your method returns the value passed, so now you'll actually have to write some code to do some work. However, you need to keep existing tests working at the same time. For a simple first version, how about splitting the expression into its parts and then you'll simply write the operator last:
{% highlight ruby %}
class ShuntingYardAlgorithm
  def convert(expression)
    @result = ''
    expression.split(' ').each { |t|
      if t =~ /^\d+$/
        @result << ' ' << t
      else
        @operator = t
      end
    }
    if @operator != nil
      @result << ' ' << @operator
    end
    @result
  end
end
{% endhighlight %}

This is a big jump from nothing. This indicates that maybe the test that does too much more more than what was already there, or maybe you missed a simpler opportunity. However, this is actually what I did the second time I tried this so you get to follow the same course.

Of course, this doesn't work.

* Running your tests, you'll notice the following errors:
{% highlight terminal %}
<"1 3 +"> expected but was
<" 1 3 +">.
  2) Failure:
test_constant_value_results_in_same(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:30:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:38:in `test_constant_value_results_in_same']:
<"42"> expected but was
<" 42">.
{% endhighlight %}

Not only did this not fix the problem, it broke an existing test. You have two choices, try again, or fix it quickly. In this case, you can change one thing to actually fix both tests:
{% highlight ruby %}
      if t =~ /^\d+$/
        @result << ' ' if @result.length > 0
        @result << t
      else
{% endhighlight %}
* Run your tests and you'll notice all tests are passing.

Now is a good time to check in your work because you need to do some serious cleanup on this code. It is very ugly, unruly and generally messy. However, all the tests pass. It'd be a shame if you forgot to check in and then made a mistake.

* Check in your code. Really!

#### Refactoring Your Mess
You have three lines that write to the @result instance variable. You can quickly fix this by adding a method to add to the result:
{% highlight ruby %}
  def add_to_result(token)
    @result << ' ' if @result.length > 0
    @result << token
  end
{% endhighlight %}

* Add this method and make sure your tests still pass before you actually use this method. (When refactoring, generally, add first.)

* Once your tests are passing, update the method to the following:
{% highlight ruby %}
  def convert(expression)
    @result = ''
    expression.split(' ').each { |t|
      if t =~ /^\d+$/
        add_to_result(t)
      else
        @operator = t
      end
    }
    if @operator != nil
      add_to_result(@operator)
    end
    @result
  end
{% endhighlight %}

* Verify your tests still pass

The first "if" is obtuse. You can write this so someone can understand its meaning without having to read regular expressions (personally, I like regular expressions, but I also use a vi plugin in Eclipse, so you can imagine that I'm not quite wired right).

* Add the following method (again, adding before changing existing code):
{% highlight ruby %}
  def is_number(token)
      token =~ /^\d+$/
  end
{% endhighlight %}

* Run your tests to make sure nothing has broke.

* Now, update the original "if" statement to use this method:
{% highlight ruby %}
      if is_number(t)
        add_to_result(t)
      else
   ...
{% endhighlight %}

The previous two refactorings are examples of "Extract Method" as described in Refatoring by Fowler. This is a bread-n-butter refactoring. You should use this refactoring freely. Do not concern yourself with method invocation overhead. It is not going to be a problem in practice.

In addition, taking even simple, but certainly complex conditions and putting them into a method can make your code much easier to read and maintain. This is one of those refactorings you should consider nearly all the time.

* Use a ruby idiom to improve adding the operator at the end:
#### From:
{% highlight ruby %}
    if @operator != nil
      add_to_result(@operator)
    end
{% endhighlight %}
#### To:
{% highlight ruby %}
    add_to_result(@operator) if @operator != nil
{% endhighlight %}

* Extract the token processing into its own method (extract method again) by first adding a new method:
{% highlight ruby %}
  def process(token)
    if is_number(token)
      add_to_result(token)
    else
      @operator = token
    end
  end
{% endhighlight %}

* Run your tests to make sure you did not break anything

* Update the original code to use this new method:
{% highlight ruby %}
  def convert(expression)
    @result = ''
    expression.split(' ').each { |t| process(t) }
    add_to_result(@operator) if @operator != nil
    @result
  end
{% endhighlight %}
* Run your tests and make sure things still work.

* Since you are back to everything working, check your work in. Go ahead and do it, the tutorial will be here when you get back.

#### Summary
Here's another important observation about refactoring. Consider extract method. In general, you should use the following steps:
* Create a new method by **copying** the original code
* Make sure the code compiles and the tests pass
* Use the new method in the original code
* Make sure the code compiles and the tests pass

In general, when refactoring use create by "copying, verify, update, verify" instead of move. It's less error prone. Yes you will appear to move slower, but often the way to speed up is by slowing down. If you have effective refactoring tools, then extract method becomes:
* Select a block of code
* Refactor it by using a shortcut key - you may have been tempted to use the mouse, stop it. Mouse bad.

Now is a great time to take a break. You've made good progress. You've practiced another round of TDD, added some solid refactoring skills and refined your continuous practice.

## Test: Two Operators, Same Precedence
You handled one operator pretty easily. What happens when you put in two operators of the same precedence? You want to nudge your production code gradually. Going from 1 to more than 1 is often a good nudge (though it can be a big nudge at times). However, does this mean using the same operator two times? If you do that, it might make the results ambiguous. So this tests will use two different operators to make the results unambiguous.

* Create the following test:
{% highlight ruby %}
  def test_two_operators_same_precedence()
    assert_expression_becomes('1 + 3 - 4', '1 3 + 4 -')
  end
{% endhighlight %}

* Run your tests and notice that the results are close but not quite correct. The current implementation drops the +. To fix this, the code needs to write the current operator, if there is one, when it encounters the second operator:
{% highlight ruby %}
  def process(token)
    if is_number(token)
      add_to_result(token)
    else
      add_to_result(@operator) if @operator != nil
      @operator = token
    end
  end
{% endhighlight %}

By simply adding the current operator if it is non-null, your code should now be able to handle an expression of any length so long as the operators are of the same precedence. Of course, you have some code duplication. Run your tests to make sure they pass.

* Now is a great time to check your work it because you are about to refactor. Go ahead, it should only take a second.

{% include aside/collapsed id="checkinisslow" title="Check-in is Slow" filename="ruby.sidebar.CheckingInIsSlow" %}

* Create a new method that writes the current operator if it is not null:
{% highlight ruby %}
  def add_operator_if_necessary
    add_to_result(@operator) if @operator != nil
  end
{% endhighlight %}

* Verify that your test still pass (they should, you've only added a method you have not changed existing code).

* Update the process method to use this new method and run your tests.

* Update the convert method to use this new method and run your tests.

Congratulations, you've successfully removed duplication and kept your tests passing. You've now practiced enough refactoring to add it to your resume. After all, you're practicing RDD - resume-driven-development.

* Now is a great time to check in your work.

## Test: Two Operators of Different Precedence
The next nudge to your production code is adding the idea of precedence. You won't implement all of the rules yet, just a start. The first test will simply add a new operator, *, which, because of its higher precedence, results in something close to your previous test. **Then** the next test will change the order of the operators, with * after +, forcing a more serious change to your implementation.

Rather than giving you the source for the tests, I'll use a neat feature that allows me to draw some LaTex style formulas.

* Create the following test: $$ 1\ *\ 3\ +\ 2\ \ \rightarrow \ \ 1\ 3\ *\ 2\ + $$ 

* Run your tests. What happens?

Notice that this test passed as is. This means one of the following things:
* The test does not exercise anything new and it can probably be removed
* You wrote too much production code and happened to get it right
* You were not sure about an "edge" condition and this test verifies that the edge condition is handled (or simply does not exist)

In this case, I gave you a poor test. Maybe I though we were adding support for a new operator, but the original code defaulted to thinking something was an operator if it wasn't a number. The result of this particular test does not force any changes since the code interprets * as an operator and the algorithm writes the stored operator all the time. So you need to change the test. By the way, what's a good name for this test? Did you consider something like test_two_operators_lower_precedence_operator_first?

Here's something a very different test from the first: $$ 1\ +\ 3\ *\ 2\ \ \rightarrow \ \ 1\ 3\ 2\ *\ + $$ 

Notice that if you follow traditional precedence rules, multiplication happens before addition. So by writing a test with addition before multiplication, it will force your production code to hold on to the + operator longer. Did you notice that whereas the previous results contained an operator embedded within the numbers, now both operators are at the end, with the first one ending up last (very different indeed).

* Write this as a test:
{% highlight ruby %}
  def test_two_operators_lower_precedence_first
    assert_expression_becomes('1 + 3 * 2', '1 3 2 * +')
  end
{% endhighlight %}

* Run this test and you'll notice the following failure:
{% highlight terminal %}
  1) Failure:
test_two_operators_lower_precedence_first(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:45:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:65:in `test_two_operators_lower_precedence_first']:
<"1 3 2 * +"> expected but was
<"1 3 + 2 *">.
{% endhighlight %}

### Detour: Refactoring Before Moving Forward
Rather than always writing a non-nil operator, your code needs to check something. However, there are cases where your code can just write and some where it must hold onto two operators before writing any. To support both cases, you'll want to change from storing a single operator to storing more than one. This requires a refactoring and you should do this while tests are passing.

Often, you'll look at a solution, realize that its design is at the end of its life-cycle and it needs significant retooling. How do you know you have changed the design without breaking any assumptions? You keep the tests passing! So you'll get the current failing test out of the way for right now:
* Rename the test to _test_two_operators_lower_precedence_first and verify that all your tests pass (by renaming this, it is not longer treated as a test)

* Next, you need to create an array to hold the operators. This is a refactoring so you are going to **add** code first and then update it. My colleague Bob K calls this "Parallel Development".

* Update the convert method to initialize an array @operators:
{% highlight ruby %}
  def convert(expression)
    @result = ''
    @operators = []
    ...
{% endhighlight %}

* Run your tests, they should all still pass.

* Update the process method to duplicate the work of storing the operator:
{% highlight ruby %}
  def process(token)
    if is_number(token)
      add_to_result(token)
    else
      add_operator_if_necessary
      @operator = token
      @operators << token
    end
  end
{% endhighlight %}

* Run your test, they should all still pass.

* Next, update the add_operator_if_necessary method to use the new instance variable:
{% highlight ruby %}
  def add_operator_if_necessary
    add_to_result(@operators.pop) if @operators.length > 0
  end
{% endhighlight %}

* Run your tests and notice that nothing is broken. You've moved from adding mode to updating mode.

* Finally, remove all references to @operator (there should be just one in @process):
{% highlight ruby %}
  def process(token)
    if is_number(token)
      add_to_result(token)
    else
      add_operator_if_necessary
      @operators << token
    end
  end
{% endhighlight %}

* Run your tests and verify that nothing is broken

* Now is a great time to check in your work. So go ahead and do it. It's been too long and you probably had an itchy checkin finger.

With that refactoring, you can now store multiple operators if necessary. So this diversion is over; time get back to the new test.

### End Construction: Back to new development
Now that your code has a mechanism in place that allows storage of more than one operator, you need to undo some work that I asked you to do.

* Re-rename the test _test_two_operators_lower_precedence_first by removing the _ at its beginning

* Run your tests and you should be back to one broken test.

Your code has a slight problem; it needs to know the current operator in add_operator_if_necessary to know if it should add the token to the array or directly store it into the result. However, if the code requires the current operator, you can no longer use it in the convert algorithm. For now you will change the process method and leave that method alone - this happens often. You combined two lines of code because they were the same. Now they need to diverge, so you'll allow them to. Along the way, you'll change some method names as appropriate to better reflect their intent.

To fix this, you'll write out higher-precedence operators in the array:
* Here's a first attempt:
{% highlight ruby %}
  def process(token)
    if is_number(token)
      add_to_result(token)
    else
      if token == '*'
        add_to_result(token)
      else
        @operators << token
      end
    end
  end
{% endhighlight %}

However, this does not fix anything and in fact breaks another test. If you have been checking in, now would be a great time to revert back to the previous version. If not, why didn't you? This is a great example of allowing a tool to extend your functionality. You can probably undo your work and you have unit tests to verify that you did so. However, how many undos are necessary? Versus one command using a reasonable revision control tool.

* Let's try that again. This time, you'll try updating the process method a little bit differently:
{% highlight ruby %}
  def process(token)
    if is_number(token)
      add_to_result(token)
    else
      if @operators.length > 0 &&
        precedence_of(token) <= precedence_of(@operators.last)
        add_operator_if_necessary
      end
      @operators << token
    end
  end
  def precedence_of(operator)
    case operator
      when '*': 10
      else 1
    end
  end
  def add_operator_if_necessary
    add_to_result(@operators.pop) while @operators.length > 0
  end
{% endhighlight %}

* Run your tests and you notice that everything passes.

You have passing tests, but ugly code. Now is a good time to check in because you're going to do some refactoring to clean up this code.

* Checkin your code. Remember, if you don't like working this way, you can always stop doing it after this tutorial. This is just practice anyway, so it won't count and the other developers won't chastise you for moving their cheese.

* Begin by extracting a method to clean up process a bit. Add this method and make sure nothing breaks:
{% highlight ruby %}
  def add_higher_precedence_operators_to_result(token)
    if @operators.length > 0 && 
      precedence_of(token) <= precedence_of(@operators.last)
      add_operator_if_necessary
    end
  end
{% endhighlight %}

* Next, replace the original code with a call to this method. Run your tests to make sure things are still working:
{% highlight ruby %}
  def process(token)
    if is_number(token)
      add_to_result(token)
    else
      add_higher_precedence_operators_to_result(token)
      @operators << token
    end
  end
{% endhighlight %}

* While you are at it, extract two more methods: handle_number, handle_operator to clean this code up:
{% highlight ruby %}
  def process(token)
    if is_number(token)
      handle_number(token)
    else
      handle_operator(token)
    end
  end
  def handle_number(number)
      add_to_result(number)
  end
  def handle_operator(operator)
      add_higher_precedence_operators_to_result(operator)
      @operators << operator
  end
{% endhighlight %}

* Run your tests, they should be passing.

Check: Did you first add the methods, run your test then change the original code to use the new methods and run your tests again? If not, why not? Sure, you probably got it right. You won't always. Make it a habit, maybe you'll be too busy to bite your fingernails.

* Did you notice that the method add_operator_if_necessary was using an "if" and now it is using a "while"? You should rename it to: add_remaining_operators (you need to change three places to get this to work).

* Run your tests, they should be passing.

* While you are at it, the first two lines of the convert method are really performing initialization. Factor those out into an init method:
{% highlight ruby %}
  def init
    @result = ''
    @operators = []
  end
{% endhighlight %}

* Run your tests, make sure nothing broke.

* Now update the convert method to use your new init method:
{% highlight ruby %}
  def convert(expression)
    init
    ...
  end
{% endhighlight %}

* Run your tests to make sure nothing is broken.

* Finally, there is another opportunity to extract a method. Add yet another method:
{% highlight ruby %}
  def convert_expression(expression)
    expression.split(' ').each { |t| process(t) }
    add_remaining_operators
  end
{% endhighlight %}

* Make sure your tests are still passing.

* Update the convert method:
{% highlight ruby %}
  def convert(expression)
    init
    convert_expression(expression)
    @result
  end
{% endhighlight %}

* After your tests are all passing, check your work in before moving on.

### Summary
You've just done quite a bit of refactoring and basic cleanup. The description of what you did probably too longer to read than the actual work. Constant cleaning up on the new code you write should just be a normal thing you do. Get into the habit. And seriously, add refactoring to your resume.

Here's an example of what your file might look like:
{% highlight ruby %}
require 'test/unit'

class ShuntingYardAlgorithm
  def convert(expression)
    init
    convert_expression(expression)
    @result
  end

  def convert_expression(expression)
    expression.split(' ').each { |t| process(t) }
    add_remaining_operators
  end

  def init
    @result = ''
    @operators = []
  end

  def process(token)
    if is_number(token)
      handle_number(token)
    else
      handle_operator(token)
    end
  end

  def handle_number(number)
      add_to_result(number)
  end

  def handle_operator(operator)
      add_higher_precedence_operators_to_result(operator)
      @operators << operator
  end

  def add_higher_precedence_operators_to_result(token)
    if @operators.length > 0 &&
      precedence_of(token) <= precedence_of(@operators.last)
      add_remaining_operators
    end
  end

  def precedence_of(operator)
    case operator
      when '*': 10
      else 1
    end
  end
  def add_remaining_operators
    add_to_result(@operators.pop) while @operators.length > 0
  end

  def is_number(token)
      token =~ /^\d+$/
  end

  def add_to_result(token)
    @result << ' ' if @result.length > 0
    @result << token
  end
end

class ShuntingYardAlgorithmTest < Test::Unit::TestCase
  def setup
    @algorithm = ShuntingYardAlgorithm.new
  end

  def assert_expression_becomes(expression, expected)
    result = @algorithm.convert(expression)
    assert_equal(expected, result)
  end

  def test_empty_string_results_in_same
    assert_expression_becomes('', '')
  end

  def test_constant_value_results_in_same
    assert_expression_becomes('42', '42')
  end

  def test_adding_two_values()
    assert_expression_becomes('1 + 3', '1 3 +')
  end

  def test_two_operators_same_precedence()
    assert_expression_becomes('1 + 3 - 4', '1 3 + 4 -')
  end

  def test_two_operators_lower_precedence_first
    assert_expression_becomes('1 + 3 * 2', '1 3 2 * +')
  end
end
{% endhighlight %}

## Test: More than two operators
So far you've handled a single operator and up to two operators and some basic precedence rules. Now you need to make sure you can handle an arbitrary length expression and a few new operators. While not always the case, here's a hierarchy of difficulty:
* Not handling something to handling one such something.
* Handling, more than one something (maybe just two) - often adds an "if" somewhere
* Handling many somethings - often converts an "if" to a "while" - something I heard Uncle Bob say in one of his TDD tutorials

* Create a test for the following: $$ 3\ +\ 1\ *\ 4\ -\ 2\ /\ 3\ \ \rightarrow \ \ 3\ 1\ 4\ *\ +\ 2\ 3\ /\ - $$ 

* Execute the test to see how your algorithm responds. You should see a failure similar to this:
{% highlight terminal %}
  1) Failure:
test_several_operators_mixed_precedence(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:73:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:97:in `test_several_operators_mixed_precedence']:
<"3 1 4 * + 2 3 / -"> expected but was
<"3 1 4 * + 2 - 3 /">.
{% endhighlight %}

* A quick review of how the code determines operator precedence suggests adding '/' into the mix:
{% highlight ruby %}
  def precedence_of(operator)
    case operator
      when '*': 10
      when '/': 10
      else 1
    end
  end
{% endhighlight %}

* Run your tests, and now they pass.

* Check in your code since you are back to passing tests

Did you consider that your code really didn't do very much to handle this case? It is possible that you wrote too much production code? The add_remaining_operators uses a while instead of an if. If it only had an if, it would only write at most one operator. Because it uses a while, it writes several. So you probably overdid it a bit (or rather you trusted me and I led you astray). How could you check this? Change the while to an if and see if any of the tests fail. You might have just gotten lucky. But the only way you'll know for sure is if you experiment. Change something, run your tests. If none of them fail, then your tests are not covering all that your code does.

However, it looks like you've got a decent general solution. You'll need to register operators you care about in the precedence_of method, which is a violation of the open/closed principle, which is covered in detail in a later tutorial. Before you can call this algorithm finished, however, you need to address several more things:
* Handling variables, e.g., a + 5
* Handling ()'s
* Function calls and nested function calls, e.g., f(g(5))

## Test: Handling Variables
It is time to revisit an earlier test, only this time you'll use variables: $$ a\ +\ b\ \ \rightarrow \ \ a\ b\ + $$ 
* Create this as a test and see how the test fails.

* You should see something similar to:
{% highlight terminal %}
  1) Failure:
test_adding_variables(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:74:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:102:in `test_adding_variables']:
<"a b +"> expected but was
<"a + b">.
{% endhighlight %}

A quick review of the process_expression method shows that the code looks for numbers first. If a token is not a number then it is an operator. By default, unlisted operators have the same precedence, so nothing happens. The code needs to change. You can make a quick change by changing the is_number method.

* Rename is_number to is_operand.

* Verify that your tests still fail as expected

* Change the is_operand method to include a pattern for variables:
{% highlight ruby %}
  def is_operand(token)
      token =~ /^(\d+|[a-zA-Z0-9$_]+)$/
  end
{% endhighlight %}
So something is an operand if it is a sequence of digits of length 1 or more or a sequence of one or more letters, numbers, $ and _.

* Run your tests, things should be passing.

* Check in your code since you are back to passing tests.

## Test: Handling ()
In this section you'll start by properly parsing parenthesis. Then you'll make sure that ()'s work with simple expressions and finally you'll make sure that ()'s cause lower precedence operators to happen before higher-precedence operators.

{% include aside/collapsed id="whatisanalysis" title="What is Analysis" filename="ruby.sidebar.WhatIsAnalysis" %}

### Test: Removing ()
Begin by writing a test that verifies the removal of ()'s from an otherwise empty expression: $$ (\ )\ \ \rightarrow $$

* Create this test, run your unit tests and verify that they fail.

* You can fix this and follow the current approach used in the class by making a change to process and adding a few methods:
#### process
{% highlight ruby %}
  def process(token)
    if is_paren(token)
      handle_paren(token) 
    elsif is_operand(token)
      handle_number(token)
    else
      handle_operator(token)
    end
  end
{% endhighlight %}
#### new methods
{% highlight ruby %}
  def is_paren(token)
    token =~ /[\(\)]/
  end
  def handle_paren(token)
  end
{% endhighlight %}

* Run your tests and notice that everything is now passing.

* Check your work in.

{% include aside/collapsed id="toomuchprodcode" title="Too Much Production Code?" filename="ruby.sidebar.DIdYouJustWriteTooMuchProductionCode" %}

### Test: () around expression works
Next, verify that ()'s around an expression still works.  $$ (\ 4\ *\ a\ )\ \ \rightarrow \ \ 4\ a\ * $$ 

* Create this test and see whether it works or not.

Since this appears to work, you might consider whether keeping this test is useful or not. It does not exercise any new code and it does not document some kind of edge condition (it doesn't exercise any new equivalence classes). Given that this test does now really add any new knowledge, you'll remove it and instead write a more complex test. Get used to taking some blind alleys, the blinder the alley, the more illuminating, ultimately, it will be.

### Test: () around expression causes lower precedence operator to happen first
Here is a key test that should exercise something new: $$ (\ 4\ +\ 5\ )\ *\ 3\ \rightarrow \ 4\ 5\ +\ 3\ * $$ 
This demonstrates the whole purpose of (), change the natural precedence rules.

* Add this test, verify that the test fails.

* Here is one way to make it "work":
#### handle_paren
{% highlight ruby %}
  def handle_paren(token)
    if token == '('
      @operators << token
    else
      if @operators.last != '('
        add_to_result(@operators.pop) 
      end 
      @operators.pop
    end
  end
{% endhighlight %}

#### precedence_of
{% highlight ruby %}
  def precedence_of(operator)
    case operator
      when '(': -1
      when ')': -1
      when '*': 10
      when '/': 10
      else 1
    end
  end
{% endhighlight %}

While this does work, it seems strange to define the precedence of ()', which make things happen sooner, as -1 - or the lowest thing so far.

* Make another change to improve this somewhat:
**Update precedence_of to have larger numbers for ( and )**:
{% highlight ruby %}
  def precedence_of(operator)
    case operator
      when '(': 99
      when ')': 99
      when '*': 10
      when '/': 10
      else 1
    end
  end
{% endhighlight %}
**Update add_remaining_operators to stop at '('**:
{% highlight ruby %}
  def add_remaining_operators
    add_to_result(@operators.pop) while 
        @operators.length > 0 && @operators.last != '('
  end
{% endhighlight %}

* Make these changes, verify your tests pass.

* Check your work in.

With all tests passing, you can perform some minor plastic surgery. The @operators.length > 0 and @operators.last represent a "logical top" of the operator stack. So change the code to make it more self-describing.

* First, extract a method:
{% highlight ruby %}
  def under_logical_top
    @operators.length > 0 && @operators.last != '('
  end
{% endhighlight %}

* Verify that your tests still pass.

* Now, make one more update:
{% highlight ruby %}
  def add_remaining_operators
    add_to_result(@operators.pop) while under_logical_top
  end
{% endhighlight %}

* Run your tests and verify everything still passes.

* Check in your code.

* Next, the method handle_paren does not follow a standard ruby idiom:
{% highlight ruby %}
  def handle_paren(token)
    ...
    else
      if @operators.last != '('
        add_to_result(@operators.pop)
      end
      @operators.pop
    end
  end
{% endhighlight %}
**Replace the code in the else with the following**:
{% highlight ruby %}
      add_to_result(@operators.pop) while @operators.last != '('
      @operators.pop
{% endhighlight %}

* Run your tests, make sure everything is passing.

* Check in your code.

### Test: Nested ()'s
Moving along, you'll now have a look at supporting nested (). Here's a test to give it try: $$ (\ (\ 1\ +\ 3\ )\ /\ (\ 9\ -\ 5\ )\ )\ *\ (\ 2\ +\ 3\ )\ \ \rightarrow\ \ 1\ 3\ +\ 9\ 5\ -\ /\ 2\ 3\ +\ * $$ 

* Create this test and see what happens.

Surprisingly, this test passes. This test does not exercise any new code. However, unlike the last test, this does demonstrate some new functionality that your code happens to handle correctly, nested ()'s. So I recommend keeping this test around. This may seem like an arbitrary decision. It may be an incorrect decision. Here's an arbitrary statistic: 80% of all users never remove features from menus or tool bars. Here's another, 90% of all people don't think that the previous statistic applies to them. You're a pack-rat, admit it. You might find yourself wanting to write tests "just in case" and never get rid of them. That's OK, when it starts to cause a problem - and it will - you'll suffer and learn for yourself why you want to have as many tests as necessary, but no more.

### Summary
You've successfully added support for ()'s.
* You started with a simple case, removing (). That gave your code basic support for () so you could focus on the next small thing.
* You then worked your way up to making sure ()'s caused changed to precedence, as they are meant to do.
* The solution you developed seems to work for nested ()'s so it did not take much to make it work.

Has it been some time since you took a break? Blinked your eyes? Go outside, play some laser tag. The tutorial will be here when you get back.

## Test: Functions
Now you're going to add support for handling function calls. Functions are difficult because an operand might be a variable or a function, it depends on the next thing (or at least it does without some kind of context).

So your code either needs to look ahead when processing a token that is an operand or look behind. Looking ahead is hard because of how your code processes expressions; iterating over tokens using the each message, which doesn't have look-ahead support. Looking back is possible, but your code directly builds a string, so it'd have to parse the string it just created.

Neither way is necessarily better. However, looking back can be made easy with a refactoring that might sound much worse than it actually is. Currently the code builds a string as it goes along, mixing content and presentation. Instead, you'll change the code to store the content in an array. At the end, you'll then build the presentation and return it. By separating content from presentation, looking back will be easier.

How do you get started? In a situation like this, you'll probably experience something similar to one of the following:
* Just before getting started with a new test, you realize the feature will be hard and requires a refactoring (this is what happened to me when I did this the first time; I had taken a break and the change you'll be doing is pretty much exactly what I ended up doing)
* After writing a test and having a go, you find something just isn't right. Since you check in often, you blow away your work and get a do-over.

Just to be sure, you'll start with a test.

### Test: Basic Function Call
Here's a simple test that describes what you want to have happen: $$ f\ (\ 3\ )\ \ \rightarrow\ \ 3\ f $$ 

* Create this test, see that it in fact fails.

As expected, this test fails. To support this test you are going to separate the generation of the output from the formatting of the output. Let's get back to all tests passing first.
* Rename the test you just created by adding an _ to the beginning of its name.

* Verify your tests pass.

#### Refactoring
You are going to refactor your solution in support of this new test case. Remember, refactoring means changing the structure without changing the behavior. In your case, you have a pretty clear definition of behavior...your tests. So keep your tests passing. Also, as mentioned earlier in the tutorial, the approach will be to add and then remove rather than replace.

* Add a new line to the init method:
{% highlight ruby %}
  def init
    @result = ''
    @newResult = []
    @operators = []
  end
{% endhighlight %}

* Next, you need to find all the places where the code adds to @result and **duplicate** the work (minus the formatting). Luckily, the code does not violate the DRY principle, so there's only one place. It's in the add_to_result method:
{% highlight ruby %}
  def add_to_result(token)
    @result << ' ' if @result.length > 0
    @result << token
  end
{% endhighlight %}
The first line is about formatting, the second line is about content. So you simply need to add one more line anywhere in the method (for now, add it to the end):
{% highlight ruby %}
    @newResult << token
{% endhighlight %}

* Run your test to make sure nothing is broken.

Now you are going to do something that happens a bit. You're going to move to an intermediate result that produces somewhat ugly code. Not to worry, the code won't stay this way long.

* Add the following method:
{% highlight ruby %}
  def produce_result
    @result = ''
    @newResult.each{ |t| 
      @result << ' ' if @result.length > 0
      @result << t
    }
    @result
  end
{% endhighlight %}

* Run your tests, everything should still pass.

* Next, update the convert method to return that instead:
{% highlight ruby %}
  def convert(expression)
    init
    convert_expression(expression)
    produce_result
  end
{% endhighlight %}

* Run your tests, things should still work.

Notice that the code no longer needs to produce the intermediate result, so now it is safe to make a few changes together:
**Remove initialization of @result in the init method**:
{% highlight ruby %}
  def init
    @newResult = []
    @operators = []
  end
{% endhighlight %}
**Remove writing to @result in the add_to_result method**:
{% highlight ruby %}
  def add_to_result(token)
    @newResult << token
  end
{% endhighlight %}

* Run your tests, things should be passing.

* Now, make a quick update to produce_result:
{% highlight ruby %}
  def produce_result
    result = ''
    @newResult.each{ |t|
      result << ' ' if result.length > 0
      result << t
    }
    result
  end
{% endhighlight %}

* Run your tests, things should still be working.

* Next, @newResult is a poor name. This represents output tokens, so rename it from @newResult -> @outputTokens.

* Run your tests, things should still be working.

#### Back to Ruby-isms
My colleague, Dean Whampler, reviewed an early version of this tutorial and pointed out that I had created something much more complex than necessary. In retrospect, given that in a previous life I used Smalltalk, I don't have much of an excuse for missing this. However, it's so much better, that I felt the need to fess up.

* Replace the implementation of produce_result:
{% highlight ruby %}
  def produce_result
    @outputTokens.join(' ')
  end
{% endhighlight %}

* Run your tests, verify everything is passing.

* Check in your work.

#### Refactoring Summary
You just changed the implementation without breaking any tests, congratulations. Having done this, you have a collection of tokens to work with rather than looking at a string to figure out if a left parenthesis represents a function call or groups an expression.

### Back to supporting Functions
You disabled the method for testing a function call to allow refactoring while keeping all tests passing. Now that the refactoring is complete, it is time to reintroduce that test.

* Change the name of your test by removing the _. Run your tests and verify that you have one failing test.

Throughout this exercise, you've been referring to the published algorithm on wikipedia. The algorithm mentions what to do when processing a right-parenthesis. Look at the operand stack and if it's a function, then put in the output. There's more than this, but you are not processing multiple parameters just yet.

The algorithm also mentions what to do if the token is a function name. Your code won't know if a token is a constant or a function until the code hits a left parenthesis **and look at the last element added to outputTokens**. So that's where to start.

* Update handle_paren (which is getting pretty long and unruly about now):
{% highlight ruby %}
  def handle_paren(token)
    if token == '('
      if last_result_pushed_is_function_name
        @operators << @outputTokens.pop
      end
      @operators << token
    else
      add_to_result(@operators.pop) while @operators.last != '('
      @operators.pop
    end
  end
{% endhighlight %}

The definition for last_result_pushed_is_function_name is straightforward, but it does introduce duplication:
{% highlight ruby %}
  def last_result_pushed_is_function_name
    @outputTokens.last =~ /^[a-zA-Z0-9$_]+$/
  end
{% endhighlight %}

* Make these changes and verify that all of your tests pass.

* Check in your results.

#### Time to refactor
Here are a few observations:
* The method handle_paren violates the SRP, it has multiple reasons to change, exists at different levels of abstraction and is generally getting harder to read. A secret to making code readable is to make it unnecessary to read it in the first place.
* The regular expression for checking that something matches a name (variable or function) is duplicated.
There's more, but this is what you'll tackle for now.

* "Extract method" handling left parenthesis from handle_paren:
Add an extracted method for the if part of the block:
{% highlight ruby %}
  def process_left_paren
    if last_result_pushed_is_function_name
      @operators << @outputTokens.pop
    end
    @operators << '('
  end
{% endhighlight %}

* Verify your tests still pass before moving on.

* Change the top part of the if in handle_paren to use the new method:
{% highlight ruby %}
  def handle_paren(token)
    if token == '('
      process_left_paren
    else
      add_to_result(@operators.pop) while @operators.last != '('
      @operators.pop
    end
  end
{% endhighlight %}

* Verify your tests still pass. When they do, consider checking in your work.

* Same thing, bottom part of the if:
**Create an extracted method for handling the right parenthesis**:
{% highlight ruby %}
  def process_right_paren
    add_to_result(@operators.pop) while @operators.last != '('
    @operators.pop
  end
{% endhighlight %}

* Add this method, make sure your tests still pass.

* Use this method in the handle_paren method:
{% highlight ruby %}
  def handle_paren(token)
    if token == '('
      process_left_paren
    else
      process_right_paren
    end
  end
{% endhighlight %}

* Make sure your tests pass

* Check in your work.

Now remove the duplication of regular expressions used for handling names. There are at least two options: put the part of the expression in a constant or write a function. I don't have a good reason to select one over the other so I'm going to use a function.

* Create a new method:
{% highlight ruby %}
  def is_name(str)
    str =~ /^[a-zA-Z0-9$_]+$/
  end
{% endhighlight %}

* Add this method, make sure all of your tests still pass.

* Update last_result_pushed_is_function_name
{% highlight ruby %}
  def last_result_pushed_is_function_name
    is_name @outputTokens.last
  end 
{% endhighlight %}

* Add this method, make sure all of your tests still pass.
{% highlight ruby %}
  def is_operand(token)
      token =~ /^\d+$/ || is_name(token)
  end
{% endhighlight %}

* There's an asymmetry in handling numbers versus names, so add the following method:
{% highlight ruby %}
  def is_number(token)
      token =~ /^\d+$/ 
  end
{% endhighlight %}

* Add this method, make sure all of your tests still pass.

* Finally, update the is_operand method one final time:
{% highlight ruby %}
  def is_operand(token)
    is_number(token) || is_name(token)
  end
{% endhighlight %}

* Run your tests, makes sure they all pass.

* Check in your code.

Did this last change seem silly or over the top? Consider this, the first part of the logical expression uses a regular expression, the second part did not, it called a function. You wanted to use a function on the second part to have a single definition of what is a name. Doing that forced a change in is_operand that made its implementation exist at different levels of abstraction. This simple change is a classic refactoring and leads to clean code. That is, code that someone else might have a chance to read and understand.

## Test: Multiple parameters to a function
Now it's time to add multiple parameters to a function. Here is one example: $$ f\ (\ 4\ ,\ 1\ ,\ a\ ,\ d\ )\ \ \rightarrow \ \ 4\ 1\ a\ d\ f $$ 

* Create a test for this and see what happens.

* Since the , is interpreted as an operator, the results are not quite what you hoped:
{% highlight terminal %}
  1) Failure:
test_function_with_multiple_parameters(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:126:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:175:in `test_function_with_multiple_parameters']:
<"4 1 a d f"> expected but was
<"4 1 , a , d , f">.
{% endhighlight %}

The [Shunting Yard Algorithm](http://en.wikipedia.org/wiki/Shunting_yard_algorithm) has a top-level clause for function parameter separator, so this suggests a change back in the process method:
**Update process**:
{% highlight ruby %}
  def process(token)
    if is_paren(token)
      handle_paren(token)
    elsif is_function_argument_separator(token)
      handle_argument_separator
    elsif is_operand(token)
      handle_operand(token)
    else
      handle_operator(token)
    end
  end
{% endhighlight %}
**Add method definitions for the new new methods**:
{% highlight ruby %}
  def is_function_argument_separator(token)
    token == ','
  end
  
  def handle_argument_separator
    add_to_result(@operators.pop) while @operators.last != '('
  end
{% endhighlight %}

* Verify that your tests pass.

* Check in your code.

An astute observer will notice that the body of handle_argument_separator does the same thing as the first line of process_right_paren. This both violates DRY and, possibly worse, makes it necessary to read the code to understand what it does! You can fix this by factoring this out into a method like:
{% highlight ruby %}
  def record_operators_to_matching_paren
    add_to_result(@operators.pop) while @operators.last != '('
  end
{% endhighlight %}

* Update handle_argument_separator and process_right_paren to use this method:
{% highlight ruby %}
  def handle_argument_separator
    record_operators_to_matching_paren
  end
  def process_right_paren
    record_operators_to_matching_paren
    @operators.pop
  end
{% endhighlight %}

* Make sure your tests are passing.

* Check in your work.

## Test: What About Something Complex?
Here's a test to see if something a bit more complex works with what you've written so far:
{% highlight ruby %}
  def test_nested_function_call_with_embedded_operators
    assert_expression_becomes 'f ( g ( ( 1 + 3 ) * 4 ) / x ( y ( z ) ) )',
      '1 3 + 4 * g z y x / f'
  end
{% endhighlight %}

* Add this to your test, then see what happens.

Your failure should resemble:
{% highlight terminal %}
  1) Failure:
test_nested_function_call_with_embedded_operators(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:140:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:193:in `test_nested_function_call_with_embedded_operators']:
<"1 3 + 4 * g z y x / f"> expected but was
<"1 3 + 4 * z y x / g f">.
{% endhighlight %}

The problem is that when balancing ) with (, there's the chance that it's being done because of an expression or a function call. You can fix this:
{% highlight ruby %}
  def process_right_paren
    record_operators_to_matching_paren
    @operators.pop
    add_to_result @operators.pop  if is_name @operators.last
  end
{% endhighlight %}

* Make this change and verify your tests all pass.

* Check in your work.

### A Quick Refactoring
Some time ago, you added a method called under_logical_top. You can use that method in places where the code checks for a '('. A quick search of the code reveals just one,:
{% highlight ruby %}
  def record_operators_to_matching_paren
    add_to_result(@operators.pop) while @operators.last != '('
  end
{% endhighlight %}

* Change this to use under_logical_top:
{% highlight ruby %}
 def record_operators_to_matching_paren
    add_to_result(@operators.pop) while under_logical_top
  end
{% endhighlight %}

* Make this change, run your tests and check in when your tests pass

This refactoring is something that comes as a result of noticing code duplication. Duplication is going to happen, when you notice it, remove it. This is one of the ways in which pair programming can make a big difference. The co-pilot will generally be in a better position to notice structural things because of their point of observation.

Along those lines, there's three places where your code calls @operators <<. Two times in process_left_paren and handle_operator. Logically these places are pushing something to be handled later. Your code can better document intent by handling that in a function:
{% highlight ruby %}
  def record_operator(operator)
    @operators << operator
  end
{% endhighlight %}

* Add this method, and make sure your tests pass.

* Make the following updates:
{% highlight ruby %}
  def process_left_paren
    if last_result_pushed_is_function_name
      record_operator @outputTokens.pop
    end
    record_operator '('
  end
  def handle_operator(operator)
    add_higher_precedence_operators_to_result operator
    record_operator operator
  end
{% endhighlight %}

You might notice the removal of () when calling record_operator as well as add_higher_precedence_operators_to_result. This is a style issue and you're welcome to leave them in. Have you noticed it earlier, it's been happening for a little while.

* Make these changes, verify all of your tests still pass.

* Check in your changes.

Another random check of the code reveals that there are four places that call @operator.pop. While this may not seem like duplication it is. It forces knowledge of the implementation of the operator stack into four places in the code. You'll change this and see another ruby idiom:

* Add the following method:
{% highlight ruby %}
  def last_operator!
    @operators.pop
  end
{% endhighlight %}

* Add this method and make sure your tests still run.

* Find replace all occurrences of @operators.pop with last_operator! (excluding the method you just added).

* Make sure your tests still pass.

* Check in your changes.

???? should I also replace @operators.last with something like last_operator ????

There are several other methods than change your underlying object. In that spirit, you should change their names to include ! at the end. Those methods include:
* convert
* init
* process_left_parent
* record_operator
* add_to_result
This may seem like a bit of work, but consider this: The class is not thread safe. If the convert method were instead called convert!, it might better document that fact. Given that this is an exercise, this recommendation is left to your discretion.

## Test: Operator Associativity
Next, your code needs to address operator associativity. For example, 4 + 5 - 6 produces 4 5 + 6 - because + and - are left associative but otherwise at the same precedence. However, a = b += 5 produces a b 5 += =. First, b is incremented by 5 and then a equals that result. If these operators were left associative, the result would instead be: a b = 5 += (it's even worse, because the result of = would the an lvalue of the rvalue - whew!), so a would equal b **before** it was incremented by 5. And, as mentioned, the return value of = would be the thing on the right instead of the left to make the thing work in the first place.

That gives a great test: $$ a\ =\ b\ += 5\ \ \rightarrow\ \ a\ b\ 5\ +=\ $$ 

* Create this test and see how it fails.

It appears that the calculation is processed incorrectly because these operators are treated as the same precedence and left to right associative:
{% highlight terminal %}
  1) Failure:
test_right_associative_operators(ShuntingYardAlgorithmTest)
    [shunting_yard_algorithm_test.rb:149:in `assert_expression_becomes'
     shunting_yard_algorithm_test.rb:207:in `test_right_associative_operators']:
<"a b 5 += +"> expected but was
<"a b = 5 +=">.
{% endhighlight %}

This is in fact what is happening because the process method has three checks, is_paren, is_function_argument_separator, is_operand, none of which match, so by default, += and = are treated as operators. A review of the shunting algorithm says this about such operators (paraphrased):
* While the token is right-associative and its precedence is less than the last operator pushed, add the last operator pushed to the output. - Notice, it's stuff like this in the algorithm that makes writing tests just about necessary to make sure you wrote it correctly!

Since your code handles this logic in add_higher_precedence_operators_to_result, that's the place to change. However, its name will be a bit off.

* Try the following change to see if it fixes the broken test and does not break other tests:
{% highlight ruby %}
  def add_higher_precedence_operators_to_result(token)
    if @operators.length > 0
      p1 = precedence_of(token)
      p2 = precedence_of(@operators.last)
      if associativity_of(token) == :right_to_left && p1 < p2
        add_remaining_operators
      end
      if associativity_of(token) == :left_to_right && p1 <= p2
        add_remaining_operators
      end
    end
  end
  def associativity_of(token) 
    case token
      when '=': :right_to_left
      when '+=': :right_to_left
      else :left_to_right
    end
  end
{% endhighlight %}

This "works", all tests pass. But can the code be any better? (Nearly rhetorical question, assume the answer is yes.) And what about the name of the method?

* The tests are passing, check in your work before you refactor this unruly method.

* Here is a better version of the same thing, breaking out some of the logic into a supporting method. Try this version and see that it works:
{% highlight ruby %}
  def add_higher_precedence_operators_to_result(token)
    if @operators.length > 0 && should_happen_first(@operators.last, token)
      add_remaining_operators
    end
  end
  def should_happen_first(topOp, token)
    if associativity_of(token) == :left_to_right
      precedence_of(token) <= precedence_of(topOp)
    else
      precedence_of(token) < precedence_of(topOp)
    end
  end
{% endhighlight %}

* While you are in refactoring mode, you have two places where the expression @operators.length > 0 exits; create a method for that:
{% highlight ruby %}
  def there_are_pending_operators
    @operators.length > 0
  end
{% endhighlight %}

* Update add_higher_precedence_operators_to_result
{% highlight ruby %}
  def add_higher_precedence_operators_to_result(token)
    if there_are_pending_operators && should_happen_first(@operators.last, token)
      add_remaining_operators
    end
  end
{% endhighlight %}

* Update under_logical_top
{% highlight ruby %}
  def under_logical_top
    there_are_pending_operators && @operators.last != '('
  end
{% endhighlight %}

* Get your tests passing

* Check in your code

There's one more thing to change before it's time to call this refactoring side-bar done. The name add_higher_precedence_operators_to_result isn't quite right. This adds operators that are higher or equal precedence or just higher, depending on the associativity. Rather than try to put the rules in the name, you can change the name to something suggesting its intent.

* Rename this method to add_operators_that_should_happen_before(token):
{% highlight ruby %}
  def add_operators_that_should_happen_before(token)
    ...
  end
{% endhighlight %}
* Make sure to update handle_operator, which is the one place that calls the method.

* Verify that all of your tests are passing.

* Check your work in.

### Conclusion
Are you done? For the purposes of this exercise yes, but there remains quite a bit of work you could do:
* Handle unary operators and binary operators
* Tokenize the input expression by properly splitting the line rather than requiring spaces in the input line
* Many of the operators are not currently supported. The mechanism is in place to support them but they are not there.
* The formatting of the result is built-in, you could instead provide an object that formats a stack and then allow for different transformations.
* The list of operators and their precedence and associativity is hard-coded and requires changes to the code when you add new operators. You could provide this information in some kind of data-driven manner or even pass it in during construction.
* Function calls must use () and commas, what if you want to allow for flexibility?
* There are actually bugs in your system. For example, the code dumps the operand stack in add_operators_that_should_happen_before by calling add_remaining_operators. Can you develop a test to show that this is in fact broken (hint, you need at least three levels of precedence)? Can you then fix it? In fact, that it is broken is an example of violating the third rule of TDD.

However, you've made amazing progress on this work. You've:
* Written several unit tests to organically grow your implementation
* Refactored code
* Practiced an important aspect of continuous integration, frequent checkins - which requires that you work in small, tangible steps. That is a **hard** practice to learn and integrate.

## Review
#### The Three Laws
* Write no production code without a failing test.
* Write only enough of a test such that it fails (and not compiling is failing)
* Write just enough production code to get the tests to pass

#### Refactoring
The three laws are not enough. You refactored code: Remember, refactoring means to change the structure without changing the behavior. In your case, the tests define "the behavior". So long as those tests remain passing, you're refactoring.

There are some basics to consider when refactoring:
* Prefer adding (even duplicating) first and then updating over directly changing.
* Only start when all tests are passing. This might mean you disable a test you just added because you need to change the structure of your solution to support the new test (like what you did to support function calls)
* Refactoring is not a separate activity from coding, it should be integrated as a natural part. Continuous refactoring keeps code clean versus building up large piles of design debt.

#### Methods
* Should be short and have a single purpose
* Be written at one level of abstraction
* Getting the meaning from a method should not require a lot of reading.

See [Martin's Clean Code](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1222313221&sr=8-1) book for more on, well, writing clean code.

## A Final Version
Here is the last version I ended up with after the tutorial. You result may vary based on where you added methods. Which one is right? Yours or mine? Both, as long as the tests pass:
{% highlight ruby %}
require 'test/unit'

class ShuntingYardAlgorithm
  def convert(expression)
    init
    convert_expression(expression)
    produce_result
  end

  def init
    @outputTokens = []
    @operators = []
  end

  def convert_expression(expression)
    expression.split(' ').each { |t| process(t) }
    add_remaining_operators
  end

  def produce_result
    @outputTokens.join(' ')
  end

  def process(token)
    if is_paren(token)
      handle_paren(token)
    elsif is_function_argument_separator(token)
      handle_argument_separator
    elsif is_operand(token)
      handle_operand(token)
    else
      handle_operator(token)
    end
  end

  def add_remaining_operators
    add_to_result(last_operator!) while under_logical_top
  end

  def is_paren(token)
    token =~ /[\(\)]/
  end

  def handle_paren(token)
    if token == '('
      process_left_paren
    else
      process_right_paren
    end
  end

  def is_function_argument_separator(token)
    token == ','
  end

  def handle_argument_separator
    record_operators_to_matching_paren
  end

  def is_operand(token)
    is_number(token) || is_name(token)
  end

  def handle_operand(number)
      add_to_result(number)
  end

  def handle_operator(operator)
    add_operators_that_should_happen_before operator
    record_operator operator
  end


  def last_operator!
    @operators.pop
  end

  def process_left_paren
    if last_result_pushed_is_function_name
      record_operator @outputTokens.pop
    end
    record_operator '('
  end

  def process_right_paren
    record_operators_to_matching_paren
    last_operator!
    add_to_result last_operator!  if is_name @operators.last
  end

  def record_operators_to_matching_paren
     add_to_result(last_operator!) while under_logical_top
  end

  def last_result_pushed_is_function_name
    is_name @outputTokens.last
  end

  def is_name(str)
    str =~ /^[a-zA-Z0-9$_]+$/
  end

  def there_are_pending_operators
    @operators.length > 0
  end

  def record_operator(operator)
    @operators << operator
  end

  def add_operators_that_should_happen_before(token)
    if there_are_pending_operators && should_happen_first(@operators.last, token)
      add_remaining_operators
    end
  end

  def should_happen_first(topOp, token)
    if associativity_of(token) == :left_to_right
      precedence_of(token) <= precedence_of(topOp)
    else
      precedence_of(token) < precedence_of(topOp)
    end
  end

  def associativity_of(operator)
    if operator == '+=' || operator == '='
      :right_to_left
    else
      :left_to_right
    end
  end

  def precedence_of(operator)
    case operator
      when '(': 99
      when ')': 99
      when '*': 10
      when '/': 10
      else 1
    end
  end

  def under_logical_top
    there_are_pending_operators && @operators.last != '('
  end

  def is_number(token)
      token =~ /^\d+$/
  end

  def add_to_result(token)
    @outputTokens << token
  end

end

class ShuntingYardAlgorithmTest < Test::Unit::TestCase
  def setup
    @algorithm = ShuntingYardAlgorithm.new
  end

  def assert_expression_becomes(expression, expected)
    result = @algorithm.convert(expression)
    assert_equal(expected, result)
  end

  def test_empty_string_results_in_same
    assert_expression_becomes('', '')
  end

  def test_constant_value_results_in_same
    assert_expression_becomes('42', '42')
  end

  def test_adding_two_values()
    assert_expression_becomes('1 + 3', '1 3 +')
  end

  def test_two_operators_same_precedence()
    assert_expression_becomes('1 + 3 - 4', '1 3 + 4 -')
  end

  def test_two_operators_lower_precedence_first
    assert_expression_becomes('1 + 3 * 2', '1 3 2 * +')
  end

  def test_several_operators_mixed_precedence
    assert_expression_becomes '3 + 1 * 4 - 2 / 3', '3 1 4 * + 2 3 / -'
  end

  def test_adding_variables
    assert_expression_becomes 'a + b', 'a b +'
  end

  def test_parens_removed
    assert_expression_becomes '( )', ''
  end

  def test_parens_cause_lower_precedence_operator_to_happen_first
    assert_expression_becomes '( 4 + 5 ) * 3', '4 5 + 3 *'
  end

  def test_nested_parens
    assert_expression_becomes '( ( 1 + 3 ) / ( 9 - 5 ) ) * ( 2 + 3 )',
      '1 3 + 9 5 - / 2 3 + *'
  end

  def test_function_with_single_parameter
    assert_expression_becomes 'f ( 3 )', '3 f'
  end

  def test_function_with_multiple_parameters
    assert_expression_becomes 'f ( 4 , 1 , a , d )', '4 1 a d f'
  end

  def test_nested_function_call_with_embedded_operators
    assert_expression_becomes 'f ( g ( ( 1 + 3 ) * 4 ) / x ( y ( z ) ) )',
      '1 3 + 4 * g z y x / f'
  end

  def test_right_associative_operators
    assert_expression_becomes 'a = b += 5', 'a b 5 += ='
  end
end
{% endhighlight %}

{% include nav prev="ruby.Tutorials" %}

