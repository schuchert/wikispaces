---
title: Mockito.LoginServiceExample
layout: default
---
{% include toc %}

<section>
## Getting Started
I'm assuming you can [download Mockito](http://mockito.org/) and get it in your classpath. So I'll start with tests that implement some of the requirements from [here](Tdd.Problems.LoggingIn).

However, in a nutshell:
* Download mockito-all-1.7.jar [from here](http://mockito.org/).
* Create a new Java project in your favorite IDE
* Add that jar to your project's classpath
* Add JUnit 4 to your project's classpath
</section>

<section>
## Writing The Tests
What follows is a series of tests to get enough production code written to suggest a better implementation. The first purpose of this tutorial is to demonstrate using Mockito for all types other than the underling LoginService. This is close to a [classic mockist approach](http://martinfowler.com/articles/mocksArentStubs.html#SoShouldIBeAClassicistOrAMockist), though it varies in that I'm emphasizing testing interaction rather than state and deliberately trying to write stable tests that do not depend too much on the underling implementation. In support of this: 
* All types used or needed by the underling LoginService will be represented as Interfaces (Interfaces will start with an I).
* All types used or needed by the underling LoginService will be created via Mockito
* I'm going to use Loose mocks - that is, you can call anything you want and the underling object will not complain
* I'm going to minimally verify the expected resulting interactions (one assertion per test)
* I'll start with only refactoring the unit tests, refactoring the production code is in [the next part](Mockito.LoginServiceExample#refactorproduction).
</section>

<section>
## Test 1: Basic Happy Path
When a user logs in successfully with a valid account id and password, the account's state is set to logged in. Here's a way to test that:

{% highlight java %}
package com.om.example.loginservice;

import org.junit.Test;
import static org.mockito.Mockito.*;

public class LoginServiceTest {

   @Test
   public void itShouldSetAccountToLoggedInWhenPasswordMatches() {
      IAccount account = mock(IAccount.class);
      when(account.passwordMatches(anyString())).thenReturn(true);

      IAccountRepository accountRepository = mock(IAccountRepository.class);
      when(accountRepository.find(anyString())).thenReturn(account);
      
      LoginService service = new LoginService(accountRepository);
      
      service.login("brett", "password");
      
      verify(account, times(1)).setLoggedIn(true);
   }
}
{% endhighlight %}

### Test Description
^
|**Part 1**| This test first creates a test-double for an IAccount. There's no actual account class, just the interface. This test-double is configured so that no matter what password is sent to it, it will always return true when asked if a provided password matches its password.|
|**Part 2**|Create a test-double for an IAccountRepository. Associate the test-double IAccount with the test-double IAccountRepository. When asking for any account with an id equal to any string, return the account test-double created at the start of this method.|
|**Part 3**|Create a LoginService, injecting the IAcccountRepsitory in the constructor. This is an example of Inversion of Control, rather than the LoginService knowing which IAccountRepository to talk to, it is told which one to talk to. So while the LoginService knows which messages to send to an IAccountRepository, it is not responsible for deciding to**which** instance it should send messages.|
|**Part 4**|Actually send a login message, looking for account with id "brett" and a password of "password". Notice that if things are configured correctly, any account id will match as will any password.|
|**Part 5**|Use the Mockito method verify (confirm) that the method setLoggedIn(true) was called exactly once.|

### Things Created for Compilation
To get this test to compile (but not yet pass), I had to create a few interfaces and add some methods to them. I also had to create a LoginService class:
#### IAccount

{% highlight java %}
package com.om.example.loginservice;

public interface IAccount {
   void setLoggedIn(boolean value);
   boolean passwordMatches(String candidate);
}
{% endhighlight %}

#### IAccountRepository
{% highlight java %}
package com.om.example.loginservice;

public interface IAccountRepository {

	IAccount find(String accountId);
}
{% endhighlight %}

#### LoginService
{% highlight java %}
package com.om.example.loginservice;

public class LoginService {
  public LoginService(IAccountRepository accountRepository) {
  }

  public void login(String accountId, String password) {
  }

}
{% endhighlight %}

Creating the test and adding all of theses classes gets my first test to Red with the following error:
{% highlight terminal %}
org.mockito.exceptions.verification.WantedButNotInvoked: 
Wanted but not invoked:
iAccount.setLoggedIn(true);
	at com.om.example.loginservice.LoginServiceTest.ItShouldSetAccountToLoggedInWhen
PasswordMatches(LoginServiceTest.java:16)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	<<snip>>
{% endhighlight %}

While the stack trace looks a little daunting, the error seems clear enough. As you'll see, adding a little bit of code in the LoginService class will get the test passing.

### Code Updated to get Test to turn Green
#### Update: LoginService
The test as written requires that the production code (LoginService) sends a message to a particular IAccount object. The LoginService retrieves accounts via its IAccountRepository, which it received during construction. So all we need to do is remember that particular IAccountRepository object and use it:
{% highlight java %}
package com.om.example.loginservice;

public class LoginService {
   private final IAccountRepository accountRepository;

   public LoginService(IAccountRepository accountRepository) {
      this.accountRepository = accountRepository;
   }

   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);
      account.setLoggedIn(true);
   }

}
{% endhighlight %}
</section>

<section>
## Test 2: 3 Failed Logins Causes Account to be Revoked
After three consecutive failed login attempts to the account, the account shall be revoked. Here's such a test expressing this business rule (we'll remove duplication in the tests after getting to green):
{% highlight java %}
   @Test
   public void itShouldSetAccountToRevokedAfterThreeFailedLoginAttempts() {
      IAccount account = mock(IAccount.class);
      when(account.passwordMatches(anyString())).thenReturn(false);

      IAccountRepository accountRepository = mock(IAccountRepository.class);
      when(accountRepository.find(anyString())).thenReturn(account);

      LoginService service = new LoginService(accountRepository);

      for (int i = 0; i < 3; ++i)
         service.login("brett", "password");

      verify(account, times(1)).setRevoked(true);
   }
{% endhighlight %}
### Test Description
As before, there are 5 parts to this test:
^
|**Part 1**|Create an IAccount test-double. Unlike the first test, this test double never matches any password.|
|**Part 2**|Create an IAccountRepository test-double and register the IAccount test-double with it for any account id.|
|**Part 3**|Create the LoginService as before, injecting the IAccountRepository test-double.|
|**Part 4**|Attempt to login three times, each time should fail.|
|**Part 5**|Finally, verify that the account was set to revoked after three times.|

