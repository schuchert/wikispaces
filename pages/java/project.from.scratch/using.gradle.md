---
title: Creating a Java project from scratch using Gradle
layout: page
date: 2018-09-05
---
What follows is first a summary of the steps required, then the prerequisites 
that make all of this magic possible, more details steps with example output,
and some closing notes.

It seems that copying all of the commands in one fell swoop and pasting them
into a terminal stops after the ```gradle init ...``` step. If so, copy the rest
and try again. If you know how to fix that, please let me know.

<section class="summary">
## Summary of Steps
{% include include_md_file filename="using.gradle.steps.md" %}

<aside>
### Note on copying the above commands
If you copy this and then attempt to paste into some environments, the
last command to run seems to be the `gradle init` line. 
If so, you can either copy the commands into a file and use `sh` 
on that file, or try:
^
~~~ bash
xclip -sel clip -out | sh - # linux
pbpaste | sh -              # Mac OS
sh /dev/clipboard           # git bash
~~~
</aside>
</section>

<section>
## Prerequisites
### A working terminal
These steps assume a bash-like terminal from which you can run 
commands. Possibilities include:
^
| System | Terminal Option |
| Windows| [git bash](https://git-scm.com/downloads) |
| Mac OS| Terminal - built in |
| Unix: |Terminal - built in |

### Java Development Kit installed and working at the command line:
^
~~~ terminal
vagrant@vagran-ubuntu16:~/src$ javac -version
javac 1.8.0_181
~~~

### Gradle installed and runs at the command line:
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

### Internet access
The terminal needs access to the internet. If these commands fail 
due to needing to configure the proxy, update `settings.gradle`:
^
~~~ gradle
// ... snip
rootProject.name = 'smoke'
systemProp.https.proxyHost=<proxy url or ip>
systemProp.https.proxyPort=<port number>
systemProp.https.nonProxyHosts=localhost|120.0.01|<proxy url or ip>
~~~
</section>

<section class="details">
## Step by Step Instructions with Example Output
{% include include_md_file filename="using.gradle.steps.md" %}

</section>
