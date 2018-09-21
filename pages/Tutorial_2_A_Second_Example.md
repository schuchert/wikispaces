---
title: Tutorial_2_A_Second_Example
---
There are several things for which we need some support code:
* Per test method setup
* Per test method cleanup
* One-time logger initialization
* Inserting a single record

Before putting all of this together, let's examine each of these things.
### Per test method setup
{% highlight java %}
public class JpaApiTests {
    private EntityManagerFactory emf;
    private EntityManager em;

    @Before
    public void initEmfAndEm() {
        emf = Persistence.createEntityManagerFactory("examplePersistenceUnit");
        em = emf.createEntityManager();
    }
    //...
}
{% endhighlight %}

This creates two fields. We then use the JUnit 4 @Before annotation to initialize that before the execution of each individual unit test. For details, please see [here](JUnit_4.xAtBefore).

### Per test method cleanup
{% highlight java %}
    @After
    public void closeEmfAndEm() {
        em.close();
        emf.close();
    }
{% endhighlight %}
This example uses the JUnit 4 @After annotation to cleanup up resources we've allocation after the execution of each individual unit test. For details, please see [here](JUnit_4.xAtAfter).

### One-time logger initialization
{% highlight java %}
    @BeforeClass
    public static void initializeLogging() {
        BasicConfigurator.configure();
        Logger.getLogger("org").setLevel(Level.ERROR);
    }
{% endhighlight %}
This example uses the JUnit 4 @BeforeClass annotation to perform one-time initialization for the whole class. For details, please see [here](JUnit_4.xAtBeforeClass).

In this case, the first line in the method performs basic configuration of the Log4J logging system. The second line sets the default logging level for any class whose package starts with **org** to ERROR. This significantly reduces the output. It is possible to reduce the output one level further by setting it to FATAL.

### Inserting a single record
{% highlight java %}
    private int insertPerson() {
        final Address a1 = new Address("A Rd.", "", "Dallas", "TX", "75001");
        final Person p1 = new Person("Brett", 'L', "Schuchert", a1);

        if (!em.getTransaction().isActive()) {
            em.getTransaction().begin();
        }
        em.persist(p1);
        return p1.getId();
    }
{% endhighlight %}

### Rewrite and New Method
With these changes in hand, we can rewrite the previous test method as follows:
{% highlight java %}
    @Test
    public void example1InsertTwoPeople() {
        insertPerson();
        insertPerson();

        final int numberFound = em.createQuery("Select p from Person p")
                .getResultList().size();
        assertEquals(2, numberFound);
    }
{% endhighlight %}

Here's a second test to justify all of this refactoring.
{% highlight java %}
    @Test
    public void example2() {
        final int primaryKey = insertPerson();
        final Person p = (Person) em.find(Person.class, primaryKey);
        assertNotNull(p);
    }
{% endhighlight %}

### Putting it all Together
And finally, here's all of the above changes together in one place.
{% highlight java %}
package entity;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class JpaApiTests {
    private EntityManagerFactory emf;
    private EntityManager em;

    @BeforeClass
    public static void initializeLogging() {
        BasicConfigurator.configure();
        Logger.getLogger("org").setLevel(Level.ERROR);
    }

    @Before
    public void initEmfAndEm() {
        emf = Persistence.createEntityManagerFactory("examplePersistenceUnit");
        em = emf.createEntityManager();
    }

    @After
    public void closeEmfAndEm() {
        em.close();
        emf.close();
    }

    @Test
    public void example1InsertTwoPeople() {
        insertPerson();
        insertPerson();

        final int numberFound = em.createQuery("Select p from Person p")
                .getResultList().size();
        assertEquals(2, numberFound);
    }

    @Test
    public void example2() {
        final int primaryKey = insertPerson();
        final Person p = (Person) em.find(Person.class, primaryKey);
        assertNotNull(p);
    }

    private int insertPerson() {
        final Address a1 = new Address("A Rd.", "", "Dallas", "TX", "75001");
        final Person p1 = new Person("Brett", 'L', "Schuchert", a1);

        if (!em.getTransaction().isActive()) {
            em.getTransaction().begin();
        }
        em.persist(p1);
        return p1.getId();
    }
}
{% endhighlight %}