Notice that this test does not check that setLogedIn is not called. It certainly could and that would make it in a sense more complete. On the other hand, it would also tie the test verification to the underlying implementation and also be testing something that might better be created as its own test (so that's officially on the punch-list for later implementation).

### Things Created for Compilation
This test requires a new method, setRevoked(boolean value) to be added to the IAccount interface.

When you've done that, the test fails with an exception similar to the previous test. Next, it's time to make the test turn green.

### Code Updated to get Test to turn Green
Here's one way to make this test pass (and keep the first test passing):
{% highlight java %}
   private int failedAttempts = 0;
      // snip ...

   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);
      account.setLoggedIn(true);
      if (!account.passwordMatches(password))
         ++failedAttempts;
      if (failedAttempts == 3)
         account.setRevoked(true);
   }
{% endhighlight %}

Sure it is a bit ugly and we can certainly improve on the structure. Before doing that, however, we'll let the production code ripen a bit to get a better sense of its direction. Instead, let's spend some time removing duplication in the unit test code. Rather than make you work through several refactoring steps, here's the final version I came up with:
{% highlight java %}
package com.om.example.loginservice;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;

public class LoginServiceTest {
   private IAccount account;
   private IAccountRepository accountRepository;
   private LoginService service;

   @Before
   public void init() {
      account = mock(IAccount.class);
      accountRepository = mock(IAccountRepository.class);
      when(accountRepository.find(anyString())).thenReturn(account);
      service = new LoginService(accountRepository);
   }

   private void willPasswordMatch(boolean value) {
      when(account.passwordMatches(anyString())).thenReturn(value);
   }

   @Test
   public void itShouldSetAccountToLoggedInWhenPasswordMatches() {
      willPasswordMatch(true);
      service.login("brett", "password");
      verify(account, times(1)).setLoggedIn(true);
   }

   @Test
   public void itShouldSetAccountToRevokedAfterThreeFailedLoginAttempts() {
      willPasswordMatch(false);

      for (int i = 0; i < 3; ++i)
         service.login("brett", "password");

      verify(account, times(1)).setRevoked(true);
   }
}
{% endhighlight %}
This simply extracts common setup to an init() method. However, this cleanup really shortens the individual tests considerably. It also makes their intent clearer. 
</section>

<section>
## Test 3: setLoggedIn not called if password does not match
The first two tests have made good progress, however to keep the number of assertions per test small (so far one) and to make individual tests less dependent on the underlying implementation, this next test forces a fix to the code and probably would have been a better second test than one you just created.
{% highlight java %}
import static org.mockito.Mockito.never;
...
   @Test
   public void itShouldNotSetAccountLoggedInIfPasswordDoesNotMatch() {
      willPasswordMatch(false);
      service.login("brett", "password");
      verify(account, never()).setLoggedIn(true);
   }
{% endhighlight %}

### Test Description
This test takes advantage of the recent test refactoring. Before ever getting into the test method, the init() method:
* Created an IAccount test-double
* Created an IAccountRepository test-double
* Configured the IAccountRepository test-double to return the IAccount test-double for any accountId.
* Created a LoginService and injected the IAccountRepository

There's not much left:
* Set the IAccount test-double to not match any password.
* Attempt the login.
* Verify that the setLoggedIn method (with true) was not called.

It would have been reasonable to use a strict mock - one that does not allow any method invocations not explicitly specified. However, in this example I'm shying away from strict mocks.

### Things Created for Compilation
This test did not require any existing classes to have new methods added.

Once the test executes, you'll notice a failure. It's a bit different from the previous example, but still it is fairly clear what happened. A method that should not have been called was called:
{% highlight terminal %}
org.mockito.exceptions.verification.NeverWantedButInvoked: 
iAccount.setLoggedIn(true);
Never wanted but invoked!
	at com.om.example.loginservice.LoginServiceTest.ItShouldNotSetAccountLoggedInIf
PasswordDoesNotMatch(LoginServiceTest.java:51)
Caused by: org.mockito.exceptions.cause.UndesiredInvocation: 
Undesired invocation:
	at com.om.example.loginservice.LoginService.login(LoginService.java:15)
	at com.om.example.loginservice.LoginServiceTest.ItShouldNotSetAccountLoggedInIf
PasswordDoesNotMatch(LoginServiceTest.java:50)
	<<snip>>
{% endhighlight %}

### Code Updated to get Test to turn Green
The LoginService.login method needs a little updating:
{% highlight java %}
   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account.passwordMatches(password))
         account.setLoggedIn(true);
      else
         ++failedAttempts;

      if (failedAttempts == 3)
         account.setRevoked(true);
   }
{% endhighlight %}

Verify that your code compiles and your tests pass.
</section>

<section>
## Test 4: Two Fails on One Account Followed By Fail on Second Account
This is one of those requirements you ask "Really?!" This requirement comes from an actual project, so while it might sound bogus, it is an actual requirement from the real world.

{% highlight java %}
   @Test
   public void itShouldNotRevokeSecondAccountAfterTwoFailedAttemptsFirstAccount() {
      willPasswordMatch(false);

      IAccount secondAccount = mock(IAccount.class);
      when(secondAccount.passwordMatches(anyString())).thenReturn(false);
      when(accountRepository.find("schuchert")).thenReturn(secondAccount);

      service.login("brett", "password");
      service.login("brett", "password");
      service.login("schuchert", "password");

      verify(secondAccount, never()).setRevoked(true);
   }
{% endhighlight %}

