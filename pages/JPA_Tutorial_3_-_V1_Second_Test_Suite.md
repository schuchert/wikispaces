---
title: JPA_Tutorial_3_-_V1_Second_Test_Suite
---
We started with Patron. In round 2, we add the basic support for the Book. The book dao needs the same basic tests:
* Creating a Book
* Removing a Book
* Updating a Bookadd

Note that we did not also include retrieving a book. We use this functionality in all of the tests anyway so I do not include a specific test for that functionality. This might seem like we’re not isolating tests perfectly but then I’ve never seen or come up with a “perfect” solution to this issue and this seems adequate to me.

We've already written a test very much like the above list if you consider PatronTest. We can extract quite a bit of common code out of our PatronTest and reuse it in our BookTest class. Take a look at this base class (note the embedded comments contain background information):
[#BaseDbDaoTest]({{site.pagesurl}}/#BaseDbDaoTest)
**BaseDbDaoTest.java**
{% highlight java %}
package session;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;

/**
 * A base class for tests that handles logger initialization, entity manager
 * factory and entity manager creation, associating an entity manager with a
 * dao, starting and rolling back transactions.
 */
public abstract class BaseDbDaoTest {
    private EntityManagerFactory emf;

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
     * Before each test method, look up the entity manager factory, get the dao
     * and set a newly-created entity manager and begin a transaction.
     */
    @Before
    public void initEmfAndEm() {
        emf = Persistence.createEntityManagerFactory("lis");
        getDao().setEm(emf.createEntityManager());
        getDao().getEm().getTransaction().begin();
    }

    /**
     * After each test method, roll back the transaction started in the
     * 
     * @Before method then close both the entity manager and entity manager
     *         factory.
     */
    @After
    public void closeEmAndEmf() {
        getDao().getEm().getTransaction().rollback();
        getDao().getEm().close();
        emf.close();
    }
}
{% endhighlight %}

Now let’s see how this impacts the creation of our new BookTest class. We’ll start with everything but the tests and then look at each test.

**Everything but the Tests**
Here is the test class minus all of the tests. 
{% highlight java %}
package session;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.util.Calendar;

import org.junit.Test;

import entity.Author;
import entity.Book;
import entity.Name;

public class BookDaoTest extends BaseDbDaoTest {
    private BookDao dao;

    /**
     * By overriding this method, I'm able to provide a dao to the base class,
     * which then installs a new entity manager per test method execution. Note
     * that my return type is not the same as the base class' version. I return
     * BookDao whereas the base class returns BaseDao. Normally an overridden
     * method must return the same type. However, it is OK for an overridden
     * method to return a different type so long as that different type is a
     * subclass of the type returned in the base class. This is called
     * covariance.
     * 
     * @see session.BaseDbDaoTest#getDao()
     */

    @Override
    public BookDao getDao() {
        if (dao == null) {
            dao = new BookDao();
        }
        return dao;
    }
}
{% endhighlight %}

**Creating a Book**
We wrote this pretty much the same as in the Patron test. It might seem like we could get further reuse between tests and we could but at the cost of probably a bit too much indirection.

{% highlight java %}
    @Test
    public void createABook() {
        final Book b = createABookImpl();
        final Book found = getDao().retrieve(b.getId());
        assertNotNull(found);

    }

    private Book createABookImpl() {
        final Author a1 = new Author(new Name("Bill", "Burke"));
        final Author a2 = new Author(new Name("Richard", "Monson-Haefel"));
        return getDao().create("Enterprise JavaBeans 3.0", "978-0-596-00978-6",
                Calendar.getInstance().getTime(), a1, a2);
    }
{% endhighlight %}

**Removing a Book**
This test method looks just like one in the PatronTest class. If you’re looking for an advanced exercise, consider moving all of the tests in the base class and making the derived class methods use them somehow. Warning, you might want to look up annotation inheritance.
{% highlight java %}
    @Test
    public void removeABook() {
        final Book b = createABookImpl();
        Book found = getDao().retrieve(b.getId());
        assertNotNull(found);
        getDao().remove(b.getId());
        found = getDao().retrieve(b.getId());
        assertNull(found);
    }
{% endhighlight %}

**Updating a Book**
{% highlight java %}
    @Test
    public void updateABook() {
        final Book b = createABookImpl();
        final int initialAuthorCount = b.getAuthors().size();
        b.addAuthor(new Author(new Name("New", "Author")));
        getDao().update(b);
        final Book found = getDao().retrieve(b.getId());
        assertEquals(initialAuthorCount + 1, found.getAuthors().size());
    }
{% endhighlight %}

**Try to find a non- existant book**
{% highlight java %}
    @Test
    public void tryToFindBookThatDoesNotExist() {
        final Book b = getDao().retrieve(-1123123123l);
        assertNull(b);
    }
{% endhighlight %}

Note that with the introduction of the base class we’ll also need to make changes to PatronTest. Here’s the updated version of PatronTest taking the new base class into consideration.
**PatronDaoTest.java Updated**
{% highlight java %}
package session;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import org.junit.Test;

import entity.Address;
import entity.Patron;

/**
 * This class has been updated to take advantage of BaseDbDaoTest. In reality, I
 * just pulled the common functionality of pre test initialization and post test
 * initialization to a base class since I'm going to use it across several test
 * cases.
 */
public class PatronDaoTest extends BaseDbDaoTest {
    private static final String NEW_PN = "555-555-5555";
    private PatronDao dao;

    /**
     * @see session.BaseDbDaoTest#getDao()
     * @see session.BookDaoTest#getDao()
     */
    @Override
    public PatronDao getDao() {
        if (dao == null) {
            dao = new PatronDao();
        }
        return dao;
    }

    @Test
    public void createAPatron() {
        final Patron p = createAPatronImpl();
        final Patron found = getDao().retrieve(p.getId());

        assertNotNull(found);
    }

    /**
     * I need to create patrons in several tests so it is factored out here.
     * 
     * @return Newly created patron already inserted into the database under the
     *         current transaction
     */

    private Patron createAPatronImpl() {
        final Address a = new Address("5080 Spectrum Drive", "Suite 700 West",
                "Addison", "TX", "75001");
        return getDao().createPatron("Brett", "Schuchert", "972-555-1212", a);
    }

    @Test
    public void removeAPatron() {
        final Patron p = createAPatronImpl();

        getDao().removePatron(p.getId());
        final Patron found = getDao().retrieve(p.getId());

        assertNull(found);
    }

    @Test
    public void updateAPatron() {
        final Patron p = createAPatronImpl();

        final String originalPhoneNumber = p.getPhoneNumber();
        p.setPhoneNumber(NEW_PN);
        getDao().update(p);
        final Patron found = getDao().retrieve(p.getId());

        assertNotNull(found);
        assertFalse(NEW_PN.equals(originalPhoneNumber));
        assertEquals(NEW_PN, p.getPhoneNumber());
    }

    @Test
    public void tryToFindPatronThatDoesNotExist() {
        final Long id = -18128129831298l;
        final Patron p = getDao().retrieve(id);
        assertNull(p);
    }
} 
{% endhighlight %}

### The Dao Classes
The BookDao looks a whole lot like the PatronDao:
[#BookDao]({{site.pagesurl}}/#BookDao)
**BookDao.java**
{% highlight java %}
package session;

import java.util.Date;

import entity.Author;
import entity.Book;

/**
 * This class offers the basic create, read, update, delete functions required
 * for a book. As we implement more complex requirements, we'll be coming back
 * to this class to add additional queries.
 */
public class BookDao extends BaseDao {
    public Book create(final String title, final String isbn,
            final Date publishDate, Author... authors) {
        final Book b = new Book(title, isbn, publishDate, authors);
        getEm().persist(b);
        return b;
    }

    public Book retrieve(final Long id) {
        return getEm().find(Book.class, id);
    }

    public void remove(Long id) {
        final Book b = retrieve(id);
        if (b != null) {
            getEm().remove(b);
        }
    }

    public void update(Book b) {
        getEm().merge(b);
    }
}
{% endhighlight %}

Note that this class depends on a simple base class, the BaseDao, which offers support for storing the Entity Manager attribute:
[#BaseDao]({{site.pagesurl}}/#BaseDao)
**BaseDao.java**
{% highlight java %}
package session;

import javax.persistence.EntityManager;

/**
 * A simple base class for all dao's. It offers 2 features. First, it has the
 * entity manager attribute. Second, it makes it possible to have a common test
 * base class with the getDao() method to allow for automatic initialization.
 */
public abstract class BaseDao {
    private EntityManager em;

    public void setEm(final EntityManager em) {
        this.em = em;
    }

    public EntityManager getEm() {
        return em;
    }
}
{% endhighlight %}

And finally, here’s the updated PatronDao that has been rewritten to use the BaseDao.
[#PatronDao]({{site.pagesurl}}/#PatronDao)
**PatronDao.java**
{% highlight java %}
package session;

import entity.Address;
import entity.Patron;

/**
 * This class supports basic create, read, update, delete functionality for the
 * Patron. As with Book, as we implement more requirements we'll be revisiting
 * this class to extend its functionality.
 */
public class PatronDao extends BaseDao {
    public Patron createPatron(final String fname, final String lname,
            final String phoneNumber, final Address a) {
        final Patron p = new Patron(fname, lname, phoneNumber, a);
        getEm().persist(p);
        return p;
    }

    public Patron retrieve(final Long id) {
        return getEm().find(Patron.class, id);
    }

    public void removePatron(final Long id) {
        final Patron p = retrieve(id);
        if (p != null) {
            getEm().remove(p);
        }
    }

    public Patron update(final Patron p) {
        return getEm().merge(p);
    }
}
{% endhighlight %}
### The Entity Model
We’ve added support for a Book and along the way we had to add in a few more classes. After the second test suite, we’re up to the following entities:

|**Entity**|**Description**|
|Address|This entity represents the address for both an Author and a Patron. In the first tutorial we embedded this class. Now we’re allowing it to exist in its own table as a first-class citizen rather than embedding it.|
|Author|Books and Authors have a bi-directional, many to many relationship with each other. That is, a book has one to many Authors and an Author has one to many books. This entity represents one author and maintains a Set<Book> representing each of its books. We treat the Author as the secondary part of the relationship and the book as Primary.|
|Book|The book is a key entity in our system. It maintains a set of Authors and is considered the master of the bi-directional relationship. In version 1 of our system, the relationship between Books and Patrons is direct. We’ll change that in version 2.|
|Name|Authors and Patrons both have a name. Rather than duplicate the definition of names in both classes, we create a Name entity. This entity is embeddable, meaning its attributes will be stored as columns in the entities in which it is contained rather than as rows in a table all of its own.|
|Patron|The patron borrows books, so it has a Set<Books> as well as an embedded Name.|

Now let’s review the code for each of these entities. As with previous examples, pay attention to the embedded comments.

**Address**
{% highlight java %}
package entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * This class will be known to JPA as an entity. It represents an address. It is
 * a fairly simple class that gets stored in its own table called ADDRESS. The
 * column names equal the names of the attributes.
 */

@Entity
public class Address {
    /**
     * The next attribute is a key column in the database with a
     * database-specific generated unique value.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * The next attribute will be stored in a column with space for 50
     * characters and cannot be null (the default)
     */
    @Column(length = 50)
    private String streetAddress1;

    /**
     * The next attribute will be stored in a column with space for 50
     * characters and it can be null(nullable = true).
     */
    @Column(length = 50, nullable = true)
    private String streetAddress2;
    @Column(length = 20)
    private String city;
    @Column(length = 2)
    private String state;
    @Column(length = 9)
    private String zip;

    public Address() {
    }

    public Address(final String sa1, final String sa2, final String city,
            final String state, final String zip) {
        setStreetAddress1(sa1);
        setStreetAddress2(sa2);
        setCity(city);
        setState(state);
        setZip(zip);
    }

    public String getCity() {
        return city;
    }

    public void setCity(final String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(final String state) {
        this.state = state;
    }

    public String getStreetAddress1() {
        return streetAddress1;
    }

    public void setStreetAddress1(final String streetAddress1) {
        this.streetAddress1 = streetAddress1;
    }

    public String getStreetAddress2() {
        return streetAddress2;
    }

    public void setStreetAddress2(final String streetAddress2) {
        this.streetAddress2 = streetAddress2;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(final String zip) {
        this.zip = zip;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
{% endhighlight %}

**Author**
{% highlight java %}
package entity;

import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

/**
 * I am an entity with a bidirectional relationship to Book. The Book is
 * considered the master of the relationship.
 */
@Entity
public class Author {
    @Id
    @GeneratedValue
    private Long id;

    /**
     * The next attribute is embedded directly in me. That means its attributes
     * will be directly stored in columns in the same table as me rather than
     * being in its own table with key to itself and foreign key back to me.
     */
    @Embedded
    private Name name;

    /**
     * A book might be written by several authors and an author might write
     * several books. Therefore we maintain a many-to-many relationship between
     * books authors. It's bidirectional as well.
     */
    @ManyToMany
    private Set<Book> booksWritten;

    public Author(final Name name) {
        setName(name);
    }

    public Author() {
    }

    public Set<Book> getBooksWritten() {
        return booksWritten;
    }

    public void addBook(final Book b) {
        booksWritten.add(b);
        b.addAuthor(this);
    }

    public void setBooksWritten(final Set<Book> booksWritten) {
        this.booksWritten = booksWritten;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    /**
     * We are storing Authors in sets so we need to define some definition of
     * equality. We've decided to use Name as that definition. You might think
     * to use the id field for equality but it may not be assigned before this
     * object is placed in a collection so we have to use a more natural
     * definition of equality.
     */

    @Override
    public boolean equals(final Object object) {
        if (object instanceof Author) {
            final Author rhs = (Author) object;
            return getName().equals(rhs.getName());
        }
        return false;
    }

    /**
     * The hash code should relate to the equals method. And as mentioned there,
     * we cannot use the id field for the hash code because it is likely we
     * won't have an id already assigned by the database before we try put this
     * object in a collection that requires the hashCode method (such as HashSet
     * or HashMap). So we use a natural part of the object for its
     * interpretation of hash code.
     */

    @Override
    public int hashCode() {
        return getName().hashCode();
    }

    public Name getName() {
        return name;
    }

    public void setName(final Name name) {
        this.name = name;
    }
}
{% endhighlight %}

**Book**
{% highlight java %}
package entity;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

/**
 * I represent a Book. I have one named query to find a book by its isbn number.
 * I also have a many to many relationship with author. Since I define the
 * mappedBy, I'm the (arbitrarily picked) master of the relationship. I also
 * take care of cascading changes to the database.
 */

@Entity
public class Book {
    @Id
    @GeneratedValue
    private Long id;
    @Column(length = 100, nullable = false)
    private String title;
    @Column(length = 20, nullable = false)
    private String isbn;
    private Date printDate;

    /**
     * Authors may have written several books and vice-versa. We had to pick one
     * side of this relationship as the primary one and we picked books. It was
     * arbitrary but since we're dealing with books, we decided to make this
     * side the primary size. The mappedBy connects this relationship to the one
     * that is in Author. When we merge or persist, changes to this collection
     * and the contents of the collection will be updated. That is, if we update
     * the name of the author in the set, when we persist the book, the author
     * will also get updated.
     * 
     * Note that if we did not have the cascade setting here, they if we tried
     * to persist a book with an unmanaged author (e.g. a newly created one),
     * the entity manager would contain of a transient object.
     */
    @ManyToMany(mappedBy = "booksWritten", cascade = { CascadeType.PERSIST,
            CascadeType.MERGE })
    private Set<Author> authors;

    /**
     * I may be borrowed. If so, then I'll know who that is. In this version, I
     * simply have a direct relationship with the Patron. In the next version,
     * we'll create a table to capture the details of borrowing a resource.
     */
    @ManyToOne
    private Patron borrowedBy;

    public Book(final String t, final String i, final Date printDate,
            final Author... authors) {
        setTitle(t);
        setIsbn(i);
        setPrintDate(printDate);
        for (Author a : authors) {
            addAuthor(a);
        }
    }

    public Book() {
    }

    public Set<Author> getAuthors() {
        if (authors == null) {
            authors = new HashSet<Author>();
        }
        return authors;
    }

    public void setAuthors(final Set<Author> authors) {
        this.authors = authors;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(final String isbn) {
        this.isbn = isbn;
    }

    public Date getPrintDate() {
        return printDate;
    }

    public void setPrintDate(final Date printDate) {
        this.printDate = printDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public void addAuthor(final Author author) {
        getAuthors().add(author);
    }

    @Override
    public boolean equals(final Object rhs) {
        return rhs instanceof Book && ((Book) rhs).getIsbn().equals(getIsbn());
    }

    @Override
    public int hashCode() {
        return getIsbn().hashCode();
    }

    public boolean wasWrittenBy(Author a) {
        return getAuthors().contains(a);
    }

    public boolean checkedOutBy(Patron p) {
        return p != null && p.equals(getBorrowedBy());
    }

    public Date calculateDueDateFrom(Date checkoutDate) {
        final Calendar c = Calendar.getInstance();
        c.setTime(checkoutDate);
        c.add(Calendar.DATE, 14);
        return c.getTime();
    }

    public Patron getBorrowedBy() {
        return borrowedBy;
    }

    public void setBorrowedBy(Patron borrowedBy) {
        this.borrowedBy = borrowedBy;
    }
}
{% endhighlight %}

**Name**
{% highlight java %}
package entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * Rather than repeat first name/last name in both Patron and Author, we create
 * an embedded class. The fields of this class end up as columns in the table
 * that contains the class that embeds this entity. That is, both author and
 * patron will have a firstName and lastName column.
 */

@Embeddable
public class Name {
    @Column(length = 20, nullable = false)
    private String firstName;
    @Column(length = 30, nullable = false)
    private String lastName;

    public Name() {

    }

    public Name(final String firstName, final String lastName) {
        setFirstName(firstName);
        setLastName(lastName);
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        if (firstName != null) {
            this.firstName = firstName;
        } else {
            this.firstName = "";
        }
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        if (lastName != null) {
            this.lastName = lastName;
        } else {
            this.lastName = "";
        }
    }
}
{% endhighlight %}

**Patron**
{% highlight java %}
package entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

@Entity
public class Patron {
    @Id
    @GeneratedValue
    private Long id;

    @Embedded
    private Name name;

    @Column(length = 11, nullable = false)
    private String phoneNumber;

    /**
     * This next field refers to an object that is stored in another table. All
     * updates are cascaded. So if you persist me, my address, which is in
     * another table, will be persisted automatically. Updates and removes are
     * also cascaded automatically.
     * 
     * Note that cascading removes is a bit dangerous. In this case I know that
     * the address is owned by only one Patron. In general you need to be
     * careful automatically removing objects in related tables due to possible
     * constraint violations.
     */
    @OneToOne(cascade = CascadeType.ALL)
    private Address address;

    /**
     * A Patron may checkout several books. This collection
     */

    @OneToMany(mappedBy = "borrowedBy", cascade = { CascadeType.MERGE,
            CascadeType.PERSIST })
    private Set<Book> borrowedBooks;

    public Patron(final String fName, final String lName, final String phone,
            final Address a) {
        setName(new Name(fName, lName));
        setPhoneNumber(phone);
        setAddress(a);
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Set<Book> getBorrowedBooks() {
        if (borrowedBooks == null) {
            borrowedBooks = new HashSet<Book>();
        }
        return borrowedBooks;
    }

    public void setBorrowedBooks(Set<Book> borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }

    public void addBook(final Book b) {
        getBorrowedBooks().add(b);
    }

    public void removeBook(final Book b) {
        getBorrowedBooks().remove(b);
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }
}
{% endhighlight %}
