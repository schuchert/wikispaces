---
title: PowerShell5-Tokenize_Expression-Simple_Binary_Expressions
---
[<— Back](PowerShell5.TokenizeExpression.FirstFailingTest)  [^^ Up ^^](PowerShell5.TokenizeExpression) [Next—>](PowerShell5.TokenizeExpression.FirstStabAtParentheses)

## Overview
Now that we have a trivial first test, we'll begin growing the implementation one test at a time. We'll be following [Uncle Bob's Three Rules of TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd), summarized here as:
* Write no production code without a failing test
* Write just enough of a test to get the test to fail
* Write just enough production code to get the test to pass

We will additionally do the following:
* Keep existing tests passing while making the new ones pass
* Keep the code clean by refactoring it every so often
* Frequently committing code using git

In general, there are for things we might do at any point:
* Write test code
* Write production code
* Refactor test code
* Refactor production code

We'll strive to do only one of these at a time and only switch to another one of these actions when all tests are passing.
## Moving Towards Binary Expression
Rather than immediately going to a full binary expression, we'll add a test with a number and an operator.
* Create a new test:
{% highlight powershell %}
     It "Should convert a number and a single operator to two tokens" {
       $tokenizer = [Tokenizer]::new()
    
       $tokens = $tokenizer.interpret("123+")
    
       $tokens[0] | Should be '123'
       $tokens[1] | Should be '+'
       $tokens.Count | Should be 2
     }
{% endhighlight %}
* Run your tests, you should see an error similar to:
{% highlight powershell %}
  Describing Tokenizing an in-fix expression
    [+] Should convert a single number into a single token 530ms
    [-] Should convert a number and a single operator to two tokens 150ms
      Expected string length 3 but was 4. Strings differ at index 3.
      Expected: {123}
      But was:  {123+}
      --------------^
      18:        $tokens[0] | Should be '123'
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 18
Tests completed in 681ms
Tests Passed: 1, Failed: 1, Skipped: 0, Pending: 0, Inconclusive: 0
{% endhighlight %}

* A little bit of regex magic allows us to get the tests passing:
{% highlight powershell %}
 [ArrayList]interpret([String]$expression) {
   $result = [ArrayList]::new()

   $expression -match('^(\d+)')
   $result.Add($Matches[1])
   $expression = $expression.Substring($Matches[1].Length)
   $result.Add($expression)

   return $result
 }
{% endhighlight %}

* Run your tests, they are passing.
When I wrote that code, I was tempted to add a check to verify something I suspected. Rather than do that, with all of the tests passing, I suggest going back to the first test and making a change. There's near duplication between the two tests. Make them more similar.

* Update the first test:
{% highlight powershell %}
       $tokens[0] | Should be '42'
       $tokens.Count | Should be 1
{% endhighlight %}
* Run the tests, you'll notice now that the first test fails:
{% highlight powershell %}
  Describing Tokenizing an in-fix expression
    [-] Should convert a single number into a single token 597ms
      Expected: {1}
      But was:  {2}
      11:        $tokens.Count | Should be 1
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 11
    [+] Should convert a number and a single operator to two tokens 204ms
{% endhighlight %}
* Suspicion confirmed, update the code:
{% highlight powershell %}
        if ($expression.Length -ne 0) {
            $result.Add($expression)
        }

        return $result
{% endhighlight %}

* Run your tests, and it's back to passing.
Now we might be ready for a complete binary expression. Let's give that a try, then we'll do some refactoring of the tests.

* Add a new test:
{% highlight powershell %}
     It "Should convert a binary expression into three tokens" {
       $tokenizer = [Tokenizer]::new()
    
       $tokens = $tokenizer.interpret("99*34")
    
       $tokens[0] | Should be '99'
       $tokens[1] | Should be '*'
       $tokens[2] | Should be '34'
       $tokens.Count | Should be 3
     }
{% endhighlight %}

* Sure enough, running the tests shows that we're not quite done with a binary expression:
{% highlight powershell %}
    [-] Should convert a binary expression into three tokens 155ms
      Expected string length 1 but was 3. Strings differ at index 1.
      Expected: {*}
      But was:  {*34}
      ------------^
      30:        $tokens[1] | Should be '*'
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 30
{% endhighlight %}

* We need to do this more than once, and check for digits and not digits. This will do it:
{% highlight powershell %}
    [ArrayList]interpret([String]$expression) {
        $result = [ArrayList]::new()

        while ($expression.Length -ne 0) {
            if($expression -match ('^(\d+)')) {
                $result.Add($Matches[1])
                $expression = $expression.Substring($Matches[1].Length)
            }  else {
                $expression -match('^([^\d])')
                $result.Add($Matches[1])
                $expression = $expression.Substring($Matches[1].Length)
            }
        }
        if ($expression.Length -ne 0) {
            $result.Add($expression)
        }

        return $result
    }
{% endhighlight %}

* Run your tests, they should pass.

* A quick check after your tests are passing will verify that the final if is not necessary:
{% highlight powershell %}
    [ArrayList]interpret([String]$expression) {
        $result = [ArrayList]::new()

        while ($expression.Length -ne 0) {
            if($expression -match ('^(\d+)')) {
                $result.Add($Matches[1])
                $expression = $expression.Substring($Matches[1].Length)
            }  else {
                $expression -match('^([^\d])')
                $result.Add($Matches[1])
                $expression = $expression.Substring($Matches[1].Length)
            }
        }

        return $result
    }
{% endhighlight %}

* Run your tests, they should be passing.

* Now is a great time to commit your changes because we are going to refactor and if things go badly, this is a good place to be able to easily get back to.

* Noticing some duplication and after a two successful tries, I ended up with the following:
{% highlight powershell %}
    using namespace System.Collections
    
    class Tokenizer {
        [boolean]recordIfMatches([ref]$expression, $regex, $result) {
            if ($expression.Value -match ($regex)) {
                $result.Add($Matches[1])
                $expression.Value = $expression.Value.Substring($Matches[1].Length)
                return $true
            }
            return $false
        }
    
        [ArrayList]interpret([String]$expression) {
            $result = [ArrayList]::new()
    
            while ($expression.Length -ne 0) {
                if (-not $this.recordIfMatches([ref]$expression, '^(\d+)', $result)) {
                    $this.recordIfMatches([ref]$expression, '^([^\d])', $result)
                }
            }
    
            return $result
        }
    }
{% endhighlight %}

I'm not a PowerShell expert and I do not know how common/popular/idiomatic the use of [ref] is, but it nicely collapses the code. I even notice something that will come up later (I see a pattern I've not noticed before). So I'll chose some tests to exploit that. But before doing that, thre's a few more things to do with our tests in terms of refactoring and test cases.

