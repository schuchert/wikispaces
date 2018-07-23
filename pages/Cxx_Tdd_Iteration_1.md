---
title: Cxx_Tdd_Iteration_1
---
# Getting Started
This tutorial uses a game similar to Monopoly(r) as a basis for our work. The rules we implement are not exactly the same as Monopoly(r) because the point is not Monopoly(r), it's TDD. If you just want to see what the end results for this iteration look like, then [look here]({{ site.pagesurl}}/Cxx Tdd Iteration 1#EndGame).

This iteration's theme is: **Player Movement**
[[include page="Monopoly(r) Release 1 Theme Description"]]

[[include page="Monopoly(r) Release 1 User Stories WO Link"]]

## Our First User Story
Here is our current user story:
[[include page="Monopoly(r) R1 Player Movement"]]

Our first test seems seems simple enough. A player takes a turn and moves around the board. However, let's break this down into a few parts so we can take some simple steps (note for this first test we're moving between [TDD]({{ site.pagesurl}}/Test Driven Development) and [TFD]({{ site.pagesurl}}/Test First Development)):
* Players move in the game using dice, so let's start by creating a single die object.
* When we have a single die object, we'll create a Dice object to manage rolling the pair.
* Then we'll have a player use the Dice to take a turn

Here's the very first thing we'll write:
### Test 1: Red: test rolling a die
```cpp
00: #include <cxxtest/TestSuite.h>
00: #include <vector>
01: #include "Die.hpp"
02: 
03: class DieTest : public CxxTest::TestSuite {
04: public:
05: 	void testRoll() {
06: 		Die d;
07: 		std::vector<int> values(7);
08: 
09: 		for(int i = 0; i < 10000; ++i) {
10: 			++values[d.roll()];
11: 		}
12: 
13: 		TS_ASSERT_EQUALS(0, values[0])
14: 		for(int i = 1; i < values.size(); ++i) {
15: 			TS_ASSERT(values[i] > 100)
16: 		}
17: 	}
18: };
```

**Description**
|**Line**|**Description**|
|1|The key include file for CxxText. CxxTest consists of header files and some source files that get included. You need to make sure your build system can find CxxTest's header files but other than that one requirement, there's nothing else you'll need to do to make CxxTest work.|
|2|We are going to be using this as-yet-to-be-created class. Since we are actually **using** it, we must include it. We cannot simply forward declare the Die type.|
|3|This class represents a test suite. This naming standard comes from a long-established convention in the JUnit community: Name of unit under test (Die) + Test -> DieTest. The class itself must inherit from TestSuite, which is in the CxxTest namespace.|
|4|All of your test methods will need to be public. Otherwise the code generator will generate code that won't compile because the generated code will attempt to call a private method.|
|5|All test methods: return void, take no parameters and are named testXXX. That's a convention you must follow unless you plan to write your own code generator.|
|6|Create a die, the unit under test, that we'll actually use in this test.|
|7|We're attempting to verify that when rolled, a die will return values from [1..6]. So we create a vector of int's with an index from [0..6]. We'll keep track of how many times a die generates each value and we use the index size of 7 to avoid having to subtract one.|
|9|Testing **random** stuff is tough. Testing is a **sampling** technique. So this test is going to execute 10,000 times, with the hope that 10,000 reduces our risk essentially to near 0.|
|10|Roll the die and increment the value in the array whose index is equal to the die's roll. What happens if the die rolls a value < 0 or > 6? This test will fail and we'll know it. So I don't need to check outside of that range, the result will be a failing test, which is fine.|
|13|Make sure we never rolled 0. TS_ASSERT_EQUALS is a **macro**, notice that the line does not end with a semi-colon (;). You could add one, it won't hurt, but it is not necessary. TS_ASSERT_EQUALS uses the operator equal-equal to compare the value on the left with the value on the right. If operator equal-equal returns false, then then you'll get a failed test.|
|14 - 15|Verify that the values in the vector at index [1..6] are "reasonable." You might think that 100 3's, for example, is not enough given 10,000 roles. This test is just trying to make sure we're relatively certain that the unit under test, Die, works well.|

This is our first test, so let's state the goals of a unit test:
* **Automated**: You write the test so that it performs its setup, execution, validation and cleanup automatically. You spend the "extra" time to do this because we'll run these *a lot* so time spent making these automated will pay back big.
* **Self Checking**: These are self-checking so that we can run thousands of them in rapid succession and we don't have to hand-check the results.
* **Produce no output**: OK, you'll know if a test fails because you'll see some indication of failure. You'll also see an overall indication of success, but in both of those cases, the test harness generates this output. Your unit tests should produce no output because it just be noise. The only important part is passing or not-passing. If you start introducing output, more will appear. Then people will start validating by using the output and eventually your test system will begin to collapse in on itself.
* **Fast**: You should be able to run thousands of tests multiple times per day (every hour in fact if you can manage it). If you cannot run them quickly, then eventually people will stop running them and their value will diminish. They will also suffer exponential bit-rot and eventually lose nearly all of their value.
* **Reliable**: Pass means pass. Fail means fail. Never a question to doubt the results.
* **Independent**: A test should not depend on a previous test or setup for a future test. A test should leave no side effects. Tests can be run in any order (and even at the same time).
* **Isolated**: A test should have no external dependencies, e.g. setting up a database, or relying on services or resources to be in a particular state. If this is a requirement, it will get broken at some point. This will  may start to happen frequently. When this does, pass/fail lose their meaning. When tests do not reliably indicate pass/fail, people will start to ignore them.

Our first test probably meets all of these criterion, so we'll move on to the second part of the Red phase.
**Notes**
* A traditional header file begins looks like this:
```
   #ifndef XXX_h
   #define XXX_h
   ...
   #endif
```
> This header file is not meant to be included bur rather used by a code generator tool. The use of this idiom to avoid processing of a file a second time if it is included twice is unnecessary. It would do no harm, so if not having this in makes you feel uncomfortable, consider adding it.

This code won't compile yet:
* We include Die.hpp, but it doesn't exist.
* It uses a Die ctor and a roll method

### Red: Get it to compile
Now we need to create the Die.hpp and Die.cpp to get this to compile.

**Die.hpp**
```cpp
# ifndef Die_hpp
# define Die_hpp

class Die {
public:
	Die();
	int roll();
};

# endif
```

**Die.cpp**
```cpp
# include "Die.hpp"

Die::Die() {
}

int Die::roll() {
	return 0;
}
```

We need one more piece of boilerplate code to bring this altogether: 
**main.cpp**
```cpp
# include <cxxtest/ErrorPrinter.h>

int main( int argc, char* argv[]) {
	CxxTest::ErrorPrinter errorPrinter;
	errorPrinter.run();
	return 0;
}
```  

