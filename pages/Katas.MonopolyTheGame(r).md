---
title: Katas.MonopolyTheGame
---
[[Katas|<--Back]]

# Background
In 1992 I started working for a company called ObjectSpace with Graham Glass and David Norris. At that time, Graham taught classes on Object Oriented Development in C++ and sometimes Smalltalk. I was brought on to help with the teaching and helped Graham formalize the classes somewhat. Some years before 1991, Graham had bought several board games and randomly selected Monopoly to use as implementation problem for his class on Object Oriented Programming in C++. That project turned out to be an excellent source for basic object oriented design problems, design patterns (which were not yet on the scene in any significant way) and even analysis.

I have worked through Monopoly in several ways since 1992 when I joined ObjectSpace:
* Written some part of it in C++ 30 + times
* Written some part of it in Smalltalk 20 + times
* Written some small part of it in Self a few times
* Written some part of it in Java 70 + times
* Used it as an OOA and an OOD problem 50 + times (first in Booch, and then OMT, later in Fusion [best formal process ever] and finally in UML)
* Used ObjectSpace's voyager to represent the board as a series of nodes in an agent network
* Written it in C# several times
* Written it in Ruby a few times
* Used parts of it to discuss concrete examples of several design patterns including: template method, state, strategy

So without knowing it, I've personally used Monopoly as a Kata for over 15 years. 

In the early days, Graham had the problem in his head (the phases, design alternatives, etc.). Just before I started teaching the class, he wrote a document to summarize his approach. I took his writeup and over a series of several applications formalized the approach and the particular requirements we picked to force certain analysis and design issues in certain directions. I've reproduced and somewhat expanded those requirements [[Monopoly(r)|here]]. Actually, at that time I created slides for our C++ and Smalltalk classes - this was a mistake because the formality of the class was too much (a good lesson learned for me on class design). Later on, [Craig Larman](http://www.craiglarman.com/) joined the company and at one point, he and I mapped out our C++ and Smalltalk classes to try and them them as consistent as possible.

In recent years, I have programmed it, though not as much as at the end of last century. Even so, when I'm teaching anything to do with design issues, I often go back to the very deep Monopoly well to find concrete examples of basic to advanced principles.

# Approach
Work through the problem as described [[Monopoly(r)|here]], completing one phase before going on to the next. This problem, as described, is meant to allow you to practice the fundamentals of object oriented programming. Keep that in mind as you approach it. You might want to review [the S.O.L.I.D.](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) principles. 

Here are a few considerations:
* Repeat this several times over a period of months, let it sink in. Think of this as process, not a "coding event."
* Initially, try to keep the design simple and only introduce design patterns as a last resort
* Consider every// **if**// statement as a code smell and see if you can get rid of it (while possible, it's overkill to remove all of them, but people certainly tend to use them way to much for this problem. (This is a suggestion from David Nunn.)
* In UML, the issue of [visibility](http://www.comptechdoc.org/independent/uml/begin/umlvisibility.html) is that of how does one object know about another object to which it sends messages. We often refer to that in terms of [Inversion of Control](http://en.wikipedia.org/wiki/Inversion_of_control) or [Dependency Injection](http://en.wikipedia.org/wiki/Dependency_injection). This issue will come up and initially you'll probably use constructor-based injection as well as method based injection. Once you get comfortable with the problem, use an IoC container like [spring](http://www.springsource.org/) or [picocontainer](http://www.picocontainer.org/) or [nspring](http://sourceforge.net/projects/nspring) (or one for the language you are using).
* I've work on this mostly using [big design up front](http://en.wikipedia.org/wiki/Big_Design_Up_Front) per "iteration" or "phase" (because I used this problem well before I was aware of automated unit testing or had first become [Test Infected](http://c2.com/cgi/wiki?TestInfected)). I now recommend using TDD or BDD on the problem, but you can certainly try to use [big design up front](http://en.wikipedia.org/wiki/Big_Design_Up_Front) and code from UML diagrams.
* After you've tried this, approach it using a [strict mockist approach](http://martinfowler.com/articles/mocksArentStubs.html#SoShouldIBeAClassicistOrAMockist).

# Why?
Once you become very familiar with this problem (say 10 + times, maybe more), then you can use it as a means to learn something else. When you try it for the first time, you are trying to pick out classes, assign responsibilities, deal with subtle edge conditions, etc. Once you become quite familiar with the domain and typical design approaches, you can then use it to look at other techniques. Given a strong baseline understanding of this problem, you will have the ability to critically contrast a new technique on an old problem. For example, even after working on this problem over 100 times, when I tried working on it using [Mockito](http://mockito.org/), I had several micro a-ha experiences. Since I was so familiar with the problem, the different technique of taking a [strict mockist approach](http://martinfowler.com/articles/mocksArentStubs.html#SoShouldIBeAClassicistOrAMockist) gave me a "high contrast experience."

Let me know how it goes for you!

[[Katas|<--Back]]