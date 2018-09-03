---
title: Setting up a Java Project from Scratch
---

# Prerequisites
* A working terminal
  * Windows: git bash
  * Mac OS: Terminal
  * Unix: Terminal
* Java Development Kit installed and working at the command line:
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src$ javac -version
javac 1.8.0_181
~~~
* Gradle installed and runs at the command line:
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src$ gradle -version

------------------------------------------------------------
Gradle 4.10
------------------------------------------------------------

Build time:   2018-08-27 18:35:06 UTC
Revision:     ee3751ed9f2034effc1f0072c2b2ee74b5dce67d

Kotlin DSL:   1.0-rc-3
Kotlin:       1.2.60
Groovy:       2.4.15
Ant:          Apache Ant(TM) version 1.9.11 compiled on March 23 2018
JVM:          1.8.0_181 (Oracle Corporation 25.181-b13)
OS:           Linux 4.15.0-33-generic amd64
~~~
----
# Notes
* This example assumes working with a bash-like terminal. As such ```~```
refers to your home directory. E.g., ```C:\\users\<accout>``` on windows,
or ```/home/<account>/``` on Linux.

* This examples starts in a directory under your home account called src. I.e., ```~/src```.

# Creating a project
* Create a directory to hold the project:
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src$ mkdir smoke
~~~
* Switch to that directory
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src$ cd smoke
~~~
* Initialize the project using gradle:
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src/smoke$ gradle init --type java-application

BUILD SUCCESSFUL in 0s
2 actionable tasks: 1 executed, 1 up-to-date
~~~
* Gradle created several files, have a look:
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src/smoke$ ls
build.gradle  gradle  gradlew  gradlew.bat  settings.gradle  src
~~~
* Try running tests on your freshly-created application (your first run might be longer due to the need to download library files)
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src/smoke$ gradle test

BUILD SUCCESSFUL in 4s
3 actionable tasks: 3 executed
~~~
* If this fails, you might need to configure a proxy to allow gradle to access the internet. If so, update setting.gradle:
^
~~~ gradle
// ... snip
rootProject.name = 'smoke'
systemProp.https.proxyHost=<proxy url or ip>
systemProp.https.proxyPort=<port number>
systemProp.https.nonProxyHosts=localhost|120.0.01|<proxy url or ip>
~~~
* Attempt to re-run the tests (the last time I ran the passed, so nothing happens): 
^
~~~ terminal 
vagrant@vagran-ubuntu16:~/src/smoke$ gradle test

BUILD SUCCESSFUL in 1s
3 actionable tasks: 3 up-to-date
~~~
* Force re-execution (notice "executed" below versus "up-to-date" above):
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src/smoke$ gradle test --rerun-tasks

BUILD SUCCESSFUL in 3s
3 actionable tasks: 3 executed
~~~
* Create the application jar (--rerun-tasks no necessary here but doing this to provide consistent results so your output is closer to mine):
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src/smoke$ gradle build --rerun-tasks

BUILD SUCCESSFUL in 4s
7 actionable tasks: 7 executed
~~~
* Finally, run the application from the command line:
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src/smoke$ java -cp build/libs/smoke.jar App
Hello world.
~~~