### Red: Getting it to run
We're going to start by first generating and executing our tests using the command line. Once we've managed to do that, we'll introduce a makefile to handle all of our steps for us.

**The Steps**
# Use cxxtestgen, which comes with CxxTest, to generate the source file for your tests
# Compile and link everything
# Run your tests
# Review results
```
$ <path to cxx dir>/cxxtestgen.pl DieTest.hpp -o tests.cpp
$ g++ *.cpp -I <path to cxx dir> -o main
$ ./main
Running 1 test
In DieTest::testRoll:
DieTest.hpp:15: Error: Expected (0 == values[0]), found (0 != 10000)
DieTest.hpp:17: Error: Assertion failed: values[i] > 100
DieTest.hpp:17: Error: Assertion failed: values[i] > 100
DieTest.hpp:17: Error: Assertion failed: values[i] > 100
DieTest.hpp:17: Error: Assertion failed: values[i] > 100
DieTest.hpp:17: Error: Assertion failed: values[i] > 100
DieTest.hpp:17: Error: Assertion failed: values[i] > 100
Failed 1 of 1 test
Success rate: 0%
```

Congratulations, you've got your test and code compiling, linking and executing. We've finished the "Red" part, now on to "Green". We need to make the test pass.

### Green: Get the test to pass
Here's an updated version of Die.cpp that should generate proper random values:
```cpp
# include <climits>
# include <stdlib.h>
# include "Die.hpp"

Die::Die() {
}

int Die::roll() {
	return (INT_MAX - rand()) % 6 + 1;
}
```

OK, did this work? We need to build and execute again (we could skip this first step since we didn't change the test):
```
$ <path to cxx dir>/cxxtestgen.pl DieTest.hpp -o tests.cpp
$ g++ *.cpp -I <path to cxx dir> -o main
$ ./main
Running 1 test.OK!
```

Success! 

Congratulations, we are now "Green".

### Refactor
If we review our code, do we see any places where we might refactor? So far I'll suggest no, so we're ready to make sure our Die works in a few more ways by adding a few more tests (one at a time).

By the way, if you're using source code control, now is a great time to checkin. You're green and you don't need to refactor.

### Conclusions
Is this a good start? I believe so. Here are a few things to consider about unit tests:
* We can use unit tests to drive us to a design (TDD)
* In general, testing is a sampling technique, even if you test every line of code, you're still sampling
* Tests should help manage risk, the higher the risk, the more we need to test
* We're often not so good at understanding risk, so test anyway.
----
### Sidebar: the make file
TDD requires that it is **quick** to write, **easy** to build and execute and **fast** to run your tests. Here's what might happen if we don't have one of these:
* If it is not **quick** to develop unit tests, then you won't develop unit tests
* If it is not **easy** to build and execute, then you won't do it very often (several times a day is a good start).
* If it is not **fast** then people won't run them and you'll lose valuable feedback and start to grow design debt.

As I was developing this first iteration, I was constantly trying to improve my makefile to support my TDD life-cycle. Here are my goals for a build system:
* It is under revision control.
* Anybody can check it out of the repository (subversion in my case) and immediately build and execute the tests by typing "make"
* The dependences are managed using makedepend
* I keep the source and object files in different places
* The build is as quick as I can get the compile to happen (I use forward declares in my header files when  possible)
* I have some basic support for updating, checking in and adding files in the makefile because I want to encourage checking in often (multiple times per day)

As a consultant, I notice people thinking I'm crazy about the idea of checking in multiple times per day (and integrating with everybody else who's also checking in multiple times per day). It's possible, I've done it on teams up to 60 people. It doesn't happen for free, you have to start with the goal in mind.

I mention all of this because you might think the makefile is overkill for this project. You might not, it all depends on how you prefer to work.
----
## Test 2: Red: Reasonable Initial Value
Next, we want to make sure that when we create a die object, it has a reasonable initial value. Here's one way to test that:
```cpp
	void testRandomInitialValue() {
		std::vector<int> values(7);

		for(int i = 0; i < 1000; ++i) {
			Die d;
			++values[d.faceValue()];
		}

		for(int i = 1; i < values.size(); ++i) {
			TS_ASSERT(values[i] > 10);
		}
	}
```

This test uses a new method, faceValue(), to get the current value. If we add this test, we'll be back to "Red" because our system won't compile. To get this to compile, we'll need to add the method to the header file and then give it an implementation.

### Red: Get your test to compile
Add the following public method to your Die.hpp:
```cpp
int faceValue();
```

And to get this to compile, we'll need to additionally add the method to Die.cpp:
```cpp
int Die::faceValue() {
	return 0;
}
```

Verify that we're Building but still red:
```
$ <path to cxx dir>/cxxtestgen.pl DieTest.hpp -o tests.cpp
$ g++ *.cpp -I <path to cxx dir> -o main
$ ./main
Running 2 tests.
In DieTest::testRandomInitialValue:
DieTest.hpp:30: Error: Assertion failed: values[i] > 10
DieTest.hpp:30: Error: Assertion failed: values[i] > 10
DieTest.hpp:30: Error: Assertion failed: values[i] > 10
DieTest.hpp:30: Error: Assertion failed: values[i] > 10
DieTest.hpp:30: Error: Assertion failed: values[i] > 10
DieTest.hpp:30: Error: Assertion failed: values[i] > 10
Failed 1 of 2 tests
Success rate: 50%
```

### Green: Get your tests to pass
Sure enough, we're failing. So now we need to update our class. Since a Die object needs to know its last value, we'll need to add an attribute. Here's the updated Die.hpp:
```cpp
# ifndef Die_hpp
# define Die_hpp

class Die {
public:
	Die();
	int roll();
	int faceValue();

private:
	int value;
};

# endif
```

Next, we need to use this attribute Die.cpp:
```cpp
# include <climits>
# include <stdlib.h>
# include "Die.hpp"

int generateRandomValue() {
	return (INT_MAX - rand()) % 6 + 1;
}

Die::Die() : value(generateRandomValue()) {
}

int Die::roll() {
	return value = generateRandomValue();
}

int Die::faceValue() {
	return value;
}
```

Note, we wanted to make sure we have a valid initial value. We could have simply called the roll() method from the ctor. I didn't because I suspect I'll be making roll() virtual (to support loading dice for testing purposes). I want to avoid calling virtual methods from a ctor. I also used the constructor initialization list simply because it's how I prefer to write my initialization.

This test should now pass:
Verify that we're Building and green:
```
$ <path to cxx dir>/cxxtestgen.pl DieTest.hpp -o tests.cpp
$ g++ *.cpp -I <path to cxx dir> -o main
$ ./main
Running 2 tests..OK!
```

Success! Congratulations you've written your second test before writing your code. This is another fine time to check your work into the repository. If you were working in a team environment, you'd first update your local version with changes in the repository, build, run all tests and if they all still pass, then you are integrated and ready to checkin.

