---
title: FitNesse.Tutorials.ScenarioTables
---
{:toc}[[FitNesse.Tutorials|<--Back]] or [[FitNesse.Tutorials.TableTables|Next Tutorial--->]]

# //Note//
The [[FitNesse.Tutorials.ScenarioTables.OriginalArticle|original article]] is here. This page is a rewritten version that ties in with the previous tutorials.
# Introduction
This tutorial picks up where the [[FitNesse.Tutorials.ScriptTables|previous one]] finished. If you'd like to start at this tutorial with a fresh source base, use the tag: //**FitNesse.Tutorials.ScenarioTables.Start**// and [[FitNesse.Tutorials.WorkingFromGitHub|review these notes on working with the source from github]].

Scenario tables are a way to express a sequence of abstract steps. Unlike the other table types you've probably worked with, scenario tables are not necessarily backed by a particular fixture. In fact, if you simply declare a sequence of steps in a scenario table, FitNesse will not attempt to do anything with it; you will not need a backing fixture. However, as soon as you define concrete tests that use the scenario table, then you'll need to make sure a fixture is in place. It is possible for the same Scenario table to be backed by different fixtures for different uses.

In this tutorial you'll:
* Write a scenario table
* Learn how to design tests using scenario tables
* Learn how to bind the requirements imposed by a scenario table on a fixture of your choosing
* Use a scenario table to validate some complex logic
* Use a little TDD to get some of the underlying code working
# The Problem
For this tutorial, you'll work on the following user stories:
>> As a DVR user, I want to make sure the priority of my season passes affects what gets scheduled in the to do list.

This is a somewhat vague user story. This is a prime case of where a few examples would make everything easier to understand. So before you start writing tables, here are a few examples.
* Given a program schedule and a single season pass, all episodes of that program should be in the to do list.
* Given a program schedule and two season passes (SP1, SP2), where there are conflicts, the programs for SP1 should be recorded in favor of the programs in SP2 because it listed first and therefore higher in priority.
* Given a program schedule and two season passes and a DVR that can record two things at the same time, all programs should be recorded.
* Given a program schedule, three season passes and a DVR that can record two thins at the same time, the only time a program should be missing from the to do list is when there are three programs on at the same time.

In these somewhat abstract examples, we have a couple of key elements:
* A program schedule - we already know how to create these
* A DVR with the ability to record a variable number of simultaneous programs.
* An ordered list of season passes

With this in mind, it's time to start working on a test.

//**Note**//: For this and future tutorials in this series, the examples will stop making the tables look nice. FitNesse does that job well enough. If you prefer to make your table look nice, you can click on the **Format** button when editing the table.
# The Test
First you need to create a schedule. Given your recent experience with script tables, it might be a good idea to create several programs and then simply reuse that program guide across all tests:
```
!|Script|Generate Programs|
|Create Daily Program Named|D5_1|On Channel|5|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D5_2|On Channel|5|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D5_3|On Channel|5|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D5_4|On Channel|5|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D6_1|On Channel|6|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D6_2|On Channel|6|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D6_3|On Channel|6|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D6_4|On Channel|6|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D7_1|On Channel|7|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D7_2|On Channel|7|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D7_3|On Channel|7|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D7_4|On Channel|7|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D8_1|On Channel|8|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D8_2|On Channel|8|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D8_3|On Channel|8|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D8_4|On Channel|8|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D9_1|On Channel|9|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D9_2|On Channel|9|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D9_3|On Channel|9|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D9_4|On Channel|9|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|check|TotalEpisodesCreated|140|
```

Wow! That's a lot of episodes, 140 to be exact. The schedule has 4 daily programs on 5 different channels, each with 7 episodes. That should be a good start. Next, you need to add a number of season passes:
```
|Create Season Pass For|D5_1|5|

|Create Season Pass For|D6_1|6|
```

Finally, verify that there are 7 episodes of D5_1 and 0 of D6_1 (since your current DVR can only record 1 thing at a time).
```
|query:Episodes In To Do List|
|programName|episodeName|date|startTime|
|D5_1|E1|3/4/2008 |20:00|
|D5_1|E2|3/5/2008 |20:00|
|D5_1|E3|3/6/2008 |20:00|
|D5_1|E4|3/7/2008 |20:00|
|D5_1|E5|3/8/2008 |20:00|
|D5_1|E6|3/9/2008 |20:00|
|D5_1|E7|3/10/2008|20:00|
```

Create this page with the 4 tables (one script, two decision tables and one query table). Call it ScenarioTableExamples and place it under DigitalVideoRecorder. Here's a URL (assuming you are running FitNesse on port 8080): [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples]]

You'll also need to set the page type to test.

The last table requires a change to the EpisodesInToDoList class and elsewhere:
**Update: EpisodesInToDoList, add no-argument constructor**
```java
   public EpisodesInToDoList() {
      programId = "";
   }
```

