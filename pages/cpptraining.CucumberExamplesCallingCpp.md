---
title: cpptraining.CucumberExamplesCallingCpp
---
[<--Back]({{ site.pagesurl}}/CppTraining#ruby)

## Preliminary Setup
* Install ruby
* Install cucumber gem
* Install gherkin gem
* Install rspec gem

## Starting with Cucumber
* Create a directory to store your work
* In that directory, type cucumber:
{% highlight terminal %}
C:\learncpp>mkdir ruby_cpp
C:\learncpp>cd ruby_cpp
C:\learncpp\ruby_cpp>cucumber
You don't have a 'features' directory.  Please create one to get started.
See http://cukes.info/ for more information.

C:\learncpp\ruby_cpp>
{% endhighlight %}

* Create a directory called "features"
* Create a feature description file in the "features" directory called rpncalc_basic_operations.feature:
//**rpncalc_basic_operations.feature**//
{% highlight terminal %}
Feature: Basic Operations
  Scenario Outline: Perform some of the basic operations
  Given the input "<input>"
  When the calculator performs "<operator>" 
  Then the result should be "<output>"
  Examples:
  | input | operator      | output  |
  | 30 4  | +             | 34      |
  | 30 4  | -             | 26      |
  | 5     | !             | 120     |
  | 4 6   | *             | 24      |
  | 8 2   | /             | 4       |
  | 1     | -             | -1      |
  |       | +             | 0       |
  | 8 0   | /             | <error> |
  |       | $%^unknown*&^ | <error> |
{% endhighlight %}

* Run cucumber again, it will report missing steps. Copy those code examples;
{% highlight terminal %}
You can implement step definitions for undefined steps with these snippets:

Given /^the input "([^"]*)"$/ do |arg1|
  pending # express the regexp above with the code you wish you had
end

When /^the calculator performs "([^"]*)"$/ do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then /^the result should be "([^"]*)"$/ do |arg1|
  pending # express the regexp above with the code you wish you had
end

If you want snippets in a different programming language, just make sure a file
with the appropriate file extension exists where cucumber looks for step definitions.
{% endhighlight %}
* Under the features directory create a directory called step_definitions
* In the step_definitions directory create a file called rpncalc_steps.rb
//**rpncalc_steps.rb**//
{% highlight terminal %}
Given /^the input "([^"]*)"$/ do |arg1|
  pending # express the regexp above with the code you wish you had
end

When /^the calculator performs "([^"]*)"$/ do |arg1|
  pending # express the regexp above with the code you wish you had
end

Then /^the result should be "([^"]*)"$/ do |arg1|
  pending # express the regexp above with the code you wish you had
end
{% endhighlight %}
## Creating the basic glue code
* Create a file in the top-level directory called extconf.rb:
//**extconf.rb**//
{% highlight terminal %}
require 'mkmf'
dir_config("fixture_glue")
create_makefile("fixture_glue")
{% endhighlight %}
* Create a file called fixture_glue.cpp:
//**fixture_glue.cpp**//
{% highlight terminal %}
# include "ruby.h"
 
using namespace std;
# include <stdio.h>
 
VALUE cRpnCalcFixture;
 
class RpnCalc {
  // this will actually be a production-class linked in
  // from a dynamic or static library (later)
};
 
 
void RpnCalcFixture_Dispose(void *c) {
    printf("Deleting calc\n");
    delete static_cast<RpnCalc*>(c);
}
 
VALUE RpnCalcFixture_New(VALUE clazz) {
    printf("Creating calc\n");
    RpnCalc *c = new RpnCalc;    
    VALUE tdata = Data_Wrap_Struct(clazz, 0, RpnCalcFixture_Dispose, c);
    rb_obj_call_init(tdata, 0, 0);
    return tdata;
}
 
VALUE RpnCalcFixture_Enter(VALUE self, VALUE value) {
    printf("Enter value: %d\n", NUM2INT(value));
    return Qnil;
}
 