### Refactor
Review all of your code. Do you notice anything worth refactoing?
* Have we duplicated code?
* Have we violated any C++ idioms?
* Are there any unused or unnecessary methods?
* Do any of the tests seem to cover the others?

Right now we don't have a lot of code (test or mainline) so there's not much to refactor. Even if we "know" this, we should check each time.

By the way, what is the definition of refactor?
> Change the implementation of the system without changing the behavior.

The behavior of our system is defined by the tests, so when we say "without changing the behavior" this really means "don't break any tests.

## Test 3: Building Dice class
Now that we have a single die working, it's time to move on to a second class, Dice. As before, we'll start with a test:
```cpp
# include <cxxtest/TestSuite.h>
# include "Dice.hpp"

class DiceTest : public CxxTest::TestSuite {
public:
	void testRoll() {
		Dice d;
		d.roll();
		TS_ASSERT(d.faceValue() >= 2 && d.faceValue() <= 12)
	}
};
```

This won't compile so let's go ahead and get this to compile:
```cpp
# ifndef Dice_hpp
# define Dice_hpp

# include <vector>
class Die;

class Dice {
public:
	Dice();
	~Dice();
	int roll();
	int faceValue();
	
private:
	typedef std::vector<Die*> c_d;
	c_d dice;
};

# endif
```

```cpp
# include "Dice.hpp"
# include "Die.hpp"

Dice::Dice() {
}

Dice::~Dice() {
}

int Dice::roll() {
	return 0;
}

int Dice::faceValue() {
	return 0;
}
```

We need to build and run this:
```
$ <path to cxxtest>/cxxtestgen.pl DiceTest.hpp DieTest.hpp -o tests.cpp
$ g++ *.cpp -I ~/cpp/cxxtest/cxxtest/ -o main.exe
$ ./main
Running 3 tests
In DiceTest::testRoll:
DiceTest.hpp:9: Error: Assertion failed: d.faceValue() >= 2 && d.faceValue() <
12
..
Failed 1 of 3 tests
Success rate: 66%
```

Well are now compiling and at the end of the Red phase, it's time to go green. Here are some updates to Dice.cpp:
```cpp
# include "Die.hpp"

Dice::Dice() {
	for(int i = 0; i < 2; ++i) {
		dice.push_back(new Die());
	}
}

Dice::~Dice() {
	for(c_d::iterator it = dice.begin(); it != dice.end(); ++it) {
		delete *it;
	}
}

int Dice::roll() {
	for(c_d::iterator it=dice.begin(); it != dice.end(); ++it) {
		(*it)->roll();
	}

	return faceValue();
}

int Dice::faceValue() {
	int sum = 0;
	for(c_d::iterator it = dice.begin(); it != dice.end(); ++it) {
		sum += (*it)->faceValue();
	}

	return sum;
}
```

Rebuild and run your tests and you should now have passing tests:
```
$ <path to cxxtest>/cxxtestgen.pl DiceTest.hpp DieTest.hpp -o tests.cpp
$ g++ *.cpp -I ~/cpp/cxxtest/cxxtest/ -o main.exe
$ ./main
Running 3 tests...OK!
```

Let's add one more test to DiceTest.hpp to verify that the initial value is a good one. Here's a complete DiceTest.hpp:
```cpp
# include <cxxtest/TestSuite.h>
# include "Dice.hpp"

class DiceTest : public CxxTest::TestSuite {
public:
	void assertValue(Dice& d) {
		TS_ASSERT(d.faceValue() >= 2 && d.faceValue() <= 12)
	}

	void testRoll() {
		Dice d;
		d.roll();
		assertValue(d);
	}

	void testInitialValue() {
		Dice d;
		assertValue(d);
	}
};
```

Build and execute this to see if this test passes (it will):
```
$ <path to cxxtest>/cxxtestgen.pl DiceTest.hpp DieTest.hpp -o tests.cpp
$ g++ *.cpp -I ~/cpp/cxxtest/cxxtest/ -o main.exe
$ ./main
Running 4 tests...OK!
```

In retrospect, this test was probably not necessary. Why? We already knew that Die objects initialize themselves properly and we are using those, correct? Since we've already tested the functionality in the contained class, we don't need to essentially validate the functionality in the containing class. This is an example of writing a test that is not isolated. We'll leave it for now.

## Building is a Pain
It's time to address the building issues. Since this tutorial is about TDD and not about writing makefiles, I won't spend much time discussing this makefile. First the makefile:
```
# ---------------------------------------------------------------------------
# Every time you add a source file, update this list. Everything else should
# get picked up so long as you name your CxxTest files *Test.cpp
SRCS	=	Dice.cpp Die.cpp Game.cpp Main.cpp Player.cpp

# ---------------------------------------------------------------------------
MAKE=make
RM=rm
MKDIR=mkdir

OUTDIR	=	bin
OUTFILE	=	$(OUTDIR)/monopoly_test.exe
CXXTEST	=	../cxxtest/cxxtest
CXXTEST_INC=	-I$(CXXTEST)
GCC_CPP	=	/usr/lib/gcc/i686-pc-cygwin/3.4.4/include/c++
OBJ	=	$(OUTDIR)/tests.o $(SRCS:%.cpp=$(OUTDIR)/%.o)

MD_FILE = 	$(OUTDIR)/dependencies
MD_ARGS = 	-f$(MD_FILE) -I $(GCC_INC)/ -I $(GCC_INC)/i686-pc-cygwin \
		$(CXXTEST_INC)

COMPILE	=	g++ -c -g -o "$(OUTDIR)/$(*F).o" $(CXXTEST_INC) "$<"
LINK	=	g++ -g -o "$(OUTFILE)" $(OBJ) $(CXXTEST_INC)

# Pattern rules
$(OUTDIR)/%.o : %.c
	$(COMPILE)

$(OUTDIR)/%.o : %.cpp
	$(COMPILE)

# Build rules
all: $(OUTFILE) test

$(OUTDIR)/tests.o: *.hpp
	$(CXXTEST)/cxxtestgen.pl -o $(OUTDIR)/tests.c *Test.hpp
	g++ -c -I. -I../cxxtest/cxxtest -o $(OUTDIR)/tests.o $(OUTDIR)/tests.c

$(OUTFILE): $(OUTDIR)  $(OBJ)
	$(LINK)

$(OUTDIR):
	$(MKDIR) -p "$(OUTDIR)"

test:
	./$(OUTFILE)

# Rebuild this project
rebuild: cleanall all

depend:
	@echo "Updating dependencies in makefile..."
	@touch $(MD_FILE)
	@makedepend -p$(OUTDIR)/ *.?pp $(MD_ARGS)

# Clean this project
clean:
	$(RM) -rf $(OUTDIR)

# Clean this project and all dependencies
cleanall: clean

-include $(MD_FILE)
```

