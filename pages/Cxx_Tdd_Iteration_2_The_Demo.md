---
title: Cxx_Tdd_Iteration_2_The_Demo
---
## Demo Goals
So far we only have test output to show for all of our hard work. Wouldn't it be nice if we could demonstrate our system with output? In reality, a product owner would probably require such a demo, so here's a list of things we want to accomplish with our demo:
* Be able to create 40 locations with the correct name
* Be able to show players taking turns and moving around the board
* Show things happening to the players (e.g. passing Go or hitting Luxury Tax)

Along the way we'll introduce a light-weight use of the boost library as well to handle memory deallocation.

## The Back 40

First let's create a simple set of 40 locations based on a file. Here's an example of what that file might look like:

|**type**|**name**|
|go|Go|
|location|Mediterranean Avenue|
|location|Community Chest|
|location|Baltic Avenue|
|it|Income Tax|

We need something that will construct the correct kind of Location based on the first column and give it the name in the second column. We also need to make sure to connect each of the locations to each other and form a circle.

Of course, we'll test our way into this.

To accomplish all of this, we're going to use the Boost C++ library and the C++ standard library. Here are a few example building blocks: [C++ Monopoly Building Blocks](Cxx_Monopoly_Building_Blocks).

Here we go...

## Red: Our First Test

Here's our first goal, create a "board" of one location. We'll use for our data set the following:

|**type**|**name**|
|location|LocationName|

Here's our test (in a new test file):

#### BoardBuilderTest.hpp

{% highlight cpp %}
01: #include <cxxtest/TestSuite.h>
02: 
03: #include "BoardBuilder.hpp"
04: 
05: #include <iostream>
06: #include <string>
07: #include <boost/shared_ptr.hpp>
08: #include "Location.hpp"
09: 
10: using namespace std;
11: 
12: class BoardBuilderTest : public CxxTest::TestSuite  {
13: public:
14:    void testSingleLocationBoard() {
15:       string singleLocation("location\tLocationName");
16:       istringstream stream(singleLocation);
17: 
18:       boost::shared_ptr<Location> start = BoardBuilder::buildBoard(stream);
19:       TS_ASSERT_EQUALS("LocationName", start->name());
20:       TS_ASSERT_EQUALS(start.get(), start->next());
21:    }
22: };
{% endhighlight %}

Here's a breakdown:

