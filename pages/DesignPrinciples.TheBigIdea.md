---
title: DesignPrinciples.TheBigIdea
---
Imagine the following partial system:

[[image:AccessVersion0.png]]

These various boxes represent classes in your system, each of which is touching the database. While technically each probably uses interfaces to connect to the database, in any case, the details of that interaction are still at a lower level of abstraction than your production code. In that sense, this represents a violation of the [Dependency Inversion Principle](http://www.objectmentor.com/resources/articles/dip.pdf).

In addition, it is quite likely that each of those classes are doing duplicated work to make that connection, so you are also probably violating the [DRY principle](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

This is a classic problem that is fractal in nature. That is, it happens at multiple levels. At the level of architecture, this would be multiple classes in one layer touching multiple classes in a lower layer. The solution that problem is to us some kind of [facade](http://en.wikipedia.org/wiki/Facade_pattern). Within a single class, there is duplicated code accessing some external resource, rather than a few internal utility methods to do the work.

Here is a simple reconfiguration of this system that represents a significant improvement:

[[image:AccessVersion1.png]]

This version introduces a so-called Data Access Object (Dao) to capture the details of database access. Rather than having to look all over for database access, it is in one class. Removing duplication will be easier because it is in one place rather than spanning multiple classes.

While this is an improvement, that class is probably a concrete class. When using the Dao pattern, you'll typically introduce an interface:

[[image:AccessVersion2.png]]

The definition of the interface contains logical operations to get the information required by the system. The details of how those logical operations are implemented are deferred to the "Real Dao", the class that implements the interface and actually connects to the real database.

Now the next question is this: How do classes requiring the Dao get an instance of it? There are two top-level choices:
* The object creates an instance of the Dao itself
* The object looks it up or is given a reference.

The first option is a poor one since to create an instance requires use of the "new" keyword. The new keyword is the second highest form of coupling; the first being inheritance.

In this situation, the dependent class is provided the dao though some kind of [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection). Once the dependency is injected, it becomes possible to create per-test [test doubles](http://xunitpatterns.com/Test%20Double.html) to remove the database from most tests:

[[image:AccessVersion3.png]]