## Using the makefile
Crete a makefile in the current directory and copy the contents above. There are two macros you need to concern yourself with:
* SRCS -> This is where you add your new source files, e.g. Die.cpp, Dice.cpp, Main.cpp
* CXXTEST -> this should point to the directory where you extracted CxxTest. (i.e. the directory that contains cxxtestgen.pl.)

Also, this make file assumes you name your test files *Test.hpp.

Initially, this makefile is ready to go except for the CXXDIR macro. Once you've set this, here's your new build, link, execute test cycle:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
linking...
Running unit tests...
Running 4 tests....OK!
```

By default, this make file:
* updates dependencies using makedepend
* generates tests from your test files
* builds all of the object modules
* links everything into an application
* executes the application (thereby running your tests)

If you review the [End Game]({{ site.pagesurl}}/Cxx Tdd Iteration 1#EndGame) section, you'll see the makefile I've been using that additionally includes targets for checking working with subversion.

## Finally: Test the Player
We are finally ready to work up to our acceptance test. As a reminder, we started with the following user acceptance test:
> Player on beginning location (numbered 0), rolls 7, ends up on location 7

So let's write this test. It's related to player, so we'll end up creating PlayerTest.hpp (and Player.hpp and Player.cpp later).

Here's our first test:
**PlayerTest.hpp**
```cpp
# include <cxxtest/TestSuite.h>
# include "Dice.hpp"
# include "Player.hpp"

class PlayerTest : public CxxTest::TestSuite {
public:
	void testPlayerTakesTurn() {
		Dice d;
		Player p;
		p.takeATurn(d);
		TS_ASSERT_EQUALS(d.faceValue(), p.location());
	}
};
```

This test simply verifies that after rolling the dice, the player's location is equal to what the player rolls (makes two assumptions: "first" location is numbered 0, player begins there).

This won't compile because we have not yet created the Player class. Here's the minimal amount necessary to get the test to compile:
**Player.hpp**
```cpp
# ifndef Player_hpp
# define Player_hpp

class Dice;

class Player {
public:
	Player();
	~Player();
	void takeATurn(Dice& dice);
	int location();
};

# endif
```

**Player.cpp**
```cpp
# include "Player.hpp"

Player::Player() {
}

Player::~Player() {
}

void Player::takeATurn(Dice& dice) {
}

int Player::location() {
	return 0;
}
```

We have two steps that remain:
# Update the makefile
# run the tests

**Update the Makefile**
We need to add PlayerTest.hpp to the TESTS macro:
```
TESTS = DieTest.hpp DiceTest.hpp PlayerTest.hpp
```

We also need to add Player.cpp to the SRCS macro:
```
SRCS = $(GENERATED_TEST_SRC) Die.cpp Dice.cpp Player.cpp Main.cpp
```

After making creating the header and source files and updating the makefile, we can now see what happens when we try to build:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Player.o Player.cpp
linking...
Running unit tests...
Running 5 tests....
In PlayerTest::testPlayerTakesTurn:
./PlayerTest.hpp:11: Error: Expected (d.faceValue() == p.location()), found (7 !
# 0)
Failed 1 of 5 tests
Success rate: 80%
```

We've finished the Red stage, now we're ready to make these tests pass.

### Update Player.hpp
We need to add a location attribute to the Player:
```cpp
# ifndef Player_hpp
# define Player_hpp

class Dice;

class Player {
public:
	Player();
	~Player();
	void takeATurn(Dice& dice);
	int location();

private:
	int myLocation;
};

# endif
```

### Update Player.cpp
```cpp
# include "Player.hpp"
# include "Dice.hpp"

Player::Player() : myLocation(0) {
}

Player::~Player() {
}

void Player::takeATurn(Dice& dice) {
	myLocation += dice.roll();
}

int Player::location() {
	return myLocation;
}
```

## Run your tests
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Player.o Player.cpp
linking...
Running unit tests...
Running 5 tests.....OK!
```

We have one more acceptance test for the current user story:
> Player on location numbered 39, rolls 6, ends up on location 5

The board has 40 locations, when the player is at the end, they need to end up going around back to the beginning. Here's just such a test we can add to PlayerTest.hpp:
```cpp
	void testPlayerMovesAroundBoard() {
		Dice d;
		Player p;
		p.setLocation(39);
		p.takeATurn(d);
		int expected = d.faceValue() - 1;
		TS_ASSERT_EQUALS(expected, p.location());
	}
```

We need to add a setLocation to Player:
```cpp
	void setLocation(int loc) { myLocation = loc; }
```

Run your tests and see if we get the expected results:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
linking...
Running unit tests...
Running 6 tests.....
In PlayerTest::testPlayerMovesAroundBoard:
./PlayerTest.hpp:20: Error: Expected (expected == p.location()), found (2 != 42)

Failed 1 of 6 tests
Success rate: 83%
```

Turns out we don't. We need to make one final change to Player.takeATurn(Dice&):
```

void Player::takeATurn(Dice& dice) {
	myLocation += dice.roll();
	myLocation%= 40;
}
```

Finally, run the tests again and see the results:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Player.o Player.cpp
linking...
Running unit tests...
Running 6 tests......OK!
```

Success! We have just finished our first user story and we're now ready to move on to making a game with Players.

## A Game has Players
Here is our second user story:
> As a game, I can have between 2 and 8 players with an initial random ordering.

Our first user acceptance test is:
> Create a game with two players named Horse and Car.

This seems simple enough, here's the beginning of a new suite of tests:
```cpp
# include <cxxtest/TestSuite.h>
# include <vector>
# include "Game.hpp"
# include "Player.hpp"

class Dice;

class GameTest : public CxxTest::TestSuite {
public:
	void testCreateGameWithTwoPlayers() {
		Game g;
		g.addPlayer(new Player());
		g.addPlayer(new Player());
		TS_ASSERT_EQUALS(2, g.playerCount());
	}
};
```

As usual, this test won't yet compile. To get this to compile, we'll need to add Game.hpp and Game.cpp:
**Game.hpp**
```cpp
# ifndef Game_hpp
# define Game_hpp

class Player;

class Game {
public:
	Game();
	~Game();
	void addPlayer(Player *player);
	int playerCount() { return 0; }
};

# endif
```

**Game.cpp**
```cpp
# include "Game.hpp"
# include "Player.hpp"

Game::Game() {
}

Game::~Game() {
}

void Game::addPlayer(Player *p) {
}
```

Now let's make sure we are done with the "Red" stage by building, linking and running our tests. Before we do so, we must update our make file. include GameTest.hpp to the TESTS macro and Game.cpp to the SRCS macro. Once you've done this, run the tests:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Game.o Game.cpp
linking...
Running unit tests...
Running 7 tests......
In GameTest::testCreateGameWithTwoPlayers:
./GameTest.hpp:14: Error: Expected (2 == g.playerCount()), found (2 != 0)
Failed 1 of 7 tests
Success rate: 85%
```

