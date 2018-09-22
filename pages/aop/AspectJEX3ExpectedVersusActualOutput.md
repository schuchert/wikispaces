---
title: AspectJEX3ExpectedVersusActualOutput
---
{% include nav prev="AspectJ_Example_2" next="AspectJEX3Possibilities" %}

## Expected Versus Actual Output

### Expected Output
Is the what you guessed the output would be?
{% highlight terminal %}
Exception in thread "main" java.io.NotSerializableException: ex3.Die
	at java.io.ObjectOutputStream.writeObject0(ObjectOutputStream.java:1075)
	at java.io.ObjectOutputStream.writeObject(ObjectOutputStream.java:291)
	at ex3.Main.serializeObject(Main.java:36)
	at ex3.Main.main(Main.java:16)
{% endhighlight %}
Notice that the Die class does not implement Serializable or Externalizable, so the Main.main() method should not have been able to Serialize the object.

### Actual Output
Here’s the actual output:
{% highlight terminal %}
Serialization successful
{% endhighlight %}
By now you've figured out that the expected and actual output are generally not the same.

## Assignment: Form a Theory
Spend a few moments and try to figure out how to make this output happen. Write down those ideas. Please do so before continuing to the next section.

{% include nav prev="AspectJ_Example_2" next="AspectJEX3Possibilities" %}
