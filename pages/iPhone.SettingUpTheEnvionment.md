---
title: iPhone.SettingUpTheEnvionment
---
{% include toc %}[<-- Back](iPhone)

# UNDER CONSTRUCTION
[Old Setup for XCode 3](iPhone.setup.xcode3)

# The Video

# Basic Application Setup
Note: This "works" and as I get better with XCode 4 I hope to improve this setup. If you know how to do this better, please let me know so I can learn about it and document it!

If you want to get get to it, [then skip this section](iPhone.SettingUpTheEnvionment#backgroundSkipped).
These notes are for XCode 4 and GHUnit 0.4.28. Each project I set up will have a minimum of 3 projects:
* The project containing the view-specific code
* The project containing the Unit Tests
* The project containing the model code

## Why?
GHUnit runs as an application, which means it has a main() function. Objective-C is based on C. In a C project, an executable can only have one main() when linking. The main() used for brining up the iPhone(iPad) UI is different that the main() used to execute tests. This is a deficiency in Objective-C's execution model. So there are some obvious obvious options:
* Have two files with main()
  * Conditionally select the correct one based on a build flag
  * Put them in different projects and just build the project you want to run
* Update main() to either do the "real" thing or the "test" thing based on a runtime command line flag.

I prefer having two projects. This also provides a logical place to put the unit test source files. In languages like Java or C#, the extra source code from tests does not incur a runtime burden on the executable if they are not used. Not so with C/C++/Objective-C; that is built into the execution model. So I don't want to link my test code into my final executable and I don't want to hassle with more complex builds. Two projects make that an easy problem to solve.

Finally, if I have two projects, both of which have a main, it is much easier to simply put the "model" code in another project. This project will be a static library, linked by both of the first two projects.

These notes are for XCode 3.2.2. Given that Apple has messed up Unit Testing in this version, you can assume these steps are fragile. If they fail for you, please send me an email (schuchert -at- yahoo -dot- com) and let me know the version of XCode you are using. I'll see if I can figure it out. If you've solved the problem, let me know and I'll update these notes. Or, if you are feeling ambitious, I'll give you permission to update the notes.

{: #backgroundSkipped}
# Setting up the three projects

## Creating the Workspace
* Start XCode
* Create a new Workspace
  * File::New Workspace (^⌘N)
  * Select a folder for the workspace. For this example I'll use:// **/Users/Schuchert/src/iPhoneDemo**//. I'll also be putting all of the project directories in this same folder. You'll need to create a directory somewhere.
  * Enter a name for the project. I used iPhoneDemo

## Creating the View Project
* Add a project:// **File::New Project**// (⇧⌘N)
* Select// **iOS::Application**// on the left side
* On the right side, select// **Windows-based Application//**
* Click// **Next**//
* Enter a product name. I'll use// **RpnDemo**//
* Select a device family. I'll be using// **iPhone**//
* For this example do not select either "Use Core Data" or "Include Unit Tests"
* Click// **Next**//
* When Prompted for a directory, select the same directory that you put the workspace file in. In my case that is// **/Users/Schuchert/src/iPhoneDemo**//
* Click **Create**
* Make sure the right Scheme is selected. It should be the Project Name iPhone 4.3 Simulator. If you happen to have your registered iPhone connected, it may select to install and run on your iPhone by default. 
* Confirm your project works by running it and seeing that the iPhone simulator starts up (⌘R)

## Creating the GHUnit Project
Note that by default, the project you just created is selected. If you rush though this, you'll create the new project as a dependent of the view project.
* Confirm your project is not selected. If it is, unselect it by command clicking it.
* Follow the same instructions as above for creating the View project
  * Add a project:// **File::New Project**// (⇧⌘N)
  * Select// **iOS::Application**// on the left side
###  On the right side, select// **Windows-based Application//
  * Click// **Next**//
  * Enter a product name. I'll use// **UnitTests**//. You might call this project LogicTests or similar.
  * Select a device family. I'll be using// **iPhone**//
  * For this example do not select either "Use Core Data" or "Include Unit Tests"
  * Click// **Next**//
  * When Prompted for a directory, select the same directory that you put the workspace file in. In my case that is// **/Users/Schuchert/src/iPhoneDemo**//
  * Verify that the "Group" selection is iPhoneDemo and not RpnDemo.
  * Click// **Create**//
* Switch the the UnitTests Scheme and verify that it runs (⌘r)
* Quit the simulator (⌘q)
* This is not correct as it is no different from the first project.

### Update the Unit Test Project
* [Download GHUnit](https://github.com/gabriel/gh-unit/downloads) and unzip the file somewhere. I'm using 0.4.28 and I downloaded the file to ~/Downloads. The unziped directory is ~/Downloads/GHUnitIOS.framework
* Add this as a dependent framework to your project by dragging GHUnitIOS.framework on to your UnitTests project
* Under the Destination enable "Copy items...". When you check in this one directory into your repository, it will be a stand-alone, build-able unit.
* Click// **Finish**//
* Under// **Supporting Files**// find and edit// **main.m**//
* Update its contents by copying the file from [here](https://github.com/gabriel/gh-unit/raw/master/Project-IPhone/GHUnitIOSTestMain.m).
* If you run at this point, you'll get an exception. You'll need to add a few flags to the target's configuration

### Update the Unit Test Target
* Select your// **UnitTests**// project
* Select the// **UnitTests**// target in the middle column
* Select the// **Build Settings**// tab.
* To make this next part easier, you can type "other linker flags" in the filter box.
* Scroll to //**Linking**// 
* Double-click on //**Other Linker Flags**//
* Add: -ObjC
* Add: -all_load
* Click// **Done**//
* Next, under the// **Summary**// tab find// **Main interface**//
* Delete MainWindow, simply leave it blank
* Delete the// **MainWinow.xib**// (don't just remove the reference)
* Delete the// **UnitTestsAppDelegate.h**// (don't just remove the reference)
* Delete the// **UnitTestsAppDelegate.m**// (don't just remove the reference)
* Run your project, make sure you see the unit test runner
### Add One Test To Make Sure

# Adding the Model as a Static Library

* To do this:
  * Download the file somewhere (my download location is// **~/Downloads**//)
  * Expand //**Targets**//
  * Select your target name, mine is //**UnitTests_oniPhoneSimulator**//
  * //**Right-click:Add:Existing Files...**//
  * Find// **GHUnitIOSTestMain.m**// and double-click it (find your download location)
  * On the next dialog, check //**Copy items into destination group's folder (if needed)**//
  * Make sure that the right Target is selected. In my case this means //**UnitTests_oniPhoneSimulator**// is selected, but //**Tutorial**// is not selected.
  * Click //**Add**//
* Change the active target to the new target:
  * Pull down //**Project:Set Active Target**//
  * Select your unit test project.
  * Build, command-b
  * Run, command-r
  * When the simulator starts, click on //**Run**//. There are no tests, so it finishes quickly.

# Add a first test
* Under //**Targets**//, right-click  //**UnitTests_oniPhoneSimulator**//
* Select //**Add:New File**//
* Under //**iOS:Cocoa Touch Class**//, just select //**Objective-C class**//
* Click //**Next**//
* For the name, enter //**ItShouldHaveSmoke.m**//
* For Unit Test files, I do not create a header and source file, but just a source file. So uncheck //**Also create "...".h**//
* Verify that only the correct target (UnitTests_oniPhoneSimulator) is selected.
* Click //**Finish**//
* Enter the following test code:

{% highlight objc %}
//
//  ItShouldHaveSmoke.m
//  Tutorial
//
//  Created by Brett Schuchert on 11/9/10.
//  Copyright 2010 Brett L. Schuchert. Use at will, just don't blame me.
//

# import <GHUnitIOS/GHUnitIOS.h>

@interface ItShouldHaveSmoke : GHTestCase {
    NSString *someVariableToInitialize;
}
@end

@implementation ItShouldHaveSmoke

-(void)setUp {
    someVariableToInitialize = @"Hello World";
}

-(void)tearDown {
    someVariableToInitialize = nil;
}

-(void)testThatItDoesHaveItsSmoke {
    GHAssertEquals(@"", someVariableToInitialize, nil);
}
@end
{% endhighlight %}

* Build, command-b
* Run, command-r
* You should see the simulator start. If you still had it running, XCode will warn you that it needs to stop the simulator. Select //**OK**// to do so.
* When the simulator starts, click //**Run**//
* Oops, the test is failing.
* go back and edit your code. Chang the single assertion to:

{% highlight terminal %}
    GHAssertEquals(@"Hello World", someVariableToInitialize, nil);
{% endhighlight %}
* Build and re-run, hit command-r
* Run the test suite again.

Congratulations, you have your first test working.

# Set Unit Test Executable Settings
Review// **GHUnitIOSTestMain.m**//. Notice that it recommends editing your unit test executable and setting the following properties:

| Property Name | Default Value | Recommended Setting |
|NSDebugEnabled|                        NO      |YES|
|NSZombieEnabled|                       NO       |YES|
|NSDeallocateZombies|                   NO       |YES|
|NSHangOnUncaughtException|             NO       |YES|
|NSEnableAutoreleasePool|YES|NO|
|NSAutoreleaseFreedObjectCheckEnabled|NO|YES|
|GHUNIT_AUTORUN|NO|YES|

Note, the last one is one I recommend. This will make your tests run automatically.

To make create these environment settings:
* Expand// **Executables**//
* Select your unit test executable (//**Unit Tests**//
* Right-click, Get Info (command-I)
* In the bottom window, click the +, add a field and set its value
* Re-run your tests to make sure they work as expected

Now the hard part starts.

# Now Really Setting Things Up
<<to be expanded>>
* Create a new static library for your model code (keep model separate from UI
* Link to it from the UI project
* Link to it from the Unit Test Project

# A Few Handy Shortcut Keys

| Command-r | run application |
| Command-b | quick open |
| F3 | mapped to Edit:Find:Jump to Definition |
| Command-alt up-arrow | Switch between .h and .m |

[<-- Back](iPhone)
