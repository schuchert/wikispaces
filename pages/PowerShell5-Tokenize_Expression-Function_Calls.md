---
title: PowerShell5-Tokenize_Expression-Function_Calls
---
{% include nav prev="PowerShell5-Tokenize_Expression-First_Stab_At_Parentheses" up="PowerShell5.TokenizeExpression" next="PowerShell5-Tokenize_Expression-Convert_Tokenizer_To_An_Enumerator" %}

## Function Calls

Finally, function calls. This might already work. Let's write an experiment and see what the results are:
{% highlight powershell %}
        @{expression = 'f(g(3))'; expected = @('f', '(', 'g', '(', '3', ')', ')')}
{% endhighlight %}
This passes. The question I'm wondering is whether we want those results, or something more like this:
{% highlight powershell %}
        @{expression = 'f(g(3))'; expected = @('f(', 'g(', '3', ')', ')')}
{% endhighlight %}
As it turns out, the first version passes as is. The second version requires a change to one of the regular expressions:
{% highlight powershell %}
    static [Array]$regex = @( '^([()])', '^([\d\w]+\({0,1})', '^([^\d\w\s]+)' )
{% endhighlight %}
The change is in the middle regex, allowing for zero or 1 ( at the end of a series of digits and letters. Given the change is easy, I'll leave this as is and consider the tokenizer done for now. Next, we'll move on to the [Shunting Yard Algorithm in PowerShell 5](PowerShell5.ShuntingYardAlgorithm).

[Here's my final-ish version.](PowerShell5-Tokenize_Expression-Finalish_Version).
{% include nav prev="PowerShell5-Tokenize_Expression-First_Stab_At_Parentheses" up="PowerShell5.TokenizeExpression" next="PowerShell5-Tokenize_Expression-Convert_Tokenizer_To_An_Enumerator" %}
