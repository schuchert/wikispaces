---
title: Designing_to_Spring_Templates
---
[[home|<--Back]] [[Spring Templates Typical JDBC|Next-->]]

# Designing to Spring Templates 

# # Background 
Late in 2005 I gave a presentation to the Oklahoma City Java Users' Group on the design forces that seemed to be behind the Spring Templates. I've re-created that presentation here and included all of the code. In addition, these notes include more details on the code that I didn't have time to present at the OkC JUG.

# # The Full Source + Instructions 
Get the full source for this example, along with installation instructions, [[Designing to Spring Templates Source|here]].

# # Introduction 
The Spring Templates tend to take care of certain responsibilities for you to make you use of some underlying resource easier and more reliable. Spring specifically:
* Opens resources at the beginning of some action.
* Processes a provided request represented as an object using those resources
* Cleans up those resources upon completion of the work
* Maps any exceptions that happen to a "logical" [Runtime](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Runtime.html) exception.

The question this article tries to answer is "How did they come up with that design?" What series of steps did they go through to get from the typical work of using, for example, JDBC to what is the [Spring JdbcTemplate](http://www.springframework.org/docs/api/org/springframework/jdbc/core/JdbcTemplate.html)?

To get from "normal" JDBC to the [Spring JdbcTemplate](http://www.springframework.org/docs/api/org/springframework/jdbc/core/JdbcTemplate.html) we'll go through a total of 9 steps, although two of the steps introduce batch operations. Those steps are:

# [[Spring Templates Typical JDBC|Typical JDBC]]
# [[Spring Templates JDBC Using Template Method Pattern|JDBC Using Template Method Pattern]]
# [[Spring Templates JDBC Strategy Is A Template|JDBC Strategy Is A Template]]
# [[Spring Templates JDBC Template Uses Strategy V1|JDBC Template Uses Strategy V1]]
# [[Spring Templates JDBC Template Uses Strategy V2|JDBC Template Uses Strategy V2]]
# [[Spring Templates JDBC Template Uses Strategy V3|JDBC Template Uses Strategy V3]]
# [[Spring Templates JDBC Template Uses Strategy V4|JDBC Template Uses Strategy V4]]
# [[Spring Templates JdbcTemplate|Spring JdbcTemplate]]
# [[Spring Templates JdbcTemplate With Batch Insert|Spring Templates with Batch Insert]]

Note, once you select on any of the above links, the next and previous links will take you through the above links in order and will not get you back here (unless you are on the first or last item in the list).

I'd appreciate any feedback you have to offer. Please write me: schuchert@yahoo.com.

[[home|<--Back]] [[Spring Templates Typical JDBC|Next-->]]