This also requires a change to SeasonPassManager since we are passing in a blank programId:
**Update: SeasonPassManager.toDoListContentsFor**
```java
   public List<Program> toDoListContentsFor(String programId) {
      List<Program> result = new LinkedList<Program>();

      for (Program current : toDoList)
         if (programId.length() == 0 || current.getId().equals(programId))
            result.add(current);

      return result;
   }
```

Run this and there are a few problems:
* The time is coming back as 8:00 instead of 20:00
* There seems to be no conflicting time logic when creating the to do list

To fix the first problem, you'll need to update DateUtil:
**Update: DateUtil.java, Change h to H**
```java
   static SimpleDateFormat timeFormat = new SimpleDateFormat("H:mm");
```

Make sure this seeming innocuous change did not break any unit tests (it should not). Also make sure all other acceptance tests are still passing (oops, it does). Before you fix the problem with the current acceptance test, you should fix the problem introduced// **by**// the new acceptance test - or rather the one exploited by the current unit test. The [TearDown](http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.TearDown) page resets the program guide, but it does not reset the to do list.

## Cleaning Up Between Tests, Part Dux
The TearDown page [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.TearDown]] uses the ClearProgramSchedule fixture to, well, clear the program schedule. Should you update the ClearProgramSchedule to also clear the todo list, or should you create a second fixture, say ClearToDoList? There's no clear answer as either will work. Using a single fixture will couple these two separate concerns (a possible violation of the [Single Responsibility Principle](http://www.objectmentor.com/resources/articles/srp.pdf)). Using two fixtures will make things more explicit, but also leave the possibility of forgetting to do both together. (Ultimately there's a better solution, put all of these key objects in a single place and reset that, however, this tutorial does not take that approach.)

In your domain, these two concepts might actually be intertwined by design. If you believe that clearing the program guide should logically cause the to to list to be cleared, then update the fixture. If you think instead that these are orthogonal concerns, then create a second fixture and call it. This tutorial is going to treat these as separate concerns.
* Update TearDown Page:
```
|Clear Program Schedule|

|Clear To Do List|
```

* Create new fixture:
```java
package com.om.example.dvr.fixtures;

public class ClearToDoList {
   public ClearToDoList() {
      CreateSeasonPassFor.getSeasonPassManager().clearToDoList();
   }
}
```

* Add a method to SeasonPassManager:
```java
   public void clearToDoList() {
      toDoList.clear();
   }
```

Now everything should still pass other than your new acceptance test.
## Back to Fixing the Acceptance Test
Here is the code from SeasonPassManager responsible for populating the to do list:
```java
   public Program createNewSeasonPass(String programName, int channel) {
      List<Program> programsFound = schedule.findProgramsNamedOn(programName, channel);

      for (Program current : programsFound)
         if (!alreadyInToDoList(current))
            toDoList.add(current);

      if (programsFound.size() > 0)
         return programsFound.get(0);
      return null;
   }
```

A quick review of this code and you'll notice it only checks to see if a duplicate program is already in the to do list. It does not check to see if there are any conflicts. One program conflicts with another if the time slots span each other. This logic is somewhat complex and well suited to a series of unit tests.

Since this is not a tutorial on TDD (at least not directly), here are the unit tests for a new unit test on DateUtil that determines if two date/time ranges conflict with each other. This is an example of a JUnit 4 [[Parameterized Test]]:
**Create: DateUtilConflictsInTimeWithTest.java**
```java
package com.om.example.util;

import static org.junit.Assert.assertEquals;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class DateUtilConflictsInTimeWithTest {
   private final String message;
   private Date lhsDate;
   private int lhsDuration;
   private Date rhsDate;
   private int rhsDuration;
   private final boolean expected;

   @Parameters
   public static Collection<?> parameters() {
      ArrayList<Object[]> v = new ArrayList<Object[]>();
      v.add(new Object[] { "rhs inside lhs", "1/2/2008", "20:00", 60, "1/2/2008",
            "20:30", 1, true });
      v.add(new Object[] { "unrelated times", "1/2/2008", "20:00", 60, "1/2/2008",
            "10:00", 60, false });
      v.add(new Object[] { "same times", "1/2/2008", "20:00", 60, "1/2/2008", "20:00",
            60, true });
      v.add(new Object[] { "lhs offset by 30 mins on rhs", "1/2/2008", "20:00", 60,
            "1/2/2008", "20:30", 60, true });
      v.add(new Object[] { "different dates", "1/4/2008", "20:00", 60, "1/2/2008",
            "20:30", 60, false });
      v.add(new Object[] { "lhs just ends before rhs", "1/2/2008", "20:00", 60,
            "1/2/2008", "21:00", 60, false });
      return v;
   }

   public DateUtilConflictsInTimeWithTest(String message, String lhsDate, String lhsTime,
         int lhsDuration, String rhsDate, String rhsTime, int rhsDuration,
         boolean expected) throws ParseException {
      this.message = message;
      this.lhsDuration = lhsDuration;
      this.rhsDuration = rhsDuration;
      this.expected = expected;

      this.lhsDate = DateUtil.instance().buildDate(lhsDate, lhsTime);
      this.rhsDate = DateUtil.instance().buildDate(rhsDate, rhsTime);
   }

   @Test
   public void lhsComparedToRhs() {
      assertEquals(message, expected, DateUtil.instance().segmentsConflict(lhsDate,
            lhsDuration, rhsDate, rhsDuration));
   }

   @Test
   public void rhsComparedToLhs() {
      assertEquals(message, expected, DateUtil.instance().segmentsConflict(rhsDate,
            rhsDuration, lhsDate, lhsDuration));
   }
}
```

