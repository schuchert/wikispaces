# The Three Questions=
Brett taught several Smalltalk questions in the early 90's. From teaching the class, he came up with three questions, or rather, the three question categories. Nearly all questions in the Smalltalk class fell under three categories:
* What is it?
* How do you do it?
* Why is it that way?

What Brett would do when teaching Smalltalk was he'd point out near the beginning these three questions along with their answers. Then, when a student asked a question, he'd refer to the three questions, provide the generic answer and then delve deeper into the specifics of the questions.

This was a "demystifying the beast" technique. To many, Smalltalk's behavior was so alien that it seemed to be magic. These three questions helped people to realize that it was all just objects and methods. Here are the answers to each of the above questions:

| **Question** | **Answer** | **Follow Up** |
| **What it is?** | It's an object. | Everything in Smalltalk is an object. Even classes are instances of objects and have the ability to provide polymorphic responses on the class sides. What Smalltalk called "class methods" (static in C++/Java) were **actually** instance methods on the class objects. When you create a new class in Smalltalk, you actually create an instance of an object. Everything is an object. Even numbers behave like objects. |
| **How do you do it?** | Send it a message. | In Smalltalk, everything is object message. Message could be unary (no args), binary (two args, e.g. + ^ -) or keyword (one or more, using : as in aCollection inject: [] into: []. |
| **Why is it that way?** | Because it is written that way. | It is possible to review the source code for everything. Strictly speaking that is not possible. For example, you could look at ifTrue:[] ifFalse:[] on boolean, but in reality that source code was logical, such checks were compiled into something closer to the the processor. |