### Test Description
This test is a little longer because it requires more setup. Rather than possibly messing up existing tests and adding more setup to the fixture, I decided to do it in this test. There are alternatives to writing this test's setup:
* Leave it as is, it's not too bad.
* Add the additional setup to the init() method, making this a larger fixture.
* Put this test is another fixture, different setup --> different fixture (this would be more of a BDD style).

Since my primary purpose of this tutorial is practice using Mockito, I'll leave it as is until I notice additional duplication.

There are 4 parts to this test:
^
|**Part 1**|Set the password matching to false on the account.|
|**Part 2**|Create a second account, with a never-matching password and register it with the account repository. Notice that this uses a particular account name, "schuchert". Mockito, notices more specific**when** clauses over more general ones, so adding this after saying "for any string" is OK. This is a convenient default behavior (or is that behaviour as they would spell it?-).|
|**Part 3**|Login two times to the first account (both failing), then log in to a second account, also failing. That's three failures in a row, but to two different accounts, so no account should be revoked.|
|**Part 4**|Verify that the secondAccount is not revoked.|

### Things Created for Compilation
This test compiles without any new methods. It does fail with the following exception:
{% highlight terminal %}
org.mockito.exceptions.verification.NeverWantedButInvoked: 
iAccount.setRevoked(true);
Never wanted but invoked!
	at com.om.example.loginservice.LoginServiceTest.ItShouldNotRevokeSecondAccount
AfterTwoFailedAttemptsFirstAccount(LoginServiceTest.java:66)
Caused by: org.mockito.exceptions.cause.UndesiredInvocation: 
Undesired invocation:
	at com.om.example.loginservice.LoginService.login(LoginService.java:21)
	<snip>
{% endhighlight %}

As with previous exceptions, the message tells you what you need to know. The account was incorrectly revoked.

### Code Updated to get Test to turn Green
To get this new test to pass, I added a new attribute to the LoginService class: previousAccountId. Then I updated the login method to take advantage of it:
{% highlight java %}
   private String previousAccountId = "";
      // snip ...

   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account.passwordMatches(password)) {
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(accountId))
            ++failedAttempts;
         else {
            failedAttempts = 1;
            previousAccountId = accountId;
         }
      }

      if (failedAttempts == 3)
         account.setRevoked(true);
   }
{% endhighlight %}

This allows all tests to pass. Would it have been possible to do less? Maybe, but this was the first thing that came to mind. The code is starting to be a bit unruly. We're just about ready to clean up this code, but before we do there are a few more tests.
</section>

<section>
## Test 5: Do not allow a second login
In the actual problem, counting concurrent logins was somewhat complex. For this example, we'll keep it simple. If you are already logged in, you cannot log in a second time. That's simple enough:
{% highlight java %}
   @Test(expected = AccountLoginLimitReachedException.class)
   public void itShouldNowAllowConcurrentLogins() {
      willPasswordMatch(true);
      when(account.isLoggedIn()).thenReturn(true);
      service.login("brett", "password");
   }
{% endhighlight %}

### Test Description
This test first sets the password to matching. However, it also sets a new method, isLoggedIn, to always return true. It then attempts to login. The validation part of this test is in the (expected = AccountLoginLimitReachedException.class) part of the annotation.

### Things Created for Compilation
First, create the new exception:
#### AccountLoginLimitReachedException
{% highlight java %}
package com.om.example.loginservice;

public class AccountLoginLimitReachedException extends RuntimeException {
   private static final long serialVersionUID = 1L;
}
{% endhighlight %}

Next, add a new method to the IAccount class, isLoggedIn.

When you make these changes, the test will fail and the message indicates it expected an exception.

