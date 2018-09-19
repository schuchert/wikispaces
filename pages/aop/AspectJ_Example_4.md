---
title: AspectJ_Example_4
---
[<--Back](AspectJ_Self_Study) [Next-->](ApsectJEX4ExpectedVersusActualOutput)

# Predict the Output
Source files are here: [[file:AspectJExample4src.zip]]. If you need instructions on what do with these files, try [here](ExtractingSourceFilesIntoProject).

Have a look at the following Java files and, as before, predict the output.
----
## Main.java
{% highlight java %}
package ex4;

public class Main {
	public static void main(String args[]) {
		Address a = new Address();
		Dao.save(a);
		a.setZip(null);
		Dao.save(a);
		a.setZip("75001");
		Dao.save(a);
		Dao.save(a);
	}
}
{% endhighlight %}
----
{: #Dao}
## Dao.java
{% highlight java %}
package ex4;

public class Dao {
	public static void save(Object o) {
		if (o != null) {
			System.out.printf("Saving: %s\n", o.getClass());
		}
	}
}
{% endhighlight %}
----
## Address.java
Address is unchanged from the previous example. It is a simple Java Bean style class with setters and getters.
----
## Assignment: Predict the Output
Please take a few moments to predict the output before moving on.

[<--Back](AspectJ_Self_Study) [Next-->](ApsectJEX4ExpectedVersusActualOutput)