This introduces a new public method on the DateUtil class:
**Update: DateUtil.java, add four methods**
```java
   public Date createEndDate(Date startDateTime, int durationInMinutes) {
      Calendar calendar = Calendar.getInstance();
      calendar.setTime(startDateTime);
      calendar.add(Calendar.MINUTE, durationInMinutes);
      return calendar.getTime();
   }

   public boolean segmentsConflict(Date lhs, int lhsDurationMins, Date rhs,
         int rhsDurationMins) {
      Date lhsEnd = createEndDate(lhs, lhsDurationMins);
      Date rhsEnd = createEndDate(rhs, rhsDurationMins);

      return isOnToJustBefore(lhs, rhs, rhsEnd) || isStrictlyWithin(lhsEnd, rhs, rhsEnd)
            || isOnToJustBefore(rhs, lhs, lhsEnd)
            || isStrictlyWithin(rhsEnd, lhs, lhsEnd);
   }

   private boolean isOnToJustBefore(Date date, Date rangeBegin, Date rangeEnd) {
      return date.equals(rangeBegin) || (date.after(rangeBegin) && date.before(rangeEnd));
   }

   private boolean isStrictlyWithin(Date date, Date rangeBegin, Date rangeEnd) {
      return date.after(rangeBegin) && date.before(rangeEnd);
   }
```

Finally, this code is used in TimeSlot:
**Update: TimeSlot.java, add new method**
```java
   public boolean conflictsInTimeWith(TimeSlot other) {
      return DateUtil.instance().segmentsConflict(startDateTime, durationInMinutes,
            other.startDateTime, other.durationInMinutes);
   }
```

In my original implementation, I did all of this work in TimeSlot and the original unit test targeted time slot. When I was done, I extracted the bulk of the implementation into DateUtil because it was dealing with dates. So I changed the test to target DateUtil and simply left the call to the DateUtil in TimeSlot. So while this particular method is not tested by unit tests, it will be tested by acceptance tests. Is this a possible hole in the testing regiment? Depends on if you have a proper build system that executes both acceptance and unit tests. I don't see it as a large risk, if you do not agree, then create a unit test for TimeSlot as well.

## Working Back to Story
Now that the fundamental support is in place, you can go back and update SeasonPassManager:
**Update: SeasonPassManager.java, add method, update other**
```java
   public Program createNewSeasonPass(String programName, int channel) {
      List<Program> programsFound = schedule.findProgramsNamedOn(programName, channel);

      for (Program current : programsFound)
         if (!alreadyInToDoList(current) && !conflictsWithExistingSchedule(current))
            toDoList.add(current);

      if (programsFound.size() > 0)
         return programsFound.get(0);
      return null;
   }

   private boolean conflictsWithExistingSchedule(Program program) {
      for (Program current : toDoList)
         if (current.hasTimeConflictWith(program))
            return true;

      return false;
   }
```

This requires a method added to Program (thus avoiding a violation of the Law of Demeter):
**Update: Program.java, add a pass-through method**
```java
   public boolean hasTimeConflictWith(Program other) {
      return timeSlot.conflictsInTimeWith(other.timeSlot);
   }
```

Run all of your unit tests, verify they all pass. One fails. If you created the GenerateProgramsTest.java, you'll have one failure. (If not, do not worry, you'll have the exact same problem in an acceptance test - I had a duplicated test so I get to fix two problems). Since the problem is duplicated, and just in case you do not have this unit test, run the entire suite of tests. You should have one failing acceptance test as well:// **ScriptTableExamples.CreatingManyProgramsExample**//

Upon review, the test data for this test is:
```
!|Script|Generate Programs                                                                      |
|Create Weekly Program Named|W1|On Channel|7|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8 |
|Create Weekly Program Named|W2|On Channel|8|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8 |
|Create Daily Program Named |D1|On Channel|7|Starting On|3/4/2008|at|20:30|Length|30|Episodes|56|
|Create Daily Program Named |D2|On Channel|8|Starting On|3/4/2008|at|22:00|Length|30|Episodes|56|
```

The problem is that the programs W1 and W2, while on different channels, conflict with each other. Right now the DVR can only record one program at a time. So the test is wrong! You need to update this test. You can either update the third row of the table to change the time of the programs or update the query table. I recommend updating the query table since is the assertion that is incorrect:
**Update: Query table, remove an expected result**
```
|Query:Episodes in to do list on|3/4/2008   |
|programName                    |episodeName|
|W1                             |E1         |
|D1                             |E1         |
|D2                             |E1         |
```

