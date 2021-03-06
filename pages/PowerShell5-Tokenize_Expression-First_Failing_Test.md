---
title: PowerShell5-Tokenize_Expression-First_Failing_Test
---
[Up](PowerShell5.TokenizeExpression)  [Next-->](PowerShell5-Tokenize_Expression-Simple_Binary_Expressions)
## First Failing Test

Now it's time to create the first test. We'll start with a failing test, and do something simple to get it to work.
* Create a new file called Tokenizer.Tests.ps1:
{% highlight powershell %}
    Describe "Tokenizing an in-fix expression" {
    
      It "Should convert a single number into a single token" {
        $tokenizer = [Tokenizer]::new()
    
        $tokens = $tokenizer.interpret("42")
    
        $tokens[0] | Should be "42"
      }
    }
{% endhighlight %}
* Run your (now failing tests):
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> Invoke-Pester
    Executing all tests in '.'
    
    Executing script C:\Users\Brett\shunting_yard_algorithm\Tokenizer.Tests.ps1
    
      Describing Tokenizing an in-fix expression
        [-] Should convert a single number into a single token 58ms
          RuntimeException: Unable to find type [Tokenizer].
          at <ScriptBlock>, C:\Users\Brett\shunting_yard_algorithm\Tokenizer.Tests.ps1: line 4
    Tests completed in 58ms
    Tests Passed: 0, Failed: 1, Skipped: 0, Pending: 0, Inconclusive: 0
{% endhighlight %}
This failed, and it seems it failed for a reasonable reason. It doesn't know about the type Tokenizer. To remedy this, we'll create a module and import it into the test.
* Create a new filed called Tokenizer.psm1:
{% highlight powershell %}
    class Tokenizer {
    }
{% endhighlight %}
* At the top of Tokenizer.Tests.ps1, add the following line:
{% highlight powershell %}
    using module '.\Tokenizer.psm1'
    
    Describe "Tokenizing an in-fix expression" {
    # ...
{% endhighlight %}
* Run your tests and see that the error has changed a bit:
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> Invoke-Pester
    Executing all tests in '.'
    
    Executing script C:\Users\Brett\shunting_yard_algorithm\Tokenizer.Tests.ps1
    
      Describing Tokenizing an in-fix expression
        [-] Should convert a single number into a single token 69ms
          RuntimeException: Method invocation failed because [Tokenizer] does not contain a method named 'interpret'.
          at <ScriptBlock>, C:\Users\Brett\shunting_yard_algorithm\Tokenizer.Tests.ps1: line 8
    Tests completed in 69ms
    Tests Passed: 0, Failed: 1, Skipped: 0, Pending: 0, Inconclusive: 0
{% endhighlight %}
Closer, let's get to a passing test. Again, we'll do just enough to get the test passing.
* Update Tokenizer.psm1:
{% highlight powershell %}
    using namespace System.Collections
    
    class Tokenizer {
      [ArrayList]interpret([String]$expression) {
        $result = [ArrayList]::new()
        $result.Add($expression)
        return $result
      }
    }
{% endhighlight %}
* Run your test (expecting things to pass):
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> Invoke-Pester
    Executing all tests in '.'
    
    Executing script C:\Users\Brett\shunting_yard_algorithm\Tokenizer.Tests.ps1
    
      Describing Tokenizing an in-fix expression
        [-] Should convert a single number into a single token 47ms
          RuntimeException: Method invocation failed because [Tokenizer] does not contain a method named 'interpret'.
          at <ScriptBlock>, C:\Users\Brett\shunting_yard_algorithm\Tokenizer.Tests.ps1: line 8
    Tests completed in 47ms
    Tests Passed: 0, Failed: 1, Skipped: 0, Pending: 0, Inconclusive: 0
{% endhighlight %}
This might be unexpected. If so, that's good because when unexpected thigns happen, we're about to learn something.

In this case, running Pester directly as we are updates the current shell. There are several solutions, but a trivial one is to run "powershell invoke-pester":
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> powershell invoke-pester
    Executing all tests in '.'
    
    Executing script C:\Users\Brett\shunting_yard_algorithm\Tokenizer.Tests.ps1
    
      Describing Tokenizing an in-fix expression
        [+] Should convert a single number into a single token 683ms
    Tests completed in 683ms
    Tests Passed: 1, Failed: 0, Skipped: 0, Pending: 0, Inconclusive: 0
{% endhighlight %}
## Summary
There are many common complaints about TDD in such a simple start:
* This doesn't do *anything*
* How can such small steps accomplish anything?
* I know so much more about what I need to do, why don't I jump ahead and save time?
* ... Insert another 20 complaints here.

I'm not going to even try to convince you that this does or does not work. We'll work through the problem taking an extremely incremental approach. We'll build up a solid footing so we can experiment later. Even so, this trivial example has demonstrated several (possibly incorrect) decisions:
* We have a class that does this work called Tokenizer
* We have a single method that we call, called tokenize
* It takes a String and returns an array of Strings, one element for each token

Now that we have an API, we can focus on trying to grow the algorithm to make it work with at least the examples listed above.
<aside>
Throughout working on this problem, I'll be using git to make working snapshots. I might even put this code into my github account. I'll show a few of the git commands I'm using now, then as we move through the rest of this, I'll mention good times to at least locally commit your work.
</aside>
## Initialize And Initial Push
* Make your shunting_yard_algorithm directory a git repo
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> git init
    Initialized empty Git repository in C:/Users/Brett/shunting_yard_algorithm/.git/
{% endhighlight %}
* Now add all the things:
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> git add .\Tokenizer.*
{% endhighlight %}
* Verify only the things we want to add have been added:
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> git status
    On branch master
    
    No commits yet
    
    Changes to be committed:
      (use "git rm --cached <file>..." to unstage)
    
            new file:   Tokenizer.Tests.ps1
            new file:   Tokenizer.psm1
{% endhighlight %}
* Make your first commit into your local git repo:
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> git commit -m "Initial commit"
{% endhighlight %}
* And look at the results:
{% highlight powershell %}
    [master (root-commit) 94fee3e] Initial commit
     2 files changed, 17 insertions(+)
     create mode 100644 Tokenizer.Tests.ps1
     create mode 100644 Tokenizer.psm1
{% endhighlight %}
* You can verify that there are no local changes remaining:
{% highlight powershell %}
    PS C:\Users\Brett\shunting_yard_algorithm> git status
    On branch master
    nothing to commit, working tree clean
{% endhighlight %}
[Up](PowerShell5.TokenizeExpression)  [Next-->](PowerShell5-Tokenize_Expression-Simple_Binary_Expressions)
