---
title: FitNesse.Tutorials.ScenarioTables.OriginalArticle
---
# Motivation
This tutorial exists because I did not really understand Scenario Tables even though I was using them. At a customer site, I noticed a developer had an Uber Scenario Table representing a scenario with complete flexibility in all of its parameters (and this was a good thing). However, when it was time to make tests use the scenario table, he wanted to fill in some of the parameters with fixed values for several tests and did so by copying the table (this was a bad thing).

We discussed this with Bob Martin and he recognized this as a form of [currying from functional programming](http://en.wikipedia.org/wiki/Currying). Scenario tables are really just one or more function invocations on a fixture (know as the Actor in FitNesse, see Sidebar: 
[[FitNesse.Tutorials.ScenarioTables#Scenario Actors|Scenario Actors]]) with parameters passed in. What the developer wanted was a form of this table(function) taking fewer parameters(currying), with some of the parameters hard coded. E.g.,
>> [[include page="FitNesse.Tutorials.ScenarioTables.CurryingFunctions"]]

Bob magically did this using FitNesse.SliM-based tables and then I spent quite a bit of time trying to understand the mechanics. As a result, I figured I better write something to remember this because while now it is obvious, it was not at the time.

# Background
Scenario Tables are a way to express a sequence of steps required as part of an automated acceptance test. A Scenario table takes a number of parameters, specified as part of its name, and then expresses one or more steps, any of which may use any of the parameters provided.

In a nutshell, if you have a standard sequence of steps you need to follow as part of a number of tests with potentially different data values, a Scenario table may be just what you need.

The steps in a Scenario table ultimately become method invocations on an Actor (more on this later). Since a Scenario table potentially executes multiple steps and does not return anything, validation for a test will typically reside in the scenario table. In this respect, they may seem like a data-driven test from xUnit. However, a Scenario table makes demands on the fixture(actor) to which it binds. That is, if a scenario table ultimately invokes a function called X, then that function must exist on the fixture to which the invocation binds. In this respect, a scenario has similarities with interfaces or abstract methods. At one point, I though of them as similar to Ruby modules, but that model wasn't correct since Scenario tables impose a requirement, they do not add methods to anything. The requirements are imposed on the ultimate actor.

[[#Scenario Actors]]
[[include page="sidebar_start"]]<span class="sidebar_title">Scenario Actors</span>
A Scenario table puts requirements on some class, know as its actor. The Actor can be set in one of three ways:
* Using a start line in a Scenario, as [[FitNesse.Tutorials.ScenarioTables#ExampleOfStartInScenario|demonstrated below]]
* Introducing a Script table and then giving it a Start line:
```
|script|
|Attempt Login And Validate Results|
```
* Introducing a Script table and putting the name after the Script:
```
|script|Attempt Login And Validate Results| 
```
* If none of these exist, you'll get an error similar to:
```
The instance scriptTableActor. does not exist
```
This is somewhat simplified, but it gets the point across. 

//**[[FitNesse.Tutorials.ScenarioTables#skipPastScenarioActorsSidebar|Warning you can probably skip past the rest of this sidebar]]**//
Scenarios with Actors and scripts set the "global actor". So it might seem that a script before a decision table using a scenario would change the actor. It does,// **but**// the decision table is really a call to the Scenario, so the Scenario, which is basically a text substitution, occurs after the script and sets the global actor.

Bob is considering switching to a stack-based scheme to avoid pollution of the actor across siblings. In this scheme, if a sibling introduces an actor, when the test concludes, the actor will be reset to what it was just before the test executed. This removes a possible dependence upon the execution order of tests. For example, imagine a test that uses a scenario but does not itself set the actor. If the tests is run by itself it would fail. However, if another test runs before it and sets the global actor, then the test might pass. A stack-based scheme would address this kind of problem. The test would consistently fail in both situations. 
[[include page="sidebar_end"]]
[[#skipPastScenarioActorsSidebar]]
# Using Scenario Tables
Imagine you have a need to perform some test that requires several steps. You want to perform those same steps across several test cases where all parts of the test can be parameterized, even the expected results. For example, image you want to validate a Login Service with the following requirements (these are actual requirements from a project I worked on, these are not made up - well at least not by me):
* Logging in requires a user name and password (both alphanumeric)
* If a user fails to enter the correct password 3x in a row, their account is revoked and an administrator is required to enable the account
* If a user fails less than 3x in a row and then uses a different account, the failed count resets.
* An account is restricted to 4 concurrent logins. If a user attempts to log in a 5th time, then the user can reset the logins and try to log in again.
* If a user has not logged in for 30 days, their account is revoked when they attempt to log in.
* If a user logs in and their password is 30 days old, they must change their password before they can do anything else.
* If the account was enabled by an administrator or it is the user's first time to log in, they must reset the password. The user must be informed of the different reasons for being forced to reset the password.
* The user cannot use any of their past 24 passwords when changing passwords.

The first requirement suggests that there are user accounts, with names and passwords, both of which are alphanumeric. So that suggests some data validation such as:
* zero-length
* valid alpha numeric
* containing non alpha-numeric characters

The next bullet suggests that a user can attempt unsuccessfully to log in several times, up to 3, before their account is revoked. It also suggests one possible outcome, a revoked account, which also happens to be an initial condition for some tests.

Continuing, you can derive the following additional things that tests might need to check:
* An account can have a status of normal, revoked, expired password
* An account can have no more than 4 concurrent logins before the logins must be reset
* Accounts must exist

So trying to generalize this is may be overkill, but using a simple example will help keep the focus on Scenario tables rather than the problem requirements. Here are the possible steps involved in validating most of these requirements:
* Create an account with some initial status
* Attempt to log in with a name and password a number of times (up to 3)
* Validate the name and password and the expected final status of the account

Notice that we could use a Script table. However, we'll instead use a scenario table. Why? I want to specify these steps abstractly. Then I want to express multiple scenarios with some of the parameters hard-coded. To do that I'll create new scenario tables that use the original one with some of the parameters already filled in.

[[#ExampleOfStartInScenario]]
# The First Attempt
Here's an example test page with this scenario:
```
!|Scenario     |attempt|times    |logins to   |accountName|with     |password|andIn|status|expecting|result|
|start         |AttemptLoginAndValidateResults                                                             |
|createAccount |@accountName     |withPassword|@password  |inStatus |@status                               |
|attempt|@times|loginsTo         |@accountName|with       |@password                                       |
|check         |lastLoginResultIs|@result                                                                  |
```
[[include page="sidebar_start"]]<span class="sidebar_title">Using Slim versus Fit in FitNesse</span>
By default, FitNesse uses fit to execute tests. To instead configure FitNesse to use Slim, you must redefine the TEST_SYSTEM variable for the page you want to use Slim. Variable definitions are searched up the page hierarchy. Assuming this page is under the FrontPage (that's how I created it, though it could easily be a sibling of the FrontPage instead), then there are three places where this variable could be defined:
* The page itself
* On FrontPage
* On root

In these examples, I am sticking to Slim by default. Also, I started FitNesse on port 8080. Therefore, to edit the root page, I entered the following url: [[http://localhost:8080/root?edit]]. I then added the following line at the bottom of the page:
```
!define TEST_SYSTEM {slim}
``` 

You might wonder, can you execute some tests using Slim and some using Fit. You can. The TEST_SYSTEM variable is inherited along the page hierarchy (which is normally like a directory structure). Of course, FitNesse allows for symbolic links, so the hierarchy is not necessarily a simple tree.
[[include page="sidebar_end"]]
If you attempt to execute this test (once you've set its page type to test), not much happens. You'll see a yellow bar indicating that nothing ran. A scenario by itself does not execute.

So now we'll use this scenario in a decision table:
```
|Attempt Logins To With And In Expecting  |
|times|accountName|password|status|result |
|1    |brett      |secret  |valid |success|
```

This does attempt to use the scenario. The first row names the scenario (see Sidebar: Scenario Names). The next row names the parameters. The final row matches the parameters to the invocation of the scenario (see Sidebar: Important! Scenario Parameter Matching). 

[[include page="sidebar_start"]]<span class="sidebar_title">Scenario Names</span>
Consider the Scenario defined above. How does FitNesse determine its name?
# FitNesse only considers the first row
# FitNesse strips off the word Scenario
# FitNesse then uses the first cell (after scenario is dropped) and all subsequent alternating cells
# Finally, FitNesse concatenates all of the remaining parts and uses consistent camel-case notation

The example above starts with:
```
!|Scenario     |attempt|times    |loginsTo   |accountName|with     |password|andIn|status|expecting|result|
```
Now drop Scenario:
```
|attempt|times    |loginsTo   |accountName|with     |password|andIn|status|expecting|result|
```
Next, starting with attempt, only include the alternating cells:
```
|attempt|logins to|with|andIn|expecting|
```
Finally, put them all together (separate the parts of the name with spaces and use upper or lower case lettering).
```
Attempt Logins To With And In Expecting 
```
[[include page="sidebar_end"]]

[[include page="sidebar_start"]]<span class="sidebar_title"> Important! Scenario Parameter Matching</span>
This example uses a decision table to execute the scenario. A decision table has a minimum of three rows:
# First row indicates the name of the fixture (or scenario in this case)
# Second row defines column headers (ignored in this case because it is a scenario)
# Third row is the first of potentially many executions

FitNesse matches parameters //**by order**//, not name. The second row is a nice way to document your intentions but think of a scenario as one or more method invocations. Method invocations in most languages are matched by order, not type. That's how FitNesse performs the matching.
[[include page="sidebar_end"]]

# From Red/Yellow to Green
The Scenario is Red (if you create this page and executed it, that's what you'll see). However, when you open up the scenario, it shows several yellow rows, indicating a missing class. Here a Java class to make this test fully pass (for you C# users, this is basically the same):
```java
package com.om.example.scenario;

public class AttemptLoginAndValidateResults {
   public boolean createAccountWithPasswordInStatus(String accountName, String password, String status) {
      return true;
   }

   public void attemptLoginsToWith(int attempts, String account, String password) {
   }

   public String lastLoginResultIs() {
      return "success";
   }
}
```

Note, the page needs to be updated for this to run. You need to add:
* A path to point to the source code.
* An import statement so FitNesse can find the class in the package.

Here is a complete version of that page:
```
!path /Users/schuchert/workspaces/FitNesseTutorialScenarioTables/ScnearioExample/bin

|import|
|com.om.example.scenario|

!|Scenario     |attempt|times    |loginsTo   |accountName|with     |password|andIn|status|expecting|result|
|start         |AttemptLoginAndValidateResults                                                            |
|createAccount |@accountName     |withPassword|@password |inStatus |@status                               |
|attempt|@times|loginsTo         |@accountName|with      |@password                                       |
|check         |lastLoginResultIs|@result                                                                 |

|Attempt Logins To With And In Expecting                      |
|times|accountName|password|status          |result           |
|1    |brett      |secret  |valid           |success          |
```
# More Than 1 Test
Now that you have one test, it's not a big leap to turn this into more tests:
```
|Attempt Logins To With And In Expecting                      |
|times|accountName|password|status          |result           |
|1    |brett      |secret  |valid           |success          |
|1    |brett      |secret  |do not create   |account not found|
|1    |brett      |secret  |revoked         |account revoked  |
|1    |brett      |secret  |password expired|password expired |
```

If you update the table and then the Java source, you should see 4 passing scenarios:
```java
package com.om.example.scenario;

public class AttemptLoginAndValidateResults {
   private String lastLoginResult;
   
   public boolean createAccountWithPasswordInStatus(String accountName, String password, String status) {
      if("valid".equalsIgnoreCase(status))
         lastLoginResult = "success";
      
      if("do not create".equalsIgnoreCase(status))
         lastLoginResult = "account not found";

      if("revoked".equalsIgnoreCase(status))
         lastLoginResult = "account revoked";
      
      if("password expired".equalsIgnoreCase(status))
         lastLoginResult = "password expired";
      
      return true;
   }

   public void attemptLoginsToWith(int attempts, String account, String password) {
   }

   public String lastLoginResultIs() {
      return lastLoginResult;
   }
}
```

[[include page="sidebar_start"]]<span class="sidebar_title">This is Just FitNesse</span>
FitNesse is a tool that allows you to write automated (acceptance) tests against production code. The Java code I'm providing does not execute against production code. Why? I'm trying to focus on just FitNesse. The backing code for a Login Service, while possibly interesting, is irrelevant to FitNesse. FitNesse calls Slim, Slim calls your Fixture code. Your fixture code calls the production code. Therefore, to demonstrate FitNesse, I only need to show as far as the Fixture code because neither FitNesse nor Slim call your production code, the Fixtures you write do that.

By the way, this same principle applies to writing unit tests.
[[include page="sidebar_end"]]

Did you notice the duplication in this table? We can improve on this table by creating a new Scenario that uses the old scenario. The new scenario will take in fewer parameters and hard-code some of original Scenario's parameters. Here is just such a table:
```
|Scenario|Attempt Single Login With Status|status  |Expecting|result                                       |
|attempt |1                               |loginsTo|brett    |with  |secret|andIn|@status|expecting|@result|
```

This is a new scenario called "Attempt Single Login With Status Expecting". It accepts two parameters:
* status
* result

It is defined in terms of another scenario: "Attempt Logins To With And In Expecting". How? What FitNesse does is to first figure out the name of the method. There's no scenario, so no need to drop that word. Next, it concatenates  the odd cells. Finally, FitNesse sees if there's a Scenario table matching the name. Since there is, it instead uses that scenario table.

This is in fact all just text substitution. FitNesse:
* First sees a method
* Notices that it matches a scenario
* Replaces with the scenario 
* FitNesse then notices that the scenario now names maps to a Fixture called AttemptLoginAndValidateResults (based on the start line in the scenario).

How do you invoked this new scenario?
```
|Attempt Single Login With Status Expecting|
|status          |result                   |
|valid           |success                  |
|do not create   |account not found        |
|revoked         |account revoked          |
|password expired|password expired         |
```

Here is the entire page with all of these tables together on the same page:
```
!path /Users/schuchert/workspaces/FitNesseTutorialScenarioTables/ScnearioExample/bin

|import|
|com.om.example.scenario|

!|Scenario     |attempt|times    |loginsTo   |accountName|with     |password|andIn|status|expecting|result|
|start         |AttemptLoginAndValidateResults                                                            |
|createAccount |@accountName     |withPassword|@password |inStatus |@status                               |
|attempt|@times|loginsTo         |@accountName|with      |@password                                       |
|check         |lastLoginResultIs|@result                                                                 |

|Attempt Logins To With And In Expecting                      |
|times|accountName|password|status          |result           |
|1    |brett      |secret  |valid           |success          |
|1    |brett      |secret  |do not create   |account not found|
|1    |brett      |secret  |revoked         |account revoked  |
|1    |brett      |secret  |password expired|password expired |

|Scenario|Attempt Single Login With Status|status  |Expecting|result                                       |
|attempt |1                               |loginsTo|brett    |with  |secret|andIn|@status|expecting|@result|

|Attempt Single Login With Status Expecting|
|status          |result                   |
|valid           |success                  |
|do not create   |account not found        |
|revoked         |account revoked          |
|password expired|password expired         |
```

If you finally put all of this together with the last version of the Java class, everything should pass.

# Conclusion
There is more to discuss regarding Scenario tables. First, while this example demonstrates explicitly setting the actor for a scenario, that is not required and leaving it undefined allows for interesting possibilities. In fact, this is Bob's preference.

However, this simple example does demonstrate a few key characteristics of Scenario tables:
* Scenario tables express a sequence of method invocations involved in a test
* Typically a Scenario table performs validation
* Scenario tables ultimately result in one or more method calls to an underlying fixture, known as the actor

When you need to express a sequence of steps as part of a test, a Script or Scenario table is possibly in order. If you need to perform those same steps across many tests with different data sets or with different implementation of the underling methods, then a Scenario table is probably a good bet.
 