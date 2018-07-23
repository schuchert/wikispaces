---
title: Ejb_3_Tutorial_2_-_The_Entity_Model
---
### Creating the Entity Model
We need to create our entity model. There are three classes in it:
* Address
* Company
* Person

To create the basic classes:
# Select the **src** folder under **<project>**
# Right-click and select **New::Class**
# For the package, enter **entity**
# For the name, enter **Address**, **Company**, and **Person** respectively.

Type or enter the source provided below for each of the three classes.

### Changes
The entity model is changed slightly from the first JPA tutorial. There is one change in Company.java. Review that class' comments to understand that change. The quick summary is that we've added eager fetching to a relationship.

**Address.java**
```java
package entity;

import javax.persistence.Embeddable;

/**
 * There are no changes to this entity. Its embedded in the Person and Company
 * and as such, it is automatically fetched.
 */
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
}
```

**Company.java**
```java
package entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * There is one significant change to this Entity from the one we used in the
 * first JPA tutorial. Review the employees attribute for details on what and
 * why.
 */
@Entity
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @Embedded
    private Address address;

    /**
     * This attribute has one important (and significant change) from the
     * original Company.java. We've added eager fetching to this relationship.
     * By default, one to many relationships are lazily loaded. This means the
     * collection will not actually be brought back from the database unless it
     * is specifically used. So long as the Company instance is managed, this is
     * not a problem. Once the object is no longer managed, however, lazily
     * loaded references that have not been touched are not available (according
     * to the specification, what happens is undefined).
     * 
     * In the previous example, we did everything in a single transaction. But
     * now we have a transaction starting and stopping on each method in the
     * session bean, so as soon as we return from one of the session bean
     * methods, the transaction is closed. Once the transaction is closed, all
     * managed objects are flushed from the entity manager (and therefore no
     * longer managed).
     */
    @OneToMany(mappedBy = "job", cascade = { CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REFRESH }, fetch = FetchType.EAGER)
    private Collection<Person> employees = new ArrayList<Person>();

    public Company() {
    }

    public Company(final String name, final Address address,
            final Person... persons) {
        setName(name);
        setAddress(address);
        for (Person p : persons) {
            getEmployees().add(p);
        }
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(final Address address) {
        this.address = address;
    }

    public Collection<Person> getEmployees() {
        return employees;
    }

    public void setEmployees(final List<Person> newStaff) {
        // fire everybody
        final List<Person> clone = new ArrayList<Person>(employees);

        for (Person p : clone) {
            fire(p);
        }

        for (Person p : newStaff) {
            hire(p);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public void hire(final Person p) {
        employees.add(p);
        p.setJob(this);
    }

    public void fire(final Person p) {
        employees.remove(p);
        p.setJob(null);
    }

    @Override
    public boolean equals(final Object rhs) {
        if (rhs instanceof Company) {
            return ((Company) rhs).getId() == getId();
        }

        return false;
    }

    @Override
    public int hashCode() {
        return 101 * getId().hashCode();
    }
}
```

**Person.java**
```java
package entity;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Give the tests and assertions so far, there's no need to fix this problem.
 */
@Entity
public class Person {
    @Id
    @GeneratedValue
    int id;
    private String firstName;
    private char middleInitial;
    private String lastName;

    @Embedded
    private Address address;

    @ManyToOne
    private Company job;

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

    public Address getAddress() {
        return address;
    }

    public void setAddress(final Address address) {
        this.address = address;
    }

    public Company getJob() {
        return job;
    }

    public void setJob(Company job) {
        this.job = job;
    }

    @Override
    public boolean equals(final Object rhs) {
        if (rhs instanceof Person) {
            return ((Person) rhs).getId() == getId();
        }

        return false;
    }

    @Override
    public int hashCode() {
        return 101 * getId();
    }
}
```
