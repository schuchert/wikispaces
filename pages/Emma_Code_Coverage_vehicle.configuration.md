---
title: Emma_Code_Coverage_vehicle.configuration
---
[<--Back]({{ site.pagesurl}}/Emma Code Coverage vehicle.type) [Next-->]({{ site.pagesurl}}/Emma Code Coverage vehicle.integration)

# Emma Code Coverage vehicle.type Package

Here are the details for this package:
|name|class, %|method, %|block, %|line, %|
|CarRentalBeanFactory.java|100% (1/1)|83% (5/6)|64% (58/90)| 67% (16/24) |
|CarRentalBeanFactoryTest.java|100%(1/1)|75% (3/4)| 79% (15/19)|71% (5/7)|

This is a small package that manages the bean factory configuration. We'll look at each class, but before we do I think it's interesting that there are lines in the test class that do not execute.

## The Plan
**CarRentalBeanFactory.java**
There are a few things not covered in my bean factory:
# A private constructor
# An exception catch block
# A throw clause when the type of bean found does not match the class type passed in
# A condition that handles when I retrieve a bean that is in the default package

### Private Constructor
Here's the series of events that lead to this private constructor:
# I started using [PMD]({{ site.pagesurl}}/PMD In Eclipse) to evaluate the quality of my code using its rule set.
# PMD has a rule that says every class should have a constructor. 
# I added a constructor.
# PMD has a rule that says empty constructors should have a comment. 
# I added the comment.
# PMD has a rule that says classes with only static method should have private constructors.
# I made the constructors private to document these classes as utility classes.

### Catch Block in Static Initializer
OK, if you're going to use static initializers (and myabe I should not have done so here), make sure that there is no possible way the code can fail. Why? If a static initizlier fails, the class will fail loading and you'll get a class not found exception. If you're not used to checking for that possibility, it can be a pain to fix since you'll be looking at classpath issues and not static initializers issues.

I hope this block of code never executes. I could delete the file it's looking for, try to initialize it then replace the file. I'm not going to do that. I'm just going to consider that code covered because it's effect is to give me an idea of what is actually happening in the case that a configuration file cannot be found.

### Throw Clause
I'll write a test for this situation. It should be tested. Of course, as you'll see below, doing so will cause the line coverage in my test class to go down. Why? Such a test will expect an exception. Emma will no consider a line that calls the bean factory and which generates an exception to be covered.

### Default Package
I could create a class in the test directory in the default package to verify this code. Since the class is in the same package as the class, I'll change the access to package and test the method with a bogus class I add to the default pacakge.

**CarRentalBeanFactoryTest.java**
There is one line considered not covered by emma:
```
     CarRentalBeanFactory.getBean(CarRentalBeanFactoryTest.class);
```

This line is meant to generate an exception. It does, the class passes but Emma does not consider this line covered. This is a shortcoming of Emma and I won't do anything about it.

## The Results
Well after writing a few more tests, here are the results:
|name|class, %|method, %|block, %|line, %|
|CarRentalBeanFactoryTest.java|100% (1/1)|67%  (4/6)|76%  (25/33)|69%  (9/13)|
|CarRentalBeanFactory.java|100% (1/1)|83%  (5/6)|87%  (78/90)|79%  (19/24)|

Are these results disappointing? Again, have we improved our system? What is your purpose for using code coverage tools? Is it to get high percentages? If so, then are you going for the right thing? What if your goal is to improve the quality of the code or at least your confidence in the code? This round of tests did that a little bit for me, but not very much.

[<--Back]({{ site.pagesurl}}/Emma Code Coverage vehicle.type) [Next-->]({{ site.pagesurl}}/Emma Code Coverage vehicle.integration)
