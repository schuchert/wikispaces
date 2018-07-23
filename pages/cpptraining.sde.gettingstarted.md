---
title: cpptraining.sde.gettingstarted
---
## Background
This example uses windows XP, cygwin and SDE lite 6.06.

## Install The SDE
* Download the SDE lite from [here](http://www.mips.com/products/software-tools/mips-sde-lite/). Note (free) registration is required.
* Follow the install instructions in chapter 3 of the [SDE Programmer's Guide](http://www.mips.com/media/files/MD00428-2B-SDE6X-SUM-01.17.pdf), partially copied here for ease:
** Install cygin
** Unzip contents of downloaded zip file to /cygdrive/c/sde-6.06
** In a cygwin shell, run the setup script: 
```
sh /cygdrive/c/sde-6.06/bin/sdesetup.sh
```
** Every time you start a shell (or configure your login) to source environment variables
```
source /cygdrive/c/sde-6.06/bin/sdeenv.sh
```

## Get The Project
The source files for the base projects are on github (or in class I can provide a thumb drive). The uri is// **git://github.com/schuchert/embedded_cpp_tdd.git**//.
* In some base directory (preferably one without a space it its name) clone the git repository
```
$ git clone git://github.com/schuchert/embedded_cpp_tdd.git
Cloning into embedded_cpp_tdd...
remote: Counting objects: 97, done.
remote: Compressing objects: 100% (91/91), done.
remote: Total 97 (delta 31), reused 0 (delta 0)
Receiving objects: 100% (97/97), 76.19 KiB, done.
Resolving deltas: 100% (31/31), done.

Administrator@brettlschuccf48 /cygdrive/c/src
$ cd embedded_cpp_tdd/

Administrator@brettlschuccf48 /cygdrive/c/src/embedded_cpp_tdd
$ ls
cpputest  dice_game  makefile.base  rpn_calc
```
||~ Name ||~ Kind||~ Description ||
||cpputest ||Directory||Source for C++ U Test, V 2.3 ||
||dice_game||Directory||Placeholder for first project||
||makefile.base||File||Common make stuff based on the makefiles provided by the examples in the sde||
||rpn_calc||Directory||Placeholder for second project||

## Using It
The makefile has a default SBD of GSIM32L. Simply typing make will built files that will work with the simulator and the debugger. You can also...
||~ Command||~ Effect||
||make||Build and link||
||make clean||Clean all files created during the build||
||make run||Build if necessary and execute the tests||
||make debug||Build if necessary and start the visual debugger (sde-insight)||
