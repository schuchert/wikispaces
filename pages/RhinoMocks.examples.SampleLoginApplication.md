---
title: RhinoMocks.examples.SampleLoginApplication
---
**LoginServiceTest**
{% highlight csharp %}
using NUnit.Framework;
using Rhino.Mocks;
using Rhino.Mocks.Interfaces;

namespace s_04_using_mock_library
{
  [TestFixture]
  public class LoginServiceTest
  {
    private MockRepository repository;
    private IAccountProvider provider;
    private IAccount account;
    private IAccount notCalled;

    [SetUp]
    public void init()
    {
      repository = new MockRepository();
      provider = repository.DynamicMock<IAccountProvider>();
      account = repository.DynamicMock<IAccount>();
      notCalled = repository.DynamicMock<IAccount>();
    }

    [Test]
    public void AssertSuccessfulLoginSetsAccountsLoggedInStatus()
    {
      Expect.Call(account.LoggedIn = true);
      SetupResult.On(provider).Call(provider.GetAccount("brett")).Return(account);
      SetupResult.On(provider).Call(provider.GetAccount("")).Return(notCalled);
      repository.ReplayAll();

      LoginService service = new LoginService(provider);
      service.Login("brett", "password");

      repository.VerifyAll();
    }

    [Test]
    public void TheOtherWay()
    {
      using (repository.Record())
      {
        Expect.Call(account.LoggedIn = true);
        SetupResult.On(provider).Call(provider.GetAccount("brett")).Return(account);

        ICreateMethodExpectation expectation = SetupResult.On(provider);
        expectation.Call(provider.GetAccount(""));
        LastCall.Return(notCalled);
      }

      using (repository.Playback())
      {
        LoginService service = new LoginService(provider);
        service.Login("brett", "password");
      }
    }
  }
}
{% endhighlight %}

**IAccount**
{% highlight csharp %}
namespace s_04_using_mock_library
{
  public interface IAccount
  {
    bool LoggedIn { get; set; }
  }
}
{% endhighlight %}

**IAccountProvider**
{% highlight csharp %}
namespace s_04_using_mock_library
{
  public interface IAccountProvider
  {
    IAccount GetAccount(string accountName);
  }
}
{% endhighlight %}

**LoginService**
{% highlight csharp %}
namespace s_04_using_mock_library
{
  public class LoginService
  {
    private IAccountProvider provider;

    public LoginService(IAccountProvider provider)
    {
      this.provider = provider;
    }

    public void Login(string accountName, string password)
    {
      IAccount accout = provider.GetAccount(accountName);
      accout.LoggedIn = true;
    }
  }
}
{% endhighlight %}
 
