---
title: Acceptance_Testing.UsingSlimDotNetInFitNesse
---
{:toc}
[[FitNesse.Tutorials|<--Back]]

# Rapid Intro to using Slim with .Net
Thanks to Mike Stockdale for both writing the slim .Net implementation as well as helping me to get this working.
----
### Get SliM.net
Note, this tool is called fitsharp, but it is actually an implementation of Slim for FitNesse. So while this title of this section does not patch the tool title, it better represents what the tool is.
# Download a release zip from [[http://github.com/jediwhale/fitsharp/downloads|jediwhale's github account]]. Note, as of this update, the release version is called [[http://github.com/downloads/jediwhale/fitsharp/release.1.6.zip|release.1.6.zip]].
# Extract the zip's contents to some directory (I'll use c:\tools\nslim)
# This creates a directory structure as follows:
[[image:ExtractedNSlim.jpg]]
----
### Get FitNesse
[[include page="FitNesse.Installing"]]
----
### Starting FitNesse
All of the tutorials assume you are running FitNesse on port 8080. These instructions show you how to start FitNesse on port 8080.
# Start a command prompt (shell)
# CD to your install directory and then go fitnesse directory created above
* Start FitNesse(Windows):
```terminal
C:\slim\fitnesse>run.bat -p 8080

C:\slim\fitnesse>java -jar fitnesse.jar -p 8080
FitNesse (v20090220) Started...
        port:              8080
        root page:         fitnesse.wiki.FileSystemPage at ./FitNesseRoot
        logger:            none
        authenticator:     fitnesse.authentication.PromiscuousAuthenticator
        html page factory: fitnesse.html.HtmlPageFactory
        page version expiration set to 14 days.
```
* Start FitNesse(Unix):
```terminal
Macintosh-8% sh run.sh -p 8080
java -jar fitnesse.jar -p 8080
FitNesse (v20090406) Started...
	port:              8080
	root page:         fitnesse.wiki.FileSystemPage at ./FitNesseRoot
	logger:            none
	authenticator:     fitnesse.authentication.PromiscuousAuthenticator
	html page factory: fitnesse.html.HtmlPageFactory
	page version expiration set to 14 days.
```
----
### Update root page in FitNesse
Note, recent versions of FitNesse (after September 2009) do not require this step. The instructions will still work, there just won't be any work for you. And as mentioned above, these steps assume you're running FitNesse on your machine at port 8080, update the URL as necessary.
# Go to the following URL: http://localhost:8080/root
# Remove the following entries (if they are there)
```
!path classes
!path fitnesse.jar
```

In fact, it is safe to remove everything from the root page (and probably a good idea).
----
### Create a page with necessary configuration
Note, if you are just using FitNesse for .Net, then you could put this information on the root page (that's what I'd recommend in fact). For this example, I recommend using [[http://localhost:8080/FirstExample]].
```
!define TEST_SYSTEM {slim}
{% raw %}
!define COMMAND_PATTERN {%m -r fitSharp.Slim.Service.Runner,c:\tools\nslim\fitsharp.dll %p}
{% endraw %}
!define TEST_RUNNER {c:\tools\nslim\Runner.exe}
```
* The first line overrides FitNesse's default of executing tests using fit. Note that it is also possible to run in different VM's with this command as well.
* The second line points to the Runner.exe created when you build slim.net. Update the directory as necessary.
* The third line defines how FitNesse calls the Runner.

Other than updating the directories, you can use this as is. It can be on a page by itself (e.g. on the root page or a page at the top of your test hierarchy).
----
### Add references to your dll's
* Use a !path statement to add each dll in your solution.
```
!path C:\projects\slim_example\slim_example\obj\Debug\slim_example.dll
```

* You can optionally include the namespace using an import table (recommended):
```
|import|
|slim_example|
```
----
### Add a Test Table
Create a table. This is an example of a decision table taken from FitNesse itself. You can see the complete example at: http://localhost:8080/FitNesse.SliM.DecisionTable (of course update the URL as necessary).
```
|should I buy milk|
|cash in wallet|credit card|pints of milk remaining|go to store?|
|      0       |    no     |      0                |    no      |
|      10      |    no     |      0                |    yes     |
|      0       |    yes    |      0                |    yes     |
|      10      |    yes    |      0                |    yes     |
|      0       |    no     |      1                |    no      |
```

### Here's the complete page
This is all of the above as a single page, which is what I actually did for this eample:
```
!define TEST_SYSTEM {slim}
{% raw %}
!define COMMAND_PATTERN {%m -r fitSharp.Slim.Service.Runner,c:\tools\nslim\fitsharp.dll %p}
{% endraw %}
!define TEST_RUNNER {c:\tools\nslim\Runner.exe}

!path C:\projects\slim_example\slim_example\obj\Debug\slim_example.dll

|import|
|slim_example|

|Should I Buy Milk|
|cash in wallet|credit card|pints of milk remaining|go to store?|
|      0       |    no     |      0                |    no      |
|      10      |    no     |      0                |    yes     |
|      0       |    yes    |      0                |    yes     |
|      10      |    yes    |      0                |    yes     |
|      0       |    no     |      1                |    no      |
```
----
### Create the Fixture Code
Here's the C# class that supports the "should I buy milk" decision table:
```csharp
using System;
using System.Collections.Generic;

namespace slim_example
{
  public class ShouldIBuyMilk
  {
    private int _cash;
    private int _pintsOfMilkRemaining;
    private string _useCreditCard;

    public void SetCashInWallet(int cash)
    {
      _cash = cash;
    }

    public void SetCreditCard(string useCreditCard)
    {
      _useCreditCard = useCreditCard;
    }

    public void SetPintsOfMilkRemaining(int pints)
    {
      _pintsOfMilkRemaining = pints;
    }

    public string GoToStore()
    {
      if (_cash > 0 || _useCreditCard.Equals("yes"))
        return "yes";
      return "no";
    }
  }
}
```
Note, the methods execute(), reset() and table(...) should be optional. Eventually they will be, but this is a early release of the Slim.Net implementation.

There are three "hook" methods you can also add:
|| Execute() || Called once for each row, after setting all of the fields/attributes/properties (calling all of the setX methods). ||
|| Reset() || Called once for each row, after completely processing the entire row.  ||
|| Table(...) || Called once for each table, before everything else. ||

Here are example implementations for those methods:
```csharp
    public void Execute()
    {
      Console.WriteLine("Execute");
    }

    public void Reset()
    {
      Console.WriteLine("Reset");
    }

    public List<object> Table(List<List<String>> table)
    {
      Console.WriteLine("Table");
      return null;
    }
```

[[FitNesse.Tutorials|<--Back]]