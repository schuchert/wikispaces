
### Example styles and Your audience
Which do you prefer? You have seen three different forms:
* First, you saw Examples simply using the calculator.
* Second, you saw Examples using a combination of support methods and using the calculator.
* Now, you see an Example only using support methods.

The first form gives a concrete example of how the RpnCalculator should be used. The last form makes the Example easy to read and moves the writing of the examples into the way a user might speak about using the calculator.

Here is just he Basic Math Operators context updated:
{% highlight ruby %}
  describe "Basic Math Operators" do
    it "should add the x_regiser and the top of the stack" do
      type 46
      press :enter
      press :+
      validate_x_register 92
    end

    it "should result in 0 when the calculator is empty" do
      press :+
      validate_x_register 0
    end

    it "should reset the x_register after +" do
      type 9
      press :+
      type 8
      validate_x_register 8
    end

    it "should should reduce the stack by one" do
      type 9
      press :enter
      type 8
      press :enter
      press :+
      @calculator.available_operands.should == 2
    end

    it "should subtract the first number entered from the second" do
      type 4
      press :enter
      type 9
      press :-
      validate_x_register -5
    end
  end
{% endhighlight %}
Here's a side-by-side comparison between the two styles:

<table>
    <tr>
    <td>
{% highlight  ruby %}
it "programmer" do
  @calculator.digit_pressed 4
  @calculator.execute_function :enter
  @calculator.digit_pressed 5
  @calculator.digit_pressed 2    
  @calculator.execute_function :+
  @calculator.x_register.should == 56
end
{% endhighlight %}
    </td>
    <td>    
{% highlight  ruby %}
it "user" do
  type 4
  press :enter
  type 52
  press :+
  validate_x_register 56
end
{% endhighlight %}
    </td>
    </tr>
</table>

Before thinking that one style is the "right" style, consider the audience and even the author. If the audience is the user, then the style on the right is more appropriate. If the audience is another developer, then the left side might be more appropriate.</span>

You might think that using the methods names on the right for your calculator is an option. However, that won't look correct:
{% highlight ruby %}
  @calculator.type 4
  @calculator.press :enter
  @calculator.type 52
  @calculator.press :+
  @calculator.x_register.should == 56
{% endhighlight %}
The method names do not make sense being sent to a calculator. So the method names make sense on the left when sent to a calculator. The method names on the right make sense when reading an example. 

While this tutorial will not cover it, RSpec has the notion of "story tests", or tests that are meant to be written by the same people who write user stories, your customer, product owner, QA person or even developers. That's coming up in a later tutorial, so this subject will come up again.
 
