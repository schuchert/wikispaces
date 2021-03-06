---
title: Data_Validation_Alternatives
---
This example is rewritten from scratch and derivative of work I've been involved with from 9/2002 - 9 /2006. So while the example might seem a bit contrived, it comes from an actual system used in production at a major Car Rental company. In the original example, we implemented field-based change tracking using AspectJ. In this example, I instead decided to create field objects that track change status directly to see how it might have been had we taken this approach.

The context includes roughly 15 projects based on a common architecture with a total of about 60 developers, most of whom were retrained from COBOL to Java through a process of mentoring.
Start with a BO with "field" objects and/or objects, which might be null.
<<provide code example>>

Perform validation, note that object and or field might be null. Do I null check? Do I remove the possibility? What are some options?
* Option 0: Ignore it? Probably won't allow it to happen in general use? Risky at best.
* Option 1: Don't allow null values. Fits for fields, but not objects. Maybe everything should be wrapped in a field?
* Option 2: Null check before trying (a bit ugly and redundant code)
* Option 3: Make it a utility, checking for null and such (still ugly, but not redundant)
* Option 4: Refactor and use reflection
* Option 5: AOP, auto instantiate null values on first use (side effect changes receiver)
* Option 6: AOP, auto instantiate on get of field in cflow of validation or all the time
* Option 7: AOP, on get, return a singleton non-null object implementing a "null-object" pattern that, when validated, will cause validation to fail
* Option 8: AOP, on get, return an instantiated object with enough information to provide better debugging.


