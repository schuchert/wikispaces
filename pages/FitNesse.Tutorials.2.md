---
title: FitNesse.Tutorials.2
---
{:toc}
[[FitNesse.Tutorials|<--Back]] or [[FitNesse.Tutorials.ScriptTables|Next Tutorial--->]]
# Introduction
A Query table is a means of performing a single query and verifying the results. A typical test might use [[http://fitnesse.org/FitNesse.UserGuide.SliM.DecisionTable|Slim Decision Tables]] to insert a large data set and then Query tables to verify that the correct sub-set of the data is returned from the query.

This tutorial begins with a basic introduction of Query tables, but it assumes a basic understanding of Decision tables. If you are not familiar with Decision Tables, work through [[FitNesse.Tutorials.1|this tutorial first]]. Along the way, we'll look at what it takes to produce query results manually and then review a small tool available from [[http://github.com/schuchert/queryresultbuilder/tree/master|github]] to produce these results automatically.

As a final note, this tutorial picks up where [[FitNesse.Tutorials.1|this tutorial]] left off. However, you can start with these source files using the tag FitNesse.Tutorials.2.Start, see [[FitNesse.Tutorials.WorkingFromGitHub|here]] for details:

# Beginning
Consider the following user story:
>> As a dvr user, I want to create season passes so that I can record every episode of a particular program on a channel, no matter when it appears.

To test this functionality, it looks like we need to check several things, here are a few of those things:
* A program schedule populated with programs.
* The schedule should have some the same program on different channels
* The schedule should have some duplicate episodes as well.

We're going to grow our way into this. Before we can do that, we need to create a program schedule. You've already solved this problem in the [[FitNesse.Tutorials.2|previous tutorial]](right?). So all we need to do is use a previous fixture and create original programming. Rather than try to create real programs and episodes, this example just creates a large amount of data and it also includes the configuration stuff:
```
|Add Programs To Schedule                         |
|name|episode|channel|date     |start time|minutes|
|P1  |E1     |7      |5/12/2008|7:00      |60     |
|P1  |E1     |7      |5/12/2008|10:00     |60     |
|P1  |E2     |7      |5/13/2008|7:00      |60     |
|P1  |E3     |7      |5/14/2008|7:00      |60     |
|P1  |E4     |7      |5/15/2008|7:00      |60     |
|P1  |E5     |7      |5/16/2008|7:00      |60     |
|P1  |E6     |7      |5/17/2008|7:00      |60     |
|P2  |E1     |5      |5/12/2008|7:00      |60     |
|P2  |E2     |5      |5/13/2008|7:00      |60     |
|P2  |E3     |5      |5/14/2008|7:00      |60     |
|P2  |E4     |5      |5/15/2008|7:00      |60     |
|P2  |E5     |5      |5/16/2008|7:00      |60     |
|P2  |E6     |5      |5/17/2008|7:00      |60     |
|P1  |E1     |9      |5/17/2008|7:00      |60     |
```

The goal of this table is to create several entires in the program schedule. However, the Fixture as written from the [[FitNesse.Tutorials.2|previous tutorial]] performs the actual creation in the **created()** method. We have a few options:
* Just add the created? column with blank cells. This will get the record created and let us know for sure everything worked.
* Add an execute method to make the creation happen without having to add the column.
* Add the created? column with true values. This will verify that your data set is not in error.

There are various forces driving this decision. For example, what happens if you accidentally have cross-test chatter and a previous test causes problems with this test data? If you do not indicate the problem as it happens (fast fail), then it might be unintuitive just what problem is causing the test to fail.

Also consider this, AddProgramsToSchedule was created early in this project. Fixtures will get created, mature and sometimes even disappear. It might be worth making this fixture a little more flexible. A simple fix would be to:
* Rename created() to execute()
* Store a boolean indicating whether last creation was successful
* Create new created() method that returns a boolean

For this table to actually do anything, you must make some decision on how to proceed. For the purpose of moving this tutorial forward, I'm going with the option just described. Here are the changes to the fixture:
```java
public class AddProgramsToSchedule {
   // snip
   private boolean lastCreationSuccessful;

   // snip
   public void execute() {
      try {
         Program p = schedule.addProgram(programName, episodeName, channel,
               buildStartDateTime(), minutes);
         lastId = p.getId();
         lastCreationSuccessful = true;
      } catch (ConflictingProgramException e) {
         lastCreationSuccessful = false;
      }
   }

   public boolean created() {
      return lastCreationSuccessful;
   }

   public String lastId() {
      if (lastCreationSuccessful)
         return lastId;
      return "n/a";
   }
}
```

Since you've just changed the fixture, you should go back to your DecisionTableExample page and verify that the test still passes. In fact, you'll be making additional changes to this fixture as this tutorial proceeds. It might be a good idea to make it convenient to run all of the tests at the same time. Before moving forward, however, make sure the DecisionTableExample page still successfully passes.

## Introducing a Test Suite
A test suite is simply a page above other pages that is set to be a suite. FitNesse will look at all of its children and execute the pages under it that are set to test pages. To do this, you'll need to create the suite and move existing pages under it:
* Go to the [[http://localhost:8080/FrontPage|FrontPage]].
* Edit the page and add the following near the bottom:
```
>DigitalVideoRecorderExamples
```
* Save your changes
* Click on the [?] hyperlink
* Create the page and simply accept the !contents ...
* Save the page
* Go back to the [[http://localhost:8080/FrontPage|FrontPage]]
* Click on your DecisionTableExample
* Click the **Refactor** Button
* Under the **Move** section enter the following: FrontPage.DigitalVideoRecorderExamples
* Click **Move Page**
* FitNesse will display the new page. If you look at the top, you can see the page hierarchy on the first line. Click on the DigitalVideoRecorderExamples link.
* You should now see your first table moved under this page.
* Now click on the **Properties** button
* Convert this page into a **Suite**
* Click on **Save Properties**
* Now you should be able to execute this suite. Click the **Suite** button and verify that your test passes.
* Go back to the root page, click on the DigitalVideoRecorder page.
* Click **Refactor**
* Under the **Rename** section, enter FirstExample and click **Rename Page**
* Click **Refactor**
* Now, under the **Move** section, enter FrontPage.DigitalVideoRecorderExamples and click **Move**
* Go back to the DigitalVideoRecorderExamples test suite and click suite to make sure both pages pass.
* Finally, edit the Front page by removing the following lines:
```
>DigitalVideoRecorder
>DecisionTableExample
```

## Removing Future Duplication
The definition of the TEST_SYSTEM, !path and import statement will be the same for the pages we create during these tutorials. Right now it is duplicated across FirstExample and DecisionTableExample. We can put the TEST_SYSTEM and !path in the DigitivalVideoRecorderExamples and it will be inherited by FirstExample, DecisionTableExample and any other sub-pages.


We can also create a SetUp page as a sibling of DecisionTableExample and its contents will be part of the children of its parent page (its siblings)

Update your DigitalVideoRecorderExamples page to define the test system and path:
* Set the page to equal:
```
!contents -R2 -g -p -f -h

!define TEST_SYSTEM {slim}

!path fitnesse.jar
!path /Users/schuchert/src/fitnesse-tutorials/DVR/bin

!define COLLAPSE_SETUP {true}
!define COLLAPSE_TEARDOWN {true}
```
* Remove the !define and !path from your DecisionTableExample and FirstExmaple as it will inherit this information from its parent. Also remove the !define COLLAPSE_* lines from FirstExample.

FitNesse import tables are not implicitly inherited. The import statements must actually execute on that page. You can do this in one of three ways:
* Add it to each page
* Create a page and !include it
* Put the import table in a SetUp page.

We'll use a SetUp page.

### Creating a SetUp Page
There are many ways to create pages in FitNesse. You can:
* directly type in the URL
* you can click a __[?]__ link
* you can click on helper links on some pages.

We want to create a SetUp page that will be available for all pages under DigitalVideoRecorder, so:
* Go that page
* At the bottom, there will be a __[?]__ next to the word SetUp. Click it. (If for some reason there is no such page, simply enter [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.SetUp]]
* Set the contents of the SetUp page to:
```
|import|
|com.om.example.dvr.fixtures|
```
* Go back to DecisionTableExample and FirstExample and remove the import table from each page.
* Verify that your suite still passes.

## Summary of Page Hierarchy
* You created a top level page, [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples]] and made it a suite with some common configuration information.
* You refactored(moved) DecisionTableExample under that page.
* You removed the common configuration from DecisionTableExample
* You put the import statement in a SetUp page as a sibling of DecisionTableExample

Now as you create new test pages, put them under DigitalVideoRecorderExample and they will automatically pick up:
* TEST_SYSTEM
* !path
* import table - via a SetUp page (this is not exactly correct, but you'll see what really happens below).

# Back to a New Test
Near the top of this tutorial, there was a table with a lot of data. You have not yet created that page. Now we have a place to create that page. So you do not have to scroll back, here's that table again:
```
|Add Programs To Schedule                         |
|name|episode|channel|date     |start time|minutes|
|P1  |E1     |7      |5/12/2008|7:00      |60     |
|P1  |E1     |7      |5/12/2008|10:00     |60     |
|P1  |E2     |7      |5/13/2008|7:00      |60     |
|P1  |E3     |7      |5/14/2008|7:00      |60     |
|P1  |E4     |7      |5/15/2008|7:00      |60     |
|P1  |E5     |7      |5/16/2008|7:00      |60     |
|P1  |E6     |7      |5/17/2008|7:00      |60     |
|P2  |E1     |5      |5/12/2008|7:00      |60     |
|P2  |E2     |5      |5/13/2008|7:00      |60     |
|P2  |E3     |5      |5/14/2008|7:00      |60     |
|P2  |E4     |5      |5/15/2008|7:00      |60     |
|P2  |E5     |5      |5/16/2008|7:00      |60     |
|P2  |E6     |5      |5/17/2008|7:00      |60     |
|P1  |E1     |9      |5/17/2008|7:00      |60     |
```

Create this page:
* Go to the URL: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.QueryTableExample]].
* Remove the !contents and copy the table above to the page
* Save your changes.
* Notice that the SetUp page is not there? The **Test** button is also missing. Turn this page into a test page.
* You should now see the setup and the **Test** button. Click **Test** to make sure this page executes

Now we need to create a season pass. That's a new table and fixture. Here's a table:
```
|Create Season Pass For|P1|9|
|id of program scheduled?   |
|$ID=                       |
```

This table's goal is to send a message to the production code to create a season pass for the program named p1 on channel 9. When this happens, I want to have available the ID of the program found to use later. The first row provides the name and constructor arguments. The next row indicates calling a method called idOfProgramScheduled(), whose return will provide that information, which [[http://fitnesse.org|FitNesse]] will then assign to the symbol ID.

Now, when this happens, what do we expect for results? I could provide a description in text of my expectations, but better yet, I'll express it as an expected result:
```
|query:Episodes In To Do List|$ID                |
|episodeName                 |date     |startTime|
|E1                          |5/17/2008|7:00     |
```

This is a simple expected result. I could have chosen p1 on channel 7, which we'll do next, but it involves much more logic. This first test will get the basic infrastructure in place. We'll then take a diversion to using a utility to help generate results, then we'll work on a more difficult case.

Add the previous two tables to your existing page. If you execute the test, you'll notice that the bottom two tables fail.

## Create Missing Fixtures
Round 1 is simply getting a fixture that will make this test pass. To do this, the fixture will hard-code the results. Why do I do this? The structure that needs to be returned is complex enough that just looking at it first is enough to consider.

Execute the test with these two new tables. You'll find you need to create two fixtures:
**CreateSeasonPassFor.java**
```java
package com.om.example.dvr.fixtures;

public class CreateSeasonPassFor {
   public CreateSeasonPassFor(String programName, int channel) {
   }

   public String idOfProgramScheduled() {
      return "n/a";
   }
}
```

**EpisodesInToDoList.java**
```java
package com.om.example.dvr.fixtures;

import java.util.Collections;
import java.util.List;

public class EpisodesInToDoList {
   public EpisodesInToDoList(String programId) {
   }

   public List<Object> query() {
      return Collections.emptyList();
   }
}
```

Create these two fixtures and execute the test. While it is not passing, this is a good start. Next, we'll actually update one fixture to get the production test passing:
**EpisodesInToDoList.java**
```java
package com.om.example.dvr.fixtures;

import java.util.LinkedList;
import java.util.List;

public class EpisodesInToDoList {
   public EpisodesInToDoList(String programId) {
   }

   private List<Object> list(Object... objs) {
      LinkedList<Object> result = new LinkedList<Object>();

      for (Object current : objs)
         result.add(current);

      return result;
   }

   public List<Object> query() {
      return
         list(
            list(
               list("episodeName", "E1"),
               list("date",        "5/17/2008"),
               list("startTime",   "7:00")
            )
         );
   }
}
```

Update your fixture and verify that your your test page passes all assertions.

## What is this doing?
A key design element of Slim is simplicity at the protocol level. Fit, the original text executor, was written as a complete solution. It takes in (among other things) HTML tables, executes them, then returns HTML tables. Slim takes in lists, executes results and then returns lists. All formatting is done by FitNesse. This makes Slim smaller and therefore easier to maintain and port than Fit.

A side effect of this smaller system boundary for Slim results in a somewhat low-level expected return from the Query method. The structure of the output is a three-tiered list:
* Inner-most list contains the information for one field. It's a list of size 2, first element is the name of the field, the second element is the value of the field.
* Middle-most list contains the fields within a give object. So an object with three fields (as in this example) contains three elements. The order is not important.
* Outer-most list represents the zero to many objects returned from a single query method.

While this is a generic result, it is also a bit difficult to build. This example makes it easy because the result is hard-coded. But notice that you'd have to format the date and time information to match the expectations of the query table.

It will get easier to generate these results. However, to get there will require several steps.

## Switch to Unit Testing
This next step requires a lot of work. We want to generate correct results, which we then feed back to Fixture. We could attempt to simply drive this from FitNesse, and I've done it successfully. However, the amount of time between tests passing is too long and therefore too risky. So these next steps move from Story Test writing into Unit Test writing.

Here's what we need to have happen:
* When we create a season pass, all of the related episodes end up in a "to do" list somewhere.
* Build a correct result object

In the two types of DVR's I've owned, there's been something called the "Season Pass Manager." So this is where we can start:
**SeasonPassManagerTest.java**
```java
package com.om.example.dvr.domain;

import static org.junit.Assert.assertEquals;

import java.util.Calendar;
import java.util.Date;

import org.junit.Before;
import org.junit.Test;

public class SeasonPassManagerTest {
   private SeasonPassManager seasonPassManager;
   private Schedule schedule;

   private Date createDate(int year, int month, int day, int hour, int min) {
      Calendar calendar = Calendar.getInstance();
      calendar.clear();
      calendar.set(Calendar.YEAR, year);
      calendar.set(Calendar.MONTH, month);
      calendar.set(Calendar.DAY_OF_MONTH, day);
      calendar.set(Calendar.HOUR, hour);
      calendar.set(Calendar.MINUTE, min);

      return calendar.getTime();
   }

   @Before
   public void init() {
      schedule = new Schedule();
      schedule.addProgram("p1", "e1", 7, createDate(2008, 4, 5, 7, 0), 60);
      schedule.addProgram("p2", "e2", 7, createDate(2008, 4, 5, 8, 0), 60);
      seasonPassManager = new SeasonPassManager(schedule);
   }

   @Test
   public void AssertNewSeasonPassManagerHasEmptyToDoList() {
      assertEquals(0, seasonPassManager.sizeOfToDoList());
   }

   @Test
   public void schduleProgramWithOneEpisodeToDoListIs1() {
      seasonPassManager.createNewSeasonPass("p1", 7);
      assertEquals(1, seasonPassManager.sizeOfToDoList());
   }
}
```

**SeasonPassManager.java**
```java
package com.om.example.dvr.domain;

import java.util.Collections;
import java.util.List;

public class SeasonPassManager {
   private final Schedule schedule;
   private List<Program> toDoList = Collections.emptyList();

   public SeasonPassManager(Schedule schedule) {
      this.schedule = schedule;
   }

   public int sizeOfToDoList() {
      return toDoList.size();
   }

   public void createNewSeasonPass(String programName, int channel) {
      toDoList = schedule.findProgramsNamedOn(programName, channel);
   }
}
```

**Update: Schedule.java**
```java
   public List<Program> findProgramsNamedOn(String programName, int channel) {
      List<Program> result = new LinkedList<Program>();

      for(Program program : scheduledPrograms)
           if(program.timeSlot.channel == channel && program.programName.equals(programName))
              result.add(program);

      return result;
   }
```

Make these updates and verify that your two unit tests pass.

### Wiring It Up
That was just enough to get the unit test passing. It may not seem complete, but there are no more story-based assertions that require more work, so the solution will be adequate. However, we next need to hook up the results in the fixture. That is, we need to replace:
```java
   private List<Object> list(Object... objs) {
      LinkedList<Object> result = new LinkedList<Object>();

      for (Object current : objs)
         result.add(current);

      return result;
   }

   public List<Object> query() {
      return
         list(
            list(
               list("episodeName", "E1"),
               list("date", "5/17/2008"),
               list("startTime", "7:00")
            )
         );
   }
```

We need to replace that with code that will turn an object or list into a list into a list of list of list of strings. There is a utility available that can help: [[http://github.com/schuchert/queryresultbuilder/tree/master| github - Query Result Builder]]. You can download and build the jar file, or you can simple download the following two jar files and add them to your class path in both your IDE and FitNesse:
* [[file:QueryResultBuilder.jar]]
* [[file:ReflectionUtil.jar]]

Rather than describe this in great detail (you can review the source and embedded unit tests), here is a first example:
**Update: Add Unit Test to SeasonPassManagerTest.java**
```java
   @Test
   public void queryResultBuilderCanTranslateToDoListCorrectly() {
      seasonPassManager.createNewSeasonPass("p1", 7);

      QueryResultBuilder builder = new QueryResultBuilder(Program.class);
      QueryResult result = builder.build(seasonPassManager.toDoListIterator());
      List<Object> renderedObjects = result.render();
   }
```

Note, this example requires the addition of one more method to SeasonPassManager.java:
**Update: SeasonPassManager.java**
```java
   public Iterable<?> toDoListIterator() {
      return toDoList;
   }
```

This is close to what we need. What the builder will do is take each bean-field in the Program class and put in into the query result object. To make this test run (not really pass, since it's just exercising/demonstrating the use of the Query Result Builder, there are no assertions):
* Add QueryResultBuilder.jar to your class path
* Add ReflectionUtil.jar to your class path
* Update Program to have getter methods for the fields you care about

Make these changes and run your unit tests. You should notice three passing tests.

This last bullet is an important one. The Query Result Builder as written will not simply return values from public fields, which is how the classes are presented. Also, by default, the QueryResultBuilder converts non-null objects via toString(). If you review the query table, it has three fields:
* Episode Name: that's a direct field within Program
* Date - a field contained within a time slot within a program
* Start Time - part of the date field within the time slot.

Not to worry, we can promote those fields up to our results in one of two ways:
* Add getters for all three fields directly in Program
* Add getters for the fields in Program and add a PropertyHandler for the time slot attribute.

The first option might seem simple, but it will involve putting fixture-specific code in our domain object, which is a bad idea. Instead, we'll create a custom property handler to perform the promotion of the fields instead:
**Create: TimeSlotPropertyHandler.java**
```java
package com.om.example.dvr.fixtures;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.om.example.dvr.domain.TimeSlot;
import com.om.query.domain.ObjectDescription;
import com.om.query.handler.PropertyHandler;
import com.om.reflection.PropertyGetter;

public class TimeSlotPropertyHandler extends PropertyHandler {
   static SimpleDateFormat dateFormat = new SimpleDateFormat("M/d/yyyy");
   static SimpleDateFormat timeFormat = new SimpleDateFormat("h:mm");

   @Override
   public void handle(PropertyGetter propertyGetter, Object targetObject,
         ObjectDescription objectDescription) {
      TimeSlot timeSlot = propertyGetter.getValue(targetObject, TimeSlot.class);

      Date startDateTime = timeSlot.startDateTime;

      objectDescription.addPropertyDescription("date", dateFormat.format(startDateTime));
      objectDescription.addPropertyDescription("startTime", timeFormat
            .format(startDateTime));
   }
}
```

### Slightly Updated Test
This test, which you might have put in SeasonPassManagerTest should no longer be in that class. Why? The class you just created is in the fixtures package. The SeasonPassManagerTest is in the domain package. The domain package should not point to the fixtures package. So leave that test as it is and instead create a new test class:
**Create: QueryResultBuilderExampleTest**
```java
package com.om.example.dvr.fixtures;

import static org.junit.Assert.assertEquals;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.om.example.dvr.domain.Program;
import com.om.example.dvr.domain.Schedule;
import com.om.example.dvr.domain.SeasonPassManager;
import com.om.query.QueryResultBuilder;
import com.om.query.domain.QueryResult;

public class QueryResultBuilderExampleTest {
   private SeasonPassManager seasonPassManager;
   private Schedule schedule;

   private Date createDate(int year, int month, int day, int hour, int min) {
      Calendar calendar = Calendar.getInstance();
      calendar.clear();
      calendar.set(Calendar.YEAR, year);
      calendar.set(Calendar.MONTH, month);
      calendar.set(Calendar.DAY_OF_MONTH, day);
      calendar.set(Calendar.HOUR, hour);
      calendar.set(Calendar.MINUTE, min);

      return calendar.getTime();
   }

   @Before
   public void init() {
      schedule = new Schedule();
      schedule.addProgram("p1", "e1", 7, createDate(2008, 4, 5, 7, 0), 60);
      schedule.addProgram("p2", "e2", 7, createDate(2008, 4, 5, 8, 0), 60);
      seasonPassManager = new SeasonPassManager(schedule);
   }

   @Test
   public void queryResultBuilderCanTranslateToDoListCorrectly() {
      seasonPassManager.createNewSeasonPass("p1", 7);

      QueryResultBuilder builder = new QueryResultBuilder(Program.class);
      builder.register("timeSlot", new TimeSlotPropertyHandler());
      QueryResult result = builder.build(seasonPassManager.toDoListIterator());
      List<Object> renderedObjects = result.render();
      assertEquals(1, renderedObjects.size());
   }
}
```

Try running your unit tests. They will fail with the following exception:
```
com.om.reflection.PropertyDoesNotExistInBeanException: Propery: timeSlot,
             does not exist in: com.om.example.dvr.domain.Program
    at com.om.reflection.ReflectionUtil.getPropertyGetterNamed(ReflectionUtil.java:83)
    at com.om.query.QueryResultBuilder.register(QueryResultBuilder.java:93)
        // snip
```

This exception is telling you that when you tried register a property handler for timeSlot, there was no corresponding getter method. To get this to work, you will need to add some getter methods to Program:
**Update: Program.java**
```java
   public String getProgramName() {
      return programName;
   }

   public String getEpisodeName() {
      return episodeName;
   }

   public TimeSlot getTimeSlot() {
      return timeSlot;
   }
```

Once you get your tests passing, remove the old version of the queryResultBuilderCanTranslateToDoListCorrectly test from the SeasonPassManagerTest.

### Updating the Fixtures
To complete this wiring, you'll need to make some updates to the fixtures:

**Update: CreateSeasonPassFor.java**
```java
package com.om.example.dvr.fixtures;

import com.om.example.dvr.domain.Program;
import com.om.example.dvr.domain.SeasonPassManager;

public class CreateSeasonPassFor {
   private static SeasonPassManager seasonPassManager = new SeasonPassManager(
         AddProgramsToSchedule.getSchedule());
   private Program lastProgramFound;

   public static SeasonPassManager getSeasonPassManager() {
      return seasonPassManager;
   }

   public CreateSeasonPassFor(String programName, int channel) {
      lastProgramFound = seasonPassManager.createNewSeasonPass(programName, channel);
   }

   public String idOfProgramScheduled() {
      if (lastProgramFound != null)
         return lastProgramFound.getId();
      return "n/a";
   }
}
```

This also requires a change to SeasonPassManager:
**Update: SeasonPassManager.java**
```java
   public Program createNewSeasonPass(String programName, int channel) {
      List<Program> programsFound = schedule.findProgramsNamedOn(programName, channel);

      toDoList = programsFound;

      if (programsFound.size() > 0)
         return programsFound.get(0);
      return null;
   }
```
[[#QueryResultExample]]
**Update: EpisodesInToDoList.java**:
```java
package com.om.example.dvr.fixtures;

import java.util.List;

import com.om.example.dvr.domain.Program;
import com.om.query.QueryResultBuilder;
import com.om.query.domain.QueryResult;

public class EpisodesInToDoList {
   private final String programId;

   public EpisodesInToDoList(String programId) {
      this.programId = programId;
   }

   public List<Object> query() {
      List<Program> programs = CreateSeasonPassFor.getSeasonPassManager()
            .toDoListContentsFor(programId);
      QueryResultBuilder builder = new QueryResultBuilder(Program.class);
      builder.register("timeSlot", new TimeSlotPropertyHandler());
      QueryResult result = builder.build(programs);
      return result.render();
   }
}
```

And finally, this requires another change to SeasonPassManager (overly simplistic, maybe, but enough for our tests):
**Update: SeasonPassManager.java**
```java
   public List<Program> toDoListContentsFor(String programId) {
      return toDoList;
   }
```

## Update Path
Your new code uses two jar files (downloaded from above). You need to add these to the class path:
* Go to your suite page : [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples]]
* Edit your top-level page and add a third !path statement (update the path accordingly):
```
!path /Users/schuchert/src/fitnesse-tutorials/DVR/lib/**.jar
```

After all of these changes, see if in fact your story test still passes. Now, go to your suite, and verify that all tests in your suite pass.

# Expand the Test, Grow the Logic
Now it's time to make sure the same program/episode on the same channel is not scheduled to record more than once.

Update the page to add another few tables at the bottom:
```
|Create Season Pass For|P1|7|
|id of program scheduled?   |
|$ID=                       |

|query:Episodes In To Do List|$ID                |
|episodeName                 |date     |startTime|
|E1                          |5/12/2008|7:00     |
|E2                          |5/13/2008|7:00     |
|E3                          |5/14/2008|7:00     |
|E4                          |5/15/2008|7:00     |
|E5                          |5/16/2008|7:00     |
|E6                          |5/17/2008|7:00     |
```

After adding these tables, run the test again. Notice that you have a surplus result. Why? What is the intention of this table? How can we make it more clear? To make this more clear we could:
* Leave it as is, people are smart enough to read, right?
* Put some comments on the page. Well, people are smart enough to read page commentary!
* Break these tests into different, well names tests.

The last option leads to more tests so there's a balance between it and adding commentary. However, for this example you'll split these tests into separate, well-named pages.

## Refactor the Tests
* Start by turning QueryTableExample into a Suite.
* Next, rename it so it is instead QueryTableExamples (Refactor button, find rename, enter new name, click on rename button)
* Create a SetUp page for your newly renamed page (click on the __[?]__ next to SetUp near the bottom of the page (if for some reason it is not there, then go to [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.QueryTableExamples.SetUp]])
* Set the contents of the setup page to:
```
|Add Programs To Schedule                         |
|name|episode|channel|date     |start time|minutes|
|P1  |E1     |7      |5/12/2008|7:00      |60     |
|P1  |E1     |7      |5/12/2008|10:00     |60     |
|P1  |E2     |7      |5/13/2008|7:00      |60     |
|P1  |E3     |7      |5/14/2008|7:00      |60     |
|P1  |E4     |7      |5/15/2008|7:00      |60     |
|P1  |E5     |7      |5/16/2008|7:00      |60     |
|P1  |E6     |7      |5/17/2008|7:00      |60     |
|P2  |E1     |5      |5/12/2008|7:00      |60     |
|P2  |E2     |5      |5/13/2008|7:00      |60     |
|P2  |E3     |5      |5/14/2008|7:00      |60     |
|P2  |E4     |5      |5/15/2008|7:00      |60     |
|P2  |E5     |5      |5/16/2008|7:00      |60     |
|P2  |E6     |5      |5/17/2008|7:00      |60     |
|P1  |E1     |9      |5/17/2008|7:00      |60     |
```
* Next, add the following to the top of your QueryTableExamples:
```
!contents -R2 -g -p -f -h
>SingleProgramPlacedInToDoListTest
>DuplicateEpisodeNotIncludedInToDoListTest
```
* Save the page.
* Click on the __[?]__ next to SingleProgramPlacedInToDoListTest
* Set its contents to:
```
|Create Season Pass For|P1|9|
|id of program scheduled?   |
|$ID=                       |

|query:Episodes In To Do List|$ID                |
|episodeName                 |date     |startTime|
|E1                          |5/17/2008|7:00     |
```
* Save this page. Notice that it is already a test page? That's because its name ends in Test.
* Click on the **Test** button to make sure it works.

The test fails! Why? It is not finding the import included in the original SetUp page. FitNesse does not inherit SetUp pages. It finds the nearest one and runs it. To make sure that the global setup (import statements) are included down here, update the QeuryTableExamples setup page. Add the following line to the top of the page:
```
!include <DigitalVideoRecorderExamples.SetUp
```
* Go back and run the SingleProgramPlacedInToDoListTest and verify that it now works.
* Now, click on the __[?]__ next to DuplicateEpisodesNotIncludedInToDoListTest.
* Set its contents to:
```
|Create Season Pass For|P1|7|
|id of program scheduled?   |
|$ID=                       |

|query:Episodes In To Do List|$ID                |
|episodeName                 |date     |startTime|
|E1                          |5/12/2008|7:00     |
|E2                          |5/13/2008|7:00     |
|E3                          |5/14/2008|7:00     |
|E4                          |5/15/2008|7:00     |
|E5                          |5/16/2008|7:00     |
|E6                          |5/17/2008|7:00     |
```
* Save the test and run it. It should still fail with one surplus row.
* Next, edit the contents of the QueryTableExaples to:
```
!contents -R2 -g -p -f -h
```
* Click the **Suite** button, make sure the tests run with one failed assertion.

## Fix the Production Code
To fix this problem, we need to make a few changes.
**Add Method to: Program.java**
```java
   public boolean sameEpisodeAs(Program program) {
      return timeSlot.channel == program.timeSlot.channel
            && programName.equals(program.programName)
            && episodeName.equals(program.episodeName);
   }
```

**Update: SeasonPassManager.java**
```java
package com.om.example.dvr.domain;

import java.util.LinkedList;
import java.util.List;

public class SeasonPassManager {
   private final Schedule schedule;
   private List<Program> toDoList = new LinkedList<Program>();

   public SeasonPassManager(Schedule schedule) {
      this.schedule = schedule;
   }

   public int sizeOfToDoList() {
      return toDoList.size();
   }

   public Program createNewSeasonPass(String programName, int channel) {
      List<Program> programsFound = schedule.findProgramsNamedOn(programName, channel);

      for (Program current : programsFound)
         if (!alreadyInToDoList(current))
            toDoList.add(current);

      if (programsFound.size() > 0)
         return programsFound.get(0);
      return null;
   }

   private boolean alreadyInToDoList(Program candidate) {
      for (Program current : toDoList)
         if (current.sameEpisodeAs(candidate))
            return true;

      return false;
   }

   public Iterable<?> toDoListIterator() {
      return toDoList;
   }

   public List<Program> toDoListContentsFor(String programId) {
      List<Program> result = new LinkedList<Program>();

      for (Program current : toDoList)
         if (current.getId().equals(programId))
            result.add(current);

      return result;
   }
}
```

* Now run the QueryTableExamples suite. Everything should pass.

We're done right? Wrong!

* Run the top-level suite: DigitalVideoRecorderExamples

You will see a failure. The test DuplicateEpisodeNotIncludedInToDoListTest works by itself and even under its immediate parent suite. However, it does not work when run in the whole suite. Why is that? What is the failure. When I originally came across this problem, in the back of my mind I was thinking I wanted to clear out the program schedule between tests. Now that "spider sense", which has been tingling, is finally coming to fruition.

If you review why the test fails, the test was expecting:
* E1, 5/12/2008, 7:00, but it found
* E1, 5/12/2008, 10:00

Upon further review, the test DecisionTableExample inserts something on channel 7 at time 7:00, an episode of House M.D.. That test runs before DuplicateEpisodeNotIncludedInToDoListTest, and it causes an undesirable side-effect. This is an example of cross-test chatter.

We have some options:
* Change the time of one or the other (it will work but it is a short-term, hack solution that will eventually not work)
* Clear out the schedule after each test in a TearDown page
* Clear out the schedule just before each test in a SetUp page

Either of the last two options are fine. Given we have not created a TearDown page, that's the option I'll pick:
* Go to the DigitalVideoRecorderExamples page.
* Click on the __[?]__ next to TearDown. (If that link is missing, then go to: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.TearDown]].)
* Set the contents to:
```
|Clear Program Schedule|
```

To make this work, you'll need a matching fixture:
**Create: ClearProgramSchedule.java**
```java
package com.om.example.dvr.fixtures;

public class ClearProgramSchedule {
   public ClearProgramSchedule() {
      AddProgramsToSchedule.getSchedule().clear();
   }
}
```

And finally, this requires you to add a method to Schedule:
**Add Method To: Schedule.java**
```java
   public void clear() {
      scheduledPrograms.clear();
   }
```

If you do not like this, you could have alternatively updated the AddProgramsToSchedule to clear out the schedule by simply reassigning the static variable. In any case, run your tests and the who suite should pass.

Congratulations, you've finished this tutorial.

# Summary
This was a fairly detailed tutorial. You learned several things about Query tables:
* They can pass parameters into the constructor of their fixture.
* They expect a method, **query**, which returns a List of a List of a List of strings.

You also learned that there is a simple utility that will help you build query results. If you look at those jars, there are test files in both of them. You can review the tests to get an idea of how the QueryResultBuilder works, though you saw most of what you need in this one example.

You learned quite a bit about FitNesse:
* Refactoring pages to rename them
* Refactoring pages to move them
* Creating Suites
* Adding SetUp and TearDown methods
* SetUp page inheritance (TearDown works the same way)
* A little bit about organizing page hierarchies, there's more, like page staging, but you're getting an idea.

You learned that sometimes jumping from FitNess down in to unit tests is the right thing to do. This tutorial didn't do that as much at it could have, but it at least gave you an idea of when to do it.

There's more you could do with this code, quite a bit more. For example, if you review SeasonPassManager, there's a lot of feature envy on a missing class. Many of the methods directly manipulate a language-provided collection. That's rip for an extract class refactoring.

Finally, you've experience test cross-chatter and one way to clean it up. That's an especially important consideration. Tests should run on their own, in suites and not cause other tests to fail.

At this point, you've learned enough about FitNesse with the first three tutorials to be fairly effective. There's more to learn, e.g.,
* Script Tables (TBD)
* [[FitNesse.Tutorials.ScenarioTables|Scenario Tables]]
* [Table Tables]({{ site.pagesurl }}/Acceptance Testing.FitNesse.TableTableExample)

Even so, you can do quite a bit right now.

[[FitNesse.Tutorials|<--Back]] or [[FitNesse.Tutorials.ScriptTables|Next Tutorial--->]]