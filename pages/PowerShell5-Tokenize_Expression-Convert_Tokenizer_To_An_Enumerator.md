---
title: PowerShell5-Tokenize_Expression-Convert_Tokenizer_To_An_Enumerator
---
[[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.FunctionCalls|<—Back]]  [[PowerShell5.TokenizeExpression|^^ Up ^^]]  [[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.FinalishVersion|Next—>]]
The Tokenizer converts a whole expression into an array of tokens. Now we'll convert it to an [[https://msdn.microsoft.com/en-us/library/system.collections.ienumerator(v=vs.110).aspx|Enumerator]].

We are going to convert this in place while maintaining the tests.

# Add Required Interfaces
* Add the interfaces to the class:
```powershell
class Tokenizer : IEnumerable, IEnumerator 
```
* Run your tests. They fail due to missing required methods.
* Add each of the following methods stubbed out to get our existing tests running again:
```powershell
    [IEnumerator]GetEnumerator() {
        return $this
    }
    
    [bool]MoveNext() {
        return $false
    }
    
    [Object]get_Current() {
        return $null
    }
    
    [void]Reset() {
    }
```
* Run your tests, they now should be back to passing.
Next, we'll add a new test that uses the Tokenizer as an iterator and get it passing.
* Add only the first test to keep this as simple as possible:
```powershell
    It "Should enummerate <expression> into <expected>" -TestCase @(
        @{expression = '42'; expected = @('42')}
    ) {
        param($expression, $expected)
        $tokenizer = [Tokenizer]::new($expression)

        for($i = 0; $i -lt $expected.Count; ++$i) {
            $tokenizer.MoveNext()
            $tokenizer.Current | Should be $expected[$i]
        }
        $tokenizer.MoveNext() | Should be $false
    } 
```
* Now write just enough of the interface method to get this test passing:
```powershell
    [String]$currentExpression
    Tokenizer($expression) {
        $this.currentExpression = $expression
    }

    [IEnumerator]GetEnumerator() {
        return $this
    }

    [bool]MoveNext() {
        return $false
    }

    [Object]get_Current() {
        return $this.currentExpression
    }

    [void]Reset() {
    }
```
There are a few things to note in this first version:
* We used a constructor in the new test that takes in the expression and stores it. Adding a constructor taking a single argument will make PowerShell remove the default no-argument constructor. To keep the tests passing, we add in an empty no-argument constructor as well as a one-agument constructor. We're migrating this code so this is an intermediate form. When we've finished converting this from its original form to an enumerator, it will no longer need the no-argument constructor.
* The property get_Current needs something to return. That's what $this.currentExpression is. It's assigned in the one-argument constructor. That's fine for now. As we add more tests, this will change.
* Run your tests, they should pass.
* Now, we copy the second test case and work on getting it to pass as well:
```powershell
    It "Should enummerate <expression> into <expected>" -TestCase @(
        @{expression = '42'; expected = @('42')}
        @{expression = '123+'; expected = @('123', '+')}
    ) {
```
* Run your tests, they fail:
```terminal
    [-] Should enummerate 123+ into 123 + 92ms
      Expected string length 3 but was 4. Strings differ at index 3.
      Expected: {123}
      But was:  {123+}
      --------------^
      37:             $tokenizer.Current | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 37
````
* Here are a few changes to make that work. Notice that some of this code is copied from the interpret method.
```powershell
    [String]$currentExpression
    [String]$currentToken

    [bool]MoveNext() {
        $this.currentToken = $null

        foreach ($r in [Tokenizer]::REGEX) {
            if($this.currentExpression -match $r) {
                $this.currentToken = $Matches[1]
                $this.currentExpression = $this.currentExpression.Substring($this.currentToken.Length)
                break
            }
        }
        return $this.currentExpression.Length -gt 0
    }

    [Object]get_Current() {
        return $this.currentToken
    }
```
* Run your tests, they should all pass.
* Add the next test:
```powershell
        @{expression = '99*34'; expected = @('99', '*', '34')}
```
* Run your tests, they all pass.
* Add all of the remaining tests:
```powershell
    It "Should enummerate <expression> into <expected>" -TestCase @(
        @{expression = '42'; expected = @('42')}
        @{expression = '123+'; expected = @('123', '+')}
        @{expression = '99*34'; expected = @('99', '*', '34')}
        @{expression = '1+2+3+4'; expected = @('1', '+', '2', '+', '3', '+', '4')}
        @{expression = 'a'; expected = @('a')}
        @{expression = 'foo+bar'; expected = @('foo', '+', 'bar')}
        @{expression = '++foo'; expected = @('++', 'foo')}
        @{expression = '   foo  + -bar  = baz   '; expected = @('foo', '+', '-', 'bar', '=', 'baz')}
        @{expression = '(a)'; expected = @('(', 'a', ')')}
        @{expression = '(())'; expected = @('(', '(', ')', ')')}
        @{expression = 'f(g(3))'; expected = @('f(', 'g(', '3', ')', ')')}
    ) {
        param($expression, $expected)
        $tokenizer = [Tokenizer]::new($expression)

        for($i = 0; $i -lt $expected.Count; ++$i) {
            $tokenizer.MoveNext()
            $tokenizer.Current | Should be $expected[$i]
        }
        $tokenizer.MoveNext() | Should be $false
    } 
