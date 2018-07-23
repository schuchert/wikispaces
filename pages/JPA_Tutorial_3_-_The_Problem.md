---
title: JPA_Tutorial_3_-_The_Problem
---
We want to implement a simple system to track books and eventually other resources for a library. This page covers the requirements for Version 1. The problem as stated is bigger than what this tutorial implements. Parts are left as exercises that are scheduled into a course or advanced exercises for students who finish their work early.

### Checking out a Book
**Description**
A Patron checks out one or more books, all of which are due 14 days later.

**Basic Course of Events**
# This use case begins when a Patron identifies him or herself by entering their Patron ID.
# The system verifies that the Patron exists and is in good standing.
# The system asks the Patron to enter the first resource.
# The patron provides the book identifier (each book has a unique identifier because the ISBN is not enough, we need to know WHICH version of Catcher int the Rye the Patron is checking out)
# The system records the book, calculates the due date and records the book as on loan to the Patron.
# The use case ends.

**Alternatives**
||**Num**||**Step**||**Description**||
||1||2||The Patron is not in good standing, they have overdue books. Do not allow them to check out any other books until they return all overdue books||
||2||2||The Patron is not in good standing, they have fines from overdue books they now paid. Do not allow them to check out any books until they pay their fines.||
||3||2||The Patron is not found (maybe their account was removed due to inactivity). Do not allow the to check out any books||
||4||5||The Book is not found, log the book and tell the Patron to ask for assistance with the particular book.||
||5||5||The Book is a reserve book and cannot be checked out. Inform the Patron.||
||6||5||The due date falls on a day when the Library is not open, move the return date to the next date the library is open.||

### Returning a Book
**Description**
A Patron returns a book. The library computes any fines and removes the recording of the loan of the book.

**Basic Course of Events**
# This use case begins when a Patron returns a book. The Patron identifies the book by providing the book identifier.
# The system retrieves the loan information for the book.
# The system updates the book as being returned and indicates success to the Patron.
# The patron indicates they are finished returning books.
# The system reports the total of any fines for the books returned as well as any pending fines.
# The system asks the user if they would like to pay their fines.
# The user indicates the do: **Initiate: Paying Fines**
# The use case ends.

**Alternatives**
||**Num**||**Step**||**Description**||
||1||2||The book is not on loan, inform the user.||
||2||3||The book is late, calculate a fine and inform the user of a fine.||
||3||5||The user owes no fines, the use case ends.||
||4||6||The user indicates they do not want to pay fines right now. The system informs them they will not be able to checkout books until all fines are paid and the use case ends.||

### Adding a Book
**Description**
A Librarian wishes to add a new book into the system.

**Basic Course of Events**
# The Librarian indicates they want to add a new Book.
# The system asks the Librarian to provide book information (Book Title, Authors, ISBN, replacement cost)
# The Librarian provides the book information.
# The system validates the information.
# The system creates a new book and assigns the book a unique identifier.
# The system indicates the unique identifier for the book (and prints a book label)
# The use case ends.

**Alternatives**
No alternatives listed for this use case.

### Removing a Book
**Description**
The Librarian wishes to take a book out of the system and make it no longer available for checkout.

**Basic Course of Events**
# The Librarian indicates they want to remove a book.
# The system asks the librarian for the book identifier.
# The Librarian provides the book identifier.
# The system validates the book identifier and book.
# The system removes the book from the system and indicates success.

**Alternatives**
||**Num**||**Step**||**Description**||
||1||3||The book identifier is not found. Indicate the error. The use case ends.||
||2||4||The book is on loan. Remove the loan (ignoring any fines). Indicate the error to the user but complete the use case normally.||
||3||4||This is the last book with the that particular ISBN. Ask the user to confirm the removal. If confirmed, complete the use case normally. If not confirmed, do not remove the book. Either way, the use case ends.||

### Adding a Patron
**Description**
A Librarian adds a new Patron into the system.

**Basic Course of Events**
# The Librarian indicates they wish to add a new Patron to the system.
# The system asks the Librarian to provide the Name (first, mi, last), Address (street 1, street 2, city, state, zip), and Phone number(area code + 7 digits).
# The system verifies the minimal information is provided.
# The system creates a new Patron and assigned a Patron ID.
# The system provides the new Patron ID back to the Librarian (and prints a card).
# The use case ends.

**Alternatives**
||**Num**||**Step**||**Description**||
||1||3||Some required information is missing. Indicate the required information and ask the Librarian to perform it. Continue back at step 2.||

### Removing a Patron
**Description**
The Librarian wants to remove a Patron.

**Basic Course of Events**
# The Librarian indicates they want to remove a Patron.
# The system asks for the Patron's id.
# The Librarian provides the id.
# The system validates the id.
# The system removes the Patron from the system.

**Alternatives**
||**Num**||**Step**||**Description**||
||1||3||The id is not found. Indicate the error to the user and continue at step 2||
||2||3||The Patron has outstanding fines. Indicate this to the Librarian and ask to confirm the removal. If confirmed, remove and complete the use case normally. If not confirmed, end the use case without removing the Patron.||
||3||3||The Patron has outstanding loans. Indicate this to the Librarian and do not allow removal.||

### Paying Fines
**Description**
A Patron wishes to pay fines. Note that this use case can be invoked by itself or called from other use cases.

**Basic Course of Events**
# A Patron is identified and their fines calculated.
# The system asks for the amount tendered.
# The system determines the difference and indicates the difference to the user.
# The use case ends.

**Alternatives**
||**Num**||**Step**||**Description**||
||1||1||The identified Patron has no fines. Indicate this to the user and the use case ends.||
||2||4||If there is still a balance, the system asks if it should ask for additional reimbursements. If yes, they go back to step 2, otherwise the use case ends.||

### Record a Book as Unrecoverable
**Description**
A book is not going to be returned/recovered. Add a fine if the book is on loan.

**Basic Course of Events**
# This use case begins when a book is going to indicated as not returnable.
# The system asks the user to provide the book id and a reason.
# The user provides the id and reason.
# The system retrieves the book.
# The system calculates the replacement cost assigns it to the Patron who has it checked out.
# The book is removed from the system.

**Alternatives**
||**Num**||**Step**||**Description**||
||1||3||The book id is not known. Retrieve a list of books checked out to a Patron, select from the list and continue to step 3.||
||2||3||The book id is not known. Provide the isbn. Select the user who has the book checked out and select the book by id. Continue at step 3.||
||3||3||The book id is not known. Provide the title. Select the user who has the book checked out and select the book by id. Continue at step 3.||
||4||5||The book is not checked out, do not calculate any fines.||
### Reviewing all Checkouts for a Patron
**Description**
Report all of the books currently checked out by a Patron. Provide the title, isbn and due date. Sort by due date, with the book due the soonest at the beginning. If the user has an outstanding balance, indicate that as well.

### Reviewing all Fines for all Patrons
Present a list of all the patrons with fines. Sort by the last name followed by the first name. Provide the name of the user, their phone number and their total balance.
