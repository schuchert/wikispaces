---
title: AspectJEX4Possibilities
---
[Next-->]({{ site.pagesurl }}/ApsectJEX4ExpectedVersusActualOutput|<--Back]] [[AspectJEX4WhatIsHappening)

# Possibilities
Did you have any ideas? Here are some ideas I've heard:
* We keep track of things that have changed somewhere and then change Dao.save() to behave differently accordingly.
* We somehow change the Address object to know if has changed. Then when we call Dao.save(), we somehow let it know whether the Address has changed or not.
* ...

[Next-->]({{ site.pagesurl }}/ApsectJEX4ExpectedVersusActualOutput|<--Back]] [[AspectJEX4WhatIsHappening)