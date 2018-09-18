---
title: Designing_to_Spring_Templates_Source
---
[<--Back](Designing_to_Spring_Templates)

## Designing to Spring Templates Source
This page has the full source in an Eclipse Archive file along with instructions for creating a workspace and setting up the workspace using the archive file.

### Eclipse Archive File
[[file:JdbcToSpringExample.zip]]
This is an Eclipse 3.2 Archive file with two projects: 
* JdbcToSpringTemplates
* LoggingUtils
It also includes all of the necessary jar files to run these examples.

#### Get the file and create your workspace
* Download the file
* Create a directory that will server as your workspace directory, e.g. C:\workspaces\SpringTemplatesExample
* Unzip the contents of this directory into your workspace directory
* Start Eclipse 3.2 and select your workspace directory

#### Import the included Eclipse Preferences
* File:Import:General:Preferences
* Click on next
* Enter <yourworkspace>\EclipsePrefs.epf, e.g. for me it would be: C:\workspaces\SpringTemplatesExample\EclipsePrefs.epf
* Verify that import all is selected
* Click Finish

#### Import the two extracted projects into the Eclipse workspace
* File:Import:General:Existing Projects into Workspace
* Click on next
* Enter the directory of your workspace, e.g. mine would be C:\workspaces\SpringTemplatesExample
* Wait for a few seconds or press <enter>
* You should see two projects: JdbcToSpringTemplates, LoggingUtils
* Click select all
* Click finish

#### Run Examples
* Wait for the projects to build
* Execute one of the Java classes called "JdbcExample" in any of the packages contained in the JdbcToSpringTemplates project

[<--Back](Designing_to_Spring_Templates)
