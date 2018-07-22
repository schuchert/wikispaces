{:toc}
[[FitNesse.Tutorials|<--Back]]

# Introduction
This tutorial simply demonstrates each of the kinds of tables available in Slim using C#. Before getting started with this tutorial, make sure you understand [[Acceptance Testing.UsingSlimDotNetInFitNesse|this tutorial first]].

# Table Types
In Slim there are 5 major table types and one minor type (the import table):
|| Decision Table || A decision table allows individual rows to execute, one at a type. Typically used to insert data into the system for testing. This replaces the Column Fixture Table from Fit. ||
|| Query Table || A query table allows you to specify a number of rows expected from querying the system. Surplus or missing rows are clearly labeled. This replaces the Row Fixture Table from Fit. ||
|| Script Table || Individual rows represent individual method invocations. Can make tests more expressive, often used by developers looking for something more familiar. This replaces the doFixture from Fit Library. ||
|| Scenario Table || Describes a logical sequence of steps, the details of which can be deferred to different script tables. There is no equivalent to this table type in Fit or Fit Library. ||
|| Table Table || The body of the table is given to the fixture to do as it seems fit. This is equivalent to the Table Table from Fit. ||
|| Import Table || Lists namespaces to be searched for classes when executing tests. This is equivalent to the import table from Fit. ||

# The Examples
Here is the configuration information I used for the following examples:
|| Location of FitNesse || C:\tools\fitnesse ||
|| Command to start FitNesse || run -p 8080 ||
|| Version of Slim || 1.2 ||
|| Location of Slim || C:\tools\nslim ||
|| Location of C# Solution || C:\projects\slim_example\slim_example.sln ||
|| Location of generated DLL || C:\projects\slim_example\slim_example\bin\Debug ||
|| Full path to top-level of FitNesse Tests || http://localhost:8080/CsharpWithSlim ||

Given this information, the following definitions will make these examples work:
```
!define TEST_SYSTEM {slim}
{% raw %}
!define COMMAND_PATTERN {%m -r fitSharp.Slim.Service.Runner,c:\tools\nslim\fitsharp.dll %p}
{% endraw %}
!define TEST_RUNNER {c:\tools\nslim\Runner.exe}
 
!path C:\projects\slim_example\slim_example\obj\Debug\slim_example.dll
```

Also, all of classes for these tables reside in the same namespace, so an import table will help with that. The import table must appear on the page that is executing. Simply putting it in the top level page will not work. Instead, make it a SetUp page. Here's the contents of [[http://localhost:8080/CsharpWithSlimExamples.SetUp]]:
```
| import |
| slim_example |
```

The Page Hierarchy will ultimately be:
```
CsharpWithSlimExamples
  SetUp
  DecisionTableExample
  QueryTableExample
  ScripTableExample
  ScenarioTableExample
  TableTableExample
```
## Decision Table
Here's a example of a decision table ([[http://localhost:8080/CsharpWithSlimExamples.DecisionTableExample]]):
```
|Create Shows|5/6/2009                                                               |
|Name        |Episode                      |Channel|Start Time|Duration|Id?          |
|House       |Wilson Gets Mad              |8      |19:00     |60      |             |
|Chuck       |He Gets Kung Fu Power        |9      |19:00     |60      |             |
|Dr. Phil    |Episode #405:Teens in Trouble|3      |16:00     |60      |             |
|Dr. Who     |Yet another doctor           |12     |20:00     |30      |$lastProgram=|
```
The first row names the table, Create Shows, and requires that the underlying class have a constructor taking a single parameter.

The second row names the columns and requires that the underlying class:
* Has a field/property/method named Name, _name, _Name, setName (and for each of the columns up to and including Duration).
* Has a method named Id that returns some value.

The remaining rows represent data going into the system, one row at a time.

The last row uses the value returned from the Id() method and stores it in a variable. That variable is available for the rest of the page.

