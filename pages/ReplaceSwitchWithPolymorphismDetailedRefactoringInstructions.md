---
title: ReplaceSwitchWithPolymorphismDetailedRefactoringInstructions
---
## Introduciton
These are rough notes I kept while performing the refactoring. They may not make sense to you. You have a few options:
* Review the refactorings in Martin Fowler's book
* Try to work through the steps
* Send me an email and ask
* If I get enough requests, I'll actually write this up as a tutorial, rather than notes. I'd do it now but that's probably several hours of work to do it justice and I want to make sure there's enough interest to make it worth my time. If there is interest, I'm happy to spend the time.
## Overview
* **What are we doing?** Replacing a switch statement with polymorphism
* **What is polymorphism?** There are many definitions. Here's what I'm using: **same message different method, or same request, different response**, in C++, this means we'll have a base class with at least one (and really 2) virtual methods (virtual destructor + at least one other method). We'll then have subclasses that implement that behavior as appropriate. In our case, we have three different top-level rates offered to customers, which is reflected in this method with its three cases. So we'll end up with some kind of rate calculator base class and three sub classes, one for each of: consumer, business, industrial. The request will be calculatedRate. Don't confuse that request (message) with a particular response (method). The response will depend on what kind of object receives the request, a consumer rate calculator, business rate calculator or industrial rate calculator. When we construct a customer, we’ll use dependency injection to give it one of these three strategies.
* **Are there any preliminary steps?** Yes, Self encapsulate type code before replace conditional with polymorphism (both of these are mentioned in Refactoring by Fowler
## Part 1: Replace Type Code with State/Strategy (Refactoring Page 227)
* Self Encapsulate type code (preliminary refactoring, page number??)
  * Add implicit inline get type in customer
  * Add setter as well
  * Update rate calculator to use method
  * Add setter, make field private
  * Update all tests
*** Three places in rate calculator test also need updating(37, 61, 81)
  * Run all the tests
* Create new class for type code
  * **What does this represent?** We use it for determining which kind of rate to calculate, so we use the type to determine how to calculate. This is like a strategy; different algorithms for calculating, so we're creating different kinds of rate calculators.
  * Create Rate Calculator
*** Rename RateCalculator --> RateCalculatorOld
*** Create Rate Calculator Class In same file
*** Make sure to provide implementation for dtor
*** Add subclasses of the state: BusinessRC, ConsumerRc, IndustrialRC
*** Run tests
*** Create abstract query in RC and implement in subclasses
**** Each get type returns typecode
  * Add RateCalculator * to Customer
  * Update Customer class to delegate to that method
  * Update setter to use correct sub-type
  * Run all tests - get null pointer exception...
  * Add set of customerType in blank customer test
  * Run tests
## Repalce conditional with polymorphism
* Put calculateRate method in RateCalculator
  * Copy calculatRate into CustomerType
  * Create a local instance of RateCalculator for now...
*** add to header file
*** Update rateCalculatorOld to use RateCalculator from customer
  * Add calculate rate to customer
  * Update tests to use customer instead of RateCalculator
*** Remove RateCalculator member field and #include from test
  * Remove calculateRate from rate calculator to prove it
  * Copy method into each of the sub-types
  * Run Tests
  * Make calculateRate abstract in RateCalcualtor (and remove method body)
*** Fix each of the methods to call only what they need to call
**** Remove the switch and all of the cases that do not apply.
## Move beahvior into each of the subclasses
* Business Rate Calculator
  * Nothing special with this one (other than there's apparently no business-specific test)
* Consumer Rate Calculator
  * Copy three methods, then we'll also need IsWinter and one other
* Industrial - note use of inheritance of business (it’s an option since it extends the behavior)
  * Make it subclass from BusinessRateCalculator
* Show all tests passing
* Remove all RateCalculatorOld stuff in .cpp and .hpp
## Introduce Simple Factory
* Review Customer setType -- move this into a simple factory
  * Create RateCalculatorFactory with a simple static method to gee type based on string name:
*** Add a new set type using a string
*** Update one test at a time
  * Remove old set type when done updating tests
  * Remove enum customer type
  * Remove getType in customer
  * Remove customertype type attribute
  * We no longer need getType in the RateCalculator hierarchy, remove them all