VALUE RpnCalcFixture_Perform(VALUE self, VALUE operatorName) {
    printf("Performing: %s\n", RSTRING_PTR(operatorName));
    return Qnil;
}
 
VALUE RpnCalcFixture_X(VALUE self) {
    printf("Getting x\n");
    return INT2NUM(12);
}
 
extern "C" {
typedef VALUE(*V_F)(...);
void Init_fixture_glue() {
    cRpnCalcFixture = rb_define_class("RpnCalcFixture", rb_cObject);
    rb_define_singleton_method(
		    cRpnCalcFixture, "new", (V_F)RpnCalcFixture_New, 0);
    rb_define_method(cRpnCalcFixture, "x", (V_F)RpnCalcFixture_X, 0);
    rb_define_method(cRpnCalcFixture, "perform",(V_F)RpnCalcFixture_Perform, 1);
    rb_define_method(cRpnCalcFixture, "enter", (V_F)RpnCalcFixture_Enter, 1);
}
}
{% endhighlight %}
* Build and install
{% highlight terminal %}
C:\learncpp\ruby>make
g++ -I. -IC:/Ruby192/include/ruby-1.9.1/i386-mingw32 -I/C/Ruby192/include/ruby-1
...<snip>...
auto-image-base,--enable-auto-import fixture_glue-i386-mingw32.def  -lmsvcrt-rub
y191  -lshell32 -lws2_32

C:\learncpp\ruby>make install
/usr/bin/install -c -m 0755 fixture_glue.so C:/Ruby192/lib/ruby/site_ruby/1.9.1/
i386-msvcrt

C:\learncpp\ruby>
{% endhighlight %}

## Connecting to the glue code
* Update your rpncalc_steps.rb:
{% highlight terminal %}
require 'fixture_glue'

Given /^the input "([^"]*)"$/ do |arg1|
  @calc = RpnCalcFixture.new
  arg1.split(/ /).collect{|s| @calc.enter(s.to_i)}
end

When /^the calculator performs "([^"]*)"$/ do |arg1|
  @calc.perform(arg1)
end

Then /^the result should be "([^"]*)"$/ do |arg1|
  # this should call getX, but the real calc is not implemented
end
{% endhighlight %}

* Re-run cucumber:
{% highlight terminal %}
C:\learncpp\ruby_cpp>cucumber
Feature: Basic Operations

  Scenario Outline: Perform some of the basic operations # features\rpncalc_basi
c_operations.feature:2
    Given the input "<input>"                            # features/step_definit
ions/rpncalc_steps.rb:3
    When the calculator performs "<operator>"            # features/step_definit
ions/rpncalc_steps.rb:8
    Then the result should be "<output>"                 # features/step_definit
ions/rpncalc_steps.rb:12

    Examples:
      | input | operator      | output  |
      |Creating calc
Enter value: 30
Enter value: 4
Performing: +
 30 4  | +             | 34      |
      |Creating calc
Enter value: 30
Enter value: 4
Performing: -
 30 4  | -             | 26      |
      |Creating calc
Enter value: 5
Performing: !
 5     | !             | 120     |
      |Creating calc
Enter value: 4
Enter value: 6
Performing: *
 4 6   | *             | 24      |
      |Creating calc
Enter value: 8
Enter value: 2
Performing: /
 8 2   | /             | 4       |
      |Creating calc
Enter value: 1
Performing: -
 1     | -             |Deleting calc
Deleting calc
Deleting calc
Deleting calc
Deleting calc
 -1      |
      |Creating calc
Performing: +
       | +             | 0       |
      |Creating calc
Enter value: 8
Enter value: 0
Performing: /
 8 0   | /             | <error> |
      |Creating calc
Performing: $%^unknown*&^
       | $%^unknown*&^ | <error> |

9 scenarios (9 passed)
27 steps (27 passed)
0m0.031s
Deleting calc
Deleting calc
Deleting calc
Deleting calc
{% endhighlight %}
[<--Back]({{ site.pagesurl}}/CppTraining#ruby)
