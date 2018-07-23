---
title: ruby.tutorials.bdd.UsingBddToDevelopAnRpnCalculator
---
<span class="back_button">[Back]({{ site.pagesurl }}/ruby.tutorials)</span>

# Introduction
{:toc}
In this tutorial, you will develop a [Wikipedia](http://en.wikipedia.org/wiki/Reverse_Polish_notation|Reverse Polish Notation]] (RPN) calculator. According to [[http://en.wikipedia.org/wiki/Reverse_Polish_notation), PRN was developed by 1920 by Polish mathematician Jan Lukasiewicz, so the notation has some history. The purpose of this tutorial is to give you practice with BDD on an object with methods, rather than an object with one method, as in the first tutorial.

As with the first tutorial, this tutorial covers:
* The three laws of TDD
* Continuous refactoring
* Basic continuous integration

Unlike the first tutorial, this tutorial will:
* Spend more time discussing a few more of the S.O.L.I.D. principles, 
* Refactoring to patterns
* Opening up classes using Ruby's Meta-Object Protocol

By the end of this tutorial, you'll be ready to start using story tests on a more complicated problem.

## Note
This tutorial assumes you've either already worked through the first tutorial or are familiar with BDD and RSpec. If not, here are a few terms that come up early enough you'll need to know them:
* Example - in RSpec parlance, this refers to a series of steps describing a use of the system. Before writing production code, you'll write an example. That example will not run most of the time, so you'll then create the production code necessary to get the example to pass.
* Context - A context forms a common environment under-which Examples execute. A context may just be a name or it might include common setup and initialization as well as common clean-up. Contexts can be nested, which was demonstrated in the first tutorial.

## Approach
Unlike the first tutorial, this tutorial will be a bit more explicit in its steps. Where reasonable, each Example will follow the same flow:
* **Title**: Proceeded by a solid line, this will be at Heading Level 1
* **Overview**: The overview immediately follows the title
* **Example**: The Example be in a fixed-point font with different background.
* **Check-in**: As with the other tutorials, getting you to practice frequent checkings is a secondary goal so there will be not-so-subtle reminders along the way. If you find your tools don't support such a working style, that's valuable information as well.
* **Refactor**: There's almost always room for improvement, so the tutorial will review the work it just had you do and make suggestions as applicable. These refactorings are generally of the seconds-to-minutes variety. If an example requires a more significant restructuring, then it will be an entire sub-section in the Example.
* **Check-in**: After refactoring, checking in again.
* **Summary**: A synopsis of anything new or significant

There will also be occasional side-bars on an as-needed basis.

[[include page="sidebar_start"]][[include page="ruby.sidebar.ThreeLawsOfTddRevisited"]][[include page="sidebar_end"]]

Before you get started on any Examples, however, we'll delve into the problem just a bit.

# The Problem
An RPN calculator works by performing calculations on operands that the user has already entered. Here is an example scenario:
```
    5 <enter>
    3 
    +
    = 8
```
In this example, a user enters first 5 and then 3 and hits the + key to get the previous two operands 5 and 3, added together.

In general, using an RPN calculator obviates the need to use parenthesis. Consider the following:

    ((5 + 3) * 6 / 3) ^ 4

That same expression could be calculated on an RPN calculator as follows:
```
    5 <enter> 3 + 6 * 3 / 4 ^
    = 65536
```

An RPN calculator as a stack of previously entered values. The most recently entered numbers are the numbers that become available first (Last In First Out - LIFO). Consider this longer sequence:
```
    3 <enter> 6 <enter> -8 <enter> 89 + sqrt - +
    = 0
```
Here's the evaluation of the above expression:
* 3, 6, -8 get places on the operand stack
* 8 is placed in "working storage" or in HP terminology, the x register
* +, a binary operator, takes as its left hand operand the top item on the stack, -8 and as its right hand operand the x register, 89. The result, 81, is placed in the x register
* Next, sqrt, a unary operator, takes the value on the x register and calculated 9, which is then put into the x register
* The first -, another binary operator, takes as its left-hand operator the top value on the stack, which is currently 6. It takes as its right-hand operator the x register, which is 9. The result, -3, is placed in the x register
* The first -, another binary operator, takes as its left-hand operator the top value on the stack, which is currently 6. It takes as its right-hand operator the x register, which is 9. The result, -3, is placed in the x register.
* The final operator, +, another binary operator, takes as its first operand the top item on the stack, which is 3. For its right-hand operand, it takes the x register, -3. Adding, the result is 0, which becomes the value in the x register.
* The stack is empty.

## The x register
The x register behaves like an accumulator. As you type numbers, those numbers get added to what is already there. When you type a non-number key, it applies itself. For example, the <enter> key really behaves like a unary operator. When you press <enter>, it takes the value in the x register and places it on the stack.
* If the next key is part of a number, the x register is reset and the key pressed becomes the contents of the x register.
* If the next key is not part of a number, then it applies as is.

After any non-number key, the x register is "locked" and any attempt to change it results in it being reset.

## Getting Started
There are several major parts to this problem:
* Handling input
* Handling the stack and the x register properly
* Processing the basic operators (+, -, /, *, ^)
* Handling more complex functions (e.g., prime factors, sum over the stack)

In addition, we'll add several things to make this a bit more interesting:
* CRUD'ing (Create, Read, Update, Delete) variables
* CRUD'ing user-defined functions

Behavior Driven Development advocates starting outside in; start with the user experience and then work your way into the system. In this tutorial, you will not strictly be creating a user interface; you will, however, create the stuff necessary to build a user interface. The tutorial will start at the individual entry of keys and work up to basic math.

## Your Work Area
* Create a directory to store all of your work. Unlike the first tutorial, you'll be working in multiple files this time.

# The 0th Example
As with all problems, you need to pick a starting place. As with the first tutorial, you will create a basic example describing object creation. Next, you'll continue with a series of examples centered on basic input. Thinking further ahead at this point might constitute analysis paralysis. 

**Example**
Here is a first Example for this problem:
```ruby
    describe "Basic Creation" do
      it "should be non-null after creation" do
        calculator = RpnCalculator.new
      end
    end
```
* Create this Example in your directory, call the file "rpn_calculator_spec.rb"

* Execute the Example, it fails:
```ruby
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    Basic Creation
    - should be non-null after creation (ERROR - 1)
    
    1)
    NameError in 'Basic Creation should be non-null after creation'
    uninitialized constant RpnCalculator
    ./rpn_calculator_spec.rb:3:
    
    Finished in 0.013091 seconds
    
    1 example, 1 failure
```
The -c option adds color to the output. You won't see the color in this tutorial. Also, if you are running this in a DOS terminal window, then you'll want to leave this option off.

The message describes an unknown constant, RpnCalcualtor. You'll need to create that class.

* Create the following Ruby class in a file called rpn_calculator.rb:
```ruby
    class RpnCalculator
    end
```

* Update rpn_calculator_spec.rb to require the file you just created:
```ruby
    require 'rpn_calculator'
    
    describe "Basic Creation" do
      ...
    end
```

* Run your Example again, you should be all green:
```ruby
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    Basic Creation
    - should be non-null after creation
    
    Finished in 0.0123 seconds
    
    1 example, 0 failures
```

OK, you have an Example but it does not contain any verification. So one more change and one more execution.

* Update the Example to validate calculator:
```ruby
    calculator.should_not be nil
```

* Run your Example again, you should be all green:
```bash
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    Basic Creation
    - should be non-null after creation
    
    Finished in 0.0123 seconds
    
    1 example, 0 failures
```

[[include page="sidebar_start"]][[include page="ruby.sidebar.ExamplesPassingWithoutValidation"]][[include page="sidebar_end"]]

[[include page="sidebar_start"]][[include page="ruby.sidebar.AllGreen"]][[include page="sidebar_end"]]

**Check-In**
You are all green, so it is time to check in your work. As with the previous tutorial, I'll be using git:
```
    Macintosh-7% ls
    rpn_calculator.rb  rpn_calculator_spec.rb  wikiwriteup.txt
    Macintosh-7% git init
    Initialized empty Git repository in /Users/schuchert/src/ruby/bdd_tutorial_2/.git/
    Macintosh-7% git add *   
    Macintosh-7% git commit
    Created initial commit 05273da: First spec passing.
     3 files changed, 354 insertions(+), 0 deletions(-)
     create mode 100644 rpn_calculator.rb
     create mode 100644 rpn_calculator_spec.rb
     create mode 100644 wikiwriteup.txt
```

Note that in this example I have a file you will not have, wikiwriteup.txt. That's the raw material used for format the wikipage you are now reading.

**Refactor**
A quick review of the existing Example and production code does not suggest any refactoring yet.

**Check-In**
Since there was no need to refactor, there's no need to check in again.

**Summary**
You created two files:
**rpn_calculator_spec.rb**
```ruby
    require 'rpn_calculator'
    
    describe "Basic Creation" do
      it "should be non-null after creation" do
        calculator = RpnCalculator.new
        calculator.should_not be nil
      end
    end
```
**rpn_calculator**
```ruby
    class RpnCalculator
    end
```

This may seem like a trivial start, and that is by design. What have you verified so far:
* You have a working environment
* The RSpec gem is installed
* Ruby is intalled
* You have the basic files in place
* You've checked your work into a repository

Not every Example will be so small and quick to create, but you should attempt to break your work down into bite-sized chunks like this. Why?
* If you get distracted, you don't lose very much ground.
* If you mess up and need a do-over, you don't lose too much work.
* If someone needs your attention, you're not too far from having a great place to stop what you're doing.
* You can feel a sense of accomplishment throughout the day.
* You can watch as your system organically grows from something trivial, to something complex, typically quickly.

[[include page="sidebar_start"]][[include page="ruby.sidebar.ConcreteExampleHardwareSimulator"]]
[[include page="sidebar_end"]]

# Example: Accepting User Input
With the first Example running it is time to move on to basic user input. We have to make a decision already, where is the system boundary. Here are a few possibilities:
* The system receives a series of events for buttons pressed, e.g., pressing "9" on the UI generates a 9-button pressed event, pressing "sqrt" on the UI generates a sqrt-button pressed event.
* The system receives "digit" messages for digits or "function" messages for functions.
* The system receives messages such as a complete number, enter, + and so on.

There are other alternatives, and to some extent, the selection is arbitrary. There is no decision on the UI technology there's no way to know the eventing mechanism, if applicable. Even so, you can make progress based on some logical representation and then adapt between the real UI technology and the system you've developed.

A standard model for handling user input is the Model:View:Control pattern. In this case, the View is the as-yet-to-be-determined presentation technology. The Model is the calculator itself. The control part of the equation maps between the view and the model (the UI and the calculator). So you will create the model, drive the system using RSpec as the de-facto control, and when you've selected the UI technology, you'll create a new control to map from the UI to your well-tested model.

As a side benefit, most of the logic will be in easy to test code.

Since the particulars of the UI are irrelevant, this tutorial will move forward using option 2 listed above for handling numbers. When it is time to handle things like +, /, etc., it'll be time to make another decision.

**Example**
Here is the beginning of an example:
```ruby
    describe "Handling User Input of Numbers" do
      it "should store a series of digits in the x register" do
        calculator = RpnCalculator.new
        calculator.digit_pressed '4'
      end
    end
```

There's more to be written, but as soon as the message "digit_pressed" is sent to a calculator, the Example will fail.

* Create this Example, adding it to rpn_calculator_spec.rb.

* Execute the Example, you should see an error similar to the following:
```bash
    1)
    NoMethodError in 'Handling User Input of Numbers should store a series of digits in the x register'
    undefined method `digit_pressed' for #<RpnCalculator:0x58kkc80c>
    ./rpn_calculator_spec.rb:12:
    
    Finished in 0.015707 seconds
    
    2 examples, 1 failure
```

Assuming you worked through the first BDD tutorial, this is familiar ground. You need to add a method to get this to compiled (you've just finished applying law 2 of the 3 laws of BDD).

* Update RpnCalculator:
```ruby
    class RpnCalculator
      def digit_pressed(digit)
      end
    end
```

* Verify that your Example now executes successfully.

* Complete the Example:
```ruby
    describe "Handling User Input of Numbers" do
      it "should store a series of digits in the x register" do
        calculator = RpnCalculator.new
        calculator.digit_pressed '4'
        calculator.digit_pressed '2'
        calculator.x_register.should == 42
      end
    end
```

* Execute your examples, one will fail:
```
    1)
    NoMethodError in 'Handling User Input of Numbers should store a series of digits in the x register'
    undefined method `x_register' for #<RpnCalculator:0x58c5dc>
    ./rpn_calculator_spec.rb:14:
    
    Finished in 0.015999 seconds
    
    2 examples, 1 failure
```

