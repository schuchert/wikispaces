---
title: Ejb3EclipseUserLibrarySetup
---
### Define User Library
We need to add several jar files to the class path. We created a user library in [these steps]({{ site.pagesurl }}/JPA Tutorial 1 - Eclipse Project Setup#ClasspathVariables) and we're going to do the same thing with a different set of jar files.

**Create User Library**
# Pull down **Window:Preferences**
# Navigate to **Java:Build Path:User Libraries**
# Click on **New**
# Enter **EJB3_EMBEDDABLE** for the name and click on **OK**

**Add Jars to User Library**
Now we need to add all of the jar files from the lib directory under the JBoss Embeddable container directory we unzipped earlier:
# Select **EJB3_EMBEDDABLE**
# Click on **Add JARs...**
# Navigate to C:/libs/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/
# Select all of the the jar files
# Click on **Open**

You need to add all of the jar files from the lib directory under the JBoss Embeddable container directory. If you used the same directory as the tutorial, then you need add all of the jar files from C:/libs/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/ (there are 5). Here is the complete list of jar files:
* C:/libs/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/thirdparth-all.jar
* C:/libs/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/hibernate-all.jar
* C:/libs/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/jboss-ejb3-all.jar
* C:/libs/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/jcainflow.jar
* C:/libs/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/jms-ra.jar
