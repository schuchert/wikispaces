---
title: Cxx_Tdd_Iteration_2
---
The theme for this iteration is: Landing Effects

By the end of this iteration, players will be able to move around the board and as they do so, various things happen when the pass over or land on locations.
 
Here is a list of user stories for this iteration:
* Landing on Go
* Passing over Go
* Landing on Go To Jail
* Landing on Income Tax
* Landing on Luxury Tax

## Test 1
Here is the first test for this iteration:
> During a turn a Player lands on Go and their balance increases by $200.

There are two parts to this test:
* Player lands on Go and receives $200
* During a turn.

We’ll break this down into two parts:
* First we’ll verify that when we land on Go, we receive $200.
* Then we’ll have a player take a turn and verify that the player sends the landOn message.

### Red: Writing a test
This test mentions a new concept, Go. This is the “starting location” for all players, but for the purposes of this test, it simply represents a location that, when landed upon, gives the player $200. 

Here is a simple test to verify this rule:
```cpp
01: #include <cxxtest/TestSuite.h>
02: #include "Go.hpp"
03: #include "Player.hpp"
04:
05: class GoTest : public CxxTest::TestSuite {
06: public:
07:	void testPlayerReceives200WhenLandingOnGo() {
08:		Go g;
09:		Player p;
10:		g.landOn(&p);
11:		TS_ASSERT_EQUALS(200, p.balance());
12:	}
13: }; 
```

There are two lines worthy of note:
||**Line**||**Description**||
||10||This line is the “event” that causes the player to receive money. Note that we are sending in a pointer to a player. If you remember from Game, it works with pointers. This allows for polymorphic behavior in the player. Using a reference would also work, however we’re already using pointers elsewhere, so we’ll stick with pointers here as well.||
||11||Apparently the player requires a new method, getBalance().||

Right now this test won’t compile. Here are the changes to get this to compile. 

### Red: Get the test to compile
First we need to update the player class by adding a getBalance() method:
```cpp
...
public:
	int balance() { return 0; }
```

Next, we need to create the class Go. First there’s Go.hpp:
```cpp
# ifndef Go_hpp
# define Go_hpp

class Player;

class Go {
public:
	void landOn(Player *player);
};

# endif 
```

Next, we need an implementation for this method, here’s Go.cpp:
```cpp
# include "Go.hpp"
# include "Player.hpp"

void Go::landOn(Player *player) {
}
```

We need to update the SRCS macro in the makefile to get this test added in:
SRCS	=	Dice.cpp Die.cpp Game.cpp Main.cpp Player.cpp Go.cpp

Next, build to verify that the test and Go class compile:
```
$ make
g++ -c -g -o "bin/Go.o" -I../cxxtest/cxxtest "Go.cpp"
g++ -g -o "bin/monopoly_test.exe" bin/tests.o bin/Dice.o bin/Die.o bin/Game.o bi
n/Main.o bin/Player.o bin/Go.o -I../cxxtest/cxxtest
./bin/monopoly_test.exe
Running 13 tests..........
In GoTest::testPlayerReceives200WhenLandingOnGo:
./GoTest.hpp:11: Error: Expected (200 == p.balance()), found (200 != 0)
..
Failed 1 of 13 tests
Success rate: 92% 
```

### Green: Get the test to pass
We need to make sure that when we call the landOn method in the Go class that it actually gives the Player $200. Here’s one way to do that:
```cpp
void Go::landOn(Player *player) {
	player->deposit(200);
}
```

This won’t compile until we update Player to have a deposit() method. The test won’t pass until the deposit() method actually updates the Player’s balance and the balance() method returns the updated value, so here’s those changes to Player.hpp:
```cpp
public:
	…
	int balance() { return myBalance; }
	void deposit(int amount) { myBalance += amount; }

private:
	int myLocation;
	int myBalance;
```

If this is all we do, the myBalance instance variable won’t be initialized, so we’ll also update the constructor initialization list. Here’s a change to Player.cpp:
```cpp
Player::Player() : myLocation(0), myBalance(0) {
}
```

Now verify that the tests actually pass:
```
$ make
./bin/monopoly_test.exe
Running 13 tests.............OK!
```

Success! We have more to do, but this is a good start. 

### Test 1: Refactor
Review the code. Are there any places where we have duplication or stale code? So far we’ve been working on new functionality and not really updating existing functionality so we really don’t have any opportunities for refactoring. It will happen and we’ll keep making sure to check after each test.

If you happen to be using revision control software, this is a great time to checkin.

## Test 1: Part 2: Player sends message
This is a great time to take a break. This next section is somewhat large and introduces a key concept for this solution.

If the player sends the message landOn() to a location (Go in this case), the Player will receive $200. We need to verify that the Player is actually sending the message during a turn.

Before we move on to the test, we have a problem of visibility. The current method in Player to takeATurn() looks like this:
```cpp
void Player::takeATurn(Dice& dice) {
	myLocation += dice.roll();
	myLocation %= 40;
} 
```

Notice that the Player never sends a message to a Location. Notice also that our concept of “Location” is actually just an int. This will not suffice. If we review the user stories for this entire iteration, they are all about something happening when a Player interacts with a Location. The kinds of interaction involve:
* Players receiving money
* Players paying money
* Players being moved

The particulars here are relative to the Location. There are a series of basic assignment of responsibility rules from Craig Larman called the GRASP patterns. As we come across relevant patterns, we’ll discuss them. There are two of the nine GRASP patterns that apply here:
||**Name**||**Desscription**||
||Polymorphism||Assign responsibility to the place where the behavior varies.||
||Expert||Put responsibility with the object that as the information to perform it.||

These two general assignment of responsibility patterns guide us to want to place responsibility in this as yet undefined class location.  Why do these patterns apply to this situation?
* Expert: The object that has the “knowledge” of what to do when you land on it is the location: Go, Luxury Tax, Income Tax, Go To Jail.
* Polymorphism: We have the same request, land on, and different responses: receive money, pay money, move, based on the location upon which the Player lands.

So we are missing a class: Location.

Remember that there are 7 steps to accomplish polymorphism in C++:
- include the 7 steps...

Before we write a test to verify this happens, we still have not addressed the issue of visibility. How does a Player:
* Know its current location?
* Know where it should land?

Currently the “current location” starts at 0 (an int). We already have a setLocation method in Player that takes an int. Now it needs to take a Location. We’ll need to make that change before we can go any further. So while we thought we didn’t have a need to refactor, in fact we do.

