---
title: JBoss_AOP_Example_3
---
[<--Back]({{site.pagesurl}}/JBoss_AOP_Self_Study) [Next-->]({{ site.pagesurl}}/JBossAOPEX3ExpectedVersusActualOutput)

# Predict the Output
Source files are here: [[file:JBossAOPExample3src.zip]]. If you need instructions on what do with these files, try [here]({{ site.pagesurl}}/ExtractingSourceFilesIntoProject).

Have a look at the following Java files and, as before, predict the output.
----
## Main.java
```java
package ex3;

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
```
----
## Dao.java
```java
package ex3;

public class Dao {
	public static void save(Object o) {
		if (o != null) {
			System.out.printf("Saving: %s\n", o.getClass());
		}
	}
}
```
----
## Address.java
Address is unchanged from the previous example. It is a simple Java Bean style class with setters and getters.
----
## Assignment: Predict the Output
Please take a few moments to predict the output before moving on.

[<--Back]({{site.pagesurl}}/JBoss_AOP_Self_Study) [Next-->]({{ site.pagesurl}}/JBossAOPEX3ExpectedVersusActualOutput)
