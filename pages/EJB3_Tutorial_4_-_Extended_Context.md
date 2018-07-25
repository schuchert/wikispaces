---
title: EJB3_Tutorial_4_-_Extended_Context
---
{:toc}
[<--Back]({{site.pagesurl}}/EJB_3_and_Java_Persistence_API)

# Ejb3 Tutorial 4 - Extended Context
A Stateful session bean can optionally use an extended context. An extended context maintains its managed objects between transactions or even in situation where a method is not using transactions. All objects accessed or created hang around until the bean goes away. This normally happens when a client executes a method that has been denoted as a Remove method (annotated with @Remove or declared as such in XML).

This short tutorial demonstrates some of the differences between these two types of container-managed contexts.

## Project Setup
The instructions for setting up your project mirror those from the first tutorial: [[EJB3_Tutorial_1_-_Create_and_Configure]].

For the remainder of this tutorial, when you see **<project>**, replace it with **Ejb3Tutorial4**.
[[include_page="Ejb3EclipseProjectSetupAndConfiguration"]]
Here are a few things to note (source for all of these items appears at the end after the assignments [[EJB3_Tutorial_4_-_Extended_Context#OtherFiles]]:
# Make sure you copy the **utils** directory from a previous tutorial.
# Make sure you copy a **persistence.xml** from a previous tutorial.
# Make sure you update the **persistence.xml**'s persistence-unit name:
```xml
<persistence-unit name="tolltag">
```

## The Entity Model

For this example, we have a simple entity model. We have an Account that has a bidirectional one-to-many relationship with TollTag objects and a bidirectional one-to-many relationship with Vehicle objects. Normally, one-to-many relationships are lazily fetched. For this example, the relationship with TollTag objects is left as lazily fetched while the relationship with Vehicle objects is eagerly fetched. 

**Account.java**
```java
package entity;

import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * This is a simple Account class that knows about toll tags and vehicles. An
 * account has a one to many relationship with both toll tags and vehicles. By
 * default, one to many relationships are lazily loaded. To demonstrate
 * differences between extended scope contexts and transaction-scoped contexts,
 * one of these relationships is eagerly fetched.
 */
@Entity
public class Account {
    @Id
    @GeneratedValue
    private Long id;

    /**
     * This relationship is lazily fetched. This means a client using a detached
     * Account will not be able to access tollTags unless the relationship was
     * touched while the object was still managed.
     */
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private Collection<TollTag> tollTags;

    /**
     * We eagerly fetch this relationship to show that doing so allows this
     * relationship to work if the object is or is not detached. NOTE: only
     * one "Collection" can have a fetch property of EAGER. If you want to
     * to use fetch = FetchType.EAGER more than once in the same class, the
     * other "Collections" will have to be "Set"s.
     */
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, 
               fetch = FetchType.EAGER)
    private Collection<Vehicle> vehicles;

    public Account() {
    }

    public Long getId() {
        return id;
    }

    public Collection<TollTag> getTollTags() {
        if (tollTags == null) {
            tollTags = new ArrayList<TollTag>();
        }

        return tollTags;
    }

    public Collection<Vehicle> getVehicles() {
        if (vehicles == null) {
            vehicles = new ArrayList<Vehicle>();
        }

        return vehicles;
    }

    public void addVehicle(final Vehicle vehicle) {
        getVehicles().add(vehicle);
        vehicle.setAccount(this);
    }

    public void removeVehicle(final Vehicle vehicle) {
        getVehicles().remove(vehicle);
        vehicle.setAccount(null);
    }

    public void addTollTag(final TollTag tollTag) {
        getTollTags().add(tollTag);
        tollTag.setAccount(this);
    }

    public void removeTollTag(final TollTag tt) {
        getTollTags().remove(tt);
        tt.setAccount(null);
    }
}
```

**TollTag.java**
```java
package entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import util.EqualsUtil;

/**
 * For some hard to decipher results, change the "FROM TollTag t" to "FROM
 * TollTag".
 */
@Entity
@NamedQueries( {
    @NamedQuery(name = "TollTag.associatedAccount", 
        query = "SELECT t.account FROM TollTag t WHERE tagNumber = :tagNumber"),
    @NamedQuery(name = "TollTag.byTolltagNumber", 
            query = "SELECT t FROM TollTag t WHERE tagNumber = :tagNumber") })
public class TollTag {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String tagNumber;

    @ManyToOne
    private Account account;

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getTagNumber() {
        return tagNumber;
    }

    public void setTagNumber(final String tagNumber) {
        this.tagNumber = tagNumber;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(final Account account) {
        this.account = account;
    }

    @Override
    public boolean equals(final Object rhs) {
        return rhs instanceof TollTag
                && EqualsUtil.equals(getTagNumber(), ((TollTag) rhs)
                        .getTagNumber());
    }

    @Override
    public int hashCode() {
        return getTagNumber().hashCode();
    }
}
```

**Vehicle.java**
```java
package entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import util.EqualsUtil;

@Entity
public class Vehicle {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Account account;

    private String make;
    private String model;
    private String year;
    private String license;

    public Vehicle() {
    }

    public Vehicle(final String make, final String model, final String year,
            final String license) {
        setMake(make);
        setModel(model);
        setYear(year);
        setLicense(license);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicense() {
        return license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    @Override
    public boolean equals(final Object object) {
        if (object instanceof Vehicle) {
            final Vehicle rhs = (Vehicle) object;

            return EqualsUtil.equals(getLicense(), rhs.getLicense())
                    && EqualsUtil.equals(getMake(), rhs.getMake())
                    && EqualsUtil.equals(getModel(), rhs.getModel())
                    && EqualsUtil.equals(getYear(), rhs.getYear());
        }

        return false;
    }

    @Override
    public int hashCode() {
        return getLicense().hashCode() * getMake().hashCode()
                * getModel().hashCode() * getYear().hashCode();
    }
}
```

# # The Session Beans

**AccountInventory.java**
```java
package session;

import javax.ejb.Local;

import entity.Account;

/**
 * This interface is a bit abnormal as it is being used for both a stateful and
 * stateless session bean. See individual method comments for clarification.
 */
@Local
public interface AccountInventory {
    void removeTag(final String tagNumber);

    Account findAccountByTagNumber(final String tagNumber);

    /**
     * Strictly speaking, this method is required only for transaction-managed
     * contexts. If you use a stateful session bean with an extended context,
     * then changed to any managed objects will eventually be written. There's
     * no need to actually call an update method.
     * 
     * If you have a stateless session bean or a stateful session bean using a
     * transaction-scoped context, then you need to call an update method after
     * making changes to an object outside of a bean because the object is no
     * longer managed.
     */
    Account updateAccount(final Account account);

    /**
     * When do updates happen to objects managed by an extended-context manager?
     * Answer, when the client calls a so-called remove method (annotated with
     * -at- Remove or denoted so in an XML file).
     * 
     * This method serves no purpose for a stateless session bean. For a
     * stateful session bean using an extended context, when the client calls
     * this method, the container knows it is time to write all of the changes
     * it has been tracking to the database.
     * 
     */
    void finish();

    Account findAccountById(final Long id);

    void removeAccount(final Account account);

    void createAccount(final Account account);
}
```

**AccountInventoryBean.java**
```java
package session;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import entity.Account;
import entity.TollTag;

@Stateless
public class AccountInventoryBean implements AccountInventory {
    @PersistenceContext(unitName = "tolltag")
    private EntityManager em;

    public EntityManager getEm() {
        return em;
    }

    public void createAccount(final Account account) {
        getEm().persist(account);
    }

    public Account findAccountById(final Long id) {
        return getEm().find(Account.class, id);
    }

    public void removeTag(final String tagNumber) {
        final TollTag tt = (TollTag) getEm().createNamedQuery(
                "TollTag.byTollTagNumber").setParameter("tagNumber", tagNumber)
                .getSingleResult();
        final Account account = tt.getAccount();
        account.removeTollTag(tt);
        tt.setAccount(null);
        getEm().remove(tt);
        getEm().flush();
    }

    public Account findAccountByTagNumber(final String tagNumber) {
        return (Account) getEm().createNamedQuery("TollTag.associatedAccount")
                .setParameter("tagNumber", tagNumber).getSingleResult();
    }

    public Account updateAccount(final Account account) {
        return getEm().merge(account);
    }

    public void finish() {
        // Do nothing, I'm really for the extended example
    }

    public void removeAccount(final Account account) {
        final Account toRemove = getEm().merge(account);
        getEm().remove(toRemove);
        getEm().flush();
    }
}
```

**AccountInventoryExtendedBean.java**
```java
package session;

import javax.ejb.Remove;
import javax.ejb.Stateful;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;

import entity.Account;
import entity.TollTag;

@Stateful
public class AccountInventoryExtendedBean implements AccountInventory {
    @PersistenceContext(unitName = "tolltag", 
                        type = PersistenceContextType.EXTENDED)
    private EntityManager extendedEm;

    public EntityManager getEm() {
        return extendedEm;
    }

    public Account findAccountById(final Long id) {
        return getEm().find(Account.class, id);
    }

    public Account findAccountByTagNumber(final String tagNumber) {
        return (Account) getEm().createNamedQuery("TollTag.associatedAccount")
                .setParameter("tagNumber", tagNumber).getSingleResult();
    }
    
    public void createAccount(final Account account) {
        getEm().persist(account);
    }

    public Account updateAccount(final Account account) {
        return account;
    }

    @Remove
    public void finish() {
    }

    public void removeTag(String tagNumber) {
        final TollTag tt = (TollTag) getEm().createNamedQuery(
                "TollTag.byTollTagNumber").setParameter("tagNumber", tagNumber)
                .getSingleResult();
        final Account account = tt.getAccount();
        account.removeTollTag(tt);
        tt.setAccount(null);
        getEm().remove(tt);
        getEm().flush();
    }

    public void removeAccount(final Account account) {
        getEm().remove(account);
        getEm().flush();
    }
}
```

## The Tests

This class performs the same two test algorithms two times each for a total of 4 test methods:
|**Name**|**Scope**|**Accesses**|**Expected**|
|createExampleUsingVehiclesTransactionScoped|Transaction|Vehicles|Success|
|createExampleUsingVehiclesExtendedScoped|Extended|Vehicles|Success|
|createExampleUsingTollTagsTransactionScoped|Transaction|TollTags|Fails|
|createExampleUsingTollTagsExtendedScoped|Extended|TollTags|Success|

**AccountInventoryBeanTest.java**
```java
package session;
 
import static org.junit.Assert.assertEquals;
 
import org.junit.BeforeClass;
import org.junit.Test;
 
import util.JBossUtil;
import entity.Account;
import entity.TollTag;
import entity.Vehicle;
 
public class AccountInventoryBeanTest {
    @BeforeClass
    public static void initContainer() {
        JBossUtil.startDeployer();
    }
 
    public static AccountInventory getInventory() {
        return JBossUtil.lookup(AccountInventory.class,
                "AccountInventoryBean/local");
    }
 
    public static AccountInventory getExtendedInventory() {
        return JBossUtil.lookup(AccountInventory.class,
                "AccountInventoryExtendedBean/local");
    }
 
    public static TollTag instantiateTollTag() {
        final TollTag tt = new TollTag();
        tt.setTagNumber("1234567890");
        return tt;
    }
 
    public static Vehicle instantiateVehicle() {
        return new Vehicle("Subaru", "Outback", "2001", "YBU 155");
    }
 
    /**
     * This method creates an account, looks it up and then accesses the toll
     * tags relationship. The toll tags relationship is lazily loaded. If the
     * passed-in bean is one that uses a transaction-managed context, then the
     * assert will fail because the relationship has not been initialized.
     * 
     * On the other hand, if the bean is one that uses an extended persistence
     * context, then the assert will pass because the relationship, will still
     * lazily loaded, will get initialized when accessed since the account
     * object is still managed.
     */
    private void createExampleTestTollTagsImpl(final AccountInventory bean) {
        final Account account = new Account();
        account.addTollTag(instantiateTollTag());
        account.addVehicle(instantiateVehicle());
 
        bean.createAccount(account);
 
        try {
            final Account found = bean.findAccountById(account.getId());
            assertEquals(1, found.getTollTags().size());
        } finally {
            bean.finish();
            getInventory().removeAccount(account);
        }
    }
 
    /**
     * As a counter example to createExampleTestTollTagsImpl, this method
     * follows the same step but instead uses the vehicles relationship. Since
     * this relationship has been set to fetch eagerly, it is available
     * regardless of whether or not the account object is still managed.
     */
    private void createExampleTestVehiclesImpl(final AccountInventory bean) {
        final Account account = new Account();
        account.addTollTag(instantiateTollTag());
        account.addVehicle(instantiateVehicle());
 
        bean.createAccount(account);
 
        try {
            final Account found = bean.findAccountById(account.getId());
            assertEquals(1, found.getVehicles().size());
        } finally {
            bean.finish();
            getInventory().removeAccount(account);
        }
    }
 
    @Test
    public void createExampleUsingVehiclesTransactionScoped() {
        createExampleTestVehiclesImpl(getInventory());
    }
 
    @Test
    public void createExampleUsingVehiclesExtendedScoped() {
        createExampleTestVehiclesImpl(getExtendedInventory());
    }
 
    @Test
    public void createExampleUsingTollTagsTransactionScoped() {
        createExampleTestTollTagsImpl(getInventory());
    }
 
    @Test
    public void createExampleUsingTollTagsExtendedScoped() {
        createExampleTestTollTagsImpl(getExtendedInventory());
    }
}
```

## Exercises
### Test Passing
There are 3 ways to make the one failing test pass:
# Touch the collection before returning from the method
# Change the query from using getEm().find(...) to instead use a named query such as "SELECT a FROM Account a JOIN FETCH a.tollTags WHERE a.id = :id"
# Add fetch = FetchType.EAGER to the attribute, but note that if you do, you might need to change the type from Collection<TollTag> to Set<TollTag> due to a limitation in implementation of the entity manager.

Experiment with each of these options.

### Shared Code
There is a lot of shared code between the two AccountInventory bean implementations. Describe at least two ways you could reduce the redundancy.

### Interfaces
The interface seems to be a bit messed up with concepts that relate to both stateless and stateful beans. Describe how you might change the interface to make this better. Consider using two interfaces instead of one.

[[#OtherFiles]]
## Other Files
**persistence.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence>
   <persistence-unit name="tolltag">
      <jta-data-source>java:/DefaultDS</jta-data-source>
      <properties>
         <property name="hibernate.hbm2ddl.auto" value="create-drop"/>
      </properties>
   </persistence-unit>
</persistence>
```

[[include_page="Ejb3JBossUtilJava"]]
[<--Back]({{site.pagesurl}}/EJB_3_and_Java_Persistence_API)