Run your acceptance test suite, everything should pass. Now, if you have a failing unit test, it requires a similar fix. You need to change the expected size of the list from 4 to 3:
**Update: GenerateProgramsTest.**
```java
  public void ReviewToDoListByDay() throws Exception {
     //snip
      assertEquals(3, results.size());
   }
```
# Now On To a Scenario
Now that you have one test working, it would be handy to create additional tests. The DVR can record 1, 2 or 4 simultaneous programs. The 1 is for one-input DVR's. The 4 is for the upscale model. If a user has an upscale model but only one coax cable, then the DVR can only record 2 programs. However, these are all details. we need to create several test scenarios with similar data but different results based on the number of programs a DVR can record. Each of these tests will need to:
* Create a data set
* Configure the DVR to a number of simultaneous recordings (1, 2, 4)
* Create a number of season passes in a particular order (for now, order == priority)
* Verify that what should have recorded was in fact recorded

Notice, this describes an abstract test. Now it is time to express that abstract test and then rewrite your existing test using this new approach.

## First The Script Table
The first bullet above is currently handled at the top of the page with a large Decision table. However, the remainder can be expressed as follows:
```
!|Scenario|dvrCanSimultaneouslyRecord|number|andWithThese|seasonPasses|shouldHaveTheFollowing|toDoList|
|givenDvrCanRecord|@number|
|whenICreateSeasonPasses|@seasonPasses|
|thenTheToDoListShouldContain|@toDoList|
```

The first list of the ScenarioTable describes the input parameters to the table. This table has three parameters:
|| number || The number of programs the DVR should be able to record at the same time. ||
|| seasonPasses || A list of season passes, which will be parsed by the underlying method and then created ||
|| toDoList || A list of programs that should be in the to do list ||

Notice that this table expresses what needs to be done.// **Question**//, what is the name of the fixture?// **Answer**// None, yet. In fact, add this table after the large decision table that creates the program schedule. Execute the test and it should still pass. Why? This is a declaration of a sequence of steps, but it is not used anywhere.

Now it is type to attempt to use it. To use it you'll need to do several things:
* Name the fixture.
* Call the scenario.
* Write the backing fixture.
* Perform the validation.

Luckily, we already have a working test, so this is a good time to change its format. In the spirit of refactoring, let's leave this test as is (it is passing), and instead create a new test that does what we want. This will require a bit more work, but it will give us a working test to verify we have not broken the production code, so it is a much less risky approach.

## Create New Page
* First, create the following page [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.DvrThatCanRecordOneProgramAtaTimeExample]] (//**Note**//: The AtaTime part of the name is important, FitNesse will not recognize a wikiword with two capital letters back to back, so rather than calling the page ...AtATime..., I named it ...AtaTime...)
* Replace the !contents with the following: 
```
!|Scenario|dvrCanSimultaneouslyRecord|number|andWithThese|seasonPasses|shouldHaveTheFollowing|toDoList|
|givenDvrCanRecord|@number|
|whenICreateSeasonPasses|@seasonPasses|
|thenTheToDoListShouldContain|@toDoList|

|Create Season Pass For|D5_1|5|

|Create Season Pass For|D6_1|6|

|query:Episodes In To Do List|
|programName|episodeName|date|startTime|
|D5_1|E1|3/4/2008 |20:00|
|D5_1|E2|3/5/2008 |20:00|
|D5_1|E3|3/6/2008 |20:00|
|D5_1|E4|3/7/2008 |20:00|
|D5_1|E5|3/8/2008 |20:00|
|D5_1|E6|3/9/2008 |20:00|
|D5_1|E7|3/10/2008|20:00|
```

* Set the page to a test page.

* The original large Decision Table should be put in a SetUp page. Go to the following URL and paste the following table: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.SetUp]]
```
!include <DigitalVideoRecorderExamples.SetUp

!|Script|Generate Programs|
|Create Daily Program Named|D5_1|On Channel|5|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D5_2|On Channel|5|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D5_3|On Channel|5|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D5_4|On Channel|5|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D6_1|On Channel|6|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D6_2|On Channel|6|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D6_3|On Channel|6|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D6_4|On Channel|6|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D7_1|On Channel|7|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D7_2|On Channel|7|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D7_3|On Channel|7|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D7_4|On Channel|7|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D8_1|On Channel|8|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D8_2|On Channel|8|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D8_3|On Channel|8|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D8_4|On Channel|8|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|Create Daily Program Named|D9_1|On Channel|9|Starting On|3/4/2008|at|20:00|Length|30|Episodes|7|
|Create Daily Program Named|D9_2|On Channel|9|Starting On|3/4/2008|at|20:30|Length|30|Episodes|7|
|Create Daily Program Named|D9_3|On Channel|9|Starting On|3/4/2008|at|21:00|Length|30|Episodes|7|
|Create Daily Program Named|D9_4|On Channel|9|Starting On|3/4/2008|at|21:30|Length|30|Episodes|7|
|check|TotalEpisodesCreated|140|
```

