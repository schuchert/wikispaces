---
title: JPA_Tutorial_3_V1_First_Test_Suite
layout: default
---
### The Unit Tests
### A Little Context
Before we get started, this tutorial is deliberately organized in an inconvenient fashion. Why? My target reader is someone in a class I'm teaching (the material is open-source but still targeted). I do not want the student to be able to quickly just copy the whole thing and get it to work without having to put forth some effort. In a classroom situation, I have all of the source code available if I need to help a student get up to speed.

We'll start with a stripped down version of the requirements. This first test suite handles the following test cases:
* Create a Patron
* Remove a Patron
* Update a Patron
* Attempt to find Patron that does not exist.

Notice that this suite of tests is for Creating, Reading, Updating and Deleting (CRUD) Patrons.

Assuming you've done Tutorial 2, much of the boilerplate code is going to look the same. First let's write a unit test for each of these test cases:
### Create a Patron
{% highlight java %}
    @Test
    public void createAPatron() {
        final Patron p = createAPatronImpl();
        final Patron found = dao.retrieve(p.getId());

        assertNotNull(found);
    }

    private Patron createAPatronImpl() {
        final Address a = new Address("5080 Spectrum Drive", "Suite 700 West",
                "Addison", "TX", "75001");
        return dao.createPatron("Brett", "Schuchert", "972-555-1212", a);
    }
{% endhighlight %}

This test first creates a patron using a private utility method. This method exists because it is used later in other unit tests.

