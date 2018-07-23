---
title: Ejb3_Tutorial_3_-_Finish_Conversion
---
We have the following classes to convert:
* LoanDao
* BookDao
* Library

There's only one test left to convert, LibraryTest. We'll perform all of these conversions at once and see what we end up with (it won't be pretty).

**BookDao**
# Rename BookDao --> BookDaoBean
# Add @Stateless annotation to BookDaoBean
# Extract interface BookDao from BookDaoBean

**LoanDao**
# Rename LoanDao --> LoanDaoBean
# Add @Stateless annotation to LoanDaoBean
# Extract interface LoanDao from LoanDaoBean

**Library**
# Rename Library --> LibraryBean
# Add @Stateless annotation to LibraryBean
# Extract interface Library from LibraryBean
# Use @EJB to have the dao's injected

Here's the top of LibraryBean:
```java
@Stateless
public class LibraryBean implements Library {
    @EJB
    private ResourceDao resourceDao;
    @EJB
    private BookDao bookDao;
    @EJB
    private PatronDao patronDao;
    @EJB
    private LoanDao loanDao;
    // ...
}
```

**LibraryTest**
# Rename LibraryTest --> LibraryBeanTest
# Remove Base Class from LibraryBeanTest
# Update setupLibrary to simply lookup the library and set the library attribute.
# Add method with @BeforeClass annotation that initializes the container

Changes to LibraryBeanTest:

We need to change how LibraryBeanTest sets itself up. Currently it has one @Before method and one @BeforeClass method. Ultimately we will have one @Before method and two @BeforeClass methods.

We need to change **from** this:
```java
    @Before
    public void setupLibrary() {
        final ResourceDaoBean rd = new ResourceDaoBean();
        rd.setEm(getEm());
        final PatronDaoBean pd = new PatronDaoBean();
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
        c.add(Calendar.DAY_OF_MONTH, 6);
        CURRENT_PLUS_6 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 2);
        CURRENT_PLUS_8 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 6);
        CURRENT_PLUS_14 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 1);
        CURRENT_PLUS_15 = c.getTime();
    }

```

To the following:
```java
    @Before
    public void setupLibrary() {
        library = JBossUtil.lookup(Library.class, "LibraryBean/local");
    }

    @BeforeClass
    public static void initContainer() {
        JBossUtil.startDeployer();
    }

    // Note, the following method is unchanged
    @BeforeClass
    public static void setupDates() {
        Calendar c = Calendar.getInstance();
        DateTimeUtil.removeTimeFrom(c);
        CURRENT_DATE = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 6);
        CURRENT_PLUS_6 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 2);
        CURRENT_PLUS_8 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 6);
        CURRENT_PLUS_14 = c.getTime();
        c.add(Calendar.DAY_OF_MONTH, 1);
        CURRENT_PLUS_15 = c.getTime();
    }
```

While we're at it, we are no longer using the base classes so we can delete the following classes:
* BaseDbDaoTest
* EntityManagerBasedTest

Run LibraryBean test and things look a bit bleak. Out of 20 tests we have 8 errors and 9 failures. On the other hand, three tests passed successfully so it's not all bad.
----
# # Fixing The Tests 

# # addBook 
The last line of the addBook method fails. After a little research it turns out that the book's authors does not appear to contain all of the authors. If we step through all of this, it turns out that it does not contain any.

Here's a fact about the containAll() method on collections. It requires a proper definition of equals() and/or hashCode() depending on the type of collection. While Author has both hashCode and equals, both of these methods depend on Name.equals() and Name.hashCode(), neither of which are defined. So we need to add these missing methods to fix this problem.

We need to add the following methods to Name.java:
```java
    public boolean equals(final Object object) {
        if (object instanceof Name) {
            final Name rhs = (Name) object;
            return rhs.getFirstName().equals(getFirstName())
                    && rhs.getLastName().equals(getLastName());
        }
        return false;
    }

    public int hashCode() {
        return getFirstName().hashCode() * getLastName().hashCode();
    }
```

Run the test and after making this change, you'll notice that addBook passes.

## # lookupBookThatDoesNotExist 
When a method on a session bean throws an exception it will either return wrapped in an EJBException or "raw" depending on if the exception has the annotation @ApplicationException. The method findResourceById currently uses EntityNotFoundException, but we don't own that exception so we will make our own exception class and throw it instead.

Here's a new exception:
**EntityDoesNotExist Exception**
```java
package exception;

import javax.ejb.ApplicationException;

@ApplicationException
public class EntityDoesNotExist extends RuntimeException {
    private static final long serialVersionUID = 2838964492920113727L;

    private final Class clazz;
    private final Object key;

    public EntityDoesNotExist(final Class clazz, final Object key) {
        this.clazz = clazz;
        this.key = key;
    }

    public Class getClazz() {
        return clazz;
    }

    public Object getKey() {
        return key;
    }
}
```

Now we need to update two things:
# Update the method to throw this new exception
# Change the (expected = ) clause of the unit test

Here's the updated method in LibraryBean:
```java
    public Resource findResourceById(Long id) {
        final Resource r = getResourceDao().findById(id);
        if (r == null) {
            throw new EntityDoesNotExist(Resource.class, id);
        }
        return r;
    }
```

And the updated test method:
```java
    @Test(expected = EntityDoesNotExist.class)
    public void lookupBookThatDoesNotExist() {
        library.findResourceById(ID_DNE);
    }
```

### lookupPatronThatDoesNotExist
The test suffers from the Same problem as the above example. Do the same thing.

### checkoutBook
After digging into this problem a bit, you'll discover that Patron is missing equals() and hashCode():
```java
    @Override
    public boolean equals(final Object rhs) {
        return rhs instanceof Patron
                && EqualsUtil.equals(getId(), ((Patron) rhs).getId());
    }

    @Override
    public int hashCode() {
        return getId().hashCode();
    }
```

### returnBook
There are two problems with this test. First, we're using detached objects after they have been updated. Second, there's a lazily-initialized relationship. We'll fix the relationship first and the re-write the test to perform some additional lookups.

```java
            library.checkout(p.getId(), CURRENT_DATE, b.getId());

            Patron foundPatron = library.findPatronById(p.getId());
            final int resourcesBefore = foundPatron.getCheckedOutResources()
                    .size();

            Resource foundBook = library.findResourceById(b.getId());
            assertTrue(foundBook.isCheckedOut());
            library.returnResource(CURRENT_PLUS_8, foundBook.getId());
            foundPatron = library.findPatronById(p.getId());
            assertEquals(resourcesBefore - 1, foundPatron
                    .getCheckedOutResources().size());
            foundBook = library.findResourceById(b.getId());
            assertFalse(b.isCheckedOut());
            assertEquals(0, p.getFines().size());
```

Once we make these changes and re-run the test, we get the following exception:
```
java.lang.RuntimeException: org.jboss.tm.JBossRollbackException:
Unable to commit, tx=TransactionImpl:XidImpl[FormatId=257, GlobalId=null:
1164776892890/6, BranchQual=null:1164776892890, localId=0:6], status
STATUS_NO_TRANSACTION; - nested throwable: (javax.persistence.EntityNotFoundException:
deleted entity passed to persist: [entity.Loan#<null>]) 

OK, what does this mean? After some researching and guessing, you'll discover that this probably means you are trying to delete some object and doing so violates a foreign key constraint. It mentions Loan. If you do a little more digging, you'll find out that when you try to remove a loan from a collection of loans in a Patron, the loan is not removed. Why? No equals() or hashCode(). Here they are:
```java
    @Override
    public boolean equals(final Object rhs) {
        return rhs instanceof Loan
                && ((Loan) rhs).getPatronId().equals(getPatronId())
                && ((Loan) rhs).getResourceId().equals(getResourceId());
    }

    @Override
    public int hashCode() {
        return getResourceId().hashCode() * getPatronId().hashCode();
    }
```

We need to make two more updates to get rid of this foreign key constraint.

**Update LoanDaoBean**
```java
    public void remove(final Loan l) {
        l.remove();
        getEm().flush();
        getEm().remove(l);
    }
```

**Update Loan**
```java
    public void remove() {
        getPatron().removeLoan(this);
        getResource().setLoan(null);
    }
```

**One Final Change**
Here's one more thing that has to do with how JPA reads JoinTables. In the case of our Loan join table, it will read two records for each one record. (Insert reference as to why.) There is an easy fix. In the Patron we store a List<Loan>, change this to Set<Loan> and update all of the related code in Loan get it to compile. There are two kinds of replacements you'll have to make:
* Replace all occurrences of **List<Loan>** with **Set<Loan>**
* Replace all occurrences of **ArrayList<Loan>()** with **HashSet<Loan>()**

Finally, run the test to verify that it now works.

### returnResourceLate
We have three problems with this test:
* Detached Object
* Lazy relationship
* Using List where we should use a Set

To fix the detached object problem, look up the patron after returning the resource and just before the asserts.

To fix the lazy relationship, add fetch=FetchType.EAGER to the fines attribute.

To fix the List<Fine>, replace all List<Fine> with Set<Fine> and also replace all ArrayList<Fine>() with HashSet<Fine>().

### returnResourceThatsNotCheckedOut
We are throwing an exception, ResourceNotCheckedOut, that has not had the @ApplicationException annotation added to it.

### checkoutBookThatIsAlreadyCheckedOut
Same problem as with the previous test.

### checkoutBookThatDoesNotExist
We should replace EntityNotFoundException with EntityDoesNotExist Exception.

### checkoutBookToPatronThatDoesNotExist
Same problem as the previous test.

### findOverdueBooks
This test is actually failing because of previous tests. Since we have not made our tests isolated, we cannot really fix this test. However, we can verify that this test is not broken. Clean up the database and run this test to verify that it works.

Here's the order in which you can drop all records from the database:
* author_book
* patron_fine
* fine
* author
* book
* loan
* patron
* dvd
* director
* book
* resource
* address

There are other orders you could use, but this one works.

If you'd like to add a temporary method to your test class to clean up after each test, here is one that will do it:
```java
    @After
    public void cleanupDatabase() {
        EntityManagerFactory f = Persistence.createEntityManagerFactory("lis");
        EntityManager em = f.createEntityManager();
        em.getTransaction().begin();
        em.createNativeQuery("delete from author_book").executeUpdate();
        em.createNativeQuery("delete from patron_fine").executeUpdate();
        em.createNativeQuery("delete from fine").executeUpdate();
        em.createNativeQuery("delete from author").executeUpdate();
        em.createNativeQuery("delete from loan").executeUpdate();
        em.createNativeQuery("delete from patron").executeUpdate();
        em.createNativeQuery("delete from dvd").executeUpdate();
        em.createNativeQuery("delete from director").executeUpdate();
        em.createNativeQuery("delete from book").executeUpdate();
        em.createNativeQuery("delete from resource").executeUpdate();
        em.createNativeQuery("delete from address").executeUpdate();
        em.getTransaction().commit();
    }
```
//**Notes**//
**Additional Jar**
To get this to work, you'll need to add an optional library to your classpath:
> ehcache-1.2.jar

If you've used the same directories as these instructions, you'll find the file here:
> C:\libs\jboss-EJB-3.0_Embeddable_ALPHA_9\optional-lib

**Possible Reordering**
Also, if you managed to fix the OneToOne, the order from above changes. Move dvd, directory book and resource before loan.

**This Is a Temporary Fix**
Note, once we work on making each of our tests isolated, we'll need to remove this method. And this method makes it impossible to look at the contents of the database after running the tests. It also slows things down and would not work with a pre-populated database. So this really is temporary scaffolding until we can get to the next phase of cleaning up properly after each test.

### patronsWithOverdueBooks
Same problem as above.

### payFineInsufficientFunds
InsufficientFunds needs to be an application exception.

### patronCannotCheckoutWithFines
PatronHasFines class should be an application exception.

### checkoutDvd
This is a detached object problem. After the call to checkout and before the asserts, make sure to get a fresh version of the dvd.

### returnDvdLate
This is a detached object problem. You need to update both the patron and the dvd before the asserts.

### checkoutDvdAndBook
This is a detached object problem. You need to update both the dvd and the book before the asserts.
----
# # Test Isolation 
Finally, we need to make our test clean up after themselves. Along the way we're going to have to make a few big changes to make all of this work. We'll clean up each test one after the other.

### addBook
This one is straightforward. We can use the method removeBookAndAuthors in the ResourceDaoBeanTest:
```java
    @Test
    public void addBook() {
        final Book b = createBook();

        try {
            final Set<Author> authors = b.getAuthors();
            final Resource found = library.findResourceById(b.getId());

            assertTrue(found instanceof Book);
            assertTrue(((Book) found).getAuthors().containsAll(authors));
        } finally {
            ResourceDaoBeanTest.removeBookAndAuthors(b);
        }
    }
```

To test this, make sure your database is clean. Next, comment out or delete the cleanupDatabase method (and make sure to get the annotation). Run this test by itself and verify that nothing remains in the database after executing the test.

### lookupBookThatDoesNotExist
This test creates no objects so no cleanup is necessary.

### addPatron
We have a method in PatronDaoBeanTest that we could use, but we need to make two changes:
# Make the method PatronDaoBeanTest.removePatron public and static
# Make the metho PatronDaoBeanTest.getDao() static

Once you've done that, you can change the test:
```java
    @Test
    public void addPatron() {
        final Patron p = createPatron();
        try {
            final Patron found = library.findPatronById(p.getId());
            assertNotNull(found);
        } finally {
            PatronDaoBeanTest.removePatron(p);
        }
    }
```

### lookupPatronThatDoesNotExist
This test creates no objects so no cleanup is necessary.

### checkoutBook
When we checkout a book, we create a loan. So in addition to removing the two books and patrons that are created as a result of this test, we must also remove the loan.

This one requires a bit more work. First the updated test:
```java
    @Test
    public void checkoutBook() {
        final Book b1 = createBook();
        final Book b2 = createBook();
        final Patron p = createPatron();

        try {
            library.checkout(p.getId(), CURRENT_DATE, b1.getId(), b2.getId());

            final List<Resource> list = library
                    .listResourcesOnLoanTo(p.getId());

            assertEquals(2, list.size());

            for (Resource r : list) {
                assertTrue(r.isOnLoanTo(p));
                assertTrue(r.dueDateEquals(CURRENT_PLUS_14));
            }
        } finally {
            library.removePatron(p.getId());
            ResourceDaoBeanTest.removeBookAndAuthors(b1);
            ResourceDaoBeanTest.removeBookAndAuthors(b2);
        }
    }
```

The finally block uses a method Library.removePatron that is new. We need to add it both to the Library interface and provide an implementation for this method in the LibraryBean:
```java
    public void removePatron(Long id) {
        final Patron found = findPatronById(id);

        final Set<Loan> loans = found.getCheckedOutResources();
        found.setCheckedOutResources(null);

        for (Loan l : loans) {
            getLoanDao().remove(l);
        }

        final Set<Fine> fines = found.getFines();
        found.setFines(null);

        for (Fine f : fines) {
            removeFine(f);
        }

        patronDao.removePatron(id);
    }

    public void removeFine(final Fine f) {
        getResourceDao().removeFind(f);
    }
```

We also added the method ResourceDao.removeFine. We need to add it to the interface and to ResourceDaoBean:
```java
    public void removeFind(final Fine f) {
        final Fine found = getEm().find(Fine.class, f.getId());
        if (found != null) {
            getEm().remove(found);
        }
    }
```

### returnBook
Give the support for removing patrons, we can now use that in the returnBook test. Here's the skeleton:
```java
        final Book b = createBook();
        final Patron p = createPatron();
        
        try {

            // ... unchanged ...

        } finally {
            library.removePatron(p.getId());
            ResourceDaoBeanTest.removeBookAndAuthors(b);
        }
```

### returnResourceLate
This test can use the same skeleton as returnBook to clean up after itself.

### returnResourceThatsNotCheckedOut
This test only needs to remove a book. Follow the skeleton from returnBook.

### checkoutBookThatIsAlreadyCheckedOut
Remove the two Patrons then remove the book. Follow the skeleton from returnBook.

### checkoutBookThatDoesNotExist
Remove the created patron. Follow the skeleton from returnBook.

### checkoutBookToPatronThatDoesNotExist
Remove the created book. Follow the skeleton from returnBook.

### findOverdueBooks
Remove the patron that is created then the two books. Follow the skeleton from returnBook.

### patronsWithOverdueBooks
Remove the patron that is created then the two books. Follow the skeleton from returnBook.

### calculateTotalFinesForPatron
Remove the patron that is created then the two books. Follow the skeleton from returnBook.

### payFineExactAmount
Up to this point we were doing so well. Unfortunately, when we pay fines, we remove fines from our entities but we do not remove them properly. You can tell this by stepping through the code and the useful stack trace.

To fix this, we need to add just a bit of infrastructure. First the background. When we call Library.tenderFine(), a message goes to Patron. The patron removes fines from its collection based on the amount tendered and then returns the balance. Unfortunately, the fines removed from its collection need to be deleted. So we have two options:
* The Patron entity uses some Dao to remove the Fine entities from the database
* The Patron dao returns both the fines remove and the balance and lets the caller deal with the fined.

The first option potentially creates a circular dependency and also has and entity dealing with the database, which we have not had to do so far. We'll take option 2. Here are all the necessary changes.

**FinesPaidAndBalance**
```java
package complexreturns;

import java.util.List;

import entity.Fine;

public class FinesPaidAndBalance {
    final private List<Fine> finesPaid;
    final private double balance;
    
    public FinesPaidAndBalance(final List<Fine> finesPaid, final double balance) {
        this.finesPaid = finesPaid;
        this.balance = balance;
    }

    public double getBalance() {
        return balance;
    }

    public List<Fine> getFinesPaid() {
        return finesPaid;
    }
}
```

**Patron.pay**
```java
    public FinesPaidAndBalance pay(final double amountTendered) {
        double totalFines = calculateTotalFines();
        if (totalFines <= amountTendered) {
            List<Fine> finesPaid = new ArrayList<Fine>(getFines().size());
            finesPaid.addAll(getFines());
            getFines().clear();
            return new FinesPaidAndBalance(finesPaid, amountTendered
                    - totalFines);
        } else {
            throw new InsufficientFunds();
        }
    }
```

**LibraryBean.tenderFine**
```java
    public double tenderFine(final Long patronId, double amountTendered) {
        final Patron p = getPatronDao().retrieve(patronId);
        final FinesPaidAndBalance finesPaid = p.pay(amountTendered);

        for (Fine f : finesPaid.getFinesPaid()) {
            removeFine(f);
        }

        return finesPaid.getBalance();
    }
```

### payFineInsufficientFunds
Remove the created patron and book. Follow the skeleton from returnBook.

### patronCannotCheckoutWithFines
Remove the created patron and book following the skeleton from returnBook.

### checkoutDvd
Remove the patron following the skeleton from returnBook.

Your challenge is to somehow call the ResourceDao.remove() method passing in the id of the dvd. You'll also need to remove the director.

### returnDvdLate
Remove the patron following the skeleton from returnBook.

Your challenge is to somehow call the ResourceDao.remove() method passing in the id of the dvd. You'll also need to remove the director.

### checkoutDvdAndBook

Remove the patron and the book using the skeleton from returnBook.

Your challenge is to somehow call the ResourceDao.remove() method passing in the id of the dvd. You'll also need to remove the director.