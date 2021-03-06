---
title: Taking_Your_Workspace_Home
---
## Backup Properties
* **File:Export:General:Preferences**
* Enter/browse a file name
* Make sure to copy/email this file to yourself

## Backup Projects
* Make sure **Project:Build Automatically** is turned**off**
* **Project:Clean**
  * Make sure to select all projects
  * Make sure **Start a Build Immediately** is**disabled**
* Go to your workspace directory
* Select everything (should be just folders)**except** the .metadata directory
* Zip/7-zip all of the files into a single archive
* Make sure to copy/email this file to yourself

## Create New Workspace
* At home, install and fire up Eclipse.
* When prompted, create a new workspace directory

## Restore Properties
* In your new project, **File:Import:General:Preferences**
* Browse to your properties backup file
* Select it
* Click **Finish**

## Restore Projects
* Unzip/7-zip your files into your newly-created workspace directory
  * Note, each of your projects will be a directory under your workspace directory
  * E.g. if your workspace directory is C:\workspaces\Ejb3AndJpa, then after extracting your projects you'll have folders like C:\workspaces\Ejb3AndJpa\Ejb3Tutorial1, C:\workspaces\Ejb3AndJpa\JpaTutorial1
* Back in Eclipse, **File:Import:General:Existing** Projects
* Browse to your workspace directory (should just need to click browse and OK)
* Select all of your projects
