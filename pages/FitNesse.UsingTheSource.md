---
title: FitNesse.UsingTheSource
---
## Getting Started With Source

### First, acquire the source from github:
* Find a place you'd normally store source code. I use ~src, not original, I know.
* Type the following command while in that directory:
{% highlight terminal %}
git clone git://github.com/unclebob/fitnesse.git
{% endhighlight %}
* Note, this creates a directory called fitnesse

### Next, build the source:
You can actually skip to the next step if you're feeling lucky.
* Just to be sure, build FitNesse and run the unit tests
{% highlight terminal %}
> cd fitnesse
> ant
{% endhighlight %}
#### Notes
* You'll need at least JDK 1.5 and ant 1.7 (or have junit task already available)
* Occasionally some of the unit tests might fail (they don't always, there are still a few synchronization problems// **in the tests**//)
* The default ant task also runs the FitNesse tests used to test FitNesse, so you'll need to either leave port 8080 open or define an environment variable, FITNESSE_TEST_PORT, with the port you want have the acceptance test execution use.

### Build the Distribution
* Type the following:
{% highlight terminal %}
> ant build_distribution
{% endhighlight %}
* Note, this builds a file called fitnesse<date>.zip

### Unzip It
* Unzip the fitnesse<date>.zip file anywhere (I use ~/)
* This creates a directory called fitnesse

### Run It
* cd to the directory where you extracted the zip file
* Type:
#### Unix
{% highlight terminal %}
> sh run.sh -p 8080
{% endhighlight %}
#### DOS
{% highlight terminal %}
> run.bat -p 8080
{% endhighlight %}
