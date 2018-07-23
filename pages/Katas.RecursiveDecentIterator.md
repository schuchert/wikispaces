---
title: Katas.RecursiveDecentIterator
---
[<--Back]({{ site.pagesurl}}/Katas)
## Problem
You need to get a list of all of the files in a directory system (or walk a n-ary tree really). You want to provide one file at a time to the caller. For example, given the following directory structure:
[[image:http://yuml.me/diagram/dir:td;scruffy/class/%5B(Dir)BaseDir%5D%5E%5B(Dir)SubDir1%5D,%20%5B(Dir)SubDir1%5D%5E%5Bfile11%5D,%20%5B(Dir)SubDir1%5D%5E%5Bfile12%5D,%20%5B(Dir)SubDir1%5D%5E%5Bfile13%5D,%20%5B(Dir)SubDir1%5D%5E%5B(Dir)SubSubDir%5D,%20%5B(Dir)SubSubDir%5D%5E%5Bfile111%5D,%20%5B(Dir)BaseDir%5D%5E%5B(Dir)SubDir2%5D,%20%5B(Dir)SubDir2%5D%5E%5Bfile21%5D,%20%5B(Dir)SubDir2%5D%5E%5Bfile22%5D,%20%5B(Dir)BaseDir%5D%5E%5B(Dir)SubDir3%5D]]

And given the following code:
```java
DirectoryIterator iter = new DirectoryIterator("/BaseDir");
while(iter.hasNext())
   System.out.println(iter.next());
```

The output should be similar to the following (the order is not important, just that your iterator finds all files or a filtered version of all files):
* file22
* file21
* file111
* file13
* file12
* file11

Why write it this way? This forces you to write what is traditionally a recursive algorithm (DAG traversal) without using recursion.

There are other ways to address this problem:
* The Visitor Pattern
* Passing in an interface or block of code to apply to each node

While you can certainly do these, that misses the point of practicing writing a traditional algorithm in a way that is possibly different from how you've done it in the past. This exercise will give you some general skills you'll be able to apply to other graph traversal algorithms.
[<--Back]({{ site.pagesurl}}/Katas)