---
title: lombok.GettingStarted
---
## Overview
[Project Lombok](http://projectlombok.org/) uses a Java Annotation Processor and Java annotations to add boilerplate code to existing classes. The major IDEs also support Lombok in varying forms, making it viable for both command-line and IDE-based work. In this introduction, we'll begin by creating a project from scratch using a [Maven Archetype](http://maven.apache.org/guides/introduction/introduction-to-archetypes.html) and then migrate it to use [Project Lombok](http://projectlombok.org/) and [Slf4j](http://www.slf4j.org/). Then we'll move on to seeing how it works in [IntelliJ](http://www.jetbrains.com/idea/download/) and then we'll migrate the project to use [Gradle](http://www.gradle.org/). 

## Create a Basic Project
We need a project, since this is about a tool, the any project will do. To avoid much of the work, let's use a Maven archetype to create a trival project with a single production class and a single test class using JUnit.

First we'll create a place to put the project, then create the primordial project. For this example, I'll be working in my account: /Users/schuchert/src. Where I mention directories, remember to replace my directory with yours.

### Create the top-level directory for a number of projects
{% highlight bash %}
mkdir -p ~/src/lombok
cd ~/src/lombok
{% endhighlight %}

### Use a maven archetype to create a basic project:
{% highlight bash %}
mvn archetype:generate -DgroupId=com.shoe.lombok \
                                     -DartifactId=gettingstarted \
                                     -DarchetypeArtifactId=maven-archetype-quickstart \
                                     -DinteractiveMode=false
[INFO] Scanning for projects...
[INFO] 
<<snip>>
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 29.869 s
[INFO] Finished at: 2014-05-12T18:47:04-08:00
[INFO] Final Memory: 13M/130M
[INFO] ------------------------------------------------------------------------
{% endhighlight %}

### Verify the basic project works
{% highlight bash %}
cd gettingstarted
mvn test
[INFO] Scanning for projects...
[INFO] 
<<snip>>
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.shoe.lombok.AppTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.005 sec

Results :

Tests run: 1, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 3.055 s
[INFO] Finished at: 2014-05-12T18:49:18-08:00
[INFO] Final Memory: 14M/156M
[INFO] ------------------------------------------------------------------------
{% endhighlight %}

Now we have basic project that uses Java and JUnit, so it's time to add Lombok to the project dependences and get things to work at the command line.
## Adding Lombok
The project created by the Maven archetype has a simple POM. It has a single dependency on JUnit. We'll make 3 changes: update the version of JUnit, add a dependency for Lombok, and add a dependency for Slf4j.

### Update the pom.xml file with the changed dependencies:
{% highlight xml %}
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">

  <modelVersion>4.0.0</modelVersion>
  <groupId>com.shoe.lombok</groupId>
  <artifactId>gettingstarted</artifactId>
  <packaging>jar</packaging>
  <version>1.0-SNAPSHOT</version>
  <name>gettingstarted</name>
  <url>http://maven.apache.org</url>

  <dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.12.6</version>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.7</version>
    </dependency>

    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

</project>
{% endhighlight %}

### Gently Start: Logging
The project has one production class, App.java. Open that file and update as shown (note, since I'm still working at the command line, here's a command to edit that file:
{% highlight bash %}
vi `find . -name App.java`
{% endhighlight %}

### Update App.java
Make two updates, add an annotation and update the line that writes to the console:
{% highlight java %}
package com.shoe.lombok;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class App
{
    public static void main( String[] args )
    {
        log.debug( "Hello World!" );
    }
}
{% endhighlight %}

### Verify that the project still builds by re-running the tests:
{% highlight bash %}
mvn test
[INFO] Scanning for projects...
[INFO] 
<<snip>>
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.shoe.lombok.AppTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.037 sec

Results :

Tests run: 1, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1.110 s
[INFO] Finished at: 2014-05-12T19:02:51-08:00
[INFO] Final Memory: 7M/156M
[INFO] ------------------------------------------------------------------------
{% endhighlight %}

Note, while the test created by the maven archetype does not directly test what we changed, the code as written will not compile if the annotation processor is not in place. If you are a healthy skeptic like me, you might want to verify this assertion. Verify by removing the dependency on lombok and see if the tests still pass (note use of "clean" is necessary since we modified the pom.xml file but not the Java code):
{% highlight bash %}
mvn clean test
[INFO] Scanning for projects...
<<snip>>
[INFO] Compiling 1 source file to /Users/schuchert/src/lombok/gettingstarted/target/classes
[INFO] -------------------------------------------------------------
[ERROR] COMPILATION ERROR : 
<<snip>>
{% endhighlight %}

### Restore the dependency and try again last time:
{% highlight bash %}
mvn test
[INFO] Scanning for projects...
[INFO] 
<<snip>>
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.shoe.lombok.AppTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.036 sec

Results :

Tests run: 1, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1.760 s
[INFO] Finished at: 2014-05-12T19:08:16-08:00
[INFO] Final Memory: 13M/156M
[INFO] ------------------------------------------------------------------------
{% endhighlight %}

Note that we did not need to use "clean" this time because the last attempt to build failed.

### Is anything going on?
What this demonstrates may be trivial/subtle. To make sure you didn't miss it, consider the production code again:
{% highlight java %}
package com.shoe.lombok;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class App
{
    public static void main( String[] args )
    {
        log.debug( "Hello World!" );
    }
}
{% endhighlight %}

Notice the line:
{% highlight java %}
log.debug( "Hello World!" );
{% endhighlight %}

How can this code compile? There is not a local variable named log. 
There does not appear to be a field called log, yet the code compiles. 
What the Lombok annotation processor does is modify the source code to:
* Introduce a static field called Log (that's an Slf4j logger due to the the @Slf4j annotation)
* Initialize that field to an Slf4j logger

There are a number of annotations and there are even extensions to Lomboc for even more. However, sticking with just this one, how about working with an IDE?

### Getting this to work in IntelliJ Idea
^
<aside>
When I started working on this wiki, I wanted to only use free tools since 
the material here is released for free. At the time I was a long-time 
Eclipse user. A few years ago I switched to IntelliJ at work but continued 
to use Eclipse for projects on this site where using a Java IDE made sense. 
For some time now, there's been a free version of Idea, I personally own 
the commercial version of Idea, but I verified this works with the free 
community edition. If you want to use Eclipse, there are instructions on 
how to integrate Lombok with IntelliJ at the project lombok web site. Quick 
hint, run the lombok jar file with java and it will attempt to find your 
Eclipse installation and update it.
</aside>

* Open the pom.xml in Idea 13.
* Run the tests

Starting with a Maven project, Idea will open the project and execute 
tests fine. We get the same results using the command line and in the 
IDE. While Idea supports this out of the box, there are some irritating 
code inspection errors. To fix this, you can install the Lomboc plugin 
and those also disappear.

### Gradle
What if you are using Gradle instead of Maven? This is a quick set of steps to accomplish the same thing using gradle.

#### Create a build.gradle file. In the the gettingstarted directory:
{% highlight bash %}
gradle init
:wrapper
:init
Maven to Gradle conversion is an incubating feature.

BUILD SUCCESSFUL

Total time: 4.951 secs
{% endhighlight %}

Here's the generated build.gradle (a few blank lines removed):
{% highlight groovy %}
apply plugin: 'java'
apply plugin: 'maven'

group = 'com.shoe.lombok'
version = '1.0-SNAPSHOT'

description = """gettingstarted"""

sourceCompatibility = 1.5
targetCompatibility = 1.5

repositories {
     maven { url "http://repo.maven.apache.org/maven2" }
}

dependencies {
    compile group: 'org.projectlombok', name: 'lombok', version:'1.12.6'
    compile group: 'org.slf4j', name: 'slf4j-api', version:'1.7.7'
    testCompile group: 'junit', name: 'junit', version:'4.11'
}
{% endhighlight %}

### Run the tests and verify that they pass:
{% highlight bash %}
gradle test
:compileJava
warning: [options] bootstrap class path not set in conjunction with -source 1.5
1 warning
:processResources UP-TO-DATE
:classes
:compileTestJava
warning: [options] bootstrap class path not set in conjunction with -source 1.5
1 warning
:processTestResources UP-TO-DATE
:testClasses
:test

BUILD SUCCESSFUL

Total time: 7.526 secs
{% endhighlight %}

Note: Depending on the version of Java you are using, you might notice some 
warnings. In my system I'm using JDK 1.7 but the generated gradle file uses 
1.5 as the expected version. To fix this, update to the appropriate version
of Java you are using, which is 1.7 in my case:
{% highlight groovy %}
sourceCompatibility = 1.7
targetCompatibility = 1.7
{% endhighlight %}

### Rebuild
One more build should show those warnings disappear. Note the use of --rerun-tasks is necessary since the last build was a success:

{% highlight bash %}
gradle test --rerun-tasks
:compileJava
:processResources UP-TO-DATE
:classes
:compileTestJava
:processTestResources UP-TO-DATE
:testClasses
:test

BUILD SUCCESSFUL

Total time: 5.195 secs
{% endhighlight %}

## Gradle and Idea 13
Idea support for gradle improved quite a bit in Idea 13. However, the annotation processing is not so cleanly handled by Idea + Gradle. If you import the build.gradle project, you'll need to turn on annotation processing to make the code compile successfully. If you do not IntelliJ will respond with a compilation error:
{% highlight terminal %}
Error:(10, 9) java: cannot find symbol
  symbol:   variable log
  location: class com.shoe.lombok.App
{% endhighlight %}

## Conclusion
We've created a simple application and introduced Lombok. The jar file for Lombok needs to be in the classpath during compilation when working at the command line. This happens naturally when using Maven or Gradle by depending on Lombok. In an IDE, there are different ways to accomplish that. 
