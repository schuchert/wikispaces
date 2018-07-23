---
title: ruby.sidebar.WhatASillyImplementation
---
<span class="sidebar_title"> What a silly implementation!</span>
What about the hard-coded return value? Why not just write the code now, it's clear what needs to be done. This is an issue of balancing what you know and the risk that what you know is incorrect.

In this case, you could probably guess where this is going. However, as I write the tutorial, this is literally the first time I've worked on this part of this problem, so while I think I know what's going to happen, I'm really not sure. And even if I know the next step, I am not too sure about 2, 3 or more steps ahead.

A general answer to this complaint is that rather than writing what you know the solution should be, write an Example that will force/allow you to write the code you know should be there.

The primary danger of jumping ahead is writing too much production code. That code may not be well covered by your Examples, so you'll essentially have unvalidated code. In addition, you could write more than is necessary. If you do that, the next person to read the code might wonder why there's more code than the necessary. You might be that next person, by the way.
 