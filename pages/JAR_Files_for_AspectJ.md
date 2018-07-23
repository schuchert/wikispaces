---
title: JAR_Files_for_AspectJ
---
[<--Back]({{ site.pagesurl }}/Environment Configuration for AspectJ)

Every project using AspectJ needs several JAR files. You defined a classpath variable in [[Eclipse Classpath Variable for AspectJ]]. We now need to use that classpath variable:

# Select your project, right-click and select **Properties** (Alt-Enter on PC)
# Select **Java Build Path**
# Select the **Libraries** tab
# Click on **Add Variable**
# Select the variable you created (called JBOSS_AOP_LIB)
# Click **Extend**
# Select all JAR files listed (Ctrl-A on PC)
# Click **OK**
# Click **OK**

[<--Back]({{ site.pagesurl }}/Environment Configuration for AspectJ)