---
title: AspectJ_Assignments_for_Provided_Project
---
## AspectJ Assignments for Provided Project

These assignments are to be used on [Car_Rental_Example](../Car_Rental_Example). Please set up that project before working on any of these projects.

### Constructor Policy
Currently when we construct a Field<T> object or any of its subclasses, we might or might not have a newly created instance denoted as changed. We want a system-wide policy:
* Objects will never be considered changed if constructed using a normal Constructor.

Examine the provided project. Review the Field<T> class and it's descendants (all of which are in the package vehicle.validation). Enforce the stated policy any way you see fit. Note that since we're working with AOP, you might want to consider an AOP-based solution, however that is not mandatory. Be prepared to compare your solution to others provided in the class.

### DAO Policy
Whenever a Dao returns because of throwing a runtime exception, set a global error on the result.