As with the previous failure, this failure is a result of a missing method.

* First, create the method in RpnCalculator to get your code to compiling:
```ruby
    def x_register
    end
```

* Run your Example, make sure it is failing:
```bash
    1)
    'Handling User Input of Numbers should store a series of digits in the x register' FAILED
    expected: 42,
         got: nil (using ==)
    ./rpn_calculator_spec.rb:14:
    
    Finished in 0.016444 seconds
    
    2 examples, 1 failure
```

* Now, do the simplest thing that could work, AKA fast-green bar, AKA, Uncle Bob's TDD rules, #3:
```ruby
    def x_register
      42
    end
```

* Finally, run your Examples to make sure they are passing:
```
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    Basic Creation
    - should be non-null after creation
    
    Handling User Input of Numbers
    - should store a series of digits in the x register
    
    Finished in 0.014956 seconds
    
    2 examples, 0 failures
```

[[include page="sidebar_start"]][[include page="ruby.sidebar.WhyTwoStepsInsteadOfJustOne"]][[include page="sidebar_end"]]

[[include page="sidebar_start"]][[include page="ruby.sidebar.WhatASillyImplementation"]][[include page="sidebar_end"]]

**Check-In**
* Check in your work:
```
    Macintosh-7% git commit -a
    Created commit 727745f: Added basic support for handling digits.
     3 files changed, 215 insertions(+), 2 deletions(-)
```

**Refactor**
Review of the RpnCalculator class does not suggest any refactoring.

Review of the Examples, however, does. There is some minor duplication. Both Examples create a calculator. This is a quick fix since you can create a containing Context with common setup. As with any refactoring, however, you'll take small steps and verify as you go along.

* Create a containing context:
> **Above the first describe**
```ruby
    describe "RPN Calculator" do
```
> **After the last end**
```ruby
    end
```
> **Update the spacing - that's one command in VI, the best-ever editor**
```ruby
    describe "RPN Calculator"
      describe "Basic Creation" do
        ...
      end
    
      describe "Handling User Input of Numbers" do
        ...
      end
    end
```

* Verify that your Examples still execute:
```bash
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    RPN Calculator
    
    RPN Calculator Basic Creation
    - should be non-null after creation
    
    RPN Calculator Handling User Input of Numbers
    - should store a series of digits in the x register
    
    Finished in 0.016923 seconds
    
    2 examples, 0 failures
```

* Add a common setup to your outer-context:
```ruby
    before(:each) do
      @calculator = RpnCalculator.new
    end
```

* Verify your Examples still run.

* Update the first Example to use the initialized calculator:
```ruby
    describe "Basic Creation" do
      it "should be non-null after creation" do
        @calculator.should_not be nil
      end
    end
```

* Verify your Examples still run.

* Update the second Example as well:
```ruby
    describe "Handling User Input of Numbers" do
      it "should store a series of digits in the x register" do
        @calculator.digit_pressed '4'
        @calculator.digit_pressed '2'
        @calculator.x_register.should == 42
      end
    end
```

* Verify your Examples still run.

You might be tempted to do more at this point. For example, you know you'll be adding a lot of values to the x_register. However, let that generalization happen naturally. Practicing both BDD and TDD encourages bottom-up, example-based generalization.

**Check-In**
* Check in your work:
```
    Macintosh-7% git commit -a
    Created commit b203185: Removed duplication of calculator initialization.
     2 files changed, 128 insertions(+), 18 deletions(-)
     rewrite rpn_calculator_spec.rb (90%)
```

**Summary**
The first example added basic object creation. This Example defined some of the API for entering digits. The production code doesn't actually process this yet, however, you already have executable documentation of how the API is supposed to work.

You also performed some basic refactoring on your Examples. While mentioned in the first tutorial, here are a few observations:
* You want to get to the point where your muscle memory is imbued with this kind of basic cleanup. The only way to get there is practice.
* We removed a violation of the DRY principle. I believe Ruby Dave Thomas is credited with saying all design is an exercise in removing duplication. Regardless of who said it, I think it's a sound idea.

