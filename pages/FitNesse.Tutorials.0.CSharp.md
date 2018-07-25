---
title: FitNesse.Tutorials.0.CSharp
---
{:toc}
# Create C# Project
In a nutshell, you are going to create a C# project, add some classes and then add the DLL to the FitNesse path so that FitNesse can find and execute your C# Fixtures.

* Start Visual Studio
* Create a new Project (File:New:Project:Visual C#:Class Library) (I used C:\Projects\C_Sharp for the directory, Digital Video Recorder for the Name and Solution Name)

# Create Fixture to back Test Table
* Visual Studio creates a class called Class1.cs in the namespace DigitalVideoRecorder by default, rename Class1.cs to CreatePrograms.
* Remove all of the using statements automatically inserted by Visual Studio
* Save and build your solution.

# Determine Where Visual Studio Stores Your Generated DLL
* The DLL should be under the bin\Debug directory. In my case, the full path to my DLL is:
* ```C:\Projects\C_Sharp\DigitalVideoRecorder\DigitalVideoRecorder\bin\Debug```

# Update Page to have NSlim Configuration
* Add the required configuration to the top of your DigitalVideoRecorder page:

```
!define TEST_SYSTEM {slim}
{% raw %}
!define COMMAND_PATTERN {%m -r fitSharp.Slim.Service.Runner,c:\tools\nslim\fitsharp.dll %p}
{% endraw %}
!define TEST_RUNNER {c:\tools\nslim\Runner.exe}
```

* Add an import table so FitNesse will find the class in its namespace (above the Create Programs Table):

```
!|import|
|DigitalVideoRecorder|
```

# Add your code to Path
* Edit your page and add the following lines (above the table that is already there):

```
!path C:\Projects\C_Sharp\DigitalVideoRecorder\DigitalVideoRecorder\bin\Debug\DigitalVideoRecorder.dll
```

* Your page should now be:

```
!define TEST_SYSTEM {slim}
{% raw %}
!define COMMAND_PATTERN {%m -r fitSharp.Slim.Service.Runner,c:\tools\nslim\fitsharp.dll %p}
{% endraw %}
!define TEST_RUNNER {c:\tools\nslim\Runner.exe}

!path C:\Projects\C_Sharp\DigitalVideoRecorder\DigitalVideoRecorder\bin\Debug\DigitalVideoRecorder.dll

!define COLLAPSE_SETUP {true}
!define COLLAPSE_TEARDOWN {true}

!|import|
|DigitalVideoRecorder|
 
!|Create Programs|
|Name|Channel|DayOfWeek|TimeOfDay|DurationInMinutes|id?|
|House|4|Monday|19:00|60|$ID=|
```

* Click on the **Test** button, you should see some green and red now:
[[image:CSharpMissingMethods.gif width="800" height="787"]]

You have two tables in your page. The first table is an import table, it tells FitNesse to import that namespace (i.e. like using in .Net). That is, when looking for fixture classes (classes that process tables), look in this namespace. If you want to import multiple namespaces, use multiple rows (or duplicate the entire table).

The second table is a decision table. (Those familiar with Fit, may recognize the similarity between Decision Tables and Column Fixtures.) The first row names a class, CreatePrograms in this case. You created this class above. The second row names the columns. Column headers that do not have a question mark in their name require a "set" method to back them. Column headers with a question mark require a method that returns a value. In our case we have 6 columns, so we need to add 6 methods, 5 setters and one method which returns a value. Here's the complete "stub" class to get this table fully passing:

```csharp
using System;

namespace DigitalVideoRecorder
{
  public class CreatePrograms
  {
    private string _name;
    private int _channel;

    public void setName(String name)
    {
      _name = name;
    }

    public void setChannel(int channel)
    {
      _channel = channel;
    }

    public void setDayOfWeek(String dayOfWeek)
    {
    }

    public void setTimeOfDay(String timeOfDay)
    {
    }

    public void setDurationInMinutes(int durationInMinutes)
    {
    }

    public string id()
    {
      return String.Format("[{0}:{1}]", _name, _channel);
    }
  }
}
```

* Edit your CreatePrograms class and add the missing methods.
* Notice that the implementation of id() returns a String with the name and channel. As you'll see, this value will show up later.
* Make sure to build your project.

# Verify Your Tests Pass
* Switch back to your browser, click on the **Test** button. You should see something similar to this:
[[image:CSharpCongratulations.gif width="800" height="548"]]

# [Return and Complete Your Tutorial]({{ site.pagesurl}}/FitNesse.Tutorials.0#Congratulations)
 
