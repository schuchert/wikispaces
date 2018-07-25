---
title: JMockIt.LoginServiceExample
---
# Getting Started
JMockIt is an interesting mocking library that actively does quite a bit of work for you if you simply configure your classpath correctly and use annotations. For this example I'll use the [Login Service from the Mockito tutorial I wrote]({{ site.pagesurl}}/ref).

* First you'll need to [[http://code.google.com/p/jmockit/downloads/list|download JMockIt]. As of this writing I used 0.999.8, which was "featured" at the time.
* Next, extract the downloaded zip somewhere.
* You'll need to include jmockit.jar in your classpath// **as the first entry**//
//**For Eclipse**//
Here's what I did in Eclipse
** Create a standard Java project
** Create a new folder in the project called libs
** Copied the contents of the jmockit folder into the libs directory
** Add <your project>/libs/jmockit/jmockit.lib to the class path (Project:Properties:Java Build Path:Libraries:Add Jar
** While you are there you can add JUnit 4 to your project as well by using// **Add Library...**//
** Make jmockit.lib the first entry in the class path (Project:Properties:Java Build Path:Order and Export - select jmockit.jar and move it up to the top of th elist)

The Login Service initially uses 4 java source files:
- LoginServiceShould.java - a series of unit tests
- LoginService.java - the class under test
- Account - an interface
- AccountRepository - an interface

Here's a first cut at the code for a test that demonstrates JMockIt has simply created test doubles successfully:
//**LoginServiceShould**//
```java
package schuchert.jmockit.ex;

import static org.junit.Assert.assertNotNull;
import mockit.Mocked;

import org.junit.Before;
import org.junit.Test;

public class LoginServiceShould {
	@Mocked
	private Account account;

	@Mocked
	private AccountRepository repository;

	private LoginService service;
	
	@Before
	public void init() {
		service = new LoginService(repository);
	}
	
	@Test
	public void fooShouldNotBeNull() {
		assertNotNull(account);
		assertNotNull(repository);
	}
}
```
To get this to compile and run, you'll need the following additional source files:
//**Account**//
```java
package schuchert.jmockit.ex;

public class Account {
}
```

//**AccountRepository**//
```java
package schuchert.jmockit.ex;

public interface AccountRepository {
}
```

//**LoginService**//
```java
package schuchert.jmockit.ex;

public class LoginService {
	public LoginService(AccountRepository repository) {
	}
}
```

Run your test and you'll get a passing test if you have the classpath set correctly.

# How?
If you open up the jmockit.jar, you'll find a the manifest file in its standard location:
```
META-INF/MANIFEST.MF
```

There's a key line in the manifest:
```
Agent-Class: mockit.internal.startup.Startup
```

This line registers the class as a Java Agent. This means it will have access to classes as their bytecode is loaded. JMockIt looks at the class structure to see if there are annotations it cares about. If there are, then it processes that class and gives an updated version of the class back to the class loader. 

# First Domain Test
Now that you have the project setup and running, it's time to replace the// **fooShouldNotBeNull**// test with one that is relevant to our problem:
//**LoginServiceShould**//
```java
01: package schuchert.jmockit.ex;
02: 
03: import mockit.Mocked;
04: import mockit.NonStrictExpectations;
05: import mockit.Verifications;
06: 
07: import org.junit.Before;
08: import org.junit.Test;
09: 
10: public class LoginServiceShould {
11: 	@Mocked
12: 	private Account account;
13: 
14: 	@Mocked
15: 	private AccountRepository repository;
16: 
17: 	private LoginService service;
18: 
19: 	@Before
20: 	public void init() {
21: 		service = new LoginService(repository);
22: 	}
23: 
24: 	@Test
25: 	public void increaseLoginCountForSuccessfulLogin() {
26: 		new NonStrictExpectations() {
27: 			{
28: 				repository.findAccountNamed(anyString);
29: 				result = account;
30: 			}
31: 		};
32: 		
33: 		new NonStrictExpectations() {
34: 			{
35: 				account.passwordMatches(anyString);
36: 				result = true;
37: 			}
38: 		};
39: 		
40: 		service.login("brett", "password");
41: 		
42: 		new Verifications() {
43: 			{
44: 				account.incrementLoginCount();
45: 				times= 1;
46: 			}
47: 		};
48: 	}
49: }
```
|~ Lines |~ Description |
|11, 14|This annototation causes JMockIt to create mock objects for the next attribute. JMockIt creates a class that implements the interface named in the type of the attribute. It then inserts code into the constructor of the class that causes the attribute to be initialized with an instance of this JMockIt-generated class.|
|19-22|For each test method, create a fresh instance of a LoginService and provide an account repository. Since LoginSerivce is being provided a dependent object, this is called dependency injection. Since LoginService depends on an abstraction (an interface) rather than a concrete class, this is also applies the dependency inversion principle. Dependency injeciton and dependency inversion often happen at the same time.|
|26-31|Stub the method findAccountName such that when it is called it will return account for any string provided to the method. Since this is the same account repository used by the login service, any time the login service looks up an account (for this test), with any string, it will get accout. JMockIt uses anonymous inner classes to set up expectations. The trick it uses is an instance initializer. The second (inner-most) set of {} will be run at object creation time just before any constructor that exists.|
|33-38|Stub the method passwordMatches on the account object. No matter what you ask the account, it will say "yes this is my password". This and lines 26 - 31 could be combined into one NonStringExpectations, however they are for different objects so I choose to not introduce unnecessary temporaily copuling between the lines.|
|40|Exercise the code under test.|
|42 - 47|Check, did what I want to have happen actually happen? Verify that the method incrementLoginCount() was called one time.|

## Observations
The use of anonymous inner classes with instance initializers is not a new idea. It does lead to somewhat longer code for setup. I worry that as a result, the tendency will be for peopel to mix conceptually unrelated setup in the same block to avoid longer code. Looking at this and consdiering the equivalent in Mockito, I prefer the more terse form of Mockit, but this is perfectly fine. JMockIt has several features that Mockito does not, so this additial verbosity is probably going to be a worthwhile cost for additional power, but I'm not sure about this just yet.

Finally, I've recently come to the conslution that// **no**// mock-library code should appear in the mainline code of a test. To understand/read/consume the test, I want it to be intention-revealing. JMockIT can certainly be read, but I don't want to have to read it to understand the point of the test. The same can be said of all the other mocking libraries. So here's a better example of how I want the tests to look:
```java
	@Test
	public void increaseLoginCountForSuccessfulLogin() {
		setupAccountRepositoryToAlwaysReturnAccount();
		willPasswordMatch(true);
		
		service.login("brett", "password");
		
		verifyIncrementLoginCountWasCalled();
	}
```

Here are those private methods (extracted from the original test):
```java
	private void verifyIncrementLoginCountWasCalled() {
		new Verifications() {
			{
				account.incrementLoginCount();
				times= 1;
			}
		};
	}

	private void willPasswordMatch(final boolean b) {
		new NonStrictExpectations() {
			{
				account.passwordMatches(anyString);
				result = b;
			}
		};
	}

	private void setupAccountRepositoryToAlwaysReturnAccount() {
		new NonStrictExpectations() {
			{
				repository.findAccountNamed(anyString);
				result = account;
			}
		};
	}
```

## Verify Account Revoked After Three Failed Attempts
```java
	@Test
	public void revokeAccountAfterThreeFailedLoginAttempts() {
		setupAccountRepositoryToAlwaysReturnAccount();
		willPasswordMatch(false);

		service.login("brett", "password");
		service.login("brett", "password");
		service.login("brett", "password");

		verifyRevokeWasCalled();
	}

	private void verifyRevokeWasCalled() {
		new Verifications() {
			{
				account.revoke();
				times = 1;
			}
		};
	}
```

If you run this without changing the implementation of LoginService, you'll see the following failure reported by JUnit:
```

java.lang.AssertionError: Missing 1 invocation to:
void schuchert.jmockit.ex.Account#revoke()
on mock instance: $Impl_Account@2e530cf2
	at schuchert.jmockit.ex.LoginServiceShould$1.<init>(LoginServiceShould.java:48)
	at schuchert.jmockit.ex.LoginServiceShould.verifyRevokeWasCalled(LoginServiceShould.java:45)
	...
```

This is an easy to read stack trace, the message indicates what we need to have happen. To make that happen, here's one way to change the underlying production code:
```java
	public void login(String accountName, String password) {
		Account account = repository.findAccountNamed(accountName);
		
		if(account.passwordMatches(password))
			account.incrementLoginCount();
		else {
			++failedCount;
			if(failedCount == 3)
				account.revoke();
		}
	}
```
Of course, I needed to add a field called failedCount, which is initialized to 0.
