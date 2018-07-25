---
title: Car_Rental_Installation_and_Setup
---
[<--Back]({{ site.pagesurl}}/Car Rental Example)

# Car Rental Installation and Setup

This project uses Eclipse 3.2 and JDK 1.5.0_06. I have a few additional plugins installed into Eclipse. These are all optional:
* [Checkstyle](http://eclipse-cs.sourceforge.net/), for details see: [[Checkstyle in Eclipse]].
* [PMD](http://pmd.sourceforge.net/integrations.html#eclipse), for details see: [[PMD In Eclipse]].
* Subversion on my PC and Subclipse. See: [[Subversion on XP]].

## Libraries
**Required**
This project also requires several libraries:
* [JUnit 4.x](http://www.junit.org) (included with Eclipse 3.2)
* [Spring](http://www.springframework.org/download), I used Spring 2.0-RC2
* Commons Logging, which you can get if you download **//spring-framework-2.0-rc2-with-dependencies.zip//** instead of spring-framework-2.0-rc2.zip from [Spring Downloads](http://sourceforge.net/project/showfiles.php?group_id=73357&package_id=173644)
* [AspectJ 1.5.x](http://www.eclipse.org/aspectj/downloads.php)

**Optional**
* Code coverage with Emma, download [here](http://emma.sourceforge.net/downloads.html).
* Code coverage with Cobertura, download [here](http://cobertura.sourceforge.net/download.html).

# The Gory Details
Here are the full instructions. Note that if you've already downloaded/installed any of the above, you'll just need to use your directories instead of the examples provided here.

## Download Everything
# Download [Java JDK 1.5.0](http://java.sun.com/j2se/1.5.0/download.jsp)
# Download [Eclipse](http://www.eclipse.org/downloads/)
# Download [Spring](http://www.springframework.org/download) (get the one with dependencies: spring-framework-2.0-rc2-with-dependencies.zip)
# Download [[file:CarRentalRelease1.zip]]
# Download [AspectJ 1.5.x](http://www.eclipse.org/aspectj/downloads.php)

## Install/Unzip Everything
# Install the Java JDK 1.5.0 anywhere you want. I used the defaults so it ended up in C:\Program Files\Java\jdk1.5.0_06. Eclipse should find it.
# Unzip the Eclipse zip file anywhere. I used C:\Eclipse
# Expand the Spring jar anywhere. I used C:\libs, which creates C:\libs\spring-framework-2.0-rc2
# Extract the AspectJ zip anywhere you want. I used C:\libs\aspectj
# Create a place to store your Eclipse workspace, I used C:\workspaces\CarRentalExample
# Extract [[file:CarRentalRelease1.zip]] to your workspace directory (C:\workspaces\CarRentalExample).

## Eclipse/Environment Configuration
# Start Eclipse (if you have not already done so) and select your workspace (in my case it is C:\AOP\Workspaces\aspectj)
# Close the "Welcome" tab

**Import the included Eclipse Preferences**
# File:Import:General:Preferences
# Click on next
# Enter <yourworkspace>\ToolConfiguration\EclipsePrefs.epf, e.g. for me it would be: C:\workspaces\CarRentalExample\TooConfiguration\EclipsePrefs.epf
# Verify that import all is selected
# Click Finish

**Optional: Checkstyle Configuration**
# Windows:Preferences
# Select Checkstyle
# Click on **New**
# Change **Type:** to **External Configuration File**
# Set **Name:** to **MyCheckstylePrfs** (this name is used by the CarRental project)
# Click on **Browse** and find the file **CheckstyleConfig.xml**. If you've used the same directory structure as I have, it will be in the directory C:\workspaces\CarRentalExample\ToolConfiguration.
# Click on OK (to close the new dialog)
# Click on OK (to close preferences)

**Optional: PMD Configuration**
# Windows:Preferences
# Select PMD
# Select Rules Configuration
# Click on **Clear All**
# Answer yes
# Click on **Import rule set...**
# Click on **Browse**
# Find the file PMDConfig.xml. If you've used the same directory structure as I have, it will be in the directory C:\workspaces\CarRentalExample\ToolConfiguration.
# Click on OK (to finish import dialog)
# Click on OK (to finish preferences)
# Click on Yes (to rebuild all)

**Set Classpath Variables**
These steps are optional if you've installed Eclipse and the various libs in the same directories as I've used.

# Window:Preferences:Java:Build Path:Classpath Variables
# Change SPRING_LIB to where you installed Spring. The preferences file sets it to: C:/libs/spring-framework-2.0-rc2/dist/spring.jar
# Change the SPRING_LIB_DIR to point to where the included libs for spring reside. The preferences file sets it to: C:/libs/spring-framework-2.0-rc2/lib
# Change the ASPECT_J_LIBS to point to the lib directory that's under where you extracted aspectj. The preferences file sets it to: C:/libs/aspectj/lib
# Change the JUNIT4_LIB to point to where JUnit 4's jar file resides under eclipse. The preferences file sets it to: C:/eclipse/plugins/org.junit4_4.1.0/junit-4.1.jar
# Click on OK when you're done to close Windows:Preferences

**Import the three extracted projects into the Eclipse workspace**
# File:Import:General:Existing Projects into Workspace
# Click on next
# Enter the directory of your workspace, e.g. mine would be C:\workspaces\CarRentalExample
# Wait for a few seconds or press <enter>
# You should see three projects: CarRental, LoggingUtils, ToolConfiguration
# Click select all
# Click finish

**Verify Tests**
# Wait for the projects to build
# Right-click on CarRental
# Select Run As:JUnit Test
# All 100 tests should pass

**Optional: Code Coverage**
* [[Car Rental Code Coverage with Emma]]
* [[Car Rental Code Coverage with Cobertura]]

**Optional: Run PMD**
# Right-click on the project
# Select PMD:Check Code with PMD
# Do this every so often after you've made changes to the code to see what PMD has to say about your changes.

[<--Back]({{ site.pagesurl}}/Car Rental Example)
