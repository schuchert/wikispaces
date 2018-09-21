---
title: Rpn_Calculator.WithRefactoringAndPatterns
---
Describe the calculator (unlimited stack BTW, but a stack of 4 is a nice option)
Ask them what they'd like to see first
Get an idea of what they want for a system boundary
* It is something receiving messages like 34 <enter>
* it is something receiving a series of characters like 3, 4, <enter> 2, 3 +
* I've done it both ways. I like the first better.

Then I start demonstrating TDD in the raw. I don't describe the steps, just demo it.
I have them follow me and keep up.
I do this for at least:
* Adding numbers
* Subtracting Numbers
* factorial
* If I have fast students, they can do multiplication and division

It is important to have operators with different arity, (binary, unary, for example)

Next, I have a discussion about the "thickness" of the API. All along, I'm asking them
what the interface should be and then coding it in a test. Typically you'll have:
* enter(aNumber)
* plus()
* minus()
* factorial()

Note, they need tests for things like:
* empty stack, add, what happens? stack filled with 0's so 0
* fully stack (if you want to limit it)

As you make this work, you'll notice feature envy in handling the stack.
* !!! Extract class, WRAP stack class. General rule of thumb, wrapping
* collections to add domain-specific semantics typically makes code
* cleaner and removes redundancy!

Fix that problem.
* Discussion: do we need to test stack directly?
* Question: Tests involving "empty/full" stack, do they still belong in calculator? I say no.
* Move them -> keep tests clean and consistent with system design.

Notice how the API is getting wide? Violation of Open/Closed. How can we fix? I guide
them to:
* execute("+")
  * No enums to select the operator - still compile-time
*** Note, you now have the forces for both strategy and factory...
OK, so refactor to execute("+")
* add method for plus
* update a plus test
* Continue
* Make the methods plus, minus, ... private ( or better yet, roll them in to execute method)

Long Method/SRP violation, execute method is both selecting what to do and doing it.
Problem, as you add more features, you'll keep adding more and more code.
Discuss Strategy Pattern.
Implement Plus as strategy (do not use an interface YET)
* Before you do, discuss API. Strategy requires consistent API, callers should not,
* for example, select method based on number of parameters. So single API. Options:
  * Calculator asks for number of parameters (feature envy really), builds array
*** and passes it in.
  * Send your Extracted OperatorStack to the strategy, it removes appropriate number
*** of parameters, and puts result(s) back on
* Now actually implement plus.
* Replace plus impl in calculator class.
Implement minus.
Review both, notice duplication. Leave it for now.
Finish all existing functions (fewer is better here, so I don't do divide and multiply generally)

You have strategies. You have duplication. You have too much responsibility in calculate("") method.

Make all strategies implement interface (extract interface).
Change long method... calculate method:
* Split selecting operation from execution.
  * You can do this with strategy interface (math operator)
* Extract selection of operator into a factory (just a concrete factory), abstract factory later
* 
Now, the factory was just hard-coded. Write a test that shows an "invalid operator" exception
* (runtime) gets thrown if factory does not find operator.
* Question: How can you be sure that operator won't be added?
* Use dependency injection/IoC to allow factory to be set (I prefer ctor, but setter is fine)
* Now create a saboteur factory that always throws exception upon lookup.
* Test is isolated. Introduce interface or abstract class --> abstract factory

OK, there's still duplication in plus and minus. We can introduce the template method pattern.
The abstract BinaryOperator class:
* acquires two operators
* calls implementation method with two parameters
* gets results from call
* stores results
BUT WAIT. That's an abstract class, right? So use test doubles (spys specifically) to make sure
* that the abstract class works as expected.
* Test 1: implementation method called with correct parameters
* Test 2: result returned stored in stack
Update minus, plus to use abstract class. Tests should still pass.
Add Multiply/Divide.

Now, demonstrate OCP: create a factory that uses words like plus instead of +. Plug it in to
* the calculator. You've just fundamentally "changed" the calculator's behavior without
* changing the calculator.

This is a good stopping point, but you can do much more.

I have them implement two functions:
* sum stack -> takes all values off stack and replaces with sum
* (using tdd to write it)

* prime factors -> takes one value, puts many back:
  * values < 2 -> just removed, stack should reduce in size by one
  * 2 -> 2
  * 3 -> 3
  * 4 -> 2, 2
  * 5 -> 5
  * (these are the test cases and I'd use them)
  * 6 -> 2, 3
  * 7 -> 7
  * 8 -> 2, 2, 2
  * 1024 -> 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 (10 total)

* Composite pattern. Add composite, then create one that is:
  * sum of prime factors
*** and and one that is
  * prime factors of sum


 
