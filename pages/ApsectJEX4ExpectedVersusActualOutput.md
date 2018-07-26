---
title: ApsectJEX4ExpectedVersusActualOutput
---
[<--Back]({{ site.pagesurl}}/AspectJ_Example_4) [Next-->]({{ site.pagesurl}}/AspectJEX4Possibilities)

# Expected Versus Actual Output
## Expected Output
Given the code I've shown you, you might have predicted the following output:
{% highlight terminal %}
Saving: class ex3.Address
Saving: class ex3.Address
Saving: class ex3.Address
Saving: class ex3.Address
{% endhighlight %}
## Actual Output
However, given your experience with other examples, you might not be too surprised if the output is different. It is:
{% highlight terminal %}
Not saving: class ex3.Address, it is unchanged
Not saving: class ex3.Address, it is unchanged
Saving: class ex3.Address
Not saving: class ex3.Address, it is unchanged
{% endhighlight %}
----
## Assignment: Form a Theory
Spend a few moments and try to figure out how to make this output happen. Write down those ideas. Please do so before continuing to the next section.

[<--Back]({{ site.pagesurl}}/AspectJ_Example_4) [Next-->]({{ site.pagesurl}}/AspectJEX4Possibilities)
