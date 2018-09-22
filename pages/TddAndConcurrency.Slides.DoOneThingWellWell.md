---
title: TddAndConcurrency.Slides.DoOneThingWellWell
---
{% include nav prev="TddAndConcurrency.Slides" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides.WhenItsQuietBeAfraidVeryAfraid" %}

## Do One Thing ... Well ... Well

### Focus, Focus, Focus
 You’ve heard it...
* Cohesion
* Separation of concerns
* Single responsibility principle
* Square law of computation

It’s even more important here
^
Why?

### A Simple Server
 Imagine a server that forever…
* Waits for a client connection, 
* Gets a message
* Processes it
{% highlight java %}
    ServerSocket serverSocket = new ServerSocket(8009);
    
    while (true) {
        Socket socket = null;
        try {
             socket = serverSocket.accept();
             String message = getMessage(socket);
             process(message);
        } finally {
             close(socket);
        }
    }
{% endhighlight %}
----
----
### And its client
 Now we need a client that...
* Connects to the server
* Sends a message
* Awaits a response
* Disconnects from the server
{% highlight java %}
    Socket socket = new Socket("localhost", PORT);
    sendMessage(socket);
    getMessage(socket);
    socket.close();
{% endhighlight %}
----
----
### You need to make this faster...
Threads to the rescue, right?
* How can I introduce threading reliably?
* What will change in the design to support threading?
* How can I make this easier to test?
----
----
### How do we test?
 What makes this hard to test?
* Direct dependency on Sockets
{% highlight java %}
    ServerSocket serverSocket = new ServerSocket(8009);
    Socket socket = null;
    socket = serverSocket.accept();
    close(socket);
{% endhighlight %}

* Embedded logic not exposed
{% highlight java %}
    getMessage(socket);
    process(message);
{% endhighlight %}

* Class violates Single Responsibility
  * Connection Management
  * Process client request
----
----
### We want to verify threading...
Extract Classes:
* Pull client processing into its own class
* Pull client acquisition into its own class
* Verify code works as is
* Introduce threading
* Show everything still working
----
----
### Demo
Now we’ll walk through a rewrite of the class to speed it up…
* Client Request Processing
* Client Acquisition
* Dependency Injection
* Server Update

{% include nav prev="TddAndConcurrency.Slides" up="TddAndConcurrency.Slides" next="TddAndConcurrency.Slides.WhenItsQuietBeAfraidVeryAfraid" %}