* Next, remove that same table from: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples]]
* Run your ScenarioTableExamples test, it should still work.
* Create a new page: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.OriginalExample]] and paste the remainder of the original table:
```
|Create Season Pass For|D5_1|5|

|Create Season Pass For|D6_1|6|

|query:Episodes In To Do List|
|programName|episodeName|date|startTime|
|D5_1|E1|3/4/2008 |20:00|
|D5_1|E2|3/5/2008 |20:00|
|D5_1|E3|3/6/2008 |20:00|
|D5_1|E4|3/7/2008 |20:00|
|D5_1|E5|3/8/2008 |20:00|
|D5_1|E6|3/9/2008 |20:00|
|D5_1|E7|3/10/2008|20:00|
```
* Set the page type to test, execute it and make sure it still works.
* Update the [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples]] page, convert it to a Suite test.
* Change its contents to:
```
!contents
```
* Hit the suite button, the original example should still pass.
* Go back to the [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.DvrThatCanRecordOneProgramAtaTimeExample]] and change its page type to test.
* Run the test, it should also pass.

## Migrate new page to Scenario Test
The way this scenario works is it takes in 3 parameters, the first is the number of programs the DVR can record at any given time. The next two parameters represent a list of season passes and a list of to do contents. So to finish this page, you must name the fixture (the first table coming up) and use the scenario (second table):
```
|Script|Dvr Recording|

|Dvr Can Simultaneously Record And With These Should Have The Following|
|number                       |seasonPasses   |toDoList                |
|1                            |D5_1:5,D6_1:6  |D5_1:E:1-7              |
```

The first table simply names a fixture, so you'll need to create a class called Dvr Recording. That's easy enough:
```java
package com.om.example.dvr.fixtures;

public class DvrRecording {

}
```

The next table names the scenario. Notice that each of the parts of the name are separated with spaces and start with a capital letter. There are other options, but this is a simple approach to get the name right. Notice that the name does not include: number, seasonPasses, toDoList. Those are the names of parameters.

Once the first line names the scenario, the next line names parameters. The names must match the names used in the scenario table.

The third row describes one complete use of the scenario. In this case:
|| 1 || The DVR should be able to record one thing at a time ||
|| D5_1:5,D6_1:6 || A comma separated list of Program Name:Channel pairs. ||
|| D5_1:7 || A short hand notation for D5_1, D5_2 ... D5_7 ||

You can use what ever syntax makes sense. You will have to parse it in the fixture, so you should something easy to deal with. However, if you have to choose between easy to program and easy to write in the acceptance test, I strongly encourage the latter. Why? Make it easy to express the tests. You'll have fewer fixtures than tests, so put the pain in a single place rather than many places. This is just another example of the DRY principle.

As is, this test will nearly run once you've:
* Updated the page.
* Created the fixture class.

After doing that, run the acceptance test. You'll notice it fails, and if you look to the far right of the table, you'll see the word Scenario in red. Open it up and it is telling you the names of the missing methods:
* givenDvrCanRecord
* whenICreateSeasonPasses
* thenTheToDoListShouldContain

## Introduce Skeleton Fixture Class
So update your fixture class:
```java
package com.om.example.dvr.fixtures;

public class DvrRecording {
   public void givenDvrCanRecord(int number) {
   }

   public void whenICreateSeasonPasses(String listOfSeasonPasses) {
   }

   public boolean thenTheToDoListShouldContain(String listOfEpisodes) {
      return false;
   }
}
```

Now run your acceptance test, notice that it only fails on the last line. If you change the return value to true, the test will "pass", even though it is doing nothing.

