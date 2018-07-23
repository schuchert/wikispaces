---
title: vm.compiling.phantomjs2.ubuntu
---
These notes come from two sources:
* [Build phantomjs2](http://phantomjs.org/build.html) 
* [Patch with forward declares](https://codereview.qt-project.org/#/c/107921/3/Source/JavaScriptCore/runtime/JSObject.cpp)

The steps are repeated here because the order is different from the base instructions:
* I'm using a VM, so make sure you have plenty of RAM. 4gm was inconsistent, so I bumped mine up to 7 just in case.
* Install needed build dependencies
```bash
    sudo apt-get install build-essential g++ flex bison gperf ruby perl \
      libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
      libpng-dev libjpeg-dev python libx11-dev libxext-dev
```
* Clone the repo and move to the 2.0 branch
```bash
    git clone git://github.com/ariya/phantomjs.git
    cd phantomjs
    git checkout 2.0
```
* Apply the changes from [Patch with forward declares](https://codereview.qt-project.org/#/c/107921/3/Source/JavaScriptCore/runtime/JSObject.cpp). If you trust me, here's a patch you can directly apply:[[file:0001-Added-forward-defs-to-get-code-to-compile.patch]].
* Build phantomjs2 (this should detect the number of cores and parallelize the build, if not you can add --jobs 4, for example)
```bash
    ./build.sh --confirm
```
* If this fails, you might need to up your memory and make sure you are not doing anything else.
* If you get an error related to a problem with a .o or some object missing from a library, up your memory as well. And then do this to restart the whole build
```bash
    git clean -fdx
    ./build.sh --qt-config "-I /usr/local/include/ -L /usr/local/lib/" --confirm
```
> <span class="sidebar_content">I had a lot of failures and it is probably related to running out of memory. If you are doing nothing else, 4 gb is probably enough. I was using IntelliJ and running a command line build and once I hit 53 free megabytes out of 7 gb and realized that was probably why it was failing.</span>
* This creates bin/phantomjs. You can move the executable anywhere, it does depend on shared libraries on your system.
* Full-disclosure, building this on my VM has caused it to hang. I kill it and restart the build. But if you are using VirtualBox, it might be unstable.
