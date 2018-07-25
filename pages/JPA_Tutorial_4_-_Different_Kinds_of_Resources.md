---
title: JPA_Tutorial_4_-_Different_Kinds_of_Resources
---
What happens when you perform a query on a type that has subclasses? That's the purpose of this tutorial's transformations. In [JPA_Tutorial_3_-_A_Mini_Application]({{site.pagesurl}}/JPA_Tutorial_3_-_A_Mini_Application), we assumed Patrons could only check out books. Now they can checkout Books or DVDs (once we've got two different kinds of resources, adding a third is not a big deal).

It turns out support for inheritance in queries (as well as JPA) is built in. In fact, you do not actually need to do anything other than have one entity inherit from another entity to get everything to work. There are three ways to represent inheritance:
* One table for all classes in the hierarchy (the default)
* One table for each concrete class
* Table with subclasses (this is something that is optional to support in the current JPA spec.)

For now we'll stick with the default setting. Why? Which option you choose will impact performance, the database schema, how normalized your database is, but it will not affect how you write your code.

Step one we need to update our basic system. To do this we'll do the following:
* Introduce a new entity type called Resource
* Make the book entity inherit from the Resource entity
* Move attributes and methods from book that apply to all resources up to the Resource class
* Change the BookDao to be a ResourceDao
* Re-introduce a stripped down BookDao to support searching by ISBN (which we'll assume apply to books but not DVD's)
* Update all the methods that take books and replace them with resources (where appropriate)
* Update the methods returning Book and have them instead return Resource (and List<Book> --> List<Resource>)
* Update all references to Book and replace them with Resource
* Update all the comments that talk about books to talk about resources

You get the idea, it's a lot of work to make this change. That's why we'll do this first and make sure all of our tests pass before we actually add a second kind of resource.

Note the source code for all of these changes is at the bottom of this page.

### The Updated Entities
**Resource.java**
```java
package entity;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import util.DateTimeUtil;

/**
 * I represent the base of all things that can be checked of the Library. I hold
 * the ID field for all kinds of resources.
 */
@Entity
public abstract class Resource {
    /**
     * You do not (cannot in fact) add an id field to any subclasses since they
     * already inherit it from me.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * This was a book attribute, now it is moved up to Resource from Book (and
     * remove from Book).
     */
    @Column(length = 125, nullable = false)
    private String title;

    /**
     * This was a book attribute but since it makes sense for all resources, it
     * is now here and inherited by all subclasses of resources.
     * 
     * Now, instead of directly knowing the patron who has borrowed me as in the
     * previous version, I now hold on to a Loan object. The loan tracks both
     * me, the patron as well as the checkout and due dates.
     */
    @OneToOne(mappedBy = "resource", 
              cascade = CascadeType.PERSIST, optional = true)
    private Loan loan;

    public Resource() {
    }

    public Resource(final String title) {
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Each kind of resource has different rules for how long it can be checked
     * out. This abstract method forces each kind of resource to specify its due
     * date.
     * 
     * @param checkoutDate
     *            The date from which to calculate the due date
     * 
     * @return The date the resource is due back
     */
    public abstract Date calculateDueDateFrom(final Date checkoutDate);

    /**
     * Calculate the fine for a given resource based on the number of days late
     * the Patron returned it.
     * 
     * @param daysLate
     *            Number of days this resource is late
     * 
     * @return The fine
     */
    public abstract double calculateFine(final int daysLate);

    /**
     * This was in Book but you check in all resources. Notice that this method
     * does not know how to calculate the actual fine, so it delegates the fine
     * calculation to the derived class. This method is an example of the
     * Template Method Pattern.
     * 
     * @param checkinDate
     */
    public void checkin(final Date checkinDate) {
        final Date dueDate = getDueDate();

        if (getLoan().getDueDate().before(checkinDate)) {
            int daysLate = DateTimeUtil.daysBetween(dueDate, checkinDate);
            final double fineAmount = calculateFine(daysLate);
            final Fine f = new Fine(fineAmount, checkinDate, this);
            getLoan().getPatron().addFine(f);
        }

        setLoan(null);
    }

    public boolean isOnLoanTo(final Patron p) {
        return (getLoan() == null && p == null) || getLoan() != null
                && getLoan().getPatron().equals(p);
    }

    public boolean isCheckedOut() {
        return getLoan() != null;
    }

    public boolean dueDateEquals(final Date date) {
        return (date == null && !isCheckedOut())
                || getLoan().getDueDate().equals(date);
    }

    public Date getDueDate() {
        if (isCheckedOut()) {
            return getLoan().getDueDate();
        }
        return null;
    }
}
```

It turns out that this change touched all of the entities. So here are the rest of the entities changed to reflect this new base class.
**Book.java**
This class lost a lot of its methods as they were moved up to to Resource.
```java
package entity;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

/**
 * I represent a Book. I have one named query to find a book by its isbn number.
 * I have a many to many relationship with author. Since I define the mappedBy,
 * I'm the (arbitrarily picked) master of the relationship. I also take care of
 * cascading changes to the database. I also have One To One relationship with a
 * Loan that is optional (so it can be null). If I have a loan, I'm checked out
 * and the loan knows the Patron, checkout date and due date.
 */

@Entity
/**
 * A named query must have a globally unique name. That is why these are named
 * "Book."... These queries could be associated with any entity. Given that this
 * query deals with books, it seems appropriate to put it here. Named queries
 * will probably be pre-compiled. They are available from the entity manager by
 * using em.getNamedQueyr("Book.findById").
 */
@NamedQueries( 
        { @NamedQuery(name = "Book.findByIsbn", 
            query = "SELECT b FROM Book b WHERE b.isbn = :isbn") })
public class Book extends Resource {
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
     * the entity manager would complain of a transient object.
     */
    @ManyToMany(mappedBy = "booksWritten", cascade = { CascadeType.PERSIST,
            CascadeType.MERGE })
    private Set<Author> authors;

    public Book(final String t, final String i, final Date printDate,
            final Author... authors) {
        super(t);
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

    @Override
    public Date calculateDueDateFrom(Date checkoutDate) {
        final Calendar c = Calendar.getInstance();
        c.setTime(checkoutDate);
        c.add(Calendar.DATE, 14);
        return c.getTime();
    }

    @Override
    public double calculateFine(final int daysLate) {
        return .25 * daysLate;
    }
}
```

**Fine.java**
We need to change all of Book references to instead be Resource.
```java
package entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * I represent a single fine assigned to a Patron for a resource returned after its
 * due date.
 * 
 * I use new new features of JPA.
 */
@Entity
public class Fine {
    @Id
    @GeneratedValue
    private Long id;
    private double amount;

    @Temporal(TemporalType.DATE)
    private Date dateAdded;

    @OneToOne
    private Resource resource;

    public Fine() {
    }

    public Fine(final double amount, final Date dateAdded,
            final Resource resource) {
        setAmount(amount);
        setDateAdded(dateAdded);
        setResource(resource);
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(final Resource resource) {
        this.resource = resource;
    }

    public Date getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double fine) {
        this.amount = fine;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
```

**LoanId.java**
Change the bookId to resourceId, update the names queries that refer to book to instead refer to Resource.
```java
package entity;

import java.io.Serializable;

/**
 * I'm a custom, multi-part key. I represent the key of a Loan object, which
 * consists of a Patron id and a Resource id.
 * 
 * These two values together must be unique. The names of my attributes are the
 * same as the names used in Loan (patronId, rescoureId).
 * 
 * I also must be Serializable.
 */
public class LoanId implements Serializable {
    private static final long serialVersionUID = -2947379879626719748L;
    /**
     * The following two fields must have names that match the names used in the
     * Loan class.
     */
    private Long patronId;
    private Long resourceId;

    public LoanId() {
    }

    public LoanId(final Long patronId, final Long resourceId) {
        this.patronId = patronId;
        this.resourceId = resourceId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public Long getPatronId() {
        return patronId;
    }

    @Override
    public boolean equals(final Object rhs) {
        return rhs instanceof LoanId
                && ((LoanId) rhs).resourceId.equals(resourceId)
                && ((LoanId) rhs).patronId.equals(patronId);
    }

    @Override
    public int hashCode() {
        return patronId.hashCode() * resourceId.hashCode();
    }
}
```

**Loan.java**
Loan refers to resource instead of book. This includes its join columns and named queries.
```java
package entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * I'm an entity with a 2-part key. The first part of my key is a Resource id, the
 * second is a Patron id.
 * <P>
 * To make this work, we must do several things: Use the annotation IdClass,
 * Specify each of the parts of the id by using Id annotation (2 times in this
 * case), Set each Id column to both insertable = false and updatable = false,
 * Create an attribute representing the type of the id (Resource, Patron), Use
 * JoinColumn with the name = id and insertable = false, updatable = false.
 */

@Entity
@IdClass(LoanId.class)
@NamedQueries( {
        @NamedQuery(name = "Loan.resourcesLoanedTo", 
            query = "SELECT l.resource FROM Loan l WHERE l.patron.id = :patronId"),
        @NamedQuery(name = "Loan.byResourceId", 
            query = "SELECT l FROM Loan l WHERE l.resourceId = :resourceId"),
        @NamedQuery(name = "Loan.overdueResources", 
            query = "SELECT l.resource FROM Loan l WHERE l.dueDate < :date"),
        @NamedQuery(name = "Loan.patronsWithOverdueResources", 
            query = "SELECT l.patron FROM Loan l WHERE l.dueDate < :date") })
public class Loan {
    /**
     * Part 1 of a 2-part Key. The name must match the name in LoanId.
     */
    @Id
    @Column(name = "resourceId", insertable = false, updatable = false)
    private Long resourceId;

    /**
     * Part 2 of a 2-part Key. The name must match the name in LoanId.
     */
    @Id
    @Column(name = "patronId", insertable = false, updatable = false)
    private Long patronId;

    /**
     * A duplicate column in a sense, this one gives us the actual Patron rather
     * than just having the id of the Patron.
     * 
     * In the reference material I read, putting in insertable and updatable 
     * false did not seem required. However, when using the hibernate entity
     * manger I got a null pointer exception and had to step through the source
     * code to fix the problem.
     */
    @ManyToOne
    @JoinColumn(name = "patronId", insertable = false, updatable = false)
    private Patron patron;

    /**
     * Same comment as for patron attribute above.
     */
    @ManyToOne
    @JoinColumn(name = "resourceId", insertable = false, updatable = false)
    private Resource resource;

    /**
     * The date type can represent a date, a time or a time stamp (date and
     * time). In our case we just want the date.
     */
    @Temporal(TemporalType.DATE)
    @Column(updatable = false)
    private Date checkoutDate;

    @Temporal(TemporalType.DATE)
    @Column(updatable = false)
    private Date dueDate;

    public Loan() {
    }

    public Loan(final Resource r, final Patron p, final Date checkoutDate) {
        setResourceId(r.getId());
        setPatronId(p.getId());
        setResource(r);
        setPatron(p);
        setCheckoutDate(checkoutDate);
        setDueDate(r.calculateDueDateFrom(checkoutDate));
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(final Resource resource) {
        this.resource = resource;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(final Long resourceId) {
        this.resourceId = resourceId;
    }

    public Date getCheckoutDate() {
        return checkoutDate;
    }

    public void setCheckoutDate(final Date checkoutDate) {
        this.checkoutDate = checkoutDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(final Date dueDate) {
        this.dueDate = dueDate;
    }

    public Patron getPatron() {
        return patron;
    }

    public void setPatron(final Patron patron) {
        this.patron = patron;
    }

    public Long getPatronId() {
        return patronId;
    }

    public void setPatronId(final Long patronId) {
        this.patronId = patronId;
    }

    public void checkin(final Date checkinDate) {
        getResource().checkin(checkinDate);
        getPatron().checkin(this);
    }
}
```

**Patron.java**
The changes to Patron are a little less extreme. Other than some comments referring to books (you can find them), one method changed:
```java
    public void checkout(final Resource r, final Date checkoutDate) {
        final Loan l = new Loan(r, this, checkoutDate);
        getCheckedOutResources().add(l);
        r.setLoan(l);
    }
```

### The exceptions
# Rename all of the exceptions with "Book" in their name. Replace "Book" with "Resource"
# Rename all of the variables names bookId --> resourceId

How can you easliy go about doing this? Use the refactor factor in Eclipse. Select an exception class, right-click and select Refactor:Rename and enter a new name. You can also do the same thing by selecting the attribute name, right-click, refactor:rename and enter the new name. Make sure to select the bottom two selections regarding renaming the getter and setter.

### The Dao's
**BookDao.java**
Most of the functionality that was in BookDao is now in ResourceDao.java. Why is this? Or better yet, why is the a BookDao at all? Look at the one method and answer the question for yourself (or ask).

Here's an updated version of BookDao:
```java
package session;

import java.util.List;

import entity.Book;

public class BookDao extends BaseDao {

    @SuppressWarnings("unchecked")
    public List<Book> findByIsbn(final String isbn) {
        return getEm().createNamedQuery("Book.findByIsbn").setParameter("isbn",
                isbn).getResultList();
    }

}
```

**Library.java**
The Library has several changes. First, most references to Book have been replaced with Resource. Second, it now has 4 dao's instead of 3 (BookDao became ResourceDao and there's a new BookDao).
```java
package session;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import entity.Address;
import entity.Author;
import entity.Book;
import entity.Loan;
import entity.Patron;
import entity.Resource;
import exception.PatronHasFines;
import exception.ResourceAlreadyCheckedOut;
import exception.ResourceNotCheckedOut;

/**
 * This class provides a basic facade to the library system. If we had a user
 * interface, it would interact with this object rather than dealing with all of
 * the underlying Daos.
 */
public class Library {
    private ResourceDao resourceDao;
    private BookDao bookDao;
    private PatronDao patronDao;
    private LoanDao loanDao;

    public ResourceDao getResourceDao() {
        return resourceDao;
    }

    public void setResourceDao(final ResourceDao bookDao) {
        this.resourceDao = bookDao;
    }

    public PatronDao getPatronDao() {
        return patronDao;
    }

    public void setPatronDao(final PatronDao patronDao) {
        this.patronDao = patronDao;
    }

    public LoanDao getLoanDao() {
        return loanDao;
    }

    public void setLoanDao(final LoanDao loanDao) {
        this.loanDao = loanDao;
    }

    public BookDao getBookDao() {
        return bookDao;
    }

    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }

    public Book createBook(final String title, final String isbn,
            final Date date, final Author a1, final Author a2) {
        final Book b = new Book(title, isbn, date, a1, a2);

        getResourceDao().create(b);

        return b;
    }

    public List<Book> findBookByIsbn(String isbn) {
        return getBookDao().findByIsbn(isbn);
    }

    public Patron createPatron(final String patronId, final String fname,
            final String lname, final String phoneNumber, final Address a) {
        return getPatronDao().createPatron(fname, lname, phoneNumber, a);
    }

    public Patron findPatronById(final Long id) {
        final Patron p = getPatronDao().retrieve(id);
        if (p == null) {
            throw new EntityNotFoundException(String.format(
                    "Patron with id: %d does not exist", id));
        }
        return p;
    }

    public Resource findResourceById(Long id) {
        final Resource r = getResourceDao().findById(id);
        if (r == null) {
            throw new EntityNotFoundException(String.format(
                    "Book with Id:%d does not exist", id));
        }
        return r;
    }

    public void returnResource(final Date checkinDate,
            final Long... resourceIds) {
        for (Long resourceId : resourceIds) {
            final Loan l = getLoanDao().getLoanFor(resourceId);

            if (l == null) {
                throw new ResourceNotCheckedOut(resourceId);
            }

            l.checkin(checkinDate);

            getLoanDao().remove(l);
        }
    }

    public void checkout(final Long patronId, final Date checkoutDate,
            final Long... resourceIds) {
        final Patron p = findPatronById(patronId);

        double totalFines = p.calculateTotalFines();

        if (totalFines > 0.0d) {
            throw new PatronHasFines(totalFines);
        }

        for (Long id : resourceIds) {
            final Resource r = findResourceById(id);

            if (r.isCheckedOut()) {
                throw new ResourceAlreadyCheckedOut(id);
            }

            p.checkout(r, checkoutDate);
        }
    }

    public List<Resource> listResourcesOnLoanTo(final Long patronId) {
        return getLoanDao().listResourcesOnLoanTo(patronId);
    }

    public List<Resource> findAllOverdueResources(final Date compareDate) {
        return getLoanDao().listAllOverdueResources(compareDate);
    }

    public List<Patron> findAllPatronsWithOverdueBooks(final Date compareDate) {
        return getLoanDao().listAllPatronsWithOverdueResources(compareDate);
    }

    public double calculateTotalFinesFor(final Long patronId) {
        return getPatronDao().retrieve(patronId).calculateTotalFines();
    }

    public double tenderFine(final Long patronId, double amountTendered) {
        final Patron p = getPatronDao().retrieve(patronId);
        return p.pay(amountTendered);
    }
}
```

