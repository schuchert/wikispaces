---
title: AnExampleJavaAgent
---
[<<-- back](JavaAgent)
## Smoke Test
* Download this jar file [Registrar.jar](files/Registrar.jar)
* Start a command prompt and change to the directory where you downloaded Registrar.jar
* At a command prompt, type the following command (making sure you are using a Java 5 VM or later)
{% highlight terminal %}
java -javaagent:Registrar.jar -Dschuchert.ClassFileTransformer=schuchert.agent.NullClassFileTransformer schuchert.agent.Main
{% endhighlight %}
* Verify that you see only the following output:
{% highlight terminal %}
Congratulations, everything seems to be working
{% endhighlight %}

If you see anything else, [check here](ProblemsRunningJavaAgentSmokeTest)
----
## Contents of Jar
The Registrar.jar file contains several things, including source and class files and even a JUnit 4 test. IF you want to actually run that test, you'll need to have the following in your class path:
* JUnit 4.4 (not shipped with Eclipse 3.3 or before)
* JMOck 2.4
Or better yet, you can just download this Eclipse 3.3 workspace and run the tests within eclipse: [JavaAgent.zip](files/JavaAgent.zip)
* Download this file
* Extract the file to some directory, e.g. PC: **c:\workspaces** or Mac: **/Users/schuchert/workspaces**
  * This creates a directory called JavaAgent under the target directory
* Start Eclipse
* Select the JavaAgent directory when Eclipse asks for a workspace, e.g. PC: **c:\workspaces\JavaAgent** or Mac: **/Users/schuchert/workspaces/JavaAgent**
* You might get a few errors regarding not being able to open some perspectives, (e.g. if you do not have the subclipse perspective installed). You can safely ignore these errors.
* Select the project JavaAgentRegistrar
* Right-click:Run As:Junit Test

If you want to verify that you can also run a Java Application, do the following:
* Expand the **JavaAgentRegistrar** project
* Open the package **schuchert.agent**
* Select **Main.java**
* Right-click:Run As:Java Application
* You will probably get an error in the console because you need to set execution properties for Main:
  * Right-click on **Main.java**
  * Select:Run As:Open Run Dialog...
  * Click on the **(x) = Arguments tab**
  * **Under VM arguments:** enter the following: -javaagent:Registrar.jar -Dschuchert.ClassFileTransformer=schuchert.agent.NullClassFileTransformer
  * Click **Run**

### Recreate Registrar.jar
* Open the **JavaAgentRegistrar** project
* Select **RecreateJar.jardesc**
* Right-click and select **Create JAR*
This will create a new jar and replace the one that is currently in that project.

[<<-- back](JavaAgent)
