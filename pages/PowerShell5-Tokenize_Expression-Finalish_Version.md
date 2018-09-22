---
title: PowerShell5-Tokenize_Expression-Finalish_Version
---
{% include nav prev="http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.ConvertTokenizerToAnEnumerator" up="PowerShell5.TokenizeExpression" %}

## Final-ish Version

After the adding support for functions, I figured that was enough. However, once I looked at the final version, I found one thing worth cleaning up. The regular expressions are a bit confusing, but I'm OK with them. However, giving them names would clean up the code a touch for the next person (probably me) that had to support it. Here's a quick refactoring of that:
{% highlight powershell %}
    static $PARENTHESIS ='^([()])' 
    static $NUMBERS_WORDS_FUNCTIONS = '^([\d\w]+\({0,1})'
    static $OPERATORS = '^([^\d\w\s]+)'
    static [Array]$REGEX = @( [Tokenizer]::PARENTHESIS, [Tokenizer]::NUMBERS_WORDS_FUNCTIONS, [Tokenizer]::OPERATORS )
{% endhighlight %}

After that, I decided to migrate the example to an Enumerator. This is that version.

Here are the most-recent final versions of these two files.
## Tokenizer.Tests.ps1
{% highlight powershell %}
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

    It "Should be possible to go through the results after a reset" {
        $tokenizer = [Tokenizer]::new("42")
        $tokenizer.MoveNext()
        $tokenizer.Current | Should be "42"
        $tokenizer.Reset()
        $tokenizer.MoveNext()
        $tokenizer.Current | Should be "42"
    }
}
{% endhighlight %}

## Tokenizer.psm1
{% highlight powershell %}
using namespace System.Collections

class Tokenizer : IEnumerable, IEnumerator {
    static $PARENTHESIS = '^([()])' 
    static $NUMBERS_WORDS_FUNCTIONS = '^([\d\w]+\({0,1})'
    static $OPERATORS = '^([^\d\w\s]+)'
    static [Array]$REGEX = @( [Tokenizer]::PARENTHESIS, [Tokenizer]::NUMBERS_WORDS_FUNCTIONS, [Tokenizer]::OPERATORS )

    [String]$currentExpression
    [String]$currentToken
    [String]$originalExpression

    Tokenizer($expression) {
        $this.originalExpression = $expression
        $this.Reset()
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
        $this.currentExpression = $this.originalExpression
    }
}
{% endhighlight %}
{% include nav prev="http://schuchert.wikispaces.com/PowerShell5.TokenizeExpression.ConvertTokenizerToAnEnumerator" up="PowerShell5.TokenizeExpression" %}
