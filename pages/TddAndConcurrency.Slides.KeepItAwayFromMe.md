---
title: TddAndConcurrency.Slides.KeepItAwayFromMe
---
{% include nav prev="TddAndConcurrency.Slides.ICantWaitWellYouShouldntHaveTo" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides.FinaNotes" %}

## Keep It Away From Me

### Scope it way down...
A guideline to live by…
* Manage concurrent-based stuff managed in one place
  * Close to where that stuff lives

### Dependent State
Consider the following (incomplete) iterator:
{% highlight java %}
public class IntegerIterator 
	implements Iterator<Integer>, Iterable<Integer> {
    private Integer nextValue = 0;

    public boolean hasNext() {
        return nextValue < 100000;
    }
    public Integer next() {
        return nextValue++;
    }
    public Integer getNextValue() {
        return nextValue;
    }
}
{% endhighlight %}
----
----
### Dependent State+Multi-Threaded
Use this code in a test:
{% highlight java %}
IntegerIterator iterator = new IntegerIterator();

for (Integer value : iterator) {
}

assertEquals(10000, iterator.getNextValue()
{% endhighlight %}

What about this use:
{% highlight java %}
public class UseIntegerIterator implements Runnable {
    IntegerIterator iterator;

    public UseIntegerIterator(IntegerIterator iterator) {
        this.iterator = iterator;
    }

    @Override
    public void run() {
        while (iterator.hasNext()) {
            iterator.next();
        }
    }
}
{% endhighlight %}
And then in some test somewhere:
{% highlight java %}
IntegerIterator iterator = new IntegerIterator();
Thread t1 = new Thread(new UseIntegerIterator(iterator));
Thread t2 = new Thread(new UseIntegerIterator(iterator));
t1.start();
t2.start();
t1.join();
t2.join();

assertEqual(10000, iterator.getNextValue()); // ?? 

{% endhighlight %}

There's a problem. How can we fix it?
* Client-based locking
* Server-based locking
----
----
### Client Based Locking
The client (user) of the common data locks:
{% highlight java %}
public class UseIntegerIteratorClientBasedLocking 
    implements Runnable {
    public void run() {
        while (true) {
            synchronized (iterator) {
                if (iterator.hasNext())
                    iterator.next();
                else
                    break;
            }
        }
    }
}
{% endhighlight %}
----
----
### Server-Based Locking
The server guards the dependent calls:
{% highlight java %}
package dependent.serverbasedlocking;

public class IntegerIteratorServerLocked {
    private Integer nextValue = 0;

    public synchronized Integer getNextOrNull() {
        if (nextValue < 100000)
            return nextValue++;
        else
            return null;
    }
    public Integer getNextValue() {
        return nextValue;
    }
}
{% endhighlight %}

Here’s an updated client that now works:
{% highlight java %}
public void run() {
    while (true) {
        Integer next = iterator.getNextOrNull();
        if (next == null)
            break;
    }
}
{% endhighlight %}

Evaluate, between client-based and server-based locking
* Which do you prefer?
* Which solution most reduces the scope of the shared data?
----
----
### Client or Server-based?
When you have control of the code: Prefer server-based locking
* It reduces the possibility of error
* It reduces repeated code
* It will change your API (your client has change anyway)
* It enforces a single policy
* It reduces the scope of a multi-thread mutable variable
* It makes tracking down errors far easier

What if you don't have control?
*  Adapter to change the API & add Locking
* The Java collections use the collection object itself. Even so:
  * Adapt
  * OR better yet, use the thread-safe collections with extended interfaces
* Pick client-based locking only if it is impossible to use an adapter – which should be nearly never

{% include nav prev="TddAndConcurrency.Slides.ICantWaitWellYouShouldntHaveTo" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides.FinaNotes" %}
