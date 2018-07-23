---
title: Test_First_Development
---
Many people do not make a distinction between [[Test Driven Development]] and Test First Development or Test First Coding. On this site, we make the following distinction. When using a Test First approach, we proceed tests with some amount of design work. 

For example, we might begin with a simple [[http://www.agilemodeling.com/artifacts/communicationDiagram.htm|UML Communication diagram]]. Once we've completed the diagram, we then will use unit tests to test our way into the design.

Taking this approach, we'd typically work least dependent to most dependent (bottom of the diagram or leaf notes first). We follow a similar approach to [[Test Driven Development|TDD]]:
* Write a test
* Get it to compile
* Get it to pass
* Refactor
* Integrate with repository 
* Check in code

The only difference is that we are testing our way into a known design.

This approach is useful when trying to teach object oriented design principles.