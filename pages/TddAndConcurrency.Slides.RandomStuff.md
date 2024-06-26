---
title: TddAndConcurrency.Slides.RandomStuff
---
{% include nav prev="TddAndConcurrency.Slides.FinaNotes" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides" %}

## TDD & Concurrency
### Atomic Variables
Modern Processors have a single instruction
* Compare And Swap (CAS)
* Logical example of optimistic locking
{% highlight terminal %}
IncrementValue() {
   int v;
   do {
      v = get current value
   } while(v != compareAndSwap(v, v+1))
}
{% endhighlight %}
* Keep attempting to increment value until it actually happens
* If processor does not support CAS operation, Java compiler simulates it.
  * If this is the case, high-contention systems will burn CPU time
----
----
### Conditions for Deadlock
* Mutual Exclusion
  * Multiple threads want to use same (limited) resource
  * Cannot be used at same time
  * E.g. A database connection
* Lock and Wait
  * Require multiple non-sharable resources
  * Grab one at a time
  * Hold until have them all
* No Preemption
  * One process cannot take another process’s resource
  * Or force another process to release resources
* Circular Wait
  * At least two resources required by at least two threads
----
----
### Avoiding Deadlock
* Break any of the 4 conditions
  * Makes deadlock impossible
  * Has performance and responsiveness ramifications
* Mutual Exclusion
  * Don’t lock mutual resources
  * Don’t share
  * Make more available
  * Only lock one at a time
* Lock and Wait
  * Don’t wait – back-off if everything not available
* No preemption
  * Demand threads to release
  * DO NOT use Thread.stop() – can leave resources locked
* Circular Wait
  * Order your locks

{% include nav prev="TddAndConcurrency.Slides.FinaNotes" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides" %}