## Complete the Fixture
**Update: DvrRecording.java**
```java
package com.om.example.dvr.fixtures;

import java.util.Iterator;
import java.util.List;

import com.om.example.dvr.domain.Program;

public class DvrRecording {
   public void givenDvrCanRecord(int number) {
   }

   public void whenICreateSeasonPasses(String listOfSeasonPasses) {
      String[] individualSeasonPasses = listOfSeasonPasses.split(",");

      for (String programNameChannel : individualSeasonPasses)
         addOneSeasonPass(programNameChannel);
   }

   private void addOneSeasonPass(String programNameChannel) {
      String[] parts = programNameChannel.split(":");

      String programName = parts[0];
      int channel = Integer.parseInt(parts[1]);

      new CreateSeasonPassFor(programName, channel);
   }

   public boolean thenTheToDoListShouldContain(String listOfEpisodes) {
      List<Program> toDoList = CreateSeasonPassFor.getSeasonPassManager()
            .toDoListContentsFor("");

      String[] episodesSets = listOfEpisodes.split(",");

      for (String episodeSet : episodesSets)
         if (!removeAllFrom(episodeSet, toDoList))
            return false;

      return toDoList.size() == 0;
   }

   private boolean removeAllFrom(String episodeSet, List<Program> toDoList) {
      String programName = extractProgramNameFrom(episodeSet);
      String baseEpisodeName = extractBaseNameFrom(episodeSet);
      int lowerRange = extractLowerRangeFrom(episodeSet);
      int upperRange = extractUpperRangeFrom(episodeSet);

      for (int episodeNumber = lowerRange; episodeNumber <= upperRange; ++episodeNumber)
         if (!remove(programName, baseEpisodeName, episodeNumber, toDoList))
            return false;

      return true;
   }

   private String extractProgramNameFrom(String episodeSet) {
      return episodeSet.split(":")[0];
   }

   private String extractBaseNameFrom(String episodeSet) {
      return episodeSet.split(":")[1];
   }

   private int extractLowerRangeFrom(String episodeSet) {
      String lowRange = episodeSet.split(":")[2].split("-")[0];
      return Integer.parseInt(lowRange);
   }

   private int extractUpperRangeFrom(String episodeSet) {
      String highRange = episodeSet.split(":")[2].split("-")[1];
      return Integer.parseInt(highRange);
   }

   private boolean remove(String programName, String baseEpisodeName, int episodeNumber,
         List<Program> toDoList) {
      String episodeName = String.format("%s%d", baseEpisodeName, episodeNumber);

      for (Iterator<Program> iter = toDoList.iterator(); iter.hasNext();) {
         if (matches(iter.next(), programName, episodeName)) {
            iter.remove();
            return true;
         }
      }
      return false;
   }

   private boolean matches(Program current, String programName, String episodeName) {
      return programName.equals(current.programName)
            && episodeName.equals(current.episodeName);
   }
}
```

Update your fixture and verify that your test passes.

# Now Add A Different Use
Next, you'll try a degenerate case. What happens if there no programs can be recorded? Rather than write about it, express it as a test.

* Create a new page: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.DvrThatCanRecordZeroProgramsAtaTimeExample]]
* Update its contents to:
```
!|Scenario|dvrCanSimultaneouslyRecord|number|andWithThese|seasonPasses|shouldHaveTheFollowing|toDoList|
|givenDvrCanRecord|@number|
|whenICreateSeasonPasses|@seasonPasses|
|thenTheToDoListShouldContain|@toDoList|

|Script|Dvr Recording|

|Dvr Can Simultaneously Record And With These Should Have The Following|
|number|seasonPasses |toDoList   |
|0     |D5_1:5       |           |
```
* Notice the duplication? Move the Scenario table and the Script table to the SetUp page and the remove it from both this page and the DvrThatCanRecordOneProgramAtaTimeExample pages. (These are the tables you are moving:)
```
!|Scenario|dvrCanSimultaneouslyRecord|number|andWithThese|seasonPasses|shouldHaveTheFollowing|toDoList|
|givenDvrCanRecord|@number|
|whenICreateSeasonPasses|@seasonPasses|
|thenTheToDoListShouldContain|@toDoList|

|Script|Dvr Recording|
```
* Set the page type to test.
* Attempt to run the DvrThatCanRecordZeroProgramsAtaTimeExample page, you'll get exceptions, index out of bounds. OOPS! That first version of the fixture assumed there was something to test. Update the fixture to handle that:
```java
   private String extractBaseNameFrom(String episodeSet) {
      String[] values = episodeSet.split(":");

      String result = "";
      if (values.length > 1)
         result = values[1];

      return result;
   }

   private int extractLowerRangeFrom(String episodeSet) {
      String[] values = episodeSet.split(":");
      if (values.length > 2) {
         String lowRange = episodeSet.split(":")[2].split("-")[0];
         return Integer.parseInt(lowRange);
      }
      return 0;
   }

   private int extractUpperRangeFrom(String episodeSet) {
      String[] values = episodeSet.split(":");
      if (values.length > 2) {
         String highRange = episodeSet.split(":")[2].split("-")[1];
         return Integer.parseInt(highRange);
      }
      return -1;
   }

```

After making this update, run the test. Now the error is that there's no check for the number of allowed recordings. So that's next.
## Allow Number of Recordings to be Set
* First, update the fixture one final time:
```java
   public void givenDvrCanRecord(int number) {
      CreateSeasonPassFor.getSeasonPassManager().setNumberOfRecorders(number);
   }
```

* This requires an update to SeasonPassManager:
```java
package com.om.example.dvr.domain;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class SeasonPassManager {
   // snip
   private int numberOfRecorders = 1;

   //snip
   public void setNumberOfRecorders(int number) {
      this.numberOfRecorders = number;
   }
}
```

* Now that the class has that information, it can use it to update SeasonPassManager again:
```java
   private boolean conflictsWithExistingSchedule(Program program) {
      int remainingConflicts = numberOfRecorders - 1;

      for (Program current : toDoList)
         if (current.hasTimeConflictWith(program)) {
            --remainingConflicts;
            if (remainingConflicts < 0)
               return true;
         }

      return remainingConflicts < 0;
   }
```

