[[toc]]
=Overview=
Here's a traditional Hello World program in C++:
[[code format="cpp"]]
#include <iostream>

int main(int argc, char **argv) {
	std::cout << "Hello World" << std::endl;
	return 0;
}
[[code]]

A beginning C++ class typically teaches this, but what if we wanted to accomplish the same thing using TDD? In this case, there's really no design per-se, so I'll Interpret TDD as Test-Driven// **Development**// rather than Test Driven// **Design**//.

=Observations=
A well-written main should do something and then return an error code. So I need two tests, one verifying that main returns 0 and another that as a result of calling the main function, the text "Hello World" is sent to cout.

Both of these tests are easy, but we have a serious problem. C++ programs require a main to get started. A test harness such as CppUTest requires a main. So how can we actually verify that main does what it is supposed to do when in fact our test harness, living by the same rules as all other C++ programs, needs its own main?

See the problem?

I'm already going to accept partial defeat. I'm not going to test that main does all of this. Instead, I'm going to say that there is some function that main could call that does all of the work. I'll verify its behavior, then I'll spot check that main does in fact call that function. Hum, maybe this is a little bit of design.

=First Test=
Choosing to test the easy thing first, I'll verify that the method I'll eventually have main call in fact returns 0 (meaning no error in the shell):
**HelloWorldTest.cpp**
[[code format="cpp"]]
#include <cpputest/TestHarness.h>

extern int mainImpl(int argc, char **argv);

TEST_GROUP(HelloWorld) {
};

TEST(HelloWorld, ExtractedFunctionReturns0UponSuccess) {
	int result = mainImpl(0, 0);
	LONGS_EQUAL(0, result);
}
[[code]]

Getting this test to pass requires that I write a main for the test harness as well as the method mainImpl:
**HelloWorld.cpp**
[[code format="cpp"]]
#include <iostream>
#include <CppUTest/CommandLineTestRunner.h>

int mainImpl(int argc, char **argv) {
	return 0;
}
 
int main(int argc, char **argv) {
    return CommandLineTestRunner::RunAllTests(argc, argv);
}
[[code]]