We’ll do this in several steps:
# Create a Location class (initially empty)
# Change Player to use Location instead of int
# Update all the places that won’t compile

So our first goal is to get back to compiling but failing tests.

### Red: Get Tests to Compile
First a simple Location class, here’s Location.hpp:
```cpp
# ifndef Location_hpp
# define Location_hpp

class Location {
};

# endif
```

Next we need to update Player.hpp:
```cpp
01: #ifndef Player_hpp
02: #define Player_hpp
03:
04: class Dice;
05: class Location;
06:
07: class Player {
08: public:
09:	Player();
10:	virtual ~Player();
11:	virtual void takeATurn(Dice& dice);
12:	Location *location() { return myLocation; }
13:	void setLocation(Location *loc) { myLocation = loc; }
14:	int balance() { return myBalance; }
15:	void deposit(int amount) { myBalance += amount; }
16:
17:private:
18:	Location *myLocation;
19:	int myBalance;
20: };
21:
22: if
```

||**Line**||**Description**||
||5||Forward declare the class Location. We do not actually do anything with the definition of Location since we only use pointers to Locations, so a forward declaration is all we need to get the header file to be correct and complete.||
||12||We’ve changed this line to return an attribute, myLocation, which is simply a pointer to a Player. Since we’re just working with Pointers, C++ knows all it needs to know with a forward declaration of Player. We’ve also changed this line to include an implicit inline implementation of the method so we’ll need to remove the method in the source file.||
||13|| We’ve updated this line to take a Location pointer. Notice that even though we are “using” the loc formal parameter, since it is a pointer, C++ knows all it needs to know to compile the line and thus we don’t need to see the class definition, just its declaration.||
||18||We’ve changed the type from int to Location*||

Now we need to update Player.cpp. There are two changes:
# The old takeATurn assumed myLocation was an int. It is now a pointer. For now, simply remove all of the code and leave the method empty.
# We also need to remove the non-inline version of location().

Finally, we need to update PlayerTest.hpp. Again, we’re just trying to get things to compile. We have two test methods: testPlayerTakesTurn, testPlayerMovesAroundBoard. Here are the changes to get things to compile:

**testPlayerTakesTurn**
# Replace the existing TS_ASSERT_EQUALS line with this: TS_FAIL(“Test needs rewriting”);

**testPlayerMovesAroundBoard**
# Setting the location was using an index and we used 39. That no longer makes sense, so just delete that line.
# Replace the TS_ASSERT_EQUALS with TS_FAIL(“Test needs rewriting”);

### Verify We’re back to Red
Now we need to run our tests to verify that we’re back to everything compiling (with a few tests failing):
```
$ make
./bin/monopoly_test.exe
Running 13 tests...........
In PlayerTest::testPlayerTakesTurn:
./PlayerTest.hpp:11: Error: Test failed: Test needs rewriting
In PlayerTest::testPlayerMovesAroundBoard:
./PlayerTest.hpp:19: Error: Test failed: Test needs rewriting
Failed 2 of 13 tests
Success rate: 84% 
```

OK, so now we’ll fix one test at a time. The first test, testPlayerTakesTurn, simply verifies that when a Player takes a turn and rolls a particular value, they end up on the correct location. To get this to work, the player rolls Dice and then advances the correct number of Locations. We need a way to do this. So our test needs to be able to put the Player on a known location, have them take a turn and then verify that they end up on the expected location.

Here are a few options on how we could make this work:
# Create a Board class that has all of the Locations. It knows the starting location and how to get from one Location to the next. Then we’ll have each location somehow know about the Board.
# Have each Location know about its neighbor. Then when the Player wants to move, it can ask its current location for its neighbor; doing so a number of times equal to what the dice rolled.

In both cases we need to make changes to Location. It either knows the Board or it knows its neighbor. Rather than introduce another class, we’ll take the route of Locations knowing their neighbor.

We have one more problem, when a Player rolls dice, they might end up with a number between 2 and 12 (inclusive). This means we need to consider making 13 locations (the start + 12 more) or make it so the dice roll a known value and then create enough location s for that situation.

How about this (rather big) change:
```cpp
01: #include <cxxtest/TestSuite.h>
02: #include "Dice.hpp"
03: #include "Player.hpp"
04: #include "Location.hpp"
05:
06: class FixedValueMockDice : public Dice {
07: public:
08:	FixedValueMockDice(int value) : fixedValue(value) {}
09:	int roll() { return fixedValue; }
10:	int faceValue() { return fixedValue; }
11:
12:private:
13:	int fixedValue;
14:};
15:
16:class PlayerTest : public CxxTest::TestSuite {
17:public:
18:	void testPlayerTakesTurn() {
19:		FixedValueMockDice d(2);
20:		Location start;
21:		Location loc1;
22:		Location loc2;
23:		start.setNext(&loc1);
24:		loc1.setNext(&loc2);
25:
26:		Player p;
27:		p.setLocation(&start);
28:		p.takeATurn(d);
29:		
30:		TS_ASSERT_EQUALS(&loc2, p.location());
31:	}
32: …
```
||**Line**||**Description**||
||4||We’ll now be using Location in our test so we need to include it.||
||6 – 14||Here’s a mock version of the Dice class that allows us to make it return a fixed value. Note, we’re relying on polymorphic behavior for both roll() and faceValue(), so we’ll need to make sure we’re using a pointer or reference to a Dice object and that those methods are virtual.||
||19||Create a mock dice that will always “roll” 2.||
||20 – 24||Create three Location objects. Start’s next is loc1. Loc1’s next is loc2. When the player rolls the dice and get back 2, they better end up on loc2.||
||27||Now we’re setting the Player’s starting location to a Location rather than an int.||
||30||Make sure they end up where we expect them to.||

Here’s the update to Dice.hpp:
```cpp
	virtual ~Dice();
	virtual int roll();
	virtual int faceValue();
```

None of these methods were virtual but now all of them are. Note that the mock inheriting from the Dice class violates the Liskov Substitution Principle. What is that? More on that in the refactoring section to follow.

Now we need to update the Player to actually use its Location object for movement. We need to make sure Player.cpp includes Location.hpp. Once we’ve added that, we update takeATurn:
```cpp
void Player::takeATurn(Dice& dice) {
	int rv = dice.roll();
	for(int i = 0; i < rv; ++i) {
		Location *next = location()->next();
		setLocation(next);
	}
}
```