# Example: Taking a decimal point as well
The production code is hard-coded. Somehow you want to push your solution to remove that hard-coded value. One way to do that is to and another Example (don't do this):
```ruby
      describe "Handling an even longer User Input of Numbers" do
        it "should store a series of digits in the x register" do
          @calculator.digit_pressed '1'
          @calculator.digit_pressed '2'
          @calculator.digit_pressed '4'
          @calculator.digit_pressed '3' 
          @calculator.digit_pressed '2' 
          @calculator.x_register.should == 12432
        end
```

On the one hand, this will force some more work in the production code. On the other hand, this Example is a proper superset of the first Example. That is, this Example completely covers the first Example, so, pragmatically, you should remove the first Example. More Examples does not necessarily mean better Examples. Each Example should push the solution a little further and avoid duplicating the work of another Example. Why?
* More examples --> longer to run --> run less often --> less effective
* When something breaks, you are likely to break more than one Example --> more maintenance --> Examples become a hassle to maintain --> Examples are commented out or left not passing --> nearly defeats the purpose of BDD.

[[include page="sidebar_start"]][[include page="ruby.sidebar.NotIdleChitChat"]][[include page="sidebar_end"]]

**Example**
Here is another example that fits extends the functionality just a little but will also force the implementation of the production code:
```ruby
    it "should handle a string of digits with an embedded ." do
      @calculator.digit_pressed '1' 
      @calculator.digit_pressed '3' 
      @calculator.digit_pressed '.'
      @calculator.digit_pressed '3'
      @calculator.digit_pressed '1'
      @calculator.x_register.should == 13.31
    end
```

* Create this Example.

* Run your Examples, you should have one failure:
```
    ... <snip> ...
    - should handle a string of digits with an embedded . (FAILED - 1)
    
    1)
    'RPN Calculator Handling User Input of Numbers should handle a string of digits with an embedded .' FAILED
    expected: 13.31,
         got: 42 (using ==)
    ./rpn_calculator_spec.rb:27:
    
    Finished in 0.018738 seconds
    
    3 examples, 1 failure
```

Now it is time to do something more than hard-code the response.

* Add an initialization method to your RpnCalculator class:
```ruby
      def initialize
        @input = ''
      end
```

* Update the digit_pressed method to record the digit:
```ruby
      def digit_pressed(digit)
        @input << digit.to_s
      end
```

* Update the x_register method to use the recorded input:
```ruby
      def x_register
        @input.to_f
      end
```

* Run your Examples, you should be all green:
```
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    RPN Calculator
    
    RPN Calculator Basic Creation
    - should be non-null after creation
    
    RPN Calculator Handling User Input of Numbers
    - should store a series of digits in the x register
    - should handle a string of digits with an embedded .
    
    Finished in 0.018312 seconds
    
    3 examples, 0 failures
```
**Check-In**
* It is once again time to check in your code. Everything is green:
```
    Macintosh-7% git commit -a
    Created commit e10de87: Added support for numbers with decimals.
     3 files changed, 135 insertions(+), 2 deletions(-)
```

And as a reminder, the reason there are so many insertions in this example is because my checkins include updates to the source file used to generate the page you are reading.

**Refactor**
Reviewing the RpnCalclator class, there's little to do right now. What about your Examples? There appears to be duplication in that there are several lines that call the digit_pressed method. Is this duplication? It does represent the underlying objects' API. Even so, how can you improve this?

Before making any improvements, you need a reason to make the improvement. It is to make the Example more readable, easier to write, easier to maintain, or some other characteristic?

How about allowing your Example to provide a number, which is then "typed" for you?

* Add a method to the containing context:
```ruby
    describe "RPN Calculator" do
      ...
      def enter_number(number)
        number.to_s.each_char{ |d| @calculator.digit_pressed d }
      end
      ...
    end
```

* Run your Examples, they should still pass.

* Update the "Handling User Input of Numbers" example:
```ruby
    it "should store a series of digits in the x register" do
      enter_number 42
      @calculator.x_register.should == 42
    end
```

* Run your Examples, they should still pass.

* Update the "should handle a string of digits with an embedded ." Example:
```ruby
    it "should handle a string of digits with an embedded ." do
      enter_number 13.31
      @calculator.x_register.should == 13.31
    end
```

* Run your Examples, they should still pass.

* Finally, the second Example does not start with should, which is a pretty well-followed practice. So fix it:
```ruby
      describe "Handling integers" do
        it "should store a series of digits in the x register" do
          enter_number 42
          @calculator.x_register.should == 42
        end
```


* Run your Examples, they should still pass.
```bash
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    RPN Calculator
    
    RPN Calculator Basic Creation
    - should be non-null after creation
    
    RPN Calculator Handling integers
    - should store a series of digits in the x register
    - should handle a string of digits with an embedded .
    
    Finished in 0.017654 seconds
    
    3 examples, 0 failures
```

**Check-In**
* Check in your changes:
```
    Macintosh-7% git commit -a
    Created commit a465d16: Removed duplication in writing examples taking numbes.
     2 files changed, 56 insertions(+), 24 deletions(-)
```

**Summary**
Congratulations, you have basic support for processing numeric input. You managed to use an Example that pushed the design just a bit and ended up with code in each of the methods.

There is one strange thing, your code uses "digit_pressed" for the digits 0 through 9 and '.'. That's something worth considering.

Here is a snapshot of what your code should resemble at this point:
**rpn_calculator_spec.rb**
```ruby
    require 'rpn_calculator'
    
    describe "RPN Calculator" do
      before(:each) do
        @calculator = RpnCalculator.new
      end
    
      def enter_number(number)
        number.to_s.each_char{ |d| @calculator.digit_pressed d }
      end
    
      describe "Basic Creation" do
        it "should be non-null after creation" do
          @calculator.should_not be nil
        end
      end
    
      describe "Handling integers" do
        it "should store a series of digits in the x register" do
          enter_number 42
          @calculator.x_register.should == 42
        end
    
        it "should handle a string of digits with an embedded ." do
          enter_number 13.31
          @calculator.x_register.should == 13.31
        end
      end
    end
```

**rpn_calculator.rb**
```ruby
    class RpnCalculator
      def initialize
        @input = ''
      end
        
      def digit_pressed(digit)
        @input << digit.to_s
      end 
        
      def x_register
        @input.to_f
      end
    end 
```

# Example: What Happens with Enter?
What happens when a user presses the <enter> key on the calculator:
* The current value in the x_register is placed on the stack of previous operands.
* Subsequent, the next numeric digit causes the x_register to reset, but pressing <enter> again causes that value to placed on the stack again.

In fact, as you will see, pressing a non-numeric key generally "locks-down" the x_register and makes the next digit cause it to be reset. You can describe this we several Examples.

**Example**
Here is a Context with three as yet to be defined Examples:
```ruby
      describe "Handling the <enter> key" do
        it "should copy x_register to top of stack" 
      
        it "should cause next digit to reset the x_register" 
    
        it "should allow the x_register to be <entered> again" 
      end
```

* Add this context as a sub-context of the RPN Calculator context.

* Execute your Examples, you should notice that these three are listed as pending:
```terminal
    RPN Calculator Handling the <enter> key
    - should copy x_register to top of stack (PENDING: Not Yet Implemented)
    - should cause next digit to reset the x_register (PENDING: Not Yet Implemented)
    - should allow the x_register to be <entered> again (PENDING: Not Yet Implemented)
    
    Pending:
    RPN Calculator Handling the <enter> key should copy x_register to top of stack (Not Yet Implemented)
    RPN Calculator Handling the <enter> key should cause next digit to reset the x_register (Not Yet Implemented)
    RPN Calculator Handling the <enter> key should allow the x_register to be <entered> again (Not Yet Implemented)
    
    Finished in 0.022477 seconds
    
    6 examples, 0 failures, 3 pending
```

Before you can write any of these, you have to make a decision about how to indicate that the <enter> key was pressed. Here are a few options:
* Add a method, enter_pressed.
* Add a method, execute_function(:enter)

Is there a clear winner? There are trade-offs:
* The first option suggests a "wide" API. That is, the number of methods on the PN Calculator grows as its functionality grows. This might sound "normal" but it could be a violation of the Open/Closed Principle.
* The second option requires a symbol for each function.
* The second option requires the RPN calculator to map from a symbol, :enter, to a behavior.

[[include page="sidebar_start"]][[include page="ruby.sidebar.OpenClosedPrinciple"]][[include page="sidebar_end"]]

This tutorial will take the second approach.

* Add to the first Example (make sure to add the 'do' after the first line):
```ruby
    it "should copy x_register to top of stack" do
      enter_number 654
      @calculator.execute_function(:enter)
    end
```

Why stop here? This Example is now failing because it invokes a method that does not yet exist.

* Run your Examples to verify this:
```
    1)
    NoMethodError in 'RPN Calculator Handling the <enter> key should copy x_register to top of stack'
    undefined method `execute_function' for #<RpnCalculator:0x587ac8 @input="654">
    ./rpn_calculator_spec.rb:33:
    
    Finished in 0.023074 seconds
    
    6 examples, 1 failure, 2 pending
```

* Get the example back to Green by adding a method in RpnCalculator:
```ruby
      def execute_function(function_symbol)
      end
```

* Continue with the Example:
```ruby
    it "should copy x_register to top of stack" do
      enter_number 654
      @calculator.execute_function(:enter)
      @calculator.top.should == 654
    end
```

This both completes the Example and causes it not to work because the top method does not exist. You can verify this by running your Examples.

* Add a top method:
```ruby
      def top
        654
      end
```

Did you notice I just had you "cheat". You should have:
* Created a method that would cause the Example to fail.
* Run your Examples.
* Updated the method to return 654
* Run your Examples.
Did you notice that? If not, see how easy it is to slide backwards?

[[include page="sidebar_start"]][[include page="ruby.sidebar.JustHowMuchCanYouFollowTheThreeLaws"]][[include page="sidebar_end"]]

**Check-In**
You have all passing Examples, but two are not implemented. Should you check in your work?
* Sure:
```
    Macintosh-7% !g
    git commit -a
    Created commit f77e000: Added support for the "enter" function.
     3 files changed, 148 insertions(+), 7 deletions(-)
```

**Refactor**
A quick review of RpnCalculator doesn't suggest a need for refactoring. For now, the same can be said of the Examples.

**Check-In**
No need, there was no need to refactor.

**Summary**
Do you think pressing <enter> on a calculator is a function? Before I started this project my reaction would have been, "That's silly." However, when I got to this Example, I considered the writeup on the RPN Calculator and realized that the <enter> key is a function just as much as sqrt, pow, etc.

Have we made progress? Yes, we have extended the API of the calculator. What about checking in code with pending Examples, is that a good idea? I think it is OK, but it could cause problems. I prefer clean Example execution, so having several pending Examples is a bother. On the other hand, if I'm pairing with someone and one of us thinks of something worthy of validation, but it is not where we are working, we could write it down, email it, yell it to another team member, or we can put it in the code in an executable fashion.

# Example: Checking that the x_register is reset-able
The next Example involves what happens after the <enter> key. You could have included this check in the previous Example, however keeping the tests small, focused and checking fewer things makes pinpointing problems easier.

**Example**
Here's an example that seems to express the idea:
```ruby
    it "should cause next digit to reset the x_register" do
      enter_number 654
      @calculator.execute_function(:enter)
      enter_number 1
      @calculator.x_register.should == 1
    end
```

* Create this Example and then run you Examples:
```
    1)
    'RPN Calculator Handling the <enter> key should cause next digit to reset the x_register' FAILED
    expected: 1,
         got: 6541.0 (using ==)
    ./rpn_calculator_spec.rb:41:
    
    Finished in 0.023285 seconds
    
    6 examples, 1 failure, 1 pending
