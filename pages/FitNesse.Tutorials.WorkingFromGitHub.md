---
title: FitNesse.Tutorials.WorkingFromGitHub
---
[<--Back](FitNesse.Tutorials)

You can get the start of this project from [github](http://github.com/schuchert/fitnesse-tutorials/tree/master) and then import it into an Eclipse workspace rather than starting completely from scratch. The start of each tutorial will use the following tag format: <FullPageName>.Start, for example the first tutorial is called FitNesse.Tutorials.0, so add ".Start" to that and you'll get "FitNesse.Tutorails.0.Start" as the tag. Each tutorial will list the tag.

Here are the steps to get started:
* Clone the repository from github:
{% highlight terminal %}
Macintosh-4% git clone git://github.com/schuchert/fitnesse-tutorials.git
Initialized empty Git repository in /Users/schuchert/tmp/junk/fitnesse-tutorials/.git/
remote: Counting objects: 10, done.
remote: Compressing objects: 100% (9/9), done.
remote: Total 10 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (10/10), 44.15 KiB, done.
{% endhighlight %}
**//Note//**: I'm writing this as I just created the git repository, you will see different output than the above

* Change to the directory:
{% highlight terminal %}
Macintosh-4% cd fitnesse-tutorials 
/Users/schuchert/src/fitnesse-tutorials
{% endhighlight %}

* Switch to the tag:
{% highlight terminal %}
Macintosh-4% git checkout FitNesse.Tutorials.0.Start
Note: moving to "FitNesse.Tutorials.0.Start" which isn't a local branch
If you want to create a new branch from this checkout, you may do so
(now or later) by using -b with the checkout command again. Example:
  git checkout -b <new_branch_name>
HEAD is now at a05260c... Start of Tutorial 0.
{% endhighlight %}
**//Note//**: This warning is telling you that you are not working on a branch. Since you are not working on the branch, you won't easily be able to commit the work that you do. If you plan to either work with your code from tutorial to tutorial, that is OK. However, if you'd like the option of checking in your work (maybe a branch per tutorial), then you'll want to create a branch as well.

* To save your work in a branch:
{% highlight terminal %}
Macintosh-4% git checkout -b work_on_tutorial_0
Switched to a new branch "work_on_tutorial_0"
{% endhighlight %}

Now you have the option of working, checking in your work on this branch, and then switching to another tag and starting over.

## Configuring Eclipse
Now, you'll need to create a workspace:
* Start Eclipse
* Set the workspace equal to the directory where you cloned the repository, e.g., /Users/schuchert/src/fitnesse-tutorials
* Close the initial screen.
* File::Import...::General::Existing Projects into Workspace
* Click **Browse**, then click **Chose**, or enter the workspace directory, e.g., /Users/schuchert/src/fitnesse-tutorials
* Confirm that DVR is already selected.
* Click **Finish**
* Set the JDK to 1.6: Eclipse Properties (Mac: command , | pc: File:properites):Java:Compiler:Compiler Compliance Level:1.6).

## Get Going!
Now is a great time to start [the first turtorial](FitNesse.Tutorials.0).
[<--Back](FitNesse.Tutorials)
