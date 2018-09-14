---
title: JPA_Tutorial_4_Setup
---
These instructions assume you are starting with the solutions mentioned above. If you finished [JPA_Tutorial_3_A_Mini_Application](JPA_Tutorial_3_A_Mini_Application), you have a few options:
* **Recommended** Copy that project and follow the tutorial against the copy
* Directly modify that project

### Setup Basic Project
If you start with the jar file, here are the steps to get started:
# In Eclipse, create a new Project: **File:New:Project**
# Select **Java Project** and click **Next**
# Enter a project name, e.g. **JpaTutorial4**, and click **Finish**
# Open up the provided jar file and copy the contents into your project directory. For example, if your workspace directory is **C:\workspaces\JpaAndEjb3\** and your project name is **JpaTutorial4**, then extract the contents of the jar file into **C:\workspaces\JpaAndEjb3\JpaTutorial4\** making sure to overwrite .classpath and .project.
# In Eclipse, select your project and refresh it (right-click, refresh)

### Start Database Server
This set of source files assumes you've setup and started a Hypersonic server. The instructions to do so are [here](QuantumDb_Configuration). Note that these instructions are both for configuring your database and configuring QuantumDb. If you are not using the QuantumDb plug-in, just pay attention to the sections on [Start Your Database](QuantumDb_Configuration#StartYourDatabase) and [JPA in JSE Settings](QuantumDb_Configuration#JPAinJSE).

### Verify Your Project Works
# Select your project in Eclipse
# Right-click, select **Run As:JUnit**

All tests should pass. Please verify that the do before you continue.
