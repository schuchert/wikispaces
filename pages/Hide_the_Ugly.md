---
title: Hide_the_Ugly
---
Hide the Ugly is a way to think about design. First a definition for design:
> Design is the art of selecting the solution that sucks the least

Most of the time various designs, when compared to each other, have strengths and weaknesses. You goal, then, is to compare multiple designs and decide which design will have the fewest problems. One way to address this is to do as little work as possible and only in response to what you know. Another is to use your past experience and your understanding of the forces driving a system to introduce flexibility where you hope it will help.

In all cases, when we are introducing flexibility or just solving the problem of the moment, we'll come across parts of a solution that don't look good. The typical term for this is ["code smells"](http://en.wikipedia.org/wiki/Code_smell). Since I'm more visual, I think more in terms of looking for things that look inelegant, long, complex...ugly and hiding it or getting rid of it altogether.

Examples of hiding the ugly:
* You have a client-server system using object serialization and sockets. You notice that there are three different places where you deal with sockets, input object streams and output objects streams. Any one of these is not ugly, but three is (it's a typical code small). What do you do? You introduce a class that captures all of these uses of the socket, input object stream and output object stream and then you change all of the code to use this new class. This is an example of using indirection to solve the problem.
* In the same client-server system, you notice that one part of the system is growing longer and more complex. Specifically it has many if statements to check the "state" of the system. Eventually you realize that the "weight" of the if statements is weighing down the system. You rewrite the code to use the state pattern to clean in up. Again, this is a traditional code smell. I prefer visual metaphors over olfactory.