---
title: Composite Object Pattern Hints
---

* The class you create, e.g., `Program` class implements Operator.
* It holds an ordered list of other operators.
* When told to `execute`, it will simply call `execte` on each of its contained operators.