**LoanDao.java**
This class no longer knows about books, it only knows about resources.
```java
package session;

import java.util.Date;
import java.util.List;

import javax.persistence.NoResultException;

import entity.Loan;
import entity.Patron;
import entity.Resource;

/**
 * Provide some basic queries focused around the Loan object. These queries
 * could have been placed in either the PatronDao or ResourceDao. However,
 * neither seemed like quite the right place so we created this new Dao.
 */
public class LoanDao extends BaseDao {

    /**
     * Given a resource id, find the associated loan or return null if none
     * found.
     * 
     * @param resrouceId
     *            Id of resource on loan
     * 
     * @return Loan object that holds onto resourceId
     */
    public Loan getLoanFor(Long resourceId) {
        try {
            return (Loan) getEm().createNamedQuery("Loan.byResourceId")
                    .setParameter("resourceId", resourceId).getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public void remove(final Loan l) {
        getEm().remove(l);
    }

    /**
     * Return resources that are due after the compareDate.
     * 
     * @param compareDate
     *            If a resource's due date is after compareDate, then it is
     *            included in the list. Note that this named query uses
     *            projection. Have a look at Loan.java.
     * 
     * @return a list of all the resources that were due after this date.
     */
    @SuppressWarnings("unchecked")
    public List<Resource> listAllOverdueResources(final Date compareDate) {
        return getEm().createNamedQuery("Loan.overdueResources").setParameter(
                "date", compareDate).getResultList();
    }

    /**
     * Essentially the same query as listAllOverdueResources but we return the
     * Patrons instead of the resources. This method uses a named query that
     * uses projection.
     * 
     * @param compareDate
     *            If a patron has at least one resources that was due after the
     *            compare date, include them.
     * 
     * @return A list of the patrons with at least one overdue resources
     */
    @SuppressWarnings("unchecked")
    public List<Patron> listAllPatronsWithOverdueResources(
            final Date compareDate) {
        return getEm().createNamedQuery("Loan.patronsWithOverdueResources")
                .setParameter("date", compareDate).getResultList();
    }

    /**
     * Return all resources on loan to the provided patron id.
     * 
     * @param patronId
     *            If patron id is invalid, this method will not notice it.
     * 
     * @return Zero or more resources on loan to the patron in question
     */
    @SuppressWarnings("unchecked")
    public List<Resource> listResourcesOnLoanTo(final Long patronId) {
        return getEm().createNamedQuery("Loan.resourcesLoanedTo").setParameter(
                "patronId", patronId).getResultList();
    }
}
```

