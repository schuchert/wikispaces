---
title: Subversion_on_XP
---
{:toc}
[<--Back]({{site.pagesurl}}/Tool_Setup_and_Configuration_Notes)

I'm still looking for the right place to host my work in subversion. Until then, I'm running a subversion server on my home system. I'm using subversion for experience, I've been using some version of CVS since 1989 and I figure it's about time to give a new tool a try.

Here's what I did to get that up and running. Note, all of this stuff is available online. I'm just putting it here for a very quick reference.

## Install Software
# Download subversion XP binaries from [here](http://subversion.tigris.org/servlets/ProjectDocumentList?folderID=91). Note I'm using 1.3.2.
# Install it. I happened to install it C:\Subversion

## Configure Repository
# CD to the subversion installation directory (c:\Subversion in my case)
# CD to the bin directory
# Create a repository using the svnadmin tool: svnadmin create c:\Repository
Note my directory is c:\Repository

## Configure Subversion as an XP Service
# Download a tool to install subversion as a service from [here](http://clanlib.org/~mbn/svnservice/)
# Extract this somewhere. I just extracted it to C:\Subversion\bin to make life easy
# Use the tool to install subversion as a service: snvservice -install -d -r c:\Repository
Note, by using -r c:\Repository, my URL will be svn://localhost/, if you didn't use -R c:\Repository, your URL would be svn://localhost/Repository

## Configure the Windows Service
# Open up the windows services tool
# Find SVNService
# Right-click start 
# Right-click properties, change startup-type to automatic and click OK
# Close windows services

## Setup User Accounts
# CD to the directory where you created your repository, c:\Repository in my case
# CD to conf
# Use your favorite editor (vim, right?) to edit snvserv.conf, put the following info in it:
```
[general]
auth-access = write
password-db = passwd
```
# Use your favorite editor to edit passwd and create an account, e.g.:
```
[users]
# user name        password
brett.schuchert = somepassword
```

## Install Subclipse
# In Eclipse, go to help:software updates:find and install
# Select search for new features to install and click on next
# Create a new site, **Name:** Subclipse **URL:** http://subclipse.tigris.org/update_1.2.x
# Follow the install instructions and then restart Eclipse

## Connect to a Repository
# Open up the SVN Repository Exploring Perspective in Eclipse
# Right-click in the SVN Repository Tab and select New:Repository Location
# Enter your URL. In my case it's: svn://localhost

## First Time You Write
# When you try to add a project in Eclipse, you'll be asked to login in
# Enter your user and password. In my example, my user is "brett.schuchert" and my password is "somepassword"

That's it.

[<--Back]({{site.pagesurl}}/Tool_Setup_and_Configuration_Notes)
