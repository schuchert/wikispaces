---
title: EJB3_Tutorial_1_Create_Session_Bean
---
Now that we have all the preliminary setup of the environment we next need to create a session bean.

### The Session Bean
The basic requirement for a session bean is that it must implement an interface and be either annotated with **@Stateless** or be registered in an XML file. We are sticking strictly to using annotations. The annotation goes on the class and not the interface, so here's the interface.

### The Interface
First we create a session bean. Here is one such example:
{% highlight java %}
package service;

/**
 * A requirement for EJB3 Session beans is that they implement an interface.
 * This interface does not specify whether it is local or remote so we won't
 * know until it is used which way to treat it. One convention is to include the
 * name "Local" or "Remote" in the name of the service.
 */
public interface HelloWorldService {
    void sayHelloTo(final String name);
}
{% endhighlight %}

To create this file, 
* select your **src** directory, right-click and select **New:Interface**.
* For **Name**, enter **HelloWorldService**
* For **Package** enter **service**
* Click on **Finish** then enter the above code into the file
* Save your file (ctrl-s)

### The Session Bean
Next, we need to create a session bean. Here's the code for it:
{% highlight java %}
package service.impl;

import javax.ejb.Stateless;

import service.HelloWorldService;

/**
 * I'm a stateless session because of the -at- Stateless annotation. I only
 * implement one interface and that interface does not explicitly declare itself
 * to be either -at- Local or -at- Remote. Therefore, I am a Stateless session
 * bean with a local interface.
 */
@Stateless
public class HelloWorldServiceImpl implements HelloWorldService {

    public void sayHelloTo(final String name) {
        System.out.printf("Hello to %s\n", name);
    }

}
{% endhighlight %}

Notice that this class has the @Stateless annotation. The container will find this class and register it automatically under JNDI using the (non-package qualifited) class name plus "/local". In this example, that means we'll need to lookup **"HelloWorldServiceImpl/local"**. 

This class is obviously stateless because of the annotation. This is the default behavior. However, using the annotation will get it automatically available from JNDI. (We could put this information in an XML file and get the same results.)

This class is also local. By default, session beans are local (no RMI-IIOP to call them) unless:
* They implement more that one interface (ignoring common interfaces like Serializable and Comparable).
* There is a @Remote annotation

If you still want a local session bean where there is more than one interface, you can use @Local.

To create this file:
* select your **src** directory, right-click and select **New:Class**
* For **Name**, enter **HelloWorldServiceImpl**
* For **Package** enter **service.impl**
* Click on **Finish** then enter the above code into the file
* Save your file (ctrl-s)
