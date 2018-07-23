---
title: PowerShell5.GettingSetUp
---
[<--Back]({{ site.pagesurl}}/PowerShell5)

# Overview
For this point forward, we assume you have a working environment. To verify this, here is a a quick [smoke test](https://en.wikipedia.org/wiki/Smoke_testing_(software)) of your environment to make sure things work well enough to proceed. After this, we'll look at implementing an algorithm to practice the [TDD](https://en.wikipedia.org/wiki/Test-driven_development) cycle. Finally, we'll dig into a larger problem to look into [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming) and [Design Patterns](https://en.wikipedia.org/wiki/Software_design_pattern).
# Primordial Beginnings
A good start is to verify that you can run tests, they fail, and you can make them pass. So to get started, open up an instance of PowerShell and try the following:
* Create a directory to store your work, I'll use C:\Users\Brett:
```powershell
    PS C:\Users\Brett> mkdir pester_take1
```
* And the result
```powershell
        Directory: C:\Users\Brett
    Mode                LastWriteTime         Length Name
    ----                -------------         ------ ----
    d-----        9/25/2017   9:50 PM                pester_take1
```
* Switch to that directory to do all of the remaining work in this example:
```powershell
    PS C:\Users\Brett> cd .\pester_take1\
```
* Next, check that Pester is properly installed and you can run it in the shell:
* ```powershell
    PS C:\Users\Brett\pester_take1> invoke-pester
```
* The expected result:
```powershell
    Executing all tests in '.'
    Tests completed in 0ms
    Tests Passed: 0, Failed: 0, Skipped: 0, Pending: 0, Inconclusive: 0
```
This tells me that we can run Pester from the shell. We will look at a few more ways to run tests, but this is enough to get started.

# First Failing Test
A good practice is to make sure tests fail before they pass. This makes it easy to verify that your tests are running. 

* Use your favorite editor (vim for me), and create the following file called Trivial.Tests.ps1:
```powershell
    Describe "Trivial Tests" {
      It "Should know how to sort an array of size 1" {
        $arr = @()
    
        $arr.Count | Should Be 1
      }
    }
```
* This should fail because the size of the array is 0. To be sure, try running it in the shell:
```powershell
    PS C:\Users\Brett\pester_take1> invoke-pester
    Executing all tests in '.'
    
    Executing script C:\Users\Brett\pester_take1\Trivial.Tests.ps1
    
      Describing Trivial Tests
        [-] Should know how to sort an array of size 1 442ms
          Expected: {1}
          But was:  {0}
          5:     $arr.Count | Should Be 1
          at Invoke-LegacyAssertion, C:\Program Files\WindowsPowerShell\Modules\Pester\4.0.8\Functions\Assertions\Should.ps1
    : line 190
          at <ScriptBlock>, C:\Users\Brett\pester_take1\Trivial.Tests.ps1: line 5
    Tests completed in 442ms
    Tests Passed: 0, Failed: 1, Skipped: 0, Pending: 0, Inconclusive: 0
```
* To make this test pass, we either change the value or the array. I'll update the array:
```powershell
    Describe "Trivial Tests" {
      It "Should know how to sort an array of size 1" {
        $arr = @('Hello, World!')
    
        $arr.Count | Should Be 1
      }
    }
```
* And again, run the tests to see if things are any better:
```powershell
    PS C:\Users\Brett\pester_take1> invoke-pester
    Executing all tests in '.'
    
    Executing script C:\Users\Brett\pester_take1\Trivial.Tests.ps1
    
      Describing Trivial Tests
        [+] Should know how to sort an array of size 1 54ms
    Tests completed in 54ms
    Tests Passed: 1, Failed: 0, Skipped: 0, Pending: 0, Inconclusive: 0
```

Congratulations, you've got a working system. Rather than spend more time on this trivial example, we'll move on to a more complex problem.
[<--Back]({{ site.pagesurl}}/PowerShell5)