```

Notice that the 1 entered was appended to the x_register. So looks like this test pushes our current production code. You might also have observed that the support method named "enter_number" is really a bit off. Since <enter> has a meaning now, this method's name should be changed. That, however, is a refactoring so you should wait until you have all Examples passing (it OK to leave the pending Example pending).

* Update the calculator to work with the new Example:
```
      def digit_pressed(digit)
        @input = '' if @x_register_should_reset
        x_register_should_reset = false
        @input << digit.to_s
      end
      
      def execute_function(function_symbol)
        @x_register_should_reset = true
      end
```

* Run your Examples, they should pass:
```
    RPN Calculator Handling the <enter> key
    - should copy x_register to top of stack
    - should cause next digit to reset the x_register
    - should allow the x_register to be <entered> again (PENDING: Not Yet Implemented)
    
    Pending:
    RPN Calculator Handling the <enter> key should allow the x_register to be <entered> again (Not Yet Implemented)
    
    Finished in 0.022283 seconds
    
    6 examples, 0 failures, 1 pending
```

**Check-In**
* Now is a good time to check in, even though you have a pending Example:
```
    Macintosh-7% !g
    git commit -a
    Created commit d8902e3: Added resetting of x_register after :enter
     3 files changed, 65 insertions(+), 3 deletions(-)
```

**Refactor**
Here's a list of things that you might consider for refactoring:
* There's a violation of DRY between digit_pressed and initialize
* There's some duplication between the last two Examples
* The method name enter_number either needs to be changed, or it should call the <enter> method.

**enter_number**
You can either change its name or make it do what it says. Flip a coin, you probably do not have enough information to make that decision just yet. However, in the spirit of keeping things clean, I did make a decision. I kept the method name and changed its implementation:
```ruby
      def enter_number(number)
        number.to_s.each_char{ |d| @calculator.digit_pressed d }
        @calculator.execute_function(:enter)
      end
```

* Run your Examples, nothing is broken.

**Violation of DRY between digit_pressed and initialize**
This is one of those cases where duplication might be OK because right now initialize is simple but it is likely to get more complex later. I was originally going to change the implementation to this (don't do this):
```ruby
      def digit_pressed(digit)
        initialize if @x_register_should_reset
        x_register_should_reset = false
        @input << digit.to_s
      end
```

However, before I made that change, it occurred to me that coupling to the initialize method will probably cause problems later. Even though I'd catch that when Executing my Examples, I instead decided to introduce a simple method that documents the intent.

* Add a new method:
```ruby
      def reset_input
        @input = ''
      end
```

* Verify that nothing broke.

* Update initialize and digit_pressed to use this new method.

* Verify that nothing broke.

**Duplication in last two Examples**
When you changed the implementation of enter_number to actually perform an <enter>, you could have updated the last two Examples as follows:
```ruby
    it "should copy x_register to top of stack" do
      enter_number 654
      @calculator.top.should == 654
    end

    it "should cause next digit to reset the x_register" do
      enter_number 654
      @calculator.digit_pressed 1
      @calculator.x_register.should == 1
    end
```

When these Examples reflect the update to the enter_number method, the duplication does not see to be bad.

**Check-In**
* Check in your work.
```
    Macintosh-7% !g
    git commit -a
    Created commit a8fec92: Refactored input resetting, enter_number now 
     3 files changed, 75 insertions(+), 8 deletions(-)
```

**Summary**
The behavior of the calculator has grown. The it also is beginning to handle the <enter> functionality. You removed duplication in the production code. It was small, and trivial and probably seemed like nothing. However, here's a principle from Jerry Weinberg:

> Nothing + Nothing + Nothing == Something

If you are not maintaining your code and constantly cleaning it up, then it is decaying. Even if your code is not changing, it is decaying because the market is changing, the users' understanding of your system is changing, something is changing.

Keeping your code clean is not an event, it's not a processes, it is an attitude. You have it or you do not have it. 

Are you going to be perfect?
> **//Perfection is not a destination, it is a journey.//**

No, you are going to miss stuff. That's why when you do find something, now is the time to handle it. If you cannot deal with it now, write it down on a piece of paper. Throw that piece of paper away in 2 days. If you haven't found the time to fix it by then, then by keeping the paper, you're just giving yourself undue stress.

# Example: Should allow x_register to be entered again
This one has been pending. While I was just about to get to that, a few ideas went through my head:
* There's going to be a stack of numbers somewhere.
* Once the calculator starts resetting, the code never stops, so the Examples have left work on the plate.

Those two items are officially on the punch-list. For now, let's get back to all green. We've been away from all green for too long.

**Example**
* Create the following example:
```ruby
    it "should allow the x_register to be <entered> again" do
      enter_number 654
      @calculator.execute_function(:enter)
      @calculator.top.should == 654
      @calculator.x_register.should == 654
    end
```

* Run your Examples:
```
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    RPN Calculator
    
    RPN Calculator Basic Creation
    - should be non-null after creation
    
    RPN Calculator Handling integers
    - should store a series of digits in the x register
    - should handle a string of digits with an embedded .
    
    RPN Calculator Handling the <enter> key
    - should copy x_register to top of stack
    - should cause next digit to reset the x_register
    - should allow the x_register to be <entered> again
    
    Finished in 0.022528 seconds
    
    6 examples, 0 failures
```

Well everything is all green. So this Example might not be adding value. Rather than immediately delete it, keep a note to review it after completing the first two items on the punch-list.

**Check-In**
Should you check in? You might not be sure about the Example, but you've got that to review after just a few more Examples. Even so, go ahead and commit. If you remove the Example later, your RCS tool can handle the workload.

* Commit:
```
    Macintosh-7% !g
    git commit -a
    Created commit 437ee9f: Added candidate Example. Might remove it shortly,.
     2 files changed, 51 insertions(+), 8 deletions(-)
```

**Refactor**
There are some duplicated validation steps in the Examples. Before refactoring, however, keep things as is until you've done just a little more work.

**Check-In**
There's nothing to check-in right now.

**Summary**
You've added an Example. You are not sure if it is a good one or not. You've got two items on your punch list. Review this Example after you have addressed those other two items.

# Example: Resetting after the first digit
Once an example sends the execute_function method, the RpnCalculator will continue to reset. You need to fix this.

**Example**
* Create the following example.
```ruby
    it "should only reset after the first digit and not subsequent digits" do
      enter_number 654
      enter_number 27
      @calculator.x_register.should == 27
    end
```

* Run your Examples, notice the failure:
```
    - should only reset after the first digit and not subsequent digits (FAILED - 1)
    
    1)
    'RPN Calculator Handling the <enter> key should only reset after the first digit and not subsequent digits' FAILED
    expected: 27,
         got: 7.0 (using ==)
    ./rpn_calculator_spec.rb:53:
    
    Finished in 0.023869 seconds
    
    7 examples, 1 failure
```

The problem is, the "reset state" is set in execute_function but never reset.

There are two ways to fix this:
**Update the digit_pressed method**
```ruby
      def digit_pressed(digit)
        if @x_register_should_reset
          reset_input 
          @x_register_should_reset = false
        end
        @input << digit.to_s
      end
```

Or **Update the reset_input method**
```ruby
      def reset_input
        @input = ''
        @x_register_should_reset = false
      end
```

Either will work. In fact, doing both works. Question, to which method does the responsibility seem to bind? If you tought reset_input, you're right.

* Fix this by updating the reset_input method.

* Make sure your Examples pass:
```
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb
    
    RPN Calculator
    
    RPN Calculator Basic Creation
    - should be non-null after creation
    
    RPN Calculator Handling integers
    - should store a series of digits in the x register
    - should handle a string of digits with an embedded .
    
    RPN Calculator Handling the <enter> key
    - should copy x_register to top of stack
    - should cause next digit to reset the x_register
    - should allow the x_register to be <entered> again
    - should only reset after the first digit and not subsequent digits
    
    Finished in 0.025639 seconds
    
    7 examples, 0 failures
```

[[include page="sidebar_start"]][[include page="ruby.sidebar.IDidTooMuch"]][[include page="sidebar_end"]]

**Check-In**
* Check in your work, you've made some good progress:
```
    Macintosh-7% !g
    git commit -a
    Created commit e1a018b: Added Example to verify that resetting was turned off.
     3 files changed, 139 insertions(+), 5 deletions(-)
```

**Refactor**
Reviewing the RpnCalculator there does not seem to be a need to do any refactoring. I do observe that the top method is still hard-coded, so an Example to drive that would be good.

As for the Examples, there is one thing you can do to clean up a little duplication. Every Example enters the number 654, so add a before method:
```ruby
    before(:each) do
      enter_number 654
    end
```

* Add the before method and run your Examples. Make sure all Examples still pass.

* Now, remove the first enter_number 654 from each of the subsequent Examples.

* Verify that all of your Examples still pass.

**Check-In**
With the one refactoring, now is a good time to check in your changes

**Summary**
You've pushed the solution a bit further and cleaned up some duplication. Specifically, resetting the value in the x_register seems to work and you've put some common setup work into a before for your Context.

You still have the question of whether there should or should not be a stack. And what about that pesky Example? You're keeping a punch-list, right?

# Example: Enter actually puts values on the stack
Up to this point, your examples have addressed the effect of the <enter> key on the x_register, but what about stored values? Consider the following:
```
    7 <enter>
    14 <enter>
    99