The test file has a bit of duplication. It's time to collapse that. To do so, we'll use the -TestCases feature of Pester.

* Update your test by adding a new test, which duplicates the first test:
{% highlight powershell %}
    It "Should convert <expression> to <expected>" -TestCases @(
        @{expression = '42'; expected = @('42')}
    ) {
        param($expression, $expected)
        $tokenizer = [Tokenizer]::new()
    
        $result = $tokenizer.interpret($expression)

        for($i = 0; $i -lt $result.Count; ++$i) {
            $result[$i] | Should be $expected[$i]
        }
        $result.Count | Should be $result.Count
    }
{% endhighlight %}

* Run your tests, and they all pass:
{% highlight powershell %}
      Describing Tokenizing an in-fix expression
        [+] Should convert a single number into a single token 535ms
        [+] Should convert a number and a single operator to two tokens 78ms
        [+] Should convert a binary expression into three tokens 23ms
        [+] Should convert 42 to 42 54ms
    Tests completed in 691ms
    Tests Passed: 4, Failed: 0, Skipped: 0, Pending: 0, Inconclusive: 0
{% endhighlight %}

* This new tests duplicates the first test, so it is safe to remove it. While you are at it, convert the other two tests into this last one:
{% highlight powershell %}
    using module '.\Tokenizer.psm1'
    
    Describe "Tokenizing an in-fix expression" {
        It "Should convert <expression> to <expected>" -TestCases @(
            @{expression = '42'; expected = @('42')}
            @{expression = '123+'; expected = @('123', '+')}
            @{expression = '99*34'; expected = @('99', '*', '34')}
        ) {
            param($expression, $expected)
            $tokenizer = [Tokenizer]::new()
        
            $result = $tokenizer.interpret($expression)
    
            for ($i = 0; $i -lt $result.Count; ++$i) {
                $result[$i] | Should be $expected[$i]
            }
            $result.Count | Should be $result.Count
        }
    }
{% endhighlight %}

Now back to checking/extending the behavior. Let's make sure our code handles white space, and more than one operator, multi-character operators, and even variables.

* Add a new test case:
{% highlight powershell %}
        @{expression = '1+2+3+4'; expected = @('1', '+', '2', '+', '3', '+', '4')}
{% endhighlight %}

* Run the tests, this seems to work fine. The while loop covers an expression as long as we need.

* Now let's make our code handle variables. Add another test case:
{% highlight powershell %}
        @{expression = 'a'; expected = @('a')}
{% endhighlight %}
I was initially surprised this worked, but that's the issue with regular expressions. They are often more flexible than you at first realize. The letters are not digits, which is how we are checking for digits versus operators. Knowing this, I'm going to change that test case to a multi-letter variable because I want to start with a broken test.
{% highlight powershell %}
        @{expression = 'foo+bar'; expected = @('foo', '+', 'bar')}
{% endhighlight %}

