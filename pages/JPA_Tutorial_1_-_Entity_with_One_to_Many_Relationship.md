---
title: JPA_Tutorial_1_-_Entity_with_One_to_Many_Relationship
---
Now we'll make a company. In this first tutorial we're keeping things simple so we'll just create a Company that has a 1 to many relationship with People, who are its employees:

[#Company]({{site.pagesurl}}/#Company)
**Company.java**
{% highlight java %}
package entity;

import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Company {
    @Id
    @GeneratedValue
    int id;
    private String name;
    @Embedded
    private Address address;
    @OneToMany
    private Collection<Person> employees;

    public Company() {
    }

    public Company(final String name, final Address address,
            final Collection<Person> employees) {
        setName(name);
        setAddress(address);
        setEmployees(employees);
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(final Address address) {
        this.address = address;
    }

    public Collection<Person> getEmployees() {
        if (employees == null) {
            employees = new ArrayList<Person>();
        }
        return employees;
    }

    public void setEmployees(final Collection<Person> employees) {
        this.employees = employees;
    }

    public int getId() {
        return id;
    }

    public void setId(final int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public void hire(final Person p) {
        getEmployees().add(p);
    }

    public void fire(final Person p) {
        getEmployees().remove(p);
    }
}
{% endhighlight %}

### Factor out Common Test Code
We have some common initialization we can move up into a base since we are going to have two tests classes, PersonTest and CompanyTest:
**TestBase.java**
{% highlight java %}
package entity;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Before;

public class TestBase {
    protected EntityManagerFactory emf;
    protected EntityManager em;

    public TestBase() {
        super();
    }

    @Before
    public void initEmfAndEm() {
        BasicConfigurator.configure();
        Logger.getLogger("org").setLevel(Level.ERROR);

        emf = Persistence.createEntityManagerFactory("examplePersistenceUnit");
        em = emf.createEntityManager();
    }

    @After
    public void cleanup() {
        em.close();
    }
}
{% endhighlight %}

Update PersonTest.java to remove the two fields, emf and em and the initEmfAndEm() and cleanup() methods.
**PersonTest.java**
{% highlight java %}
package entity;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Test;

public class PersonTest extends TestBase {
    private final Address a1 = new Address("A Rd.", "", "Dallas", "TX", "75001");
    private final Person p1 = new Person("Brett", 'L', "Schuchert", a1);

    private final Address a2 = new Address("B Rd.", "S2", "OkC", "OK", "73116");
    private final Person p2 = new Person("FirstName", 'K', "LastName", a2);

    @SuppressWarnings("unchecked")
    @Test
    public void insertAndRetrieve() {
        em.getTransaction().begin();
        em.persist(p1);
        em.persist(p2);
        em.getTransaction().commit();

        final List<Person> list = em.createQuery("select p from Person p")
                .getResultList();

        assertEquals(2, list.size());
        for (Person current : list) {
            final String firstName = current.getFirstName();
            final String streetAddress1 = current.getAddress()
                    .getStreetAddress1();

            assertTrue(firstName.equals("Brett")
                    || firstName.equals("FirstName"));
            assertTrue(streetAddress1.equals("A Rd.")
                    || streetAddress1.equals("B Rd."));
        }
    }
}
{% endhighlight %}

Make sure everything is green before going on (rerun using **Ctrl-F11**).

Now we need to create a new CompanyTest class. Here's the first version:
{% highlight java %}
package entity;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class CompanyTest extends TestBase {
    @Test
    public void createCompany() {
        final Company c1 = new Company();
        c1.setName("The Company");
        c1.setAddress(new Address("D Rd.", "", "Paris", "TX", "77382"));

        em.getTransaction().begin();
        em.persist(c1);
        em.getTransaction().commit();

        final Company foundCompany = (Company) em.createQuery(
                "select c from Company c where c.name=?1").setParameter(1,
                "The Company").getSingleResult();

        assertEquals("D Rd.", foundCompany.getAddress().getStreetAddress1());
        // Note, we do not need an assert. Why? the method getSingleResult()
        // will throw an exception if there is not exactly one
        // object found. We'll research that in the second JPA tutorial.
    }
}
{% endhighlight %}
Run this unit test and make sure it is all green before going on (right-click in the source pane, select **Run As:JUnit Test**).

If you'd like to run all of your tests, right-click on the **test** folder, select **Run As:JUnit Test** and eclipse will execute all of your tests classes' test methods.

### Hire some people
We need to create some people and add them to the company. The PersonTest class already has some people. Rather than re-creating new people, let's update PersonTest to make those fields available. Update the a1, p1, a2, and p2 fields as follows:
{% highlight java %}
    public static List<Person> generatePersonObjects() {
        final List<Person> people = new ArrayList<Person>();
        final Address a1 = new Address("A Rd.", "", "Dallas", "TX", "75001");
        final Person p1 = new Person("Brett", 'L', "Schuchert", a1);

        final Address a2 = new Address("B Rd.", "S2", "OkC", "OK", "73116");
        final Person p2 = new Person("FirstName", 'K', "LastName", a2);

        people.add(p1);
        people.add(p2);

        return people;
    }
{% endhighlight %}

You will also need to update the beginning of the method insertAndRetrieve from:
{% highlight java %}
        em.getTransaction().begin();
        em.persist(p1);
        em.persist(p2);
        em.getTransaction().commit();
 
{% endhighlight %}

to: 

{% highlight java %}
        final List<Person> people = generatePersonObjects();

        em.getTransaction().begin();
        for (Person p : people) {
            em.persist(p);
        }
        em.getTransaction().commit();
{% endhighlight %}

Now we'll add a new test into CompanyTest to verify that we can hire people:
{% highlight java %}
    @SuppressWarnings("unchecked")
    @Test
    public void createCompanyAndHirePeople() {
        final Company c1 = new Company();
        c1.setName("The Company");
        c1.setAddress(new Address("D Rd.", "", "Paris", "TX", "77382"));

        List<Person> people = PersonTest.generatePersonObjects();
        for (Person p : people) {
            c1.hire(p);
        }

        em.getTransaction().begin();
        for (Person p : people) {
            em.persist(p);
        }
        em.persist(c1);
        em.getTransaction().commit();

        final List<Person> list = em.createQuery("select p from Person p")
                .getResultList();
        assertEquals(2, list.size());

        final Company foundCompany = (Company) em.createQuery(
                "select c from Company c where c.name=?1").setParameter(1,
                "The Company").getSingleResult();
        assertEquals(2, foundCompany.getEmployees().size());
    }
{% endhighlight %}

### Update persistence.xml
Again, given our environment, this step is optional.

**persistence.xml**
{% highlight xml %}
<persistence>
    <persistence-unit name="examplePersistenceUnit" 
                      transaction-type="RESOURCE_LOCAL">
        <class>entity.Person</class>
        <class>entity.Company</class>
        <properties>
            <property name="hibernate.show_sql" value="false" />
            <property name="hibernate.format_sql" value="false" />

            <property name="hibernate.connection.driver_class" 
                      value="org.hsqldb.jdbcDriver" />
            <property name="hibernate.connection.url" 
                      value="jdbc:hsqldb:mem:mem:aname" />
            <property name="hibernate.connection.username" 
                      value="sa" />

            <property name="hibernate.dialect" 
                      value="org.hibernate.dialect.HSQLDialect" />
            <property name="hibernate.hbm2ddl.auto" 
                      value="create" />
        </properties>
    </persistence-unit>
</persistence>
{% endhighlight %}

Make sure everything compiles and runs green.