Run your acceptance test. When that passes, run your suite and unit tests. Everything should pass.
## Remove Duplication
Notice that the Scenario Table is duplicated?
* Update the Suite's setup page to include the scenario. Add the following:
```
!|Scenario|dvrCanSimultaneouslyRecord|number|andWithThese|seasonPasses|shouldHaveTheFollowing|toDoList|
|givenDvrCanRecord|@number|
|whenICreateSeasonPasses|@seasonPasses|
|thenTheToDoListShouldContain|@toDoList|

|Script|Dvr Recording|
```
* Update each of the pages under the ScenarioTableExamples that includes these tables and remove them.
* Verify your tests still pass.

# Now Support 2 Recordings at a Time
* Create another page: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.DvrThatCanRecordTwoProgramsAtaTimeExample]]
* Create the basic test:
```
|Dvr Can Simultaneously Record And With These Should Have The Following|
|number|seasonPasses |toDoList   |
|2     |D5_1:5,D6_1:6|D5_1:E:1-7,D6_1:E:1-7 |
```
* Set the page type to Test and execute it.

It worked! That seemed too simple.

* Add another test by adding another row to the table:
```
|2     |D5_1:5,D6_1:6,D7_1:7|D5_1:E:1-7,D6_1:E:1-7 |
```

* Execute the test. Does it work?

Wow! That worked. Almost seems too simple. Sure enough, the basic functionality is in place. You could write more sophisticate examples to make sure the production code really works, but this tutorial has gotten the point across of using scenario tables. There are two things left before you finish this tutorial:
* Clean Up
* Advanced Scenario Example

## Clean Up
Some time back you created a page called: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.OriginalExample]]. You have two options:
* Remove it, you've rewritten it.
* Leave it as is so you have something to compare the Scenario table with.

In my solution I'm going to remove it. You can pick you poison. 

Before leaving this section, execute the suite one final time. Did everything pass? In my example I have a failed test: ScriptTableExamples.CreatingManyProgramsExample. It runs by itself but not in the top level suite (though it does run in the intermediate level suite. This suggests cross-test contamination.

After a little research, it turns out that the following test is causing an unwanted side-effect: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScenarioTableExamples.DvrThatCanRecordZeroProgramsAtaTimeExample]]. How? It sets the number of recorders in the DVR to 0. This is set on an instance. As written, the system is not removing stale instances but rather clearing lists. There are several ways to fix this:
* On the page that is failing, manually set the number of recordings:
```
|Script|Dvr Recording|
|givenDvrCanRecord|1|
```
* Change the fixtures that clear collections to actually dump instances and recreate new instances
* Set the number of recordings back to 1 before every test
* ...

The first option is causing a test to fix something messed up by other tests. This is a bad solution because it implies that depending on the order, any given test might need to make the same change. The third option is better than the first, but it suggests an ever-growing SetUp/TearDown, which really is a violation of the Single Responsibility Principle (and conceptually even the open/closed principle). 

So the best of the options listed is to change the fixtures that clean thins up:
**Update: ClearProgramSchedule.java**
```java
package com.om.example.dvr.fixtures;

public class ClearProgramSchedule {
   public ClearProgramSchedule() {
      AddProgramsToSchedule.resetSchedule();
   }
}
```

**Update: AddProgramsToSchedule.java**
```java
   public static void resetSchedule() {
      schedule = new Schedule();
   }
```

**Update: ClearToDoList.java**
```java
package com.om.example.dvr.fixtures;

public class ClearToDoList {
   public ClearToDoList() {
      CreateSeasonPassFor.resetSeasonPassManager();
   }
}
```

**Update: CreateSeasonPassFor.java**
```java
   public static void resetSeasonPassManager() {
      seasonPassManager = new SeasonPassManager(AddProgramsToSchedule.getSchedule());
   }
```

Make these changes, run:
* Your unit tests, they should all pass
* The individual page that was failing (http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScriptTableExamples.CreatingManyProgramsExample?test), should pass
* The suite ([[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples?suite]]), should pass

It is important to frequently run your unit tests and acceptance tests to make sure a change did not break something. Note that the fix involved making changes to fixture-based code only. So the production code was OK, the problem was in the test-support code. Breaking things like this is going to happen. The important thing is to get it fixed before you check in. This suggests:
* The tests run quickly enough that it is feasible for you to run them frequently.
* The tests run on your machine as well as the build machine.

This will not happen by chance, you must design your system to allow for it, anticipate that things will break, and when the break, fix them fast!