```
What can you say about the RpnCalculator?
* The x_register has a value of 99. 
* The x_register can still receive receive digits. 
* The first previous value is 14.
* The second previous value is 7.

You already have validated the first two bullets with previous Examples, so there is no value in re-checking those features. You// **could**// add validation to existing examples to check for the second two values. I would advise against doing so because smaller tests tend to pinpoint problems better. Also, depending on the technology you are using, once a validation fails, subsequent validations are not checked in in RSpec, nor are the in most testing tools (FitNesse being one counter example).

Why is this last part important? When you've broken something, how big is the break? If your Examples fail, but each has one or a very small number of validations, you'll have a good idea of the span of the break. However, if you have Examples with dozens of validations (or many more), it is possible that an early validation will fail and you simply do not know if other validations would have failed. So while you think you only broke one thing, you broke 30 things. With many small tests, you'll have much higher fidelity information from which to move forward.

So with that in mind, you can continue with one a few more Examples working with <enter> to move towards validating the last two bullets.

**Example**
Here is an example that moves your production code just a little forward:
```ruby
    it "should have two operands available after one <enter>" do
      @calculator.available_operands.should == 2
    end
```

This Example suggests that after the first <enter> you should have two operands available, the one on the stack and the x_register.

* Create this example.

* Add the missing method with an empty implementation.

* Get the example to pass:
```ruby
      def available_operands
        2
      end
```

* Verify that all of your Examples now pass.

**Check-In**
* Check in your work.

**Refactor**
There was little added to either of your two files, so there's not much to refactor right now. However, did you notice that you now have two hard-coded methods? This might suggest a direction in which you want to push your Examples.

**Check-In**
No need, no change.

**Summary**
This Example really just extended the API of the RpnCalcualtor. You might be feeling like it is time to get busy because of the two pending methods.

# Example: Enter should increase the number of operands
The operator_count is hard-coded, this Example will make it harder to get away with that.

**Example**
```ruby
    it "should increase the operand count after each <enter>" do
      enter_number 13
      @calculator.available_operands.should == 3
    end
```

* Create this Example. Notice that since you added no new API calls to the RpnCalculator's interface, you can write the complete Example while following the second law of TDD/BDD.

* Verify that your Example fails:
```
    - should increase the operand count after each <enter> (FAILED - 1)
    
    1)
    'RPN Calculator Handling the <enter> key should increase the operand count after each <enter>' FAILED
    expected: 3,
         got: 2 (using ==)
    ./rpn_calculator_spec.rb:62:
    
    Finished in 0.026028 seconds
    
    9 examples, 1 failure
```

There are two ways to make this work. Here's one way to get this to pass (don't do this):
**Update initialize**
```ruby
      def initialize
        reset_input
        @op_count = 1
      end
```
**Update execute_function**
```ruby
      def execute_function(function_symbol)
        @x_register_should_reset = true
        @op_count += 1
      end 
```
**Update operand_count**
```ruby
      def available_operands
        @op_count
      end
```

Alternatively, you can use an array and actually store the values entered (notice, you change the same methods, add the same amount of code):
**Update initialize**
```ruby
      def initialize
        reset_input
        @operands = []
      end
```
**Update execute_function**
```ruby
      def execute_function(function_symbol)
        @x_register_should_reset = true
        @operands << x_register
      end
```
**Update operand_count**
```ruby
      def available_operands
        @operands.length + 1
      end
```

Which of these is the least amount of code that will get the Example to pass? Both involve 3 lines of code added to 3 methods. One uses an integer, one uses an array, and an array is more complex than an integer, though in Ruby they are both objects. 

Why do you try to do the least amount possible to get an Example to pass? That guideline is a "how" not a "what or a why". That is, it is a means to an end. What end? There are at least a few:
* Writing only enough code means you are less likely to over-design or gold-plate your solution.
* It also helps keep the production code actually covered by tests.

In this case, the Example will exercise all of the added code in both approaches. What about over-design? When are you over designing? Are you over designing when you are using a design pattern where just a simple direct relationship is adequate? Yes. Are you over-designing when you a complex object structure, when a small, flat structure will suffice? Yes. Is over designing always a problem? NO. The problem is not over design. The problem is that over design leads to more rework when you've guess wrong. And as a developer, I can say that I guess wrong often.

Why do developers guess wrong? Because we generally see problems differently that people who provide requirements. Here's an analogy. On the Nintendo WII, there's a feature called "Mii's". A Mii is an avatar. I only created one because I had to for some games. I created one and never change it. My wife and daughter both have crated more than one, they update their looks and I'm convinced if there was a game that simply let players updated their Avatars with clothes, and makeup, etc, they'd buy it. If you asked me, it's a waste of time. But that is one of the may appeals to the system. 

Problems change in ways that we often cannot anticipate simply because they are coming from a very different place. So when you write more code than is necessary at the moment, you're risking having to change code, or maybe make something that is designed for unnecessary flexibility, which could make the code harder to adapt to actual changes on the ground.

In this example, the domain is somewhat technical. Also, you can read the manual for RPN calculators and they will talk about a stack. So using an array as this code does is not diverging from the problem domain.

The second solution is a good one and it is not over design given the domain context.

* Implement the second solution.

* Verify that all of your Examples pass.

**Check-In**
* Check in your work.

**Refactor**
A quick review of the code shows a hard-coded top method. Now that you have a stack in place, can you simply return the "top" of the array?

* Experiment, change the implementation of top:
```
  def top
    @operands.last
  end 
```

* Run your Examples, everything still passes.

This works. You have changed the production code without breaking any tests, so this is a legitimate refactoring.

**Check-In**
* Check in simple refactoring.

**Summary**
You have moved towards a more complete solution by introducing an array to hold operands. Was this over design? No. You certainly could have used the integer and then the stack, but that seems somewhat dogmatic.

You also managed to get rid of the last hard-coded method, top. This one Example managed to move the production code forward quite a bit.

# Example: The right thing is on the stack
Right now, there's no way to know if what is on the stack is the right thing on the stack. Most of the pieces are in place, in fact even though the code is fully covered by the Examples, the Examples do not reflect fully what your production code can do. It is time to exploit that.

**Example**
Here is an example that verifies the stack behavior of the RpnCalculator:
```ruby
      describe "Stack" do
        it "should contain the correct items in the correct order" do
          enter_number 4
          enter_number 19
          enter_number -1
          @calculator.pop!.should == -1
          @calculator.pop!.should == 19
          @calculator.pop!.should == 4
        end
      end 
```

First observation: This code will not run because there is no pop! method on the RpnCalcualtor.

* Create the Example, verify that the test fails as expected.

* Add an empty pop! method to verify that the Example fails for the right reason:
```ruby
      def pop!
      end
```

* Run your Examples.

* Implement pop!:
```ruby
      def pop!
        @operands.pop
      end
```

* Verify that your Examples pass.

**Check-In**
* Check in your work.

**Refactor**
There has been a slowly-growing code small, Feature Envy, but hold off until just a bit longer. The "describe" part of the last Example is a huge clue.

**Check-In**
No need, you did not do any refactoring.

**Summary**
You have added an example to verify that in fact the right values are getting put onto the stack. Your RpnCalculator is growing, but at what point is the RpnCalcualtor suffering from too much design debt? It is right now, but you'll see that after the next Example.

# Example: What happens with an 'Empty' stack?
The stack on an RpnCalculator is conceptually filled with 0's when it has no values. In fact, it is literally filed with 0's. So if you check the top of your RpnCalculator, calculator, it should return 0 when it is empty. The same is true for pop!. It should return 0 if the stack is empty.

**Example**
These two are closely related, so here, for the first time, are two complete examples that you will fix at the same time.

```ruby
    it "should return 0 when pop!'ing from an empty stack" do
      @calculator.pop!.should == 0
    end

    it "should return 0 for top when stack empty" do
      @calculator.top.should == 0
    end
```

* Create these Examples, they will both fail the same way:
```
    - should return 0 when pop!'ing from an empty stack (FAILED - 1)
    - should return 0 for top when stack empty (FAILED - 2)
    
    1)
    'RPN Calculator Stack should return 0 when pop!'ing from an empty stack' FAILED
    expected: 0,
         got: nil (using ==)
    ./rpn_calculator_spec.rb:77:
    
    2)
    'RPN Calculator Stack should return 0 for top when stack empty' FAILED
    expected: 0,
         got: nil (using ==)
    ./rpn_calculator_spec.rb:81:
    
    Finished in 0.031744 seconds
    
    12 examples, 2 failures
```

* When code pop's values off of an empty array, the array returns nil. The same thing happens when code calls top. This will fix both of your failing Examples:
```ruby
      def top
        @operands.length > 0 ? @operands.last : 0
      end
          
      def pop!
        @operands.length > 0 ? @operands.pop : 0
      end
