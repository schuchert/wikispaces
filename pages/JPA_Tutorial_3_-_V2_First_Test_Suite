In this second version, we add the following features:
* We track when a book was checked out and when it is due
* We calculate fines when returning books
* We associate fines with patrons
* We allow the patron to pay for their fines
* We disallow patrons from checking out books when they have fines

Along the way, we make a lot of additions and changes. Based on the updated LibraryTest, here is a list of all the changes I made to get things to work (note if you choose to start from the test and make things work yourself, you results may vary):
**src/entity**
||Book||Now has an optional Loan object instead of a direct reference to a Patron.||
||Fine||New class, represents an individual fine generated from returning one book late. A Patron has zero to many of these.||
||Loan||New class, represents the information related to the **relationship** between Patron and Book. A Patron has a One to Many relationship with Loan while a book as a One to One that is optional (can be null).||
||LoanId||A key-class for the Loan class. The key is two columns, a foreign key to Patron and a foreign key to Book.||
||Patron||Now has a One to Many relationship with both Loan and Fines. It also has several new methods in support of those new/changed attributes.||

**src/exception**
||BookNotCheckedOut||New exception class. Thrown when trying to return a book that is not checked out.||
||InsufficientFunds||New exception class. Thrown when Patron tries to pay fines but does not tender enough cash.||
||PatronHasFines||New exception class. Thrown when Patron tries to check out a book but already has fines.||

**src/session**
||Library||Substantially changed in support of the new requirements.||
||LoanDao||New class. Provides some simple query support directly related to loan class.||

**src/util**
||DateTimeUtil||A new class. Provides some basic date/time utilities.||

**test/session**
||LibraryTest||Several new tests in support of new functionality.||

**test/util**
||DateTimeUtilTest||Several test in support of new utility class.||

### New Utility===
To calculate fines, we needed to determine the number of days late a Patron returned a Book. Here are the tests for that class:

**DateTimeUtilTest.java**
```java
package util;

import static org.junit.Assert.assertEquals;

import java.util.Calendar;
import java.util.Date;

import org.junit.Test;

/**
 * A class to test the DateTimeUtil class. Verifies that the calculation for the
 * number of days between to dates is correct for several different scenarios.
 */
public class DateTimeUtilTest {
    public static final Date DATE = Calendar.getInstance().getTime();

    @Test
    public void dateBetween0() {
        assertEquals(0, DateTimeUtil.daysBetween(DATE, DATE));
    }

    @Test
    public void dateBetween1() {
        assertEquals(1, DateTimeUtil.daysBetween(DATE, addDaysToDate(DATE, 1)));
    }

    @Test
    public void dateBetweenMinus1() {
        assertEquals(-1, DateTimeUtil
                .daysBetween(DATE, addDaysToDate(DATE, -1)));
    }

    @Test
    public void startInDstEndOutOfDst() {
        final Date inDst = createDate(2006, 9, 1);
        final Date outDst = createDate(2006, 10, 1);

        assertEquals(31, DateTimeUtil.daysBetween(inDst, outDst));
    }

    @Test
    public void startOutDstEndInDst() {
        final Date inDst = createDate(2006, 9, 1);
        final Date outDst = createDate(2006, 10, 1);

        assertEquals(-31, DateTimeUtil.daysBetween(outDst, inDst));
    }

    @Test
    public void overLeapDayNoChangeInDst() {
        final Date beforeLeapDay = createDate(2004, 1, 27);
        final Date afterLeapDay = createDate(2004, 2, 1);

        assertEquals(3, DateTimeUtil.daysBetween(beforeLeapDay, afterLeapDay));
    }

    @Test
    public void overLeapDayAndOverDstChange() {
        final Date beforeLeapDayNonDst = createDate(2004, 1, 27);
        final Date afterLeapDayAndDst = createDate(2004, 3, 5);

        assertEquals(38, DateTimeUtil.daysBetween(beforeLeapDayNonDst,
                afterLeapDayAndDst));
    }

    private Date addDaysToDate(final Date date, final int days) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DAY_OF_YEAR, days);
        return c.getTime();
    }

    private Date createDate(final int year, final int month, final int day) {
        final Calendar c = Calendar.getInstance();
        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, month);
        c.set(Calendar.DAY_OF_MONTH, day);

        return c.getTime();
    }
}
```