### Code Updated to get Test to turn Green
To get that exception thrown, simply make one small addition to the login method:
{% highlight java %}
   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         account.setLoggedIn(true);
      } else {
      // snip ...
{% endhighlight %}

</section>

<section>
## Test 6: AccountNotFoundException thrown if account is not found
This is a final test to make sure the code handles the case of an account not getting found. This is not too hard to write:
{% highlight java %}
   @Test(expected = AccountNotFoundException.class)
   public void ItShouldThrowExceptionIfAccountNotFound() {
      when(accountRepository.find("schuchert")).thenReturn(null);
      service.login("schuchert", "password");
   }
{% endhighlight %}

### Test Description
This test takes advantage of the fact that more specific**when** clauses take precedence over more general ones. This test configures the account repository test-double to return null for the account "schuchert". It then attempts the login, which should throw an exception.

### Things Created for Compilation
To get this test to compile, you'll need to add a new exception class:
#### AccountNotFoundException
{% highlight java %}
package com.om.example.loginservice;

public class AccountNotFoundException extends RuntimeException {
   private static final long serialVersionUID = 1L;
}
{% endhighlight %}

### Code Updated to get Test to turn Green
When you make this change, the test will fail with a null pointer exception. The fix is quick and at the top of the method:
{% highlight java %}
   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();
      // snip ...
{% endhighlight %}

This should make all tests pass.
</section>

<section>
## Test 7: Cannot Login to Revoked Account
The next test is similar to the previous test. A revoked account does not allow logins:
{% highlight java %}
   @Test(expected = AccountRevokedException.class)
   public void ItShouldNotBePossibleToLogIntoRevokedAccount() {
      willPasswordMatch(true);
      when(account.isRevoked()).thenReturn(true);
      service.login("brett", "password");
   }
{% endhighlight %}

### Test Description
This test is a repeat of the previous test, checking for a different result from a different starting condition.

### Things Created for Compilation
You'll need to add another exception, AccountRevokedException (as an unchecked exception) and a new method, isRevoked, to IAccount.

### Code Updated to get Test to turn Green
The only update to get to green is adding a check - a guard clause - similar to the previous test:
{% highlight java %}
   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();

      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
      // snip ...
{% endhighlight %}
</section>

<section>
## Summary so far
There are many more tests you could add to this system:
* Data validation is non-existent (e.g., blank/invalid account id's/passwords).
* Several account-related things:
  * Cannot Login to Account with Expired Password
  * Can Login to Account with Expired Password After Changing the Password
  * Cannot Login to Account with Temporary Password
  * Can Login to Account with Temporary Password After Changing Password
  * Cannot Change Password to any of Previous 24 passwords
  * Can Change Password to Previous password if > 24 Changes from last use
* ...

So there's a lot let to make this a complete system. Even so, the code in the LoginService.login method is unruly. There are two problems:
* Feature Envy: The LoginService is checking the account and doing different things. This suggests that Accounts could be more responsible.
* Intermediate States: The LoginService's response depends on the results of processing previous messages.

The first issue suggests spending some time on an Account class and then moving some of the responsibility from the LoginService class to that new Account class. For example, instead of setLoggedIn(true), change it to login() and then respond accordingly:
* If account already logged in, throw AccountLoginLimitReachedException
* If account revoked, throw AccountRevokedException
* ...

If you do this, then you'll be able to simplify the LoginServiceTest class because some of the tests will no longer belong there and instead will exist on the AccountTest. Creating AccountTest and Account classes is left as an exercise to the reader.

The second issue suggests the [GoF State pattern](http://en.wikipedia.org/wiki/State_pattern). And in fact, that's the next section. 
{: #refactorproduction}
</section>

<section>
## Refactoring LoginService
In the real system, there were more requirements and the stream of requirements were fed to me over months. The underlying login service I created looked something like this simple version, just bigger. On the real project, the code became very hard to manage because I was not practicing refacoring aggressively enough at the time. I realized that the underlying solution would be made better by applying the [GoF State pattern](http://en.wikipedia.org/wiki/State_pattern). In the actual solution, the LoginService had several methods, with many of the methods' responses dependent on either the state of the login service or the account. 

I made the change and sure enough supporting new requirements was**much** easier. The remainder of this tutorial involves refactoring the current solution to use the [GoF State pattern](http://en.wikipedia.org/wiki/State_pattern).

{: #CoolDiagram}
Here's where we're going:
![](images/LoginStates.png)

### How Does the State Pattern Apply?
In the typical state pattern, all or part of an object's behavior depends on what has happened to it in the past. In this case there are two different sets of state:
* The previous login attempts affect the LoginService.
* The state of the IAccount impacts the results (e.g., revoked accounts cannot be logged in to, an account that is already logged in to cannot be logged in to a second time).

Given the requirements so far, the state pattern is overkill. However, in the real system, refactoring to the state pattern made the implementation**much** easier, and more reliable as it turns out. So we'll migrate the current solution of the LoginState.login method to delegate some of the responsibility to a state object.

### Refactoring to the State Pattern
We have tests passing and green. Our goal is to slowly migrate the code. Along the way we'll also clean up some other problems.

Here's our starting point:
{% highlight java %}
   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();

      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(accountId))
            ++failedAttempts;
         else {
            failedAttempts = 1;
            previousAccountId = accountId;
         }
      }

      if (failedAttempts == 3)
         account.setRevoked(true);
   }
{% endhighlight %}

This refactoring is a simplified version of [Replace Type Code with State/Strategy](http://www.refactoring.com/catalog/replaceTypeCodeWithStateStrategy.html). What we'll do is somewhat simpler because we do not have a type code. Rather, the underlying code is state-based and it is this observation, along with difficulty of managing the code, that suggests following the refactoring steps described in Martin Fowler's Refactoring book to get to the state pattern. And that is what follows.

### Create Hierarchy
Remember that refactoring is an attempt to improve the structure of the code without affecting the code's behavior. In our case, the behavior is defined by our existing unit tests. We'll take many small steps that have two goals in mind:
* Keep the code compiling as often as possible.
* Keep the tests passing.

With this in mind our first effort will be to create the basic scaffolding. To do that:
* Create an abstract base class called: LoginServiceState
* Create a concrete derived class of LoginServiceState called AwaitingFirstLoginAttempt
* Create a concrete derived class of LoginServiceState called AfterFirstFailedLoginAttempt
* Create a concrete derived class of LoginServiceState called AfterSecondFailedLoginAttempt

Notice that you are not first creating unit tests. We already have unit tests in place. We are restructuring the code and the existing unit tests should keep us honest.

Also notice that for this first step, you've done nothing that will cause code to not compile or tests to fail. Go ahead and make sure your tests still pass, but that should be done by reflex anyway.

### **Copy** Behavior from Source To Abstract Base Class
To keep things compiling and tests running, you'll often do the following general steps:
* Create a placeholder for new functionality.
* Copy (not move) functionality from one place to another.
* Get it compiling.
* Delegate from the original place to the new place.

That is, refactoring is more about copy, update, remove rather than directly moving code. This may take a bit longer, but it is less risky, keeps code compiling more often and makes it less likely you'll break tests and lost track of what's next.

In the case of moving to the state pattern, typically the method on the state object takes in a so-called context object. In this example, the context object is the LoginService object. Also, before we make the move, consider the parameters: a string for the account id and a string for the password. If you pass the account string into the LoginServiceState, then the state will have to use the account repository to look up the service. That's fine, but it requires injection of the account repository into each of the state instances. Rather than doing that, we will instead pass in an IAccount. We'll allow the lookup to happen in the LoginService and the resulting IAccount will be passed into the state.

Here is a first cut at creating that new method in LoginServiceState:
{% highlight java %}
   public void login(LoginService context, IAccount account, String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(accountId))
            ++failedAttempts;
         else {
            failedAttempts = 1;
            previousAccountId = accountId;
         }
      }

      if (failedAttempts == 3)
         account.setRevoked(true);
   }
{% endhighlight %}

If you create this method, you'll notice the following problems:
* previousAccountId does not exist: we can add this missing attribute
* accountId does not exist: we'll have to add a method to IAccount, getId() (and update the tests to set that value on the IAccount test-doubles
* failedAttempts does not exist: we can add that attribute.

So as it is, we cannot add this method to the LoginServiceState class until we make a few changes. Rather than add the method and make the changes, back out this change and instead fix the problem of the accountId not being available first.

In fact, there's a set of refactorings we can do that will support this change:
* Add the method getId to IAccount
* Update the login method to use getId instead of accountId.
* Get the tests to pass again.
* Extract the body of the login method to another private method in the LoginService account.
* Verify the tests still pass.

#### Add getId to IAccount
Simply add this method to IAccount: String getId();

#### Update LoginService.login to use getId()
There are only two lines in the bottom of the login method that use accountId (other than the first time it is used to look up the account). Those need to change:
{% highlight java %}
      } else {
         if (previousAccountId.equals(account.getId()))
            ++failedAttempts;
         else {
            failedAttempts = 1;
            previousAccountId = account.getId();
         }
      }
{% endhighlight %}

Run your tests and you'll see that two fail.

#### Get tests to pass again
A single line added to the init() method in the unit test will get this to pass:
{% highlight java %}
   public void init() {
      account = mock(IAccount.class);
      when(account.getId()).thenReturn("brett");
      // snip ...
{% endhighlight %}

Verify your tests all pass.

#### Extract the body of the method
Finally, extract the bottom part of the method:
{% highlight java %}
   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();

      verifyLoginAttempt(account, password);
   }

   private void verifyLoginAttempt(IAccount account, String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(account.getId()))
            ++failedAttempts;
         else {
            failedAttempts = 1;
            previousAccountId = account.getId();
         }
      }

      if (failedAttempts == 3)
         account.setRevoked(true);
   }
{% endhighlight %}

