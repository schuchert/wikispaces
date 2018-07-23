---
title: cpptraining.GettingStartedWithEclipseCdt
---
[<--Back]({{ site.pagesurl}}/cpptraining#gettingfirsttestrunning)

# Overview
This instructions help you get started using Eclipse and the CDT to develop C++ systems under Windows.

# Many Thanks To
After many tries and false paths, I finally got a fully working environment fairly easily. Thank you to [Doug Schaefer](http://cdtdoug.blogspot.com/) ([Twitter](http://twitter.com/dougschaefer)), Eclipse CDT Project Lead.

These instructions are essentially a duplication of: [Wascana Eclipse C/C++ IDE for Windows Developers](http://code.google.com/a/eclipselabs.org/p/wascana/).

# Steps
Note: If you install the 64-bit JDK, install the 64-bit Eclipse. Same with 32-bit.

* Install a JDK (this is to run Eclipse): [Jdk 1.6 Install]({{ site.pagesurl}}/@http://java.sun.com/javase/downloads/widget/jdk6.jsp)
* Download and install the Helios version of eclipse with the Eclipse CDT: [Helios]({{ site.pagesurl}}/@http://www.eclipse.org/downloads/packages/eclipse-ide-cc-developers-includes-incubating-components/indigosr1)
* Add the wascana plugin from the following Eclipse update site: [ Wascana Update Site]({{ site.pagesurl}}/@http://svn.codespot.com/a/eclipselabs.org/wascana/repo)
** Start eclipse
** Go to// **Help::Install New Software...**//
** Paste http://svn.codespot.com/a/eclipselabs.org/wascana/repo/ in the// **Work with:**// box
** Click// **Add**//
** In the dialog, provide a name (I used// **wascana**//))
** Click// **OK**//
** Eventually you'll see under the **Name** column in the middle of the dialog "Wascana C/C++ Developer Tools for Windows"
** Click the box next to it to make a check appear.
** Click// **Next**//
** When the **Install Details** window appears, click// **Next**//
** When the **Review Licenses** window appears, select the "I Accept the terms of the License Agreements" and click// **Finish**//
** After the update is downloaded, you'll be asked to apply the updates. Do so by selecting// **Restart Now**//.

That's it, works quite well. This gives support for compiling and debugging C++ applications in Eclipse.

# Verifying It Works
* Create a new C++ project
* Select the Hello World Template
* Build and run it, notice the output in the console window
* Debug it, you should see it pause just before beginning main()

[<--Back]({{ site.pagesurl}}/cpptraining#gettingfirsttestrunning)