* This fails as I expected:
{% highlight powershell %}
    [-] Should convert foo+bar to foo = bar 88ms
      Expected string length 3 but was 1. Strings differ at index 1.
      Expected: {foo}
      But was:  {f}
      ------------^
      18:             $result[$i] | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 18
{% endhighlight %}

* Here's a quick fix to make this work:
{% highlight powershell %}
            if (-not $this.recordIfMatches([ref]$expression, '^([\d\w]+)', $result)) {
{% endhighlight %}

Note that the regular expression was simply \d+ and now it is [\d\w]+. This might seem too clever, too simple or maybe it seems like I'm cheating. In fact, if that's the case, then to "prove" I'm cheating, you want to find a test that will cause my code to break. However, I'm fine with that solution for now. If this were a real problem, I think I'd have a known list of operators and check for them explicitly. However, this is a simple example and so I'm OK with simple tests and simple solutions.

* What about a multi-character operator? Add a new test:
{% highlight powershell %}
        @{expression = '++foo'; expected = @('++', 'foo')}
{% endhighlight %}

* Run your tests, and this fails.
{% highlight powershell %}
    [-] Should convert ++foo to ++ foo 80ms
      Expected string length 2 but was 1. Strings differ at index 1.
      Expected: {++}
      But was:  {+}
      ------------^
      19:             $result[$i] | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 19
{% endhighlight %}

* Update the regular expression to fix this:
{% highlight powershell %}
                $this.recordIfMatches([ref]$expression, '^([^\d]+)', $result)
{% endhighlight %}

* When I run the tests, I find my confidence was too high:
{% highlight powershell %}
    [-] Should convert foo+bar to foo + bar 78ms
      Expected string length 1 but was 4. Strings differ at index 1.
      Expected: {+}
      But was:  {+bar}
      ------------^
      19:             $result[$i] | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 19
    [-] Should convert ++foo to ++ foo 76ms
      Expected string length 2 but was 5. Strings differ at index 2.
      Expected: {++}
      But was:  {++foo}
      -------------^
      19:             $result[$i] | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 19
{% endhighlight %}

* The second regular expression was originally the opposite of the first, but we added \w to the first, so we need to do the same for the second one:
{% highlight powershell %}
                $this.recordIfMatches([ref]$expression, '^([^\d\w]+)', $result)
{% endhighlight %}

That's a good lesson. I though it was simple, and it was, just not in the way I though. My tests allowed me to experiment, learn, adjust and make progress.

* Now is probably a good time to commit your changes.

Now let's handle white space. We can match white space much like we do everything else, or we could simply remove it. Regardless, a test will keep us obvious. I think this is going to be simple, so I'll start with a "big" test:
{% highlight powershell %}
        @{expression = '   foo  + -bar  = baz   '; expected = @('foo', '+', '-', 'bar', '=', 'baz')}
{% endhighlight %}

* Once again, my confidence has bitten me. I figured I could simply replace all of the white space:
{% highlight powershell %}
        $expression = $expression -replace('\s+','')
{% endhighlight %}
* Close, but no cigar:
{% highlight powershell %}
    [-] Should convert    foo  + -bar  = baz    to foo + - bar = baz 83ms
      Expected string length 1 but was 2. Strings differ at index 1.
      Expected: {+}
      But was:  {+-}
      ------------^
      20:             $result[$i] | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 20
{% endhighlight %}
* Here's a second attempt:
{% highlight powershell %}
        while ($expression.Length -ne 0) {
            $expression = $expression -replace ('^\s+', '')
            if (-not $this.recordIfMatches([ref]$expression, '^([\d\w]+)', $result)) {
                $this.recordIfMatches([ref]$expression, '^([^\d\w\s]+)', $result)
            }
        }
{% endhighlight %}

* There are three changes. First, the regular expression is in the while loop. Second, it only matches at the beginning of the string, third, the bottom regular expression is also excluding \s (white space characters). However, those changes results in passing tests:
{% highlight powershell %}
  Describing Tokenizing an in-fix expression
    [+] Should convert 42 to 42 577ms
    [+] Should convert 123+ to 123 + 84ms
    [+] Should convert 99*34 to 99 * 34 75ms
    [+] Should convert 1+2+3+4 to 1 + 2 + 3 + 4 22ms
    [+] Should convert a to a 13ms
    [+] Should convert foo+bar to foo + bar 14ms
    [+] Should convert ++foo to ++ foo 16ms
    [+] Should convert    foo  + -bar  = baz    to foo + - bar = baz 25ms
Tests completed in 829ms
Tests Passed: 8, Failed: 0, Skipped: 0, Pending: 0, Inconclusive: 0
{% endhighlight %}

This seems like enough progress on binary expressions. Next up, handling parenthesis.
[<— Back](PowerShell5.TokenizeExpression.FirstFailingTest)  [^^ Up ^^](PowerShell5.TokenizeExpression) [Next—>](PowerShell5.TokenizeExpression.FirstStabAtParentheses)
