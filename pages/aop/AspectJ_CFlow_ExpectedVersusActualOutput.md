---
title: AspectJ_CFlow_ExpectedVersusActualOutput
---
{% include nav prev="AspectJ_CFlow" next="AspectJ_CFlowFormTheory" %}

## Expected Output
Did you guess the output would look something like this? (Note this would be the output if we did not use the cflow pointcut.)
{% highlight terminal %}
Saving: class cf.Address
Not saving: class cf.Address, it is unchanged
Saving: class cf.Address
Not saving: class cf.Address, it is unchanged
{% endhighlight %}
## Actual Output
Or this?
{% highlight terminal %}
Not saving: class cf.Address, it is unchanged
Not saving: class cf.Address, it is unchanged
Saving: class cf.Address
Not saving: class cf.Address, it is unchanged
{% endhighlight %}

{% include nav prev="AspectJ_CFlow" next="AspectJ_CFlowFormTheory" %}