To get this to compile and link on my machine, I typed the following (didn't feel this warranted a makefile):
[[code format="text"]]
[~/src/cpp_class]% g++ HelloWorld*.cpp 
    -I/Users/schuchert/src/cpputest/include 
    /Users/schuchert/src/cpputest/lib/libCppUTest.a
[[code]]

When I run this test, I see that it is successful:
[[code format="text"]]
[~/src/cpp_class]% ./a.out
.
OK (1 tests, 1 ran, 1 checks, 0 ignored, 0 filtered out, 0 ms)
[[code]]

==Second Test==
Now we have to get tricky. I know that the traditional Hello World program writes to a global variable, std::cout. However, that does not cause any problems since I can inject my own stream into the middle before calling the method. That is, dependency injection is an option with cout. Note that I do this in a setup and teardown method to make sure that cout is reset regardless of what happens in my test:
**HelloWorldTest.cpp**
[[code format="cpp"]]
#include <iostream>
#include <sstream>

#include <cpputest/TestHarness.h>

extern int mainImpl(int argc, char **argv);

TEST_GROUP(HelloWorld) {
	std::streambuf *original;
	std::stringstream *stream;

	virtual void setup() {
		original = std::cout.rdbuf();
		stream = new std::stringstream;
		std::cout.rdbuf(stream->rdbuf());
	}

	virtual void teardown() {
		std::cout.rdbuf(original);
		delete stream;
	}
};

TEST(HelloWorld, ExtractedFunctionReturns0UponSuccess) {
	int result = mainImpl(0, 0);
	LONGS_EQUAL(0, result);
}

TEST(HelloWorld, CorrectOuputPutToCout) {
	mainImpl(0, 0);
	STRCMP_EQUAL("Hello World!\n", stream->str().c_str());
}
[[code]]

Note, CppUTest does memory leak detection. It will report a memory leak when using a regular std::stringstream (and most of the standard types) in a test. One way to fix this, typically, is to use pointers and then new in the setup and delete in the teardown.

To get this test passing:
**HelloWorld.cpp**
[[code format="cpp"]]
#include <iostream>
#include <CppUTest/CommandLineTestRunner.h>

int mainImpl(int argc, char **argv) {
	std::cout << "Hello World!" << std::endl;
	return 0;
}

 
int main(int argc, char **argv) {
    return CommandLineTestRunner::RunAllTests(argc, argv);
}
[[code]]

This "works" , at least on my computer:
[[code format="text"]]
[~/src/cpp_class]% ./a.out..
OK (2 tests, 2 ran, 2 checks, 0 ignored, 0 filtered out, 1 ms)
[[code]]

Even so, I'm bothered by checking for "\n" in one place and using std::endl in another. For now, I'll leave that as an exercise to the reader to decide if that's really a problem or not.
==Finally?==
Well now that we've got a working method, we can change main:
**HelloWorld.cpp**
[[code format="cpp"]]
#include <iostream>

int mainImpl(int argc, char **argv) {
	std::cout << "Hello World!" << std::endl;
	return 0;
}

int main(int argc, char **argv) {
	return mainImpl(argc, argv);
}
[[code]]

But this loses our ability to use the test harness. Hum, I don't like that. Seems like I need to do a few things:
* Move the mainImpl method into its own file (making it a separate compilation unit).
* Create a header file for it since I'd have to use extern statements in two files
* Build the system for test versus build the system for real

Note that is simply changing the structure to support what Michael Feathers calls a link seam. I'll build the test version with one main and the non-test system with a different main. Here are those moving parts:
**mainImpl.h**
[[code format="cpp"]]
#pragma once
#ifndef mainImpl_header
#define mainImpl_header

int mainImpl(int argc, char **argv);

#endif
[[code]]

**mainImpl.cpp**
[[code format="cpp"]]
#include <iostream>
#include "mainImpl.h"

int mainImpl(int argc, char **argv) {
	std::cout << "Hello World!" << std::endl;
	return 0;
}
[[code]]

**HelloWorld.cpp**
[[code format="cpp"]]
#include "mainImpl.h"

int main(int argc, char **argv) {
	return mainImpl(argc, argv);
}
[[code]]

**TestMain.cpp**
[[code format="cpp"]]
#include <cpputest/CommandLineTestRunner.h>

int main(int argc, char **argv) {
	CommandLineTestRunner::RunAllTests(argc, argv);
}
[[code]]

I updated HelloWorldTest.cpp to include mainImpl.h:
**HelloWorldTest.cpp**
[[code format="cpp"]]
#include <iostream>
#include <sstream>
#include "mainImpl.h"

#include <cpputest/TestHarness.h>

TEST_GROUP(HelloWorld) {
	std::streambuf *original;
	std::stringstream *stream;

	virtual void setup() {
		original = std::cout.rdbuf();
		stream = new std::stringstream;
		std::cout.rdbuf(stream->rdbuf());
	}

	virtual void teardown() {
		std::cout.rdbuf(original);
		delete stream;
	}
};

TEST(HelloWorld, ExtractedFunctionReturns0UponSuccess) {
	int result = mainImpl(0, 0);
	LONGS_EQUAL(0, result);
}

TEST(HelloWorld, CorrectOuputPutToCout) {
	mainImpl(0, 0);
	STRCMP_EQUAL("Hello World!\n", stream->str().c_str());
}
[[code]]

And since I got tired of using my command history to compile and also because I now have a link seam to select the main, here's my makefile:
**makefile**
[[code format="text"]]
PRODUCTION_CODE = mainImpl.cpp
PRODUCTION_MAIN = HelloWorld.cpp
PRODUCTION_NAME = HelloWorld

TEST_CODE = HelloWorldTest.cpp
TEST_MAIN = Testmain.cpp
TEST_NAME = RunAllTests

CPPUTEST_INCLUDE = -I/Users/schuchert/src/cpputest/include 
CPPUTEST_LIB = /Users/schuchert/src/cpputest/lib/libCppUTest.a

test:
	g++ $(TEST_CODE) $(TEST_MAIN) $(PRODUCTION_CODE) \
		$(CPPUTEST_INCLUDE) $(CPPUTEST_LIB) \
		-o $(TEST_NAME)

production:
	g++ $(PRODUCTION_CODE) $(PRODUCTION_MAIN) -o $(PRODUCTION_NAME)

all: test production

clean:
	rm -rf *.o $(PRODUCTION_NAME) $(TEST_NAME)
[[code]]

So now I can build and run:
[[code format="text"]]
[~/src/cpp_class]% make clean
rm -rf *.o HelloWorld RunAllTests
[~/src/cpp_class]% make all
g++ HelloWorldTest.cpp Testmain.cpp mainImpl.cpp \
		-I/Users/schuchert/src/cpputest/include  \
		/Users/schuchert/src/cpputest/lib/libCppUTest.a \
		-o RunAllTests
g++ mainImpl.cpp HelloWorld.cpp -o HelloWorld
[~/src/cpp_class]% ./RunAllTests 
..
OK (2 tests, 2 ran, 2 checks, 0 ignored, 0 filtered out, 2 ms)

[~/src/cpp_class]% make production
g++ mainImpl.cpp HelloWorld.cpp -o HelloWorld
[~/src/cpp_class]% ./HelloWorld 
Hello World!
[~/src/cpp_class]% 
[[code]]
==Conclusion==
When I originally came up with this idea, I figured it'd be a quick walk in the park. What I didn't take into consideration is that you cannot have two main functions in a single link. So I had to find a way around that. What I originally considered, simply updating main, was wholly unsatisfactory. That lead to using a link seam and creating a makefile. This might seem like a bit of work, and sure enough it was a bit of work. On the other hand, not losing the ability to test trumps a touch of what seems like inconvenience.

Furthermore, the idea that my production code should be in main is a violation of mixing enabling technology with business technology. Putting the call to cout in main() is the same thing as embedding business logic into a gui form or letting database calls work their way up from the integration layer into the presentation layer.

In C++, the entry point for all applications is main(...). Thus, the main() function is part of C++'s enabling technology. The thing to do in that technology is to translate and delegate. Translate command line parameters, then call a method or function to do the rest. So it's OK for a main function to:
* call a function like mainImpl
* create an instance of an object and tell it to "go"

But it is not OK for the business logic to be embedded in main, since that coupling leads to problems.

When I came up with this idea, and even while I was writing it, I did not expect to come to this conclusion. it just naturally occurred as a result of not being satisfied with having to choose between running my unit tests or having a "correct" main.

The initial design of putting the work in a function other than the main seemed, initially, a bit much. But, in retrospect, it not only was the right thing to do, I should chide myself for not doing that by default. What I've written makes sense to me. The use of link seams also makes sense. The overall design is much more sound than the hard-coded call to cout in main.