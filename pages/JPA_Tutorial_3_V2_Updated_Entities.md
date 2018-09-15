---
title: JPA_Tutorial_3_V2_Updated_Entities
---
The biggest change this version was the addition of a Loan entity. A loan represents information about the **relationship** between Book and Patron. It specifically stores the checkout date and the due date. The Loan entity represents a so-called join table in the database. There are ways to specify a join table without creating an Entity, however we created the entity because we wanted to store additional information about the relationship. It also, arguably, makes some of our queries easier having Loan as an entity rather that just described as a join table.

### Loan.java
{% highlight java %}
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
 * I'm an entity with a 2-part key. The first part of my key is a Book id, the
 * second is a Patron id.
 * <P>
 * To make this work, we must do several things: Use the annotation IdClass,
 * Specify each of the parts of the id by using Id annotation (2 times in this
 * case), Set each Id column to both insertable = false and updatable = false,
 * Create an attribute representing the type of the id (Book, Patron), Use
 * JoinColumn with the name = id and insertable = false, updatable = false.
 */

@Entity
@IdClass(LoanId.class)
@NamedQueries( {
        @NamedQuery(name = "Loan.booksLoanedTo", 
            query = "SELECT l.book FROM Loan l WHERE l.patron.id = :patronId"),
        @NamedQuery(name = "Loan.byBookId", 
            query = "SELECT l FROM Loan l WHERE l.bookId = :bookId"),
        @NamedQuery(name = "Loan.overdueBooks", 
            query = "SELECT l.book FROM Loan l WHERE l.dueDate < :date"),
        @NamedQuery(name = "Loan.patronsWithOverdueBooks", 
            query = "SELECT l.patron FROM Loan l WHERE l.dueDate < :date") })
public class Loan {
    /**
     * Part 1 of a 2-part Key. The name must match the name in LoanId.
     */
    @Id
    @Column(name = "bookId", insertable = false, updatable = false)
    private Long bookId;

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
     * Same comment as for patron attribute above plus...
     *
     * It seems this should be a OneToOne relationship but doing so will give
     * you an obscure exception with little explanation as to why.
     */
    @ManyToOne
    @JoinColumn(name = "bookId", insertable = false, updatable = false)
    private Book book;

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

    public Loan(final Book b, final Patron p, final Date checkoutDate) {
        setBookId(b.getId());
        setPatronId(p.getId());
        setBook(b);
        setPatron(p);
        setCheckoutDate(checkoutDate);
        setDueDate(b.calculateDueDateFrom(checkoutDate));
    }

    public Book getBook() {
        return book;
    }

    public void setBook(final Book book) {
        this.book = book;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(final Long bookId) {
        this.bookId = bookId;
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
        getBook().checkin(checkinDate);
        getPatron().checkin(this);
    }
}
{% endhighlight %}

### LoanId.java
{% highlight java %}
package entity;

import java.io.Serializable;

/**
 * I'm a custom, multi-part key. I represent the key of a Loan object, which
 * consists of a Patron id and a Book id.
 * 
 * These two values together must be unique. The names of my attributes are the
 * same as the names used in Loan (patronId, bookId).
 * 
 * I also must be Serializable.
 */
public class LoanId implements Serializable {
    private static final long serialVersionUID = -6272344103273093529L;

    /**
     * The following two fields must have names that match the names used in the
     * Loan class.
     */

    private Long patronId;
    private Long bookId;

    public LoanId() {
    }

    public LoanId(final Long patronId, final Long bookId) {
        this.patronId = patronId;
        this.bookId = bookId;
    }

    public Long getBookId() {
        return bookId;
    }

    public Long getPatronId() {
        return patronId;
    }

    @Override
    public boolean equals(final Object rhs) {
        return rhs instanceof LoanId && ((LoanId) rhs).bookId.equals(bookId)
                && ((LoanId) rhs).patronId.equals(patronId);
    }

    @Override
    public int hashCode() {
        return patronId.hashCode() * bookId.hashCode();
    }
}
{% endhighlight %}

### Book.java
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
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;

import util.DateTimeUtil;

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
     * Now, instead of directly knowing the patron who has borrowed me as in the
     * previous version, I now hold on to a Loan object. The loan tracks both
     * me, the patron as well as the checkout and due dates.
     */
    @OneToOne(mappedBy = "book", cascade = CascadeType.PERSIST, optional = true)
    private Loan loan;

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

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
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

    public Date calculateDueDateFrom(Date checkoutDate) {
        final Calendar c = Calendar.getInstance();
        c.setTime(checkoutDate);
        c.add(Calendar.DATE, 14);
        return c.getTime();
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

    public void checkin(Date checkinDate) {
        final Date dueDate = getDueDate();

        if (getLoan().getDueDate().before(checkinDate)) {
            final double amount = .25 * DateTimeUtil.daysBetween(dueDate,
                    checkinDate);
            final Fine f = new Fine(amount, checkinDate, this);
            getLoan().getPatron().addFine(f);
        }

        setLoan(null);
    }

}
{% endhighlight %}

### Fine.java
{% highlight java %}
package entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * I represent a single fine assigned to a Patron for a book returned after its
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
    private Book book;

    public Fine() {
    }

    public Fine(final double amount, final Date dateAdded, final Book book) {
        setAmount(amount);
        setDateAdded(dateAdded);
        setBook(book);
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
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
{% endhighlight %}

### Patron.java
{% highlight java %}
package entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;

import exception.InsufficientFunds;

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
     * A Patron may have several books on loan.
     */
    @OneToMany(mappedBy = "patron", cascade = { CascadeType.PERSIST,
            CascadeType.MERGE })
    private List<Loan> checkedOutResources;

    /**
     * I have zero to many fines. The fines are ordered by the date they were
     * added to me.
     */
    @OneToMany(cascade = CascadeType.ALL)
    @OrderBy("dateAdded")
    private List<Fine> fines;

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

    public List<Loan> getCheckedOutResources() {
        if (checkedOutResources == null) {
            checkedOutResources = new ArrayList<Loan>();
        }

        return checkedOutResources;
    }

    public void setCheckedOutResources(List<Loan> checkedOutResources) {
        this.checkedOutResources = checkedOutResources;
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }

    public void removeLoan(final Loan loan) {
        getCheckedOutResources().remove(loan);
    }

    public void addLoan(Loan l) {
        getCheckedOutResources().add(l);
    }

    public List<Fine> getFines() {
        if (fines == null) {
            fines = new ArrayList<Fine>();
        }
        return fines;
    }

    public void setFines(List<Fine> fines) {
        this.fines = fines;
    }

    public void checkout(final Book b, final Date checkoutDate) {
        final Loan l = new Loan(b, this, checkoutDate);
        getCheckedOutResources().add(l);
        b.setLoan(l);
    }

    public void addFine(final Fine f) {
        getFines().add(f);
    }

    public void checkin(final Loan loan) {
        getCheckedOutResources().remove(loan);
    }

    public double calculateTotalFines() {
        double sum = 0;
        for (Fine f : getFines()) {
            sum += f.getAmount();
        }

        return sum;
    }

    /**
     * I clear fines depending on amount tendered. Note that the cascade mode is
     * set to all, so if I delete records from my set, they will be removed from
     * the database.
     * 
     * @param amountTendered
     * 
     * @return balance after the payment
     */

    public double pay(final double amountTendered) {
        double totalFines = calculateTotalFines();
        if (totalFines <= amountTendered) {
            setFines(new ArrayList<Fine>());
            return amountTendered - totalFines;
        } else {
            throw new InsufficientFunds();
        }
    }
}
{% endhighlight %}