**DateTimeUtil**
```java
package util;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * This is a simple class containing date/time utilities to avoid proliferation
 * of duplicate code through the system.
 */
public class DateTimeUtil {
    private static final int MS_IN_HOUR = 1000 * 60 * 60;
    private static final int MS_IN_Day = 24 * MS_IN_HOUR;

    /**
     * This is a class with all static methods (often called a utility class).
     * To document the fact that it should be used without first being
     * instantiated, we make the constructor private. Furthermore, some code
     * evaluation tools, such as PMD, will complain about an empty method body,
     * so we add a comment in the method body to appease such tools.
     * 
     */
    private DateTimeUtil() {
        // I'm a utility class, do not instantiate me
    }

    /**
     * Remove all of the time elements from a date.
     */
    public static void removeTimeFrom(final Calendar c) {
        c.clear(Calendar.AM_PM);
        c.clear(Calendar.HOUR_OF_DAY);
        c.clear(Calendar.HOUR);
        c.clear(Calendar.MINUTE);
        c.clear(Calendar.SECOND);
        c.clear(Calendar.MILLISECOND);
    }

    /**
     * This is a simple algorithm to calculate the number of days between two
     * dates. It is not very accurate, does not take into consideration leap
     * years, etc. Do not use this in production code. It serves our purposes
     * here.
     * 
     * @param d1
     *            "from date"
     * @param d2
     *            "to date"
     * 
     * @return number of times "midnight" is crossed between these two dates,
     *         logically this is d2 - d1.
     */
    public static int daysBetween(final Date d1, final Date d2) {
        GregorianCalendar c1 = new GregorianCalendar();
        c1.setTime(d1);
        GregorianCalendar c2 = new GregorianCalendar();
        c2.setTime(d2);

        final long t1 = c1.getTimeInMillis();
        final long t2 = c2.getTimeInMillis();
        long diff = t2 - t1;

        final boolean startInDst = c1.getTimeZone().inDaylightTime(d1);
        final boolean endInDst = c2.getTimeZone().inDaylightTime(d2);

        if (startInDst && !endInDst) {
            diff -= MS_IN_HOUR;
        }
        if (!startInDst && endInDst) {
            diff += MS_IN_HOUR;
        }

        return (int) (diff / MS_IN_Day);
    }
}
```

### The Exceptions===
Here are the three new exception classes:
**BookNotCheckedOut**
```java
package exception;

/**
 * A simple unchecked exception reflecting a particular business rule violation.
 * A book cannot be checked out if it is already checked out.
 * 
 * This exception inherits from RuntimeException (or it is an unchecked
 * exception). Why? The policy of whether to use checked or unchecked exceptions
 * is project dependent. We are using this for learning about EJB3 and JPA and
 * NOT about how to write exceptions, so using one policy versus the other is
 * arbitrary for our purposes. Working with unchecked exceptions is a bit looser
 * but also keeps the code looking a bit cleaner, so we've gone with unchecked
 * exceptions.
 */
public class BookNotCheckedOut extends RuntimeException {
    private static final long serialVersionUID = 2286908621531520488L;

    final Long bookId;

    public BookNotCheckedOut(final Long bookId) {
        this.bookId = bookId;
    }

    public Long getBookId() {
        return bookId;
    }
}
```

**InsufficientFunds.java**
```java
package exception;

/**
 * Thrown when a Patron attempts to pay less that then total fines owed.
 */
public class InsufficientFunds extends RuntimeException {
    private static final long serialVersionUID = -735261730912439200L;
}
```

**PatronHasFines.java**
```java
package exception;

/**
 * Thrown when Patron attempts to checkout a book but has fines.
 */
public class PatronHasFines extends RuntimeException {
    private static final long serialVersionUID = 2868510410691634148L;

    double totalFines;

    public PatronHasFines(final double amount) {
        this.totalFines = amount;
    }

    public double getTotalFines() {
        return totalFines;
    }
}
```

