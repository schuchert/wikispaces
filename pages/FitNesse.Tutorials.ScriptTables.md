---
title: FitNesse.Tutorials.ScriptTables
---
{:toc}[[FitNesse.Tutorials|<--Back]] or [[FitNesse.Tutorials.ScenarioTables|Next Tutorial--->]]
# Background: The Return of Smalltalk
This is a somewhat nostalgic background, you won't miss much if you [[FitNesse.Tutorials.ScriptTables#introduction|skip to the introduction]]. 

[[http://fitnesse.org/FitNesse.SliM.ScriptTable|Script tables]] originally derive from Do Fixtures in [[http://sourceforge.net/projects/fitlibrary|fitlibrary]]. However, the design for Do Fixtures actually derives from Smalltalk. In smalltalk there are three kinds of messages:
* Unary: no parameters
* Binary: + * %
* Keyword: inject:into:, to:do:, ifTrue:, ifTrue:ifFalse:

Here are a few examples:
```
aCollection inject: 0 into: [a, b | a + b]
balance > withdrawalAmount ifTrue: [allowTransation] ifFalse: [disallow transaction]
```

In the first line, one message inject:into: is sent to the object referred to by the variable aCollection. The parameters are 0 and [a, b | a + b], both objects. In the second example there are two messages: >, ifTrue:ifFalse:. The binary method > is sent to balance with the parameter withdrawalAmount. That method returns either true or false. The result of that evaluation (true or false) is then sent the message ifTrue:ifFalse: with the two blocks (blocks are created using []). If the result is true, then the implementation of instance method ifTrue:ifFalse:, on the True class, will execute/evaluate the first block passed in and ignore the second block. If the result is false, then the message ifTrue:ifFalse: will be sent to the single instance of False, which executes the second block and ignores the first block. 

Conceptually there is no conditional logic, it's all messages, methods and polymorphism.

Keyword messages, messages with one or more parameters, have parameters intermingled with the parts of the name of the method.

Here is an example of a script table from the end of this tutorial:
```
1: !|Script                    |Generate Programs                                                                              |
2: |$P1=                       |Create Weekly Program Named|W1|On Channel|7|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8 |
3: |Create Weekly Program Named|W2|On Channel|8|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8                             |
4: |show                       |TotalEpisodesCreated                                                                           |
5: |Create Daily Program Named |D1|On Channel|7|Starting On|3/4/2008|at|20:30|Length|30|Episodes|56                            |
6: |Create Daily Program Named |D2|On Channel|8|Starting On|3/4/2008|at|22:00|Length|30|Episodes|56                            |
7: |check                      |TotalEpisodesCreated|128                                                                       |
```

The name of this Fixture is GeneratePrograms. The Fixture class needs two methods:
* createWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes(...)
* createDailyProgramNamedOnChannelStartingOnAtLengthEpisodes(...)

You'll create this at the end of this tutorial.

This table style does lend itself to nicely naming Java/C#/C++ methods. The Smalltalk version, however does not look so bad (with the caveat that while it looks nice, it makes passing in many parameters a bit too easy):
```
| generateProgrmas, B |
generateProgrmas := GenerateProgrmas new.
B := generateProgrmas CreateWeeklyProgramNamed: 'W1' OnChannel: 7 StartingOn '3/4/2008' At: '21:00' Length: 60 Episodes: 8.
generatePrograms TotalEpisodesCreated.
generateProgrmas CreateDailyProgramNamed: 'D1" OnChannel: 8 StartingOn: '3/4/2008' At: '20:30" Length: 30 Episodes 56.
...
```

The spirit of the keyword message in Smalltalk was revived in the design of the do fixture and then carried over into Slim.
[[#introduction]]
# Introduction
In this tutorial, you'll continue working with the DVR problem, continuing right from where you left off in [[FitNesse.Tutorials.2|Query Tables Tutorial]]. You can use your code as is from the previous tutorial, or you can use the tag FitNesse.Tutorials.ScriptTables, review [[FitNesse.Tutorials.WorkingFromGitHub|here]] to figure out what to do with this tag.

In this tutorial you will learn how to use script tables to express things with sequences of messages rather than rows of data that are either created or queried. It is typically possible to express in script tables what you can do with decision tables and query tables. The reverse is also true. typically it is a matter of habit or taste. Sometimes, however, one expression is simply better than another.
# A First Script Table
The basis of your work will come from this user story:
>> As a avid TV watcher, I want to review my to do list by day to verify that my programs are getting recorded

To make this happen, we need to:
* Create a program schedule
* Add several items to the to do list
* Verify that the correct programs are on the to do list for a given day

Even though you have already created tables and fixtures to add programs to the program schedule, you'll experiment with other ways of adding programs to the program schedule using a Script Table. Technically, you can get a similar effect with Decision Tables. However, you might find one style easier than another in any given situation, so knowing script tables simply gives you more expressive power in your test writing.

Rather than using our original AddProgramToSchedule fixture, this is a new way to generate large amounts of programs:
```
!|Script|Generate Programs                                                                      |
|Create Weekly Program Named|W1|On Channel|7|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8 |
|Create Weekly Program Named|W2|On Channel|8|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8 |
|Create Daily Program Named |D1|On Channel|7|Starting On|3/4/2008|at|20:30|Length|30|Episodes|56|
|Create Daily Program Named |D2|On Channel|8|Starting On|3/4/2008|at|22:00|Length|30|Episodes|56|
```

There are three parts to this table:
* Row 1: Name the fixture, Generate Programs. Note, you can add additional cells to this line to pass in constructor arguments
* Rows 2 - 3: Invoke a method to generate programs on a weekly schedule
* Rows 4 - 5: Invoke a method to generate programs on a daily basis

### Creating Page Hierarchy/Table
* Create a new Test Suite: Edit the following URL: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScriptTableExamples]]
* Enter the following for its contents:
```
!contents -R2 -g -p -f -h
```
* Save this and set the page type to Suite.
* Edit the following URL (to add a child page): [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScriptTableExamples.CreatingManyProgramsExample]]
* Copy the table above into the contents of the page (replacing the !contents line)
* See the page type to Test.
* Run the test, verify that you see a warning (in yellow) of the missing Generate Programs class

## Create Initial Fixture
As with other tables, this table needs a backing fixture:
```java
package com.om.example.dvr.fixtures;

public class GeneratePrograms {
   public String CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes(
         String programName, int channel, String startDate, String startTime,
         int lengthInMinutes, int episodes) {
      return "";
   }

   public String CreateDailyProgramNamedOnChannelStartingOnAtLengthEpisodes(
         String programName, int channel, String startDate, String startTime,
         int lengthInMinutes, int episodes) {
      return "";
   }
}
```

This is simply a skeleton of the fixture. Update your fixture and verify that your table executes and passes. (Note, depending on the version of FitNesse you are using, returning a "" might cause problems. If the above does not give a successful test execution, replace "" with "n/a".)

## Write Fixture & Refactor
There is a lot of date-based logic spread throughout the fixtures and production code. This is a problem waiting to happen. Here's a recommendation to get this under control:
* Put all date-related stuff in a single place
* Prepare to use this singe place to create instances of dates as well

Why? This gives you the ability to set the system date and run the system with a different date/time. This is a need in many systems. In our DVR example it is not a problem (yet) so we'll start with a simple DateUtil class that implements itself as a singleton. This gives us the ability to introduce a test double later on if necessary.

Here is the new class, DateUtil, to capture all of the date formatting carried out by various parts of the solution. I added this to account for violations of the DRY principle. Rather than walk you through all of that, I'm simply providing my changes.
**Create: DateUtil.java**
```java
package com.om.example.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
   private static DateUtil INSTANCE = new DateUtil();

   private DateUtil() {
   }

   public static DateUtil instance() {
      return INSTANCE;
   }

   public static final SimpleDateFormat dateFormat = new SimpleDateFormat("M/d/yyyy");

   public String formatDate(Date startDateTime) {
      return dateFormat.format(startDateTime);
   }

   static SimpleDateFormat timeFormat = new SimpleDateFormat("h:mm");

   public String formatTime(Date startDateTime) {
      return timeFormat.format(startDateTime);
   }

   public String addDaysTo(int days, String nextStartDate) throws ParseException {
      Calendar calendar = Calendar.getInstance();
      calendar.clear();
      Date startingDate = dateFormat.parse(nextStartDate);
      calendar.setTime(startingDate);
      calendar.add(Calendar.DATE, days);
      return dateFormat.format(calendar.getTime());
   }

   public static final SimpleDateFormat dateTimeMergedFormat = new SimpleDateFormat(
         "M/d/yyyy|h:mm");

   public Date buildDate(String date, String startTime) throws ParseException {
      String dateTime = String.format("%s|%s", date, startTime);
      return dateFormat.parse(dateTime);
   }
}
```

**Update: AddProgramsToSchedule**
```java
   public void execute() throws ParseException {
      try {
         Program p = schedule.addProgram(programName, episodeName, channel, DateUtil
               .instance().buildDate(date, startTime), minutes);
         lastId = p.getId();
         lastCreationSuccessful = true;
      } catch (ConflictingProgramException e) {
         lastCreationSuccessful = false;
      }
   }
```
//**Note**//: When you make this change, you'll have an unused method, **buildStartDateTime**. Remove it.

**Update: TimeSlotPropertyHandler**
```java
package com.om.example.dvr.fixtures;

import java.util.Date;

import com.om.example.dvr.domain.TimeSlot;
import com.om.example.util.DateUtil;
import com.om.query.domain.ObjectDescription;
import com.om.query.handler.PropertyHandler;
import com.om.reflection.PropertyGetter;

public class TimeSlotPropertyHandler extends PropertyHandler {
   @Override
   public void handle(PropertyGetter propertyGetter, Object targetObject,
         ObjectDescription objectDescription) {
      TimeSlot timeSlot = propertyGetter.getValue(targetObject, TimeSlot.class);

      Date startDateTime = timeSlot.startDateTime;

      objectDescription.addPropertyDescription("date", DateUtil.instance().formatDate(
            startDateTime));
      objectDescription.addPropertyDescription("startTime", DateUtil.instance()
            .formatTime(startDateTime));
   }
}
```

**Update: GeneratePrograms**
```java
package com.om.example.dvr.fixtures;

import java.text.ParseException;

import com.om.example.util.DateUtil;

public class GeneratePrograms {
   AddProgramsToSchedule addProgramsToSchedule = new AddProgramsToSchedule();

   public String CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes(
         String programName, int channel, String startDate, String startTime,
         int lengthInMinutes, int episodes) throws ParseException {

      generateManyPrograms(programName, channel, startDate, startTime, episodes, 7);
      return addProgramsToSchedule.lastId();
   }

   public String CreateDailyProgramNamedOnChannelStartingOnAtLengthEpisodes(
         String programName, int channel, String startDate, String startTime,
         int lengthInMinutes, int episodes) throws ParseException {
      generateManyPrograms(programName, channel, startDate, startTime, episodes, 1);
      return addProgramsToSchedule.lastId();
   }

   private void generateManyPrograms(String programName, int channel, String startDate,
         String startTime, int episodes, int daysBetween) throws ParseException {
      String nextStartDate = startDate;
      for (int i = 0; i < episodes; ++i) {
         createOneProgram(programName, channel, startTime, nextStartDate, i);
         nextStartDate = DateUtil.instance().addDaysTo(daysBetween, nextStartDate);
      }
   }

   private void createOneProgram(String programName, int channel, String startTime,
         String nextStartDate, int i) throws ParseException {
      addProgramsToSchedule.setChannel(channel);
      addProgramsToSchedule.setDate(nextStartDate);
      addProgramsToSchedule.setEpisode(String.format("E%d", (i + 1)));
      addProgramsToSchedule.setName(programName);
      addProgramsToSchedule.setStartTime(startTime);
      addProgramsToSchedule.execute();
   }
}
```

Make sure with all of these changes, your page passes.
## Schedule Items in To Do List
Now that you've generated a schedule with several programs, it is time to create season passes. This fixture already exists:
```
|Create Season Pass For|W1|7|

|Create Season Pass For|W2|8|

|Create Season Pass For|D1|7|

|Create Season Pass For|D2|8|
```

Note, as the fixture is written, it takes parameters on the constructor. To use this fixture as is, you'll need to make sure there are blank lines as shown. Why? The blank line separates one table from the next. FitNesse will create four instances of the Fixture, calling the constructor four times, which is what you want. You could realize this is a deficiency in the way the fixture is written and update it to allow for multiple season passes. That exercise is left to the reader.

If you run your test, you should still see all green. As with previous tutorials, getting all green is not that difficult when there are no assertions in a test. Now it is time to verify something. To do that, it's time to return to Query Tables.

## Assert Contents
Now it is time to review the to do list by date rather than by program id. Here's just a fixture:
```
|Query:Episodes in to do list on|3/4/2008   |
|programName                    |episodeName|
|W1                             |E1         |
|W2                             |E1         |
|D1                             |E1         |
|D2                             |E1         |

|Query:Episodes in to do list on|3/5/2008   |
|programName                    |episodeName|
|D1                             |E2         |
|D2                             |E2         |
```

Here's the code to make this work:
**Create: EpisodesInToDoListOn.java**
```java
package com.om.example.dvr.fixtures;

import java.text.ParseException;
import java.util.List;

import com.om.example.dvr.domain.Program;
import com.om.example.util.DateUtil;
import com.om.query.QueryResultBuilder;
import com.om.query.domain.QueryResult;

public class EpisodesInToDoListOn {
   private final String date;

   public EpisodesInToDoListOn(String date) {
      this.date = date;
   }

   public List<Object> query() throws ParseException {
      List<Program> programs = CreateSeasonPassFor.getSeasonPassManager()
            .toDoListContentsOn(DateUtil.instance().formatDate(date));
      QueryResultBuilder builder = new QueryResultBuilder(Program.class);
      builder.register("timeSlot", new TimeSlotPropertyHandler());
      QueryResult result = builder.build(programs);
      return result.render();
   }
}
```

**Update: DateUtil.java**
```java
   public boolean isSameDate(Date startDateTime, Date date) {
      return formatDate(startDateTime).equals(formatDate(date));
   }

   public Date formatDate(String date) throws ParseException {
      return dateFormat.parse(date);
   }
```

**Update: Program.java**
```java
   public boolean isOn(Date date) {
      return DateUtil.instance().isSameDate(timeSlot.startDateTime, date);
   }
```

**Update: SeasonPassManager.java**
```java
   public List<Program> toDoListContentsOn(Date date) {
      List<Program> result = new LinkedList<Program>();

      for (Program current : toDoList)
         if (current.isOn(date))
            result.add(current);

      return result;
   }
```

Make all of these changes and execute your test. Notice anything? The first table shows that D1:E1 and D2:E1 are both missing. Apparently something is wrong with the code. There's not enough context to really know what is happening. Maybe we took too large of a leap. How can you fix this?

### Switching to Unit Tests
Here is a JUnit analog of the test page:
**Create: GenerateProgramsTest.java**
```java
package com.om.example.dvr.fixtures;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.om.example.dvr.domain.Program;
import com.om.example.util.DateUtil;

public class GenerateProgramsTest {
   private GeneratePrograms generatePrograms;

   @Before
   public void init() throws Exception {
      generatePrograms = new GeneratePrograms();
   }

   @Test
   public void ReviewToDoListByDay() throws Exception {
      generatePrograms.CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes("W1",
            7, "3/4/2008", "21:00", 60, 8);
      generatePrograms.CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes("W2",
            8, "3/4/2008", "21:00", 60, 8);
      generatePrograms.CreateDailyProgramNamedOnChannelStartingOnAtLengthEpisodes("D1",
            7, "3/4/2008", "20:30", 30, 56);
      generatePrograms.CreateDailyProgramNamedOnChannelStartingOnAtLengthEpisodes("D2",
            8, "3/4/2008", "22:00", 30, 56);

      new CreateSeasonPassFor("W1", 7);
      new CreateSeasonPassFor("W2", 8);
      new CreateSeasonPassFor("D1", 7);
      new CreateSeasonPassFor("D2", 8);

      List<Program> results = CreateSeasonPassFor.getSeasonPassManager()
            .toDoListContentsOn(DateUtil.instance().formatDate("3/4/2008"));
      assertEquals(4, results.size());
   }
}
```

Running this test indicates a similar problem (expected 4 by only found 2 in in results). Looks like the code is not failing fast. How could I tell? To figure out what happening I had to use the debugger. This is a code-smell and the problem is in all of this code, where is the failure happening?

Stepping through, I noticed that attempting to add the first Episode of D1 and D2 caused a problem with a conflicting program. This should not be happening, so that's where to check next. As I was running this, I also notice that I forgot to set the length of the episode.

**Update: GeneratePrograms.java**
```java
package com.om.example.dvr.fixtures;

import java.text.ParseException;

import com.om.example.util.DateUtil;

public class GeneratePrograms {
   AddProgramsToSchedule addProgramsToSchedule = new AddProgramsToSchedule();

   public String CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes(
         String programName, int channel, String startDate, String startTime,
         int lengthInMinutes, int episodes) throws ParseException {

      generateManyPrograms(programName, channel, startDate, startTime, lengthInMinutes,
            episodes, 7);
      return addProgramsToSchedule.lastId();
   }

   public String CreateDailyProgramNamedOnChannelStartingOnAtLengthEpisodes(
         String programName, int channel, String startDate, String startTime,
         int lengthInMinutes, int episodes) throws ParseException {
      generateManyPrograms(programName, channel, startDate, startTime, lengthInMinutes,
            episodes, 1);
      return addProgramsToSchedule.lastId();
   }

   private void generateManyPrograms(String programName, int channel, String startDate,
         String startTime, int minutes, int episodes, int daysBetween)
         throws ParseException {
      String nextStartDate = startDate;
      for (int i = 0; i < episodes; ++i) {
         createOneProgram(programName, channel, startTime, minutes, nextStartDate, i);
         nextStartDate = DateUtil.instance().addDaysTo(daysBetween, nextStartDate);
      }
   }

   private void createOneProgram(String programName, int channel, String startTime,
         int minutes, String nextStartDate, int i) throws ParseException {
      addProgramsToSchedule.setChannel(channel);
      addProgramsToSchedule.setDate(nextStartDate);
      addProgramsToSchedule.setEpisode(String.format("E%d", (i + 1)));
      addProgramsToSchedule.setName(programName);
      addProgramsToSchedule.setStartTime(startTime);
      addProgramsToSchedule.setMinutes(minutes);
      addProgramsToSchedule.execute();
   }
}
```

After a little time with the debugger, it because clear where the exception was getting lost:
**Update: AddProgramsToSchculed.execute()**
```java
   public void execute() throws ParseException {
      try {
         Program p = schedule.addProgram(programName, episodeName, channel, DateUtil
               .instance().buildDate(date, startTime), minutes);
         lastId = p.getId();
         lastCreationSuccessful = true;
      } catch (ConflictingProgramException e) {
         lastCreationSuccessful = false;
         throw e;
      }
   }
```
 
A quick test of the DateUtil.buildDate method shows a problem:
**Create: DateUtilTest.java**
```java
package com.om.example.util;

import static org.junit.Assert.assertEquals;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;

import org.junit.Test;

public class DateUtilTest {
   @Test
   public void CanCreateDateTimeFromStrings() throws ParseException {
      Date buildDate = DateUtil.instance().buildDate("1/3/2007", "23:45");
      Calendar calendar = Calendar.getInstance();
      calendar.clear();
      calendar.setTime(buildDate);
      assertEquals(2007, calendar.get(Calendar.YEAR));
      assertEquals(3, calendar.get(Calendar.DATE));
      assertEquals(Calendar.JANUARY, calendar.get(Calendar.MONTH));
      assertEquals(23, calendar.get(Calendar.HOUR_OF_DAY));
      assertEquals(45, calendar.get(Calendar.MINUTE));
      assertEquals(0, calendar.get(Calendar.SECOND));
   }
}
```

Which leads to a fix of an improperly extracted method:
**Update: DateUtil.java**
```java
   public Date buildDate(String date, String startTime) throws ParseException {
      String dateTime = String.format("%s|%s", date, startTime);
      return dateTimeMergedFormat.parse(dateTime);
   }
```

Run your unit tests, they should all now pass. At this point if you are not convinced that the tutorial took too big of a step trying to use primarily acceptance tests to drive the work, then you have a high threshold of pain. That was too much much broken stuff for too long along with too much time spent in the debugger.

## Verify Your Acceptance Tests
Now things seem to be working fine and the test passes. What about the entire suite? Run it. Notice that there was a reason why the AddProgramsToSchedule.execute() method did not throw an exception. Now that test fails with an exception. What can we conclude from this?
* First, it's good we have a suite. One button click and it's quick to spot the mistake.
* Writing one fixture to use another fixture, while OK, can lean to different goals.
* Using Fixtures in Unit Tests may drive a different design that using them from FitNesse pages.

This can be fixed:
**Update: GeneratePrograms.java**
```java
   private void createOneProgram(String programName, int channel, String startTime,
         int minutes, String nextStartDate, int i) throws ParseException {
      addProgramsToSchedule.setChannel(channel);
      addProgramsToSchedule.setDate(nextStartDate);
      addProgramsToSchedule.setEpisode(String.format("E%d", (i + 1)));
      addProgramsToSchedule.setName(programName);
      addProgramsToSchedule.setStartTime(startTime);
      addProgramsToSchedule.setMinutes(minutes);
      addProgramsToSchedule.execute();
      if (!addProgramsToSchedule.created())
         throw new ConflictingProgramException();
   }
``` 

**Restore: AddProgramsToSchedule.java**
```java
   public void execute() throws ParseException {
      try {
         Program p = schedule.addProgram(programName, episodeName, channel, DateUtil
               .instance().buildDate(date, startTime), minutes);
         lastId = p.getId();
         lastCreationSuccessful = true;
      } catch (ConflictingProgramException e) {
         lastCreationSuccessful = false;
      }
   }
```

Run your unit tests, they should pass. Run your top-level suite, everything should be back to passing. 

Finally, let's verify that in fact this change to the createOneProgram method actually does as expected. Attempt to force the exception to be thrown from createOneProgram:
**Add Test To: GenerateProgramsTest**
```java
   @Test(expected = ConflictingProgramException.class)
   public void GeneratingConflictingProgramsThrowsException() throws Exception {
      generatePrograms.CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes("N1",
            7, "3/4/2008", "21:00", 60, 1);
      generatePrograms.CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes("N2",
            7, "3/4/2008", "21:00", 60, 1);
   }
```

Make sure this test passes before moving to the next section.

# A Second Example
Here are a few addons to the table to show a few additional features of Script tables:
```
!|Script                    |Generate Programs                                                                              |
|$P1=                       |Create Weekly Program Named|W1|On Channel|7|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8 |
|Create Weekly Program Named|W2|On Channel|8|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8                             |
|show                       |TotalEpisodesCreated                                                                           |
|Create Daily Program Named |D1|On Channel|7|Starting On|3/4/2008|at|20:30|Length|30|Episodes|56                            |
|Create Daily Program Named |D2|On Channel|8|Starting On|3/4/2008|at|22:00|Length|30|Episodes|56                            |
|check                      |TotalEpisodesCreated|128                                                                       |
```

This table demonstrates some things you have not yet used:
* Using a ! at the beginning of a table tells FitNesse to not treat potential wiki words as wikiwords. E.g., TotalEpisodesCreated is a wikiword. If you do not include !, then this will not be treated as a method call.
* Variable assignment (line 2). The variable $P1 will be set to whatever is returned by the method called CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes.
* show is a keyword, it will simply show the result of calling the metod TotalEpisodesCreated
* check will verify that the method, which is TotalEpisodesCreated, equals the value 128
* If the line starts with one of a few keywords (check/check not/reject/ensure/show), then the name of the method begins in cell 2 and and the parameters are in the odd numbered cells. If not, then the name of the method begins in cell 1 and the parameters are in the even numbered cells.

Create this table:
* Go to the following URL: [[http://localhost:8080/FrontPage.DigitalVideoRecorderExamples.ScriptTableExamples.AnotherExample]].
* Replace the contents with the above table.
* Save your changes.
* Change the page type to a Test.

This requires a few changes to the existing fixture:
**Update: GeneratePrograms.java**
```java
public class GeneratePrograms {
   AddProgramsToSchedule addProgramsToSchedule = new AddProgramsToSchedule();
   int totalEpisodesCreated;

   public int TotalEpisodesCreated() {
      return totalEpisodesCreated;
   }

   // snip

   private void createOneProgram(String programName, int channel, String startTime,
         int minutes, String nextStartDate, int i) throws ParseException {
      addProgramsToSchedule.setChannel(channel);
      addProgramsToSchedule.setDate(nextStartDate);
      addProgramsToSchedule.setEpisode(String.format("E%d", (i + 1)));
      addProgramsToSchedule.setName(programName);
      addProgramsToSchedule.setStartTime(startTime);
      addProgramsToSchedule.setMinutes(minutes);
      addProgramsToSchedule.execute();
      if (!addProgramsToSchedule.created())
         throw new ConflictingProgramException();
      ++totalEpisodesCreated;
   }
}
```

Run your test and verify it passes. Rerun the suite and verify it passes.

# Summary
Congratulations, you've finished another tutorial and learned about Script tables. Script tables are a convenient way to introduce code-like sequences into your tests. They derive their design from Smalltalk keyword messages but other than that, they behave like other Slim tables:
* They are backed with a fixture
* They have one or more method invocations, one per line.
* There are several keywords you can start a line with such as show and check.
* The full method name is in parts, alternating with parameters passed in to the backing fixture.
* The method name starts in cell 1 if the line does not start with one of a small set of pre-defined keywords (check, reject, ...). Otherwise, it begins in cell 2.

While not demonstrated:
* The first line can take additional parameters, which are passed into the constructor
* The actual method name cells can be left blank after the first, in which case the name of the method will be shorter.

Now that you have worked with all of the basic table types, you might consider looking into [[FitNesse.Tutorials.ScenarioTables|Scenario Tables]] or [[FitNesse.Tutorials.TableTables|Table Tables]].

[[FitNesse.Tutorials|<--Back]] or [[FitNesse.Tutorials.ScenarioTables|Next Tutorial--->]]
 