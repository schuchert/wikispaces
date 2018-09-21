---
title: cpptraining.ExamlesOfEachFixtureType
---
{% include toc %}
[<<--Back](CppTraining#FitNesse)

# Decision Table
Here is a basic table in FitNesse:
### Example Decision Table
{% highlight terminal %}
!|ExecuteBinaryOperator    |
|lhs|rhs|operator|expected?|
|3  |4  |-       |-1       |
|5  |6  |*       |30       |
{% endhighlight %}

Since no table type is provided, this is a decision table. The basic mechanics for this table are:
* Find a class called ExecuteBinaryOperator
* For each row after the header row:
  * Call setLhs, providing a string
  * Call setRhs, providing a string
  * Call setOperator, providing a string
  * Call expected, which returns a string and compare the value returned to the value provided

Here's cslim code that can handle this table:
### ExecuteBinaryOperator.cpp
{% highlight cpp %}
# include <stdlib.h>
# include <stdio.h>
# include <string>
# include "RpnCalculator.h"
# include "OperatorFactory.h"
# include "Fixtures.h"
# include "SlimUtils.h"
 
struct ExecuteBinaryOperator {
    ExecuteBinaryOperator() {
        lastValue[0] = 0;
    }

    int execute() {
        RpnCalculator calculator(factory);
        calculator.enterNumber(lhs);
        calculator.enterNumber(rhs);
        calculator.executeOperator(op);
        return calculator.getX();
    }

    static ExecuteBinaryOperator* From(void *fixtureStorage) {
        return reinterpret_cast<ExecuteBinaryOperator*>(fixtureStorage);
    }

    OperatorFactory factory;
    int lhs;
    int rhs;
    std::string op;
    char lastValue[32];
};

extern "C" {
void* ExecuteBinaryOperator_Create(StatementExecutor* errorHandler, SlimList* args) {
    return new ExecuteBinaryOperator;
}
 
void ExecuteBinaryOperator_Destroy(void* self) {
    delete ExecuteBinaryOperator::From(self);
}
 
static char* setLhs(void* fixture, SlimList* args) {
    ExecuteBinaryOperator *self = ExecuteBinaryOperator::From(fixture);
    self->lhs = getFirstInt(args);
    return self->lastValue;
}
 
static char* setRhs(void* fixture, SlimList* args) {
    ExecuteBinaryOperator *self = ExecuteBinaryOperator::From(fixture);
    self->rhs = getFirstInt(args);
    return self->lastValue;
}
 
static char* setOperator(void *fixture, SlimList* args) {
    ExecuteBinaryOperator *self = ExecuteBinaryOperator::From(fixture);
    self->op = getFirstString(args);
    return self->lastValue;
}
static char* expected(void* fixture, SlimList* args) {
    ExecuteBinaryOperator *self = ExecuteBinaryOperator::From(fixture);
    int result = self->execute();
    snprintf(self->lastValue, sizeof(self->lastValue), "%d", result);
    return self->lastValue;
}
 
SLIM_CREATE_FIXTURE(ExecuteBinaryOperator)
    SLIM_FUNCTION(setLhs)
    SLIM_FUNCTION(setRhs)
    SLIM_FUNCTION(setOperator)
    SLIM_FUNCTION(expected)
SLIM_END
 
}
{% endhighlight %}

Note that as with all fixtures, this code will need to be "registered" with cslim. The default installation of cslim provides a file called "Fixtures.c". To register this class, you'd add:
### Fixtures.c
{% highlight cpp %}
# include "Fixtures.h"

SLIM_FIXTURES
  SLIM_FIXTURE(ExecuteBinaryOperator)
  SLIM_FIXTURE(ProgramTheCalculator)
  SLIM_FIXTURE(SingleCharacterNameOperators)
SLIM_END
{% endhighlight %}

This particular Fixtures.c file registeres all thee fixtures mentioned on this page.

# Script Table
Here is an example of a script table:
### Example Script Table
{% highlight terminal %}
!|script           |ProgramTheCalculator                   |
|startProgramCalled|primeFactorsOfSum                      |
|addOperation      |sum                                    |
|addOperation      |primeFactors                           |
|saveProgram                                               |
|enter             |4                                      |
|enter             |13                                     |
|enter             |7                                      |
|execute           |primeFactorsOfSum                      |
|check             |stackHas|3|then|2|then|2|then|2|is|true|
{% endhighlight %}
How can you tell it's a script table? The word script on the first row.

And here's an example fixture that can handle this table. Note, I used g++ 4.4 (or 4.5) and provided the command-line parameter "-std=c++0x". This allows me to use the auto keyword in its new form:
### ProgrammingTheCalculator.cpp
{% highlight cpp %}
# include <stdlib.h>
# include <stdio.h>
# include <string>
# include "RpnCalculator.h"
# include "OperatorFactory.h"
# include "SlimUtils.h"
# include "SlimList.h"
# include "Fixtures.h"

struct ProgramTheCalculator {
    ProgramTheCalculator() : calculator(factory) {
    }

    static ProgramTheCalculator* From(void *fixtureStorage) {
        return reinterpret_cast<ProgramTheCalculator*>(fixtureStorage);
    }

    OperatorFactory factory;
    RpnCalculator calculator;
};

extern "C" {

void* ProgramTheCalculator_Create(StatementExecutor* errorHandler, SlimList* args) {
    return new ProgramTheCalculator;
}

void ProgramTheCalculator_Destroy(void *fixture) {
    delete ProgramTheCalculator::From(fixture);
}

static char* startProgramCalled(void *fixture, SlimList *args) {
    auto *self = ProgramTheCalculator::From(fixture);
    self->calculator.createProgramNamed(getFirstString(args));
    return remove_const("");
}

static char* addOperation(void *fixture, SlimList *args) {
    auto *self = ProgramTheCalculator::From(fixture);
    self->calculator.addOperator(getFirstString(args));
    return remove_const("");
}

static char* saveProgram(void *fixture, SlimList *args) {
    auto *self = ProgramTheCalculator::From(fixture);
    self->calculator.saveProgram();
    return remove_const("");
}

static char* enter(void *fixture, SlimList *args) {
    auto *self = ProgramTheCalculator::From(fixture);
    self->calculator.enterNumber(getFirstInt(args));
    return remove_const("");
}

static char* execute(void *fixture, SlimList *args) {
    auto *self = ProgramTheCalculator::From(fixture);
    self->calculator.executeOperator(getFirstString(args));
    return remove_const("");
}

static char* stackHasThenThenThenIs(void *fixture, SlimList *args) {
    auto *self = ProgramTheCalculator::From(fixture);
    for(int i = 0; i < 4; ++i) {
            if(self->calculator.getX() != getIntAt(args, i))
                return remove_const("false");
            self->calculator.executeOperator("drop");
    }

      return remove_const("true");
}

SLIM_CREATE_FIXTURE(ProgramTheCalculator)
    SLIM_FUNCTION(startProgramCalled)
    SLIM_FUNCTION(addOperation)
    SLIM_FUNCTION(saveProgram)
    SLIM_FUNCTION(enter)
    SLIM_FUNCTION(execute)
    SLIM_FUNCTION(stackHasThenThenThenIs)
SLIM_END


}
{% endhighlight %}

# Query Table
Finally, the dreaded query table. The query table requires a bit more work to produce a result. So this section contains a table, a fixture and a utility class to help create the query results.
### Example Query Table
{% highlight terminal %}
!|Query: SingleCharacterNameOperators|
|op                                  |
|+                                   |
|*                                   |
|/                                   |
|!                                   |
|-                                   |
{% endhighlight %}
How can you tell this is a query table? The word "Query" in the first row.

Now the fixture to handle it:
### SingleCharacterNameOperators.cpp
{% highlight cpp %}
# include <stdlib.h>
# include <stdio.h>
# include <vector>
# include <string>
# include <memory>
# include "RpnCalculator.h"
# include "OperatorFactory.h"
# include "Fixtures.h"
# include "SlimUtils.h"
# include "QueryResultAccumulator.h"

struct SingleCharacterNameOperators {
    OperatorFactory factory;
    RpnCalculator calculator;
    QueryResultAccumulator accumulator;

    SingleCharacterNameOperators() :
        calculator(factory) {
    }

    ~SingleCharacterNameOperators() {
    }

    static SingleCharacterNameOperators* From(void *fixtureStorage) {
        return reinterpret_cast<SingleCharacterNameOperators*> (fixtureStorage);
    }

    void conditionallyAddOperatorNamed(const std::string &name) {
        if (name.size() == 1) {
            accumulator.addFieldNamedWithValue("op", name);
            accumulator.finishCurrentObject();
        }
    }

    char *buildResult() {
        v_string names = calculator.allOperatorNames();
        return buildResult(names);
    }

    char *buildResult(v_string &names) {
        for (v_string::iterator iter = names.begin(); iter != names.end(); ++iter)
            conditionallyAddOperatorNamed(*iter);

        return accumulator.produceFinalResults();
    }
};

extern "C" {
void* SingleCharacterNameOperators_Create(StatementExecutor* errorHandler,
        SlimList* args) {
    return new SingleCharacterNameOperators;
}

void SingleCharacterNameOperators_Destroy(void *fixture) {
    delete SingleCharacterNameOperators::From(fixture);
}

static char* query(void *fixture, SlimList *args) {
    auto *self = SingleCharacterNameOperators::From(fixture);
    return self->buildResult();
}

SLIM_CREATE_FIXTURE(SingleCharacterNameOperators)
    SLIM_FUNCTION(query)
SLIM_END

}
{% endhighlight %}

This code makes use of a utility class QueryResultAccumulator. This is [available in source from github](http://github.com/schuchert/CSlimCppExtensions) (warning, as of this writing it's in a raw form):
### QueryResultAccumulator.h
{% highlight cpp %}
# pragma once
# ifndef QUERYRESULTACCUMULATOR_H_
# define QUERYRESULTACCUMULATOR_H_

class SlimList;
# include <vector>
# include <string>
class QueryResultAccumulator {
public:
    typedef std::vector<SlimList*> v_SlimList;
    typedef v_SlimList::iterator iterator;

    QueryResultAccumulator();
    virtual ~QueryResultAccumulator();

    void finishCurrentObject();
    void addFieldNamedWithValue(const std::string &name, const std::string &value);
    char *produceFinalResults();

private:
    SlimList* allocate();
    void releaseAll();
    void setInitialConditions();

private:
    v_SlimList created;
    SlimList *list;
    SlimList *currentObject;
    int lastFieldCount;
    int currentFieldCount;
    char *result;

private:
    QueryResultAccumulator(const QueryResultAccumulator&);
    QueryResultAccumulator& operator=(const QueryResultAccumulator&);
};

# endif
{% endhighlight %}

### QueryResultAccumulator.cpp
{% highlight cpp %}
# include "QueryResultAccumulator.h"
# include "DifferentFieldCountsInObjects.h"
# include "InvalidStateException.h"

extern "C" {
# include "SlimList.h"
# include "SlimListSerializer.h"
}

QueryResultAccumulator::QueryResultAccumulator() : result(0) {
    setInitialConditions();
}

QueryResultAccumulator::~QueryResultAccumulator() {
    releaseAll();
    SlimList_Release(result);
}

void QueryResultAccumulator::setInitialConditions() {
    releaseAll();
    list = allocate();
    currentObject = allocate();
    lastFieldCount = -1;
    currentFieldCount = -1;
}

SlimList* QueryResultAccumulator::allocate() {
    SlimList *list = SlimList_Create();
    created.push_back(list);
    return list;
}

void QueryResultAccumulator::releaseAll() {
    for (iterator i = created.begin(); i != created.end(); ++i)
        SlimList_Destroy(*i);
    created.clear();
}

void QueryResultAccumulator::finishCurrentObject() {
    if(lastFieldCount >= 0 && lastFieldCount != currentFieldCount)
        throw DifferentFieldCountsInObjects(lastFieldCount, currentFieldCount);

    SlimList_AddList(list, currentObject);
    currentObject = allocate();

    lastFieldCount = currentFieldCount;
    currentFieldCount = -1;
}

void QueryResultAccumulator::addFieldNamedWithValue(const std::string &name, const std::string &value) {
    SlimList *fieldList = allocate();
    SlimList_AddString(fieldList, name.c_str());
    SlimList_AddString(fieldList, value.c_str());
    SlimList_AddList(currentObject, fieldList);
    ++currentFieldCount;
}

char* QueryResultAccumulator::produceFinalResults() {
    if(currentFieldCount != -1)
        throw InvalidStateException("Current object not written");

    SlimList_Release(result);
    result = SlimList_Serialize(list);
    setInitialConditions();
    return result;
}
{% endhighlight %}

[<--Back](CppTraining#FitNesse)