### The Library Test===
Many of the original tests are different from the previous version. Additionally, there are many new tests. Here is the test. Once you get this in to your system, you might want to simply get all of the tests methods to compile and then get the tests to pass. 

Doing so is approaching formal TDD. It is different in a few important respects:
# You are given the tests rather than writing them yourself
# You are working on many tests at once rather than just one (or a **very** few) at a time

Even so, this suite of test fully express the new set of requirements for version 2.
```java
package session;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityNotFoundException;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import util.DateTimeUtil;
import entity.Address;
import entity.Author;
import entity.Book;
import entity.Name;
import entity.Patron;
import exception.BookAlreadyCheckedOut;
import exception.BookNotCheckedOut;
import exception.InsufficientFunds;
import exception.PatronHasFines;

public class LibraryTest extends EntityManagerBasedTest {
    private static final long ID_DNE = -443123222l;
    private static final String PATRON_ID = "113322";
    private static final String ISBN = "1-932394-15-X";
    private static Date CURRENT_DATE;
    private static Date CURRENT_PLUS_8;
    private static Date CURRENT_PLUS_14;
    private static Date CURRENT_PLUS_15;
    private Library library;

    @Before
    public void setupLibrary() {
        final BookDao bd = new BookDao();
        bd.setEm(getEm());
        final PatronDao pd = new PatronDao();
        pd.setEm(getEm());
        final LoanDao ld = new LoanDao();
        ld.setEm(getEm());
        library = new Library();
        library.setBookDao(bd);
        library.setPatronDao(pd);
        library.setLoanDao(ld);
    }

    @BeforeClass
    public static void setupDates() {
        Calendar c = Calendar.getInstance();
        DateTimeUtil.removeTimeFrom(c);
        CURRENT_DATE = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 8);
        CURRENT_PLUS_8 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 6);
        CURRENT_PLUS_14 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 1);
        CURRENT_PLUS_15 = c.getTime();
    }

    @Test
    public void addBook() {
        final Book b = createBook();
        Set<Author> authors = b.getAuthors();
        final Book found = library.findBookById(b.getId());

        assertTrue(found.getAuthors().containsAll(authors));
    }

    @Test(expected = EntityNotFoundException.class)
    public void lookupBookThatDoesNotExist() {
        library.findBookById(ID_DNE);
    }

    @Test
    public void addPatron() {
        final Patron p = createPatron();
        final Patron found = library.findPatronById(p.getId());
        assertNotNull(found);
    }

    @Test(expected = EntityNotFoundException.class)
    public void lookupPatronThatDoesNotExist() {
        library.findPatronById(ID_DNE);
    }

    @Test
    public void checkoutBook() {
        final Book b1 = createBook();
        final Book b2 = createBook();
        final Patron p = createPatron();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId(), b2.getId());

        final List<Book> list = library.listBooksOnLoanTo(p.getId());

        assertEquals(2, list.size());

        for (Book b : list) {
            assertTrue(b.isOnLoanTo(p));
            assertTrue(b.dueDateEquals(CURRENT_PLUS_14));
        }
    }

    @Test
    public void returnBook() {
        final Book b = createBook();
        final Patron p = createPatron();
        library.checkout(p.getId(), CURRENT_DATE, b.getId());

        final int booksBefore = p.getCheckedOutResources().size();
        assertTrue(b.isCheckedOut());
        library.returnBook(CURRENT_PLUS_8, b.getId());
        assertEquals(booksBefore - 1, p.getCheckedOutResources().size());
        assertFalse(b.isCheckedOut());
        assertEquals(0, p.getFines().size());
    }

    @Test
    public void returnBookLate() {
        final Book b = createBook();
        final Patron p = createPatron();

        library.checkout(p.getId(), CURRENT_DATE, b.getId());
        library.returnBook(CURRENT_PLUS_15, b.getId());

        assertEquals(1, p.getFines().size());
        assertEquals(.25, p.calculateTotalFines());
    }

    @Test(expected = BookNotCheckedOut.class)
    public void returnBookThatsNotCheckedOut() {
        final Book b = createBook();
        assertFalse(b.isCheckedOut());
        library.returnBook(CURRENT_PLUS_8, b.getId());
    }

    @Test(expected = BookAlreadyCheckedOut.class)
    public void checkoutBookThatIsAlreadyCheckedOut() {
        final Book b = createBook();
        final Patron p1 = createPatron();
        final Patron p2 = createPatron();

        library.checkout(p1.getId(), CURRENT_DATE, b.getId());
        library.checkout(p2.getId(), CURRENT_DATE, b.getId());
    }

    @Test(expected = EntityNotFoundException.class)
    public void checkoutBookThatDoesNotExist() {
        final Patron p = createPatron();
        library.checkout(p.getId(), CURRENT_DATE, ID_DNE);
    }

    @Test(expected = EntityNotFoundException.class)
    public void checkoutBookToPatronThatDoesNotExist() {
        final Book b = createBook();
        library.checkout(ID_DNE, CURRENT_DATE, b.getId());
    }

    @Test
    public void findOverdueBooks() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        final Book b2 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.checkout(p.getId(), CURRENT_PLUS_8, b2.getId());
        final List<Book> notOverdue = library
                .findAllOverdueBooks(CURRENT_PLUS_8);
        assertEquals(0, notOverdue.size());
        final List<Book> overdue = library.findAllOverdueBooks(CURRENT_PLUS_15);
        assertEquals(1, overdue.size());
        assertTrue(overdue.contains(b1));
    }

    @Test
    public void patronsWithOverdueBooks() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        final Book b2 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.checkout(p.getId(), CURRENT_PLUS_8, b2.getId());
        final List<Patron> noPatrons = library
                .findAllPatronsWithOverdueBooks(CURRENT_PLUS_14);
        assertEquals(0, noPatrons.size());
        final List<Patron> onePatron = library
                .findAllPatronsWithOverdueBooks(CURRENT_PLUS_15);
        assertEquals(1, onePatron.size());
    }

    @Test
    public void calculateTotalFinesForPatron() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        final Book b2 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.checkout(p.getId(), CURRENT_DATE, b2.getId());
        library.returnBook(CURRENT_PLUS_15, b1.getId(), b2.getId());
        assertEquals(.5, library.calculateTotalFinesFor(p.getId()));
    }

    @Test
    public void payFineExactAmount() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.returnBook(CURRENT_PLUS_15, b1.getId());
        double change = library.tenderFine(p.getId(), .25);
        assertEquals(0d, change);
        assertEquals(0, p.getFines().size());
    }

    @Test(expected = InsufficientFunds.class)
    public void payFineInsufficientFunds() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.returnBook(CURRENT_PLUS_15, b1.getId());
        library.tenderFine(p.getId(), .20);
    }

    /**
     * This is an example of a test where we expect an exception. However,
     * unlike other tests where we use expected=ExceptionClass.class, we need to
     * catch the exception because we are additionally verifying a value in the
     * thrown exception. This test is written how you'd write a test expecting
     * an exception prior to JUnit 4.
     */
    @Test
    public void patronCannotCheckoutWithFines() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.returnBook(CURRENT_PLUS_15, b1.getId());

        final Book b2 = createBook();

        try {
            library.checkout(p.getId(), CURRENT_DATE, b2.getId());
            fail(String.format("Should have thrown exception: %s",
                    PatronHasFines.class.getName()));
        } catch (PatronHasFines e) {
            assertEquals(.25, e.getTotalFines());
        }
    }

    private Book createBook() {
        final Author a1 = new Author(new Name("Christian", "Bauer"));
        final Author a2 = new Author(new Name("Gavin", "King"));

        return library.createBook("Hibernate In Action", ISBN, Calendar
                .getInstance().getTime(), a1, a2);
    }

    private Patron createPatron() {
        final Address a = new Address("5080 Spectrum Drive", "", "Dallas",
                "TX", "75001");
        return library.createPatron(PATRON_ID, "Brett", "Schuchert",
                "555-1212", a);
    }
}
```