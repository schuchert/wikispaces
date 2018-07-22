[[JBossAOPEX3Explained|<--Back]] [[JBossAOPEX3AssignmentApplications|Next-->]]

# Apply Yourself
## Avoid unnecessary checking
Change the SetInterceptor so that if the object is already changed, it does not check the current and previous value.
----
## Experiment: Unexpected Recursion
Line 15 of the jboss-aop.xml file defines a pointcut meant to avoid recursion. Line 18 actually uses that pointcut. Change line 18 of jboss-aop.xml by removing “AND SkipTrackedObject” and run main(). Describe why the stack overflow occurs.

Make sure to change the jboss-aop.xml back to its original value.
----
## Experiment: Changing what gets passed
Notice that the Dao.save() method checks for null. Instead of not calling Dao.save() if the object is unchanged, pass in null object, which will have the effect of the object not being saved.
----
## Experiment: Constructor Updates Address
Currently the constructor does not change anything. Update the constructor to set all of the strings to “”. Now run Main.main() and see what has changed. Describe what is happening.
----
## Challenge: Adding Automatic History
Create a class that allows you to keep track of the history of rolls of individual Die objects. Introduce that history class into the Die class and track the history of individual die objects. At the end of the program, display the history information.
----
## Challenge: Adding Serialization
A class must implement java.io.Serializable to be saved using an ObjectOutputStream. The Die class provided earlier does not implement java.io.Serializable. Write an introduction that adds java.io.Serializable to the Die class and then write a program that creates an instance, writes it to a file using ObjectOutputStream and then reads it back in.
----
## Thought: Why return null?
[[JBossAOPEX3Explained#SetInterceptor|SetInterceptor.java]] returns null on line 25. Could this cause any side effects? Can you suggest any alternatives?

[[JBossAOPEX3Explained|<--Back]] [[JBossAOPEX3AssignmentApplications|Next-->]]