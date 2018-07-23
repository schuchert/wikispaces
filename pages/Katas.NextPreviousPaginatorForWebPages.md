---
title: Katas.NextPreviousPaginatorForWebPages
---
On July 24th I attended the [[http://openbeta.extendedbeta.com/barcamp.html|Barcamp at the OkC Coco]]. I met several people from [[http://ninecollective.com/|ninecollective]] (great logo). We merged their idea of a C# dojo and mine of a TDD clinic and decided to do a Dojo. [[http://twitter.com/rauhr|Ryan Rauk (twitter: @rahur)]] recommended we create a simple paginator for scrolling through a large list of items.

Here's an example: Imagine you have 1000 items to list, 10 items per page. If you are on the 20th page, you should see links like the following for next and previous:
```
< 18 19 20 21 22 >
```

So the inputs are the total number of items, number of items per page and the current page number. That's what we started with. It turns out there's a lot to this problem, but this should be enough to get you started. I'll be working on this a bit, because several interesting ideas arrise:
* What are the inputs/outputs
* What is the responsibility of the paginator, does it return just numbers or links?
* What should the output look like? We started with an array of strings, but I prefer to wrap collections by default, so how does this pan out?
* We violated one check (assertion) per test. While we did not change our interface, we would have been in better shape to refactor the interface.

In any case, it's a simple but rich problem.