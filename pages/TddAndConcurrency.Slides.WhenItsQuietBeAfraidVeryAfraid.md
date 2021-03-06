---
title: TddAndConcurrency.Slides.WhenItsQuietBeAfraidVeryAfraid
---
{% include nav prev="TddAndConcurrency.Slides.DoOneThingWellWell" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides.ICantWaitWellYouShouldntHaveTo" %}

## When It's Quiet Be Afraid, Very Afraid

### Quick Quiz. Is this code MT Safe?
{% highlight java %}
public class ObjectWithValue {
    private int value;
    public void incrementValue() { ++value; }
    public int getValue() { return value; }
}
{% endhighlight %}
----
----
### What's Happening?
++value is actually three operations:
* Read the current value 
* Add one to it
* Store the results

Since a thread can be preempted at any time…
* one thread reads the value, 
* a second thread preempts the first & updates the value, 
* the first thread continues its work and it has a stale value.
----
----
### It is actually worse
++value turns into 7 byte-codes. Assume the value field has a value of 42.

| Byte-code | Description | Operand Stack After |
|aload 0|Load local variable 0 onto the stack. In a non-static method, local variable 0 is always the "this" pointer, or the object that received the most recent message.|this|
|dup|Place a copy of the top operand on the operand stack back onto the operand stack.|this, this|
|getfield value|Retrieve the field named "value" from the object pointed to on the top of the operand stack, which is "this". Put the resulting value back on to the top of the operand stack.|this, 42|
|iconst_1|Put the constant value 1 onto the operand stack.|this, 42, 1|
|iadd|Perform integer addition on the top two items on the operand stack and place the result back on the operand stack.|this, 43|
|putfield value|Put the top item on the stack (43) in the "value" field of the object pointed to by the next to top item on the operand stack (this).|<<empty>>|
|return|Return back to the place where this method was called.||

----

### How Many Possibilities?
Assume the following:
Two threads
* One instance of ObjectWithValue
* Both calling incrementValue()

Answer the following:
* How many possible ways can those two threads execute?
* What are the possible results?

----

### Answers
How many possible orderings?
* 3,432

How can we calculate it?
* Assuming no looping/branching
* All instructions executed through to completion
* All threads complete
* N = Number of instructions
* T = Number of threads
* {% include include_md_file filename="TddAndConcurrency.slides.WhenItsQuietBeAfraidVeryAfraid.NumberOfCombinations.md" %}

How many possible outcomes?
* 2
* value incremented by 2
* value incremented by 1

How?

----

### Sharing Without Guarding
{% highlight java %}
@Test
public void singleThreaded() throws InterruptedException {
    Thread t = new Thread(incrementValue);
    t.start();
    t.join();
    assertEquals(10000, object.getValue());
}

@Test
public void multipleThreadsFail() throws InterruptedException {
    Thread[] threads = new Thread[5];

    for (int i = 0; i < threads.length; ++i)
        threads[i] = new Thread(incrementValue);

    for (Thread t : threads)  t.start();
    for (Thread t : threads)  t.join();
        
    assertTrue("Expected 10000, actual: " + object.getValue(),
        50000 == object.getValue());
}
{% endhighlight %}

----

### Demo
Let’s demonstrate that this code is broken
* We’ll simply run the tests and hope they fail
* We’ll manually manipulate them
* We’ll use a tool to help us

<iframe src="https://player.vimeo.com/video/291224849" width="640" height="436" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/291224849">ConcurrencyDemo_increasingChangesOfFindingDefect</a> from <a href="https://vimeo.com/user3159463">Brett L. Schuchert</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

{% include nav prev="TddAndConcurrency.Slides.DoOneThingWellWell" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides.ICantWaitWellYouShouldntHaveTo" %}

