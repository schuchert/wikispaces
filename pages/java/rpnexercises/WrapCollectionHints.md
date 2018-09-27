---
title: Wrap Collection Hints
---

Introduce a new class, `RpnStack`. This class will wrap the `Stack<BigDecimal>`. Then update
the `RpnCalculator` to use this new class.

You will need to have a few methods in your `RpnStack` class:
* push
* pop
* peek
* size

Make sure you initialize your collection of values in the constructor of `RpnStack`.

Also make sure to remove the `Stack<BigDecimal>` from the `RpnCalculator` class.
