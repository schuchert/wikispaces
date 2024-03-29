---
title: JPA_Tutorial_1_Eclipse_Project_Setup
---
Next we need to start eclipse and create a workspace.

### Create Initial Project
* Start eclipse.
* When prompted, enter a directory for your workspace. I used C:\workspaces\JpaAndEjb3. To understand why I recommend not using a space in the name, read [this sidebar](JPA_Tutorial_1_Getting_Started#SideBarJpaClassPath).
* Close the Welcome window

{: #AddRequiredLibraries}
### User Library
We are going to define a user library, which is just a collection of jar files with a name. 
Once we create this, we can add it to our classpath with one command. This also makes setting 
up new projects in the same workspace a snap. We can also export workspace settings and import them into a new workspace.
* Pull down **Window:Preferences**
* Navigate to **Java:Build Path:User Libraries**
* Click on **New**
* Enter **JPA_JSE** for the name and click on **OK**

Now we need to add several jars to this list. For each of the following jars, do the following:
* Select JPA_JSE (after you add the first one, you'll have to go back and click the library, which seems to be a poor UI design)
* Click on **Add JARs...**
* Navigate to the jar file
* Select the jar file
* Click on **Open**
* Repeat at step one.

Here is a list of all the jar files you'll need to add (note the path's listed assume you extracted your jar files to C:/libs):
{% highlight terminal %}
* C:/libs/hibernate-distribution-3.3.1.GA/lib/required/antlr-2.7.6.jar
* C:/libs/hibernate-distribution-3.3.1.GA/lib/required/commons-collections-3.1.jar
* C:/libs/hibernate-distribution-3.3.1.GA/lib/required/dom4j-1.6.1.jar
* C:/libs/hibernate-distribution-3.3.1.GA/lib/required/javassist-3.4.GA.jar
* C:/libs/hibernate-distribution-3.3.1.GA/hibernate3.jar
* C:/openejb-3.1.1/lib/javaee-api-5.0-2.jar
* C:/openejb-3.1.1/lib/log4j-1.2.12.jar
* C:/hibernate-entitymanager-3.4.0.GA/hibernate-entitymanager.jar
* C:/hsqldb-1.9.0-beta3/hsqldb/lib/hsqldb.jar
* C:/hibernate-annotations-3.4.0.GA/hibernate-annotations.jar
* C:/hibernate-annotations-3.4.0.GA/lib/hibernate-commons-annotations.jar
* C:/slf4j-1.5.8/slf4j-simple-1.5.8.jar
* C:/slf4j-1.5.8/slf4j-api-1.5.8.jar
{% endhighlight %}

### Create Java Project
Next we need to create a Java project. We'll keep the source separate from the bin directory:
* Pull down the **File** menu and select **New:Project**
* Select **Java Project** and click **Next**
* Enter a project name: **JpaTutorial1**, again read [this sidebar](JPA_Tutorial_1_Getting_Started#SideBarJpaClassPath) to know why I did not use a space in the project name.
* Make sure "Create new project in workspace" is selected.
* Make sure the JRE selected is 1.5.x.   If a 1.5 JRE does not show in the list, you can add it through Window->Preferences->JAVA->Installed JRE's.
* Select "Create separate source and output folders"
* Click "finish"

### Create folders and packages
* Expand your project **JpaTutorial1**
* Select the **src** folder
* Right-click, select **new:Folder**
* Enter the name **META-INF**
* Click **Finish**
* Select the **src** folder again
* Right-click, select **new:Package**
* Enter the name **entity**
* Click on **Finish**
* Select the **Tutoria1** project again
* Right-click, select **new:Source Folder**
* Enter the name **test**
* Click **Finish**
* Select the **test** folder
* Right-click, select **new:Package**
* Enter the name **entity**

### Add Required Libraries
We now need to add two libraries. One will be the user-defined library we created above. The second will be JUnit 4.x.

* Edit the project properties. Select your project (e.g. **JpaTutorial1**) and either press **alt-enter** or right-click and select properties.
* Select **Java Build Path**
* Click on the **Libraries** tab
* Click on **Add Library**
* Select **User Libraries** and click **Next**
* Select **JPA_JSE** by clicking on the checkbox
* Click **OK**
* Click on **Add Library** again
* Click on **JUnit**
* Click **Next**
* In the pull-down list, select **JUnit 4**
* Click **Finish**
* Click **OK**

{: #SideBarJpaClassPath}
<aside>
The JPA specification says that in a managed environment (read as running in the container), you do not need to list your entity classes in the persistence.xml (this is coming up). When you're using JPA in a JSE environment, this is not guaranteed. In all of these examples, we're using the hibernate implementation of the JEE Entity Manager. It provides the functionality of automatically registering all of your entities without your having to explicitly list them. However, if you happen to have a space in your class path, it appears to fail.

If you followed the instructions above, you'll have the following directory: C:/Workspaces/JpaAndEjb3/JpaTutorial1. Under that directory will be a bin directory where our compiled class files reside. Hibernate will look in this directory and find all classes that are entities (denoted with @Entity) and add those to our persistent unit. In the first version of this tutorial, I recommended the following name: C:/Workspaces/Jpa And Ejb3/Tutorial 1. When I ran the driver program, hibernate was unable to automatically find the bin directory, I assume this was because of the spaces in the name. I changed the name by removing all of the spaces and the problem went away.
{% highlight terminal %}
   
{% endhighlight %}
</aside>