Verify your tests all pass.

### Copy (with rename) verifyLoginAttempt into LoginServiceState.login
Notice that the code is well prepared to handle logging in after the IAccount is found. Start by copying verifyLoginAttempt into LoginServceState, rename it to login and add the missing previousAccountId and failedAttempts fields into the state object:

{% highlight java %}
package com.om.example.loginservice;

public abstract class LoginServiceState {
   private String previousAccountId = "";
   private int failedAttempts;

   public void login(IAccount account, String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(account.getId()))
            ++failedAttempts;
         else {
            failedAttempts = 1;
            previousAccountId = account.getId();
         }
      }

      if (failedAttempts == 3)
         account.setRevoked(true);
   }
}
{% endhighlight %}

Verify your code compiles and your tests pass.

### Deleage to State
You'll take three steps to complete this:

#### Add State Instance to LoginServce
Next, modify the LoginService to have an instance of LoginServiceState and initialize it to AwaitingFirstLoginAttempt:
{% highlight java %}
   private LoginServiceState state = new AwaitingFirstLoginAttempt();
{% endhighlight %}

Your code should still compile and your tests should still pass.

#### Delegate to State instace
Update the login method to delegate to the state:
{% highlight java %}
   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();

      state.login(account, password);
   }
{% endhighlight %}

Your code should still compile and your tests should still pass.

#### Remove Stale Code
Finally, remove the verifyLoginAttempt method and the failedAttempts and previousAccountId fields:
{% highlight java %}
package com.om.example.loginservice;

public class LoginService {
   private final IAccountRepository accountRepository;
   private LoginServiceState state = new AwaitingFirstLoginAttempt();

   public LoginService(IAccountRepository accountRepository) {
      this.accountRepository = accountRepository;
   }

   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();

      state.login(account, password);
   }
}
{% endhighlight %}

### Prepare for Polymorphsim
Next, you'll push the LoginServiceState.login method to each of the subclasses and then begin to remove the code not specifically related to each of the states.

#### Copy Code
First, push the login method as is into each of the subclasses and make the method abstract in the base class. (Note in most Java IDE's this is a single refactoring command.)

Here's the resulting LoginServiceState:
{% highlight java %}
package com.om.example.loginservice;

public abstract class LoginServiceState {
   protected String previousAccountId = "";
   protected int failedAttempts;

   public abstract void login(IAccount account, String password);
}
{% endhighlight %}

And here's one of the substates:
{% highlight java %}
package com.om.example.loginservice;

public class AwaitingFirstLoginAttempt extends LoginServiceState {
   @Override
   public void login(IAccount account, String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(account.getId()))
            ++failedAttempts;
         else {
            failedAttempts = 1;
            previousAccountId = account.getId();
         }
      }
   
      if (failedAttempts == 3)
         account.setRevoked(true);
   }
}
{% endhighlight %}

Verify your code compiles and your tests pass.

### Remove The Part That Does Not Apply
Now for each of the sub states we'll:
* Remove the parts of the method that does not apply given the state.
* Move to the next appropriate state.

#### Enabling Refactoring
Note, before we can do any of what is to come, we need a way to set the next state. There are two obvious options:
* Return the next state
* Take in the LoginService and have the state object set it as appropraite.

Either option will work, I prefer the second option for two reasons:
* It puts the responsibility with the object that has the knowledge
* Assuming there were multiple state-dependent methods in LoginService (and in the real application there were), you'd have to duplicate the assignment across multiple methods (violates DRY)

In general, when I use the state pattern, I pick the second option from my previous experience with the state pattern.

If you are using a modern IDE, this is a simple refactoring. If not:
* Add the parameter to the abstract base class.
* Add it to each of the derived classes.
* Pass in this to the call to login from the LoginService.login method.

Verify that your tests still pass.

#### Update AwaitingFirstLoginAttempt
First, remove the parts of the login method that do not apply to the first time a password does not match:
{% highlight java %}
   @Override
   public void login(LoginService context, IAccount account, String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         context.setState(new AfterFirstFailedLoginAttempt(account.getId()));
      }
   }
{% endhighlight %}

