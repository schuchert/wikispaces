---
title: PowerShell5-Tokenize_Expression-First_Stab_At_Parentheses
---
[[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.SimpleBinaryExpressions|<— Back]]  [[PowerShell5.TokenizeExpression|^^ Up ^^]] [[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.FunctionCalls|Next—>]]
There are two ways in which our tokenizer might encounter parenthesis. The first is to group a lower-precedence operator, as in:
* (3 + 4) * 6
^
The next is in the use of function calls.:
* f(4)

For now, we want to pull out the () as tokens. We'll allow something at a higher level to determine the context.
* Create a first test to see what happens when we use (:
```powershell
        @{expression = '(a)'; expected = @('(', 'a', ')')}
```
* Interesting, this works. I'm skeptical that we've got it working as needed. Knowing a little bit about the code, I'll add another test:
```powershell
        @{expression = '(())'; expected = @('(', '(',')', ')')}
```
* There's the failure I'm expecting:
```powershell
    [-] Should convert (()) to ( ( ) ) 102ms
      Expected string length 1 but was 4. Strings differ at index 1.
      Expected: {(}
      But was:  {(())}
      ------------^
      22:             $result[$i] | Should be $expected[$i]
      at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1: line 190
      at <ScriptBlock>, C:\Users\Brett\src\shunting_yard_powershell_3\Tokenizer.Tests.ps1: line 22
```
* Now it's time to update the code just a touch. Rather than changing how to handle operators, I'll add another match:
```powershell
            if (-not $this.recordIfMatches([ref]$expression, '^([()])', $result)) {
                    if (-not $this.recordIfMatches([ref]$expression, '^([\d\w]+)', $result)) {
                        $this.recordIfMatches([ref]$expression, '^([^\d\w\s]+)', $result)
                    }
                }
            }
```
* Run your tests, that seems to work. 
* Now is a good time to commit your code.
After this, it seemed like there was a pattern in the code that I could represent with an array and a loop. Here's another version that also works. I'm not sure if I like this better or not.
```powershell
    static [Array]$regex = @( '^([()])', '^([\d\w]+)', '^([^\d\w\s]+)' )
    [ArrayList]interpret([String]$expression) {
        $result = [ArrayList]::new()

        while ($expression.Length -ne 0) {
            $expression = $expression -replace ('^\s+', '')
            foreach ($r in [Tokenizer]::regex) {
                if ($this.recordIfMatches([ref]$expression, $r, $result)) {
                    break
                }
            }
        }

        return $result
    }
```
[[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.SimpleBinaryExpressions|<— Back]]  [[PowerShell5.TokenizeExpression|^^ Up ^^]] [[http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.FunctionCalls|Next—>]]
