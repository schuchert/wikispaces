---
title: Acceptance Testing FitNesse Table Table Example
---
{% include nav prev="FitNesse.Tutorials" %}

{% include toc %}
## DRAFT

I'm working on an example of developing acceptance tests using a Digital Video Recorder as my problem domain. After several acceptance tests I started working on the idea of season pass priorities. In a nutshell, a season pass says "record all episodes of a given program". When you add priority, then the highest-priority season pass takes precedence. For example, say you can only record one program at a time and on Monday Evening you want to record House at 7 PM CST as well as Chuck, same time, different channel. If House is the higher priority program, it should be recorded.

So I wanted to create several tests around priority with dimensions like:
* Number of programs that can be recorded at the same time (1, 2, 4)
* Priority when there is no conflict.
* Priority when there is conflict.
* Priority when there is conflict and then an episode gets removed from the schedule.
* ...

First thing I wanted to do was create a schedule to test against. A program has zero to many episodes and I want to be able to create them in different ways. My first thought was to us a script table.

### Script Table
I like Script tables because they remind me of Smalltalk. I like to use them when I need to create things that have one to many relationships and I want to create them together. 

A program has a normal day and time and is on a channel. An episode can be at any day or time, but is the same day and time of the program by default.

Here is a script table that first creates a program and then adds 4 episodes to it:

{% highlight terminal %}
|script|Program Scheduler                                                                               |
|$B=   |Create Program Named|BSG|On Channel|247               |Every|Friday   |At      |9:00|Duration|60|
|ensure|Add Episode To      |$B |Named     |He That ...       |On   |2008/4/4 |Duration|45              |
|ensure|Add Episode To      |$B |Named     |Six of One        |On   |2008/4/11|Duration|30              |
|ensure|Add Episode To      |$B |Named     |The Ties That Bind|On   |2008/4/18|Duration|15              |
|ensure|Add Episode To      |$B |Named     |Escape Velocity   |On   |2008/4/25|Duration|10              |
{% endhighlight %}

Notes:
* The first line creates a new instance of a Fixture (calls the constructor). In this case it is the ProgramScheduler class.
* The next line executes a method called "CreateProgramNamedOnChannelEveryAtDuration". The method returns a value (the id of the program created), which is stored in a variable called $B.
* The next 4 lines all starting with "ensure" call a method named "AddEpisodeToNamedOnDuration". The value returned from the second line, which was stored in $B, is used as input into each of these lines.

This particular example creates one program:
* Named Battlestar Galactica
* On channel 247
* Every Friday
* At 9:00
* With a duration of 60 minutes

Next, 4 episodes are added to that program with the following names:
* He That ...
* Six of One
* The Ties That Bind
* Escape Velocity

### Decision Tables
This was fine initially, but for some tests I wanted to make more stuff with less verbage. I needed a lower-fidelity way to create more things. By lower-fidelity, I really mean it was OK for some things to be less flexible (e.g. episode duration always being the same as the default value).

Then I decided to try Decision tables:

{% highlight terminal %}
|Create Programs|
|Name |Channel|DayOfWeek|TimeOfDay|DurationInMinutes|id? |
|House|4      |Monday   |19:00    |60               |$ID=|

|Create Episodes                                                                |
|Program Id|Name                                                       |Date    |
|$ID       |He figures it out based on something Wilson says.          |2009/4/1|
|$ID       |He's wrong many times but then in the last minute is right.|2009/4/2|
|$ID       |They break into someone's house.                           |2008/3/1|
{% endhighlight %}

This accomplishes the same kind of thing in a more succinct manner than the script table.

Noted:
* The first table creates a single program, but notice it would be easy to add any number of programs to this table by adding additional rows.
* The second table creates three episodes.

FYI, here's an example query table to validate these results:

{% highlight terminal %}
|query:Episodes                                             |$ID                                 |
|name                                                       |date    |startTime|durationInMinutes|
|He figures it out based on something Wilson says.          |2009/4/1|19:00    |60               |
|He's wrong many times but then in the last minute is right.|2009/4/2|19:00    |60               |
|They break into someone's house.                           |2008/3/1|19:00    |60               |
{% endhighlight %}

### Table Table
As already mentioned, I envisioned my domain with two separate concepts, Programs and Episodes. This might be a mistake but for now I am not considering whether it is or is not. An episode can only exist with a Program. Season passes operate on episodes, not programs. (If anything, removing the Program concept would probably simplify things.) So I needed a way to create a bunch of programs and episodes. I also needed a good way to be able to see what I was doing.

