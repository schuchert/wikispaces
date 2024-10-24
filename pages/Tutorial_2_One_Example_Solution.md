---
title: Tutorial_2_One_Example_Solution
---
{% highlight java %}
package entity;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.Persistence;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.hibernate.hql.ast.QuerySyntaxException;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class QueriesTest extends Assert {
    private EntityManagerFactory emf;
    private EntityManager em;

    @BeforeClass
    public static void initLogger() {
        // Produce minimal output.
        BasicConfigurator.configure();

        // Comment this line to see a lot of initialization
        // status logging.
        Logger.getLogger("org").setLevel(Level.ERROR);
    }

    @Before
    public void initEmfAndEm() {
        emf = Persistence.createEntityManagerFactory("examplePersistenceUnit");
        em = emf.createEntityManager();
    }

    @After
    public void closeEmAndEmf() {
        em.close();
        emf.close();
    }

    @Test(expected = IllegalArgumentException.class)
    public void unsuccessfulWithBadExceptionThrownEmptyQuery() {
        Logger.getLogger("org").setLevel(Level.FATAL);
        try {
            // This one got me and I wasted several hours looking at
            // the wrong rabbit hole. I was paying attention to the
            // error but not looking at the line that was failing.
            em.createQuery("");
        } finally {
            Logger.getLogger("org").setLevel(Level.ERROR);
        }
    }

    @Test
    public void unsuccessfulUnknownClass() {
        try {
            // This fails because IncorrectClassName is not registered.
            // If we were using JEE rather than JSE, this implies that
            // there is no class named IncorrectClassName anywhere
            // in the class path that has the @Entity annotation (or
            // is mapped via XML).
            em.createQuery("from IncorrectClassName");
        } catch (IllegalArgumentException e) {
            assertEquals(e.getCause().getClass(), QuerySyntaxException.class);
            assertEquals(
                    ("org.hibernate.hql.ast.QuerySyntaxException: " + 
                    "IncorrectClassName is not mapped " +
                    "[from IncorrectClassName]"),
                    e.getMessage());
        }
    }

    @Test
    public void successfulNotUsingSelect() {
        em.createQuery("from Person").getResultList();
    }

    @Test
    public void successfulSingleResult() {
        clearPersonTable();
        insertPerson();

        // This query has the potential to fail since it is returning
        // all Person entities, but it does not because I've only
        // inserted one.
        final Person p = (Person) em.createQuery("from Person")
                .getSingleResult();
        assertEquals("Brett", p.getFirstName());
    }

    @Test(expected = NoResultException.class)
    public void unsuccessfulSingleResultNoEntries() {
        // Notice that if we just want to get all rows from
        // an Entity's table, this is the minimal query
        em.createQuery("from Person").getSingleResult();
    }

    @Test(expected = NonUniqueResultException.class)
    public void unsuccessfulSingleResultTooManyEntries() {
        insertPerson();
        insertPerson();

        // This will fail because we expect a single result
        // but in fact there are 2 results returned.
        em.createQuery("from Person").getSingleResult();
    }

    @Test
    public void successfulFindByPrimaryKey() {
        final int personKey = insertPerson();

        // Note, we provide Person.class as the first parameter
        // so the underling method, which is a generic method
        // can return the right type. Also, because we provide
        // the class, the only thing that might happen is that
        // we do not find a Person in the Person table. It is
        // not possible for find to return the wrong type since
        // it picks up its table name from the Person.class.
        final Person p = em.find(Person.class, personKey);
        assertEquals("Brett", p.getFirstName());
    }

    @Test
    public void unsuccessfulLookupByKeyNothingFound() {
        clearPersonTable();

        // Note the lack of an "expected = ..." in the @Test
        // annotation. Find returns null if it cannot find
        // the object with the provided key. It does not throw
        // an exception.
        final Person p = em.find(Person.class, -42);
        assertNull(p);
    }

    @Test
    public void successfulSearchUsingQueryParameter() {
        insertPerson();

        // Note, the return type of this method is List<?>, not List<Person>.
        // See the next method for the other option...
        final List<?> list = em.createQuery("from Person where firstName = ?1")
                .setParameter(1, "Brett").getResultList();
        assertEquals(1, list.size());
    }

    /**
     * This method does the same thing as the one above it. But to avoid a
     * warning about type safety I am using the annotation
     * 
     * @SuppressWarnings. When you start writing Data Access Objects, you'll
     *                    probably go this route.
     * 
     * For those of you who know generic parameters, it is not possible to get
     * this to work in a type-safe manner due to "erasure." Look up "java
     * generics erasure".
     * http://today.java.net/pub/a/today/2003/12/02/explorations.html
     */

    @SuppressWarnings("unchecked")
    @Test
    public void theOtherOption() {
        insertPerson();

        final List<Person> list = em.createQuery(
                "from Person where firstName = ?1").setParameter(1, "Brett")
                .getResultList();
        assertEquals(1, list.size());

    }

    @Test
    public void successfulSameInMemoryObjectsReturnedFromDifferntQueries() {
        final int personKey = insertPerson();

        final Person pByKey = em.find(Person.class, personKey);

        final Person pByWhere = (Person) em.createQuery(
                "SELECT p from Person p where firstName='Brett'")
                .getSingleResult();

        // are these objects == (same object in memory)?
        assertSame(pByKey, pByWhere);
    }

    @Test(expected = IllegalArgumentException.class)
    public void unsuccessfulCaseWrongOnClass() {
        // fails because we're naming a class, not a table
        // So instead of PERSON we must use Person
        em.createQuery("from PERSON").getSingleResult();
    }

    @Test(expected = IllegalArgumentException.class)
    public void unsuccessfulWrongFieldNameUsedInWhereWithNamedPerson() {
        insertPerson();

        // failes because the attribute is not called FirstName but
        // is instead called firstName (first letter should be
        // lower case following the java beans standard.
        em.createQuery("from Person p where p.FirstName='Brett'");
    }

    @Test
    public void successfulColumnNameNotCaseSensitive() {
        insertPerson();

        // Note that we are not qualifying FirstName with p,
        // so it is interpreted as a column name rather than
        // a fieldName that must follow java beans naming
        // conventions
        em.createQuery("from Person p where FirstName='Brett'").getResultList();
    }

    @Test(expected = IllegalArgumentException.class)
    public void unsuccessfulSettingParamterWithWrongIndex() {
        // Indexes are 1-based, not 0-based.
        em.createQuery("from Person p where FirstName='Brett'").setParameter(0,
                "Brett");
    }

    @Test(expected = IllegalArgumentException.class)
    public void unsuccessfulSettingParameterWhereThereAreNone() {
        // There's no parameter here, this simply fails
        em.createQuery("from Person p where FirstName='Brett'").setParameter(1,
                "Brett");
    }

    @Test(expected = IllegalArgumentException.class)
    public void unsuccessfulDoNotQuoteStringParameters() {
        em.createQuery("from Person p where FirstName='?1'").setParameter(1,
                "Brett");
    }

    /**
     * Even though we **begin** a transaction, we never commit it. So when we
     * close the em, nothing that was flushed will actually be committed.
     * 
     */
    private int insertPerson() {
        final Address a1 = new Address("A Rd.", "", "Dallas", "TX", "75001");
        final Person p1 = new Person("Brett", 'L', "Schuchert", a1);

        if (!em.getTransaction().isActive()) {
            em.getTransaction().begin();
        }
        em.persist(p1);
        return p1.getId();
    }

    private void clearPersonTable() {
        if (!em.getTransaction().isActive()) {
            em.getTransaction().begin();
        }

        em.createQuery("delete from Person").executeUpdate();
    }
}
{% endhighlight %}
