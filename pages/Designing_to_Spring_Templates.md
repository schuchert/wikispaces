---
title: Designing_to_Spring_Templates
---
[Home](home) [Next-->](Spring_Templates_Typical_JDBC)

## Designing to Spring Templates

### Background
Late in 2005 I gave a presentation to the Oklahoma City Java Users' Group on the design forces that seemed to be behind the Spring Templates. I've re-created that presentation here and included all of the code. In addition, these notes include more details on the code that I didn't have time to present at the OkC JUG.

### The Full Source + Instructions
Get the full source for this example, along with installation instructions, [here](Designing_to_Spring_Templates_Source).

### Introduction
The Spring Templates tend to take care of certain responsibilities for you to make you use of some underlying resource easier and more reliable. Spring specifically:
* Opens resources at the beginning of some action.
* Processes a provided request represented as an object using those resources
* Cleans up those resources upon completion of the work
* Maps any exceptions that happen to a "logical" [Runtime](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Runtime.html) exception.

The question this article tries to answer is "How did they come up with that design?" What series of steps did they go through to get from the typical work of using, for example, JDBC to what is the [Spring JdbcTemplate](http://www.springframework.org/docs/api/org/springframework/jdbc/core/JdbcTemplate.html)?

To get from "normal" JDBC to the [Spring JdbcTemplate](http://www.springframework.org/docs/api/org/springframework/jdbc/core/JdbcTemplate.html) we'll go through a total of 9 steps, although two of the steps introduce batch operations. Those steps are:

* [Typical JDBC](Spring_Templates_Typical_JDBC)
* [JDBC Using Template Method Pattern](Spring_Templates_JDBC_Using_Template_Method_Pattern)
* [JDBC Strategy Is A Template](Spring_Templates_JDBC_Strategy_Is_A_Template)
* [JDBC Template Uses Strategy V1](Spring_Templates_JDBC_Template_Uses_Strategy_V1)
* [JDBC Template Uses Strategy V2](Spring_Templates_JDBC_Template_Uses_Strategy_V2)
* [JDBC Template Uses Strategy V3](Spring_Templates_JDBC_Template_Uses_Strategy_V3)
* [JDBC Template Uses Strategy V4](Spring_Templates_JDBC_Template_Uses_Strategy_V4)
* [Spring JdbcTemplate](Spring_Templates_JdbcTemplate)
* [Spring Templates with Batch Insert](Spring_Templates_JdbcTemplate_With_Batch_Insert)

Note, once you select on any of the above links, the next and previous links will take you through the above links in order and will not get you back here (unless you are on the first or last item in the list).

I'd appreciate any feedback you have to offer. Please write me: schuchert@yahoo.com.

[Home](home) [Next-->](Spring_Templates_Typical_JDBC)
