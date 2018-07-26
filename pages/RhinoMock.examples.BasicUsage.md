---
title: RhinoMock.examples.BasicUsage
---
{% highlight csharp %}
using System;
using NUnit.Framework;
using Rhino.Mocks;

namespace s_04_using_mock_library
{
  [TestFixture]
  public class RhinoMockSmokeTest
  {
    private MockRepository repository;

    [SetUp]
    public void init()
    {
      repository = new MockRepository();
    }

    [Test]
    public void VerifyCallOfMethodReturningVoid()
    {
      var example = repository.StrictMock<IExample>();
      example.Foo();
      repository.ReplayAll();
      example.Foo();
      repository.VerifyAll();
    }

    [Test]
    public void CallMethodAnyNumberOfTimesWithFixedReturnValue()
    {
      var example = repository.StrictMock<IExample>();
      Expect.Call(example.Bar()).Return(42).Repeat.Any();
      repository.ReplayAll();

      int callCount = new Random().Next() % 10 + 1;
      for (int i = 0; i < callCount; ++i)
        example.Bar();

      repository.VerifyAll();
    }

    [Test]
    public void ReturnFixedValueIgnoringParameters()
    {
      var values = new ExampleObjectWithValues("Brett", 13);
      var example = repository.StrictMock<IExample>();
      Expect.Call(example.Baz(null)).Return(values).IgnoreArguments();
      repository.ReplayAll();

      ExampleObjectWithValues returned = example.Baz("AString");
      Assert.AreSame(values, returned);
    }

    [Test]
    public void ForceValueOfProperty()
    {
      var values = repository.StrictMock<ExampleObjectWithValues>("", 0);
      Expect.Call(values.Name).Return("Schuchert").Repeat.Any();
      repository.ReplayAll();

      Assert.AreEqual("Schuchert", values.Name);
      repository.VerifyAll();
    }
  }

  public class ExampleObjectWithValues
  {
    private int favoritNumber;
    private string name;

    public ExampleObjectWithValues(string name, int favoritNumber)
    {
      this.name = name;
      this.favoritNumber = favoritNumber;
    }

    public virtual string Name { get { return name; } }
    public int FavoriteNumber { get { return favoritNumber; } }
  }

  public interface IExample
  {
    void Foo();
    int Bar();
    ExampleObjectWithValues Baz(String key);
  }
}
{% endhighlight %}
 