```

* Make these changes and verify all of your Examples are passing.

**Check-In**
Check in, it is finally time to get busy removing Feature Envy and get closer to conforming to the Single Responsibility Principle.

**Refactor**
Review the following methods: pop!, top, available_operators. What do they all have in common? All three of these methods deal exclusively with the @operands instance variable.

Is this bad? Yes, it suggests that the RpnCalculator is doing work that should be pushed into the array. What? That's right, the array is not pulling its weight. This is a legitimate case for wrapping a collection class and giving it domain-specific behavior (semantics). 

There is a name for methods in classes working exclusively with data in other objects. It is a code smell called [Feature Envy](http://sis36.berkeley.edu/projects/streek/agile/bad-smells-in-code.html#Feature+Envy). 

Normally, at this point I'd say "you cannot change a system-defined class, so you either need to subclass or wrap and adapt". That is, create a subclass of Array, change the top method and add the pop method. Or, create a new class called something like OperandStack that holds a single instance of an array.

However, in Ruby, classes are never closed. You can add methods to a class anytime. Adding methods to Array is a bad idea since the Array class is used all over the place. However, Ruby also allows you to add methods to an instance. 

This is crazy. Here is an example of how you could do that (don't do this):
```ruby
      def create_operand_stack
        stack = []
        def stack.pop!
          return length > 0 ? super : 0
        end
    
        def stack.top
          return length > 0 ? last : 0
        end
        stack
      end
    
      custom_stack = create_operand_stack
    
      puts custom_stack.top == 0
      puts custom_stack.pop! == 0
```

The result from running this will be "true" printed twice. But if you try to simply create an array, you will not see the same results. Neither method is defined on the Array class.

Barring extending a single instance, it is certainly reasonable to create an OperandStack class, move these methods into it and then change the implementation of the RpnCalcualtor to use the OperandStack.

Before you start, did you notice that the Context for the last three Examples was "Stack"? That's a big clue that there's a missing class.

* There are 3 Examples in the "Stack" context. Move the first one out into "Handling the <enter> key" context.

* Verify that all of your Examples are still passing.

Next, you are going to do some "big" changes. It won't take long, but this will be the longest amount of time the tutorial will have you work before you can see your Examples running. Note your reaction to the change.

* Change the structure of rpn_calculator_spec.rb:
```ruby
    describe "RPN Calculator" do
      ...
    end
    
    describe "Stack" do
      ...
    end
```

If you ran your examples now, the ones in the Stack context will fail. Why? Because they no longer pick up the automatically-created calculator object form the before in the "RPN Calculator" context.

* Update the "Stack" context:
```ruby
    describe "OperandStack" do
      before (:each) do
        @stack = OperandStack.new
      end
    
      it "should return 0 when pop!'ing from an empty stack" do
        @stack.pop!.should == 0
      end
    
      it "should return 0 for top when stack empty" do
        @stack.top.should == 0
      end
    end
```

This still won't pass. There's no OperandStack class.

* Move the entire OperandStack context into a new file called "operand_stack_spec.rb".

* Now your rpn_calculator_spec will pass:
```bash
    Macintosh-7% spec -f s -c rpn_calculator_spec.rb     
    
    RPN Calculator
    
    RPN Calculator Basic Creation
    - should be non-null after creation
    
    RPN Calculator Handling integers
    - should store a series of digits in the x register
    - should handle a string of digits with an embedded .
    
    RPN Calculator Handling the <enter> key
    - should copy x_register to top of stack
    - should cause next digit to reset the x_register
    - should allow the x_register to be <entered> again
    - should only reset after the first digit and not subsequent digits
    - should have two operands available after one <enter>
    - should increase the operand count after each <enter>
    - should contain the correct items in the correct order
    
    Finished in 0.027715 seconds
    
    10 examples, 0 failures
```

* Next, create a new class called OperandStack in a file called opeand_stack.rb:
```ruby
    class OperandStack
      def initialize
        @operands = []
      end
      
      def top
        @operands.length > 0 ? @operands.last : 0
      end
    
      def available_operands
        @operands.length + 1
      end
    
      def pop!
        @operands.length > 0 ? @operands.pop : 0
      end
      
      def <<(value)
        @operands << value
      end
    end
```

Note that these are mostly just//** copies**// of methods from RpnCalculator. There is one new method, <<, which just delegates to a method of the same name.

* Verify that your operand_stack_spec.rb now passes:
```
    Macintosh-7% spec -f s -c operand_stack_spec.rb
    
    OperandStack
    - should return 0 when pop!'ing from an empty stack
    - should return 0 for top when stack empty
    
    Finished in 0.013598 seconds
    
    2 examples, 0 failures
```

Did you fully test this class? No. What you instead did was extract a class and then copy the tests that were directly testing it. You are not writing new code, you are refactoring the solution.

* Run all of your Examples, everything should be passing:
```
    Macintosh-7% spec -f s -c *_spec.rb
    
    OperandStack
    - should return 0 when pop!'ing from an empty stack
    - should return 0 for top when stack empty
    
    RPN Calculator
    
    RPN Calculator Basic Creation
    - should be non-null after creation
    
    RPN Calculator Handling integers
    - should store a series of digits in the x register
    - should handle a string of digits with an embedded .
    
    RPN Calculator Handling the <enter> key
    - should copy x_register to top of stack
    - should cause next digit to reset the x_register
    - should allow the x_register to be <entered> again
    - should only reset after the first digit and not subsequent digits
    - should have two operands available after one <enter>
    - should increase the operand count after each <enter>
    - should contain the correct items in the correct order
    
    Finished in 0.029495 seconds
    
    12 examples, 0 failures
```

**Intra-refactoring Check-In**
* All of your Examples are passing, right? Now is a great time to check in before moving to the next step.

**Back to refactoring**
Now you should refactor the RpnCalcualtor to use your newly-created class. As with other refactorings, you'll add, duplicate, validate and then remove code.

* Add "require 'operand_stack' to the beginning of your rpn_calculator.rb file.

* Update the initialize method:
```ruby
      def initialize
        reset_input 
        @operands = []
        @operand_stack = OperandStack.new
      end
```

* Run your Examples, everything should still pass.

* Update execute_function to duplicate the work of storing the x_register:
```ruby
      def execute_function(function_symbol)
        @x_register_should_reset = true
        @operands << x_register
        @operand_stack << x_register
      end
```

* Run your Examples, everything should still pass.

* Update top:
```ruby
      def top
        @operand_stack.top
      end
```

* Run your Examples, everything should still pass.

* Update pop!:
```ruby
      def pop!
        @operand_stack.pop!
      end
```

* Reviewing available_operands, you notice that there's no length method on Operand stack. So add it:
```ruby
      def length
        @operands.length
      end
```

* Run your Examples, everything should still pass.

* Update available_operands:
```ruby
      def available_operands
        @operand_stack.length + 1
      end
```

* At this point, you can remove all code that refers to @operands (you'll change 2 places).

* Run your Examples, everything should still pass.

**Check-In**
Whew! That was a big refactoring. Check your code in!

**Summary**
This was a big change. You had a violation of feature envy. The RpnCalculator was doing a lot of work with information stored in an Array. So you created a class to represent that work, OperandStack, and moved Examples around to get everything situated.

If you have a decent IDE, these kinds of refactorings are quick, easy and fairly reliable. If not, then like Robert Martin tweeted:
> //**It's like riding a horse on the interstate.**//

This cleaned up your RpnCalculator class but there's still more to be done. The implementation of execute_function is wanting to do more (or less). 

Is there a problem with how you are testing OpernadStack? There are only 2 Examples but quite a few methods for which you do not have unit tests. Those methods are in fact used from the RpnCalculator so you have coverage. However, if the OperandStack is used by other classes, then the testing is not adequate. Maybe you should consider a nested class. Maybe you should write more Examples to get its "contract" fully specified.

When you are just learning TDD or BDD, this kind of stuff is going to happen. Let's leave it alone for now and see what happens.

[[include page="sidebar_start"]][[include page="ruby.sidebar.WrappingCollections"]][[include page="sidebar_end"]]

**The Classes So Far**
Here's one example of what all of your code should look like about now.
**rpn_calculator_spec.rb**
```ruby
    require 'rpn_calculator'
      
    describe "RPN Calculator" do
      before(:each) do
         @calculator = RpnCalculator.new
      end 
        
      def enter_number(number) 
        number.to_s.each_char{ |d| @calculator.digit_pressed d }
        @calculator.execute_function(:enter)
      end
      
      describe "Basic Creation" do
        it "should be non-null after creation" do
          @calculator.should_not be nil
        end
      end
      
      describe "Handling integers" do
        it "should store a series of digits in the x register" do
          enter_number 42
          @calculator.x_register.should == 42
        end
    
        it "should handle a string of digits with an embedded ." do
          enter_number 13.31
          @calculator.x_register.should == 13.31
        end
      end
    
      describe "Handling the <enter> key" do
        before(:each) do
           enter_number 654
        end
    
        it "should copy x_register to top of stack" do
          @calculator.top.should == 654
        end
    
        it "should cause next digit to reset the x_register" do
          @calculator.digit_pressed 1
          @calculator.x_register.should == 1
        end
    
        it "should allow the x_register to be <entered> again" do
          @calculator.execute_function(:enter)
          @calculator.top.should == 654
          @calculator.x_register.should == 654
        end
    
        it "should only reset after the first digit and not subsequent digits" do
          enter_number 27
          @calculator.x_register.should == 27
        end
    
        it "should have two operands available after one <enter>" do
          @calculator.available_operands.should == 2
        end
    
        it "should increase the operand count after each <enter>" do
          enter_number 13
          @calculator.available_operands.should == 3
        end
    
        it "should contain the correct items in the correct order" do
          enter_number 4
          enter_number 19
          enter_number -1
          @calculator.pop!.should == -1
          @calculator.pop!.should == 19
          @calculator.pop!.should == 4
        end
      end
    end