Looking at the test, it uses an attribute called **dao**. This is a Data Access Object (which we'll later convert to a stateless Session Bean). This Data Access Object will be responsible for retrieving, creating and removing Patrons.
### Remove a Patron
{% highlight java %}
    @Test
    public void removeAPatron() {
        final Patron p = createAPatronImpl();

        dao.removePatron(p.getId());
        final Patron found = dao.retrieve(p.getId());

        assertNull(found);
    }
{% endhighlight %}

This test uses the utility method to create a patron. It then removes it and makes sure that when we try to retrieve it that the Patron no longer exists.

### Update a Patron
{% highlight java %}
    @Test
    public void updateAPatron() {
        final Patron p = createAPatronImpl();

        final String originalPhoneNumber = p.getPhoneNumber();
        p.setPhoneNumber(NEW_PN);
        dao.update(p);
        final Patron found = dao.retrieve(p.getId());

        assertNotNull(found);
        assertFalse(NEW_PN.equals(originalPhoneNumber));
        assertEquals(NEW_PN, p.getPhoneNumber());
    }
{% endhighlight %}
We create a patron then update it.

### Attempt to find Patron that does not exist
{% highlight java %}
    @Test
    public void tryToFindPatronThatDoesNotExist() {
        final Long id = -18128129831298l;
        final Patron p = dao.retrieve(id);
        assertNull(p);
    }
{% endhighlight %}

Verify that when we try to find a patron that's not found, we get back null.

### Supporting Code
We have several veterans returning from previous tutorials. And here they are:

### PatronDaoTest
First the imports and the attributes. Note that this is a complete class that will compile. It just doesn't do anything yet.

{% highlight java %}
package session;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

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

import entity.Address;
import entity.Patron;

public class PatronDaoTest {
    private static final String NEW_PN = "555-555-5555";
    private EntityManagerFactory emf;
    private PatronDao dao;
}
{% endhighlight %}

### Initialization of the Logger
This is our 1-time initialization of the logging system.

{% highlight java %}
    @BeforeClass
    public static void initLogger() {
        // Produce minimal output.
        BasicConfigurator.configure();

        // Comment this line to see a lot of initialization
        // status logging.
        Logger.getLogger("org").setLevel(Level.ERROR);
    }
{% endhighlight %}

### Getting EMF and EM
Now before each unit test we'll look up the entity manager factory, create a dao, create an entity manager and pass it into a DAO and finally start a transaction.
{% highlight java %}
    @Before
    public void initEmfAndEm() {
        emf = Persistence.createEntityManagerFactory("lis");
        dao = new PatronDao();
        dao.setEm(emf.createEntityManager());
        dao.getEm().getTransaction().begin();
    }
{% endhighlight %}

### Clean up after each test
After each test we'll rollback the transaction we created in the pre-test initialization. We'll then close both the entity manager and entity manager factory. This keeps our tests isolated.
{% highlight java %}
    @After
    public void closeEmAndEmf() {
        dao.getEm().getTransaction().rollback();
        dao.getEm().close();
        emf.close();
    }
{% endhighlight %}

### The Entities
We need to create entities. These entities are a bit more well-specified that what you've seen in the previous tutorials. In most cases I believe the extra information is intuitive. Where it is not, I'll try to point out what is going on.

### Address.java
{% highlight java %}
package entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity  // The next class is a JPA entity
public class Address {
    @Id // The next attribute (in this case) or method is a key field
    @GeneratedValue // the key is auto-generated
    private Long id;
    @Column(length = 50) // the next column is 50 characters in size
    private String streetAddress1;
    @Column(length = 50)
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
### Patron.java
{% highlight java %}
package entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Entity
// the next class is a JPA entity
public class Patron {
    @Id
    @GeneratedValue
    private Long id;

    // when in the database, this field cannot be null, as an object in memory
    // it can
    @Column(length = 20, nullable = false)
    private String firstName;

    @Column(length = 30, nullable = false)
    private String lastName;

    @Column(length = 11, nullable = false)
    private String phoneNumber;

    // This next field refers to an object that is stored in another table.
    // All updates are cascaded. So if you persist me, my address, which is in
    // another table, will be persisted automatically. Updates and removes are
    // also cascaded automatically.
    @OneToOne(cascade = CascadeType.ALL)
    private Address address;

    public Patron(final String fName, final String lName, final String phone,
            final Address a) {
        setFirstName(fName);
        setLastName(lName);
        setPhoneNumber(phone);
        setAddress(a);
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
{% endhighlight %}

### Finally, the Data Access Object
The DAO has the following four methods:
* createPatron
* retrieve
* removePatron
* update

We'll look at each of these, although none of this will be new if you've looked at the first tutorial.
### createPatron
Given the information to create a patron, instantiate one and then persiste it. Note that this is written in a style that will natually fit into a Session Bean.
{% highlight java %}
    public Patron createPatron(final String fname, final String lname,
            final String phoneNumber, final Address a) {
        final Patron p = new Patron(fname, lname, phoneNumber, a);
        getEm().persist(p);
        return p;
    }
{% endhighlight %}

### retrieve
This uses the **find** method built into the entity manager. It returns null if not found. It first sees if the object is in the first-level cache. If not, it retrieves it from the database.
{% highlight java %}
    public Patron retrieve(final Long id) {
        return getEm().find(Patron.class, id);
    }
{% endhighlight %}

### removePatron
To remove an object we have to find it first. You do not provide a class and a key. So we first retrieve it (it might already be in the cache so this may not involve a database hit. We then issue the remove of the object.
{% highlight java %}
    public void removePatron(final Long id) {
        final Patron p = retrieve(id);
        if(p != null) {
            getEm().remove(p);
        }
    }
{% endhighlight %}
### update
Update uses the **merge** method to get its work done. Note that it returns what is returned from **merge**. Why? The provided patron could be detached (retrieve during another transaction or from a different instance of an entity manager. If this is the case, then the object will **not** be put into the cache (and therefore become managed). Instead, a new instance is created and the contents of the paramter is copied into the new, managed instance. That new managed instance is returned. If the provided patron is managed, then there's actually not need to even call this method because any changes made to the patron will be reflected in the patron after the transaction is closed.
{% highlight java %}
    public Patron update(final Patron p) {
        return getEm().merge(p);
    }
{% endhighlight %}

### The rest of the class
Here are the imports, attributes and getters/setters.
{% highlight java %}
package session;

import javax.persistence.EntityManager;

import entity.Address;
import entity.Patron;

public class PatronDao {
    private EntityManager em;

    public void setEm(final EntityManager em) {
        this.em = em;
    }

    public EntityManager getEm() {
        return em;
    }
}
{% endhighlight %}
