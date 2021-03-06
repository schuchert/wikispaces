---
title: JPA_Tutorial_1_Entire_Source_Base
---
### Address.java
{% highlight java %}
package entity;

import javax.persistence.Embeddable;

@Embeddable
public class Address {
    private String streetAddress1;
    private String streetAddress2;
    private String city;
    private String state;
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

    public final String getCity() {
        return city;
    }

    public final void setCity(final String city) {
        this.city = city;
    }

    public final String getState() {
        return state;
    }

    public final void setState(final String state) {
        this.state = state;
    }

    public final String getStreetAddress1() {
        return streetAddress1;
    }

    public final void setStreetAddress1(final String streetAddress1) {
        this.streetAddress1 = streetAddress1;
    }

    public final String getStreetAddress2() {
        return streetAddress2;
    }

    public final void setStreetAddress2(final String streetAddress2) {
        this.streetAddress2 = streetAddress2;
    }

    public final String getZip() {
        return zip;
    }

    public final void setZip(final String zip) {
        this.zip = zip;
    }
}
{% endhighlight %}

### Person.java
{% highlight java %}
package entity;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Person {
    @Id
    @GeneratedValue
    int id;
    private String firstName;
    private char middleInitial;
    private String lastName;
    @ManyToOne(optional = true)
    private Company job;

    @Embedded
    private Address address;

    public Person() {
    }

    public Person(final String fn, final char mi, final String ln,
            final Address address) {
        setFirstName(fn);
        setMiddleInitial(mi);
        setLastName(ln);
        setAddress(address);
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public int getId() {
        return id;
    }

    public void setId(final int id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public char getMiddleInitial() {
        return middleInitial;
    }

    public void setMiddleInitial(final char middleInitial) {
        this.middleInitial = middleInitial;
    }

    public final Address getAddress() {
        return address;
    }

    public final void setAddress(final Address address) {
        this.address = address;
    }

    public Company getJob() {
        return job;
    }

    public void setJob(Company job) {
        this.job = job;
    }

    public boolean equals(final Object rhs) {
        if (rhs instanceof Person) {
            final Person other = (Person) rhs;
            return other.getLastName().equals(getLastName())
                    && other.getFirstName().equals(getFirstName())
                    && other.getMiddleInitial() == getMiddleInitial();
        }

        return false;
    }

    public int hashCode() {
        return getLastName().hashCode() * getFirstName().hashCode()
                * getMiddleInitial();
    }
}
{% endhighlight %}

### Company.java
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
    @OneToMany(mappedBy = "job")
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

    public void setEmployees(final Collection<Person> newStaff) {
        // fire everybody
        final Collection<Person> clone = new ArrayList<Person>(employees);

        for (Person p : clone) {
            fire(p);
        }

        for (Person p : newStaff) {
            hire(p);
        }
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
        p.setJob(this);
    }

    public void fire(final Person p) {
        getEmployees().remove(p);
        p.setJob(null);
    }
}
{% endhighlight %}

### TestBase.java
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

### CompanyTest.java
{% highlight java %}
package entity;

import static org.junit.Assert.assertEquals;

import java.util.List;

import javax.persistence.EntityManager;

import org.junit.Test;

public class CompanyTest extends TestBase {
    private Company findCompanyNamed(final EntityManager em, String name) {
        return (Company) em.createQuery(
                "select c from Company c where c.name=?1")
                .setParameter(1, name).getSingleResult();
    }

    @Test
    public void createCompany() {
        final Company c1 = new Company();
        c1.setName("The Company");
        c1.setAddress(new Address("D Rd.", "", "Paris", "TX", "77382"));

        em.getTransaction().begin();
        em.persist(c1);
        em.getTransaction().commit();

        final Company foundCompany = findCompanyNamed(em, "The Company");

        assertEquals("D Rd.", foundCompany.getAddress().getStreetAddress1());
        // Note, we do not need an assert. Why? the method getSingleResult()
        // will throw an exception if there is not exactly one
        // object found. We'll research that in the second JPA tutorial.
    }

    private Company createCompanyWithTwoEmployees() {
        final Company c1 = new Company();
        c1.setName("The Company");
        c1.setAddress(new Address("D Rd.", "", "Paris", "TX", "77382"));

        final List<Person> people = PersonTest.generatePersonObjects();
        for (Person p : people) {
            c1.hire(p);
        }

        em.getTransaction().begin();
        for (Person p : people) {
            em.persist(p);
        }
        em.persist(c1);
        em.getTransaction().commit();

        return c1;
    }

    @SuppressWarnings("unchecked")
    @Test
    public void createCompanyAndHirePeople() {
        createCompanyWithTwoEmployees();

        final List<Person> list = em.createQuery("select p from Person p")
                .getResultList();
        assertEquals(2, list.size());

        final Company foundCompany = (Company) em.createQuery(
                "select c from Company c where c.name=?1").setParameter(1,
                "The Company").getSingleResult();
        assertEquals(2, foundCompany.getEmployees().size());
    }

    @Test
    public void hireAndFire() {
        final Company c1 = createCompanyWithTwoEmployees();
        final List<Person> people = PersonTest.generatePersonObjects();

        em.getTransaction().begin();
        for (Person p : people) {
            c1.fire(p);
        }
        em.persist(c1);
        em.getTransaction().commit();

        final Company foundCompany = findCompanyNamed(em, "The Company");
        assertEquals(0, foundCompany.getEmployees().size());
    }
}
{% endhighlight %}

### PersonTest.java
{% highlight java %}
package entity;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

public class PersonTest extends TestBase {
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

    @SuppressWarnings("unchecked")
    @Test
    public void insertAndRetrieve() {
        final List<Person> people = generatePersonObjects();

        em.getTransaction().begin();
        for (Person p : people) {
            em.persist(p);
        }
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
