---
title: ruby.sidebar.OpenClosedPrinciple
---
<span class="sidebar_title"> Open/Closed Principle</span>
The [[http://en.wikipedia.org/wiki/Open/closed_principle|Open/Closed Principle]] suggests that a class, once released into the wild, should not change again except for fixing errors. In Eiffel, this meant leaving a class alone and extending from it to add new behavior. In general, this can also mean depending on an abstraction (interface or abstract base class) and then adding subclasses to complete the behavior.

Why is this relevant? Gerald M. Weinberg describes a relationship between the size of a bug fix and the likelihood that the bug fix introduces new bugs. In his experience, the smaller the fix, the more likely a new bug will be introduced. In his research, 66% of all one-line bug fixes introduce new bugs.

So leaving working code alone is at the heart of the Open/Closed Principle.

Adding new methods to an existing class is in fact changing that class. Adding new methods to a class is less likely to cause problems, but it is not impossible break a class when you do add methods to it. This suggests adding methods to a class every time we add a new feature is probably a bad idea.

Another issue is, in general, the more methods on a class, the more likely it is that it will be hard to understand. Finally, having many methods on a class makes it more likely that the class will violate the Single Responsibility Principle.
 