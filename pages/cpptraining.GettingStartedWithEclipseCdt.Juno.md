---
title: cpptraining.GettingStartedWithEclipseCdt.Juno
---
[<--back]({{ site.pagesurl}}/CppTraining)
# Overview
Picking up work on my C++ book again so I figured it was time to start using Juno (Eclipse circa '12). Here are the preliminary steps.
## The Steps
* Install a JDK, I recommend at least 1.6, or 1.7 if it is easy/supported for your environment.
* [Download the Eclipse CDT](http://www.eclipse.org/downloads/packages/node/818)
* Extract the zip somewhere, for this example, I'll use// **c:\learncpp**//. When you are done, you should see// **c:\learncpp\eclipse**//, under which you'll see eclipse.exe. Don't run it just yet.

### Windows Users
* Install MinGW by [downloading the latest version of the GUI installer](http://sourceforge.net/projects/mingw/files/Installer/mingw-get-inst/).
* Make sure to include g++ and the MinGW Developer toolkit (for this example, I selected// **c:\learncpp\MinGW**// as the installation directory)
* Update your system path to include// **c:\learncpp\MinGW\bin**// and// **C:\learncpp\MinGW\msys\1.0\bin**// - note that the version of msys could change.

### Mac Users
What I'm about to recommend is controversial because most people prefer [homebrew](http://mxcl.github.com/homebrew/).
* Install either XCode or (better) the xcode developer tools only (about 200 meg download versus 4 gig).
* Install [mac ports](http://www.macports.org/install.php/install.php)
* Install gcc 4.7 or later

### *nix users
Use your favorite package tool to install g++ and make. I'm sure there are more steps but I don't have a raw unix distro with which to experiment.
[<--back]({{ site.pagesurl}}/CppTraining)
