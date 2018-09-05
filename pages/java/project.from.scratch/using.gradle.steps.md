
* Create a directory to hold the project:
^
~~~ bash
mkdir smoke
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src$ mkdir smoke
~~~

* Switch to that directory
^
~~~ bash
cd smoke
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src$ cd smoke
~~~

* Initialize the project using gradle:
^
~~~ bash
gradle init --type java-application
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$ gradle init --type java-application

BUILD SUCCESSFUL in 0s
2 actionable tasks: 1 executed, 1 up-to-date
~~~

* Gradle created several files, have a look:
^
~~~ bash
ls
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$ ls
build.gradle  gradle  gradlew  gradlew.bat  settings.gradle  src
~~~

* Try running tests on your freshly-created application (your first run might be longer due to the need to download library files)
^
~~~ bash
gradle test
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$ gradle test

BUILD SUCCESSFUL in 4s
3 actionable tasks: 3 executed
~~~

* Attempt to re-run the tests (the last time I ran the passed, so nothing happens): 
^
~~~ bash 
gradle test
~~~

~~~ terminal 
vagrant@vagrant-ubuntu16:~/src/smoke$ gradle test

BUILD SUCCESSFUL in 1s
3 actionable tasks: 3 up-to-date
~~~

* Force re-execution (notice "executed" below versus "up-to-date" above):
^
~~~ bash
gradle test --rerun-tasks
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$ gradle test --rerun-tasks

BUILD SUCCESSFUL in 3s
3 actionable tasks: 3 executed
~~~

* Create the application jar (--rerun-tasks no necessary here but doing this to provide consistent results so your output is closer to mine):
^
~~~ bash
gradle build --rerun-tasks
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$ gradle build --rerun-tasks

BUILD SUCCESSFUL in 4s
7 actionable tasks: 7 executed
~~~

* Finally, run the application from the command line:
^
~~~ bash
java -cp build/libs/smoke.jar App
~~~

~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$ java -cp build/libs/smoke.jar App
Hello world.
~~~