```
* The only test failing deals with spaces in the expression:
```powershell
    [+] Should enummerate ++foo into ++ foo 15ms
    [-] Should enummerate    foo  + -bar  = baz    into foo + - bar = baz 84ms
      Expected string length 3 but was 0. Strings differ at index 0.
      Expected: {foo}
      But was:  {}
      -----------^
      46:             $tokenizer.Current | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 46
    [+] Should enummerate (a) into ( a ) 69ms
```
* Add the missing line into MoveNext (right before the foreach):
```powershell
        $this.currentExpression = $this.currentExpression -replace ('^\s+', '')
```
* Run your tests, and all tests pass.
* Now we can remove the first test and the original methods:
```powershell
    using module '.\Tokenizer.psm1'
    
    Describe "Tokenizing an in-fix expression" {
        It "Should enummerate <expression> into <expected>" -TestCase @(
            @{expression = '42'; expected = @('42')}
            @{expression = '123+'; expected = @('123', '+')}
            @{expression = '99*34'; expected = @('99', '*', '34')}
            @{expression = '1+2+3+4'; expected = @('1', '+', '2', '+', '3', '+', '4')}
            @{expression = 'a'; expected = @('a')}
            @{expression = 'foo+bar'; expected = @('foo', '+', 'bar')}
            @{expression = '++foo'; expected = @('++', 'foo')}
            @{expression = '   foo  + -bar  = baz   '; expected = @('foo', '+', '-', 'bar', '=', 'baz')}
            @{expression = '(a)'; expected = @('(', 'a', ')')}
            @{expression = '(())'; expected = @('(', '(', ')', ')')}
            @{expression = 'f(g(3))'; expected = @('f(', 'g(', '3', ')', ')')}
        ) {
            param($expression, $expected)
            $tokenizer = [Tokenizer]::new($expression)
    
            for($i = 0; $i -lt $expected.Count; ++$i) {
                $tokenizer.MoveNext()
                $tokenizer.Current | Should be $expected[$i]
            }
            $tokenizer.MoveNext() | Should be $false
        } 
    }
```
* Also, remove the old code from the Tokenizer:
```powershell
    using namespace System.Collections
    
    class Tokenizer : IEnumerable, IEnumerator {
        static $PARENTHESIS = '^([()])' 
        static $NUMBERS_WORDS_FUNCTIONS = '^([\d\w]+\({0,1})'
        static $OPERATORS = '^([^\d\w\s]+)'
        static [Array]$REGEX = @( [Tokenizer]::PARENTHESIS, [Tokenizer]::NUMBERS_WORDS_FUNCTIONS, [Tokenizer]::OPERATORS )
    
        [String]$currentExpression
        [String]$currentToken
    
        Tokenizer($expression) {
            $this.currentExpression = $expression
        }
    
        [IEnumerator]GetEnumerator() {
            return $this
        }
    
        [bool]MoveNext() {
            $this.currentToken = $null
    
            $this.currentExpression = $this.currentExpression -replace ('^\s+', '')
            foreach ($r in [Tokenizer]::REGEX) {
                if ($this.currentExpression -match $r) {
                    $this.currentToken = $Matches[1]
                    $this.currentExpression = $this.currentExpression.Substring($this.currentToken.Length)
                    break
                }
            }
            return $this.currentExpression.Length -gt 0
        }
    
        [Object]get_Current() {
            return $this.currentToken
        }
    
        [void]Reset() {
        }
    }
```
Notice that we have no tests for Reset? It is required to get the code to run but we don't use it in a test. Time to add a missing test and write its implementation.
* Add one final test:
```powershell
    It "Should be possible to go through the results after a reset" {
        $tokenizer = [Tokenizer]::new("42")
        $tokenizer.MoveNext()
        $tokenizer.Current | Should be "42"
        $tokenizer.Reset()
        $tokenizer.MoveNext()
        $tokenizer.Current | Should be "42"
    }
```
* Run the test, it fails:
```powershell
    [-] Should be possible to go through the results after a reset 81ms
      Expected string length 2 but was 0. Strings differ at index 0.
      Expected: {42}
      But was:  {}
      -----------^
      33:         $tokenizer.Current | Should be "42"
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 33
```
* Update Tokenizer to store the original expression in the constructor and implement the reset method.
```powershell
    [String]$currentExpression
    [String]$currentToken
    [String]$originalExpression

    Tokenizer($expression) {
        $this.originalExpression = $expression
        $this.Reset()
    }
# ...
    [void]Reset() {
        $this.currentExpression = $this.originalExpression
    }
``` 
* Run your tests, they all pass.

[[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.FunctionCalls|<—Back]]  [[PowerShell5.TokenizeExpression|^^ Up ^^]]  [[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.FinalishVersion|Next—>]]
