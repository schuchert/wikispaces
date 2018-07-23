---
title: Ejb3_Tutorial_3_-_ResourceDao
---
## # Update Dao 
# Rename ResourceDao --> ResourceDaoBean
# Add @Stateless annotation to ResourceDaoBean
# Extract interface ResourceDao from ResourceDaoBean

## # Update Test 
# Rename ResourceDaoTest --> ResourceDaoBeanTest
# Remove Base Class
# Remove dao attribute
# Rewrite getDao() to return a looked up ResourceDao
# Add method with @BeforeClass annotation that initializes the container

## # Run Your Tests (ResourceDaoBeanTest): First Failures 
After making these changes, we have 3 tests that pass and one that fails. The error in the JUnit stack trace looks like this: 
```org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role: entity.Book.authors, no session or session was closed```

Here's the actual test:
```java
01:    @Test
02:    public void updateABook() {
03:        final Book b = createABookImpl();
04:        final int initialAuthorCount = b.getAuthors().size();
05:        b.addAuthor(new Author(new Name("New", "Author")));
06:        getDao().update(b);
07:        final Resource found = getDao().retrieve(b.getId());
08:        assertTrue(found instanceof Book);
09:        assertEquals(initialAuthorCount + 1, ((Book) found).getAuthors().size());
10:    }
```

