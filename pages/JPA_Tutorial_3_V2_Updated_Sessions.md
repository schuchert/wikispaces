---
title: JPA_Tutorial_3_V2_Updated_Sessions
---
We've added a new session, LoanDao. It essentially provides a few queries dealing with loans such as finding all overdue books or finding all patrons with overdue books.
### LoanDao.java
{% highlight java %}
package session;

import java.util.Date;
import java.util.List;

import javax.persistence.NoResultException;

import entity.Book;
import entity.Loan;
import entity.Patron;

/**
 * Provide some basic queries focused around the Loan object. These queries
 * could have been placed in either the PatronDao or BookDao. However, neither
 * seemed like quite the right place so we created this new Dao.
 */
public class LoanDao extends BaseDao {

    /**
     * Given a book id, find the associated loan or return null if none found.
     * 
     * @param bookId
     *            Id of book on loan
     * 
     * @return Loan object that holds onto bookId
     */
    public Loan getLoanFor(Long bookId) {
        try {
            return (Loan) getEm().createNamedQuery("Loan.byBookId")
                    .setParameter("bookId", bookId).getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public void remove(final Loan l) {
        getEm().remove(l);
    }

    /**
     * Return books that are due after the compareDate.
     * 
     * @param compareDate
     *            If a book's due date is after compareDate, then it is included
     *            in the list. Note that this named query uses projection. Have
     *            a look at Loan.java.
     * 
     * @return a list of all the books that were due after this date.
     */
    @SuppressWarnings("unchecked")
    public List<Book> listAllOverdueBooks(final Date compareDate) {
        return getEm().createNamedQuery("Loan.overdueBooks").setParameter(
                "date", compareDate).getResultList();
    }

    /**
     * Essentially the same query as listAllOverdueBooks but we return the
     * Patrons instead of the books. This method uses a named query that uses
     * projection.
     * 
     * @param compareDate
     *            If a patron has at least one book that was due after the
     *            compare date, include them.
     * 
     * @return A list of the patrons with at least one overdue book
     */
    @SuppressWarnings("unchecked")
    public List<Patron> listAllPatronsWithOverdueBooks(final Date compareDate) {
        return getEm().createNamedQuery("Loan.patronsWithOverdueBooks")
                .setParameter("date", compareDate).getResultList();
    }

    /**
     * Return all books on loan to the provided patron id.
     * 
     * @param patronId
     *            If patron id is invalid, this method will not notice it.
     * 
     * @return Zero or more books on loan to the patron in question
     */
    @SuppressWarnings("unchecked")
    public List<Book> listBooksOnLoanTo(final Long patronId) {
        return getEm().createNamedQuery("Loan.booksLoanedTo").setParameter(
                "patronId", patronId).getResultList();
    }
}
{% endhighlight %}


### Library.java
{% highlight java %}
package session;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import entity.Address;
import entity.Author;
import entity.Book;
import entity.Loan;
import entity.Patron;
import exception.BookAlreadyCheckedOut;
import exception.BookNotCheckedOut;
import exception.PatronHasFines;

/**
 * This class provides a basic facade to the library system. If we had a user
 * interface, it would interact with this object rather than dealing with all of
 * the underlying Daos.
 */
public class Library {
    private BookDao bookDao;
    private PatronDao patronDao;
    private LoanDao loanDao;

    public BookDao getBookDao() {
        return bookDao;
    }

    public void setBookDao(final BookDao bookDao) {
        this.bookDao = bookDao;
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
        final Patron p = getPatronDao().retrieve(id);
        if (p == null) {
            throw new EntityNotFoundException(String.format(
                    "Patron with id: %d does not exist", id));
        }
        return p;
    }

    public Book findBookById(Long id) {
        final Book b = getBookDao().findById(id);
        if (b == null) {
            throw new EntityNotFoundException(String.format(
                    "Book with Id:%d does not exist", id));
        }
        return b;
    }

    public void returnBook(final Date checkinDate, final Long... bookIds) {
        for (Long bookId : bookIds) {
            final Loan l = getLoanDao().getLoanFor(bookId);

            if (l == null) {
                throw new BookNotCheckedOut(bookId);
            }

            l.checkin(checkinDate);

            getLoanDao().remove(l);
        }
    }

    public void checkout(final Long patronId, final Date checkoutDate,
            final Long... bookIds) {
        final Patron p = findPatronById(patronId);

        double totalFines = p.calculateTotalFines();

        if (totalFines > 0.0d) {
            throw new PatronHasFines(totalFines);
        }

        for (Long id : bookIds) {
            final Book b = findBookById(id);

            if (b.isCheckedOut()) {
                throw new BookAlreadyCheckedOut(id);
            }

            p.checkout(b, checkoutDate);
        }
    }

    public List<Book> listBooksOnLoanTo(final Long patronId) {
        return getLoanDao().listBooksOnLoanTo(patronId);
    }

    public List<Book> findAllOverdueBooks(final Date compareDate) {
        return getLoanDao().listAllOverdueBooks(compareDate);
    }

    public List<Patron> findAllPatronsWithOverdueBooks(final Date compareDate) {
        return getLoanDao().listAllPatronsWithOverdueBooks(compareDate);
    }

    public double calculateTotalFinesFor(final Long patronId) {
        return getPatronDao().retrieve(patronId).calculateTotalFines();
    }

    public double tenderFine(final Long patronId, double amountTendered) {
        final Patron p = getPatronDao().retrieve(patronId);
        return p.pay(amountTendered);
    }
}
{% endhighlight %}
