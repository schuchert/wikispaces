{:toc}
## Background
This is the final version of a unit test I created using Moq. As you work your way through the code, logical blocks are explained.

## The Tests
```csharp
using MbUnit.Framework;
using Moq;

namespace LoginServiceCovarity
{
  public class LoginServiceTest
  {
    private Mock<IAccount> _brettMock;
    private Mock<IAccount> _schuchertMock;
    private Mock<IAccountRepository> _accountRepositoryMock;
    private LoginService _service;

    [SetUp]
    public void Init()
    {
      _brettMock = new Mock<IAccount>();
      _brettMock.Setup(account => account.Id).Returns("brett");

      _schuchertMock = new Mock<IAccount>();
      _schuchertMock.Setup(account => account.Id).Returns("schuchert");

      _accountRepositoryMock = new Mock<IAccountRepository>();
      _accountRepositoryMock.Setup(arm => arm.Get("brett")).Returns(_brettMock.Object);
      _accountRepositoryMock.Setup(arm => arm.Get("schuchert")).Returns(_schuchertMock.Object);
      _service = new LoginService(_accountRepositoryMock.Object);
    }

```
After writing 3 tests, I noticed a pattern. Each test:
* Created a mock account (later on I needed a second account)
* Created a mock account repository
* Registered the mock account with the mock repository

So rather than duplicate that across tests, it's factored out into the Init() method and called before each test.

Eventually I had tests that needed more than a single account, so I added a second and registered on under my first name and a second under my second name.
```csharp
    private void SetPasswordMatchesTo(bool value)
    {
      _brettMock.Setup(account => account.PasswordEquals(It.IsAny<string>())).Returns(value);
    }
```
By default, all methods on a Moq-generated object return a "reasonable default" - the same value that C# initializes fields to, e.g., 0, false, null. For some of the tests, I wanted the _brettMock's PasswordEquals method to return true, sometimes I wanted it to return false. So this method made that possible. The second account, _schuchertMock, never needs to have a matching password as the tests are currently written, so I didn't factor that out.

```csharp
    [Test]
    public void ItShouldRevokeAccountAfterThreeFailedAttepts()
    {
      SetPasswordMatchesTo(false);

      for (int i = 0; i < 3; ++i) 
        _service.Login("brett", "password");

      _brettMock.VerifySet(account => account.Revoked = true);
    }
```
The name says it all. Technically I could skip calling the "SetPasswordMatchesTo(false)", but I factored that out and I liked it there. It's the equivalent of a comment, but it actually executes, so I think it has a leg up on a comment.

Note, when I wrote these tests, I was working with a class. When I write unit tests in front of a class, I write new tests at the<i> <b>top</b></i> because I want them to be easy to see on a projected screen (some classes have tall monitors and they can get in the way). So this test was written later, rather than earlier.
```csharp
    [Test]
    [ExpectedException(typeof(AccountAlreadyLoggedInException))]
    public void ItShouldThrowExceptionIfAlreadyLoggedIn()
    {
      _brettMock.SetupGet(account => account.LoggedIn).Returns(true);
      SetPasswordMatchesTo(true);
      _service.Login("brett", "password");
    }
```
Set up the mock account to think it is already logged in, which will force the underlying code to throw an exception to get this test to pass.

Notice that the assertion of this test is checking that an exception is thrown.

```csharp
    [Test]
    public void ItShouldNotSetAccountToLoggedInIfPasswordDoesNotMatch()
    {
      SetPasswordMatchesTo(false);
      _service.Login("brett", "password");
      _brettMock.VerifySet(account => account.LoggedIn = true, Times.Never());
    }
```
When using a mocking library, we are generally choosing to check interaction (method invocation) rather than state. So this tests checks to see that the LoggedIn property of the mock object is never set to true since the password does not match.

The first test simply set the account to logged in (it was the simplest thing that worked to get the test to pass). This test makde that simple implementation break.

```csharp
    [Test]
    public void ItShouldLoginAUserWhenNamePasswordMatch()
    {
      SetPasswordMatchesTo(true);
      _service.Login("brett", "password");
      _brettMock.VerifySet(account => account.LoggedIn = true);
    }
```
This was actually the first test written. It tested the happy-path, assuming an account is found and the password matches, the account should be logged in.

```csharp
    [Test]
    public void ItSouldNotRevokeAccountAfterThirdFailsIfDifferentAccountsInvolved()
    {
      SetPasswordMatchesTo(false);
      _service.Login("brett", "password");
      _service.Login("brett", "password");
      _service.Login("schuchert", "password");
      _brettMock.VerifySet(account => account.Revoked = true, Times.Never());
    }
```
The requirements derive from an actual programming assignment I had as a consultant. Failed login attempts were only recorded in the current session. Twenty failed attempts at twenty different web browsers would not cause an account to get revoked (as requested by customer).

This test verified that three failed attempts to two different accounts did not incorrectly set the last account (schuchert in this case) to revoked.

```csharp
    [Test]
    [ExpectedException(typeof(AccountDoesNotExistException))]
    public void ItShouldThrowExceptionWhenAccountNotFound()
    {
      _accountRepositoryMock.Setup(repo => repo.Get("missing")).Returns((IAccount) null);
      _service.Login("missing", "password");
    }
  }
}
```
Finally, throw an exception if the account is not found.

## What I Do in Class
Notice that these tests are not in the same order I created them. Even so, I have the students work through one test at a time. Generally I have them avoid refactoring the underlying LoginService. They can, but I warn them that the solution goes in some strange directions.

After they have all of these tests passing, I describe the [[http://en.wikipedia.org/wiki/State_pattern|GoF State pattern]]. Then I walk them through (or have them try on their own before walking them through) refactoring their LoginService to use the State pattern.