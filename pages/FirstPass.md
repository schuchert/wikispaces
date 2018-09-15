---
title: FirstPass
---

So I want to learn Ruby using a [TDD](Test_Drive_Development) approach. So I
started by installing [The Ruby Development Tools](http://rubyeclipse.sourceforge.net/download.rdt.html) Eclipse plugin.

Well it turns out to run Ruby you still need to install a 
[Ruby Interpreter](http://rubyforge.org/frs/?group_id=167), which I did.

Here are some very early examples trying to use [TDD](Test_Drive_Development):

{: #DieTest }
### DieTest
{% highlight ruby %}
require 'test/unit'
require 'die'

class DieTest < Test::Unit::TestCase
  
  def test_roll
    rolledValues = Array.new
    for num in (0..6)
      rolledValues[num] = 0
    end
    
    10000.times do
      v = Die.new.roll
      rolledValues[v] = rolledValues[v] + 1
    end
    
    assert_equal(0, rolledValues[0])
    for i in (1..6)
      assert(rolledValues[i] > 1000, 'missing number: ' + i.to_s)
    end
  end
  
end
{% endhighlight %}

{: #Die }
### Die
{% highlight ruby %}
class Die
  def initialize()
    roll
  end
  
  def roll
    @faceValue = rand(6) + 1
  end 
  
  def faceValue
    @faceValue
  end
end
{% endhighlight %}

{: #PairOfDiceTest }
### PairOfDiceTest
{% highlight ruby %}
require 'test/unit/testcase'
require 'test/unit/autorunner'
require 'pair_of_dice'

class PairOfDiceTest < Test::Unit::TestCase
 
  def test_roll_returns_valid
    p = PairOfDice.new
    v = p.roll
    assert(v >=2 && v <= 12)
  end 
  
end
{% endhighlight %}

{: #PairOfDice }
### PairOfDice
{% highlight ruby %}
require 'die'

class PairOfDice
  def initialize()
    @d1 = Die.new
    @d2 = Die.new
  end  
  
  def roll
    @d1.roll + @d2.roll
  end
  
  def faceValue
    @d1.faceValue + @d2.faceValue
  end
end
{% endhighlight %}

This works, however I want to be able to run all of my tests in one fell swoop. In Eclipse using Java, I simply right-click on a project and select Run->Junit Tests and it's all good. This feature doesn't seem to be available in Test::Unit (the Ruby equivalent) so after several attempts, I think I've got what I'm looking for:
^
### Suite
{: #Suite }
{% highlight ruby %}
require 'test/unit'
require 'find'

def allFiles
  files = Array.new
  Find.find('./') { |f| 
    if(f =~ /_test/)
      f = f.sub(/\.\//, "").sub(/\.rb$/,"")
      files.push(f) 
    end
  }
  files
end

allFiles().each {|f| require f}
{% endhighlight %}

This was adequate until I checked my code into subversion. When I did that, I had the original versions of the files in the .svn directory. I then updated this to prune the .svn directory:
{% highlight ruby %}
require 'test/unit'
require 'find'

def allFiles
  files = Array.new
  Find.find('./') { |f| 
    if(f =~ /\.svn/)
      Find.prune if f =~ /\.svn/
    end
    if(f =~ /_test/)
      f = f.sub(/\.\//, "").sub(/\.rb$/,"")
      files.push(f) 
    end
  }
  files
end

allFiles().each {|f| require f}
{% endhighlight %}

Of course, on the Ruby Forum, Ryan Davis gave me a MUCH more concise (and frankly I think MUCH better) version of this:
{% highlight ruby %}
(%w(test/unit) + Dir['**/*_test.rb']).each { |f| require f }
{% endhighlight %}

All "require"d files are read in using a single array. To create the array we first create an array using words (in this case it saves nothing to use %w(test/unit) versus ['test/unit']. The + operation on an array adds the contents of one array to another and the Dir class's [] method recursively finds files using a syntax I'm familiar with from ant.

This generates an array that looks like the following:
{% highlight ruby %}
   ['test/unit', 'die_test', 'pair_of_dice_test']
{% endhighlight %}

Then we require each of theses. By requiring test/unit, all other files read in using require that inherit from Test::Unit::TestCase are automatically added to a suite.

Having managed the first version, I continued with the first release of Monopoly.
