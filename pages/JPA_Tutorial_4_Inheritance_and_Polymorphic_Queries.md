---
title: JPA_Tutorial_4_Inheritance_and_Polymorphic_Queries
---
{% include nav prev="EJB_3_and_Java_Persistence_API" %}
{% include toc %}
## Inheritance and Polymorphic Queries
This tutorial picks up at the end of [JPA_Tutorial_3_A_Mini_Application](JPA_Tutorial_3_A_Mini_Application). If you have not completed that tutorial, you can start with this source base: 
[JpaTutoria3Solution.jar](files/JpaTutoria3Solution.jar)

### Background
Ignoring joints, a typical query essentially hits one table and returns back subset of the records in that single table. With JPA, we are not hitting tables but we are rather dealing with entities. What is the difference? An entity might map to a single table, multiple tables, or it could be involved in some kind of inheritance relationship.

What happens when we perform a query on an entity type that serves as a base class? It turns out that the actual "work" to make this happen is very simple. This tutorial along with the exercises gives you all the experience you'll need to figure out so-called polymorphic queries.

----

### Introduction
{% include include_md_file filename="JPA_Tutorial_4_Introduction.md" %}

----

### Setup
{% include include_md_file filename="JPA_Tutorial_4_Setup.md" %}

----

### V3 Requirements: Different Kinds of Resources
{% include include_md_file filename="JPA_Tutorial_4_Different_Kinds_of_Resources.md" %}

----

### V3 Adding a Second Kind of Resource
{% include include_md_file filename="JPA_Tutorial_4_Adding_a_Second_Kind_of_Resource.md" %}

----

### V3 Assignments
{% include include_md_file filename="JPA_Tutorial_4_Assignments.md" %}

----

### Individual Links
[JPA_Tutorial_4_Introduction](JPA_Tutorial_4_Introduction)
[JPA_Tutorial_4_Setup](JPA_Tutorial_4_Setup)
[JPA_Tutorial_4_Different_Kinds_of_Resources](JPA_Tutorial_4_Different_Kinds_of_Resources)   
[JPA_Tutorial_4_Adding_a_Second_Kind_of_Resource](JPA_Tutorial_4_Adding_a_Second_Kind_of_Resource)   
[JPA_Tutorial_4_Assignments](JPA_Tutorial_4_Assignments)

{% include nav prev="EJB_3_and_Java_Persistence_API" %}