There’s one more thing we need to do to avoid a segmentation fault. We need to update the other test in PlayerTest.hpp:
```cpp
	void testPlayerMovesAroundBoard() {
		Dice d;
		Player p;
//		p.setLocation(0);
//		p.takeATurn(d);
		TS_FAIL("Test needs rewriting");
	}
```

Don’t worry, we’ll get to it soon.

This should get us to one failing test:
```
$ make
./bin/monopoly_test.exe
Running 13 tests............
In PlayerTest::testPlayerMovesAroundBoard:
./PlayerTest.hpp:38: Error: Test failed: Test needs rewriting
Failed 1 of 13 tests
Success rate: 92% 
```

Now let’s fix that other test:
```cpp
	void testPlayerMovesAroundBoard() {
		Location start;
		Location loc1;
		Location loc2;
		start.setNext(&loc1);
		loc1.setNext(&loc2);
		loc2.setNext(&start);

		FixedValueMockDice d(2);
		Player p;
		p.setLocation(&loc2);
		p.takeATurn(d);

		TS_ASSERT_EQUALS(&loc1, p.location());
	}
```

Run your tests and you’ll see that we’re back to “Green”:
```
$ make
./bin/monopoly_test.exe
Running 13 tests.............OK! 
```

### Refactor
OK, we finally have some room for refactoring. If you review our two tests, you’ll notice that in both cases we three locations and set up their next attribute. The only difference is that in the first test we don’t connect the last location back to the start. We can refactor this common code using a test fixture.

Here’s an updated version of our test class that removes this duplicated code:
```cpp
01: #include <cxxtest/TestSuite.h>
02: #include "Dice.hpp"
03: #include "Player.hpp"
04: #include "Location.hpp"
05: 
06: class FixedValueMockDice : public Dice {
07: public:
08: 	FixedValueMockDice(int value) : fixedValue(value) {}
09: 	int roll() { return fixedValue; }
10: 	int faceValue() { return fixedValue; }
11: 
12: private:
13: 	int fixedValue;
14: };
15: 
16: class PlayerTest : public CxxTest::TestSuite {
17: private:
18: 	Player *p;
19: 	FixedValueMockDice *d;
20: 	Location *start;
21: 	Location *loc1;
22: 	Location *loc2;
23: 
24: public:
25: 	void setUp() {
26: 		p = new Player();
27: 		d = new FixedValueMockDice(2);
28: 		start = new Location();
29: 		loc1 = new Location();
30: 		loc2 = new Location();
31: 		start->setNext(loc1);
32: 		loc1->setNext(loc2);
33: 		loc2->setNext(start);
34: 	}
35: 
36: 	void tearDown() {
37: 		delete loc2;
38: 		delete loc1;
39: 		delete start;
40: 		delete d;
41: 		delete p;
42: 	}
43: 
44: 	void testPlayerTakesTurn() {
45: 		p->setLocation(start);
46: 		p->takeATurn(*d);
47: 		
48: 		TS_ASSERT_EQUALS(loc2, p->location());
49: 	}
50: 
51: 	void testPlayerMovesAroundBoard() {
52: 		p->setLocation(loc2);
53: 		p->takeATurn(*d);
54: 
55: 		TS_ASSERT_EQUALS(loc1, p->location());
56: 	}
57: };
```

There are quite a few changes. The quick summary is that test harnesses have methods you can write for setup and teardown before and after **each** test. Before each test we create player, dice and locations. We execute each test and then after each test we clean up all the memory we just allocated.

Here’s a more detailed description of our changes:
||**Line**||**Description**||
||17 – 22||Declare as instance variables all of the common variables used for each method.||
||25 – 34||Initialize all of our instance variables, essentially doing the work we were doing in each of our tests here. **Note** you do not call this method, CxxTest calls this method for you. It gets called **before** each test.||
||36 – 42||Clean up after ourselves. Release all of the memory we allocated in the setUp method. **Note** we do not call this method. CxxTest automatically calls this method **after** each test.||
||44 – 49||Note how this test is now much shorter.||
||51 – 56||Same comment, short test.||

## Refacotring: Defined
We refactor systems to (hopefully) improve the implementation of a system without changing its behavior. There are two words of note in that last sentence: improve, behavior.

Improve: There are many ways we can improve code including:
* Removing duplicated code (as we did here)
* Removing unnecessary or stale code
* Improving the clarity (adding or removing lines to make something more clear)
* Reducing the size of a method by breaking it into smaller methods
* Pulling parts of a class out of the class and into a new class to improve cohesion
* Using a design pattern to improve understandability
* Replacing conditional logic with polymorphism
* And the list goes on…

Behavior: What do we mean by behavior or how do we measure it? Here’s a pithy answer: our behavior is validated by our tests. If our system passes our tests, it is correct.

So when we refactor, we attempt to make improvements like the ones mentioned above without breaking any tests.

Our most recent refactoring reduced duplicated code and used some pre-defined “hook” methods provided by CxxUnit. The setup might seem a bit ugly but the tests look much better. It is easier to understand the **intent** of the tests so if a test does fail, it will be easier to understand what is wrong with our system.

## Red: Player’s balance does not change
We’re still working up to the ultimate goal of showing that when a player takes a turn and lands on Go, they should receive $200. Next, we need to make sure that when a player Lands on a regular location, their balance does not change.

Here’s such a test:
```cpp
# ifndef LOCATIONTEST_HPP_
# define LOCATIONTEST_HPP_

# include <cxxtest/TestSuite.h>
# include "Location.hpp"

class LocationTest : public CxxTest::TestSuite {
public:
	void testPlayerLandsOnLocationBalanceUnchanged() {
		Location l;
		Player p;
		
		int startingBalance = p.balance();
		l.landOn(&p);
		TS_ASSERT_EQUALS(startingBalance, p.balance());
	}
};

# endif /*LOCATIONTEST_HPP_*/
```

## Red: Get test to compile
This test won’t initially compile because Location does not have a landOn method like we added to Go. So update Location to have a landOn method:
```cpp
# ifndef Location_hpp
# define Location_hpp

class Player;

class Location {
public:
	void landOn(Player *player) {}
	void setNext(Location *next) { myNext = next; }
	Location *next() { return myNext; }

private:
	Location *myNext;
};

# endif
```