Here is a C# fixture to handle this Decision Table (there are more ways to write this class):
```csharp
using System;

namespace slim_example
{
  public class CreateShows
  {
    public String ProgramDate { get; set; }
    public String Name { get; set; }
    public String Episode { get; set; }
    public int Channel { get; set; }
    public String StartTime { get; set; }
    public int Duration { get; set; }
    public String LastId { get; set; }

    public CreateShows(string programDate)
    {
       ProgramDate = programDate;
    }

    public void Execute()
    {
      LastId = string.Format("{0}:{1}", Name, Channel);
    }

    public String Id()
    {
      return LastId;
    }
  }
}
```

Note that I've chosen to use auto properties, but you could use private fields (with or without a leading _, starting with or without a capital letter), setX() methods or regular properties.

The Constructor takes one parameter (and stores it). You'd probably use this as part of constructing objects. This information is passed into the constructor because it is the same for all rows. If you wanted to vary it by row, then you'd pass it in as one of the columns. The ID() method was mentioned above. Could you duplicate it per row? Yes. I just didn't do that.

The one thing not yet discussed is the Execute() method. This method is called after all of the columns without ? in their name have been processed but before the columns with ? in their name have been processed. In this example:
* Slim sets each of the fields, left to right (Name to Duration).
* Calls the Execute method.
* Calls the Id() method

