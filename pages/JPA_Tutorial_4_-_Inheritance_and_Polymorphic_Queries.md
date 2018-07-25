---
title: JPA_Tutorial_4_-_Inheritance_and_Polymorphic_Queries
---
{:toc}
[<-Back]({{site.pagesurl}}/EJB_3_and_Java_Persistence_API)
# Inheritance and Polymorphic Queries
This tutorial picks up at the end of [[JPA_Tutorial_3_-_A_Mini_Application]]. If you have not completed that tutorial, you can start with this source base: 
> [[file:JpaTutoria3Solution.jar]]

## Background
Ignoring joints, a typical query essentially hits one table and returns back subset of the records in that single table. With JPA, we are not hitting tables but we are rather dealing with entities. What is the difference? An entity might map to a single table, multiple tables, or it could be involved in some kind of inheritance relationship.

What happens when we perform a query on an entity type that serves as a base class? It turns out that the actual "work" to make this happen is very simple. This tutorial along with the exercises gives you all the experience you'll need to figure out so-called polymorphic queries.
----
## Introduction
[[include_page="JPA_Tutorial_4_-_Introduction"]]
----
## Setup
[[include_page="JPA_Tutorial_4_-_Setup"]]
----
## V3 Requirements: Different Kinds of Resources
[[include_page="JPA_Tutorial_4_-_Different_Kinds_of_Resources"]]
----
## V3 Adding a Second Kind of Resource
[[include_page="JPA_Tutorial_4_-_Adding_a_Second_Kind_of_Resource"]]
----
## V3 Assignments
[[include_page="JPA_Tutorial_4_-_Assignments"]]
----
## Individual Links
[[JPA_Tutorial_4_-_Introduction]]
[[JPA_Tutorial_4_-_Setup]]
[[JPA_Tutorial_4_-_Different_Kinds_of_Resources]]   
[[JPA_Tutorial_4_-_Adding_a_Second_Kind_of_Resource]]   
[[JPA_Tutorial_4_-_Assignments]]

[<--Back]({{site.pagesurl}}/EJB_3_and_Java_Persistence_API)
