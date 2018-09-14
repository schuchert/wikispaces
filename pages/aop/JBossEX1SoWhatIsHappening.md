---
title: JBossEX1SoWhatIsHappening
---
[<--Back](JBossEX1WhatIsHappening) [Next-->](JBossEX1Explained)

## So What Is Happening?
Here are some descriptions I’ve heard some people mention:
* Every time we call a method, we print something before the method runs, the method runs, then we print something after the method runs.
* We intercept each method call and do something before and after it.
* As we execute a method, we use reflection to get the name of the method; we print “Entering” followed by the method name. We then execute the method, which always prints something. Finally, we print “Leaving” and the method name.
* We modify every method execution. Before and after the method execution we display the name of the method.
* ...

[<--Back](JBossEX1WhatIsHappening) [Next-->](JBossEX1Explained)