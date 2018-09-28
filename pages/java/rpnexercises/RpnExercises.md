---
title: Rpn Calculator Exercises
---
{% include toc %}

<section>
## Overview
These instructions give further details on a set of exercises in a [github repo](https://github.com/schuchert/rpn_exercises.git).

That repo is to practice different kinds of code refactorings. There are several exercises, each of which starts at a git tag in the repo.

The tags for this repo are:
1. 00-project-start
1. 01-wrap-collection-start
1. 01-wrap-collection-end
1. 02-open-closed-start
1. 02-open-closed-end
1. 03-strategy-pattern-start
1. 03-strategy-pattern-end
1. 04-factory-pattern-start
1. 04-factory-pattern-end
1. 05-template-method-start
1. 05-template-method-end (tbd)
1. 06-composite-pattern-start (tbd)
1. 05-composite-pattern-end (tbd)

After cloaning, you can confirm this list by using git (not the order will be different from what is listed above):
```termial
git tag -l
```
</section>

<section>
## Working with the repo
You will need to install a few things for this to work. Have a look [here](https://schuchert.github.io/wikispaces/pages/java/project.from.scratch/using.gradle.html#prerequisites){:target="_blank"}.
Note, you will not need gradle installed as described [there](https://schuchert.github.io/wikispaces/pages/java/project.from.scratch/using.gradle.html#prerequisites){:target="_blank"}.

In addition, you probably want to install some IDE. Any of these will be fine:
* [Eclipse](https://www.eclipse.org/downloads/){:target="_blank"}
* [IntelliJ Comunity Edition](https://www.jetbrains.com/idea/download/){:target="_blank"}
* [NetBeans](https://netbeans.org/downloads/){:target="_blank"}

Once you have a command line, git, and an IDE, you are ready to:
* Clone the repo (do this once)
* Select an exercise and work on it
* Move to the next exercise to either review one possible solution or start another exercise

### Cloning Repo

Clone this project as usual and review the tags:
```terminal
git clone git@github.com:schuchert/rpn_exercise.git
cd rpn_exercises
git tag -l
```

### Select an exercise

In the repo directory, use git branch with a tag to create a branch based on one of the exercises, i.e.,
```terminal
git checkout -b <new_branch_name> <tag_name>
```

For example, to work on the (recommended) first exercise:
```termainl
git checkout -b wrap-collection-exercise 01-wrap-collection-start
```

You can now make commits to this branch as you normally would use git.

Once you are done, you can compare your results to master, which has one possible
solution to the problem presented in the exercise.

Before doing that, commit any changes you want to keep in the branch created for this exercise.

#### Currenntly Clean
Verify you are clean before comparing or switching to a different exercise.

```terminal
git status
On branch wrap-collections-exercise
nothing to commit, working tree clean
```

#### Compare to one possible solution
Assuming your changes are committed and you are in the branch you created to work on
the `01-wrap-collections-start` tag, you can compare your changes to master:

```terminal
git diff 01-wrap-collections-end
```

#### Switch to tag
When your repo is clean and you've reviewed your results against master,
you can start a new exercise by following the steps in
the [select an exercise above](#select-an-exercise) above.
</section>

<section>
## Wrap Collection
### Get Started
```terminal
git branch -b wrap-collection-exercise 01-wrap-collection-start
```

### Background
An actual HP Rpn Calculator never runs out of values. If your regular Java stack runs
out of values, using `pop()` or `peak()` throws an exception. This makes the Java `Stack`
abstraction different from the needs of your domain. This makes using it directly
a possible (actual in this case) voilation of the
[Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle).

<aside>
In fact, most of the time, directly using any collection class violates the
[Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle).
This is why I recommend assuming you should wrap collections from the start and justify not
doing so, rather than introducing the abstraction later.
If you want to dig deper, have a look at [Dip in the Wild](https://martinfowler.com/articles/dipInTheWild.html).
</aside>

### Goal
We want to make our stack never empty. Technically the value returned should reflect the so-called
T register. We will simplify this and instead return 0 when all the user-entered values are gone.
(See [Rpn Description](https://schuchert.github.io/wikispaces/pages/Rpn_Calculator_High_Level_Description.html) for too much detail.)

{% include aside/collapsed id="wrap-collection-hints" title="Wrap Collection Hints" filename="WrapCollectionHints.md" %}

### Check
When you've commited all your changes:
```termainl
git diff 01-wrap-collection-end
```

</section>

<section>
## Open Closed Principle
### Get Started
```terminal
git branch -b open-closed-exercise 02-open-closed-start
```

### Background
The interface to the calculator changes every time you add a new operator.
This violates the [Open/Closed Principle](https://schuchert.github.io/wikispaces/pages/ruby/ruby.tutorials.bdd.UsingBddToDevelopAnRpnCalculator.html#openclosed)
Experiment with making a change to the API and get the code to pass.

### Goals
* Adding a new operator does not change the interface to the calculator
* All exisitng operators use the new approache
* The number of methods on the classs is significantly reduced
* Introduce some negative testing to make sure use of the new API produces "reasonable" errors

{% include aside/collapsed id="open-closed-hints" title="Open/Closed Hints" filename="OpenClosedHints.md" %}

### Check
When you've commited all your changes:
```termainl
git diff 02-open-closed-end
```
</section>

<section>
    
## Strategy Pattern
### Get Started
```terminal
git branch -b strategy-pattern-exercise 03-strategy-pattern-start
```

### Background
All of the operators look similar. Rather than writing each as its own function, we can
do the same thing as a class. Note: With Java 8 we could also use Lambdas, but for now
let's take more of a traditional approach to the Stragegy Pattern.
![Image of Stragegy Pattern](Strategy.png)

### Goals
We want to define an interface with a single method that will work all of the operators.
Review each of the operators, and determine what, if anything, is common across all
operators.

Once you've done that, create an appropraite interface, have each of the functions in
its own class, which implements that interface.

Update the solution from calling a bunch of functions to instead using instances of
the various subclasses of your new interface.

{% include aside/collapsed id="strategy-pattern-hints" title="Strategy Pattern Hints" filename="StrategyPatternHints.md" %}

### Check
When you've commited all your changes:
```termainl
git diff 03-strategy-pattern-end
```

</section>

<section>
## Factory Pattern
### Get Started
```terminal
git branch -b factory-pattern-exercise 04-factory-pattern-start
```

### Overview
![Image of Abstract Factory](AbstractFactory.png)

There's an abundance of code in the `RpnCalculator` that can be put into its own class.
^

{% include aside/collapsed id="factory-pattern-hints" title="Factory Pattern Hints" filename="FactoryPatternHints.md" %}

### Check
When you've commited all your changes:
```termainl
git diff 04-factory-pattern-end
```

</section>

<section>
## Template Method Pattern
### Get Started
```termainl
git branch -b template-method-exercise 05-tempalte-method-start
```

### Overview
![Image of Template Method Pattern](TemplateMethod.png)
Notice duplication acrosss binary operators. How can we remove that duplication?
^

{% include aside/collapsed id="template-method-hints" title="Template Method Pattern Hints" filename="TemplateMethodPatternHints.md" %}

### Check
```terminal
git diff 05-template-method-end
```

</section>

<section>
## Composit Object Pattern
### Get Started
```termainl
git branch -b composite-pattern-exercise 06-composite-pattern-start
```
### Overview
![Image of Composite Pattern](Composite.png)

What if I want to compose simple operators to make more complex operator, a program
or a macro if you will.

{% include aside/collapsed id="composit-object-pattern" title="Composit Object Pattern Hints" filename="CompositeObjectPatternHints.md" %}

### Check
```terminal
git diff 06-composite-pattern-end
```
^

</section>