To get this to pass, you'll need to make a few additions:
#### Add constructor to AfterFirstFailedLoginAttempt
{% highlight java %}
   private String previousAccountId;

   public AfterFirstFailedLoginAttempt(String previousAccountId) {
      this.previousAccountId = previousAccountId;
      failedAttempts = 1;
   }
{% endhighlight %}

(Note: I'm cheating a bit here, I'm adding the previousAccountId as a field in this class. It will eventually be removed from the abstract base class as it does not apply to the AwaitingFirstLoginAttempt class. This is an example of avoiding violating the [Liskov Substitution Principle](http://www.objectmentor.com/resources/articles/lsp.pdf).)

#### Add setState to LoginService
{% highlight java %}
   public void setState(LoginServiceState state) {
      this.state = state;
   }
{% endhighlight %}

Verify your code compiles and the tests all pass.

#### Update AfterFirstFailedLoginAttempt
Moving through the state model, we'll fix the second state:
{% highlight java %}
   @Override
   public void login(LoginService context, IAccount account, String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(account.getId()))
            context
                  .setState(new AfterSecondFailedLoginAttempt(account.getId()));
         else
            previousAccountId = account.getId();
      }
   }
{% endhighlight %}

To get this to compile, you'll need to add a constructor to AfterSecondFailedLoginAttempt:
{% highlight java %}
   private String previousAccountId;

   public AfterSecondFailedLoginAttempt(String previousAccountId) {
      this.previousAccountId = previousAccountId;
      failedAttempts = 2;
   }
{% endhighlight %}

Verify your code compiles and your tests pass.

#### Update AfterSecondFailedAttempt
Now it's time to update the final state:
{% highlight java %}
   @Override
   public void login(LoginService context, IAccount account, String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else {
         if (previousAccountId.equals(account.getId())) {
            account.setRevoked(true);
            context.setState(new AwaitingFirstLoginAttempt());
         } else {
            context.setState(new AfterFirstFailedLoginAttempt(account.getId()));
         }
      }
   }
{% endhighlight %}

Make sure your code compiles and your tests pass.

#### Cleanup
Here are some remaining cleanup steps (after each change, make sure your tests still pass):
* Remove failedAttempts from LoginServiceState and also all other states that currently don't use it.
* Remove previousAccountId from LoginServiceState.