## Green: We’re already there
So now if we compile and run our tests, just adding the missing method to location should make the test pass. This is OK, because we’ve tested our way into adding a method to a base class. Verify that your tests pass:
```
% make
./debug/monopoly_test.exe
Running 14 tests..............OK!
```

## Refactor
We have a few holes in our current implementation, missing virtual methods and such. We’ll address this as we finally tie everything together and complete the “polymorphism loop.”

Now’s a great time to checkin.

## Red: Player sends a message to location
Now that we’re refactored and have a landOn method in our base class, we’re ready to tackle a bigger problem. We need to know if movement works as expected. We want to make sure that when a Player lands on Go they receive 200. We’ve already demonstrated that with a test in the GoTest test suite, so we don’t need to re-test that here (it would be an example of not isolating tests).

Player movement is a separate concern from landing specifically on Go, so I propose an easier solution. Let’s make sure that when a Player takes a turn, they send the message landOn to the location upon which they landed. We will mock out the behavior of a Location to track that fact:

How about this for the test:
```cpp
	void testPlayerSendsLandonDuringTurn() {
		p->setLocation(start);
		p->takeATurn(*d);
		
		TS_ASSERT_EQUALS(0, start->landonCount)
		TS_ASSERT_EQUALS(0, loc1->landonCount)
		TS_ASSERT_EQUALS(1, loc2->landonCount)
	}
```

This test simply has a player take a turn using a fixed dice (review previous tests) and confirms that the player send the message landOn to their final destination but none of the other destinations.

## Red: Get this test to compile
This test does not compile for several reasons:
* We have to create a mock location and have not yet done so
* The locations we are creating in the setUp method do not have a landonCount attribute

Here’s the start of a fix to the second problem:
```cpp
class LandonTrackingLocationMock : public Location {
public:
	LandonTrackingLocationMock() : landonCount(0) {}
	int landonCount;
};
```

We can add this mock to the PlayerTest.hpp. We next need to make sure that we’re using this class instead of a plain vanilla location object. We have two options here:
* Change the setUp method to create only these mock objects and impact every existing test
* Update the setUp and tearDown methods to not create plain vanilla locations and instead create these mock locations

Let’s take the second route, it’s quick and if we need to improve this, it’ll come up later:
```cpp
class PlayerTest : public CxxTest::TestSuite {
private:
	Player *p;
	FixedValueMockDice *d;
	LandonTrackingLocationMock *start;
	LandonTrackingLocationMock *loc1;
	LandonTrackingLocationMock *loc2;

public:
	void setUp() {
		p = new Player();
		d = new FixedValueMockDice(2);
		start = new LandonTrackingLocationMock();
		loc1 = new LandonTrackingLocationMock();
		loc2 = new LandonTrackingLocationMock();
		start->setNext(loc1);
		loc1->setNext(loc2);
		loc2->setNext(start);
	}
...
```

Verify that your tests run but do not pass:
```
%make
./debug/monopoly_test.exe
Running 15 tests.............
In PlayerTest::testPlayerSendsLandonDuringTurn:
./PlayerTest.hpp:70: Error: Expected (1 == loc2->landonCount), found (1 != 0)
Failed 1 of 15 tests
Success rate: 93%
```
## Green: Get this test to pass
 
OK, we have a few problems:
* First, Location serves as a base class and its destructor is not virtual (this is a C++ issue, not a TDD issue, but we need to fix it anyway)
* Second, we never actually call the landOn method on any location
* The landOn method in location is not virtual so we won’t get polymorphism in the first place.
* There’s a landOn method in Go, but Go does not inherit from the Location class.
* The mock location class needs to override landOn.

Here we go, first we’ll fix Location.hpp:
```cpp
# ifndef Location_hpp
# define Location_hpp

class Player;

class Location {
public:
	virtual ~Location() {}
	virtual void landOn(Player *player) {}
	void setNext(Location *next) { myNext = next; }
	Location *next() { return myNext; }

private:
	Location *myNext;
};

# endif
```

Next, we need to make sure that our LandonTrackingLocationMock class overrides landOn:
```cpp
class LandonTrackingLocationMock : public Location {
public:
	LandonTrackingLocationMock() : landonCount(0) {}
	void landOn(Player* p) { ++landonCount; }
	int landonCount;
};
```
 
We want to make sure that the Go class inherits from Location:
```cpp

# ifndef Go_hpp
# define Go_hpp

# include "Location.hpp"

class Player;

class Go : public Location {
public:
	void landOn(Player *player);
};

# endif
```

And finally, we need to make sure that a Player sends the message landOn during takeATurn:
```cpp
void Player::takeATurn(Dice& dice) {
	int rv = dice.roll();
	for(int i = 0; i < rv; ++i) {
		Location *next = location()->next();
		setLocation(next);
	}
	myLocation->landOn(this);
} 
```

Whew! That’s a lot of work. Do our tests pass:
```
% make
./debug/monopoly_test.exe
Running 15 tests..............OK!
```

Why all of this work? Introducing Polymorphism requires many steps (we’ve already mentioned these before, but they bear repeating because they are so important):
# Introduce a base class (Location in this case)
# Introduce a derived class (Go and LandonTrackingLocationMock)
# Write a method in the base class (landOn)
# Make sure that method is declared virtual
# Override the method in the derived class (Go and LandonTrackingLocationMock)
# Call that method through a pointer or reference (we call landOn from Player takeATurn)
# Create instances of the derived class (we updated the test)

### Key Point
Here’s an additional recommendation for C++. If a class is meant to serve as a base class, then add a destructor and make sure it is declared virtual.

## Summary
That was a bit of work. However, we now have had the plumbing in place to add new kinds of Locations and get different responses when a player takes a turn.

This is yet another great time to check in your work.

## User Story 2: Passing Go
Our next user story has the following acceptance tests:
# Player starts before Go near the end of the Board, rolls enough to pass Go. The Player's balance increases by $200.
# Player starts on Go, takes a turn where the Player does not additionally land on or pass over Go. Their balance remains unchanged.
# Player passes go twice during a turn. Their balance increases by $200 each time for a total change of $400.

Notice that all of these tests describe what happens during a Player’s turn, passing Go 1, 0 or 2 times. Let’s break this down in to a few steps:
# Show that when a Player sends a “passing” message to an instance of Go, the player receives $200.
# Show that when a Player sends a “passing” message to a regular location, nothing happens.
# Show that when a player takes a turn, we track the correct number of “passing” messages and “landing” messages.

