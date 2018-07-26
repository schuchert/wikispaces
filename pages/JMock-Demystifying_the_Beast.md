---
title: JMock-Demystifying_the_Beast
---
[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)

jMock makes a use of two Java language features, one you may have never used:
* Anonymous inner classes (you don't have to use them but it works out nicely)
* Instance initializers

Here's a template:
{% highlight java %}
01: context.checking(
02:     new Expectations() {
03:         {
04:         }
05:     }
06: );
{% endhighlight %}

|**Line**|**Description**|
|1|Standard object.message, nothing special here.|
|2|The introduction of an [anonymous inner class](http://java.sun.com/docs/books/tutorial/java/javaOO/innerclasses.html). The pattern is: new X() {}. It's the addition of the {} after the new X() that indicates an anonymous inner class.|
|3, 4|The { and } are situated such that they have a special meaning. Notice that they are inside the definition of a class. If you saw the pattern "static { }" you might thing "static initializer" and you'd be right. However when you leave out "static" it becomes an instance initializer. The important thing here is that every time we create an instance of a class with an instance initializer, its instance initializer gets executed. Remember line 2? Line 2 creates an anonymous inner class. What does this do? It creates a new subclass of the Expectations class (actually creates a class that implements an interface). It then **creates an instance**, thereby causing the instance initializer to get executed. So the code in the instance initializer has a side-effect of running.|

That's a whole lot. However, this is an idiomatic use of jMock, so you'll be repeating the pattern.


If you're using an IDE, I'd recommend typing the following:
{% highlight java %}
{% raw %}
    context.checking(new Expectations() {{}});
{% endraw %}
{% endhighlight %}
Once you've done that, format your code and it will be a bit more clear where to express your expectations.

[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)