As mentioned above, the last row will take the result of the Id() method, Dr. Who:12, and assign that value to $lastProgram.
## Query Table
Now for a query table ([[http://localhost:8080/CsharpWithSlimExamples.QueryTableExample]]):
```
!|Query:Get Programs On A Given Day And Channel|3/4/2009|3                 |
|Name                                          |Episode |StartTime|Duration|
|N1                                            |E1      |18:00    |60      |
|N1                                            |E2      |19:00    |60      |
|N1                                            |E3      |20:00    |60      |
```
The first row describes a table expecting a class called "GetProgramsOnAGivenDayAndChannel" with a constructor taking two parameters.

The second row names the fields that should be in the returned object. Note you ultimately create the results, to the actual names can be anything you want. You do not have to list all of the fields, just what you want to check. You can return more fields than you check.

The final 3 rows show the expected results from this query into the system.

The ! as the first character tells FitNesse to ignore embedded Wiki Words. If you did not put this, the "StartTime" column would be interpreted as a WikiPage name and would not process correctly. Your two options to fix this are to either introduce a space or put ! at the beginning of the table. You can do both, it won't hurt anything, but it's not necessary.

Here's a class that will get this table to pass:
```csharp
using System;
using System.Collections.Generic;

namespace slim_example
{
  public class GetProgramsOnAGivenDayAndChannel
  {
    public GetProgramsOnAGivenDayAndChannel(String date, int channel)
    {
    }

    public List<Object> Query()
    {
      var result = new List<Object>();

      for (int i = 1; i <= 3; ++i)
        AddOneObject(result, i);

      return result;
    }

    private void AddOneObject(ICollection<object> objects, int index)
    {
      var objectFields = new List<object>();

      AddName(objectFields);
      AddEpisode(objectFields, index);
      AddStartTime(objectFields, index);
      AddDuration(objectFields);

      objects.Add(objectFields);
    }

    private void AddName(List<object> objectDescription)
    {
      AddFieldNameAndValue(objectDescription, "Name", "N1");
    }

    private void AddEpisode(List<object> objectDescription, int index)
    {
      string episodeName = string.Format("E{0}", index);
      AddFieldNameAndValue(objectDescription, "Episode", episodeName);
    }

    private void AddStartTime(List<object> objectDescription, int index)
    {
      string startTime = string.Format("{0}:00", index + 17);
      AddFieldNameAndValue(objectDescription, "StartTime", startTime);
    }

    private void AddDuration(List<object> objectDescription)
    {
      AddFieldNameAndValue(objectDescription, "Duration", "60");
    }

    private void AddFieldNameAndValue(List<object> objects, string name, string value)
    {
      var fieldNameValue = new List<Object>();

      fieldNameValue.Add(name);
      fieldNameValue.Add(value);

      objects.Add(fieldNameValue);
    }
  }
}
```
## Script Table
A script table allows you more control over information going into methods. You can call different methods with a variable number of parameters. Here is one example ([[http://localhost:8080/CsharpWithSlimExamples.ScriptTableExample]]):
```
!|Script                    |Generate Programs                                                                              |
|$P1=                       |Create Weekly Program Named|W1|On Channel|7|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8 |
|Create Weekly Program Named|W2|On Channel|8|Starting On|3/4/2008|at|21:00|Length|60|Episodes|8                             |
|show                       |TotalEpisodesCreated                                                                           |
|Create Daily Program Named |D1|On Channel|7|Starting On|3/4/2008|at|20:30|Length|30|Episodes|56                            |
|Create Daily Program Named |D2|On Channel|8|Starting On|3/4/2008|at|22:00|Length|30|Episodes|56                            |
|check                      |TotalEpisodesCreated|128                                                                       |
```

The first line, as with the previous examples, names the class. In this case it is GeneratePrograms. While there are no parameters sent to a constructor, you can add additional cells to this line to pass parameters into a constructor.

The second line executes a method with a rather long name: CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes. The name is formed by taking the first cell that involves part of a method name (in this case the cell with "Create Weekly Program Named") and then taking each of the alternating cells. The parameters passed into this method are: W1, 7, 3/4/2008, 21:00, 60, 8. The result of that method invocation is stored in the variable $P1.

The third line uses a keyword,// **show**//, that simply calls the method named "TotalEpisodesCreated" and then displays the result during test execution.

The next two lines call another method with a long name: CreateDailyProgramNamedOnChannelStartingOnAtLengthEpisodes. The naming rules are the same. Since the first cell does not involve a variable assignment or a keyword like// **show**// or// **check**//, the name of the method starts in the first cell. The parameters passed in are the alternating cells starting with D1, and they are: D1, 7, 3/4/2008, 20:30, 30, 56.

The final line uses a keyword,// **check**//, to call a method called "TotalEpisodesCreated" and compares the return of that method to the next value, 128.

Here's the code to get this table to pass:
```csharp
namespace slim_example
{
  public class GeneratePrograms
  {
    private int _totalEpisoesCreated;

    public string CreateWeeklyProgramNamedOnChannelStartingOnAtLengthEpisodes(
      string name, int channel, string startDate, string startTime, int length,
      int episodeCount)
    {
      _totalEpisoesCreated += episodeCount;
      return string.Format("{0}:{1}", name, channel);
    }

    public int TotalEpisodesCreated()
    {
      return _totalEpisoesCreated;
    }

    public void CreateDailyProgramNamedOnChannelStartingOnAtLengthEpisodes(
      string name, int channel, string startDate,
      string startTime, int length,
      int episodeCount)
    {
      _totalEpisoesCreated += episodeCount;
    }
  }
}
```
## Scenario Table
A scenario table describes a logical sequence of steps. By itself it does not require a backing class. Here is an example scenario table ([[http://localhost:8080/CsharpWithSlimExamples.ScenarioTableExample]]):
```
!|Scenario                   |dvrCanSimultaneouslyRecord|number|andWithThese|seasonPasses|shouldHaveTheFollowing|toDoList|
|givenDvrCanRecord           |@number                                                                                    |
|whenICreateSeasonPasses     |@seasonPasses                                                                              |
|thenTheToDoListShouldContain|@toDoList                                                                                  |
```

The first line serves two purposes:
* Names the scenario
* Defines the parameters.

The name of the scenario starts with the first cell after the "Scenario" cell and it has the value: dvrCanSimultaneouslyRecord. The full name of the scenario involves all of the even numbered cells:
* dvrCanSimultaneouslyRecord
* andWithThese
* shouldHaveTheFollowing

To determine the full name, FitNesse will capitalize the first letter of each of the parts and allow spaces (or not). So the name of the scenario is: Dvr Can Simultaneously Record And With These Should Have The Following.

The parameters are in the odd numbered cells excluding the first cell. Those parameters are:
* number
* seasonPasses
* toDoList

After the first row, subsequent rows describe individual steps and optionally refer to input parameters. In this example, the scenario has three steps:
* givenDvrCanRecord
* whenICreateSeasonPasses
* thenTheToDoListShouldContain

This particular naming style derives from a [[http://cukes.info/|story running tool called Cucumber]]. The first line starting with the word "given" is something related to test setup. The second line, starting with "when" is an execution step. The final step, starting with "then" is a validation step. This has nothing to do with FitNesse, this is just a style of writing tests.

As mentioned, scenario tables do not require any class to exist. However, when a page// **uses**// a scenario, then the most recent script is will require some methods based on most recently mentioned script.

Here is a complete page that([[http://localhost:8080/CsharpWithSlimExamples.ScenarioTableExample]]):
* Defines a scenario
* Mentioned a random script
* Uses the scenario

```
!|Scenario                   |dvrCanSimultaneouslyRecord|number|andWithThese|seasonPasses|shouldHaveTheFollowing|toDoList|
|givenDvrCanRecord           |@number                                                                                    |
|whenICreateSeasonPasses     |@seasonPasses                                                                              |
|thenTheToDoListShouldContain|@toDoList                                                                                  |

|Script|Some Random Script|

|Dvr Can Simultaneously Record And With These Should Have The Following|
|number                       |seasonPasses   |toDoList                |
|1                            |D5_1:5,D6_1:6  |D5_1:E:1-7              |
```

The middle table mentions a script literally called "Some Random Script".

The final table names the scenario and therefore requires some class handle the scenario. Since the most recently mentioned script table was "Some Random Script", Slim will look for a class called SomeRandomScript. Furthermore, the scenario has three lines, and therefore three required methods that the class SomeRandomScript must have:
* givenDvrCanRecord
* whenICreateSeasonPasses
* thenTheToDoListShouldContain

Note that the name of the method can start with a lower case letter, but Slim will also look for a capital first letter.

Here is a class that will get this page to pass:
```csharp
namespace slim_example
{
  public class SomeRandomScript
  {
    public void GivenDvrCanRecord(int numberOfRecorders)
    {
    }

    public void WhenICreateSeasonPasses(string seasonPasses)
    {
    }

    public void ThenTheToDoListShouldContain(string expectecdContents)
    {
    }
  }
}
```
## Table Table
With a table table, you are given the table, minus the first row, and can do anything you wish. Here is one such example ([[http://localhost:8080/CsharpWithSlimExamples.TableTableExample]]):
```
!|Table:CreateOneDayProgramGuide|1:00|3/4/2008|
|   |1   |2   |3   |4   |5   |6   |7   |8   |9   |10  |11  |12  |13  |14  |
|200|aaaa|BBcc|cccc|ccDD|DDee|efff|ffff|fffg|gggg|gggh|hhii|jklm|nopq|rstt|
|247|aaaa|BBBB|cccc|DDDD|eeee|FFFF|gggg|HHHH|iiii|JJJJ|kkkk|LLLL|mmmm|NNNN|
|302|aaBB|ccDD|eeFF|ggHH|iiJJ|kkLL|mmNN|ooPP|qqRR|ssTT|uuVV|wwww|wwXX|XXXy|
|501|    |    |    |    |    |aaBB|ccDD|eeFF|ggHH|iiJJ|kkLL|mmNN|ooPP|qqRR|
|556|    |__aa|BBcc|DDee|FFgg|HHii|JJkk|LLmm|NNoo|PPqq|RRss|TTuu|VVxx|xxxx|
```

The class is called CreateOneDayProgramGuide. Note you can use spaces if you wish. This class, apparently, has a 2-argument constructor. When the fixture is executed, it receives all but the first row as a List<List<String>. You can choose to do what you wish with this code.

Here is a fixture to handle this example:
```csharp
using System;
using System.Collections.Generic;

namespace slim_example
{
  public class CreateOneDayProgramGuide
  {
    public CreateOneDayProgramGuide(string startDate, string startTime)
    {
    }

    public List<object> DoTable(List<List<String>> table)
    {
      return null;
    }
  }
}
```
# Summary
This is simply a quick summary of the types of tables available and minimal code to get those fixtures to pass. There's much more to consider in terms of test design and connecting test fixtures to production code. You can get an idea of how to proceed looking at the [[FitNesse.Tutorials#JavaTutorials|Java tutorials]].

[[FitNesse.Tutorials|<--Back]]