---
title: JMockIt.AStoryAboutTooMuchPower
---
## A Story About Too Much Power

Notes:
* In this article I talk about JMockIt. However, these comments generally apply to that class of mocking frameworks. This list includes (at least): JMockIt, Typemock Isolator, PowerMock. These are the current breed of mocking tools - all very powerful.
* This is maybe a touch terse. I'm considering putting this into a more tutorial-like for, see, for example, [this example with Mockito.](http://schuchert.wikispaces.com/Mockito.LoginServiceExample) However, as that's a lot of work, I'll use a pull model and wait for someone to say they'd like that (hint).

[I gave a talk in Berlin November 10, 2011](http://vimeo.com/31927512). The subject was ostensibly about legacy refactoring. It was really about a lot of things, the starting point being legacy refactoring. Rather than using problems out of a class on legacy refactoring, I wanted something fresh and shiny. In the past, I started the talk with the following contrived example:
{% highlight java %}
public SomeClass {
	public static void problemsAhead() {
		System.exit(0);
	}
}

public SomeClassTest {
	@Test
	public void foo() {
		SomeClass.problemsAhead().
	}
}
{% endhighlight %}

Calling System.exit(0) is an allegory for "something bad" you don't want to have happen during a test. To make this even more of a problem, consider this class:
{% highlight java %}
public DontEven {
	static {
		System.exit(0);
	}
}
{% endhighlight %}
Both of these are fun examples but I wanted something with a bit more teeth - though I really do like that second example because it requires some knowledge of class loading to appreciate why you end up doing what you do to fix it. While it is easily fixable, though as of this writing I don't know how to do so with JMockIt. Just by hand.

My first idea was to write something with JPA. I figured database stuff is tough and it is a common request. I started downloading the latest jar files in anticipation of building a full JSE-Based JPA example that would then be used as a basis for the talk.

While waiting for that to download (my hotel at the time had decent internet but I ended up downloading 90 megs), I remembered the simple calculator used in The Cucumber Book and thought something like that would be cool and less hassle as I was waiting for my yaks to be shaved to get started.

That lead to thinking about something I often joke about when using an RPN calculator example in my classes: to perform calculation, write something that does a google search and then scrape the results for your implementation. Silly, yes. 

I was working with a financial company that same week so my thoughts then lead to something financial, which lead to currency conversion. That resonated with me so I instead downloaded the Apache HttpClient and began to work on that instead. I spent more time trying to figure out the URL than writing the code. I stated with google and then finally gave up on google and found another site and wrote some ugly code to scrape conversion rates. I then wrote some tests on this code using JMockIt and found JMockIt to be powerful, a bit too powerful.

In any case, I wanted to know the valid currencies, so I wrote another static method (the first one was static as the basis for the development was something that typically occurs in legacy code bases). This one hit a different URL for currency names and the approach was somewhat copy-and-pasted but deliberately different to make refactoring and duplication removal more difficult.

Here is the first method in its original form:
{% highlight java %}
	public static List<String> currencySymbols() {
	// ... <snip>
	}

	public static BigDecimal convertFromTo(String fromCurrency,
			String toCurrency) {
		List<String> valid = currencySymbols();
		if (!valid.contains(fromCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid from currency: %s", fromCurrency));
		if (!valid.contains(toCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid to currency: %s", toCurrency));
		String url = String.format("http://www.gocurrency.com/v2/dorate.phpo"
				+ "?inV=1&from=%s&to=%s&Calculate=Convert", toCurrency,
				fromCurrency);
		try {
			HttpClient httpclient = new DefaultHttpClient();
			HttpGet httpget = new HttpGet(url);
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();
			StringBuffer result = new StringBuffer();
			if (entity != null) {
				InputStream instream = entity.getContent();
				InputStreamReader irs = new InputStreamReader(instream);
				BufferedReader br = new BufferedReader(irs);
				String l;
				while ((l = br.readLine()) != null) {
					result.append(l);
				}
			}
			String theWholeThing = result.toString();
			int start = theWholeThing
					.lastIndexOf("<div id=\"converter_results\"><ul><li>");
			String substring = result.substring(start);
			int startOfInterestingStuff = substring.indexOf("<b>") + 3;
			int endOfIntererestingStuff = substring.indexOf("</b>",
					startOfInterestingStuff);
			String interestingStuff = substring.substring(
					startOfInterestingStuff, endOfIntererestingStuff);
			String[] parts = interestingStuff.split("=");
			String value = parts[1].trim().split(" ")[0];
			BigDecimal bottom = new BigDecimal(value);
			return bottom;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
{% endhighlight %}
Note, all of this code is [avaiable for download on github](https://github.com/schuchert/welc_examples_java_jmockit). Also, it does do some basic currency conversion.

This code is traditionally to hard to test without changing it somewhat. However, I wanted to give a try and I managed to execute this test without changing it, and without an internet connection, with the following code:
{% highlight java %}
	@Test
	public void convertsCorrectly() throws Exception {
		final ByteArrayInputStream bais = new ByteArrayInputStream(
				"<div id=\"converter_results\"><ul><li><b>5 x = 42 Y</b>"
						.getBytes());

		new NonStrictExpectations() {
			DefaultHttpClient httpclient;
			HttpResponse response;
			HttpEntity entity;
			{
				httpclient.execute((HttpUriRequest) any);
				result = response;
				response.getEntity();
				result = entity;
				entity.getContent();
				result = bais;
			}
		};

		new NonStrictExpectations(CurrencyConversion.class) {
			{
				CurrencyConversion.currencySymbols();
				result = Arrays.asList(new String[] { "X", "Y" });
			}
		};

		BigDecimal result = CurrencyConversion.convertFromTo("X", "Y");
		assertEquals(new BigDecimal(42), result);
	}
{% endhighlight %}
This code performs vertical mocking (or nested mocking). Here is a quick description of what this actually does (as far as I understand the model of JMockIt):
* The JUnit runner loads the class and runs the test
* As the test executes, it first creates a hand-rolled test double, a stub, that returns just enough of a web page that the underlying code will have something to parse
* Next, using a NonStrictExpectation, the test, using JMockIt, causes the classes DefualtHttpClient, HttpResponse and HttpEntity to be removed form the class loader and then replaced by stubs of those classes. As a bonus, each of the classes listed as attributes of the anonymous inner classes are also initialized with a mocked instance.
* Next, the instance initializer in the NonStrictExpectation then informs JMockIt what to return from a few of the methods. The end result is that the code will not use any real classes in the HttpClient jar file (essentially creating a dynamic load-time seam). What it will do is get a stream that has just enough text it in to make the underlying code "work". And it does, which is pretty amazing. This tool is The Force in a jar file.

This is a pretty ugly test but it is maintainable? In fact, it's not too bad. While I took this further in the talk that evening, the next day in class I used it to perform a more traditional legacy refactoring.

During the talk, I made the class an override-able singleton and then introduced an instance delegator to support override-ability by hand:
** Override-able Singleton**
{% highlight java %}
public class CurrencyConversion {
	static CurrencyConversion instance;

	public static CurrencyConversion getInstance() {
		if (instance == null) {
			instance = new CurrencyConversion();
		}
		return instance;
	}

	static public CurrencyConversion reset(CurrencyConversion newConversion) {
		CurrencyConversion old = instance;
		instance = newConversion;
		return old;
	}
	// ...
{% endhighlight %}

**Introduce an Instance Delegator**
{% highlight java %}
	public List<String> getCurrencySymbols() {
		// the same code that was originally in the 
		// static method called currencySymbols
	}

	// the instance delegator
	public static List<String> currencySymbols() {
		return getInstance().getCurrencySymbols();
	}
{% endhighlight %}
This makes static method call instance methods, which can be overridden using standard inheritance, while maintaining the public API for backwards compatibility. I could still use JMockIt, but now I can use what has now become a traditional mocking library like my favorite, Mockito. Note, this change did not in any way break the JMockIt example above.

In the class, we reviewed one the of the methods and noticed a few things:
* The method starts by calling another static method, so we'll need to introduce an instance delgator here, which we did.
{% highlight java %}
	public static BigDecimal convertFromTo(String fromCurrency,
			String toCurrency) {
		List<String> valid = currencySymbols();
		// ...
{% endhighlight %}
* The code performs validation. If we don't care about validation, as written, we still need to make sure we provide "correct" parameters and coordinate the return from the currencySymbols() method to match the incoming parameters. If we care to test parsing only, we still have to deal with these incidental details.
{% highlight java %}
		if (!valid.contains(fromCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid from currency: %s", fromCurrency));
		if (!valid.contains(toCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid to currency: %s", toCurrency));
{% endhighlight %}
* Just inside the try are 7 lines, 5 of which deal with HttpClient-related things, one a string buffer (no problem) and one is a null check.
* The null check is useless as if the entity is null, rather than fail there, the code fails a few lines later with an index out of bounds error. So we can safely remove the null check and the code will still be broken, I think broken in a better way as the failure and the fault are closer together.
* By removing that check, we have something that is easier to extract to its own method (sprout method refactoring).
{% highlight java %}
		try {
			HttpClient httpclient = new DefaultHttpClient();
			HttpGet httpget = new HttpGet(url);
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();
			StringBuffer result = new StringBuffer();
			if (entity != null) {
				InputStream instream = entity.getContent();
{% endhighlight %}
With these considerations in mind, we changed the code before extracting any methods:
{% highlight java %}
	public static BigDecimal convertFromTo(String fromCurrency,
			String toCurrency) {
		List<String> valid = currencySymbols();
		if (!valid.contains(fromCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid from currency: %s", fromCurrency));
		if (!valid.contains(toCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid to currency: %s", toCurrency));
		String url = String.format("http://www.gocurrency.com/v2/dorate.phpo"
				+ "?inV=1&from=%s&to=%s&Calculate=Convert", toCurrency,
				fromCurrency);
		try {
			HttpClient httpclient = new DefaultHttpClient();
			HttpGet httpget = new HttpGet(url);
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		StringBuffer result = new StringBuffer();
		InputStream instream = entity.getContent();
		InputStreamReader irs = new InputStreamReader(instream);
		BufferedReader br = new BufferedReader(irs);
		String l;
		while ((l = br.readLine()) != null) {
			result.append(l);
		}
		String theWholeThing = result.toString();
		int start = theWholeThing
				.lastIndexOf("<div id=\"converter_results\"><ul><li>");
		String substring = result.substring(start);
		int startOfInterestingStuff = substring.indexOf("<b>") + 3;
		int endOfIntererestingStuff = substring.indexOf("</b>",
				startOfInterestingStuff);
		String interestingStuff = substring.substring(
				startOfInterestingStuff, endOfIntererestingStuff);
		String[] parts = interestingStuff.split("=");
		String value = parts[1].trim().split(" ")[0];
		BigDecimal bottom = new BigDecimal(value);
		return bottom;
}
{% endhighlight %}
Next, we performed a few extract method refactorings to end up with the following:
* Move validation in to its own instance method.
* Move reading the URL in its own method
* Left the remaining parsing in the current method:
* Note, while I was doing this, one of the students recommended breaking out more code into the method to read the URL, which was a better idea than what I was doing.
{% highlight java %}
	public static BigDecimal convertFromTo(String fromCurrency,
			String toCurrency) {
		getInstance().checkParameters(fromCurrency, toCurrency);
		String url = String.format("http://www.gocurrency.com/v2/dorate.phpo"
				+ "?inV=1&from=%s&to=%s&Calculate=Convert", toCurrency,
				fromCurrency);
		String theWholeThing = getInstance().getContent(url);
		int start = theWholeThing
				.lastIndexOf("<div id=\"converter_results\"><ul><li>");
		String substring = theWholeThing.substring(start);
		int startOfInterestingStuff = substring.indexOf("<b>") + 3;
		int endOfIntererestingStuff = substring.indexOf("</b>",
				startOfInterestingStuff);
		String interestingStuff = substring.substring(startOfInterestingStuff,
				endOfIntererestingStuff);
		String[] parts = interestingStuff.split("=");
		String value = parts[1].trim().split(" ")[0];
		BigDecimal bottom = new BigDecimal(value);
		return bottom;
	}

	protected void checkParameters(String fromCurrency, String toCurrency) {
		List<String> valid = currencySymbols();
		if (!valid.contains(fromCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid from currency: %s", fromCurrency));
		if (!valid.contains(toCurrency))
			throw new IllegalArgumentException(String.format(
					"Invalid to currency: %s", toCurrency));
	}

	protected String getContent(String url) {
		StringBuffer result = new StringBuffer();
		try {
			HttpClient httpclient = new DefaultHttpClient();
			HttpGet httpget = new HttpGet(url);
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();
			if (entity != null) {
				InputStream instream = entity.getContent();
				InputStreamReader irs = new InputStreamReader(instream);
				BufferedReader br = new BufferedReader(irs);
				String l;
				while ((l = br.readLine()) != null) {
					result.append(l);
				}
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		return result.toString();
	}
}
{% endhighlight %}
* One of the students suggested extracting the getContent method out to its own class. We did not do that, but it is a better idea still.

With these changes in mind, we wrote the same test that is above in JMockIt, but we did everything using boring old java:
{% highlight java %}
package com.schuchert.welc;

import static org.junit.Assert.assertEquals;

import java.math.BigDecimal;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class CurrencyConvertion_Test {
	private CurrencyConversion original;

	class CurrencyConversionTestingSubclass extends CurrencyConversion {
		@Override
		protected String getContent(String url) {
			return "<div id=\"converter_results\"><ul><li><b>5 x = 42 Y</b>";
		}

		@Override
		protected void checkParameters(String fromCurrency, String toCurrency) {
		}
	}

	@Before
	public void init() {
		original = CurrencyConversion
				.reset(new CurrencyConversionTestingSubclass());
	}

	@After
	public void restore() {
		CurrencyConversion.reset(original);
	}

	@Test
	public void foo() {
		BigDecimal result = CurrencyConversion.convertFromTo(null, null);
		assertEquals(new BigDecimal(42), result);
	}

}
{% endhighlight %}
Here are some observations about this refactoring exercise:
* The production code is better.
* As written, the separation is more clear and it is more clear where to apply the single responsibility principle
* This test is more clear than the equivalent in JMockIt
* This test has less in it, since we removed validation we can test parsing without worrying about validation.
* The amount of work to do this refactoring was similar to the amount of work necessary to use JMockIt.

I speculated that the existing JMockIt tests would still work based on my understanding of how it work. To its credit, the JMockIt tests will ran. This speaks well to its model of operation. You can write tests using it that can withstand certain kinds of change.

To be fair, after this refactoring we can make the JMockIt test look much better:
{% highlight java %}
	@Test
	public void postRefactoringCurrencyConversion() {
		new NonStrictExpectations(CurrencyConversion.class) {
			CurrencyConversion c;
			{
				c.checkParameters(anyString, anyString);
				c.getContent(anyString);
				result = "<div id=\"converter_results\"><ul><li><b>5 x = 42 Y</b>";
			}
		};
		BigDecimal result = CurrencyConversion.convertFromTo(null, null);
		assertEquals(new BigDecimal(42), result);
	}
{% endhighlight %}
This is**much** better. In fact, I prefer this over the prior test that hand-rolled a testing subclass.**However**, JMockIt did not force us to do the work necessary to clean up the production code. As a result, the code remained ugly when we first used JMockIt to "test" the code.

Here's the thing: In teams, most people, most of the time, use existing code examples as a the basis of new work. That means if the code is left ugly, more ugly code will be written. Sure, we can "test" it using JMockIt, and JMockIt seems to age fairly well across certain kinds of refactorigns. However, in this example, so would any mocking framework supporting either nice or non-strict solutions. (That's a key lesson-learned, most of the time use non strict mocks. Ask if you would like a more precise set of recommendations.)

So while I think JMockIt is powerful and I want to make sure to keep it in my back pocket, I think it requires more discipline**because** of its flexibility. There's little it cannot do, and as a result there's little it will force you to do to recognize poor coding practices, which I fear will actually restrict growth and learning. You cannot learn without failure. With a tool like JMockIt, it's harder to notice a failure unless you can observe that something like this screams "crappy design":
{% highlight java %}
		new NonStrictExpectations() {
			DefaultHttpClient httpclient;
			HttpResponse response;
			HttpEntity entity;
			{
				httpclient.execute((HttpUriRequest) any);
				result = response;
				response.getEntity();
				result = entity;
				entity.getContent();
				result = bais;
			}
		};
{% endhighlight %}
I still want JMockIt for cases where I'm working with a library and it has things like final classes that are hard to construct. I could see using it instead of Mockito.  Knowing what I now know, using it test-first would not in itself force too many bad practices - there are some related to its use of anonymous inner classes, which encourages temporal coupling to save a few lines of code, and which is encouraged in their exercises (ask if you want to know what I mean). Even so, I could easily see moving to it as my primary mocking tool.

Summary
* Legacy technique: introducing an instance delegator
* Legacy technique: re-ording code to put related stuff together
* Legacy technique: sprout method
* Technique: creating mock objects using a library
* Technique: creating mock objects by hand
* Technique: override-able singleton (what the pattern should be)
* Technique: testing subclass
* Technique: mocking
* Technique: dynamic partial mock

Legacy refactoring is hard. It takes time. Tools like JMockIt can get you to a running test faster, but that presumes that your goal is to get a test running.

It isn't.

The reason to write a test for legacy code is because it is about to change and you don't want to do any harm while making that change. The test helps with that, but what helps even more is a clearer/cleaner design with fewer unnecessary dependencies. JMockIt, with all of its power, does not force those changes so while you will get tests and you might be able get tests initially written faster, you'll still have a mess of production code.

It seems that when starting with a section of legacy code, the early work is based on learning what it does. In this respect, JMockIt can speed things up. So if you take the approach of using it as a tool for building understanding, it can help. If, however, as a result of learning something, you don't do anything, while you might apply that learning in the future, it seems less likely because there was less pain suffered.

Growth requires failure and feedback. If you ease the pain of failure, you lessen the feedback. It seems to follow that you'll learn less and grow slower. There are lots of examples of this in nature. Consider the Monarch butterfly. It must out of its cocoon to grow. If they are let out without that struggle, their wings never form as the pressure from the escape forces fluid out of their bodies and into their wings. It seems like JMockIt may prevent us from growing our programming wings unless we are not careful.  