## Test: Passing Go: Red: Writing the test
First we need to create our test. We’ll add a second test to GoTest.hpp:
```cpp
	void testPlayerReceives200WhenPassingGo() {
		Go g;
		Player p;
		g.passingOver(&p);
		TS_ASSERT_EQUALS(200, p.balance());
	}
```

This test looks a whole lot like the previous test. We’ll address that in the refactor stage after we’re green.

### Red: Getting tests to compile
We need to add a method to Go.hpp:
```cpp
	void passingOver(Player *player);
```

And add an implementation to Go.cpp:
```cpp
void Go::passingOver(Player *player) {
}
```

Your test should now compile but fail:
```
Running 16 tests...........
In GoTest::testPlayerReceives200WhenPassingGo:
./GoTest.hpp:18: Error: Expected (200 == p.balance()), found (200 != 0)
....
Failed 1 of 16 tests
Success rate: 93%
```

### Green: Get test to pass
This is pretty simple; to get our test to pass we need to add some code to passingOver:
```cpp
void Go::passingOver(Player *player) {
}
```

Run your tests, you should be green:
```
make
./debug/monopoly_test.exe
Running 16 tests................OK!
```

Success!

### Refactor
Now we need to review to see if we have any opportunities for refactoring. Reviewing GoTest.hpp, we can remove some duplication:
```cpp
# include <cxxtest/TestSuite.h>
# include "Go.hpp"
# include "Player.hpp"

class GoTest : public CxxTest::TestSuite {
public:
	Go *g;
	Player *p;
	
	void setUp() {
		g = new Go();
		p = new Player();
	}
	
	void tearDown() {
		delete p;
		delete g;
	}
	
	void testPlayerReceives200WhenLandingOnGo() {
		g->landOn(p);
		TS_ASSERT_EQUALS(200, p->balance());
	}
	
	void testPlayerReceives200WhenPassingGo() {
		g->passingOver(p);
		TS_ASSERT_EQUALS(200, p->balance());
	}
};
```

Verify you’re still green:
```
make
./debug/monopoly_test.exe
Running 16 tests................OK!
```

Check in and get ready for the next step.

## Test: Nothing happens when landing on regular location

Now we need to verify that Location doesn’t do what Go does, right? Really, we’re using this test to justify adding methods into the Location class (taking smaller steps rather than big steps).

### Red: Write the test, it won’t compile
Here’s a test that will verify nothing happens to the player if the pass over a generic location:
```cpp
	void testPlayerPassesOverLocationBalanceUnchanged() {
		Location l;
		Player p;
		
		int startingBalance = p.balance();
		l.passingOver(&p);
		TS_ASSERT_EQUALS(startingBalance, p.balance());
	}
```

This code does not compile because the Location class does not have a passingOver method.

### Red: Get the test to compile
We need to update Location.hpp to include this method. Since we know that Location is a base class and we know, given the previous test, that this method is meant to be overridden, we need to make this method virtual. Here’s an implementation:
```cpp
	virtual void passingOver(Player *player) {}
```

When you run your tests, you’ll notice that they pass. We went immediately to Green. Is this a problem? No. In this case we’re using a test to drive the introduction of a flex point into our software.
```
make
./debug/monopoly_test.exe
Running 17 tests.................OK!
```

### Refactor
If you review LocationTest.hpp, you’ll notice a lot of duplication. As with GoTest.hpp, we can get rid of some duplication:
```cpp
01: #ifndef LOCATIONTEST_HPP_
02: #define LOCATIONTEST_HPP_
03: 
04: #include <cxxtest/TestSuite.h>
05: #include "Location.hpp"
06: 
07: class LocationTest : public CxxTest::TestSuite {
08: public:
09: 	Location *l;
10: 	Player *p;
11: 	int startingBalance;
12: 	
13: 	void setUp() {
14: 		l = new Location();
15: 		p = new Player();
16: 		startingBalance = p->balance();
17: 	}
18: 	
19: 	void tearDown() {
20: 		delete l;
21: 		delete p;
22: 	}
23: 	
24: 	void testPlayerLandsOnLocationBalanceUnchanged() {
25: 		l->landOn(p);
26: 		TS_ASSERT_EQUALS(startingBalance, p->balance());
27: 	}
28: 	
29: 	void testPlayerPassesOverLocationBalanceUnchanged() {
30: 		l->passingOver(p);
31: 		TS_ASSERT_EQUALS(startingBalance, p->balance());
32: 	}
33: };
34: 
35: #endif /*LOCATIONTEST_HPP_*/
```

Verify that your tests run:
```
make 
./debug/monopoly_test.exe
Running 17 tests.................OK!
```

### Code Explained and Justified
We done something in this example that we’ve done elsewhere. Specifically lines 14 – 16 along with lines 20 – 21. Remember that before **every** test, CxxUnit executes the setUp method and after **every** test, CxxUnit executes the tearDown method. So here’s what’s happening for this particular test suite:
```
	setUp
		testPlayerLandsOnLocationBalanceUnchanged
	tearDown
	setUp
		testPlayerPassesOverLocationBalanceUnchanged
	tearDown
```

Why do we create new objects before each test and then after each test we delete them? Why not simply re-use the existing objects? We do this to make each test **isolated** from the previous and future tests. Each test has no lasting side-effects. This means when one test fails, it is less likely to cause a cascade down-stream.

Making your tests isolated in this way:
* simplifies writing each individual test
* makes one test not impact another test
* allows tests to run in any order (you really don’t control the order in general across unit test tools)
* may take longer to run
* may require a little more work

It’s not all a bed of roses. Writing a robust test that self-validates and then cleans up after itself is a little extra work. However, assuming you’re working in a team and you’re likely to run the tests frequently, the little extra time you spend making sure your tests are clean is easily paid back in:
* not having to fix reliable tests
* being able to add tests without having to worry about other tests
* keeps the test value high

Let me emphasize the last point. On the projects I’ve worked where people did not write tests this way, what enviably happens is tests start to fail frequently. When this happens, it no longer is considered a big deal that a test fails and people stop worrying about fixing failing tests. Then people start to assume a failed test could not possibly be the result of work they did and they start checking in stuff that causes other people problems. Then the whole system of unit tests starts to be fragile and a burden. By the time this happens, a project tends to have a great deal of technical debt and the pace grinds to a halt.