```

**rpn_calculator.rb**
```ruby
    require 'operand_stack'
    
    class RpnCalculator
      def initialize
        reset_input
        @operand_stack = OperandStack.new
      end
    
      def digit_pressed(digit)
        reset_input if @x_register_should_reset
        @input << digit.to_s
      end
    
      def reset_input
        @input = ''
        @x_register_should_reset = false
      end
    
      def x_register
        @input.to_f
      end
    
      def execute_function(function_symbol)
        @x_register_should_reset = true
        @operand_stack << x_register
      end
    
      def top
        @operand_stack.top
      end
    
      def available_operands
        @operand_stack.length + 1
      end
    
      def pop!
        @operand_stack.pop!
      end
    end
```

**operand_stack_spec.rb**
```ruby
    require "operand_stack"
      
    describe "OperandStack" do
      before (:each) do
        @stack = OperandStack.new
      end 
        
      it "should return 0 when pop!'ing from an empty stack" do
        @stack.pop!.should == 0
      end 
        
      it "should return 0 for top when stack empty" do
        @stack.top.should == 0
      end 
    end 
```

**operand_stack.rb**
```ruby
    class OperandStack
      def initialize
        @operands = []
      end 
        
      def top
        @operands.length > 0 ? @operands.last : 0
      end
      
      def available_operands
        @operands.length + 1
      end
    
      def pop!
        @operands.length > 0 ? @operands.pop : 0
      end
      
      def <<(value)
        @operands << value
      end
      
      def length
        @operands.length
      end
    end 
```

# Example: A Binary Operator
Some time ago you created your first Example to exercise the <enter> key. That resulted in the following method:
```ruby
      def execute_function(function_symbol)
        @x_register_should_reset = true
        @operand_stack << x_register
      end
```

Now it is time start executing more functions. The first function you'll support is +.

**Example**
Here is a basic example to get started:
```
      describe "Basic Math Operators" do
        it "should add the x_regiser and the top of the stack" do
          enter_number 46
          @calculator.execute_function(:+)
          @calculator.x_register.should == 92
        end
      end
```

Why is the result 92? The support method enter_number
* Create this Example and run it. The result is not quite right:
```
    1)
    'RPN Calculator Basic Math Operators should add the x_regiser and the top of the stack' FAILED
    expected: 700,
         got: 46.0 (using ==)
    ./rpn_calculator_spec.rb:79:
    
    Finished in 0.03118 seconds
    
    13 examples, 1 failure
```

* Getting this to pass is a "snap":
```ruby
      def execute_function(function_symbol)
        if function_symbol == :enter
          @x_register_should_reset = true
          @operand_stack << x_register
        elsif
          @input = 92.to_s
        end
      end
```

* Get your Examples passing.

**Check-In**
Check in your code. You are about to refactor.

**Refactor**
OK, the method you just updated, execute_function, is a bit of a mess. It does two thigns:
* Determine which function to perform
* Actually perform the work.

So you'll separate this for now.

* Extract two methods, enter, +:
```ruby
      def enter
        @x_register_should_reset = true
        @operand_stack << x_register
      end 
          
      def +
        @input = 92.to_s
      end
```

* Make sure your Examples still pass.

* Update the execute_function to use those two methods:
```ruby
      def execute_function(function_symbol)
        if function_symbol == :enter
          enter
        else
          self.+
        end
      end
```

* Update your RpnCalculator, verify that your Examples are all passing.

**Check-In**
This is all the refactoring you'll do right now. More is on the horizaon.

**Summary**
You've improved the execute_function but you have a stubbed-out + method. If you know a bit of Ruby, you might be chomping at the bits to evaluate a symbol, or use lambda and a hash. The code will get where it will, however, based on the Examples, rather than speculation.

# Example: Work on +
What should happen with + when there are no operands? Should it fail? Should it result in 0? If you're simulating an HP calculator, the result is 0. However, what it should do will be defined by the Examples you write.

**Example**
```ruby
    it "should result in 0 when the calculator is empty" do
      @calculator.execute_function(:+)
      @calculator.x_register.should == 0
    end
```

* Create this Example. Verify that it fails.

* Update the + method to actually do some work.
```ruby
      def enter
        @x_register_should_reset = true
        @operand_stack << x_register
      end
```

* Run your Example, make sure it works.

**Check-In**
Check in your work.

**Refactor**
Something is starting to look strange. You may have noticed it the first time your code "supported" +. The following line:
```ruby
    @input = result.to_s
```

I'm not sure what to do with that yet because there's not enough code to make many decisions. It might be that the code will stay put. It just seems a bit strange.

**Check-In**
No refactoring done, no need to check in again.

**Summary**
The + method no does work. It has one strange line, and there's still the issue of whether it modifies the stack correctly or not. Another thing occurred to me as well. After any operator, the x_register should be in "reset" mode.

# Example: x_register in reset mode after +
Like <enter>, after perform +, the next character typed should clear the x_register and write into it. That seems like a good thing to check next.

**Example**
```ruby
    it "should reset the x_register after +" do
      enter_number 99
      @calculator.execute_function(:+)
      @calculator.digit_pressed 8
      @calculator.x_register.should == 8
    end
```

* Create this Example. Run it and you'll notice that it fails:
```
    1)
    'RPN Calculator Basic Math Operators should reset the x_register after +' FAILED
    expected: 8,
         got: 9.08 (using ==)
    ./rpn_calculator_spec.rb:91:
    
    Finished in 0.032479 seconds
    
    16 examples, 1 failure
```

* Make a quick change to the + method to fix this:
```ruby
      def +
        lhs = @operand_stack.pop!
        rhs = x_register
        result = lhs + rhs
        @input = result.to_s
        @x_register_should_reset = true
      end
```

* Run your Examples, they should all pass.

**Check-In**
Check in your code. This time you will do a little bit of refactorig.

**Refactor**
There is a duplicated line in the enter and + methods:
```ruby
    @x_register_should_reset = true
```

At the very least, this line of code could be put into a well-named method.

* Create a new method (if your IDE supports Extract method, use it):
```ruby
      def set_override_mode
        @x_register_should_reset = true
      end
```

* Make sure your Examples still pass.

* Update the enter and + methods to call this new method.

* Make sure your Examples still pass.

**Check-In**
Even though small, you did make a change to your solution while keeping your Examples passing, so check in your work.

**Summary**
There appears to be a pattern emerging. Two functions, enter and +, both of which change the calculator into "override_mode". Will other functions look like this? Yes. Will you be able to remove this duplication as well? Yes.

# Example: What about the stack?
Some time back the tutorial asked about whether the stack was treated properly. You could have put those checks into another Example, but the rationale for not doing that is to keep your tests small and focused for better pinpointing of problems and better assessment of the size of a break.

It's time to come back to that, if for no other reason than to expression a "contract" that the + method (and all binary operators) will need to follow.

**Example**
Here's an example:
```ruby
    it "should should reduce the stack by one" do
      enter_number 9
      enter_number 8
      @calculator.execute_function :+
      @calculator.available_operands.should == 2
    end
```

* Create this example.

* Run your Examples. Notice it passes.

Did we code too much or are we validating a behavior? Would it have been possible to write less code and still keep other tests passing? Maybe, the design is such that it's getting harder to do the wrong thing. In any case, this seems like an OK Example - if maybe a bit off target.

**Check-In**
Check in your work.

**Refactor**
There's starting to be a bit of cruft in the Examples and maybe something in the RpnCalcualtor. You might already be noticing yourself. For example, in RpnCalculator, to set the "x_register" the code does the following:
```ruby
    @input = result.to_s
    set_override_mode
```
That is not self evident. In addition, getting two operands for a binary operator involves two very different expressions:
```ruby
    lhs = @operand_stack.pop!
    rhs = x_register
```

The last two Examples are OK, though do you believe that the differences between digit_pressed and enter_number is obvious?

Start by making an improvement to the bottom part of the + method:
* Add a new method that is private (since private sets subsequent methods, make this the last method in your RpnCalculatorClass):
```ruby
      private
      def reset_x_register(value)
        @input = value.to_s
        set_override_mode
      end
```

* Verify your Examples still pass.

* Update +:
```ruby
      def +
        lhs = @operand_stack.pop!
        rhs = x_register
        result = lhs + rhs
        reset_x_register result
      end
```

* Verify your Examples still pass.

* Check in this refactoring.

The next thing you might consider is how to better document getting parameters for +. I tried a few ways but none seemed to really make the code better. Just differently convoluted. You might try yourself (and even succeed). However, I already have an idea of where I want this code to go, so rather than any more refactoring, I want to move into other operators.

**Check-In**
* Check in your refactoring.

**Summary**
You now have the basics of the + operator worked out. You make resetting the x_register at least a little better. Now it is time to add some more operators to see how this current solution grows.

# Example: Support for a new binary operator, -
Adding support for - will allow you to see how your solution grows as new math functions are supported. You have already vetted + fairly well, so adding - should be a snap.

**Example**
```ruby
    it "should subtract the first number entered from the second" do
      enter_number 4
      @calculator.digit_pressed 9
      @calculator.execute_function :-
      @calculator.x_register.should == -5
    end
```

At this point, hopefully you are getting bothered by the difference between lines that start with an @ and ones that do not. Add that to your punch-list.

* Create this example. Run your examples and verify that they do not pass.

Were you surprised by the result? The results suggest that instead of -, your calculator performed +. Why is that?

A quick review of execute_function should give you a clue:
```ruby
      def execute_function(function_symbol)
        if function_symbol == :enter
          enter
        else
          self.+
        end
      end
