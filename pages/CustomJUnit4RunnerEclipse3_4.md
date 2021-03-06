---
title: CustomJUnit4RunnerEclipse3_4
---
{% include nav prev="CustomJUnit4Runner" %}
## Writing a Custom JUnit 4 Test Runner

### Introduction
(**Note** This example works with the JUnit 4 that is shipped with Eclipse 3.4M7 but it should work with any version of JUnit 4, even 4.4. With JUnit 4.4, you'll get warnings since some of the classes are deprecated. You can use the another, e.g. in IntelliJ or from the command line.

This comes from a recent problem at a customer site. The customer had a number of automated tests written in JUnit. The tests were a mixture of unit tests and integration tests. To try and speed up the developer experience, we though that moving the integration-style tests into a separate source tree would solve the problem.

If we had been primarily working in Eclipse, this would not have been a problem. As it was, we were working in IntelliJ and while I'm sure what we wanted to do was easy if we knew how to do it, we did not. To move along the process, we decided to write a custom JUnit runner.

Here are a few assumptions:
* We want to NOT run the integration tests by default in the IDE
* We want to be able to run the integration tests in the IDE
* We want to be able to run the integration tests using the automated build scripts
* We want to be able to not run the integration tests using the automated build scrips
* A test class' test methods are either all integration tests or none of its methods are integration tests; we did not want to individually decide which tests were integration tests

We settled on a simple approach. If there is a system property defined called**ExecuteIntegrationTests**, we run the integration tests, if not, we ignore them.

#### Original Idea
The original idea was to use the @RunWith(...) annotation to use a custom JUnit4 Runner and then add to that an annotation @Integration to indicate something was an integration test. However, having both was redundant so we settled on simply specifying a custom runner, e.g.:

{% highlight java %}
@RunWith(IntegrationTestIgnorer.class)
public class SomeClassThatHasIntegrationTests {
   @Test
   public void someTestMethod() {
   }
}
{% endhighlight %}

When this test is executed either:
* All tests are ignored if the environment variable**ExecuteIntegrationTests** is defined
* All tests are executed if the environment variable**ExecuteIntegrationTests** is not defined

To get integration tests to execute, simply add -DExecuteIntegrationTests to the command-line when running the JVM.
### The Code
After many trials and opening up the JUnit 4.4. source, this is what we came up with:
----
----
#### IntegrationTestIgnorer
This class is both a Runner and holds on to a runner. The particular runner is determined by a factory class (**RunnerFactory** below). This class simply adds a level of indirection between the execution of a test and the selection of the particular JUnit runner used to execute tests in a given test class.
{% highlight java %}
package com.om.runner;

import org.junit.internal.runners.InitializationError;
import org.junit.runner.Description;
import org.junit.runner.Runner;
import org.junit.runner.notification.RunNotifier;

public class IntegrationTestIgnorer extends Runner {
    Runner runner;

    public IntegrationTestIgnorer(Class<?> clazz) throws InitializationError {
        runner = RunnerFactory.createRunnerFor(clazz);
    }

    @Override
    public Description getDescription() {
        return runner.getDescription();
    }

    @Override
    public void run(RunNotifier runNotifier) {
        runner.run(runNotifier);
    }

    @Override
    public int testCount() {
        return runner.testCount();
    }
}
{% endhighlight %}
----
----
#### RunnerFactory.java
This class determines whether or not Integration tests should be skipped and the style of test class and then constructs an appropriate runner to run the tests (or ignore them).

There are 4 possibilities based on the following two items:
* Are we or are we not skipping Integration tests (system property defined or not)
* Are we using a JUnit 3 or JUnit 4 style test (class derives from TestCase or not)
{% highlight java %}
package com.om.runner;

import junit.framework.TestCase;

import org.junit.internal.runners.InitializationError;
import org.junit.internal.runners.OldTestClassRunner;
import org.junit.internal.runners.TestClassRunner;
import org.junit.runner.Runner;

public class RunnerFactory {

    public static Runner createRunnerFor(Class<?> clazz) throws InitializationError {
        if (shouldSkipClass() && isSubclassOfTestCase(clazz)) {
            return new JUnit38TestMethodIgnorer(clazz);
        }

        if (shouldSkipClass() && !isSubclassOfTestCase(clazz)) {
            return new JUnit4TestMethodIgnorer(clazz);
        }

        if (!shouldSkipClass() && isSubclassOfTestCase(clazz)) {
            return new OldTestClassRunner(clazz);
        }

        return new TestClassRunner(clazz);
    }

    private static boolean isSubclassOfTestCase(Class<?> clazz) {
        return TestCase.class.isAssignableFrom(clazz);
    }

    public static boolean shouldSkipClass() {
        return System.getProperty("ExecuteIntegrationTests") == null;
    }

}
{% endhighlight %}
----
----
#### JUnit38TestMethodIgnorer.java
This class simply fires a "test ignored" message so that listeners know that each test was skipped. In IntelliJ and JUnit, their respective runners register listeners that select an icon in a tree viewer based on this message being fired. Also, by firing a message per test method, the progress bars will be updated correctly (as will test execution counts).
{% highlight java %}
package com.om.runner;

import java.lang.reflect.Method;

import org.junit.internal.runners.InitializationError;
import org.junit.internal.runners.OldTestClassRunner;
import org.junit.runner.notification.RunNotifier;

import com.orbitz.bop.TestIgnorer;
import com.orbitz.bop.TestMethodIgnorerUtil;

public final class JUnit38TestMethodIgnorer extends OldTestClassRunner implements TestIgnorer {
    private final Class<?> clazz;

    public JUnit38TestMethodIgnorer(Class<?> clazz) throws InitializationError {
        super(clazz);
        this.clazz = clazz;
    }

    @Override
    public void run(RunNotifier notifier) {
        TestMethodIgnorerUtil.run(clazz, notifier, this);
    }

    public boolean isTestMethod(Method method) {
        return method.getParameterTypes().length == 0 && 
               method.getName().startsWith("test") && 
               method.getReturnType().equals(Void.TYPE);
    }
}
{% endhighlight %}
----
----
#### JUnit4TestMethodIgnorer.java
This test accomplishes the same thing in a somewhat easier manner than the JUnit 3 ignorer. There is a method to execute an individual test method, which this class simply overrides to fire an ignored test message. However, if all methods are ignored, the class will fail validation as defined in the base class JUnit4ClassRunner. So, this class also overrides the validate() method to make that error go away.
{% highlight java %}
package com.om.runner;

import java.lang.reflect.Method;

import org.junit.internal.runners.InitializationError;
import org.junit.internal.runners.TestClassRunner;
import org.junit.runner.notification.RunNotifier;

public class JUnit4TestMethodIgnorer extends TestClassRunner implements TestIgnorer {

    public JUnit4TestMethodIgnorer(Class<?> clazz) throws InitializationError {
        super(clazz);
    }

    @Override
    public void run(RunNotifier notifier) {
        TestMethodIgnorerUtil.run(getTestClass(), notifier, this);
    }

    public boolean isTestMethod(Method method) {
        return method.getAnnotation(org.junit.Test.class) != null;
    }
}
{% endhighlight %}
----
----
#### TestIgnorer
To remove duplication, we introduced a simple interface called test ignorer:
{% highlight java %}
package com.om.runner;

import java.lang.reflect.Method;

public interface TestIgnorer {

    boolean isTestMethod(Method method);

}
{% endhighlight %}
----
----
#### TestMethodIgnorerUtil
Since most of the code was the same between the two classes, this utility class simply holds the run() method and calls back. We could not use a single hierarchy since the two classes require inheritance from different base classes.
{% highlight java %}
package com.orbitz.bop;

import java.lang.reflect.Method;

import org.junit.runner.Description;
import org.junit.runner.notification.RunNotifier;

public class TestMethodIgnorerUtil {
    public static void run(Class<?> clazz, RunNotifier notifier, TestIgnorer ignorer) {
        Method[] methods = clazz.getDeclaredMethods();
        for (Method method : methods) {
            if (ignorer.isTestMethod(method)) {
                TestMethodIgnorerUtil.fireIgnored(notifier, clazz, method);
            }
        }
    }

    private static void fireIgnored(RunNotifier notifier, Class<?> clazz, Method method) {
        Description description = Description.createTestDescription(clazz, method.getName());
        notifier.fireTestIgnored(description);
    }

}
{% endhighlight %}