So spend the time now to make a good test, it most definitely pays for itself. Even if you eventually refactor and remove the need for the test, while that test is alive, it only fails when something broke and its value is in this fact.

## Red: Player Passes Over and Lands On Correctly
We’re ready to make sure that we’ve placed the hooks into Player properly. First we’ll discuss the background and then we’ll look at an existing test and model a new test around it to accommodate these new requirements.

When a planer passes Go, they should receive $200. We need to make sure that Go has a chance to do something when this occurs, so we need to make sure we send a message to Go at the correct time. 

When we added this to Player, we simply had Player send the landOn message to a Location and this gave us our hook. We now need to do the same thing, only we need to make sure we send the message at the right time.

Imagine a Player is on some location, “location 0”, and rolls 4. First they leave “location 0”. If “location 0” were an instance of go and the player told it “I’m passing you”, the player’s balance would increase by $200. So we don’t want to “pass” the location we started on. Their ultimate destination is “location 4”, to which they send the message landOn. What about locations 1 – 3? The player passes each one of them. The rule for passing, then, is the Player began before the location and ended up after the location.

With that in mind, here’s our original test:
```cpp
	void testPlayerSendsLandonDuringTurn() {
		p->setLocation(start);
		p->takeATurn(*d);
		
		TS_ASSERT_EQUALS(0, start->landonCount)
		TS_ASSERT_EQUALS(0, loc1->landonCount)
		TS_ASSERT_EQUALS(1, loc2->landonCount)
	}
```

Here’s a similar test to verify the passingCount:
```cpp
	void testPlayerSendsPassingOverDuringTurn() {
		p->setLocation(start);
		p->takeATurn(*d);
		
		TS_ASSERT_EQUALS(0, start->passingCount)
		TS_ASSERT_EQUALS(1, loc1->passingCount)
		TS_ASSERT_EQUALS(0, loc2->passingCount)
	}
```

### Red: Get the test to compile
To get our test to compile, we simply can add a passingCount attribute to our existing mock location:
```cpp
class LandonTrackingLocationMock : public Location {
public:
	LandonTrackingLocationMock() : landonCount(0) {}
	void landOn(Player* p) { ++landonCount; }
	int landonCount;
	int passingCount;
};
```

Verify that this test compiles but does not pass:
```
make all 
./debug/monopoly_test.exe
Running 18 tests.................
In PlayerTest::testPlayerSendsPassingOverDuringTurn:
./PlayerTest.hpp:79: Error: Expected (0 == start->passingCount), found (0 != 7407192)
./PlayerTest.hpp:80: Error: Expected (1 == loc1->passingCount), found (1 != 7407192)
./PlayerTest.hpp:81: Error: Expected (0 == loc2->passingCount), found (0 != 7407192)
Failed 1 of 18 tests
Success rate: 94%
```

We need to make sure to initialize and then update the count during a turn and we also need to make sure the player sends the message in the first place.

### Green: Get the test to pass
So we need to make sure we send the passingOver message correctly. Here’s one version that will work:
```cpp
void Player::takeATurn(Dice& dice) {
	int rv = dice.roll();

	for (int i = 0; i < rv; ++i) {
		Location *next = location()->next();

		if (i != rv - 1) {
			next->passingOver(this);
		}
		setLocation(next);
	}
	myLocation->landOn(this);
}
```

Run your tests, we should be green.
```
make
./debug/monopoly_test.exe
Running 18 tests..................OK!
```

### Refactor: Coupling
Does it feel strange that when a player takes a turn, it has to make sure to leave the first location, then only send passingOver to then enxt rollValue – 1 locations and landOn to the last location?

Sure what we have works, but a good sign that it might be a poor assignment of responsibility is the ugly if in the middle of our loop. Sure we could rewrite that to avoid the “if” with other techniques, but we’d essentially be “un-rolling” the conditional.

What if we moved this responsibility into location? At the very least we could “hide the ugliness” where it belongs.

