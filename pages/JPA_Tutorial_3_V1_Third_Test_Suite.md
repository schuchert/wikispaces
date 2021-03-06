---
title: JPA_Tutorial_3_V1_Third_Test_Suite
---
Typical enterprise systems are build on a multi-tiered system. There are usually at least three tiers:
* Presentation
* Business
* Integration

There might be a few more, but for now this list of tiers will suite us well.

Our first two tests produced Data Access Objects ([dao](http://java.sun.com/blueprints/corej2eepatterns/Patterns/DataAccessObject.html))'s. These two dao's hide the details of getting books and patrons. They fall under the integration layer.

Now it is time to add a higher-level concept, the Library. The Library class represents a [Facade](http://en.wikipedia.org/wiki/Fa%C3%A7ade_pattern) to the underlying system. This so-called facade will be the primary interface to the middle tier of our system. 

Of course, along the way we'll end up doing yet more refactoring to accommodate this new suite of tests.

### Library
First we'll start with a new suite of tests for this Library facade. For this first pass, we'll write several basic tests and a few tests that move us closer to use-case like functionality.

### Adding a Book
{% highlight java %}
    @Test
    public void addBook() {
        final Book b = createBook();
        Set<Author> authors = b.getAuthors();
        final Book found = library.findBookById(b.getId());

        assertTrue(found.getAuthors().containsAll(authors));
    }

    private Book createBook() {
        final Author a1 = new Author(new Name("Christian", "Bauer"));
        final Author a2 = new Author(new Name("Gavin", "King"));

        return library.createBook("Hibernate In Action", ISBN, Calendar
                .getInstance().getTime(), a1, a2);
    }
{% endhighlight %}

### Lookup a Book that Does Not Exist
Notice that this test has different results than the same test in the BookDaoTest. In this case we expect an exception to be thrown while in the case of the BookDaoTest we just get back null. Why? The dao has no way of knowing what the policy should be regarding not finding objects, whereas the Library facade can set the policy.
{% highlight java %}
    @Test(expected = EntityNotFoundException.class)
    public void lookupBookThatDoesNotExist() {
        library.findBookById(ID_DNE);
    }
{% endhighlight %}

### Adding a Patron
{% highlight java %}
    @Test
    public void addPatron() {
        final Patron p = createPatron();
        final Patron found = library.findPatronById(p.getId());
        assertNotNull(found);
    }

    private Patron createPatron() {
        final Address a = new Address("5080 Spectrum Drive", "", "Dallas",
                "TX", "75001");
        return library.createPatron(PATRON_ID, "Brett", "Schuchert",
                "555-1212", a);
    }
{% endhighlight %}

### Lookup a Patron that Does Not Exist
As with the BookDao, the PatronDao simply returns null if an object is not found by ID. The Library changes that null result into an exception.
{% highlight java %}
    @Test(expected = EntityNotFoundException.class)
    public void lookupPatronThatdoesNotExist() {
        library.findPatronById(ID_DNE);
    }
{% endhighlight %}

### Checking out a book to a patron
{% highlight java %}
    @Test
    public void checkoutBook() {
        final Book b = createBook();
        final Patron p = createPatron();
        library.checkout(p.getId(), b.getId());

        final Book foundBook = library.findBookById(b.getId());
        final Patron foundPatron = library.findPatronById(p.getId());

        assertTrue(foundBook.isOnLoanTo(foundPatron));
        assertTrue(foundPatron.isBorrowing(foundBook));
    }
{% endhighlight %}

### Returning a book
{% highlight java %}
    @Test
    public void returnBook() {
        final Book b = createBook();
        final Patron p = createPatron();
        library.checkout(p.getId(), b.getId());

        final int booksBefore = p.getBorrowedBooks().size();
        assertTrue(b.isOnLoan());
        library.returnBook(b.getId());
        assertEquals(booksBefore - 1, p.getBorrowedBooks().size());
        assertFalse(b.isOnLoan());
    }
{% endhighlight %}

### Returning a book that is not checked out
{% highlight java %}
    @Test
    public void returnBookThatsNotCheckedOut() {
        final Book b = createBook();
        assertFalse(b.isOnLoan());
        library.returnBook(b.getId());
        assertFalse(b.isOnLoan());
    }
{% endhighlight %}

### Checking out a Book that is Already Checked Out
{% highlight java %}
    @Test(expected = BookAlreadyCheckedOut.class)
    public void checkoutBookThatIsAlreadyCheckedOut() {
        final Book b = createBook();
        final Patron p1 = createPatron();
        final Patron p2 = createPatron();

        library.checkout(p1.getId(), b.getId());
        library.checkout(p2.getId(), b.getId());
    }
{% endhighlight %}

### Checkout a Book that Does Not Exist
{% highlight java %}
    @Test(expected = EntityNotFoundException.class)
    public void checkoutBookThatDoesNotExist() {
        final Patron p = createPatron();
        library.checkout(p.getId(), ID_DNE);
    }
{% endhighlight %}

### Checkout a Book to a Patron that Does Not Exist
{% highlight java %}
    @Test(expected = EntityNotFoundException.class)
    public void checkoutBookToPatronThatDoesNotExist() {
        final Book b = createBook();
        library.checkout(ID_DNE, b.getId());
    }
{% endhighlight %}

### LibraryTest.java
Here's the shell of the test.

{% highlight java %}
package session;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Calendar;
import java.util.Set;

import javax.persistence.EntityNotFoundException;

import org.junit.Before;
import org.junit.Test;

import entity.Address;
import entity.Author;
import entity.Book;
import entity.Name;
import entity.Patron;
import exception.BookAlreadyCheckedOut;

public class LibraryTest extends EntityManagerBasedTest {
    private static final long ID_DNE = -443123222l;
    private static final String PATRON_ID = "113322";
    private static final String ISBN = "1-932394-15-X";
    private Library library;

    @Before
    public void setupLibrary() {
        final BookDao bd = new BookDao();
        bd.setEm(getEm());
        final PatronDao pd = new PatronDao();
        pd.setEm(getEm());
        library = new Library();
        library.setBookDao(bd);
        library.setPatronDao(pd);
    }
}

{% endhighlight %}

### EntityManagerBasedTest
This new class inherits from a new base class called EnttyManagerBasedTest. This class factors out just the part of initialization related to the entity manager and the transactions from the BaseDbDaoTest.

{% highlight java %}
package session;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;

/**
 * Our tests use an entity manager. The first pass at the BaseDbDaoTest forced
 * initialization of a Dao. That works for the dao-based tests but not all
 * tests. This class factors out just the part that sets up and cleans up the
 * entity manager.
 * 
 */
public abstract class EntityManagerBasedTest {
    private EntityManagerFactory emf;
    private EntityManager em;

    /**
     * Once before the tests start running for a given class, init the logger
     * with a basic configuration and set the default reporting layer to error
     * for all classes whose package starts with org.
     */
    @BeforeClass
    public static void initLogger() {
        // Produce minimal output.
        BasicConfigurator.configure();

        // Comment this line to see a lot of initialization
        // status logging.
        Logger.getLogger("org").setLevel(Level.ERROR);
    }

    /**
     * Before each test method, look up the entity manager factory, then create
     * the entity manager.
     */
    @Before
    public void initEmfAndEm() {
        emf = Persistence.createEntityManagerFactory("lis");
        em = emf.createEntityManager();
        em.getTransaction().begin();
    }

    /**
     * After each test method, roll back the transaction started in the -at-
     * Before method then close both the entity manager and entity manager
     * factory.
     */
    @After
    public void closeEmAndEmf() {
        getEm().getTransaction().rollback();
        getEm().close();
        emf.close();
    }

    public EntityManager getEm() {
        return em;
    }

    public void setEm(EntityManager em) {
        this.em = em;
    }
}
{% endhighlight %}

### BaseDbDaoTest
Here is yet another updated BaseDbDaoTest that reflects the new base class.
{% highlight java %}
package session;

import org.junit.Before;

/**
 * A base class for tests that handles logger initialization, entity manager
 * factory and entity manager creation, associating an entity manager with a
 * dao, starting and rolling back transactions.
 */
public abstract class BaseDbDaoTest extends EntityManagerBasedTest {
    /**
     * Derived class is responsible for instantiating the dao. This method gives
     * the hook necessary to this base class to init the dao with an entity
     * manger in a per-test setup method.
     * 
     * @return The dao to be used for a given test. The type specified is a base
     *         class from which all dao's inherit. The test derived class will
     *         override this method and change the return type to the type of
     *         dao it uses. This is called **covariance**. Java 5 allows
     *         covariant return types. I.e. BookDaoTest's version of getDao()
     *         will return BookDao while PatronDao's version of getDao() will
     *         return Patron.
     */
    public abstract BaseDao getDao();

    /**
     * The -at- before method in the base class executes first. After that, init
     * the dao with the entity manager.
     */
    @Before
    public void initDao() {
        getDao().setEm(getEm());
    }
}
{% endhighlight %}

### The Exception
We've added one new unchecked exception to our system, BookAlreadyCheckedOut. Here it is:
{% highlight java %}
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
public class BookAlreadyCheckedOut extends RuntimeException {
    private static final long serialVersionUID = 2286908621531520488L;

    final Long bookId;

    public BookAlreadyCheckedOut(final Long bookId) {
        this.bookId = bookId;
    }

    public Long getBookId() {
        return bookId;
    }
}
{% endhighlight %}

### Library
This class is all new.
{% highlight java %}
package session;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import entity.Address;
import entity.Author;
import entity.Book;
import entity.Patron;
import exception.BookAlreadyCheckedOut;

public class Library {
    private BookDao bookDao;
    private PatronDao patronDao;

    public BookDao getBookDao() {
        return bookDao;
    }

    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }

    public PatronDao getPatronDao() {
        return patronDao;
    }

    public void setPatronDao(PatronDao patronDao) {
        this.patronDao = patronDao;
    }

    public Book createBook(final String title, final String isbn,
            final Date date, final Author a1, final Author a2) {
        return getBookDao().create(title, isbn, date, a1, a2);
    }

    public List<Book> findBookByIsbn(String isbn) {
        return getBookDao().findByIsbn(isbn);
    }

    public Patron createPatron(final String patronId, final String fname,
            final String lname, final String phoneNumber, final Address a) {
        return getPatronDao().createPatron(fname, lname, phoneNumber, a);
    }

    public Patron findPatronById(final Long id) {
        final Patron p =  getPatronDao().retrieve(id);
       if(p == null) {
           throw new EntityNotFoundException(
               String.format("Patron with id: %d does not exist", id));
       }
        return p;
    }

    public void checkout(final Long patronId, final Long bookId) {
        final Book b = findBookById(bookId);
        if(b.isOnLoan()) {
            throw new BookAlreadyCheckedOut(bookId);
        }
        
        final Patron p = findPatronById(patronId);

        p.addBook(b);
        b.setBorrowedBy(p);

        getPatronDao().update(p);
    }

    public Book findBookById(Long id) {
        final Book b = getBookDao().findById(id);
        if(b == null) {
            throw new EntityNotFoundException(
                String.format("Book with Id:%d does not exist", id));
        }
        return b;
    }

    public void returnBook(Long id) {
        final Book b = getBookDao().findById(id);

        if (b.isOnLoan()) {
            final Patron p = b.checkin();
            p.removeBook(b);
            getPatronDao().update(p);
        }
    }
}
{% endhighlight %}

### BookDao
The tests use the findByIsbn() method, which returns a collection of Books. Why does findByIsbn() return a collection of books? The isbn is not unique; the book id is the only unique column. If we enforced a unique isbn, then there could only be one book of a given isbn in the library.

We've also added a method, findById, which should return a unique value (or null).
{% highlight java %}
    @SuppressWarnings("unchecked")
    public List<Book> findByIsbn(String isbn) {
        return getEm().createNamedQuery("Book.findByIsbn").setParameter("isbn",
                isbn).getResultList();
    }

    public Book findById(Long id) {
        return getEm().find(Book.class, id);
    }
{% endhighlight %}

### Util
We need a basic utility to assist with equality. This utility will handle when we have null references.

### EqualsUtil
{% highlight java %}
package util;

/**
 * We typically need to compare two object and also perform null checking. This
 * class provides a simple wrapper to accomplish doing so.
 */

public class EqualsUtil {
    private EqualsUtil() {
        // I'm a utility class, do not instantiate me
    }

    public static boolean equals(final Object lhs, final Object rhs) {
        return lhs == null && rhs == null
                || (lhs != null && rhs != null && lhs.equals(rhs));

    }
}
{% endhighlight %}

### EqualsUtilTest
{% highlight java %}
package util;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class EqualsUtilTest {
    private static final String BRETT = "Brett";

    @Test
    public void bothNull() {
        assertTrue(EqualsUtil.equals(null, null));
    }

    @Test
    public void bothNonNullAndEqual() {
        assertTrue(EqualsUtil.equals(BRETT, BRETT));
    }

    @Test
    public void bothNonNullAndNotEquals() {
        assertFalse(EqualsUtil.equals(BRETT, BRETT.toLowerCase()));
    }

    @Test
    public void lhsNullRhsNonNull() {
        assertFalse(EqualsUtil.equals(null, BRETT));
    }

    @Test
    public void lhsNonNullRhsNull() {
        assertFalse(EqualsUtil.equals(BRETT, null));
    }
}
{% endhighlight %}

### Entity Changes

### Book
The book is somewhat changed. First it needs to **import util.EqualsUtil** (as shown below). It also contains some named queries and three new methods: isOnLoanTo, isOnLoan and checkin. The code below shows these changes.

{% highlight java %}

import util.EqualsUtil;

/**
 * I represent a Book. I have one named query to find a book by its isbn number.
 * I also have a many to many relationship with author. Since I define the
 * mappedBy, I'm the (arbitrarily picked) master of the relationship. I also
 * take care of cascading changes to the database.
 */

@Entity
/**
 * A named query must have a globally unique name. That is why these are named
 * "Book."... These queries could be associated with any entity. Given that they
 * clearly deal with books, it seems appropriate to put them here. These will
 * probably be pre-compiled and in any case available from the entity manager by
 * using em.getNamedQuery("Book.findById").
 */
@NamedQueries( {
        @NamedQuery(name = "Book.findById", 
                    query = "SELECT b FROM Book b where b.id = :id"),
        @NamedQuery(name = "Book.findByIsbn", 
                    query = "SELECT b FROM Book b WHERE b.isbn = :isbn") })
public class Book {
    public boolean isOnLoanTo(final Patron foundPatron) {
        return EqualsUtil.equals(getBorrowedBy(), foundPatron);
    }

    public boolean isOnLoan() {
        return getBorrowedBy() != null;
    }

    public Patron checkin() {
        final Patron p = getBorrowedBy();
        setBorrowedBy(null);
        return p;
    }
}
{% endhighlight %}

### Patron
There was only one change to Patron. We want to be able to ask the Patron if it is in fact borrowing a particular book.
{% highlight java %}
    public boolean isBorrowing(final Book foundBook) {
        return getBorrowedBooks().contains(foundBook);
    }
{% endhighlight %}
