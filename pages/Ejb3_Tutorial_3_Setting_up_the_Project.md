---
title: Ejb3_Tutorial_3_Setting_up_the_Project
---
First we need to start with a project. Rather than having to copy all of [JPA Tutorial 3](JPA_Tutorial_3_A_Mini_Application), instead use the following 7-zip file: [[file:Ejb3Tutorial3.7z]]. You are welcome to use your version of Jpa Tutorial 3, however if you do these instructions might not match your experience.

Note that this file already has a **conf** directory as described in [EJB3_Tutorial_1_Create_and_Configure](EJB3_Tutorial_1_Create_and_Configure) and the classpath is already already set.

* Extract this file using 7-zip. Place the contents of this archive under your workspace directory. For example, if your workspace directory is **c:\workspaces\Ejb3JpaTutorials**, after extracting the contents of this archive, you'll have a new directory named **c:\workspaces\Ejb3JpaTutorials\Ejb3Tutorial3**.
* Next, import the project into your workspace
* Start eclipse and open your workspace directory (if you're already in Eclipse, you do **not** need to restart)
* Pull down the **File** menu and select **import**
* Expand **General**
* Select **Existing Projects into Workspace**
* Click **Next**
* Select root directory is already selected, click on Browse
* Select the directory you created when you extracted the archive (**c:\workspaces\Ejb3JpaTutorials\Ejb3Tutorial3**)
* Click **OK**
* Click **Finish**

Verify that everything compiled successfully. Once you've fixed any compilation problems, run the unit tests. You might notice a few warnings and even some **Fatal** logging statements, but the tests should pass. As we migrate this solution to use EJB's, these errors will eventually go away based on how we change our test setup.
