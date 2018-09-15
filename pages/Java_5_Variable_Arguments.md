---
title: Java_5_Variable_Arguments
---
{:toc}
[<--Back](Articles)

# Java 5 Variable Arguments

This article uses Log4J as a vehicle to describe Java 5 Variable Augments through a concrete example.

There are 4 versions of the same program:
* [Version 1](Java_5_Variable_Arguments#Mainv1): A typical use that does not wrap as is typical
* [Version 2](Java_5_Variable_Arguments#Mainv2): Same as version 1 but uses a convenience method in the String class
* [Version 3](Java_5_Variable_Arguments#Mainv3): Shows what we should do using the existing interface
* [Version 4](Java_5_Variable_Arguments#Mainv4): Shows a new interface using Java 5 variable arguments

## Version 1
Here is a typical example of using Log4J with a simple utility class that:
* Configures Log4J
* Returns the logger for a provided class

[#Mainv1](#Mainv1)
## Main.java
{% highlight java %}
01: package varargs.v1;
02: 
03: import org.apache.log4j.Logger;
04: 
05: public final class Main {
06:     private Main() {
07:         // all static methods, do not instantiate me
08:     }
09: 
10:     public static final String FILE_NAME = "SomeFileName";
11:     public static final String ERROR_CONTACT = "someemail@palcetocontact.com";
12: 
13:     public static void main(final String[] args) {
14:         final Logger myLogger = LoggingConfiguration.getLoggerFor(Main.class);
15: 
16:         myLogger.debug("Problem with file: " + FILE_NAME + ". Please contact: " + ERROR_CONTACT);
17:     }
18: }
{% endhighlight %}

### Interesting Lines

|Line|Description|
|14|Use a utility class to retrieve a logger for my class.|
|16|Use the logger.|

So what is wrong with this example? Specifically, something is missing. In a real application, line 16 should be wrapped in some conditional logic. Don't worry if you're not sure about this, it's coming up.

## Version 2
This version only introduced the use of a new utility method on the String class. Instead of writing the following:
{% highlight terminal %}
   System.out.println("You have scored: " + points + ", and made it to level: " + level);
{% endhighlight %}
You can use the new method [String.format](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/String.html) and C-style format strings:
{% highlight terminal %}
    String.format("You have scored: %d, and made it to level: %d", points, level);
{% endhighlight %}

Note that String.format is an example of a method whose parameters are defined using variable arguments.

Here's the code for version 2:

[#Mainv2](#Mainv2)
## Main.java
{% highlight java %}
01: package varargs.v2;
02: 
03: import org.apache.log4j.Logger;
04: 
05: public final class Main {
06:     private Main() {
07:         // all static methods, do not instantiate me
08:     }
09: 
10:     public static final String FILE_NAME = "SomeFileName";
11:     public static final String ERROR_CONTACT = "someemail@palcetocontact.com";
12: 
13:     public static void main(final String[] args) {
14:         final Logger myLogger = LoggingConfiguration.getLoggerFor(Main.class);
15: 
16:         myLogger.debug(String.format("Problem with file: %s. Please contact: %s", FILE_NAME,
17:                 ERROR_CONTACT));
18:     }
19: }
{% endhighlight %}

### Interesting Lines

|Line|Description|
|16 - 17|Use the String.format method to produce the same output as before.|

## Version 3
Version 3 adds the missing element mentioned in version 1. Namely, in both version 1 and version 2, we are formatting a String, performing string concatenation, allocating memory, etc. when it might not be necessary.

The logger might not be displaying debug-level information. If it is not, then we have wasted time and memory on String manipulation. This is a typical problem with logging. It may not seem like much but from my experience it is a big deal. In a large system, you'll end up garbage collecting more often than necessary.

There's an "easy" fix. You can ask the logger if the level you're going to output is currently enabled. If it is not, then you don't to the work:
{% highlight terminal %}
   if(myLogger.isDebugEnabled()) {
      myLogger.debug(String.format("Problem with file: %s. Please contact: %s", FILE_NAME, ERROR_CONTACT));
   }
{% endhighlight %}

It is ugly but it makes a big difference.

Here's the code modified to take this into consideration:

[#Mainv3](#Mainv3)
## Main.java
{% highlight java %}
01: package varargs.v3;
02: 
03: import org.apache.log4j.Logger;
04: 
05: public final class Main {
06:     private Main() {
07:         // all static methods, do not instantiate me
08:     }
09: 
10:     public static final String FILE_NAME = "SomeFileName";
11:     public static final String ERROR_CONTACT = "someemail@palcetocontact.com";
12: 
13:     public static void main(final String[] args) {
14:         final Logger myLogger = LoggingConfiguration.getLoggerFor(Main.class);
15: 
16:         if (myLogger.isDebugEnabled()) {
17:             myLogger.debug(String.format("Problem with file: %s. Please contact: %s", FILE_NAME,
18:                     ERROR_CONTACT));
19:         }
20:     }
21: }
{% endhighlight %}
### Interesting Lines

|Line|Description|
|16 - 19|Now we are wrapping our calls to the logger just in case we are not currently printing debugging information.|

This is ugly, error prone and a pain, right? But it really does make a big difference. What if you could make this happen automagically?

## Version 4
This version has the advantages of versions 1 and 2 in terms of what you write. It also has most of the advantages of version 3 in terms of not doing work unnecessarily.

First let's look at the use of the code:

[#Mainv4](#Mainv4)
## Main.java
{% highlight java %}
01: package varargs.v4;
02: 
03: public final class Main {
04:     private Main() {
05:         // all static methods, do not instantiate me
06:     }
07: 
08:     public static final String FILE_NAME = "SomeFileName";
09:     public static final String ERROR_CONTACT = "someemail@palcetocontact.com";
10: 
11:     public static void main(final String[] args) {
12:         final ILogger myLogger = LoggingConfiguration.getLoggerFor(Main.class);
13: 
14:         myLogger.debug("Problem with file: %s. Please contact: %s", FILE_NAME, ERROR_CONTACT);
15:     }
16: }
{% endhighlight %}
### Interesting Lines

|Line|Description|
|14|What? This is just back to version 2, right?|
|12|This was Logger, now it is ILogger.|

To make this work, we first introduce an interface that uses Java 5 Variable Arguments:

[#ILogger](#ILogger)
## ILogger.java
{% highlight java %}
01: package varargs.v4;
02: 
03: public interface ILogger {
04:     ILogger debug(String formatString, Object... objects);
05:     ILogger debug(Throwable t, String formatString, Object... objects);
06:     boolean isDebugEnabled();
07: 
08:     ILogger info(String formatString, Object... objects);
09:     ILogger info(Throwable t, String formatString, Object... objects);
10:     boolean isInfoEnabled();
11: 
12:     ILogger warn(String formatString, Object... objects);
13:     ILogger warn(Throwable t, String formatString, Object... objects);
14:     boolean isWarnEnabled();
15: 
16:     ILogger error(String formatString, Object... objects);
17:     ILogger error(Throwable t, String formatString, Object... objects);
18:     boolean isErrorEnabled();
19: 
20:     ILogger fatal(String formatString, Object... objects);
21:     ILogger fatal(Throwable t, String formatString, Object... objects);
22:     boolean isFataEnabled();
23: }
{% endhighlight %}

Next, we write a simple implementation for this interface. For now we'll just look at one of the methods:
{% highlight terminal %}
14:     public ILogger debug(final String formatString, final Object... objects) {
15:         if (isDebugEnabled()) {
16:             wrappedLogger.debug(String.format(formatString, objects));
17:         }
18:         return this;
19:     }
{% endhighlight %}

### Interesting Lines

|Line|Description|
|14|This method uses variable arguments. You can tell this when you see **Object...**. It turns out that objects is simply an array of Objects. You can write objects[0] to get the first element (assuming there are some elements in it).|
|15|Our wrapper performs the isDebugEnabled() check for us rather than having to do it everywhere where we use the logger.|
|16|This line uses the String.format method we introduced in Version 2. It was a necessary step. Notice that we pass in a variable number of arguments and we simply pass those arguments on to the String.format method.|

This version was not possible before variable arguments. We might have some overhead in the passing of parameters but we have much more elegant code that does what it should without burdening the programmer.

Here is the full implementation:
----
[#LoggerImpl](#LoggerImpl)
## LoggerImpl.java
{% highlight java %}
01: package varargs.v4;
02: 
03: import org.apache.log4j.Level;
04: import org.apache.log4j.Logger;
05: 
06: public class LoggerImpl implements ILogger {
07:     private final Logger wrappedLogger; // NOPMD by brett.schuchert on 8/5/06
08:                                         // 5:58 PM
09: 
10:     public LoggerImpl(final Logger wrappedLogger) {
11:         this.wrappedLogger = wrappedLogger;
12:     }
13: 
14:     public ILogger debug(final String formatString, final Object... objects) {
15:         if (isDebugEnabled()) {
16:             wrappedLogger.debug(String.format(formatString, objects));
17:         }
18:         return this;
19:     }
20: 
21:     public ILogger debug(final Throwable t, final String formatString, final Object... objects) {
22:         if (isDebugEnabled()) {
23:             wrappedLogger.debug(String.format(formatString, objects), t);
24:         }
25:         return this;
26:     }
27: 
28:     public boolean isDebugEnabled() {
29:         return wrappedLogger.isDebugEnabled();
30:     }
31: 
32:     public ILogger warn(final String formatString, final Object... objects) {
33:         if (isWarnEnabled()) {
34:             wrappedLogger.warn(String.format(formatString, objects));
35:         }
36: 
37:         return this;
38:     }
39: 
40:     public ILogger warn(final Throwable t, final String formatString, final Object... objects) {
41:         if (isWarnEnabled()) {
42:             wrappedLogger.warn(String.format(formatString, objects), t);
43:         }
44: 
45:         return this;
46:     }
47: 
48:     public boolean isWarnEnabled() {
49:         return wrappedLogger.isEnabledFor(Level.WARN);
50:     }
51: 
52:     public ILogger info(final Throwable t, final String formatString, final Object... objects) {
53:         if (isInfoEnabled()) {
54:             wrappedLogger.info(String.format(formatString, objects));
55:         }
56: 
57:         return this;
58:     }
59: 
60:     public ILogger info(final String formatString, final Object... objects) {
61:         if (isInfoEnabled()) {
62:             wrappedLogger.info(String.format(formatString, objects));
63:         }
64: 
65:         return this;
66:     }
67: 
68:     public boolean isInfoEnabled() {
69:         return wrappedLogger.isEnabledFor(Level.INFO);
70:     }
71: 
72:     public ILogger error(final String formatString, final Object... objects) {
73:         if (isErrorEnabled()) {
74:             wrappedLogger.error(String.format(formatString, objects));
75:         }
76: 
77:         return this;
78:     }
79: 
80:     public ILogger error(final Throwable t, final String formatString, final Object... objects) {
81:         if (isErrorEnabled()) {
82:             wrappedLogger.error(String.format(formatString, objects), t);
83:         }
84: 
85:         return this;
86:     }
87: 
88:     public boolean isErrorEnabled() {
89:         return wrappedLogger.isEnabledFor(Level.ERROR);
90:     }
91: 
92:     public ILogger fatal(final String formatString, final Object... objects) {
93:         if (isFataEnabled()) {
94:             wrappedLogger.fatal(String.format(formatString, objects));
95:         }
96: 
97:         return this;
98:     }
99: 
100:     public ILogger fatal(final Throwable t, final String formatString, final Object... objects) {
101:         if (isFataEnabled()) {
102:             wrappedLogger.fatal(String.format(formatString, objects), t);
103:         }
104: 
105:         return this;
106:     }
107: 
108:     public boolean isFataEnabled() {
109:         return wrappedLogger.isEnabledFor(Level.FATAL);
110:     }
111: 
112: }
{% endhighlight %}

And finally, for completeness, here are the final two files in this final example:

[#LoggingConfiguration](#LoggingConfiguration)
## LoggingConfiguration.java
{% highlight java %}
01: package varargs.v4;
02: 
03: import java.net.URL;
04: 
05: import org.apache.log4j.BasicConfigurator;
06: import org.apache.log4j.Logger;
07: import org.apache.log4j.PropertyConfigurator;
08: 
09: public final class LoggingConfiguration {
10:     private static final String LOG4J_PROPS = "varargs/v4/log4j.properties";
11: 
12:     private LoggingConfiguration() {
13:         // utility class
14:     }
15: 
16:     static {
17:         BasicConfigurator.configure();
18:         URL propertiesUrl = LoggingConfiguration.class.getClassLoader().getResource(LOG4J_PROPS);
19:         if (propertiesUrl == null) {
20:             getLoggerFor(LoggingConfiguration.class).fatal("Unable to configure logger using: %s",
21:                     LOG4J_PROPS);
22:         } else {
23:             PropertyConfigurator.configure(propertiesUrl);
24:         }
25:     }
26: 
27:     public static ILogger getLoggerFor(final Class clazz) {
28:         return new LoggerImpl(Logger.getLogger(clazz));
29:     }
30: 
31:     public static void initialize() {
32:         // an empty method, when a class uses this method it causes the class
33:         // to get loaded, which runs its static initializer that reads
34:         // additional configuration.
35:     }
36: 
37: }
{% endhighlight %}

[#log4j_properties](#log4j_properties)
## log4j.properties
{% highlight terminal %}
log4j.logger.org.springframework=WARN
{% endhighlight %}

Notice that by using variable arguments we've:
* Reduced what a developer needs to write and still get reasonable logging performance
* Moved repeated code to a single place

But it does not come without some costs. If you wrap as demonstrated in the 3rd version:
* You avoid a function call and parameter passing
* Java does not need to make the array of objects, which is how it passes variable arguments
* If your code calls a function to calculate the output, you call the function even if you do not perform the output.

# Summary

### Define Variable Arguments
{% highlight terminal %}
    public void someMethod(Object... objects) {}
{% endhighlight %}

### Calling a method that takes them
{% highlight terminal %}
    someObject.someMethod("Brett", 11234, object2, 'a');
{% endhighlight %}

### Calling a method when you already have an array of objects
{% highlight terminal %}
    Object[] objects = new Object[]{"Brett", 11234, object2, 'a'};
    someObject.someMethod(objects);
{% endhighlight %}

### Notes
* The variable argument parameter must be last
* You will need to look at the contents of the array of objects
* This is not something you'll use heavily. Most likely it will support non-functional requirements better than functional requirements.

Here is the source code for all 4 versions in an Eclipse 3.2 archive file.
[[file:VariableArgumentsExample.zip]]

# Other Resources
* [Speeding up Log4J in Java 1.5](http://surguy.net/articles/removing-log-messages.xml)

[<--Back](Articles)
