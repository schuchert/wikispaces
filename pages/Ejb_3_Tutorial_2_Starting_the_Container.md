---
title: Ejb_3_Tutorial_2_Starting_the_Container
---
As with our first tutorial, we need to be able to start the container. Here's the JBossUtil class again. Below is the file again. However, to get this file into your new tutorial:
# Expand your first project (**Ejb3Tutorial1**)
# Expand the **src** directory, select the **util** package
# Copy it (**ctrl-c** or right-click and select **copy**)
# Expand your second project (**Ejb3Tutorial2**)
# Select the **src** directory
# Paste it (**ctrl-v** or right-click and select **paste**)

### JBossUtil.java
{% highlight java %}
package util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.logging.Logger;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.jboss.ejb3.embedded.EJB3StandaloneBootstrap;

/**
 * This class was originally necessary when using the ALPHA 5 version of the
 * embeddable container. With the alpha 9 release, initialization is quite
 * simple, you need just 2 lines to initialize your JBoss Embeddable EJB3
 * Container Environment. Unfortunately, the one that is available for download
 * uses System.out.println() in a few places, so this simple utility hides that
 * output and also provides a simple lookup mechanism.
 */
public class JBossUtil {
    private static PrintStream originalOut;
    private static PrintStream originalErr;
    private static OutputStream testOutputStream;
    private static PrintStream testOuputPrintStream;

    static boolean initialized;
    static InitialContext ctx;

    private JBossUtil() {
        // I'm a utility class, do not instantiate me
    }

    /**
     * JBoss EJB3 Embeddable Container uses System.out. Redirect that output to
     * keep the console output clean.
     */
    private static void redirectStreams() {
        // configure the console to get rid of hard-coded System.out's in
        // the JBoss libraries
        testOutputStream = new ByteArrayOutputStream(2048);
        testOuputPrintStream = new PrintStream(testOutputStream);

        originalOut = System.out;
        originalErr = System.err;

        System.setOut(testOuputPrintStream);
        System.setErr(testOuputPrintStream);
    }

    /**
     * Restore the System.out and System.err streams to their original state.
     * Close the temporary stream created for the purpose of redirecting I/O
     * while the initializing is going on.
     */
    private static void restoreStreams() {
        System.setOut(originalOut);
        System.setErr(originalErr);
        testOuputPrintStream.close();
        try {
            testOutputStream.close();
        } catch (IOException e) {
            Logger.getLogger(JBossUtil.class.getName()).info(
                    "Unable to close testoutstream");
        }
    }

    /**
     * This method starts and initializes the embeddable container. We do not
     * offer a method to properly clean up the container since this is really
     * meant for testing only.
     * 
     * This method may freely be called as often as you'd like since it lazily
     * initializes the container only once.
     */
    public static void startDeployer() {
        if (!initialized) {
            redirectStreams();

            EJB3StandaloneBootstrap.boot(null);
            EJB3StandaloneBootstrap.scanClasspath();

            initialized = true;

            restoreStreams();
        }
    }

    /**
     * This is for symmetry. Given how we are using this class, there's little
     * need to actually shutdown the container since we run a quick application
     * and then stop the JVM.
     */
    public static void shutdownDeployer() {
        EJB3StandaloneBootstrap.shutdown();
    }

    private static InitialContext getContext() {
        /**
         * We only keep one context around, so lazily initialize it
         */
        if (ctx == null) {
            try {
                ctx = new InitialContext();
            } catch (NamingException e) {
                throw new RuntimeException("Unable to get initial context", e);
            }
        }

        return ctx;
    }

    /**
     * The lookup method on InitialContext returns Object. This simple wrapper
     * asks first for the expected type and the for the name to find. It gets
     * the name out of JNDI and performs a simple type-check. It then casts to
     * the type provided as the first parameter.
     * 
     * This isn't strictly correct since the cast uses the expression (T), where
     * T is the generic parameter and the type is erased at run-time. However,
     * since we first perform a type check, we know this cast is safe. The -at-
     * SuppressWarnings lets the Java Compiler know that we think we know what
     * we are doing.
     * 
     * @param <T>
     *            Type type provided as the first parameter
     * @param clazz
     *            The type to cast to upon return
     * @param name
     *            The name to find in Jndi, e.g. XxxDao/local or, XxxDao/Remote
     * @return Something out of Jndi cast to the type provided as the first
     *         parameter.
     */
    @SuppressWarnings("unchecked")
    public static <T> T lookup(Class<T> clazz, String name) {
        final InitialContext ctx = getContext();
        /**
         * Perform the lookup, verify that it is type-compatible with clazz and
         * cast the return type (using the erased type because that's all we
         * have) so the client does not need to perform the cast.
         */
        try {
            final Object object = ctx.lookup(name);
            if (clazz.isAssignableFrom(object.getClass())) {
                return (T) object;
            } else {
                throw new RuntimeException(String.format(
                        "Class found: %s cannot be assigned to type: %s",
                        object.getClass(), clazz));
            }

        } catch (NamingException e) {
            throw new RuntimeException(String.format(
                    "Unable to find ejb for %s", clazz.getName()), e);
        }
    }
}
{% endhighlight %}

A unit test or main program can use the following code to initialize the JBoss EJB 3 Container:
{% highlight java %}
    JBossUtil.startDeployer();
{% endhighlight %}
