---
title: AspectJ_CFlowPossibilities
---
[<--Back]({{_site.pagesurl}}/AspectJ_CFlowFormTheory) [Next-->]({{_site.pagesurl}}/AspectJ_CFlowWhatIsHappening)

## Possibilities
Did you have any ideas? Here are some ideas I’ve heard some people mention:
* Do not weave pointcuts in constructors
* If, while processing a pointcut, you happen to be in a constructor, ignore it.
* If you are in a constructor, or a method called by a constructor, do not go into the around advice.
* ... 

[<--Back]({{_site.pagesurl}}/AspectJ_CFlowFormTheory) [Next-->]({{_site.pagesurl}}/AspectJ_CFlowWhatIsHappening)
