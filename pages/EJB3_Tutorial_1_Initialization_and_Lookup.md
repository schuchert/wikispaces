---
title: EJB3_Tutorial_1_Initialization_and_Lookup
---
There's a bit of boilerplate code to get the JBoss EJB3 Embeddable Container initialized before we can look up our session bean. For now we'll just use this code so we won't describe it in any detail here.

By the way, I recommend you cut and past this code rather than type it.

{% include include_md_file filename="Ejb3JBossUtilJava.md" %}

To create this file,
* Select your **src** directory
* Right-click and select **New::Class**
* For **Class Name** enter **JBossUtil**
* For **Package** enter **util**
* Click **Finish**
* Type or copy the code from above into the new file then save it by pressing ctrl-s

### Using JUnit
Now we need to enter basic system setup and then execute a test. The following unit test performs basic setup and initialization, looks up a session bean and sends it a message. 

To create this test:
* Select your **test** source folder
* Right-click, select **New:Class**
* Enter **HelloWorldServiceImplTest** for the name
* Enter **ervice.impl** for the package
* Click **Finish**
* Copy the text below into the file (replacing the entire contents)
* Save the file
{% highlight java %}
package service.impl;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import service.HelloWorldService;
import util.JBossUtil;

public class HelloWorldServiceImplTest {
    private HelloWorldService service;

    @BeforeClass
    public static void startDeployer() {
        // Note, we could stop the deployer when we are done but we do not since
        // the JVM will shut down and stop the deployer for us.
        JBossUtil.startDeployer();
    }

    @Before
    public void lookupService() {
        service = JBossUtil.lookup(HelloWorldService.class,
                "HelloWorldServiceImpl/local");
    }

    @Test
    public void sayHello() {
        service.sayHelloTo("Brett");
    }
}
{% endhighlight %}

### Execute your "Unit Test"
Run this JUnit "test" and make sure it runs successfully. (Right-click on the class, select **Run As:JUnit Test**.

You will see the following output:
{% highlight terminal %}
Hello to Brett
{% endhighlight %}

Note that this example produces output to the console. This example service is not really very testable. How might you "fix" this?

### Nice
Congratulations, you've created your first EJB3 Session bean and executed it.
