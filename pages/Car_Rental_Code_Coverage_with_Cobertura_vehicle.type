[[toc]]
[[Car Rental Code Coverage with Cobertura|<--Back]]  [[Car Rental Code Coverage with Cobertura vehicle.exception|Next-->]]

# Package: vehicle.type

## Analysis
Here are the statistics for this package (sorted worse to best):
||Class||Coverage%||Line Count||Branch %||Line Count||Complexity||
||Validateable||N/A||N/A||N/A||N/A||0||
||EnumField||0%||0/10||N/A||N/A||0||
||ObjectField||0%||0/10||N/A||N/A||0||
||AbstractObject||55%||6/11||0%||0/1||0||
||ListField||57%||12/21||0%||0/1||0||
||FloatField||58%||7/12||N/A||N/A||0||
||FieldChangedStatus||67%||2/3||0%||0/1||0||
||ValidationStatus||67%||2/3||0%||0/1||0||
||StringField||75%||9/12||N/A||N/A||0||
||ClassAndMessage||82%||9/11||N/A||N/A||0||
||AbstractField||84%||38/45||100%||6/6||0||
||Result||94%||17/18||N/A||N/A||0||
||IntegerField||100%||7/7||N/A||N/A||0||

**Validateable**
This class is an interface so there's nothing to report here.

**EnumField & ObjectField**
In some earlier work I used these classes but as I updated how I was tracking changed, I moved away from these classes. They are no longer used so I'll simply remove them. Of course they are always availabe in my subversion repository if I need to get them back.

**AbstractObject**
This class has an unused method, isValid(), and a catch block that the unit tests do not exercise. Data validation depends on the isValid() method so I'll add a test for that class. Since the class is abstract, I'll need to use a derived class to test it. To make this test isloated from other classes, I'll create an anonymous inner class as a subclass in the test class.

As for the untested catch block in the clone method, I'll try to create a subclass that contains a field that cannot be cloned. I'll then execute the clone method and see if I can get it to verify that code. This catch block is only there because CloneNotSupported is a checked exception. This code should never execute in a deployed system and if it does, it simply turns the checked exception into an unchecked exception, so I don't think improving the coverage will actually have any impact on the quality of the code. None the less, it's an easy change so I'll give it a try.

**ListField**
This class has several methods that are not exercised by the tests: clone(), addAll(), iterator(), remove(). These are simply missing tests and I'll add them.

**FloatField**
This class has two unused constructors and its clone() method left unexercised after the unit tests. I'll remove the constructors and exercise the clone() method.

**FieldChangedStatus & ValidationStatus**
These are Java 5 enum classes. Both show a line that the unit tests do not exercise at the top of the file. A little research using another code coverage tool (emma) provided a solution to this. We can get the coverage to 100%, and I'll do that, but I don't think doing so actually has any effect on the overall software quality.

**StringField**
The tests do not execute a default constructor. I'll remove it.

**ClassAndMessage**
The tests do not execute the getMessage() and toString() methods. I'll write tests do exercise these methods, but I don't it will add much to the overall quality of the software.

**AbstractField**
The tests do not execute the clone method's catch block. As mentioned above, I'll exercise it by making a subclass with a non-cloneable field.

There's also a branch that is not covered where an abstract field has no associated validator. This is a missing test and I'll add it.

The tests do not exercise the setChangedStatus() method. I'm wondering if this whole chnaged status is required at all. I'll review all uses of the changed status and either remove it or make sure to exercise this method.

The equals() method has a branch not covered by a test, it will be a trivial test to write and it will also not increase my confidence of the code any.

**Result**
The tests do not execute the getGlobalErrors() method. I'll review this and see if it is used at all. If not, I'll remove it. If so, I'll test the method.

**IntegerField**
This class has 100% coverage so there are no required changes.

## Results
After applying all of the changes metntioned above, here are the results:
||Classes||Line Coverage|| ||Branch Coverage|| ||Complexity||
||AbstractField||93%||42/45||100%||6/6||0||
||AbstractFieldTest||100%||15/15||100%||2/2||0||
||AbstractObject||64%||7/11||100%||1/1||0||
||AbstractObjectTest||100%||6/6||N/A||N/A||0||
||AbstractObjectTest$StringTester||100%||4/4||N/A||N/A||0||
||ClassAndMessage||100%||11/11||N/A||N/A||0||
||ClassAndMessageTest||100%||10/10||100%||2/2||0||
||FieldChangedStatus||100%||3/3||100%||1/1||0||
||FieldChangedStatusTest||100%||4/4||N/A||N/A||0||
||FloatField||100%||8/8||N/A||N/A||0||
||FloatFieldTest||100%||7/7||100%||1/1||0||
||IntegerField||100%||7/7||N/A||N/A||0||
||ListField||92%||23/25||100%||1/1||0||
||ListFieldTest||100%||26/26||N/A||N/A||0||
||Result||100%||18/18||N/A||N/A||0||
||ResultTest||100%||7/7||100%||1/1||0||
||StringField||100%||9/9||N/A||N/A||0||
||Validateable||N/A||N/A||N/A||N/A||0||
||ValidationStatus||100%||3/3||100%||1/1||0||
||ValidationStatusTest||100%||4/4||N/A||N/A||0||


**EnumField & ObjectField**
No surprise here, removing the code took care of the problem.

**AbstractObject**
It was not too much of a problem to create a subclass of AbstractObject in the test class itself. I then used that class to exercise the underlying method.

The catch block in the clone() method was not as easy. It turns out that my initial plan was flawed. The default implementation of clone() performs a shallow copy, not a deep copy. If you want to perform a deep copy, you must code that yourself. If I do that, then the code I'm writing to perform the deep copy must handle the CloneNotSupportedException. Why? Because the clone() method as defined in this class does not throw CloneNotSupported, so subclasses cannot just try to clone something and allow that exception to be thrown.

So this is really a situation that cannot easily happen. I tried one more thing before I quickly realized it was not going to work. I though about having the clone method call another method using reflection. The second method would throw CloneNotSupported. However, this won't work because when you use reflection to call a method and that method throws an exception, the reflection API wraps that exception in another exception, InvocationTargetException. So I do not know a way to make this code actually execute.

**ListField**
Adding in the missing test methods improved the coverage. There still the matter of getting the catch block covered. I was unsuccessful trying to do so with AbstractObject. I do not have any ideas on how to fix this so I'll leave it. Maybe someone reading this can offer a solution.

**FloatField**
**FieldChangedStatus & ValidationStatus**
**StringField**
**ClassAndMessage**
**AbstractField**
**Result**
**IntegerField**





## Conclusions

[[Car Rental Code Coverage with Cobertura|<--Back]]  [[Car Rental Code Coverage with Cobertura vehicle.exception|Next-->]]