Notice that there's a lot of duplication in each of the three derived classes. Now, you'll introduce the [Gof Template Method Pattern](http://en.wikipedia.org/wiki/Template_method_pattern).

### Introduce the [Gof Template Method Pattern](http://en.wikipedia.org/wiki/Template_method_pattern)
The template method pattern expresses an algorithm in a base class with extension points implemented in a derived class. The extension points are:
* Called by a method that implements the algorithm in the base class.
* Declared abstract in the base class.
**Image no longer available**

Some external client issues a command, say X() as in the diagram above. The method X() has a number of steps (three in this example). The first and third steps are implemented in the base class. There is one part of the algorithm, the second step, that varies. Rather than attempt to implement it, the base class defers to an abstract method. The derived classes implement that abstract method to complete the algorithm.

Consider the game [Monopoly](http://en.wikipedia.org/wiki/Monopoly_(game)). There are three kinds of locations around the board which players may purchase. These three kinds of locations are:
* Railroads
* Property
* Utilities

There is a standard algorithm for what happens when a player lands on a location:
* If the location is not owned, the player may purchase it or the property goes up for auction.
* If the location is mortgaged, nothing happens.
* If the location is owned by another player, calculate rent and then make the current player pay the owner.

Landing is a standard set of steps except for rent calculation. In terms of the template method pattern, there could be an abstract base class, say Real Estate, that has a method, landOn. Most of the work of landOn is written in the Real Estate base class. However, if rent needs to be charged, the RealEstate's landOn method can defer the details of rent calculation to an abstract method it defines.
* If the current location is a Railroad, rent is equal to 25, 50, 100, or 200 depending on if the current player owns 1, 2, 3 or 4 railroads, respectively.
* If the current location is a Property, then rent is equal to:
  * The face value if the owner owns less than all properties in a color group
  * Double the face value if the owner owns all the properties in a color group but has made no improvements
  * Some amount shown on the individual property deed if the owner has made improvements (e.g., added houses).

### How It Applies To LoginServiceState
In the following drawing (which attempts to follow the UML 2.0 specification), thec methodd in thet base classe is the extension point. The base class deals with the basic validation like matching passwords and revoked accounts. It only defers what happens if the password does not match to the derived classes:
<< need to recreat this diagram >>
Rather than walk you through this refactoring, I'm just going to give you each of the classes.

#### Update: LoginServiceState
{% highlight java %}
package com.om.example.loginservice;

public abstract class LoginServiceState {
   public final void login(LoginService context, IAccount account,
         String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
      } else
         handleIncorrectPassword(context, account, password);
   }
   
   public abstract void handleIncorrectPassword(LoginService context,
         IAccount account, String password);
}
{% endhighlight %}

#### Update: AwaitingFirstLoginAttempt
{% highlight java %}
package com.om.example.loginservice;

public class AwaitingFirstLoginAttempt extends LoginServiceState {
   @Override
   public void handleIncorrectPassword(LoginService context, IAccount account,
         String password) {
      context.setState(new AfterFirstFailedLoginAttempt(account.getId()));
   }
}
{% endhighlight %}

#### Update: AfterFirstFailedLoginAttempt
{% highlight java %}
package com.om.example.loginservice;

public class AfterFirstFailedLoginAttempt extends LoginServiceState {
   private String previousAccountId;

   public AfterFirstFailedLoginAttempt(String previousAccountId) {
      this.previousAccountId = previousAccountId;
   }

   @Override
   public void handleIncorrectPassword(LoginService context, IAccount account,
         String password) {
      if (previousAccountId.equals(account.getId()))
         context.setState(new AfterSecondFailedLoginAttempt(account.getId()));
      else
         previousAccountId = account.getId();
   }
}
{% endhighlight %}

#### Update: AfterSecondFailedLoginAttempt
{% highlight java %}
package com.om.example.loginservice;

public class AfterSecondFailedLoginAttempt extends LoginServiceState {
   private String previousAccountId;

   public AfterSecondFailedLoginAttempt(String previousAccountId) {
      this.previousAccountId = previousAccountId;
   }

   @Override
   public void handleIncorrectPassword(LoginService context, IAccount account,
         String password) {
      if (previousAccountId.equals(account.getId())) {
         account.setRevoked(true);
         context.setState(new AwaitingFirstLoginAttempt());
      } else {
         context.setState(new AfterFirstFailedLoginAttempt(account.getId()));
      }
   }
}
{% endhighlight %}

#### Verify It All Works
After these four changes, make sure your code compiles and the tests pass.

### Final Cleanup, Part Two
When I looked at the login method in the LoginServcieState I realized there was a missing test. I also did not like the violation of the [Dependency Inversion Principle](http://www.objectmentor.com/resources/articles/dip.pdf). So we'll fix those two things.

#### Add a Missing Test
There is a problem with the current implementation of LoginServiceState.login, but there are no tests to verify that the problem exists. Rather than tell you what the problem is, here is one final test:
{% highlight java %}
   @Test
   public void itShouldResetBackToInitialStateAfterSuccessfulLogin() {
      willPasswordMatch(false);
      service.login("brett", "password");
      service.login("brett", "password");
      willPasswordMatch(true);
      service.login("brett", "password");
      willPasswordMatch(false);
      service.login("brett", "password");
      verify(account, never()).setRevoked(true);
   }
{% endhighlight %}

And here's a fix to make this pass. In the LoginServiceState.login method, add the following line:
{% highlight java %}
         context.setState(new AwaitingFirstLoginAttempt());
{% endhighlight %}

After this line:
{% highlight java %}
         account.setLoggedIn(true);
{% endhighlight %}

What the first test does and why this fix works is left to the reader as an exercise.

#### Remove [Dependency Inversion Principle](http://www.objectmentor.com/resources/articles/dip.pdf) Violation
The abstract class LoginServiceState depends on the concrete LoginService class, which violates the [Dependency Inversion Principle](http://www.objectmentor.com/resources/articles/dip.pdf). This is probably OK given that the state pattern is really a way to take part of the implementation of a class and extract it to a hierarchy. The combination of LoginService plus the LoginServiceState hierarchy is really a single logical unit. 

Even so, let's take this to its logical (extreme) conclusion as a way to demonstrate taking something too far.

##### Extract Class
Extract a base class for LoginService:
#### LoginServiceContext
{% highlight java %}
package com.om.example.loginservice;

public abstract class LoginServiceContext {

   private LoginServiceState state;

   public LoginServiceContext(LoginServiceState state) {
      this.state = state;
   }

   public void setState(LoginServiceState state) {
      this.state = state;
   }

   public LoginServiceState getState() {
      return state;
   }
}
{% endhighlight %}

#### Update: LoginService
{% highlight java %}
package com.om.example.loginservice;

public class LoginService extends LoginServiceContext {
   private final IAccountRepository accountRepository;

   public LoginService(IAccountRepository accountRepository) {
      super(new AwaitingFirstLoginAttempt());
      this.accountRepository = accountRepository;
   }

   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();

      getState().login(this, account, password);
   }
}
{% endhighlight %}

Replace all uses of LoginService with LoginServiceContext in the LoginServiceState hierarchy. Note that when I used the extract superclass refactoring in Eclipse, this was done automatically.

Make sure your code compiles and your tests pass.
</section>

<section>
## Summary
Congratulations. You started by writing tests using Mockito. Once you had a number of tests in place, you refactored your production code from a bunch of nested if statements (an embedded state machine) to use the [GoF State pattern](http://en.wikipedia.org/wiki/State_pattern). Once you got that working and cleaned up, you removed further duplication by introducing the [Gof Template Method Pattern](http://en.wikipedia.org/wiki/Template_method_pattern).

If you want to update your resume, it's time to add:
* Test Driven Development
* Using the Mockito library
* Refactoring to design patterns
* Template Method Pattern
* State Pattern

I hope you enjoyed your journey.

### The Final Source Code
#### LoginServiceTest.java
{% highlight java %}
package com.om.example.loginservice;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;

public class LoginServiceTest {
   private IAccount account;
   private IAccountRepository accountRepository;
   private LoginService service;

   @Before
   public void init() {
      account = mock(IAccount.class);
      when(account.getId()).thenReturn("brett");
      accountRepository = mock(IAccountRepository.class);
      when(accountRepository.find(anyString())).thenReturn(account);
      service = new LoginService(accountRepository);
   }

   private void willPasswordMatch(boolean value) {
      when(account.passwordMatches(anyString())).thenReturn(value);
   }

   @Test
   public void itShouldSetAccountToLoggedInWhenPasswordMatches() {
      willPasswordMatch(true);
      service.login("brett", "password");
      verify(account, times(1)).setLoggedIn(true);
   }

   @Test
   public void itShouldSetAccountToRevokedAfterThreeFailedLoginAttempts() {
      willPasswordMatch(false);

      for (int i = 0; i < 3; ++i)
         service.login("brett", "password");

      verify(account, times(1)).setRevoked(true);
   }

   @Test
   public void itShouldNotSetAccountLoggedInIfPasswordDoesNotMatch() {
      willPasswordMatch(false);
      service.login("brett", "password");
      verify(account, never()).setLoggedIn(true);
   }

   @Test
   public void itShouldNotRevokeSecondAccountAfterTwoFailedAttemptsFirstAccount() {
      willPasswordMatch(false);

      IAccount secondAccount = mock(IAccount.class);
      when(secondAccount.passwordMatches(anyString())).thenReturn(false);
      when(accountRepository.find("schuchert")).thenReturn(secondAccount);

      service.login("brett", "password");
      service.login("brett", "password");
      service.login("schuchert", "password");

      verify(secondAccount, never()).setRevoked(true);
   }

   @Test(expected = AccountLoginLimitReachedException.class)
   public void itShouldNowAllowConcurrentLogins() {
      willPasswordMatch(true);
      when(account.isLoggedIn()).thenReturn(true);
      service.login("brett", "password");
   }

   @Test(expected = AccountNotFoundException.class)
   public void itShouldThrowExceptionIfAccountNotFound() {
      when(accountRepository.find("schuchert")).thenReturn(null);
      service.login("schuchert", "password");
   }

   @Test(expected = AccountRevokedException.class)
   public void ItShouldNotBePossibleToLogIntoRevokedAccount() {
      willPasswordMatch(true);
      when(account.isRevoked()).thenReturn(true);
      service.login("brett", "password");
   }

   @Test
   public void itShouldResetBackToInitialStateAfterSuccessfulLogin() {
      willPasswordMatch(false);
      service.login("brett", "password");
      service.login("brett", "password");
      willPasswordMatch(true);
      service.login("brett", "password");
      willPasswordMatch(false);
      service.login("brett", "password");
      verify(account, never()).setRevoked(true);
   }
}
{% endhighlight %}
----
#### LoginService.java
{% highlight java %}
package com.om.example.loginservice;

public class LoginService extends LoginServiceContext {
   private final IAccountRepository accountRepository;

   public LoginService(IAccountRepository accountRepository) {
      super(new AwaitingFirstLoginAttempt());
      this.accountRepository = accountRepository;
   }

   public void login(String accountId, String password) {
      IAccount account = accountRepository.find(accountId);

      if (account == null)
         throw new AccountNotFoundException();

      getState().login(this, account, password);
   }
}
{% endhighlight %}
----
#### LoginServiceContext.java
{% highlight java %}
package com.om.example.loginservice;

public abstract class LoginServiceContext {
   private LoginServiceState state;

   public LoginServiceContext(LoginServiceState state) {
      this.state = state;
   }

   public void setState(LoginServiceState state) {
      this.state = state;
   }

   public LoginServiceState getState() {
      return state;
   }
}
{% endhighlight %}
----
#### LoginServiceState.java
{% highlight java %}
package com.om.example.loginservice;

public abstract class LoginServiceState {
   public final void login(LoginServiceContext context, IAccount account,
         String password) {
      if (account.passwordMatches(password)) {
         if (account.isLoggedIn())
            throw new AccountLoginLimitReachedException();
         if (account.isRevoked())
            throw new AccountRevokedException();
         account.setLoggedIn(true);
         context.setState(new AwaitingFirstLoginAttempt());
      } else
         handleIncorrectPassword(context, account, password);
   }

   public abstract void handleIncorrectPassword(LoginServiceContext context,
         IAccount account, String password);
}
{% endhighlight %}
----
#### AwaitingFirstLoginAttempt.java
{% highlight java %}
package com.om.example.loginservice;

public class AwaitingFirstLoginAttempt extends LoginServiceState {
   @Override
   public void handleIncorrectPassword(LoginServiceContext context, IAccount account,
         String password) {
      context.setState(new AfterFirstFailedLoginAttempt(account.getId()));
   }
}
{% endhighlight %}
----
#### AfterFirstFailedLoginAttempt.java
{% highlight java %}
package com.om.example.loginservice;

public class AfterFirstFailedLoginAttempt extends LoginServiceState {
   private String previousAccountId;

   public AfterFirstFailedLoginAttempt(String previousAccountId) {
      this.previousAccountId = previousAccountId;
   }

   @Override
   public void handleIncorrectPassword(LoginServiceContext context, IAccount account,
         String password) {
      if (previousAccountId.equals(account.getId()))
         context.setState(new AfterSecondFailedLoginAttempt(account.getId()));
      else
         previousAccountId = account.getId();
   }
}
{% endhighlight %}
----
#### AfterSecondFailedLoginAttempt.java
{% highlight java %}
package com.om.example.loginservice;

public class AfterSecondFailedLoginAttempt extends LoginServiceState {
   private String previousAccountId;

   public AfterSecondFailedLoginAttempt(String previousAccountId) {
      this.previousAccountId = previousAccountId;
   }

   @Override
   public void handleIncorrectPassword(LoginServiceContext context, IAccount account,
         String password) {
      if (previousAccountId.equals(account.getId())) {
         account.setRevoked(true);
         context.setState(new AwaitingFirstLoginAttempt());
      } else {
         context.setState(new AfterFirstFailedLoginAttempt(account.getId()));
      }
   }
}
{% endhighlight %}

----
#### IAccount.java
{% highlight java %}
package com.om.example.loginservice;

public interface IAccount {
   boolean passwordMatches(String candiate);
   void setLoggedIn(boolean value);
   void setRevoked(boolean value);
   boolean isLoggedIn();
   boolean isRevoked();
   String getId();
}
{% endhighlight %}
----
#### IAccountRepository.java
{% highlight java %}
package com.om.example.loginservice;

public interface IAccountRepository {
  IAccount find(String accountId);
}
{% endhighlight %}
----
#### AccountLoginLimitReachedException.java
{% highlight java %}
package com.om.example.loginservice;

public class AccountLoginLimitReachedException extends RuntimeException {
   private static final long serialVersionUID = 1L;
}
{% endhighlight %}
----
#### AccountNotFoundException.java
{% highlight java %}
package com.om.example.loginservice;

public class AccountNotFoundException extends RuntimeException {
   private static final long serialVersionUID = 1L;
}
{% endhighlight %}
----
### AccountRevokedException.java
{% highlight java %}
package com.om.example.loginservice;

public class AccountRevokedException extends RuntimeException {
   private static final long serialVersionUID = 1L;
}
{% endhighlight %}
</section>