So I came up with the following table:

{% highlight terminal %}
|Table:Create Schedule                                                          |
|start time|1:00                                                                |
|200       |aaaaBBccccccccDDDDeeeffffffffffgggggggghhhiijklmnopqrstttuvwxyzzzzzz|
|247       |aaaaBBBBccccDDDDeeeeFFFFggggHHHHiiiiJJJJkkkkLLLLmmmmNNNNooooPPPPqqqq|
|302       |aaBBccDDeeFFggHHiiJJkkLLmmNNooPPqqRRssTTuuVV                        |
|501       |____________________aaBBccDDeeFFggHHiiJJkkLLmmNNooPPqqRRssTTuuVV    |
|556       |______aaBBccDDeeFFggHHiiJJkkLLmmNNooPPqqRRssTTuuVV                  |
{% endhighlight %}

Notes:
* The first line calls a Table Fixture called Create Schedule.
* The second line defines the time of day this schedule starts, 1 AM.
* The next 5 lines describe a schedule of programs. Each line:
  * Starts with the channel number
  * Has letters for a program, e.g., aaa, BB, cccccccc.
  * The length of the name determines its duration, with 15 per letter.
  * Names are all the same letter (case included).
  * An underscore means "no program scheduled"

I came up with this right from the domain (and I doubt I'm the first person to do something like list). I was trying to visualize the program schedule to figure out how to create it quickly and it occurred to me that I could do that like I did above.

How is this any better? 
* I can create a program schedule very quickly.
* I can add episodes even easier.
* For the kinds of tests where I'm worried about overlap, it is easier to describe the expected result since it fits on a screen so nicely.

Give the above episodes, I can now create the following season passes:
* hhh on channel 200
* kkkk on channel 247
* VV on channel 302
* kk on channel 501
* ss on channel 556

Then, depending on their order, (priority) I can verify that what is scheduled is correct. For example, give the above order and assuming one recording at a time, the "to do" list should include:
* hhh on 200
* VV on 247

If I can instead record two things at the same time, then the "to do" list should include:
* hhh on 200
* kkkk on 247
* VV on 302

And that's it. If the order is reversed, then the following programs will get recorded:
* ss on channel 556
* kk on channel 501

For me, this makes it much easier to:
* Express a schedule
* Find examples that will have both conflicting and non-conflicting programs
* Easily verify the rules

This last form was harder to code but easier to write expressive tests. When working with acceptance tests, this seems like the correct trade off.

I used TDD to verify parsing of the table and then connected the table parser to the fixture and got the schedule built quickly.

----

Update as of March 2009 

----

I was visiting my good friend David Nunn in Dallas and I showed him my "fluent" or DSL-esque table and he said "ugh! that's ugly!" He looked at it and pointed out that it looked like gibberish and also pointed out that I'd need to use a fixed-point font (I didn't tell him I put in pre and tags). He was right, of course. So I improved this table to this next version:

{% highlight terminal %}
|Table:Create Schedule v2                                                 |
|   |1   |2   |3   |4   |5   |6   |7   |8   |9   |10  |11  |12  |13  |14  |
|200|aaaa|BBcc|cccc|ccDD|DDee|efff|ffff|fffg|gggg|gggh|hhii|jklm|nopq|rstt|
|247|aaaa|BBBB|cccc|DDDD|eeee|FFFF|gggg|HHHH|iiii|JJJJ|kkkk|LLLL|mmmm|NNNN|
|302|aaBB|ccDD|eeFF|ggHH|iiJJ|kkLL|mmNN|ooPP|qqRR|ssTT|uuVV|wwww|wwXX|XXXy|
|501|    |    |    |    |    |aaBB|ccDD|eeFF|ggHH|iiJJ|kkLL|mmNN|ooPP|qqRR|
|556|    |__aa|BBcc|DDee|FFgg|HHii|JJkk|LLmm|NNoo|PPqq|RRss|TTuu|VVxx|xxxx|
{% endhighlight %}

To get this to work at first, I simply converted the row into a string and parsed it using the original parser. Of course, this only works if each cell is 4 letters long (or the same length). A real parser should handle this correctly. Even so, it greatly improves the match to the metaphor.

{% include nav prev="FitNesse.Tutorials" %}
