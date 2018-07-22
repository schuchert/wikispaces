{:toc}
[[FitNesse.Tutorials|<--Back]] -or- [[FitNesse.Tutorials.2|Next Tutorial-->]]
# Introduction
This tutorial assumes some basic [[http://fitnesse.org/|FitNesse]] knowledge. If you need help installing or running [[http://fitnesse.org/|FitNesse]], please [[FitNesse.Tutorials.0|go here first]]. In this tutorial, you will use a Decision table to send data into a system and verify results returned. You will:
* Create Decision tables in FitNesse
* Make the tables execute by writing Fixtures
* Get the tests to pass by updating both the Fixture code and by creating production code
* Learn how to use variables in tables
* Learn the difference between setter columns and method call columns
* Call a constructor in a decision table
* Discover the relationship between tables, fixtures and instances of fixture classes
* Learn how to coordinate between different fixtures
* Learn how to review output from your fixture code

This tutorial is primarily about getting you over the hurtle of the mechanics of getting tests to execute using [[http://fitnesse.org/|FitNesse]]. Even so, you will see some basic design considerations play out as well.

Note, this tutorial assumes you are running [[http://fitnesse.org/|FitNesse]] on localhost at port 8080 [[http://localhost:8080]]. If you are not sure how to do that, [[FitNesse.Tutorials.0|try this tutorial]].
# Background
[[http://FitNesse.org/FitNesse.SliM.DecisionTable|FitNesse.Slim Decision Tables]] are a common way to get test data into a System Under Test. A Decision table has three parts (only the first of which is actually required):
# One Title Row - Names the fixture to execute, optionally includes constructor parameters
# One Heading Row - Names of columns, which map to either setter methods or method calls (if they end in ?)
# Zero or more Data Rows - rows of data used to either provide data into a system or data used to compare to values returned from the fixture

[[#firstDecisionTable]]
Here is an example [[http://fitnesse.org/|FitNesse]] decision table:
```
|Add Programs To Schedule                                                     |
|name      |episode                      |channel|date     |start time|minutes|
|House M.D.|House Makes Wilson Mad       |7      |5/12/2008|7:00      |60     |
|Doctor Who|The One where He Saves the UK|12     |5/17/2008|8:00      |60     |
```

The first row names the fixture. In this case, [[http://fitnesse.org/|FitNesse]] will look for a class called AddProgramsToSchedule. The second row lists the column names. [[http://fitnesse.org/|FitNesse]] will look for the following methods in AddProgramsToSchedule:
* setName(...)
* setEpisode(...)
* setChannel(...)
* setDate(...)
* setStartTime(...)
* setMinutes(...)
These methods can all take Strings or some, where there's a conversion available, other types as well. For example, **"setChannel()"** could take an int. It is also possible to define your own translations, however this tutorial does not cover that feature.

Finally, there are two data rows. Given the name of the fixture, this table's goal is to apparently add two programs to the schedule.

## Creating this table
Here are some preliminary steps to get this table created (there will be more later, this table is the skeleton of a test):
* Browse to [[http://localhost:8080]].
* Edit this page (click the **Edit** button - or, if not available, go to the following URL: [[http://localhost:8080/FrontPage?edit]]), add the following before the Release date line at the bottom (the location is arbitrary):
```
>DecisionTableExample
```
* Save your changes (click the **Save** button)
* Click on the linked question mark, which will take you to: [[http://localhost:8080/FrontPage.DecisionTableExample?edit&nonExistent=true]]
* Copy the table contents into the page replacing the !contents ... that is already there.
* Save the page (click **Save**).
* Edit the page's properties (click **Properties**).
* Set the page type to a test page (depending on the version of fitness, this is either a check-box or a radio button). Note, if a page name starts with or ends with the word test, the page type will be set to test by default.
* Save the property change (click the **Save Properties** button).

Now you can execute the page. Click on the **Test** button. The tests will fail dues to a missing fixutre. [[http://fitnesse.org/|FitNesse]] will color the first row yellow and add the message "//Could not find fixture: AddProgramsToSchedule.//". Now you must create a Fixture class and add it to the test page.

## Creating the Fixture
If you are planning on using Eclipse and working in Java, then you can get a repository from github: [[http://github.com/schuchert/fitnesse-tutorials/tree/master|fitnesse-tutorials]]. Review the instructions [[FitNesse.Tutorials.WorkingFromGitHub|here]].

Creating a fixture involves:
* Creating class.
* Making it executable:
** On the JVM, you need a .class file
** On the CLR, you need a DLL with the compiled class embedded
* Updating the classpath on your page (or hierarchically above it) to point to your executable code
* Using an import table to name the package/namespace of the class (or fully qualifying the fixture name in the table)

For full details on these steps, you can review the material [[FitNesse.Tutorials.0.Java|here if you're planning on working in Java]] or [[FitNesse.Tutorials.0.CSharp|here if you're planning on working in C#]].

Here is one such fixture (in Java) that will get this test to "pass". Since there are no assertions, this really isn't a very good test yet, but it does make it easier to get it all green.
```java
package com.om.example.dvr.fixtures;

public class AddProgramsToSchedule {
   public void setName(String name) {
   }

   public void setEpisode(String name) {
   }

   public void setChannel(int channel) {
   }

   public void setDate(String date) {
   }

   public void setStartTime(String startTime) {
   }

   public void setMinutes(int minutes) {
   }
}
```

There are still a few things you need to do to make the page use this class:
* Inform [[http://fitnesse.org/|FitNesse]] you want to use Slim versus fit:
```
!define TEST_SYSTEM {slim}
```
* Inform [[http://fitnesse.org/|FitNesse]] where to look for your class files (update this directory as appropriate):
```
!path /Users/schuchert/src/fitnesse-tutorials/DVR/bin
```
* Inform [[http://fitnesse.org/|FitNesse]] the package/namespace in which to look:
```
|import|
|com.om.example.dvr.fixtures|
```

Here's the updated page put all together(again, update the directory in the !path statement accordingly):
```
!define TEST_SYSTEM {slim}

!path /Users/schuchert/src/fitnesse-tutorials/DVR/bin

|import|
|com.om.example.dvr.fixtures|

|Add Programs To Schedule                                                     |
|name      |episode                      |channel|date     |start time|minutes|
|House M.D.|House Makes Wilson Mad       |7      |5/12/2008|7:00      |60     |
|Doctor Who|The One where He Saves the UK|12     |5/17/2008|8:00      |60     |
```

**//Note//**: You might need to add the following line as well (e.g., if you built from source):
```
!path fitnesse.jar
```

Run the test and verify that the page passes successfully.

While you are at it, you have your original test page from the first tutorial. You can verify it still passes as well.

# Add Assertions
Right now, this table does not assert any results, which means the underlying fixture can do the same, which is not much. Let's extend this just a bit to have the table actually perform validation:
```
|Add Programs To Schedule                                                              |
|name      |episode                      |channel|date     |start time|minutes|created?|
|House M.D.|House Makes Wilson Mad       |7      |5/12/2008|7:00      |60     |true    |
|Doctor Who|The One where He Saves the UK|12     |5/17/2008|8:00      |60     |true    |
```

Try running this page and FitNesse will complain that it cannot find the **created[0]** method. The name is followed by the number of expected parameters, which is 0 in our case. Here is just such a method you can add to your "AddProgramsToSchedule" fixture:
```java
   public boolean created() {
      return true;
   }
```

Update your table and add the missing method. Verify that the test still passes. You'll notice there are three successful assertions.

## What is this doing?
Adding a column with a ? at the end of its name requires that the fixture have a method with a matching name (remove spaces, use camel casing) with some return value. [[http://fitnesse.org/|FitNesse]] will execute that method and compare its return value to the value in the cell, marking it green or red for matching/not matching. If you happen to have a cell with no value, the return value will be displayed in the cell with a gray coloring. 

# Make the Assertion have some Value
There's nothing in the flow of this table that would cause a problem. However, what if we want to make sure adding a program on top of another is not possible? We can do that by adding one more row to the bottom of the table::
```
|Conflicts |Should not be added          |7      |5/12/2008|7:00      |30     |false   |
```

This demonstrates a conflict because the third program is on the same channel, date, time as the first.

This is a non-typical use of the Decision table, but it certainly is legitimate. Assuming the slot is already occupied (even partially), this item should not be added to the schedule.

Run it, you should have one failed assertion. Your code will need some way to know that one slot is already used. Here's one way to accomplish that:
## Update AddProgramsToSchedule.java
```java
package com.om.example.dvr.fixtures;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import com.om.example.domain.TimeSlot;

public class AddProgramsToSchedule {
   private static SimpleDateFormat dateFormat = new SimpleDateFormat("M/d/yyyy|h:mm");
   private List<TimeSlot> scheduledTimeSlots = new LinkedList<TimeSlot>();
   private int channel;
   private String date;
   private String startTime;
   private int minutes;

   public void setName(String name) {
   }

   public void setEpisode(String name) {
   }

   public void setChannel(int channel) {
      this.channel = channel;
   }

   public void setDate(String date) {
      this.date = date;
   }

   public void setStartTime(String startTime) {
      this.startTime = startTime;
   }

   public void setMinutes(int minutes) {
      this.minutes = minutes;
   }

   public boolean created() {
      TimeSlot timeSlot = new TimeSlot(channel, buildStartDateTime(), minutes);

      if (conflictsWithOtherTimeSlots(timeSlot))
         return false;

      scheduledTimeSlots.add(timeSlot);
      return true;
   }

   private boolean conflictsWithOtherTimeSlots(TimeSlot timeSlot) {
      for (TimeSlot current : scheduledTimeSlots)
         if (current.conflictsWith(timeSlot))
            return true;

      return false;
   }

   private Date buildStartDateTime() {
      try {
         String dateTime = String.format("%s|%s", date, startTime);
         return dateFormat.parse(dateTime);
      } catch (ParseException e) {
         throw new RuntimeException("Unable to parse date/time", e);
      }
   }
}
```

## Create new Class: TimeSlot.java
Notice, this class is in a different package (com.om.example.dvr.domain).

```java
package com.om.example.dvr.domain;

import java.util.Date;

public class TimeSlot {

   public final int channel;
   public final Date startDateTime;
   public final int durationInMinutes;

   public TimeSlot(int channel, Date startDateTime, int durationInMinutes) {
      this.channel = channel;
      this.startDateTime = startDateTime;
      this.durationInMinutes = durationInMinutes;
   }

   public boolean conflictsWith(TimeSlot other) {
      if (channel == other.channel && startDateTime.equals(other.startDateTime))
         return true;
      return false;
   }
}
```

Make these changes to your code and see that your tests now pass. Now your fixture is recording the time slots in use. The implementation of "TimeSlot.conflictsWith" may seem inadequate, but it is complete for what we are testing, so in fact is it fine.

Another issue is that the "AddProgramsToSchedule" class is starting to get somewhat big. Fixtures are enabling technology and as such should primarily handle data translation and then delegate to production code.

Along those lines, "buildStartDateTime" also exhibits feature envy. The "Schedule" is currently just a "List<TimeSlot>", but it might warrant its own class. While this tutorial's focus is [[http://fitnesse.org/|FitNesse]], this fixture contains business logic. You do not want any business logic in your fixture code, so that's the next thing to fix.

To fix this, we can introduce a new class and perform some basic re-factoring:
**Schedule.java**
```java
package com.om.example.dvr.domain;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class Schedule {
   private List<TimeSlot> scheduledTimeSlots = new LinkedList<TimeSlot>();

   public void addProgram(String programName, String episodeName, int channel,
         Date startDateTime, int lengthInMinutes) {

      TimeSlot timeSlot = new TimeSlot(channel, startDateTime, lengthInMinutes);

      if (conflictsWithOtherTimeSlots(timeSlot))
         throw new ConflictingProgramException();

      scheduledTimeSlots.add(timeSlot);
   }

   private boolean conflictsWithOtherTimeSlots(TimeSlot timeSlot) {
      for (TimeSlot current : scheduledTimeSlots)
         if (current.conflictsWith(timeSlot))
            return true;

      return false;
   }
}
```

**ConflictingProgramException.java**
```java
package com.om.example.dvr.domain;

public class ConflictingProgramException extends RuntimeException {
   private static final long serialVersionUID = 1L;
}
```

**Updated: AddProgramsToSchedule.java**
```java
package com.om.example.dvr.fixtures;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.om.example.dvr.domain.ConflictingProgramException;
import com.om.example.dvr.domain.Schedule;

public class AddProgramsToSchedule {
   static SimpleDateFormat dateFormat = new SimpleDateFormat("M/d/yyyy|h:mm");
   private Schedule schedule = new Schedule();
   private int channel;
   private String date;
   private String startTime;
   private int minutes;
   private String programName;
   private String episodeName;

   public void setName(String name) {
      this.programName = name;
   }

   public void setEpisode(String name) {
      this.episodeName = name;
   }

   public void setChannel(int channel) {
      this.channel = channel;
   }

   public void setDate(String date) {
      this.date = date;
   }

   public void setStartTime(String startTime) {
      this.startTime = startTime;
   }

   public void setMinutes(int minutes) {
      this.minutes = minutes;
   }

   public boolean created() {
      try {
         schedule.addProgram(programName, episodeName, channel, buildStartDateTime(),
               minutes);
      } catch (ConflictingProgramException e) {
         return false;
      }
      return true;
   }

   private Date buildStartDateTime() {
      try {
         String dateTime = String.format("%s|%s", date, startTime);
         return dateFormat.parse(dateTime);
      } catch (ParseException e) {
         throw new RuntimeException("Unable to parse date/time", e);
      }
   }
}
```

This split makes more sense:
* The determination of whether there is or is not a conflict is now in a class that is part of the production code.
* The handling of parsing input strings is in the fixture.

This really was just an Extract class refactoring or wrapping a collection. Wrapping collections is generally a good idea. For more details, see the sidebar, Wrapping Collections.

Before moving on, make sure your test passes. Assuming it does, congratulations on a successful refactoring.

[[include page="sidebar_start"]] <span class="sidebar_title">Wrapping Collections</span>
When dealing with a language-provided collection, you should wrap it by default and only not wrap it if it makes sense. This might seem controversial, but in my experience the extra overhead of wrapping the collection provides a place for functionality that is otherwise heavily duplicated. For example:
* Only adding something if it does not conflict in some way with existing members in the collection.
* Doing some kind of work over the entire collection.
* Responding in a domain-specific way to empty/full collections.
[[include page="sidebar_end"]]
# Deleting Something By Key
We should be able to add a program, remove it and then add another at the same time slot. Here's just such a test and it uses something you might have noticed in the first tutorial:
```
|Add Programs To Schedule                                                                      |
|name      |episode                      |channel|date     |start time|minutes|created?|lastId?|
|House M.D.|House Makes Wilson Mad       |7      |5/12/2008|7:00      |60     |true    |$p=    |
|Doctor Who|The One where He Saves the UK|12     |5/17/2008|8:00      |60     |true    |       |
|Conflicts |Should not be added          |7      |5/12/2008|7:00      |30     |false   |       |
```

This introduces another column, **lastId?**. The implementation, which is below, simply returns the last id stored in the method **created()**. The definition is simply: (<program name>:<channel>), e.g., the id's above are:
* (House M.D.:7)
* (Doctor Who:12)

Update your table with the new table above and try running this page and FitNesse will complain that it cannot find the **lastId[0]** method. The name is followed by the number of expected parameters, which is 0 in our case. Here is just such a method you can add to your "AddProgramsToSchedule" fixture:
```java
public String lastId() {
   return lastId;
}

```
Add the missing method. Verify that the test still passes. You'll notice there are three unsuccessful assertions for "lastId".


As for the third id, you'll see that in a minute. To get this to run, you'll need to make several changes:
## Add: Program.java
```java
package com.om.example.dvr.domain;

public class Program {

   public final String programName;
   public final String episodeName;
   public final TimeSlot timeSlot;

   public Program(String programName, String episodeName, TimeSlot timeSlot) {
      this.programName = programName;
      this.episodeName = episodeName;
      this.timeSlot = timeSlot;
   }

   public String getId() {
      return String.format("(%s:%d)", programName, timeSlot.channel);
   }
}
```

## Update: Schedule.java
```java
package com.om.example.dvr.domain;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class Schedule {
   private List<Program> scheduledPrograms = new LinkedList<Program>();

   public Program addProgram(String programName, String episodeName, int channel,
         Date startDateTime, int lengthInMinutes) {

      TimeSlot timeSlot = new TimeSlot(channel, startDateTime, lengthInMinutes);

      if (conflictsWithOtherTimeSlots(timeSlot))
         throw new ConflictingProgramException();

      Program program = new Program(programName, episodeName, timeSlot);
      scheduledPrograms.add(program);
      return program;
   }

   private boolean conflictsWithOtherTimeSlots(TimeSlot timeSlot) {
      for (Program current : scheduledPrograms)
         if (current.timeSlot.conflictsWith(timeSlot))
            return true;

      return false;
   }
}
```

## Update: AddProgramsToSchedule.java
```java
package com.om.example.DVR.fixture;

import java.util.Calendar;
import java.util.Date;

import com.om.example.dvr.domain.ConflictingProgramException;
import com.om.example.dvr.domain.Program;
import com.om.example.dvr.domain.Schedule;

public class AddProgramsToSchedule {
   // snip
   private String lastId;

   // snip

   public boolean created() {
      try {
         Program p = schedule.addProgram(programName, episodeName, channel,
               buildStartDateTime(), minutes);
         lastId = p.getId();
      } catch (ConflictingProgramException e) {
         return false;
      }
      return true;
   }

   public String lastId() {
      return lastId;
   }
   // snip
}
```

Once you've made these updates, execute the table. You should notice three values in the "lastId?" column:
* $p<-[(House M.D.:7)] - the variable p was assigned the value (House M.D.:7)
* The second and third cells contain (Doctor Who:12) in gray.

In all cases:
* the value returned is displayed,
* the cells are empty, so [[http://fitnesse.org/|FitNesse]] just displays the results.

In the first case, there is a variable assignment, which [[http://fitnesse.org/|FitNesse]] dutifully assigned.

This variable is available for the rest of the page. However, before we get to that we do have a problem. The lastId? is set upon a successful program add, but it is not reset if the program is not added. Here is a quick fix to improve that:
**AddProgramsToScheule.created**
```java
   public boolean created() {
      try {
         Program p = schedule.addProgram(programName, episodeName, channel,
               buildStartDateTime(), minutes);
         lastId = p.getId();
      } catch (ConflictingProgramException e) {
         lastId = "n/a";
         return false;
      }
      return true;
   }
```

Make the update and then you'll notice the third data row of the lastId? column is now n/a (in gray).

## Finally, Delete by Key
Time to add another table and fixture:
```
|Remove Program By Id|$p|

|Add Programs To Schedule                                                 |
|name   |episode            |channel|date     |start time|minutes|created?|
|Ok now |No longer conflicts|7      |5/12/2008|7:00      |30     |true    |
```

Just add this to the bottom of your page. You'll have to create a new fixture. Here is that code:
```java
package com.om.example.dvr.fixtures;

public class RemoveProgramById {
   public RemoveProgramById(String id) {
   }
}
```

This fixture does not do anything yet, but even so there are several things worthy of note:
* You can provide parameters after the name of a fixture.
* A fixture's constructor can take parameters.
* $p is passed in as the first parameter to the constructor.
* The parameters are matched by order, which is probably what you are used to.

The second decision table using the AddProgramsToSchedule fixture on the page should verify that we can add a program to that time slot that was previously occupied.

What to do:
* Update the page to include these two additional tables.
* Create the RemoveProgramById fixture
* Run you tests.

When you run your tests, do you notice a problem? The tests pass! Maybe you expected the second attempt to add would fail, but it appears to work. This illustrates something [[http://fitnesse.org/|FitNesse]] does; each table causes a new instance of the fixture to be created, even on the same page. How can you tell this? If you want to verify it, you could simply add a print statement to the constructor and view the output. I've already done that. Here's the print statement:
**Example: Added to AddProgramsToSchedule fixture**
```java
   private static int numberCreated = 0;

   public AddProgramsToSchedule() {
      System.out.printf("Creating ProgramsToSchedule #%d\n", ++numberCreated);
   }
```

Adding this and then executing the tests, [[http://fitnesse.org/|FitNesse]] will display a yellow triangle with the label "Output Captured". Clicking on that triangle, you'll see the output captured during test execution::
```
Standard Output:

Creating ProgramsToSchedule #1
Creating ProgramsToSchedule #2
```

So what is the problem? The fixture holds the schedule. Each fixture has its own schedule. We need the schedule to be a single instance. You have several options:
* Simply make Schedule static.
* Make the Schedule a singleton (I mention this, but I'm not a fan of the Singleton pattern).
* Use some kind of IoC container like Spring and look up the schedule there.
* ...

Ultimately, how you should do it depends on your system. If your system will eventually need objects like this configured, wired and passed around, then it might make sense to introduce Spring or maybe even a hand-rolled IoC container (a factory of some kind). For our purposes, simply making the schedule static in AddProgramsToSchedule will work effectively. So do that and then see the test fail (note, I've removed the constructor and static variable **numberCreated** in my version to get rid of output making its way into my test execution).

[[include page="sidebar_start"]] <span class="sidebar_title">Tests Should Not Produce Output</span>
Your acceptance tests (and unit tests) should not produce output. Why? Because you've written them to have assertions. Those assertions are the only thing that define success or failure. If you find the need to produce output, are you also going to verify that output? If so, then turn the verification of the output into an assertion. If not, then you're adding noise to the test execution.

This might be OK while you are working on your machine but don't check this cruft in. What I've seen happen, repeatedly, is people add output to verify their work (that's fine in the short term, maybe, but it represents a lack of trust in either your own abilities or the test system), and then other people notice the output and then the output grows. Soon, it becomes the norm.

On one project, I removed the unnecessary output (random print statements that people were too lazy to remove) and it decreased test execution time by 30%. Imagine that, 30%, or 4.5 minutes (the tests were too slow). On average, people were running tests at least 2 times a day (I'd run them 6 - 10 times a day). Even so, at one point we had 20 developers. 20 * 2 * 4.5 = 3 hours lost per day for the team. 30 hours per week lost. 

To quote Jerry Weinberg:
> Nothing + Nothing + Nothing eventually equals something.

Leaving output in tests, unit or acceptance tests, is lazy. You can do better.
[[include page="sidebar_end"]]

Now that the test is failing, we need a way to get access to the schedule between fixtures. For now, adding a getSchedule() method on the AddProgramsToSchedule fixture is adequate:
```java
public class AddProgramsToSchedule {
   private static Schedule schedule = new Schedule();

   public static Schedule getSchedule() {
      return schedule;
   }

   // snip
}
```

Now that we have a single Schedule and access to it, we can simply update the constructor in RemoveProgramById to call the code:
```java
package com.om.example.dvr.fixtures;

public class RemoveProgramById {
   public RemoveProgramById(String id) {
      AddProgramsToSchedule.getSchedule().removeProgramById(id);
   }
}
```

Of course, this requires we add a new method to Schedule:
```java
import java.util.Iterator;

   public void removeProgramById(String programIdToRemove) {
      for (Iterator<Program> iter = scheduledPrograms.iterator(); iter.hasNext();)
         if (iter.next().getId().equals(programIdToRemove)) {
            iter.remove();
            break;
         }
   }
```

Run your tests and you should see all tests green.

## Not Doing the Work in the Constructor
If for some reason, you do not like to do the actual work done in the constructor, you can optionally write the table as follows:
```
|Remove Program By Id|
|id                  |
|$p                  |
```

Then you'll need to update your RemoveProgramByIdFixture as follows:
```java
package com.om.example.dvr.fixtures;

public class RemoveProgramById {
   private String id;

   public RemoveProgramById() {
   }

   public RemoveProgramById(String id) {
      this.id = id;
      execute();
   }

   public void setId(String id) {
      this.id = id;
   }

   public void execute() {
      AddProgramsToSchedule.getSchedule().removeProgramById(id);
   }
}
```
Note that this Fixture, as written, supports both styles. The real reason I wanted to include this last example was to demonstrate how you can cause a row of a decision table to be executed without include a column with a ? in its name. You add a method called **execute()**. [[http://fitnesse.org/|FitNesse]] will call that method, if it exists, after calling the last setter (the columns without ? in their name).

# Conclusion and Summary
Congratulations, you've completed this tutorial.

This tutorial emphasizes Decision tables. There is still more to you can do with decision tables, but this covers most of what you'll need to know to effectively use decision tables. If you go to your fitness installation and go to FitNesse.SliM.DecisionTable ([[http://localhost:8080/FitNesse.SliM.DecisionTable]]), you can read the [[http://fitnesse.org/FitNesse.SliM.DecisionTable|FitNesse]]-provided documentation.

However, you've learned several things in this tutorial:
* How to tell [[http://fitnesse.org/|FitNesse]] to use Slim instead of fit (its default)
* How to import packages (works for namespaces as well)
* How to create a decision table
* You've learned that a decision table has three parts:
** First row names the fixture.
** Second row names columns.
** Third and subsequent rows provide data.
* How to make the tables execute by writing Fixtures
* How to get the tests to pass by updating both the Fixture code and by creating production code
* How to use variables in Decision tables (both writing and reading)
* Learned the difference between setter columns and method call columns
** A column with just text in its name will map to a public method called setX, where X is the name of the column.
** A column with a ? at the end of its name is a method call, which causes [[http://fitnesse.org/|FitNesse]] to invoke a method and use the returned value for possible verification.
* Learned how to call a constructor in a decision table
* Discovered the relationship between tables, fixtures and instances of fixture classes
* Learn how to coordinate between different fixtures
* Learn how to review output from your fixture code
* Learned that you can add an execute() method, which [[http://fitnesse.org/|FitNesse]] will call for you after calling the setters.
* Learned that a fixture is just a plane old class, it does not inherit from anything.
* Learned that the methods to be called must be public.
* Learned that fixtures should not have any production logic in them.
* Learned that if you put output in your code, [[http://fitnesse.org/|FitNesse]] will capture it and you'll be able to see it
** Note, while you can debug this, your fixtures should be so simple that this is seldom necessary. If you find yourself doing this often, consider simplifying your fixtures. If that's not possible, write unit tests for your complex fixture code.
* Learned that each of the data rows in your fixture is executed in order, top-to-bottom.

After working with decision tables, the next tutorial which makes sense is [[FitNesse.Tutorials.2|this one on query tables]].
[[FitNesse.Tutorials|<--back]] -or- [[FitNesse.Tutorials.2|Next Tutorial-->]]