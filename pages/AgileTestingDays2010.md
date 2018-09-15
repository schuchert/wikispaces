---
title: AgileTestingDays2010
---
## Rpn Calculator Source w/ FitNesse Tests

* You'll need a jvm already installed for this example to work
* Download the zip file: [Archive.zip](http://schuchert.wikispaces.com/file/view/Archive.zip)
* Create a directory to hold its contents
* Extract the file into that directory
* You'll see three entires (maybe a few more):
* fitnesse.jar
* RpnCalculator.jar
* FitNesseRoot
* Go to directory and type (you can use another port value than 8080):
{% highlight terminal %}
java -jar fitnesse.jar -p 8080
{% endhighlight %}
* Open your favorite brower and to to the follow url: <http://localhost:8080/RpnCalculatorExamplesByIteration>

This should get you started. Note that the FitNesseRoot directory contains all of the tests I demonstrated in my talk. Also, the attached RpnCalculator.jar file contains all of the source files. There are several unit tests as well as some acceptance tests written using JUnit.
