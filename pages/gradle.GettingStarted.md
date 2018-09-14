---
title: gradle.GettingStarted
---
## Background
These are my preliminary notes on getting started with gradle. The last time I did any serious build work, I used ant, before that make and nmake; I missed using maven so coming into gradle was both easy and frustrating. Even though I did not use maven extensively, I knew its model well enough to get up and running somewhat quickly.

Gradle requires a JVM; I work mostly on OS X, so I use JSE 1.6.0_24, but any version from 1.5 on should work fine. What follows assumes you already have a JVM running. I start in a shell and only at the end finally get into an IDE.

## Install Gradle
Instructions for installing Gradle are [here](http://www.gradle.org/installation.html). I'm summarizing them here, if you have any questions refer to the installation instructions.
* [Download Gradle](http://www.gradle.org/downloads.html). For these examples I happen to be using the 1.0-milestone-3 version of Gradle.
* Unzip the file somewhere, say /users/Schuchert/bin
* This will create a directory under the installation directory called something like //**gradle-1.0-milestone-3/**//
* Add the bin directory under the extracted directory to your path. In my particular case, the path is: /Users/schuchert/bin/gradle-1.0-milestone-3/bin/
* Verify your installation works by simply typing gradle:

{% highlight terminal %}
[~]% gradle
:help

Welcome to Gradle 1.0-milestone-3.

To run a build, run gradle <task> ...

To see a list of available tasks, run gradle tasks

To see a list of command-line options, run gradle --help

BUILD SUCCESSFUL

Total time: 4.304 secs
[~]%
{% endhighlight %}

## Create Initial Project Structure
Gradle prefers convention over configuration and its default assumptions about project structure mirror those of Maven. For this example, let's assume that you'll create a single project directory (this is to keep things simple). Also, this example demonstrates working with Java, though Gradle supports several other languages.
* Create a project directory, e.g. ~/src/gradle_example
* Under that directory create src, src/main/, src/main/java, src/test, src/test/java

{% highlight terminal %}
[~]% mkdir -p ~/src/gradle_example
[~]% cd ~/src/gradle_example
/Users/schuchert/src/gradle_example
[~/src/gradle_example]% mkdir -p src/main/java src/main/resources src/test/java
{% endhighlight %}

## Create Basic Gradle Build File
This example uses java and will ultimately use Eclipse, so here's a basic build file that will support building and running tests if your project follows Maven layout conventions, uses JUnit and uses Maven Central to retrieve jar files:
{% highlight terminal %}
apply plugin: 'java'

repositories {
  mavenCentral()
}

dependencies {
  testCompile group: 'junit', name: 'junit', version: '4.8+'
}
{% endhighlight %}
* Create a file called //**biuld.gradle**// under your project directory (//**~/src/gradle_example**// in my case)
* Verify that a build works (even without any production or test code)
{% highlight terminal %}
[~/src/gradle_example]% gradle test
:compileJava UP-TO-DATE
:processResources UP-TO-DATE
:classes UP-TO-DATE
:compileTestJava UP-TO-DATE
:processTestResources UP-TO-DATE
:testClasses UP-TO-DATE
:test

BUILD SUCCESSFUL

Total time: 9.219 secs
[~/src/gradle_example]%
{% endhighlight %}

## Smoke Test With A Little Code
We're working at the command line. Java packages relate to directories. Now you'll create a couple of source files, one test, one production. I'll use the package //**demo.rpn**//:
{% highlight terminal %}
[~/src/gradle_example]% mkdir -p src/test/java/demo/rpn src/main/java/demo/rpn
{% endhighlight %}

* Under the project directory, in //**src/test/java/demo/rpn**// create the file //**RpnCalculatorShould.java**//:
{% highlight terminal %}
[~/src/gradle_example]% vi src/test/java/demo/rpn/RpnCalculatorShould.java
{% endhighlight %}

### RpnCalculatorShould.java
{% highlight java %}
package demo.rpn;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class RpnCalculatorShould {
    @Test
    public void addTwoNumbersCorreclty() {
        RpnCalculator rpnCalculator = new RpnCalculator();
        rpnCalculator.digit(4);
        rpnCalculator.enter();
        rpnCalculator.digit(9);
        rpnCalculator.operator("+");
        assertEquals(13, rpnCalculator.xRegister());
    }
}
{% endhighlight %}

* Under the project directory, in //**src.main/java/demo/rpn**// create the file //**RpnCalculator.java**//:
{% highlight terminal %}
[~/src/gradle_example]% vi src/main/java/demo/rpn/RpnCalculator.java
{% endhighlight %}

### RpnCalculator.java
{% highlight java %}
package demo.rpn;

public class RpnCalculator {
    public void digit(int value) {
    }

    public void enter() {
    }

    public void operator(String operatorName) {
    }

    public int xRegister() {
        return 13;
    }
}
{% endhighlight %}

* Run your tests by typing //**gradle test**//
{% highlight terminal %}
[~/src/gradle_example]% gradle test
:compileJava
:processResources UP-TO-DATE
:classes
:compileTestJava
:processTestResources UP-TO-DATE
:testClasses
:test

BUILD SUCCESSFUL

Total time: 9.824 secs
[~/src/gradle_example]%
{% endhighlight %}

Here there is a bit of a visual affordance problem. Gradle will show test execution while they are running. Once the test run, and if they all pass, the output just shows that the test task executed. However, Gradle produced some output. You can verify that your one tests executed successfully by looking at the build directory:
{% highlight terminal %}
open build/reports/tests/index.html
{% endhighlight %}

My report shows one test running and passing.
## On To Eclipse
If you want to create project information for Eclipse, you need to do a few things:
* Add //**apply plugin: 'eclipse'**//
* Create the project structure using //**gradle eclipse**//
{% highlight terminal %}
[~/src/gradle_example]% gradle eclipse
:eclipseClasspath
:eclipseJdt
:eclipseProject
:eclipse

BUILD SUCCESSFUL

Total time: 8.383 secs
[~/src/gradle_example]%
{% endhighlight %}

Note, this creates a //**project**// directory, not a workspace. You'll need to:
* Start eclipse
* Select a workspace
* Import the project into eclipse

In my example, I only created a top-level project directory, not a workspace directory. However, you can create an Eclipse workspace and include a symbolic link to the project. This is a bit out of scope for what I want to get covered. I only mention this here because it confused me a bit.
## Preparing for git
No coding is complete without a mention of using a repository. We'll do a touch of preparation for git and check in our initial structure. In the top-level project directory create a file called //**.gitignore**//. For this example, and assuming you have executed the Eclipse step above:
{% highlight terminal %}
build
.classpath
.project
.gradle
.settings
{% endhighlight %}

You might choose to not include the .settings directory used by Eclipse.

Now you can turn this directory into a git repository:
* Initialize git using //**git init**//
* Add the files you care to monitor using //**git add .gitignore src build.gradle**//
* Verify everything is cool using //**git status**//
* Finally, commit the changes (adding just staged the work), using //**git commit -m "Initial Commit"**//

{% highlight terminal %}
[~/src/gradle_example]% git init
Initialized empty Git repository in /Users/schuchert/src/gradle_example/.git/
[~/src/gradle_example]% git add .gitignore src build.gradle
[~/src/gradle_example]% git status
# On branch master
#
# Initial commit
#
# Changes to be committed:
#   (use "git rm --cached <file>..." to unstage)
#
#    new file:   .gitignore
#    new file:   build.gradle
#    new file:   src/main/java/demo/rpn/RpnCalculator.java
#    new file:   src/test/java/demo/rpn/RpnCalculatorShould.java
#
[~/src/gradle_example]% git commit -m "Initial commit"
[master (root-commit) 1efa8fd] Initial commit
 4 files changed, 52 insertions(+), 0 deletions(-)
 create mode 100644 .gitignore
 create mode 100644 build.gradle
 create mode 100644 src/main/java/demo/rpn/RpnCalculator.java
 create mode 100644 src/test/java/demo/rpn/RpnCalculatorShould.java
[~/src/gradle_example]%
{% endhighlight %}

## Congratulations
The purpose of this was to give one specific example of using Gradle to build a new project from scratch. Here's a summary of the steps:
* Create a project directory
* Create an initial build.gradle file
* Add some test files and some production code files using maven project layout
* Build and run your tests
* Optionally create the Eclipse project structure
* Put your work into git

Hope this helps get you started a touch quicker. For more information on Gradle, have a look at its [extensive documentation](http://www.gradle.org/documentation.html).

### Final Caution
Since we are using Maven repositories, that comes with the standard baggage associated with it. For example, if you are using a project that uses a particular release of another project, you might need to configure a few more things in the build.gradle file to make it possible to find everything. Here is an example file from another project I've been toying with:
{% highlight terminal %}
apply plugin: 'java'
apply plugin: 'eclipse'

repositories {
    mavenCentral()
    mavenRepo name: 'hibernate',
        urls: 'https://repository.jboss.org/nexus/content/groups/public/'
    mavenRepo name: 'ERB Spring Release Repo',
            urls: 'http://repository.springsource.com/maven/bundles/release'
    mavenRepo name: 'ERB External Spring Release Repo',
            urls: 'http://repository.springsource.com/maven/bundles/external'
}

dependencies {
    testCompile group: 'org.dspace.dependencies.jmockit',
        name: 'dspace-jmockit',
        version: '0.999.4'
    testCompile group: 'junit', name: 'junit', version: '4.8+'

    runtime group: 'org.apache.derby', name: 'derby', version: '10.8+'

    compile group: 'org.hibernate', name: 'hibernate', version: '3+'
    compile group: 'org.hibernate', name: 'hibernate-annotations', version: '3+'
    compile group: 'org.hibernate', name: 'hibernate-entitymanager', version: '3+'
    compile group: 'org.hibernate', name: 'hibernate-tools', version: '3+'
    runtime group: 'org.hibernate.java-persistence',
                    name:  'jpa-api', version: '2+'

    compile group: 'org.synyx.hades',
                    name:  'org.synyx.hades', version: '2.+'

  runtime group: 'org.slf4j', name: 'slf4j-api', version: '1.6.1'
}
{% endhighlight %}

In this case I'm using Hibernate, which uses Spring. however, the spring release it uses is from another maven repository, so I've included a few named maven repositories as well.

Good luck and I recommend giving Gradle a try. While this example barely scratches the surface, Gradle uses scripting and convention over configuration, so it appears to result in easier to read/write/follow build files.
