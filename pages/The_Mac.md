---
title: The_Mac
---
# My Life with a Mac

Last Friday I took the plunge and switched (mostly) from a Windows-based system to a Mac. My new employer, [Object mentor](http://www.objectmentor.com) provided me with a new laptop. This page captures a few notes and experiences.

## The Machine
I've been waiting for the Intel Santa Rosa chip set to make it to a laptop. I also wanted a laptop with a good video card. Enter the updated Mac's. Here's the vital stats:
> 2.4 GHz, Intel Core 2 Duo (Santa Rosa Chipset)
> 2 GB Memory (I might upgrade to 4 if necessary but I don't think I'll need it)
> 160 GB, 7200 RPM Hard Drive
> NVidia 8600 GeForce 8600 GT
> Hi-Res, Matte finish monitor (1920 x 1200)

This is a lovely machine.
----
## Boot Camp
I still occasionally work with C# and when using it work with the Microsoft tools, so I needed either two laptops or one machine that can run both - it's not that I cannot use C# in other environments but rather I only used C# for teaching and when I do I'm mimicking the students' environment. I decided to give boot camp a try.

OK, the first try was a failure as was the second. The third attempt was good but I got it right on the fourth try. Here's the problem I encountered and then the fix:
# Installed boot camp on mac (successful)
# Created drivers DVD (successful)
# Created 32 GB partition (successful)
# Installed Windows XP, SP 2 (successful - note you have to use SP 2)
# Installed drivers off DVD (failure - messed up XP)

## One Successful Path
Follow the steps above but **do not install the drivers off the DVD**
> **Important** I formatted with FAT to allow the Mac to write as well as read the drive. Raw OS X will not write to an NTFS drive. When I selected FAT, the XP installer switched to FAT32 given my partition size.

### Apply XP Updates **Before** the DVD Drivers
After a lot of trial and error I managed to find a repeatable (I've done it twice) process that works.
# You need a network driver. I found the driver for the wireless card on the drivers disk.
# Explore the DVD and go to the following directory: **Drivers/Atheros**
# Execute: **AtherosXPInstaller.exe**
# Configure your wireless network
# Run the windows Updater
# > I ran it once, it updated the updating software and I rebooted
# > I ran it a second time and it had 77 downloads (I used custom installation, not express, to skip upgrading IE)
# > Reboot if told to do so

### Finish Install
# > Install the drivers DVD, and you are ready to go. It works like a champ.

----
## Subversion For All
OK, I installed a subversion client on my PC. I've had subversion running on my PC for some time now and I wanted one repository for both systems. I took th easy way out:
# I backed up my repository (svnadmin dump)
# I installed subversion on the PC side of my Mac
# I created a repository at c:\subversion_repository (svnadmin create)
# I configured a few users
# I restored a repository (svnadmin load)
# I installed a subversion client on the Mac
# I use the file system URL rather than running a service or using Apache
# The PC driver appears on the Mac under /Volumes. I renamed mine to XP so I can find my XP installation at: /Volumes/XP
# The repository is relative to that so it's: /Volumes/XP/subversion_repository
# The URL is: file:///Volumes/XP/subversion_repository

I mostly use Subversion in Eclipse:
# Install subclipse
# Configure subclipse to use SVNKit: windows:preferences:team:SVN:SVNKit (Pure Java)