Here’s a possible refactoring to address this (create a new class file Location.cpp:
```cpp
# include "Location.hpp"
# include "Player.hpp"

void Location::move(Player *p, int spaces) {
	Location *current = this;
	
	for (int i = 0; i < spaces; ++i) {
		current = current->next();
		
		if (i != spaces - 1) {
			current->passingOver(p);
		}
		p->setLocation(current);
	}
	
	current->landOn(p);
}
```

We need to update the SRCS macro in the makefile and add Location.cpp.

We have to update Player.cpp as well:
```cpp
void Player::takeATurn(Dice& dice) {
	int rv = dice.roll();
	location()->move(this, rv);
}
```

Rebuild and verify that your tests still pass:
```
make
./debug/monopoly_test.exe
Running 18 tests..................OK!
```

### Review
Is this an improvement? We’re essentially doing the same work as before, just in the Location instead of in the player. The disadvantage of this is that it might seem a bit strange at first glance. On the other hand, the nuances of movement end up not in the Player but in the Location. This seems to be a better assignment of responsibility.

## Refactor: Where's the tests?
Notice that we've placed movement into the responsibility of Locations, not Players yet we are actually verifying that when Player's take a turn, they send the right number of messages. We should move those tests where they belong.

Here are all of the updated files:
**PlayerTest.hpp**
```cpp
# include <cxxtest/TestSuite.h>
# include "Player.hpp"
# include "Location.hpp"
# include "FixedValueMockDice.hpp"

class PlayerTest : public CxxTest::TestSuite {
private:
	Player *p;
	FixedValueMockDice *d;
	Location *start;
	Location *loc1;
	Location *loc2;

public:
	void setUp() {
		p = new Player();
		d = new FixedValueMockDice(2);
		start = new Location();
		loc1 = new Location();
		loc2 = new Location();
		start->setNext(loc1);
		loc1->setNext(loc2);
		loc2->setNext(start);
	}

	void tearDown() {
		delete loc2;
		delete loc1;
		delete start;
		delete d;
		delete p;
	}

	void testPlayerTakesTurn() {
		p->setLocation(start);
		p->takeATurn(*d);
		
		TS_ASSERT_EQUALS(loc2, p->location());
	}

	void testPlayerMovesAroundBoard() {
		p->setLocation(loc2);
		p->takeATurn(*d);

		TS_ASSERT_EQUALS(loc1, p->location());
	}
};
```

**LocationTest.hpp**
```cpp
# ifndef LOCATIONTEST_HPP_
# define LOCATIONTEST_HPP_

# include <cxxtest/TestSuite.h>
# include "Location.hpp"
# include "FixedValueMockDice.hpp"

class LandonPassingTrackingLocationMock: public Location {
public:
	LandonPassingTrackingLocationMock() : landonCount(0), passingCount(0) {}
	void landOn(Player *p) { ++landonCount; }
	void passingOver(Player *p) { ++passingCount; }
	int landonCount;
	int passingCount;
};

class LocationTest : public CxxTest::TestSuite {
public:
	Location *l;
	FixedValueMockDice *d;
	LandonPassingTrackingLocationMock*start;
	LandonPassingTrackingLocationMock*loc1;
	LandonPassingTrackingLocationMock*loc2;
	Player *p;
	int startingBalance;
	
	void setUp() {
		l = new Location();
		p = new Player();
		startingBalance = p->balance();
		d = new FixedValueMockDice(2);
		start = new LandonPassingTrackingLocationMock();
		loc1 = new LandonPassingTrackingLocationMock();
		loc2 = new LandonPassingTrackingLocationMock();
		start->setNext(loc1);
		loc1->setNext(loc2);
		loc2->setNext(start);
	}
	
	void tearDown() {
		delete l;
		delete p;
	}
	
	void testPlayerLandsOnLocationBalanceUnchanged() {
		l->landOn(p);
		TS_ASSERT_EQUALS(startingBalance, p->balance());
	}
	
	void testPlayerPassesOverLocationBalanceUnchanged() {
		l->passingOver(p);
		TS_ASSERT_EQUALS(startingBalance, p->balance());
	}

	void testLocationSendsLandonDuringTurn() {
		p->setLocation(start);
		p->takeATurn(*d);
		
		TS_ASSERT_EQUALS(0, start->landonCount)
		TS_ASSERT_EQUALS(0, loc1->landonCount)
		TS_ASSERT_EQUALS(1, loc2->landonCount)
	}

	void testLocationSendsPassingOverDuringTurn() {
		p->setLocation(start);
		p->takeATurn(*d);
		
		TS_ASSERT_EQUALS(0, start->passingCount)
		TS_ASSERT_EQUALS(1, loc1->passingCount)
		TS_ASSERT_EQUALS(0, loc2->passingCount)
	}
};

# endif /*LOCATIONTEST_HPP_*/
```

Here's a new file. We now use this mock in multiple places so it's now in its own location:

**FixedValueMockDice.hpp**
```cpp
# ifndef _FIXEDVALUEMOCKDICE_HPP
# define _FIXEDVALUEMOCKDICE_HPP

# include "Dice.hpp"

class FixedValueMockDice : public Dice {
public:
	FixedValueMockDice(int value) : fixedValue(value) {}
	int roll() { return fixedValue; }
	int faceValue() { return fixedValue; }

private:
	int fixedValue;
};

# endif
```

Run your tests and verify you are still green.

After you've made this update, you're ready to check in again.

# Review where we’re at
We’ve finished the first two user stories and we have the following three left for this iteration:
* Landing on Go To Jail
* Landing on Income Tax
* Landing on Luxury Tax

It is now time to finish up these last three stories. Before we do, let’s recap where we are:
# We have demonstrated that when a player lands on Go, they receive 200
# We have demonstrated that when a player passes over Go, they receive 200
# We have demonstrated that when a player lands on a regular location, nothing happens
# We have demonstrated that when a player passes over a regular location, nothing happens,
# We have demonstrated that when a player takes a turn, the end result is the correct locations getting sent passOver and landOn.

With all of these facts in place, all we have left to make sure we have support for each of these new kinds of locations is the following:
> Show that we get the correct effect for each of the three remaining stories

To make our results seem more tangible (to people not comfortable with TDD), we’ll also create a smoke test that:
# Creates a set of Squares with each of the kinds of locations we’ve discussed
# Creates a Game with those squares
# Creates a few Players
# Has those players “play a game” and produce some output

We don’t do this as a unit test, but just a smoke test to make sure everything ties together.

## Red: Landing on Go To Jail
Here’s a test for landing on GoToJail:
```cpp
# include <cxxtest/TestSuite.h>

# include "GoToJail.hpp"
# include "Player.hpp"

class GoToJailTest : public CxxTest::TestSuite {
public:
	void testLandingOnChangesLocation() {
		GoToJail j;
		Location destination;
		j.setDestination(&destination);
		
		Player p;
		
		j.landOn(&p);
		TS_ASSERT_EQUALS(&destination, p.location());
	}
};
```

This test sets up an instance of GoToJail and verifies that when a player lands on it, the player is sent to the correct destination (a value we set).

## Red: Get it to compile
Here’s the minimal amount necessary to get our test to compile:
```cpp
# ifndef GOTOJAIL_HPP_
# define GOTOJAIL_HPP_

# include "Location.hpp"

class GoToJail : public Location {
public:
	void setDestination(Location *dest) {}
};

# endif /*GOTOJAIL_HPP_*/
```

Verify that your tests now passes but does not compile:
```
%make
Running 19 tests............
In GoToJailTest::testLandingOnChangesLocation:
./GoToJailTest.hpp:16: Error: Expected (&destination == p.location()), found ({ 40 C9 22 00  } != { 00 00 00 00  })
......
Failed 1 of 19 tests
Success rate: 94%
```

## Green: Get our tests to pass
We need to override the landOn method in GoToJail to do what it is supposed to do:
```cpp
# ifndef GOTOJAIL_HPP_
# define GOTOJAIL_HPP_

# include "Location.hpp"
# include "Player.hpp"

class GoToJail : public Location {
public:
	void landOn(Player *p) { p->setLocation(destination); }
	void setDestination(Location *dest) { destination = dest; }
	
private:
	Location *destination;
};

# endif /*GOTOJAIL_HPP_*/
```

Now verify you’re green:
```
% make
./debug/monopoly_test.exe
Running 19 tests...................OK!
```

Success! However, we might want to consider a little refactoring before we finish.

## Refactor
First, we’ve written the entire implementation inline. Virtual functions and inline don’t really play well together. The C++ compiler will generate a non-inline method to take care of this so maybe it’s not a big issue.

On the other hand, because we’ve provided the implementation in an implicit inline, we must include Player.hpp rather than forward-declare Player. We must do so since we send a message to Player. We can remedy both of these situations by simply putting the code for landOn in GoToJail.cpp:

```cpp
# ifndef GOTOJAIL_HPP_
# define GOTOJAIL_HPP_

# include "Location.hpp"
class Player;


class GoToJail : public Location {
public:
	void landOn(Player *p);
	void setDestination(Location *dest) { destination = dest; }
	
private:
	Location *destination;
};

# endif /*GOTOJAIL_HPP_*/
 ```

```cpp
# include "GoToJail.hpp"

# include "Player.hpp"
void GoToJail::landOn(Player *p) { 
	p->setLocation(destination); 
} 
```

Remember, we’ve added a source file so we need to add it to the SRCS macro in our makefile.

Rerun to verify nothing is broken:
```
% make all 
./debug/monopoly_test.exe
Running 19 tests...................OK!
```
Success! And we’re finished refactoring so it’s time to check in all of our changes.

## Red: Landing on Income Tax
This next one involves a calculation. Income tax costs 10% of the Player’s total worth up to a maximum of $200. First the test:
```cpp
# include <cxxtest/TestSuite.h>

# include "IncomeTax.hpp"
# include "Player.hpp"

class IncomeTaxText : public CxxTest::TestSuite {
public:
	void testPlayerPaysUnderMaxAmount() {
		IncomeTax it;
		Player p;
		p.deposit(1500);
		it.landOn(&p);
		TS_ASSERT_EQUALS(1350, p.balance());
	}
};
```

We verify that when a player with a balance of $1500 lands on Income Tax, their total charge is $150.

## Red: Get test to pass
To get this test to pass, we need to add IncomeTax.hpp:
```cpp
# ifndef INCOMETAX_HPP_
# define INCOMETAX_HPP_

# include "Location.hpp"

class IncomeTax : public Location {
	
};

# endif /*INCOMETAX_HPP_*/
```

Verify that you are now compiling but the test is failing:
```
% make
Running 20 tests.............
In IncomeTaxText::testPlayerPaysUnderMaxAmount:
./IncomeTaxTest.hpp:13: Error: Expected (1350 == p.balance()), found (1350 != 1500)
......
Failed 1 of 20 tests
Success rate: 95%
```

## Green: Get the test to pass

We need to add the landOn method to make this all work. First update IncomeTax.hpp:
```cpp
# ifndef INCOMETAX_HPP_
# define INCOMETAX_HPP_

# include "Location.hpp"

class IncomeTax : public Location {
public:
	void landOn(Player *player);
};

# endif /*INCOMETAX_HPP_*/
```

And then we add the method to IncomeTax.cpp (we’re avoiding adding the implementation to the header file since we know it’s a virtual method we’re overriding):
```cpp
# include "IncomeTax.hpp"

# include "Player.hpp"

void IncomeTax::landOn(Player *p) {
	int balance = p->balance();
	
	int tax = balance / 10;
	
	p->deposit(-tax);
}
```

Make sure to add IncomeTax.cpp to the SRCS macro, build and verify that your tests all pass:
```
% make
./debug/monopoly_test.exe
Running 20 tests....................OK!
```

Success!

## Refactor
We’ll keep asking this every time. Do you notice anything that might be refactored? If so, make those changes, and verify you’re still Green.

Now is a great time to check in your work.

## Red: Verify Amounts > 2000

Now we need to verify our formula works for balances > 2000:
```cpp
	
	void testPlayerPaysMaxAmountBalanceAbove2000() {
		IncomeTax it;
		Player p;
		p.deposit(2213);
		it.landOn(&p);
		TS_ASSERT_EQUALS(2013, p.balance());
	}
```

This test will compile and run, but it should fail. Verify that it does:
```
% make
Running 21 tests..............
In IncomeTaxText::testPlayerPaysMaxAmountBalanceAbove2000:
./IncomeTaxTest.hpp:21: Error: Expected (2013 == p.balance()), found (2013 != 1992)
......
Failed 1 of 21 tests
Success rate: 95%
```

## Green: Get test to pass
Update the implementation of landOn:
```cpp
void IncomeTax::landOn(Player *p) {
	int balance = p->balance();
	
	int tax = balance > 2000 ? 200 : balance / 10;
	
	p->deposit(-tax);
}
```

Verify that your tests now pass:
```
% make all 
./debug/monopoly_test.exe
Running 21 tests.....................OK!
```

# Final User Story
We have to repeat what we just did for Luxury Tax. The rule is simple, it costs $75 to land on Luxury tax.

## Red: Write the test, it won’t compile
Here’s our test:
```cpp
# include <cxxunit/TestSuite.h>

# include "LuxuryTax.hpp"

class LuxuryTaxTest : public CxxUnit::TestSuite {
public:
	void testLandingCosts75() {
		LuxuryTax t;
		Player p;
		t.landOn(&p);
		TS_ASSERT_EQUALS(-75, p.balance());
	}
};
```

## Red: Get the test to compile
```cpp
# ifndef LUXURYTAX_HPP_
# define LUXURYTAX_HPP_

# include "Location.hpp"

class LuxuryTax : public Location {
	
};

# endif /*LUXURYTAX_HPP_*/
```

Build and make sure your tests compile but do not run:
```
% make
./debug/monopoly_test.exe
Running 21 tests.....................OK!
```

## Green: Get the test to pass

Now we need to override the landOn method, so we’ll update the header file and add a source file:
```cpp
# ifndef LUXURYTAX_HPP_
# define LUXURYTAX_HPP_

# include "Location.hpp"

class LuxuryTax : public Location {
public:
	void landOn(Player *player);	
};

# endif /*LUXURYTAX_HPP_*/

```cpp
# include "LuxuryTax.hpp"
# include "Player.hpp"

void LuxuryTax::landOn(Player *p) {
	p->deposit(-75);
}
```

Make sure to add LuxuryTax.cpp to the SRCS macro in your makefile, build and see if your tests pass:
```
% make
./debug/monopoly_test.exe
Running 21 tests.....................OK!
```

Succcess!

## Refactor
There’s not much need to refactor. The one strange thing is that we have a single method, deposit, and are sending in positive and negative values. The name seems a bit off.

Review the code and apply any refactorings you deem necessary.

Make sure you are green and check in your code.

# Summary
This concludes iteration 2. We really need to bring everything together. The next iteration will do so by creating a number of locations, using each of our new sub-classes of Location and then demonstrate a game playing 20 rounds.