No surprise here, we now need to add the code to get the test to pass. So we'll add players to the game and update all of the code to account for that.

**Updated Game.hpp**
```cpp
# ifndef Game_hpp
# define Game_hpp

# include <vector>
class Player;

class Game {
public:
	Game();
	~Game();
	void addPlayer(Player *player);
	int playerCount() { return players.size(); }

private:
	typedef std::vector<Player*> c_p;
	c_p players;
};

# endif
```

**Updated Game.cpp**
```cpp
# include "Game.hpp"
# include "Player.hpp"

Game::Game() {
}

Game::~Game() {
	for(c_p::iterator it = players.begin(); it != players.end(); ++it) {
		delete (*it);
	}
}

void Game::addPlayer(Player *p) {
	players.push_back(p);
}
```

Are we green yet? Run your tests and see:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Game.o Game.cpp
linking...
Running unit tests...
Running 7 tests.......OK!
```

Success! On to the second acceptance test:
> Try to create a game with < 2 or > 8 players. When attempting to play the game, it will fail.

Again, this test seems straightforward. We simply need to create a game with too few people or too many people and verify that it "fails." How about we simply throw an exception if the number of players is invalid when we start the game?
```cpp
# include <cxxtest/TestSuite.h>
# include <vector>
# include "Game.hpp"
# include "Player.hpp"
# include "InvalidPlayerCount"

class GameTest : public CxxTest::TestSuite {
public:
	void testCreateGameWithTwoPlayers() {
		Game g;
		g.addPlayer(new Player());
		g.addPlayer(new Player());
		TS_ASSERT_EQUALS(2, g.playerCount());
	}

	void testCreateGameWithTooFewPlayerFails() {
		Game g;
		g.addPlayer(new Player());
		TS_ASSERT_THROWS( g.play(), InvalidPlayerCount )
	}
};
```

Based on this, we need to add a play() method to the game and then create a new exception class, InvalidPlayerCount. (Note: throughout these examples we will not be declaring throws clauses.)

**Game.hpp**
```cpp
# ifndef Game_hpp
# define Game_hpp

# include <vector>
class Player;

class Game {
public:
	Game();
	~Game();
	void addPlayer(Player *player);
	int playerCount() { return players.size(); }
	void play();

private:
	typedef std::vector<Player*> c_p;
	c_p players;
};

# endif
```

**Game.cpp**
```cpp
# include "Game.hpp"
# include "Player.hpp"

Game::Game() {
}

Game::~Game() {
	for(c_p::iterator it = players.begin(); it != players.end(); ++it) {
		delete (*it);
	}
}

void Game::addPlayer(Player *p) {
	players.push_back(p);
}

void Game::play() {
}
```

**InvalidPlayerCount.hpp**
```cpp
# ifndef InvalidPlayerCount_hpp
# define InvalidPlayerCount_hpp

# include <stdexcept>

class InvalidPlayerCount : public std::runtime_error {
public:
	InvalidPlayerCount(int actual) : 
		std::runtime_error("InvalidPlayerCount"), count(actual) {
	}

	const int count;
};

# endif
```

Verify that you're at the end of the "Red" stage:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Game.o Game.cpp
linking...
Running unit tests...
Running 8 tests.......
In GameTest::testCreateGameWithTooFewPlayerFails:
./GameTest.hpp:19: Error: Expected (g.play()) to throw (InvalidPlayerCount) but
it didn't throw
Failed 1 of 8 tests
Success rate: 87%
```

All we need to do now is to make our test pass. Here's an update to the play() method:
```cpp
void Game::play() {
	throw InvalidPlayerCount(1);
}
```

Are we green?
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Game.o Game.cp
linking...
Running unit tests...
Running 8 tests........OK!
```

**//IMPORTANT//** Does this implementation seem too simple? Our system is "correct" because it conforms to our tests. If we think our system's implementation is too simple, change the definition of your system by writing a test.

Let's make sure when I play with 9 players we get the same result. Then when we move on to our future use acceptance tests, we'll verify that the play() method works as it is supposed to. Add the following test:
```cpp
	void testCreateGameWithTooManyPlayerFails() {
		Game g;
		for(int i = 0; i < 9; ++i ) {
			g.addPlayer(new Player());
		}
		TS_ASSERT_THROWS( g.play(), InvalidPlayerCount )
	}
```

Run your tests:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
linking...
Running unit tests...
Running 9 tests.........OK!
```

OK, this test just worked without any changes. If we do not have to write any mainline code to get the test to pass, we should worry about whether the test added any value. I think in this case I say that it does because it pro grammatically expresses a constraint of the system.

We could add one more test to make sure nothing bad happens when we have a valid number of players. For now we'll hold off because it's not a part of this acceptance test. If I think it should be, I'd negotiate with my product owner. Until I do, I'll just keep working through my acceptance tests.

## Next Test
> Create a game with two players named Horse and Car. Within creating 100 games, both orders [Horse, Car] and [car, horse] occur.

So this acceptance tests speaks to the players starting in a random order. Notice that I'm dealing with a random ordering but that's OK because the user acceptance test is worded such that we can verify it in a bounded time. Here's one method we could add to GameTest.hpp to test this:
```cpp
	void testCreateGameWithTwoPlayersAndBothRandomOrdersAppear() {
		bool hC = false;
		bool cH = false;

		for(int i = 0; i < 100; ++i) {
			Game g;
			Player *horse = new Player();
			Player *car = new Player();
			g.addPlayer(horse);
			g.addPlayer(car);
			g.randomizePlayerOrder();
			TS_ASSERT_EQUALS(2, g.playerCount());
			if(g.getPlayer(0) == horse && g.getPlayer(1) == car) {
				hC = true;
			}
			if(g.getPlayer(1) == horse && g.getPlayer(0) == car) {
				cH = true;
			}
			if(hC && cH) {
				break;
			}
		}
		TS_ASSERT(hC && cH);
	}
```

This test requires the addition of two methods to Game: randomizePlayerOrder() and getPlayer(int). To get our test to compile, we need to add the following to Game.hpp and Game.cpp:
**Game.hpp**
```cpp
	void randomizePlayerOrder();
	Player *getPlayer(int playerNumber);
```

**Game.cpp**
```cpp
void Game::randomizePlayerOrder() {
}

Player *Game::getPlayer(int playerNumber) {
	return 0;
}
```

We are at the end of the "Red" stage:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
linking...
Running unit tests...
Running 10 tests.........
In GameTest::testCreateGameWithTwoPlayersAndBothRandomOrdersAppear:
./GameTest.hpp:52: Error: Assertion failed: hC && cH
Failed 1 of 10 tests
Success rate: 90%
```

Now we'll actually add the implementation to move from Red to Green:
```cpp
// at the top...
# include <algorithm>

