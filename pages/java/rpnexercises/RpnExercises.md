---
title: Rpn Calculator Exercises
---
{% include toc %}

<section>
## Overview
These instructions give further details on a set of exercises in a [github repo](https://github.com/schuchert/rpn_pattern_practice.git).

That repo is to practice different kinds of code refactorings. There are several exercises, each of which starts at a git tag in the repo.

The current tags (in the order I'd recommend using):
1. wrap-collection-start
1. open-closed-start
1. strategy-pattern-start
1. template-method-start
1. composite-pattern-start

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
git clone git@github.com:schuchert/rpn_pattern_practice.git
cd rpn_pattern_practice
git tag -l
```

The list of tags will look something like the following:
```terminal
composite-pattern-start
open-closed-start
strategy-pattern-start
template-method-start
wrap-collection-start
```

### Select an exercise

In the repo directory, use git branch with a tag to create a branch based on one of the exercises, i.e.,
```terminal
git checkout -b <new_branch_name> <tag_name>
```

For example, to work on the (recommended) first exercise:
```termainl
git checkout -b wrap-collection-exercise wrap-collection-start
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
the `wrap-collections-start` tag, you can compare your changes to master:

```terminal
git diff open-closed-start
```

#### Switch to tag
When your repo is clean and you've reviewed your results against master,
you can start a new exercise by following the steps in
the [select an exercise above](#select-an-exercise) above.
</section>

<section>
## Tag: wrap-collection-start
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

We want to make our stack never empty. Technically the value returned should reflect the so-called
T register. We will simplify this and instead return 0 when all the user-entered values are gone.
(See [Rpn Description](https://schuchert.github.io/wikispaces/pages/Rpn_Calculator_High_Level_Description.html) for too much detail.)

{% include aside/collapsed id="wrap-collection-hints" title="Wrap Collection Hints" filename="WrapCollectionHints.md" %}

</section>

<section>
## Tag: open-closed-start
The interface to the calculator changes every time you add a new operator.
This violates the [Open/Closed Principle](https://schuchert.github.io/wikispaces/pages/ruby/ruby.tutorials.bdd.UsingBddToDevelopAnRpnCalculator.html#openclosed)
Experiment with making a change to the API and get the code to pass.

### Goals
* Adding a new operator does not change the interface to the calculator
* All exisitng operators use the new approache
* The number of methods on the classs is significantly reduced
* Introduce some negative testing to make sure use of the new API produces "reasonable" errors

{% include aside/collapsed id="open-closed-hints" title="Open/Closed Hints" filename="OpenClosedHints.md" %}

</section>

<section>
    
## Tag: stragety-pattern-start
All of the operators look similar. Rather than writing each as its own function, we can
do the same thing as a class. Note: With Java 8 we could also use Lambdas, but for now
let's take more of a traditional approach to the Stragegy Pattern.
![Image of Stragegy Pattern](Strategy.png)

We want to define an interface with a single method that will work all of the operators.
Review each of the operators, and determine what, if anything, is common across all
operators.

Once you've done that, create an appropraite interface, have each of the functions in
its own class, which implements that interface.

Update the solution from calling a bunch of functions to instead using instances of
the various subclasses of your new interface.

As a bonus, use some kind of reflection to find the operators rather than having to
manually create them.
^
</section>

<section>
## Tag: factory-pattern-start
![Image of Abstract Factory](AbstractFactory.png)
**Note in current repo, will redo**
There's an abundance of code in the `RpnCalculator` that can be put into its own class.
^
</section>

<section>
## Tag: template-method-start
![Image of Template Method Pattern](TemplateMethod.png)
Notice duplication acrosss binary operators. How can we remove that duplication?
^
</section>

<section>
## Tag: composite-pattern-start
![Image of Composite Pattern](Composite.png)

What if I want to compose simple operators to make more complex operator, a program
or a macro if you will.
^
</section>
