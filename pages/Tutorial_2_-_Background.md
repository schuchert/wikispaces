---
title: Tutorial_2_-_Background
---
In this tutorial, you experiment with queries to get a feel for how the interface actually behaves. For this tutorial we stick to using JUnit 4 to write a "test" for each of our tutorials.

### Background
The **Entity Manager** allows you to create queries using its own query language called Java Persistence Query Language, **JPQL**. Rather than cover the syntax directly, this tutorial presents you with several queries and asks you to use each one of these queries against the entities we created in [JPA_Tutorial_1_-_Getting_Started](JPA_Tutorial_1_-_Getting_Started).

Queries in **JPQL** are not like SQL queries. Where a SQL query deals with tables and columns, a JPQL query deals with objects and attributes. In many cases there is no difference, but it is possible that a single object maps to multiple tables (think of a many to many relationship with join tables). When you are working with **JPQL**, you don't think about join tables; you think in terms of objects and their relationships. As you'll find out, the name of your Objects and attributes are case sensitive.

For this tutorial, we continue using JUnit 4 by writing a unit test for each of of a series of provided queries. Each unit test will perform some set up, execute a query and then it will programmatically validate the results. In many cases we won't know the results, so we'll actually run the unit test, figure out the results then effectively document how the query interface works by putting asserts in our unit tests.

|**Term**|**Description**|
|JUnit|A Unit Test tool. JUnit allows you to create individual test methods. Each test method runs alone and performs any necessary setup, executes code under test, validates that the results programmatically (so you don't have to look at a bunch of output) and then cleans up after itself).|
|Unit Test|A single test method that tests one thing. For this tutorial, we will use one unit test method per query. To denote a method as a test method, we use the @Test annotation.|
|Query|An expression executed against the database to create, retrieve, updated= and remove records from tables.|
|JPQL|A query language where you express what you want in terms of Objects and relationships between objects instead of directly in SQL using tables and columns.|
 
The following queries will get you started experimenting with the JPA query interface. Your task is to do the following for each query:
# Review the query
* **Predict** the results before you do anything
* Compose a unit test to exercise the query (make sure your test produces no output)
* Execute the test to see if your prediction was correct
* Make the test pass 

