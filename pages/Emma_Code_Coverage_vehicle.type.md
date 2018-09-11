---
title: Emma_Code_Coverage_vehicle.type
---
[<--Back](Car_Rental_Code_Coverage_with_Emma) [Next-->](Emma_Code_Coverage_vehicle.configuration)

# Emma Code Coverage vehicle.type Package

Looking into the details of just this package, we have the following stats:

|name|class, %|method, %|block, %|line, %|
|EnumField.java|0%  (0/1)|0% (0/5)|0% (0/21)|0% (0/9) |
|ObjectField.java|0% (0/1)|0% (0/4)|0% (0/27)|0% (0/9) |
|ListField.java|100% (1/1)|56% (5/9)|38% (26/69)|55% (11/20) |
|FieldChangedStatus.java|100% (1/1)| 50% (2/4)|41% (29/70)| 67% (2/3) |
|AbstractObject.java|100% (1/1)|80% (4/5)|41% (17/41)|60% (6/10) |
|ClassAndMessage.java|100% (1/1)|67% (4/6)| 50% (20/40)| 82% (9/11) |
|FloatField.java|100% (1/1)|50% (3/6)| 61% (17/28)| 55% (6/11) |
|ValidationStatus.java|100% (1/1)|50% (2/4)|66% (79/120)| 67% (2/3) |
|StringField.java|100% (1/1)|83% (5/6)|87% (39/45)|73% (8/11) |
|AbstractField.java|100% (1/1)|95% (20/21)|88% (138/156)|85% (37.4/44) |
|Result.java|100% (1/1)|89% (8/9)|95% (55/58)|94% (17/18) |
|IntegerField.java|100% (1/1)|100% (3/3)|100% (17/17)| 100% (6/6) |

The first thing to notice is that EnumField.java and ObjectField.java have no coverage. These are some classes I created in some preliminary work that I stopped using as I refactored. It is time to get rid of these classes but I did realize that until running Emma for the first time.

## The Plan
Now for a class-by-class breakdown.

**ListField.java**
There are four unused methods in this class: clone, addAll, iterator, remove. I should have tested these methods, so I'll write unit tests that exercise these methods.

**FieldChangedStatus.java**
This is a Java 5 enumeration and it has 2 unused methods: valueOf and values. I did not write these methods, Java did. Here are some options:
* Write a unit test to exercise these methods.
* I could just ignore the results.
* I could exclude enums from test coverage.
* I could write a simple test utility class that exercises these methods for a given enum.

I have few enumerations so I'll just write a unit test to exercise these methods and get my line coverage up.

**AbstractObject.java**
Most of the lines not covered are in an exception block. I could do the following:
* Create a test subclass that generates CloneNotSupported to exercise that code.
* Same thing, but use an anonymous inner class.
* Skip it.

In this case, this exception block handles a situation I really do not ever expect to happen. Normally when I have something "that will never happen" I immediately think "it will happen." If this does happen, it simply generates a Runtime exception that will cause the thread to die. That, plus I'm not sure how to make that exception get thrown in the system leads me to just skip it.

The other method not covered is a isX method so I'll simply exercise that with a unit test.

**ClassAndMessage.java**
This class has a get method and toString no covered. As in other situations, I'll exercise these methods with a test.

**FloatField.java**
There are two unused constructors. I could test them but I'm going to delete them instead (assuming there's no compilation errors). I have not needed them yet and if I need them in the future, I'll add them back in. By the way, I'll actually remove the code, not simply comment it out, which is a common thing I've observed across numerouse years and projects. I'm using subversion so I won't lose any code if I delete it.

The clone method is also not tested so I'll fix that with a unit test.

**ValidationStatus.java**
This is another enumeration class. I'll use the same apporach as for FieldChangedStatus above.

**StringField.java**
There is one unused default constructor. I'll remove it (again, assuming everything compiles).

**AbstractField.java**
This class already has 85% coverage. Even so, it has the following uncovered lines:
* A catch block.
* An else clause when validating a field with no validator.
* A few of the branches in a compound boolean expression
* A set method.
* Part of an equals method when the thing passed in is either not null or not of the same class.

Given that the coverage is already at 85%, I won't do anything with this class.

**Result.java**
This class has 94% coverage and the only thing uncovered is a get method, so I'll leave this one alone.

**IntegerField.java**
It has 100% coverage.

## The Results
After making the above changes, we now have the following package-level resuls:

|name|class, %|method, %|block, %|line, %|
|vehicle.type|100% (16/16)|98% (92/94)| 94% (797/846)| 94% (173.9/185) |

The specific results for the classes are here:

|name|class, %|method, %|block, %|line, %|
|AbstractObject.java|100%(1/1)|100%(5/5)|56% (23/41)|68% (6.8/10)|
|AbstractField.java|100%(1/1)|95% (20/21)|88% (138/156)|85% (37.4/44)|
|FieldChangedStatus.java|100%(1/1)|100%(4/4)|93% (65/70)|96% (2.9/3)|
|Result.java|100%(1/1)|89% (8/9)|95% (55/58)|94% (17/18)|
|ValidationStatus.java|100%(1/1)|100%(4/4)|96% (115/120)|96% (2.9/3)|
|AbstractObjectTest.java|100%(1/1)|100%(3/3)|100%(14/14)|100%(4/4)|
|ClassAndMessage.java|100%(1/1)|100%(6/6)|100%(40/40)|100%(11/11)|
|ClassAndMessageTest.java|100%(1/1)|100%(4/4)|100%(26/26)|100%(7/7)|
|FieldChangedStatusTest.java|100%(1/1)|100%(3/3)|100%(17/17)|100%(5/5)|
|FloatField.java|100%(1/1)|100%(4/4)|100%(21/21)|100%(7/7)|
|FloatFieldTest.java|100%(1/1)|100%(3/3)|100%(23/23)|100%(6/6)|
|IntegerField.java|100%(1/1)|100%(3/3)|100%(17/17)|100%(6/6)|
|ListField.java|100%(1/1)|100%(10/10)|100%(73/73)|100%(21/21)|
|ListFieldTest.java|100%(1/1)|100%(7/7)|100%(114/114)|100%(27/27)|
|StringField.java|100%(1/1)|100%(5/5)|100%(39/39)|100%(8/8)|
|ValidationStatusTest.java|100%(1/1)|100%(3/3)|100%(17/17)|100%(5/5)|

(Note, at the end of this, you'll be provided a link with the changes for all of these refactorings.)

Have we made any real improvements? Have we tested methods that are likely to fail? That is something that you'd have to decide for yourself. I'm not convinced that we've accomplished very much other than removing unused classes and methods.

[<--Back](Car_Rental_Code_Coverage_with_Emma) [Next-->](Emma_Code_Coverage_vehicle.configuration)