void Game::randomizePlayerOrder() {
	random_shuffle(players.begin(), players.end());
}

Player *Game::getPlayer(int playerNumber) {
	return players[playerNumber];
}
```

OK, we're Green:
```cpp
$ make
Updating dependencies in makefile...
Generating Unit Tests...
g++  -c -g -I ~/cpp/cxxtest/cxxtest -o ./bin/Game.o Game.cpp
linking...
Running unit tests...
Running 10 tests..........OK!
```

It seems like the play() method in Game isn't doing very much, right? OK, on to the final User Story for this iteration.

## The Final User Story
Here's our last user story for this iteration:
> As a game, I execute 20 rounds so that I can complete a game.

Here is the first acceptance test:
> Create a game and play, verify that the total rounds was 20 and that each player played 20 rounds.

Now we'll actually make sure that when we play, the Player is actually given a chance to play the game. As a result, we'll verify that when we call the play() method on Game, that we send the takeATurn method to each of our players.

First some background about test isolation by way of a question.

What are we really testing here? I want to make sure that when I ask a Game to play(), every Player takes 20 rounds (i.e. are sent the message takeATurn() 20 times). This test says nothing about the order of those messages. I could send 20 messages to one player and then 20 to another; I could alternate players, etc.

We already have tests for the takeATurn method in player, so we don't need to actually test that again. The only thing under test here is Game. Given that fact, we have a couple of options:
* Connect the game to real players and let the players take turns and somehow count them
* Connect the game to fake (mock) players that only count the number of times takeATurn was called.

For the purpose of this test, I don't actually need instances of Player to take real turns, that is outside the scope of my test.

<< insert test isolation diagram here >>

So we're going to create a so-called Test Double. A test double is a term for a class we create that plays the role of another class. In this case we'll create a test double for Player. This test double will not actually take a real turn. Instead it will only keep track of the number of times it was told to takeATurn(). When the game is done "playing" we'll ask the test double how many times it was told to take a turn. Since we're recording behavior, this kind of test double is traditionally called a Mock. Here is such a mock:
```cpp
class TurnCountingPlayerMock : public Player {
public:
	int roundCount;
	TurnCountingPlayerMock() : roundCount(0) {}
	void takeATurn(Dice&) { ++roundCount; }
};
```

Note: Given that this mock is only for use in the GameTest class, I'd recommend putting it at the top of GameTest.hpp.

In this case we're using traditional "strong" polmorphism. We are replacing the behavior of the Player class's takeATurn() member function. There are seven steps to get strong polymorphism in C++:
# Write a base class (Player)
# Write a derived class (TurnCountingPlayerMock)
# Create an instance of the derived class (we'll do this in a test)
# Write a method in the base class (takeATurn)
# Make the method in the base class virtual
# Override method in derived class (our mock has its own takeATurn)
# Call the method via a pointer to an object or a reference to an object (we'll have to do so in the play() method in game)

Here is a test in GameTest.hpp that will use this mock player:
```cpp
	void testGamePlays20RoundsEachPlayerPlays20Rounds() {
		Game g;
		TurnCountingPlayerMock *p1 = new TurnCountingPlayerMock;
		TurnCountingPlayerMock *p2 = new TurnCountingPlayerMock;
		g.addPlayer(p1);
		g.addPlayer(p2);
		g.play();
		TS_ASSERT_EQUALS(20, p1->roundCount);
		TS_ASSERT_EQUALS(20, p2->roundCount);
	}
```

Run your tests and they of course fail:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
linking...
Running unit tests...
Running 11 tests..........
In GameTest::testGamePlays20RoundsEachPlayerPlays20Rounds:
GameTest.hpp:62: Error: Test failed: InvalidPlayerCount
Failed 1 of 11 tests
Success rate: 90%
```

We have a few problems:
* We never actually call takeATurn() from the play() method
* Even if we did, takeATurn() is not virtual in the Player class
* As soon as we add a virtual method to Player, we better make the dtor virtual as well

Update Player.hpp as follows:
```cpp
	virtual ~Player();
	virtual void takeATurn(Dice& dice);
```

We also need to call the takeATurnMethod() from the play() method in Game:
```cpp
void Game::play() {
	if(playerCount() < 2 || playerCount() > 8) {
		throw InvalidPlayerCount(1);
	}

	Dice d;
	for(int i = 0; i < 20; ++i) {
		for(c_p::iterator it = players.begin(); it != players.end(); ++it) {
			(*it)->takeATurn(d);
		}
	}
}
```

Now run your tests and verify that everything works:
```
$ make all
Updating dependencies in makefile...
Generating Unit Tests...
linking...
Running unit tests...
Running 11 tests...........OK!
```

We're just one acceptance test away from completing this first iteration.

## The Final User Acceptance Test
In the previous test we verified that we called takeATurn the correct number of times. We "know" we called it in the correct order, but let's prove it. Here's the acceptance test:
> Create a game and play, verify that in every round the order of the players remained the same.

Just like with the previous test, we don't actually need to use a "real" player. We want to just make sure that the players alternate their order. Let's begin by creating a new Mock Player:
```cpp
class OrderTrackingPlayerMock : public Player {
public:
	static std::vector<Player*> ORDER;
	void takeATurn(Dice&) { ORDER.push_back(this); }
};

std::vector<Player*> OrderTrackingPlayerMock::ORDER;
```

We have a new sub-class of Player. Each time a player is asked to take a turn, the instance of player taking a turn puts itself in a vector. After the game plays, we can verify that if player instance goes first, it also goes third, fifth, etc. We can also verify that if another player instance goes second, it also goes forth, sixth, etc.

Here's a test to do just that:
```cpp
	void testPlayersPlayInSameOrder() {
		Game g;
		OrderTrackingPlayerMock *p1 = new OrderTrackingPlayerMock;
		OrderTrackingPlayerMock *p2 = new OrderTrackingPlayerMock;
		g.addPlayer(p1);
		g.addPlayer(p2);
		g.play();
		TS_ASSERT_EQUALS(40, OrderTrackingPlayerMock::ORDER.size());
		for(int i = 0; i < OrderTrackingPlayerMock::ORDER.size() - 1; i += 2) {
			TS_ASSERT_EQUALS(p1, OrderTrackingPlayerMock::ORDER[i]);
			TS_ASSERT_EQUALS(p2, OrderTrackingPlayerMock::ORDER[i+1]);
		}
	}
```

Run the test and verify that in fact we maintain the order of the players throughout:
```
$ make
Updating dependencies in makefile...
Generating Unit Tests...
linking...
Running unit tests...
Running 12 tests............OK!
```

