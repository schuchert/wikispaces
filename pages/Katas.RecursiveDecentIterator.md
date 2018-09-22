---
title: Katas.RecursiveDecentIterator
---
{% include nav prev="Katas" %}
## Problem
You need to get a list of all of the files in a directory system (or walk a n-ary tree really).
You want to provide one file at a time to the caller. For example, given the following directory
structure:
{% highlight terminal %}
wikispaces/
├── assets
│   └── css
│       └── style.scss
├── bin
│   ├── check_site
│   └── serve
├── _config.yml
├── _includes
│   ├── aside
│   │   ├── collapsed
│   │   ├── end
│   │   └── start
│   ├── include_md_file
│   ├── links_for
│   ├── site_url
│   └── toc
├── index.md
├── pages
│   ├── 3Questions-Smalltalk.md
│   └── aop
│       └── AOP_Field_Stones.md
── search.html
{% endhighlight %}

And given the following code:
{% highlight java %}
DirectoryIterator iter = new DirectoryIterator("/wikispaces");
while(iter.hasNext())
   System.out.println(iter.next());
{% endhighlight %}

The output should be similar to the following. The order is not important. The iterator returns all files.
You might only return the names or the names with their directorie. You could introduce filtering.
* style.scss
* check_site
* serve
* _config.yml
* collapsed
* end
* start
* include_md_file
* links_for
* site_url
* toc
* index.md
* 3Questions-Smalltalk.md
* AOP_Field_Stones.md
* search.html

Why write it this way? This forces you to write what is traditionally a recursive algorithm (DAG traversal) without using recursion.

There are other ways to address this problem:
* The Visitor Pattern
* Passing in an interface or block of code to apply to each node

While you can certainly do these, that misses the point of practicing writing a traditional algorithm in a way that is possibly different from how you've done it in the past. This exercise will give you some general skills you'll be able to apply to other graph traversal algorithms.
{% include nav prev="Katas" %}
