
### Create a directory to hold the project
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src$mkdir smoke
~~~

### Switch to that directory
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src$cd smoke
~~~

### Initialize the project using gradle
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$gradle init --type java-application

BUILD SUCCESSFUL in 0s
2 actionable tasks: 1 executed, 1 up-to-date
~~~

### Gradle created several files, have a look
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$ls
build.gradle  gradle  gradlew  gradlew.bat  settings.gradle  src
~~~

### Try running tests
The first run of your freshly-created application may take longer due to the need to download Java library files
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$gradle test

BUILD SUCCESSFUL in 4s
3 actionable tasks: 3 executed
~~~

### Re-run the tests
If they failed before, e.g., you needed to configure a proxy, then they
will run this time. If they passed last time, then they will not re-run.
^
~~~ terminal 
vagrant@vagrant-ubuntu16:~/src/smoke$gradle test

BUILD SUCCESSFUL in 1s
3 actionable tasks: 3 up-to-date
~~~

### Force re-execution 
After a task (tests in this case) has passed, it will not re-run if there
are no relevant changes. You can force re-execution with the `--retun-tasks`
parameter to Gradle.

Notice "executed" below versus "up-to-date" above:
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$gradle test --rerun-tasks

BUILD SUCCESSFUL in 3s
3 actionable tasks: 3 executed
~~~

### Create the application jar 
The use of `--rerun-tasks` is not necessary here but doing this should provide 
more consistent results between this example and what you see on your screen.
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$gradle build --rerun-tasks

BUILD SUCCESSFUL in 4s
7 actionable tasks: 7 executed
~~~

### Finally, run the application from the command line
^
~~~ terminal
vagrant@vagrant-ubuntu16:~/src/smoke$java -cp build/libs/smoke.jar App
Hello world.
~~~