Success! Congratulations, you have finished the first iteration of the game. In the next iteration we look at using polymorphism in our mainline code.

# Summary
In the beginning there was the void and from the void sprang forth a unit test. That test was good, but it was alone for it would not compile. To give this test company, the void called forth a class. That class we good but imperfect for while it allowed the test to run, the test could not pass and it was left wanting. To remedy this, the void extended the class to make it complete, whereupon the test could pass and all was good. 

To paraphrase Douglas Adams, if the system ever has all of its tests running, it will be replaced by a larger system with even more tests, each of which will not run. Rumor has it that this has happened many, many times.

# Assignments
* Add names to your locations.
* Create a main and link it instead of the main that runs the tests. "Play" a game.
* Add output to your system:
** Try to do it without changing any of the existing classes or header files in your system.
[[#EndGame]]
# End Game
This section contains all of the complete Iteration 1 source files with no explanations.
----
## makefile
```
# ----------------------------------------------------------------------------
# Add all files contain cxxtest unit tests to the following macro
TESTS = DieTest.hpp DiceTest.hpp PlayerTest.hpp GameTest.hpp
GENERATED_TEST_SRC = tests.cpp
GENERATED_TEST_OBJ = tests.o

# ----------------------------------------------------------------------------
# Add all C++ source files to the following macro
SRCS = $(GENERATED_TEST_SRC) Die.cpp Dice.cpp Player.cpp Game.cpp Main.cpp
BIN_DIR = ./bin
LINK_OBJS = $(SRCS:%.cpp=$(BIN_DIR)/%.o)
OBJS = $(SRCS:%.cpp=%.o)

# ----------------------------------------------------------------------------
# Update this to point to the location where you extracted the cxxtest files
CXXDIR = ~/cpp/cxxtest/cxxtest
CXXGENTEST = $(CXXDIR)/cxxtestgen.pl


# ----------------------------------------------------------------------------
SHELL = /bin/sh
.SUFFIXES:
.SUFFIXES: .cpp .o

CPP=g++ 
CFLAGS=-g -I $(CXXDIR)
PROGRAM = main.exe

# ----------------------------------------------------------------------------
MD_FILE = $(BIN_DIR)/dependencies
MD_ARGS = -f$(MD_FILE) -I /usr/lib/gcc/i686-pc-cygwin/3.4.4/include/c++/ \
	  -I /usr/lib/gcc/i686-pc-cygwin/3.4.4/include/c++/i686-pc-cygwin \
	  -I $(CXXDIR)

VPATH = %.o $(BIN_DIR)

all: gentests depend $(PROGRAM) runtests

gentests:
	@mkdir -p $(BIN_DIR)
	@$(CXXGENTEST) -o $(BIN_DIR)/$(GENERATED_TEST_SRC) $(TESTS)
	@$(CPP) -c $(CFLAGS) -I. -o $(BIN_DIR)/$(GENERATED_TEST_OBJ) \
				$(BIN_DIR)/$(GENERATED_TEST_SRC)

$(PROGRAM): $(OBJS)
	@echo "linking..."
	@$(CPP) $(CFLAGS) $(LINK_OBJS) -o $(BIN_DIR)/$@ 

runtests:
	@echo "Running unit tests..."
	@$(BIN_DIR)/$(PROGRAM)

clean:
	@echo "Removing bin directory..."
	@rm -rf $(BIN_DIR)

depend:
	@echo "Updating dependencies in makefile..."
	@touch $(MD_FILE)
	@makedepend -p$(BIN_DIR)/ *.?pp $(MD_ARGS)

update:
	@svn update

add:
	@svn add *.cpp *.hpp

commit:
	@svn commit --editor-cmd vi

tests.o: gentests
	@echo "Generating Unit Tests..."

%.o : %.cpp
	$(CPP) -c $(CFLAGS) -o $(BIN_DIR)/$@ $<

-include $(MD_FILE)
```

----
## DieTest.hpp
```cpp
# include <cxxtest/TestSuite.h>
# include <vector>
# include <algorithm>
# include "Die.hpp"

class DieTest : public CxxTest::TestSuite {
public:
	void testRoll() {
		Die d;
		std::vector<int> values(7);

		for(int i = 0; i < 10000; ++i) {
			++values[d.roll()];
		}

		TS_ASSERT_EQUALS(0, values[0]);
		for(int i = 1; i < values.size(); ++i) {
			TS_ASSERT(values[i] > 100)
		}
	}

	void testRandomInitialValue() {
		std::vector<int> values(7);

		for(int i = 0; i < 1000; ++i) {
			Die d;
			++values[d.faceValue()];
		}

		for(int i = 1; i < values.size(); ++i) {
			TS_ASSERT(values[i] > 10);
		}
	}
};
```

----
## Die.hpp
```cpp
# ifndef Die_hpp
# define Die_hpp

class Die {
public:
	Die();
	virtual ~Die();
	virtual int roll();
	virtual int faceValue();

private:
	int value;
};

# endif
```

----
## Die.cpp
```cpp
# include <climits>
# include <stdlib.h>
# include "Die.hpp"

int generateRandomValue() {
	return (INT_MAX - rand()) % 6 + 1;
}

Die::Die() : value(generateRandomValue()) {
}

Die::~Die() {
}

int Die::roll() {
	return value = generateRandomValue();
}

int Die::faceValue() {
	return value;
}
```

----
## DiceTest.hpp
```cpp
# include <cxxtest/TestSuite.h>
# include <vector>
# include "Dice.hpp"

class DiceTest : public CxxTest::TestSuite {
public:
	void assertValue(Dice& d) {
		TS_ASSERT(d.faceValue() >= 2 && d.faceValue() <= 12)
	}

	void testRoll() {
		Dice d;
		d.roll();
		assertValue(d);
	}

	void testInitialValue() {
		Dice d;
		assertValue(d);
	}
};
```

----
## Dice.hpp
```cpp
# ifndef Dice_hpp
# define Dice_hpp

# include <vector>
class Die;

class Dice {
public:
	Dice();
	virtual ~Dice();
	virtual int faceValue();
	virtual int roll();
	
private:
	typedef std::vector<Die*> c_d;
	c_d dice;
};

# endif
```

----
## Dice.cpp
```cpp
# include "Dice.hpp"
# include "Die.hpp"

Dice::Dice() {
	for(int i = 0; i < 2; ++i) {
		dice.push_back(new Die());
	}
}

Dice::~Dice() {
	for(c_d::iterator it = dice.begin(); it != dice.end(); ++it) {
		delete *it;
	}
}

int Dice::faceValue() {
	int sum = 0;
	for(c_d::iterator it = dice.begin(); it != dice.end(); ++it) {
		sum += (*it)->faceValue();
	}

	return sum;
}

int Dice::roll() {
	for(c_d::iterator it=dice.begin(); it != dice.end(); ++it) {
		(*it)->roll();
	}

	return faceValue();
}
```

----
## PlayerTest.hpp
```cpp
# include <cxxtest/TestSuite.h>
# include "Dice.hpp"
# include "Player.hpp"

class PlayerTest : public CxxTest::TestSuite {
public:
	void testPlayerTakesTurn() {
		Dice d;
		Player p;
		p.takeATurn(d);
		TS_ASSERT_EQUALS(d.faceValue(), p.location());
	}

	void testPlayerMovesAroundBoard() {
		Dice d;
		Player p;
		p.setLocation(39);
		p.takeATurn(d);
		int expected = (39 + d.faceValue()) % 40;
		TS_ASSERT_EQUALS(expected, p.location());
	}
};
```

----
## Player.hpp
```cpp
# ifndef Player_hpp
# define Player_hpp
# include <string>

class Dice;

class Player {
public:
	Player();
	Player(std::string name);
	virtual ~Player();
	virtual void takeATurn(Dice& dice);
	int location();
	void setLocation(int location);
	std::string name() { return myName; }

private:
	std::string myName;
	int myLocation;
};

# endif
```

----
## Player.cpp
```cpp
# include "Player.hpp"
# include "Dice.hpp"


Player::Player() : myName(""), myLocation(0) {
}

Player::Player(std::string name) : myName(name), myLocation(0) {
}

Player::~Player() {
}

void Player::takeATurn(Dice& dice) {
	myLocation += dice.roll();
	myLocation %= 40;
}

int Player::location() {
	return myLocation;
}

void Player::setLocation(int location) {
	myLocation = location;
}
```

----
## GameTest.hpp
```cpp
# include <cxxtest/TestSuite.h>
# include <vector>
# include "Game.hpp"
# include "Player.hpp"
# include "InvalidPlayerCount.hpp"

class Dice;

class TurnCountingPlayerMock : public Player {
public:
	int roundCount;
	TurnCountingPlayerMock() : roundCount(0) {}
	void takeATurn(Dice&) { ++roundCount; }
};

class OrderTrackingPlayerMock : public Player {
public:
	static std::vector<Player*> ORDER;
	void takeATurn(Dice&) { ORDER.push_back(this); }
};

std::vector<Player*> OrderTrackingPlayerMock::ORDER;

class GameTest : public CxxTest::TestSuite {
public:
	void testCreateGameWithTwoPlayers() {
		Game g;
		g.addPlayer(new Player());
		g.addPlayer(new Player());
		TS_ASSERT_EQUALS(2, g.playerCount());
	}

	void testCreateGameWithTooFewPlayerFails() {
		Game g;
		g.addPlayer(new Player());
		TS_ASSERT_THROWS( g.play(), InvalidPlayerCount )
	}

	void testCreateGameWithTwoPlayersAndBothRandomOrdersAppear() {
		bool hC = false;
		bool cH = false;

		for(int i = 0; i < 100; ++i) {
			Game g;
			Player *p1 = new Player("Horse");
			Player *p2 = new Player("Car");
			g.addPlayer(p1);
			g.addPlayer(p2);
			g.randomizePlayerOrder();
			TS_ASSERT_EQUALS(2, g.playerCount());
			if(g.getPlayer(0) == p1 && g.getPlayer(1) == p2) {
				hC = true;
			}
			if(g.getPlayer(1) == p1 && g.getPlayer(0) == p2) {
				cH = true;
			}
			if(hC && cH) {
				break;
			}
		}
		TS_ASSERT(hC && cH);
	}

	void testGamePlays20RoundsEachPlayerPlays20Rounds() {
		Game g;
		TurnCountingPlayerMock *p1 = new TurnCountingPlayerMock;
		TurnCountingPlayerMock *p2 = new TurnCountingPlayerMock;
		g.addPlayer(p1);
		g.addPlayer(p2);
		g.play();
		TS_ASSERT_EQUALS(20, p1->roundCount);
		TS_ASSERT_EQUALS(20, p2->roundCount);
	}

	void testPlayersPlayInSameOrder() {
		Game g;
		OrderTrackingPlayerMock *p1 = new OrderTrackingPlayerMock;
		OrderTrackingPlayerMock *p2 = new OrderTrackingPlayerMock;
		g.addPlayer(p1);
		g.addPlayer(p2);
		g.play();
		TS_ASSERT_EQUALS(40, OrderTrackingPlayerMock::ORDER.size());
		for(int i = 0; i < OrderTrackingPlayerMock::ORDER.size() - 1; i += 2) {
			TS_ASSERT_EQUALS(p1, OrderTrackingPlayerMock::ORDER[i]);
			TS_ASSERT_EQUALS(p2, OrderTrackingPlayerMock::ORDER[i+1]);
		}
	}
};
```

----
## InvalidPlayerCount.hpp
```cpp
# ifndef InvalidPlayerCount_hpp
# define InvalidPlayerCount_hpp

# include <stdexcept>

class InvalidPlayerCount : public std::runtime_error {
public:
	InvalidPlayerCount(int actual) : 
		std::runtime_error("InvalidPlayerCount"), count(actual) {
	}

	const int count;
};

# endif
```

----
## Game.hpp
```cpp
# ifndef Game_hpp
# define Game_hpp

# include <vector>
class Player;
class Dice;

class Game {
public:
	Game();
	~Game();
	void addPlayer(Player *player);
	int playerCount() { return players.size(); }
	void play();
	void randomizePlayerOrder();
	Player *getPlayer(int playerNumber);

private:
	typedef std::vector<Player*> c_p;
	c_p players;
	Dice *dice;
};

# endif
```

----
## Game.cpp
```cpp
# include <algorithm>
# include "Game.hpp"
# include "Player.hpp"
# include "InvalidPlayerCount.hpp"
# include "Dice.hpp"

Game::Game() : dice(new Dice()) {
}

Game::~Game() {
	for(c_p::iterator it = players.begin(); it != players.end(); ++it) {
		delete (*it);
	}
	delete dice;
}

void Game::addPlayer(Player *p) {
	players.push_back(p);
}

void Game::play() {
	if(players.size() < 2 || players.size() > 8) {
		throw InvalidPlayerCount(players.size());
	}
	for(int i = 0; i < 20; ++i) {
		for(c_p::iterator it = players.begin(); it != players.end(); ++it) {
			(*it)->takeATurn(*dice);
		}
	}
}

void Game::randomizePlayerOrder() {
	random_shuffle(players.begin(), players.end());
}

Player *Game::getPlayer(int playerNumber) {
	return players[playerNumber];
}
```

----
## Main.cpp
```cpp
# include <cxxtest/ErrorPrinter.h>

int main( int argc, char* argv[]) {
	CxxTest::ErrorPrinter errorPrinter;
	errorPrinter.run();
	return 0;
}
 
```
