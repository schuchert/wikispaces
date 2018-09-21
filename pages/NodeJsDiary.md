---
title: NodeJsDiary
---
## Background
* I'm rolling off a project at the end of February 2014. I have two options for my next gig:
  * West Coast: Work as a consultant across multiple projects, coaching, mentoring, and helping with getting a grasp on domains across projects, think [bounded context](http://www.sapiensworks.com/blog/post/2012/04/17/DDD-The-Bounded-Context-Explained.aspx). Projects are typical Java/Spring, etc. The tech stack is comfortable, not accountable for delivery. I see this as hard but cushy. Nice location, travel so-so. Mature, large project. It's in an "enterprise" setting that, while it has its issues, has been getting better for some time.
  * East Coast: Tech lead (responsible for delivery). Tech. stack includes [micro services](http://yobriefca.se/blog/2013/04/29/micro-service-architecture/) and is based on [node.js](http://en.wikipedia.org/wiki/Nodejs). I've dabbled with JavaScript but just on the cusp of groking, I get distracted. This would get me there I suspect. Location not as nice but pretty good. Travel good. Good people (like West Coast), though I've worked with a few of them and I'd like to again.
* Both assignments are good for different reasons, so I'm letting ThoughWorks decide for me.
* I'm leaning towards the East coast because it's all new tech and it would be a challenge for me to start using my brain again (Java/Spring/etc. doesn't require much thought anymore for me). Along those lines, I'm installing node.js and working through a book. 
  * Because I'm preparing for node.js, I'll almost certainly end up on the West coast, so I'm probably jinxing myself )

## Day 1: Saturday Feb 22, 2014
* Began reading last night, found what I think will be exactly what I need: [The Node Beginner Book](http://www.nodebeginner.org/)
  * I'll work through the free 21 pages then buy the book. From what I've read already, I ready to buy the book. But I'll wait to confirm what I already suspect, it'll really help me.
* Yak shaving... Need to install some stuff, taking the [Gentoo approach](http://www.gentoo.org/proj/en/gentoo-alt/prefix/bootstrap.xml)
* Note, since I'm using OS X, I only needed to download [bootstrap-prefix.sh](http://prefix.gentooexperimental.org/hg/prefix-tree/raw-file/default/scripts/bootstrap-prefix.sh)
  * To run the script, it appeared to need to be in my working directory. When I tried to run it in ~/src while the script was in ~/Downloads, it didn't do anything.
  * I used 8 cores instead of 5 for the installation. Not noticing any slowing down while typing text into a web form
  * I used the following install location: /Users/schuchert/bin/gentoo (no spaces allowed)
* Blocked... The installation of gentoo has failed. I *suspect* it's due to the version of gcc I'm using (4.8). The installation requires gcc 4.2. By the time we get to gcc 4.8 it supports C99. The failure relates to something that is not allowed in C99. Rather than fight the build script, I'm going to use ports to install an older version (starting with gcc 4.5) and then trying again.
  * And of course this failed... Think it's time to [wipe port off my system](https://guide.macports.org/chunked/installing.macports.uninstalling.html) and then see with what I'm left...
  * This is// **exactly**// why I should use a VM!
  * That will be two yaks removed from my goal
  * before I do that, after uninstalling all of my ports, I'm trying again. I am not starting clean, that could be an issue. We'll see.
  * Nope, freshly deleting and starting from scratch. By the way, this is using clang... Maybe I need to update that.
* In parallel to installing Gentoo, I'm working on creating a new vagrant box, because impatient.
  * Of course, need to upgrade virtualbox to the latest version
  * And probably vagrant to boot (yep, 1.3.5 to 1.4.3)
  * Using [this page](http://dev.alexishevia.com/2013/09/setting-up-nodejs-dev-environment-with.html) with one change, using a 64 bit rather than a 32 bit version of the OS.
* The gentoo installation failed once again (. I'm going to work on the VM instead.
* Updated virtualbox guest extensions now.
  * OK, that was not enough. Luckily, [this site mentions a gem](http://kvz.io/blog/2013/01/16/vagrant-tip-keep-virtualbox-guest-additions-in-sync/) that will check and update the guest extensions. It looks like it is working. It is taking a minute or so.
  * Nope, that did not work. This is a day full of yaks. Trying manually from <http://software.darrenthetiger.com/2012/01/installing-virtualbox-guest-additions-on-a-vagrant-lucid64-box/>.
----
* Made some progress with vm, trying to more easily install. Installing <http://downloads.vagrantup.com/tags/v1.0.0>
  * This is looking promising. It's using the 32-bit precise base box, but for experimentation that's ok.
  * Going all command line is also fine, vi ftw!
  * Success. Back to the book.
----
* Late in the evening, read a bit more and then read a link: [Understanding node.js](http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb)

## 23 Feb 2014
* Finished free book, bought the book off of leanpub, as well as another in a package deal <https://leanpub.com/b/node>
* Also got another book he's working on (mentioned in The Node Beginner Book) <https://leanpub.com/nodecraftsman>
* Noticed I was using raw vi and vim was not installed.
  * Manually installed it, then figured, it's a VM - not the way to do it.
  * Added chef script to install vim
  * Removed manually installed vim and then reprovisioned VM
  * Back to working through the book, things going smoothly after much yak-shaving yesterday
*** Ok, some yak shaving... Manually installing <https://github.com/amix/vimrc>. If I like it, I'll chef it.
*** Wait, git not installed. Copied vim cookbook and renamed vim to git, now git is also installed. Given that, I'll do the same with the vim configurations
----
* Spending a lot of time on the VIM thing.
  * New to chef, so that's a plus
  * Seems like a post git-clone shell script is not executing. Though it might be file ownership, not sure.
  * Decided, while I was cleaning things to remove the old .git directory and then make it my own (intending to put it up to github).
  * Needed to get back to working, so I added a shared directory to copy the code I've typed from the book so far. Looks like you must halt the vm to get shared folders to appear.
  * Halted/destroyed VM after getting my work coped. Now running from scratch. This demonstrates that I'm a terrible noob with chef, as having the destroy/recreate the VM so early days means (to me) I'm doing something basic incorrectly.
----
* VM back and running (I changed the node version and it caused a world of hurt). Still not seeing .vimrc created!
  * Maybe a chown on the damn .vim_runtime that is checked out as vagrant:root, but I want vagrant:vagrant
  * Got the group correct, here's the example:
{% highlight ruby %}
git "/home/vagrant/.vim_runtime" do
  repository "git://github.com/amix/vimrc.git"
  reference "master"
  user "vagrant"
  group "vagrant"
  action :sync
end
{% endhighlight %}
----
* Went back to book, tired of failing on getting a script to work properly
* To part of book where I need to use npm to install a nodejs addon, chefing it
  * Added: https://github.com/balbeko/chef-npm
  * Created used of it
----
* I clearly do not understand chef at a basic level. While I've been able to add some simple packages, trying to get something working using cookbooks from github is going nowhere. It's like a lot of tools, there's a basic assumption about level of understanding that I do not have. Going to continue banging my head against a wall for some time, because I don't feel like taking a shortcut here and just using npm directly or using a bash script.
  * Do scripts// **have**// to run as root? Or just npm?
  * OK, well there was no error and no effect from running the script. BROKEN! Frustrated as fuck.
----
* Finished book. Good book. I'd like it to continue, but i'll find other sources.
* My VM is OK but have not been able to
  * Execute a shell script successfully in Chef
  * Ditto, for installing something using npm
* Since node is my primary goal, I'll keep the vm I have and figure out the chef thing if my next gig is using Chef.

## 24 Feb 2014
Spent most of the day on work stuff (interviewed a sr. developer candidate and worked on notes for a transition from WebSphere to TC Serer).

I'm going to spend some time reading. I'm still wondering how to get all of those manual steps in my VM to actually work, but I have a VM that works, so I'm mostly happy.

BTW, reading Hands-On Node.js
----
Starting up my vm and working through the the book (12% already).

## 25 Feb 2014
Well as I somewhat expected, I'm probably not going to get on the project using this tech stack. I'm glad I took a quick look at node.js. I'll be happy to dig into it more. I think I need to switch to a few other things (brush up on DDD for example).