**ResourceDao.java**
Many of the BookDao functions are now here and they work with Resources intead of with Books (or rather they work with both but the interface deals with Resources).
```java
package session;

import entity.Resource;

/**
 * This class offers the basic create, read, update, delete functions required
 * for a resource. As we implement more complex requirements, we'll be coming
 * back to this class to add additional queries.
 */
public class ResourceDao extends BaseDao {
    public void create(final Resource r) {
        getEm().persist(r);
    }

    public Resource retrieve(final Long id) {
        return getEm().find(Resource.class, id);
    }

    public void remove(Long id) {
        final Resource r = retrieve(id);
        if (r != null) {
            getEm().remove(r);
        }
    }

    public Resource update(Resource r) {
        return getEm().merge(r);
    }

    public Resource findById(Long id) {
        return getEm().find(Resource.class, id);
    }
}
```

### The Tests

**BookDaoTest.java**
Removed (or moved to ResourceDaoTest, take your pick).

**LibraryTest.java**
Updated to work primarily with Resources instead of Books. Also, added additional initialization code since the library now has four dao's instead of 3.
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
import entity.Resource;
import exception.InsufficientFunds;
import exception.PatronHasFines;
import exception.ResourceAlreadyCheckedOut;
import exception.ResourceNotCheckedOut;

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
        final ResourceDao rd = new ResourceDao();
        rd.setEm(getEm());
        final PatronDao pd = new PatronDao();
        pd.setEm(getEm());
        final LoanDao ld = new LoanDao();
        ld.setEm(getEm());
        final BookDao bd = new BookDao();

        library = new Library();
        library.setResourceDao(rd);
        library.setPatronDao(pd);
        library.setLoanDao(ld);
        library.setBookDao(bd);
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
        final Set<Author> authors = b.getAuthors();
        final Resource found = library.findResourceById(b.getId());

        assertTrue(found instanceof Book);
        assertTrue(((Book) found).getAuthors().containsAll(authors));
    }

    @Test(expected = EntityNotFoundException.class)
    public void lookupBookThatDoesNotExist() {
        library.findResourceById(ID_DNE);
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

        final List<Resource> list = library.listResourcesOnLoanTo(p.getId());

        assertEquals(2, list.size());

        for (Resource r : list) {
            assertTrue(r.isOnLoanTo(p));
            assertTrue(r.dueDateEquals(CURRENT_PLUS_14));
        }
    }

    @Test
    public void returnBook() {
        final Book b = createBook();
        final Patron p = createPatron();
        library.checkout(p.getId(), CURRENT_DATE, b.getId());

        final int resourcesBefore = p.getCheckedOutResources().size();
        assertTrue(b.isCheckedOut());
        library.returnResource(CURRENT_PLUS_8, b.getId());
        assertEquals(resourcesBefore - 1, p.getCheckedOutResources().size());
        assertFalse(b.isCheckedOut());
        assertEquals(0, p.getFines().size());
    }

    @Test
    public void returnResourceLate() {
        final Book b = createBook();
        final Patron p = createPatron();

        library.checkout(p.getId(), CURRENT_DATE, b.getId());
        library.returnResource(CURRENT_PLUS_15, b.getId());

        assertEquals(1, p.getFines().size());
        assertEquals(.25, p.calculateTotalFines());
    }

    @Test(expected = ResourceNotCheckedOut.class)
    public void returnResourceThatsNotCheckedOut() {
        final Book b = createBook();
        assertFalse(b.isCheckedOut());
        library.returnResource(CURRENT_PLUS_8, b.getId());
    }

    @Test(expected = ResourceAlreadyCheckedOut.class)
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
        final List<Resource> notOverdue = library
                .findAllOverdueResources(CURRENT_PLUS_8);
        assertEquals(0, notOverdue.size());
        final List<Resource> overdue = library
                .findAllOverdueResources(CURRENT_PLUS_15);
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
        library.returnResource(CURRENT_PLUS_15, b1.getId(), b2.getId());
        assertEquals(.5, library.calculateTotalFinesFor(p.getId()));
    }

    @Test
    public void payFineExactAmount() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.returnResource(CURRENT_PLUS_15, b1.getId());
        double change = library.tenderFine(p.getId(), .25);
        assertEquals(0d, change);
        assertEquals(0, p.getFines().size());
    }

    @Test(expected = InsufficientFunds.class)
    public void payFineInsufficientFunds() {
        final Patron p = createPatron();
        final Book b1 = createBook();
        library.checkout(p.getId(), CURRENT_DATE, b1.getId());
        library.returnResource(CURRENT_PLUS_15, b1.getId());
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
        library.returnResource(CURRENT_PLUS_15, b1.getId());

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

**PatronDao.test**
Only a comment changes in this one. If you use Eclipse's refactoring feature, it automatically gets updated.

**ResourceDaoTest.java**
The renamed and updated BookDaoTest.java. This class still builds books (they are currently the only kind of concrete subclass of entity).
```java
package session;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.Calendar;

import org.junit.Test;

import entity.Author;
import entity.Book;
import entity.Name;
import entity.Resource;

public class ResourceDaoTest extends BaseDbDaoTest {
    private ResourceDao dao;

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
    public ResourceDao getDao() {
        if (dao == null) {
            dao = new ResourceDao();
        }
        return dao;
    }

    @Test
    public void createABook() {
        final Book b = createABookImpl();
        final Resource found = getDao().retrieve(b.getId());
        assertNotNull(found);

    }

    private Book createABookImpl() {
        final Author a1 = new Author(new Name("Bill", "Burke"));
        final Author a2 = new Author(new Name("Richard", "Monson-Haefel"));
        final Book b = new Book("Enterprise JavaBeans 3.0",
                "978-0-596-00978-6", Calendar.getInstance().getTime(), a1, a2);
        getDao().create(b);

        return b;
    }

    @Test
    public void removeABook() {
        final Book b = createABookImpl();
        Resource found = getDao().retrieve(b.getId());
        assertNotNull(found);
        getDao().remove(b.getId());
        found = getDao().retrieve(b.getId());
        assertNull(found);
    }

    @Test
    public void updateABook() {
        final Book b = createABookImpl();
        final int initialAuthorCount = b.getAuthors().size();
        b.addAuthor(new Author(new Name("New", "Author")));
        getDao().update(b);
        final Resource found = getDao().retrieve(b.getId());
        assertTrue(found instanceof Book);
        assertEquals(initialAuthorCount + 1, ((Book) found).getAuthors().size());
    }

    @Test
    public void tryToFindBookThatDoesNotExist() {
        final Resource r = getDao().retrieve(-1123123123l);
        assertNull(r);
    }
}
```
### The Source
> [[file:ResourceBasicSupport.jar]]