|**Line**|**Description**|
|15|I do not want to actually use a real file and deal with file I/O so I'm going to use a string as my source of data.|
|16|the C++ standard library offers the class istringstream that allows us to create an istream from a string. This allows my unit under test to read from a "file" that's in memory.|
|18|I'm calling a class method (static method) called buildBoard on the class BoardBuilder. This method takes a stream representing our locations and returns back the first location listed in the file. Remember that our locations form a circular list so having just the "first" location gives us all of them. This method is performing dynamic memory allocation so rather than return a standard pointer, I return a shared pointer that automatically will cause the underlying memory to get deleted when I return from this method. This is not a perfect solution, but we're working our way there.|
|19|First I want to verify that the location I got back has an expected name (this is a new method we'll need to add to Location.|
|20|Next, I want to make sure that the list is circular. It's size is one, so the next of start should be itself.|

### Red: Get it to compile

We have to extend our location class and we have to create a BoardBilder class. Here they are:

#### Location.hpp

Note: We've already seen this pattern repeated. Add a method get an attribute that returns a constant value. Then get the test to compile then go back and update to use a real reference. We're going to skip this step and go right to supporting a name attribute. Add the following method and attribute:

{% highlight cpp %}
// add the following include
#include <string>

// add the following method
public:
   std::string name() { return myName; }

// add the following instance variable
private:
   std::string myName;
{% endhighlight %}

Now we need to create the BoardBuilderClass. Here's the header file:

#### BoardBuilder.hpp

{% highlight cpp %}
#ifndef _BOARDBUILDER_HPP
#define_BOARDBUILDER_HPP

#include <boost/shared_ptr.hpp>
#include <iostream>

class Location;

class BoardBuilder {
public:
   static boost::shared_ptr<Location> buildBoard(std::istream &board);
};

#endif
{% endhighlight %}

Next, we need to get our code to compile, so we'll need to add a definition for the buildBoard method:

#### BuildBoard.cpp

{% highlight cpp %}
#include "BoardBuilder.hpp"

boost::shared_ptr<Location> BoardBuilder::buildBoard(std::istream &stream) {

   return boost::shared_ptr<Location>(new Location());
}
{% endhighlight %}

Build your system and verify that it compiles. You test should fail.

### Green: Get your test to pass
We've already updated location with a new attribute, name. We need to fill out our definition of the buildBoard method and add any additional missing pieces as well:

#### BuildBoard.cpp

{% highlight cpp %}
01: #include "BoardBuilder.hpp"
02: 
03: #include "Location.hpp"
04: 
05: #include <boost/tokenizer.hpp>
06: 
07: typedef boost::tokenizer<boost::char_separator<char> > tokenizer;
08: boost::shared_ptr<Location> BoardBuilder::buildBoard(std::istream &stream) {
09:    std::string line;
10:    std::getline(stream, line);
11:    
12:    boost::char_separator<char> tabNl("\t");
13:    tokenizer tok(line, tabNl);
14:    tokenizer::iterator it = tok.begin();
15: 
16:    std::string type = *it++;
17:    std::string name = *it;
18: 
19:    boost::shared_ptr<Location> start(new Location(name));
20:    start->setNext(start.get());
21: 
22:    return start;
23: }
{% endhighlight %}

Here's the breakdown:

|**Line**|**Description**|
|7|Define a tokenizer from the boost library that will use a character separator to split strings (lines) into individual tokens|
|9 - 10|Use the non-member function getline which reads from an istream into a std::string. This reads up to a new line or end of file.|
|12|Define our separator character to be a tab.|
|13|Create a tokenizer for the line we read from the istream, splitting the line by tab chracters, as defined by our char_separator.|
|16|*it gives us the first token (always a string) and then the ++ moves the iterator to the next token.|
|17|Read the second token, the name of the location.|
|19|Create our shared pointer holding onto a new location created using a new constructor, which we'll have to add to the location class.|
|20|Connect the location to itself to make the list circular.|

Notice that there's quite a bit of hard-coding going on here. That's OK, we're going to use a series of tests to incrementally improved and refactor this code.

We have to add a constructor to location that takes in a name. Since Locations are currently constructed with a no-argument constructor in our tests, can simply update the constructor:
{% highlight cpp %}
   Location(std::string name = "") : myName(name) {}
{% endhighlight %}

Build and run, are you green?

### Refactor
We do not have a lot of duplicate code, but we do have code that might seem incomplete. There's not much to refactor yet, but that's coming up.

Now is a great time to check in your work.

### Red: Create two locations in a circle
|**type**|**name**|
|location|Location1|
|location|Location2|

We want to create two locations in a circle. Here's a test:
{% highlight cpp %}
01:    void testTwoLocationBoard() {
02:       string singleLocation(
03:          "location\tLocationName1\nlocation\tLocationName2");
04:       istringstream stream(singleLocation);
05: 
06:       boost::shared_ptr<Location> start = BoardBuilder::buildBoard(stream);
07:       TS_ASSERT_EQUALS("LocationName1", start->name());
08:       TS_ASSERT_EQUALS("LocationName2", start->next()->name());
09:       TS_ASSERT_DIFFERS(start.get(), start->next());
10:       TS_ASSERT_EQUALS(start.get(), start->next()->next());
12:    }
{% endhighlight %}

This test is similar to the first test. 
* We make sure there are two locations with two names (lines 7 and 8), 
* On line 9 we make sure that the location returned does not point to itself
* We then make sure that the locations for a circle on line 10.

### Red: Get it to compile
This test already compiles but it does not pass. The fact that is does not pass suggests that it might be testing something useful. The fact that we did not have to add any code to get it to compile could mean we're testing an assumption or this test covers the same thing as another test. We'll review that in the refactor step.

### Green: Get it to pass

We need to update the buildBoard method:

{% highlight cpp %}
#include "BoardBuilder.hpp"

#include "Location.hpp"

#include <boost/tokenizer.hpp>

typedef boost::tokenizer<boost::char_separator<char> > tokenizer;

Location *createLocation(std::string &line) {
   boost::char_separator<char> tabNl("\t");
   tokenizer tok(line, tabNl);
   tokenizer::iterator it = tok.begin();

   std::string type = *it++;
   std::string name = *it;

   return new Location(name);
}

boost::shared_ptr<Location> BoardBuilder::buildBoard(std::istream &stream) {
   std::string line;
   std::getline(stream, line);
   
   Location *start = createLocation(line);
   Location *current = start;
   Location *previous = start;

   while(!stream.eof()) {
      std::getline(stream, line);
      current = createLocation(line);
      previous->setNext(current);
      previous = current;
   }

   current->setNext(start);

   return boost::shared_ptr<Location>(start);
}
{% endhighlight %}

This is quite a jump. That's often the case going from dealing with 1 thing to dealing with many things, as we did in this case.

Run your tests and make sure you're green.

### Refactor: One of these tests subsumes the other
Notice that the second test in BoardBuilderTest.hpp does everything that the first test does and a little more?  It turns out that after running the tests, my first test failed because I "primed the pump" by reading the first location and then going into the loop but then I additionally use a do-while loop instead of a while loop. The test caught this problem and then I fixed the underlying code.

So you might consider getting rid of this test but I'd recommend leaving it in to verify that any changes to that test don't break handling a single location in a loop.

## Red: Time To Create Different Types
OK, now we need to make sure that while the board is building locations, it can do so with different types. For example:

|**type**|**name**|
|go|Go|
|location|l1|
|it|Income Tax|

This describes a board with three locations and three different kinds of locations (based on the first column).

Here's a test:

{% highlight cpp %}
   void testBuildBoardWithDifferentTypes() {
      string severalLocations(
         "go\tgo\nlocation\tl1\nit\tIncome Tax");
      istringstream stream(severalLocations);

      boost::shared_ptr<Location> start = BoardBuilder::buildBoard(stream);
      TS_ASSERT(dynamic_cast<Go*>(start.get()) != 0)
      TS_ASSERT(dynamic_cast<Location*>(start->next()) != 0)
      TS_ASSERT(dynamic_cast<IncomeTax*>(start->next()->next()) != 0)
   }
{% endhighlight %}

**Note**: You'll need to make sure to #include "Go.hpp" and "IncomeTax.hpp"

### Red: Get it to compile
This code compiles, it just does not pass so we can go right to Green.

### Green: Get it to pass
We need to update the BoardBuilder:

{% highlight cpp %}
Location *createLocation(std::string &line) {
   boost::char_separator<char> tabNl("\t");
   tokenizer tok(line, tabNl);
   tokenizer::iterator it = tok.begin();

   std::string type = *it++;
   std::string name = *it;

   if(type.compare("location") == 0) {
      return new Location(name);
   }
   if(type.compare("go") == 0) {
      return new Go(name);
   }
   if(type.compare("it") == 0) {
      return new IncomeTax(name);
   }
   return new Location(name);
}
{% endhighlight %}

**Note**: To get this to compile you'll need to include "Go.hpp" and "IncomeTax.hpp". You'll also additionally need to add a constructor to Go and IncomeTax that take a parameter:

#### Go.hpp

{% highlight cpp %}
   Go(std::string name = "") : Location(name) {}
{% endhighlight %}

#### IncomeTax.hpp

{% highlight cpp %}
   IncomeTax(std::string name = "") : Location(name) {}
{% endhighlight %}

Verify that your tests pass.

### Refactor

Here are a couple of things to notice:
* Every time we add a new kind of location we have to update board builder. While this isn't awful, it's going to get ugly.
* BoardBuilder is good at reading the file and connecting up locations, how about we factor our the construction of different kinds of location into a simple Location factory:

#### LocationFactory.hpp

{% highlight cpp %}
#ifndef _LOCATIONFACTORY_HPP_
#define_LOCATIONFACTORY_HPP_

#include <string>

class Location;

class LocationFactory {
public:
   static Location *createLocation(std::string &line);
};

#endif
{% endhighlight %}

#### LocationFactory.cpp

{% highlight cpp %}
#include <boost/tokenizer.hpp>

#include "LocationFactory.hpp"
#include "Location.hpp"
#include "Go.hpp"
#include "IncomeTax.hpp"

typedef boost::tokenizer<boost::char_separator<char> > tokenizer;

Location *LocationFactory::createLocation(std::string &line) {
   boost::char_separator<char> tabNl("\t");
   tokenizer tok(line, tabNl);
   tokenizer::iterator it = tok.begin();

   std::string type = *it++;
   std::string name = *it;

   if(type.compare("location") == 0) {
      return new Location(name);
   }
   if(type.compare("go") == 0) {
      return new Go(name);
   }
   if(type.compare("it") == 0) {
      return new IncomeTax(name);
   }
   return new Location(name);
}
{% endhighlight %}

And we need to update BoardBuilder.cpp:

#### BoardBuilder.hpp

{% highlight cpp %}
#include "BoardBuilder.hpp"

#include "LocationFactory.hpp"
#include "Location.hpp"

boost::shared_ptr<Location> BoardBuilder::buildBoard(std::istream &stream) {
   std::string line;
   std::getline(stream, line);
   
   Location *start = LocationFactory::createLocation(line);
   Location *current = start;
   Location *previous = start;

   while(!stream.eof()) {
      std::getline(stream, line);
      current = LocationFactory::createLocation(line);
      previous->setNext(current);
      previous = current;
   }

   current->setNext(start);

   return boost::shared_ptr<Location>(start);
}
{% endhighlight %}

Verify you're still green.

Now is a great time to checkin.

## Refactor: Test Smells
Is it strange that we have a test in BoardBuilder that tests we're creating the correct kinds of locations? Since that is not a responsibility of BoardBuilder but LocationFactory, we should move the test and add missing tests to make sure that LocationBuilder creates every kind of location;

#### LocationFactoryTest.hpp
Here is a series of tests to make sure we can create each kind of Location there is:

{% highlight cpp %}
#include <cxxtest/TestSuite.h>

#include "LocationFactory.hpp"
#include "Location.hpp"
#include "Go.hpp"
#include "IncomeTax.hpp"
#include "GoToJail.hpp"
#include "LuxuryTax.hpp"

template<class T> T *build(const char *l) {
   std::string line(l);
   T* result = dynamic_cast<T*>(LocationFactory::createLocation(line));
   TS_ASSERT(result != 0)
   return result;
}

class LocationFactoryTest : public CxxTest::TestSuite {
public:

   void testCreatingLocation() {
      Location *l = build<Location>("location\tl");
      if(l) {
         TS_ASSERT_EQUALS("l", l->name());
         delete l;
      }
   }

   void testCreatingGo() {
      Go *g = build<Go>("go\tg");
      if(g) {
         TS_ASSERT_EQUALS("g", g->name());
         delete g;
      }
   }

   void testCreatingIncomeTax() {
      IncomeTax *it = build<IncomeTax>("it\tit");
      if(it) {
         TS_ASSERT_EQUALS("it", it->name());
         delete it;
      }
   }

   void testGoToJail() {
      GoToJail *gtj = build<GoToJail>("gotojail\tgtj");
      if(gtj) {
         TS_ASSERT_EQUALS("gtj", gtj->name());
         delete gtj;
      }
   }

   void testLuxuryTax() {
      LuxuryTax *lt = build<LuxuryTax>("lt\tlt");
      if(lt) {
         TS_ASSERT_EQUALS("lt", lt->name());
         delete lt;
      }
   }
};
{% endhighlight %}

To make this work, we need to update our LocationFactory:

#### LocationFactory.cpp

{% highlight cpp %}
#include <boost/tokenizer.hpp>

#include "LocationFactory.hpp"
#include "Location.hpp"
#include "Go.hpp"
#include "IncomeTax.hpp"
#include "LuxuryTax.hpp"
#include "GoToJail.hpp"


typedef boost::tokenizer<boost::char_separator<char> > tokenizer;

Location *LocationFactory::createLocation(std::string &line) {
   boost::char_separator<char> tabNl("\t");
   tokenizer tok(line, tabNl);
   tokenizer::iterator it = tok.begin();

   std::string type = *it++;
   std::string name = *it;

   if(type.compare("location") == 0) {
      return new Location(name);
   }
   if(type.compare("go") == 0) {
      return new Go(name);
   }
   if(type.compare("it") == 0) {
      return new IncomeTax(name);
   }
   if(type.compare("gotojail") == 0) {
      return new GoToJail(name);
   }
   if(type.compare("lt") == 0) {
      return new LuxuryTax(name);
   }
   return new Location();
}
{% endhighlight %}

The tests all pass, so now is a good time to checkin.

## Building Go To Jail Correctly
Right now we have a location, Go To Jail, that has as an attribute that is the destination location for when people land on it. We have a factory responsible for constructing the different kinds of locations but it does not currently keep track of all of the locations.

Let's add a test to verify that when we get back an instance of GoToJail, it's destination location is properly set:

### Red: Write a test

{% highlight cpp %}
   void testBoardBuiltWithGoToJailWiredUp() {
      string severalLocations(
         "go\tgo\n" 
         "location\tl1\n" 
         "location\tl2\n"
         "location\tl3\n" 
         "location\tJust Visiting\n" 
         "location\tl4\n" 
         "location\tl5\n" 
         "gotojail\tGo To Jail\tJust Visiting\n" 
         "location\tl7\n" 
         "location\tl8\n" 
         "location\tl9\n" 
         "location\tl10\n" 
         "location\tl11\n" 
         "location\tl12" 
      );
         
      istringstream stream(severalLocations);

      boost::shared_ptr<Location> start = BoardBuilder::buildBoard(stream);

      GoToJail *gtj = dynamic_cast<GoToJail*>(
         start->next()->next()->next()->next()->next()->next()->next()
      );

      TS_ASSERT( gtj != 0 )
      if( gtj != 0) {
         TS_ASSERT( gtj->getDestination() != 0 )
      }
   }
{% endhighlight %}

A bit of a brute force test, but it gets the job done. Construct a board with 14 locations, one is known as Just Visiting while the other, Go To Jail, uses Just Visiting as its destination.

### Red: Get it to compile 

This test compiles as necessary but it does not pass. This might indicate we're refining the underlying implementation to assert more assumptions about building all of the locations.

### Green: Get it to pass

Since we've already simplified BoardBuilder and taken out its responsibility for building the actual correct kinds of locations, the next change will end up going into LocationFactory:

#### LocationFactory.cpp

{% highlight cpp %}
#include <boost/tokenizer.hpp>

#include "LocationFactory.hpp"
#include "Location.hpp"
#include "Go.hpp"
#include "IncomeTax.hpp"
#include "LuxuryTax.hpp"
#include "GoToJail.hpp"

#include <iostream>

#include <map>
typedef boost::tokenizer<boost::char_separator<char> > tokenizer;
typedef std::map<std::string, Location*> m_l;

Location *LocationFactory::createLocation(std::string &line) {
   static m_l created;
   boost::char_separator<char> tabNl("\t");
   tokenizer tok(line, tabNl);
   tokenizer::iterator it = tok.begin();

   std::string type = *it++;
   std::string name = *it++;
   
   Location *result = 0;

   if(type.compare("location") == 0) {
      result = new Location(name);
   }
   if(type.compare("go") == 0) {
      result = new Go(name);
   }
   if(type.compare("it") == 0) {
      result = new IncomeTax(name);
   }
   if(type.compare("gotojail") == 0) {
      GoToJail *gtj = new GoToJail(name);
      if(it != tok.end()) {
         std::string destinationName = *it;
         Location *dest = created[destinationName];
         gtj->setDestination(dest);
      }
      result = gtj;
   }
   if(type.compare("lt") == 0) {
      result = new LuxuryTax(name);
   }
   if(result == 0) {
      result = new Location("UNDEFINED");
   }
   
   created[name] = result;
   
   return result;
}
{% endhighlight %}

The big change is that before the factory was stateless, it now keeps track of everything it constructors. This allows later locations build to make reference to previous locations by their names. If you review the section of code that checks the whether the type is "gotojail", you'll notice that it expects an additional token no the line, the name of its destination location. We look it up and set the value just after creating it.

Verify that your changes pass successfully.

Check in.