```

So if something is not :enter, then it is :+. Add that to your punch-list:
* Your execute_function should fail if the operator is not found.

* However, you are not working on that Example. So update this method to call -:
```ruby
      def execute_function(function_symbol)
        if function_symbol == :enter
          enter
        elsif function_symbol == :+
          self.+
        elsif function_symbol == :-
          self.-
        end
      end
```

* Now your code is missing the function - (which you discovered by running your Examples, right?), so add it:
```ruby
      def -
      end
```

* Run your Example, now it should be failing for the right reason (value did not match).

You have two obvious choices here:
* Create a method that is hard-coded to return the correct value.
* Create a duplicate of the + method and change it to be -

* Rather than following the third rule, you can safely duplicate the + method and update it (you'll be refactoring this soon anyway):
```ruby
      def -
        lhs = @operand_stack.pop!
        rhs = x_register
        result = lhs - rhs
        reset_x_register result
      end
```

* Verify that all of your Examples are passing.

**Check-In**
Check in, you have a lot on your punch-list.

**Refactor**
There are several things on your punch-list:
* Adding a new operator requires too much work: update a method, add a new method, and write that method. More importantly, it requires changing an existing method which is in direct violation of the open/close principle.
* The execute_function does not indicate if the function does not exist.
* There is duplicated code between the + and - methods. (This was on your list, wasn't it?)
* The difference between enter_number and digit_pressed seems isn't obvious.
* The Examples should not have such a mix of lines that use fields and support methods.

Looks like you have a lot of work.

First, if you have been chomping at the bits to fix execute_function, now is the time to do so:

* Update execute_function:
```ruby
      def execute_function(function_symbol)
        self.send(function_symbol)
      end
```

* Run your Examples to verify that they all pass.

This is a Ruby idiom. The original approach of passing in a symbol screamed for this solution. This has several effects
* Removes the need to update this method ever again
* Requires, however, that the functions of the calculator are actually methods on the class.
* Your code now will fail if you attempt to send a method that is unknown
* Allows invocation of (0 argument) private methods 

Even so, this is an improvement and it follows a Ruby idiom.

* Check in your change.

Next, you'll remove the violation of the DRY principle:

* Add a new private method to your RpnCalculator method:
```ruby
      def execute_binary_operator
        lhs = @operand_stack.pop!
        rhs = x_register
        result = yield lhs, rhs
        reset_x_register result
      end
```

* Make sure your Examples still pass.

* Update the + method:
```ruby
      def +
        execute_binary_operator { |lhs, rhs| lhs + rhs }
      end
```

* Run your Examples, make sure they still pass.

* Update the - method:
```ruby
      def +
        execute_binary_operator { |lhs, rhs| lhs + rhs }
      end
```

* Run your Examples, make sure they still pass.

Looks like you've managed to fix the first three things on your punch-list with a few quick changes in your code. Of course, you still do not have an Example that captures what happens when you execute a bogus method, the code should handle that now.

Before calling this refactoring session done, clean up your Examples to make this a bit more self-explanatory.

* Add some new support methods (put these at the same place as enter_number):
```ruby
      def type(number)
        number.to_s.each_char{ |d| @calculator.digit_pressed d }
      end
    
      def press(a_symbol)
        @calculator.send(a_symbol)
      end
    
      def validate_x_register(expected)
        @calculator.x_register.should == expected
      end
```

* Make sure your examples still pass.

* Update "should subtract the first ...":
```ruby
    it "should subtract the first number entered from the second" do
      type 4
      press :enter
      type 9
      press :-
      validate_x_register -5
    end 
```

* Run your Examples, they should all pass.

[[include page="sidebar_start"]][[include page="ruby.sidebar.ExampleStylesAndYourAudience"]][[include page="sidebar_end"]]

However, just to place a (somewhat arbitrary) stake in the ground, here's an updated version of rpn_calculator_spec.rb:
```ruby
    require 'rpn_calculator'
    
    describe "RPN Calculator" do
      before(:each) do
         @calculator = RpnCalculator.new
      end
    
      def type(number)
        number.to_s.each_char{ |d| @calculator.digit_pressed d }
      end
    
      def press(a_symbol)
        @calculator.execute_function a_symbol
      end
    
      def validate_x_register(expected)
        @calculator.x_register.should == expected
      end
    
      def validate_top(expected)
        @calculator.top.should == expected
      end
    
      def validate_operands(expected)
        @calculator.available_operands.should == expected
      end
    
      def validate_pop!(expected)
        @calculator.pop!.should == expected
      end
    
      describe "Basic Creation" do
        it "should be non-null after creation" do
          @calculator.should_not be nil
        end
      end
      
      describe "Handling integers" do
        it "should store a series of digits in the x register" do
          type 42
          press :enter
          validate_x_register 42
        end
    
        it "should handle a string of digits with an embedded ." do
          type 13.31
          validate_x_register 13.31
        end
      end
    
      describe "Handling the <enter> key" do
        before(:each) do
          type 654
          press :enter
        end
    
        it "should copy x_register to top of stack" do
          validate_top 654
        end
    
        it "should cause next digit to reset the x_register" do
          @calculator.digit_pressed 1
          @calculator.x_register.should == 1
        end
    
        it "should allow the x_register to be <entered> again" do
          press :enter
          validate_top 654  
          validate_x_register 654
        end
    
        it "should only reset after the first digit and not subsequent digits" do
          type 27
          validate_x_register 27
        end
    
        it "should have two operands available after one <enter>" do
          validate_operands 2
        end
    
        it "should increase the operand count after each <enter>" do
          type 13
          press :enter
          validate_operands 3
        end
    
        it "should contain the correct items in the correct order" do
          type 4
          press :enter
          type 19
          press :enter
          type -1
          press :enter
          validate_pop! -1
          validate_pop! 19
          validate_pop! 4
        end
      end
    
      describe "Basic Math Operators" do
        it "should add the x_regiser and the top of the stack" do
          type 46
          press :enter
          press :+
          validate_x_register 92
        end
    
        it "should result in 0 when the calculator is empty" do
          press :+
          validate_x_register 0
        end
    
        it "should reset the x_register after +" do
          type 9
          press :+
          type 8
          validate_x_register 8
        end
    
        it "should should reduce the stack by one" do
          type 9
          press :enter
          type 8
          press :enter
          press :+
          @calculator.available_operands.should == 2
        end
    
        it "should subtract the first number entered from the second" do
          type 4
          press :enter  
          type 9
          press :-
          validate_x_register -5
        end
      end
    end
```

* Get to where all of your Examples are passing.

**Check-In**
* Check in your work.

**Summary**
That was a lot of refactoring. Maybe the tutorial let you collect too much design debt. However, this will happen and it is up to you to pick up the slack.

You made several important changes:
* The execute_function method now uses the send method to execute a symbol, so you will not have to update it so long as new functions are added to the RpnCalculator clss.
> As a result of this change, your execute_function will indicate errors better than when you added an Example for - (which caused + to get called)
* You created an execute_binary_operator method that makes adding binary operators a one-line lambda expression.
> As a result, you removed some DRY violations.
* You made a significant change to how you write your examples.

What's left? There's still the issue of documenting what happens when you attempt to execute a missing function and the rpn_calculator_spec.rb file is getting large.

This second issue is not addressed in this tutorial.

# Example: Handling missing functions
So what happens when your calculator is asked to execute an unknown function?

**Example**
```ruby
      describe "Handling Functions" do
        it "should raise an exception if attempting to run missing function" do
          lambda { press :bogus_function_name }.should raise_error NoMethodError
        end
      end
```

* Create this new Context and verify that it passes.

This Example documents that you expect the behavior of throwing a NoMethodError when sending a bogus method name to your calculator.

**Check-In**
* Check in your code.

**Refactor**
You just did a bunch of refactoring. You only added an Example to capture something that was added during refactoring but not explicitly spelled out in any Example. So nothing new to refactor.

**Check-In**
You have no changes to check in.

**Summary**
This example really just captured something about your system that was not explicitly spelled out anywhere. This probably indicates too much change done during refactoring. It would have been possible for you to wait to change the implementation of execute_function and first write this Example.

You won't always figure out to do that, so you've managed to recover gracefully.

# Example: Add support for * and /
You have a working design for + and -, adding * and / should be a snap. First your calculator will support multiplication.

**Example**
```ruby
    it "should multiply the first number entered by the second" do
      type 3
      press :enter 
      type 9
      press :*
      validate_x_register 27
    end
```

* Create this example. Run it and verify that your test fails with a missing method.

* Create the method:
```ruby
      def *
        execute_binary_operator { |lhs, rhs| lhs * rhs }
      end 
```

* Verify that your Examples pass.

That was so quick, before checking in add one more example:
```ruby
    it "should divide the first number entered by the second" do
      type 9
      press :enter
      type 3
      press :/
      validate_x_register 3
    end
```

* Add the missing method:
```ruby
      def /
        execute_binary_operator { |lhs, rhs| lhs / rhs }
      end
```

* Verify that your Examples pass.

**Check-In**
Check in your work.

**Refactor**
You might review your code and find some things to refactor. One issue is the size of the calculator. Right now it is not too bad, but it's going to get bigger. Each time you add a function, it grows.

**Check-In**
Nothing new to check in.

**Summary**
You've just finished out the basics for your calculator.


----
RUNNING OUT, COPY AGAIN
----

# Example x
**Overview**
**Example**
**Check-In**
**Refactor**
**Check-In**
**Summary**

# Example x
**Overview**
**Example**
**Check-In**
**Refactor**
**Check-In**
**Summary**

<span class="back_button">[Back]({{ site.pagesurl }}/ruby.tutorials)</span>