# Advanced: Scenario Table Calling Scenario Table
This is an optional section. [[FitNesse.Tutorials.ScenarioTables#summary|You can safely skip it]].

This section is the motivation for the [[FitNesse.Tutorials.ScenarioTables.OriginalArticle|original article]] so it seems appropriate to include a shortened version here. If you want to understand the inner workings, read [[FitNesse.Tutorials.ScenarioTables.OriginalArticle|original article]]. It is not a tutorial, so there will not be any work beyond the reading effort.

Have a look at the last table you created:
```
|Dvr Can Simultaneously Record And With These Should Have The Following|
|number|seasonPasses |toDoList   |
|2     |D5_1:5,D6_1:6|D5_1:E:1-7,D6_1:E:1-7 |
|2     |D5_1:5,D6_1:6,D7_1:7|D5_1:E:1-7,D6_1:E:1-7 |
```

Notice that the first column is 2? In fact, the way these pages have been split, the first column will always be 2. Can you remove that duplication? 

The answer is yes you can. You can create a new scenario table that uses the first scenario table. That's what the rest of this section will describe. It will leave out some of the details. For a better understanding of what is happening under the covers, read [[FitNesse.Tutorials.ScenarioTables.OriginalArticle|original article]].

This requires two steps:
* Define a new Scenario in terms of an existing scenario.
* Use new scenario.
## Define a new scenario
Here is a new scenario defined in terms of the old scenario:
```
|Scenario|A Two Recorder Dvr With These Season Passes|seasonPasses|Should Have These Episodes In To Do List|toDoList|
|Dvr Can Simultaneously Record | 2 | And With These | @seasonPasses|Should Have The Following|@toDoList|
```

This new scenario is called: A Two Recorder Dvr With These Season Passes Should Have These Episodes In To Do List. How can you derive that?
* Consider only the first line
* Drop the word Scenario
* Take the first cell after the cell with scenario and each alternate cell
* Capitalize the first letter of each word
* Note that you skip the parameter cells (seasonPasses, toDoList), which happen to be the odd numbered cells.

This scenario is defined in terms of the first scenario. How can you tell?
* Consider only the second line
* Take the first cell and each alternate cell
* Capitalize the first letter of each word
* Note that you skip the parameter cells (2, @seasonPasses, @toDoList)

What you end up with is: Dvr Can Simultaneously Record And With These Should Have The Following. FitNesse notices this, realizes it has a Scenario table with that name and uses it. Scenario tables take precedence over other kinds of tables for lookup.

## Use It
Now you need to actually use the table:
```
|A Two Recorder Dvr With These Season Passes Should Have These Episodes In To Do List|
|seasonPasses                                |toDoList                               |
|D5_1:5,D6_1:6                               |D5_1:E:1-7,D6_1:E:1-7                  |
|D5_1:5,D6_1:6,D7_1:7                        |D5_1:E:1-7,D6_1:E:1-7                  |
```

This explicitly mentions the new scenario. FitNesse see this, performs a text-based substitution to get to the first scenario table. FitNesse then does the test-substitution again to turn the first scenario table into a series of method calls on the most recently mentioned script table, which is the Dvr Recording script table mentioned in the setup.

If you add these two tables and run the test, it will work. Notice that the page works either way. This page passes:
```
|Dvr Can Simultaneously Record And With These Should Have The Following|
|number|seasonPasses |toDoList   |
|2     |D5_1:5,D6_1:6|D5_1:E:1-7,D6_1:E:1-7 |
|2     |D5_1:5,D6_1:6,D7_1:7|D5_1:E:1-7,D6_1:E:1-7 |

|Scenario|A Two Recorder Dvr With These Season Passes|seasonPasses|Should Have These Episodes In To Do List|toDoList|
|Dvr Can Simultaneously Record | 2 | And With These | @seasonPasses|Should Have The Following|@toDoList|

|A Two Recorder Dvr With These Season Passes Should Have These Episodes In To Do List|
|seasonPasses                                |toDoList                               |
|D5_1:5,D6_1:6                               |D5_1:E:1-7,D6_1:E:1-7                  |
|D5_1:5,D6_1:6,D7_1:7                        |D5_1:E:1-7,D6_1:E:1-7                  |
```

I don't recommend keeping the first table and the last table since they result in the exact same test.

This example use of a scenario calling another scenario is overkill. Review the [[FitNesse.Tutorials.ScenarioTables.OriginalArticle|original article]] for a better example and a much more detailed explanation. This technique is useful when you have a complex abstract test scenario and you'll end up performing many tests using the same sequence of steps. The abstract scenario might require many parameters. However, for a given test, you might only need to vary 1. In that case, this is a good way to both capture the basic steps and then execute them.
[[#summary]]
# Summary
Congratulations. At this point, if you've worked through each of the tutorials, you are only lacking experience with Table Tables. You now know how to work effectively with FitNesse and Slim. You picked up several test refactoring and organization techniques along the way. You even saw a data-driven test in JUunit.

The key subject for this tutorial is Scenaro Tables:
* They describe an abstract sequence of steps.
* They are not immediately backed by a fixture.
* In fact, the scenario table binds to the most recently used Script table (this is somewhat simplified).
* The scenario table must perform validation, if any
* A scenario table can take any number of parameters
* The name of a scenario table is similar to how methods are named in script tables.
* Scenario tables can call other scenario tables. There is no inherent limit in FitNesse, but the table should be readable by a human.

At this point you should consider finishing your knowledge of FitNesse.Slim tables and work on the [[FitNesse.Tutorials.TableTables|Table Table Tutorial]].


[[FitNesse.Tutorials|<--Back]] or [[FitNesse.Tutorials.TableTables|Next Tutorial--->]]