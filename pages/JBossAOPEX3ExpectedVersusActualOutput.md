---
title: JBossAOPEX3ExpectedVersusActualOutput
---
[<--Back]({{ site.pagesurl}}/JBoss AOP Example 3) [Next-->]({{ site.pagesurl}}/JBossAOPEX3Possibilities)

# Expected Versus Actual Output
## Expected Output
Given what I've shown you, you might have predicted the following output:
```
Saving: class ex3.Address
Saving: class ex3.Address
Saving: class ex3.Address
Saving: class ex3.Address
```
## Actual Output
However, given your experience with other examples, you might not be too surprised if the output is different. It is:
```
Not saving: class ex3.Address, it is unchanged
Not saving: class ex3.Address, it is unchanged
Saving: class ex3.Address
Not saving: class ex3.Address, it is unchanged
```
----
## Assignment: Form a Theory
Spend a few moments and try to figure out how to make this output happen. Write down those ideas. Please do so before continuing to the next section.

[<--Back]({{ site.pagesurl}}/JBoss AOP Example 3) [Next-->]({{ site.pagesurl}}/JBossAOPEX3Possibilities)
