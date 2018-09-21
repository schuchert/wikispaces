---
title: ProblemsRunningJavaAgentSmokeTest
---
[<--Back](AnExampleJavaAgent)
If you see anything else, use the output to fix the problem.

Here are some examples:
### Forget -javaagent
{% highlight terminal %}
Exception in thread "main" java.lang.NoClassDefFoundError: schuchert/agent/Main
{% endhighlight %}
Note: If you happen to have added Registrar.jar to your classpath, you'd see this instead:
{% highlight terminal %}
No ClassFileTransformers
	added by: schuchert.agent.ConfigurableClassFileTransformerRegistrar
	using system property: schuchert.ClassFileTransformer
When starting VM, please specify the following two VM arguments:
	-javaagent:Registrar.jar (or the name you're using)
	-Dschuchert.ClassFileTransformer=<SomeClassInClassPath>
		(e.g. schuchert.ClassFileTransformer=schuchert.agent.NullClassFileTransformer)
{% endhighlight %}

### Mistype Jarname after -javaagent:
{% highlight terminal %}
Error opening zip file: Registrr.jar
Error occurred during initialization of VM
agent library failed to init: instrument
Abort trap
{% endhighlight %}

### Forget to define system property
{% highlight terminal %}
{% endhighlight %}

### System Property Points to Wrong/Mistyped/Missing class
{% highlight terminal %}
java.lang.ClassNotFoundException: BadClassName
	at java.net.URLClassLoader$1.run(URLClassLoader.java:200)
	at java.security.AccessController.doPrivileged(Native Method)
	at java.net.URLClassLoader.findClass(URLClassLoader.java:188)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:316)
	at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:280)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:251)
	at java.lang.ClassLoader.loadClassInternal(ClassLoader.java:374)
	at java.lang.Class.forName0(Native Method)
	at java.lang.Class.forName(Class.java:164)
	at schuchert.agent.ConfigurableClassFileTransformerRegistrar.createTargetTransformer(Configurabl...
	at schuchert.agent.ConfigurableClassFileTransformerRegistrar.addOneClassFileTransformer(Configur...
	at schuchert.agent.ConfigurableClassFileTransformerRegistrar.premain(ConfigurableClassFileTransf...
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:39)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:25)
	at java.lang.reflect.Method.invoke(Method.java:585)
	at sun.instrument.InstrumentationImpl.loadClassAndCallPremain(InstrumentationImpl.java:141)
Unable to instantiate: BadClassName
Please check setting for system property: schuchert.ClassFileTransformer
e.g. -Dschuchert.ClassFileTransformer=schuchert.agent.NullClassFileTransformer
No ClassFileTransformers
	added by: schuchert.agent.ConfigurableClassFileTransformerRegistrar
	using system property: schuchert.ClassFileTransformer
When starting VM, please specify the following two VM arguments:
	-javaagent:Registrar.jar (or the name you're using)
	-Dschuchert.ClassFileTransformer=<SomeClassInClassPath>
		(e.g. schuchert.ClassFileTransformer=schuchert.agent.NullClassFileTransformer)
{% endhighlight %}

### Not Running Main
Cannot give an example, other than if you simply mistype the name of the class:
{% highlight terminal %}
Exception in thread "main" java.lang.NoClassDefFoundError: schuchert/agent/MainNameWrong
{% endhighlight %}
[<--Back](AnExampleJavaAgent)