If you double-click on the last line listed in the stack trace, it will show the last line, line 9, as the problem line. When we retrieve the authors() from found, there's no problem -- yet. When we ask the object returned from getAuthors() for its size(), we're accessing not a collection but a proxy to a collection. Remember that the object found is detached. Why? We are no longer in a method in the container, we have returned from the method. When we returned, the transaction committed and all objects in the persistence context were detached. The author’s relationship is lazily loaded by default (because it is a @ManyToMany and that's the default behavior).

We have three ways to fix this problem:
# Use Eager fetching
# Directly access the collection **while still in the session bean method** to get it initialized (read in)
# Change the test to send a message to the ResourceDao to ask for the number of authors associated with a particular book

We'll take the easiest way out to fix this and make this relationship eagerly fetched rather than lazily fetched. Here's the change to Book.java:
```java
    @ManyToMany(mappedBy = "booksWritten", cascade = { CascadeType.PERSIST,
            CascadeType.MERGE }, fetch = FetchType.EAGER)
    private Set<Author> authors;
```

The change there is adding **fetch = FetchType.EAGER**

## # Try #2 
When you run this, things still do not work. This is a bi-directional relationship. However, while we are adding an author to the book, we are not adding the book to the author. Remember that we must maintain both sides of a bi-directional relationship. Update the addAuthor() method in book to add the book to the author:
```java
    public void addAuthor(final Author author) {
        getAuthors().add(author);
        author.addBook(this);
    }
```

Run the tests in ResourceDaoBeanTest. Now more tests are failing. This is getting worse before it gets better.

## # Nearly Finally Fixed 

There's a method in Author.java that looks like this:
```java
    public void addBook(final Book b) {
        booksWritten.add(b);
        b.addAuthor(this);
    }
```

The problem is, the booksWritten attribute is never assigned. Here's a way to fix this:
# Change booksWritten to getBookWritten()
# Lazily initialize booksWritten

```java
    public void addBook(final Book b) {
        getBooksWritten().add(b);
    }

    public Set<Book> getBooksWritten() {
        if(booksWritten == null) {
            booksWritten = new HashSet<Book>();
        }
        
        return booksWritten;
    }
```

## # Finally All of ResourceDaoBaseTest Running 

We're close. The problem is since we started properly maintaining a bi-directional relationship between books and authors; JPA is automatically inserting two foreign keys in to a join table called AUTHOR_BOOK. Well to remove the book, we need to remove the relationship between the book and the authors (both sides).

Here is the challenge. We have one dao, ResourceDao, which removes both books and dvd's as well as all kinds of resources. The book has a dependency on Author that not all resources have. So how can we still use the ResourceDao to remove a book if the book has specific logic? Here are two options:
# Use type-checking in the ResourceDao to do custom delete logic based on type
# Have the resource dao delegate a message to all resources polymorphically, the book will take care of specific clean-up logic

Type checking is not always bad, just mostly always. We won't even consider that because polymorphism is the way to go here. Here are the three steps we're going to follow:
# Create an abstract method in Resource called remove().
# Add an empty implementation of this method to Dvd so it will compile
# Add an implementation into Book to clean up all of its relationships
# Add any required supporting methods in other classes
# Make sure to actually call the remove method in the ResourceDao

**Add abstract method to Resource**
```java
    public abstract void remove();
```

**Add empty implementation to Dvd**
```java
    @Override
    public void remove() {
    }
```

**Add implementation to Book**
```java
    @Override
    public void remove() {
        for (Author a : getAuthors()) {
            a.removeBook(this);
        }
        getAuthors().clear();
    }
```

**Add removeBook to Author**
```java
    public void removeBook(final Book book) {
        getBooksWritten().remove(book);
    }
```

**Call the remove() method in ResourceDao**
Just after looking up the resource and just before actually removing it, we need to call the remove() method on the Resource object:
```java
    public void remove(Long id) {
        final Resource r = retrieve(id);
        if (r != null) {
            r.remove();
            getEm().remove(r);
        }
        getEm().flush();
    }
```
Run the tests and they now all pass.
----
# # Test Isolation 

Now that all of our tests in ResourceDaoBeanTest pass, we need to clean up after ourselves. Here are the stats:
|Table|# Rows|
|Author|7|
|Book|2|
|Author_Book|5|
|Resource|2|

We need to update each of the tests that create books and explicitly remove the books and authors created. It turns out we do not need to explicitly remove anything from Author_Book. Just updating the bi-directional relationships properly will fix that problem.

## # Delete Author 
To delete authors, we'll create a new Dao for Authors:
**AuthorDao**
```java
package session;

import java.util.Set;

import entity.Author;

public interface AuthorDao {
    void remove(final Set<Author> authors);
}
```

**AuthorDaoBean**
```java
package session;

import java.util.Set;

import javax.ejb.Stateless;

import entity.Author;
import entity.Book;

@Stateless
public class AuthorDaoBean extends BaseDao implements AuthorDao {
    public void remove(final Set<Author> authors) {
        for (Author a : authors) {
            final Author toDelete = getEm().find(Author.class, a.getId());
            for (Book b : toDelete.getBooksWritten()) {
                b.getAuthors().remove(toDelete);
            }
            toDelete.getBooksWritten().clear();
            getEm().flush();
            getEm().remove(toDelete);
        }
    }
}
```

## # Update Test 
**Support Methods**
First we need a few methods we can use to delete authors and books (we're working in ResourceDaoBeanTest, so this is a fine place to add these methods):
```java
    public void removeAuthors(final Set<Author> authors) {
        JBossUtil.lookup(AuthorDao.class, "AuthorDaoBean/local")
                .remove(authors);
    }

    public void removeBookAndAuthors(final Book book) {
        final Book b = (Book) getDao().findById(book.getId());
        getDao().remove(b.getId());
        removeAuthors(book.getAuthors());
    }
```

These methods are static because we might want to use them from other tests. However, to make them static, we must change getDao() to be a static method as well.

**Updated Tests**
Here are the updated tests that now use the support methods.
```java
    @Test
    public void createABook() {
        final Book b = createABookImpl();
        try {
            final Resource found = getDao().retrieve(b.getId());
            assertNotNull(found);
        } finally {
            removeBookAndAuthors(b);
        }
    }

    @Test
    public void removeABook() {
        final Book b = createABookImpl();
        try {
            Resource found = getDao().retrieve(b.getId());
            assertNotNull(found);
            getDao().remove(b.getId());
            found = getDao().retrieve(b.getId());
            assertNull(found);
        } finally {
            removeAuthors(b.getAuthors());
        }
    }

    @Test
    public void updateABook() {
        Book b = createABookImpl();

        try {
            final int initialAuthorCount = b.getAuthors().size();
            b.addAuthor(new Author(new Name("New", "Author")));
            getDao().update(b);
            b = (Book) getDao().retrieve(b.getId());
            assertEquals(initialAuthorCount + 1, b.getAuthors().size());
        } finally {
            removeBookAndAuthors(b);
        }
    }
```

Notice that we re-assign the variable b just before the assert equals and it is that updated version of b that is sent to removeBookAndAuthors(). Why do you suppose we need to do that?

At this point you might want to go back and verify that the tests in PatronDaoBeanTest still pass.
