### Patrons with Overdue Books
A Patron cannot checkout a book if they have any outstanding fines. Can they checkout a book if they have overdue books?

Write a test to determine if they can or cannot. If they can, update the system somehow to make it impossible to checkout books if the Patron has overdue books.

### Paying Fines
Right now, a Patron can only pay fines if they tender at least as much as their total fines. Allow a Patron to pay partial fines. Paying from the oldest to the newest fine, remove as many complete fines. Once they no longer have enough money to pay a fine fully, calculate the balance due and leave all the remaining fines associated with a Patron.

Write the following tests to support your new functionality:
* Pay all of a Patron's fines in 2 steps with exact change.
* Pay all of a Patron's fines in 2 steps with more than the required amount.
* Pay part of a Patron's fines and then verify that they still cannot checkout books. Then pay the rest of the fines and verify that they can checkout books.

### Updated UI/Add a UI
Consider adding a user interface (or updating the one you've already created). Support the new functionality of paying fines, listing fines, listing overdue books, listing patrons with overdue books, etc.

Your user interface will need to handle the exceptions that might be thrown by the system (or you could just make sure to not do anything wrong).

### Advanced: Inheritance
What happens if you create a new kind of resource, say a DVD. Now a patron can checkout a book or a DVD. Provide support for this functionality.

Note: this will take some time and we'll be looking at this kind of functionality later, so only attempt this assignment if you have a good amount of time.