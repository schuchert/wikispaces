---
title: PPPChapter8Exercise
---

{%include nav up="Vancouver_PPP_Exercise_Ch8and9" next="PPPChapter9Exercise" %}

## Part 1: Unit 8

The diagram provided describes the dependencies between many of the classes from the project 2 solution. It also shows "components". The larger box represents the middle-tier as it is released to the UI team. The smaller box represents the all of the UI tier, which is developed by a different team. Review this diagram and look for the following:
* Are there any "obvious" clusters of heavily related classes?
* Where are there cycles?

### Component cohesion principles

**Reuse/Release Equivalency Principle (REP)**
:  What we release is what we reuse. What we reuse is what we release.
^

**Common Closure Principle (CCP)**
:  Everything in a component should be closed in a related manner.
^

**Common Reuse Principle (CRP)**
:  When reusing a component, all or most of the component is used by the releaser.
^

We have a new opportunity to reduce manual entry of book information.
An outside provider has offered a service to electronically register
the books it ships (this is how they get new customers). All they ask
is a minimal component to allow this to happen. Part of the agreement
involves providing a minimal interface to reduce their liability (e.g.
if they cannot affect Patrons through the interface they receive, they
won't be liable for unexpected changes to patrons). We have a need to
develop a component for this new book provider. This book provider
electronically provides book information on all the books they shipped
to us once they receive delivery confirmation of a shipment (outside of our concern).

We already have the ability to add books into our system, so we'd prefer to create a component by reusing our existing classes. Our solution should be used by both this new book provider as well as our existing system.

Your task is to review the existing system (represented by the diagram below) and create a component that provides the service that they need but nothing else. Additionally, you'll need to tie that component back into the existing system. As you "pull out" your component, you might need to decouple things by introducing some form of indirection.

After you've had some time to work on this, we'll discuss it as a group and then learn how to assess the design of your solution.
![](images/PPP_Exercise8And9.jpg)

{%include nav up="Vancouver_PPP_Exercise_Ch8and9" next="PPPChapter9Exercise" %}
