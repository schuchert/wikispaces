---
title: EJB3_Tutorial_5_Message_Driven_Beans
---
{% include toc %}
[<--Back](EJB_3_and_Java_Persistence_API)

## Ejb3 Tutorial 5 - Message Drive Beans
This tutorial is a derivative of one of the [JBoss tutorials](http://docs.jboss.org/ejb3/embedded/embedded-tutorial/mdb-standalone/) written using the embeddable container. In this tutorial we take the domain from [EJB3_Tutorial_4_Extended_Context](EJB3_Tutorial_4_Extended_Context) and add a new idea.
----
### The Requirements
Imagine a system where there are several toll tag reporting stations, each of which need to be able to quickly record vehicles passing through a toll both quickly. They do not have time to wait for a message to some back-end system to complete before the next car passes through. This is a typical example where we want to use asynchronous messaging. 

A client traditionally waits for a message/function to complete before it continues doing what it was doing. This is called synchronous messaging. In our case, we don't want to force the client to wait for the back-end processing to be complete before it can continue doing what it was doing. Instead, the client will create a message and send it to some back-end system. This allows the client to "fire and forget", sort of like sending an email message.
----
### JEE's Answer
A solution can use Message Driven Beans (MBD) to address this kind of functionality. Originally MDB's were written on top of JMS but with the 2.1 and 3.0 specifications, Message Driven Beans can sit on top of many different kinds of resources. For our purposes, we'll simply stick to JMS.

A Message Driven Bean is a stateless enterprise bean. A container typically manages a pool of such objects. As messages arrive, the container will take an MDB from the pool and have it process a message. If the processing succeeds, the message is removed from the queue; otherwise it remains on the queue.

To demonstrate/simulate a client, we'll have a unit test that sends a message via JMS to a client.
----
### Project Setup
The instructions for setting up your project mirror those from the first tutorial: [EJB3_Tutorial_1_Create_and_Configure](EJB3_Tutorial_1_Create_and_Configure).

For the remainder of this tutorial, when you see **<project>**, replace it with **Ejb3Tutorial5**.
{% include include_md_file filename="Ejb3EclipseProjectSetupAndConfiguration.md" %}
----
### The Entity Model
We've taken the domain model from the previous EJB tutorial and added a "charge" object. An account has one to many charges associated with it. Otherwise, this domain model is unchanged from the previous tutorial.

#### Charge.java
{% highlight java %}
package entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@NamedQuery(name = "Charge.forAccount", 
        query = "SELECT c FROM Charge c WHERE c.account.id = :accountId")
public class Charge {
    @Id
    @GeneratedValue
    private Long id;

    private double amount;

    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToOne
    private Account account;

    public Charge() {
    }

    public Charge(final Account account, final double amount, final Date date) {
        this.account = account;
        this.amount = amount;
        this.date = date;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
{% endhighlight %}

To update the Account object, add a new relationship called "charges" as follows:
{% highlight java %}
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private Collection<Charge> charges;

    public Collection<Charge> getCharges() {
        if (charges == null) {
            charges = new ArrayList<Charge>();
        }

        return charges;
    }

    public void addCharge(final Charge charge) {
        getCharges().add(charge);
        charge.setAccount(this);
    }
{% endhighlight %}
----
### The Session Model
We need to update the AccountInventory interface and the beans. Make the following changes:
* Remove the AccountInventoryExtendedBean
* Remove the finish() method from both the AccountInventory interface and the AccountInventoryBean class.
* Add the following methods to AccountInventory:
* ```void addCharge(final String tollTagNumber, final double amount); ```
* ```double getTotalChargesOnAccountById(final Long id);```
* Create these methods in AccountInventoryBean:
{% highlight java %}
    public void addCharge(String tollTagNumber, double amount) {
        final Account account = findAccountByTagNumber(tollTagNumber);
        final Charge charge = new Charge(account, amount, Calendar
                .getInstance().getTime());
        account.addCharge(charge);
    }

    @SuppressWarnings("unchecked")
    public double getTotalChargesOnAccountById(Long id) {
        final List<Charge> charges = getEm().createNamedQuery(
                "Charge.forAccount").setParameter("accountId", id)
                .getResultList();

        double total = 0;
        for (Charge c : charges) {
            total += c.getAmount();
        }

        return total;
    }
{% endhighlight %}
----
### Changes to util
* Remove the DateTimeUtil class.
* Update JBossUtil.startDeployer():
{% highlight java %}
    public static void startDeployer() {
        if (!initialized) {
            redirectStreams();

            EJB3StandaloneBootstrap.boot(null);
            EJB3StandaloneBootstrap.deployXmlResource("jboss-jms-beans.xml");
            EJB3StandaloneBootstrap.deployXmlResource("tolltag-jms.xml");
            EJB3StandaloneBootstrap.scanClasspath();

            initialized = true;

            restoreStreams();
        }
    }
{% endhighlight %}
----
### The Message Driven Bean
This is the heart of our next tutorial, the Message Driven Bean:
{% highlight java %}
package mdb;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.EJB;
import javax.ejb.MessageDriven;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageListener;

import session.AccountInventory;

/**
 * The MessageDriven annotation declares this class to be a message driven bean.
 * With EJB 3.0, you add a set of properties to the MDB via the
 * ActivationConfigProperty annotation to indicate how to configure this MDB. In
 * this case we set the destinationType to be a Queue (point to point) and the
 * destination to queue/tolltag. These are the standard properties you'll need
 * to set on JMS-based, point-to-point (queue)-based MDB's.
 */
@MessageDriven(activationConfig = {
        @ActivationConfigProperty(propertyName = "destinationType",
                propertyValue = "javax.jms.Queue"),
        @ActivationConfigProperty(propertyName = "destination",
                propertyValue = "queue/tolltag") })
public class TollTagChargesMdb implements MessageListener {
    /**
     * I can refer to other Session Beans as demonstrated here.
     */
    @EJB
    private AccountInventory bean;

    /**
     * When a message comes in, my onMessage is executed by the container. In
     * this case, I expect a MapMessage (this of this as a hash table). The
     * implementation is simple, grab the information out of the map and send a
     * message to a Stateless Session Bean (AccountInventoryBean) to add a
     * charge.
     */
    public void onMessage(final Message message) {
        final MapMessage mm = (MapMessage) message;
        try {
            final String tollTagNumber = mm.getString("tollTagNumber");
            final double amount = mm.getDouble("amount");
            bean.addCharge(tollTagNumber, amount);
        } catch (JMSException e) {
            throw new RuntimeException(
                    "Problem getting properties out of message");
        }
    }
}
{% endhighlight %}

This bean is created by the container as necessary (probably pooled at container start time). When the container sees a message, it starts a transaction (if necessary) and then waits for the onMessage to complete.
----
### The Test
{% highlight java %}
package mdb;

import static org.junit.Assert.assertEquals;

import javax.jms.MapMessage;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.jboss.ejb3.embedded.EJB3StandaloneBootstrap;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import session.AccountInventory;
import util.JBossUtil;
import entity.Account;
import entity.TollTag;
import entity.Vehicle;

public class TollTagChargedMdbTest {
    private static final String TAG_NUMBER = "1234567890";
    private Account account;

    @BeforeClass
    public static void initContainer() {
        JBossUtil.startDeployer();
    }

    @Before
    public void createAccount() {
        account = new Account();
        final TollTag tt = new TollTag();
        tt.setTagNumber(TAG_NUMBER);
        account.addTollTag(tt);
        final Vehicle v = new Vehicle("Subary", "Outback", "2001", "LBJ 1234");
        account.addVehicle(v);
        getAccountInventory().createAccount(account);
    }

    private AccountInventory getAccountInventory() {
        return JBossUtil.lookup(AccountInventory.class,
                "AccountInventoryBean/local");
    }

    @After
    public void removeAccount() {
        getAccountInventory().removeAccountById(account.getId());
    }

    @AfterClass
    public static void cleanupContainer() {
        EJB3StandaloneBootstrap.shutdown();
    }

    public static InitialContext getInitialContext() throws NamingException {
        return new InitialContext();
    }

    @Test
    public void addCharge() throws Exception {
        final Queue queue = (Queue) getInitialContext().lookup("queue/tolltag");
        final QueueConnectionFactory factory 
                  (QueueConnectionFactory) getInitialContext()
                  .lookup("java:/ConnectionFactory");
        final QueueConnection connection = factory.createQueueConnection();
        final QueueSession session = connection.createQueueSession(false,
                QueueSession.AUTO_ACKNOWLEDGE);

        MapMessage message = session.createMapMessage();
        message.setString("tollTagNumber", TAG_NUMBER);
        message.setDouble("amount", .5d);

        final QueueSender sender = session.createSender(queue);
        sender.send(message);

        Thread.sleep(1000);
        session.close();
        connection.close();

        assertEquals(.5d, getAccountInventory().getTotalChargesOnAccountById(
                account.getId()));
    }
}
{% endhighlight %}
----
### Assignments/Questions
What do you think about whether objects are managed or unmanaged while being processed by the MDB?
Who creates the transactions for these updates?
The test uses Thread.sleep(1000). Why does it do so? Experiment with that value, is 1000 milliseconds the “right” value? Suggest a better way to test this. (Consider Aspect Oriented Programming or interceptors or even static variables.)
----
### Full Sources
Here is the source for all of the classes not already provided in full above.

#### Account.java
{% highlight java %}
package entity;

import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
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
     * relationship to work if the object is or is not detached.
     */
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private Collection<Vehicle> vehicles;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private Collection<Charge> charges;

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

    public Collection<Charge> getCharges() {
        if (charges == null) {
            charges = new ArrayList<Charge>();
        }

        return charges;
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

    public void addCharge(final Charge charge) {
        getCharges().add(charge);
        charge.setAccount(this);
    }

    public void removeTollTag(final TollTag tt) {
        getTollTags().remove(tt);
        tt.setAccount(null);
    }
}
{% endhighlight %}

#### Charge.java
{% highlight java %}
package entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@NamedQuery(name = "Charge.forAccount", 
        query = "SELECT c FROM Charge c WHERE c.account.id = :accountId")
public class Charge {
    @Id
    @GeneratedValue
    private Long id;

    private double amount;

    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToOne
    private Account account;

    public Charge() {
    }

    public Charge(final Account account, final double amount, final Date date) {
        this.account = account;
        this.amount = amount;
        this.date = date;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
{% endhighlight %}

#### TollTag.java
{% highlight java %}
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
{% endhighlight %}

#### Vehicle.java
{% highlight java %}
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
{% endhighlight %}

#### AccountInventory.java
{% highlight java %}
package session;

import javax.ejb.Local;

import entity.Account;

@Local
public interface AccountInventory {
    void removeTag(final String tagNumber);

    Account findAccountByTagNumber(final String tagNumber);

    Account updateAccount(final Account account);

    Account findAccountById(final Long id);

    void removeAccountById(final Long id);

    void createAccount(final Account account);

    void addCharge(final String tollTagNumber, final double amount);

    double getTotalChargesOnAccountById(final Long id);
}
{% endhighlight %}

#### AccountInventoryBean.java
{% highlight java %}
package session;

import java.util.Calendar;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import entity.Account;
import entity.Charge;
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

    public void removeAccountById(final Long id) {
        final Account toRemove = findAccountById(id);
        getEm().remove(toRemove);
        getEm().flush();
    }

    public void addCharge(String tollTagNumber, double amount) {
        final Account account = findAccountByTagNumber(tollTagNumber);
        final Charge charge = new Charge(account, amount, Calendar
                .getInstance().getTime());
        account.addCharge(charge);
    }

    @SuppressWarnings("unchecked")
    public double getTotalChargesOnAccountById(Long id) {
        final List<Charge> charges = getEm().createNamedQuery(
                "Charge.forAccount").setParameter("accountId", id)
                .getResultList();

        double total = 0;
        for (Charge c : charges) {
            total += c.getAmount();
        }

        return total;
    }
}
{% endhighlight %}

#### EqualsUtil.java
{% highlight java %}
package util;

/**
 * We typically need to compare two object and also perform null checking. This
 * class provides a simple wrapper to accomplish doing so.
 */

public class EqualsUtil {
    private EqualsUtil() {
        // I'm a utility class, do not instantiate me
    }

    public static boolean equals(final Object lhs, final Object rhs) {
        return lhs == null && rhs == null
                || (lhs != null && rhs != null && lhs.equals(rhs));

    }
}
{% endhighlight %}

#### JBossUtil.java
{% highlight java %}
package util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.logging.Logger;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.jboss.ejb3.embedded.EJB3StandaloneBootstrap;

/**
 * This class was originally necessary when using the ALPHA 5 version of the
 * embeddable container. With the alpha 9 release, initialization is quite
 * simple, you need just 2 lines to initialize your JBoss Embeddable EJB3
 * Container Environment. Unfortunately, the one that is available for download
 * uses System.out.println() in a few places, so this simple utility hides that
 * output and also provides a simple lookup mechanism.
 */
public class JBossUtil {
    private static PrintStream originalOut;
    private static PrintStream originalErr;
    private static OutputStream testOutputStream;
    private static PrintStream testOuputPrintStream;

    static boolean initialized;
    static InitialContext ctx;

    private JBossUtil() {
        // I'm a utility class, do not instantiate me
    }

    /**
     * JBoss EJB3 Embeddable Container uses System.out. Redirect that output to
     * keep the console output clean.
     */
    private static void redirectStreams() {
        // configure the console to get rid of hard-coded System.out's in
        // the JBoss libraries
        testOutputStream = new ByteArrayOutputStream(2048);
        testOuputPrintStream = new PrintStream(testOutputStream);

        originalOut = System.out;
        originalErr = System.err;

        System.setOut(testOuputPrintStream);
        System.setErr(testOuputPrintStream);
    }

    /**
     * Restore the System.out and System.err streams to their original state.
     * Close the temporary stream created for the purpose of redirecting I/O
     * while the initializing is going on.
     */
    private static void restoreStreams() {
        System.setOut(originalOut);
        System.setErr(originalErr);
        testOuputPrintStream.close();
        try {
            testOutputStream.close();
        } catch (IOException e) {
            Logger.getLogger(JBossUtil.class.getName()).info(
                    "Unable to close testoutstream");
        }
    }

    /**
     * This method starts and initializes the embeddable container. We do not
     * offer a method to properly clean up the container since this is really
     * meant for testing only.
     * 
     * This method may freely be called as often as you'd like since it lazily
     * initializes the container only once.
     */
    public static void startDeployer() {
        if (!initialized) {
            redirectStreams();

            EJB3StandaloneBootstrap.boot(null);
            EJB3StandaloneBootstrap.deployXmlResource("jboss-jms-beans.xml");
            EJB3StandaloneBootstrap.deployXmlResource("tolltag-jms.xml");
            EJB3StandaloneBootstrap.scanClasspath();

            initialized = true;

            restoreStreams();
        }
    }

    /**
     * This is for symmetry. Given how we are using this class, there's little
     * need to actually shutdown the container since we run a quick application
     * and then stop the JVM.
     */
    public static void shutdownDeployer() {
        EJB3StandaloneBootstrap.shutdown();
    }

    private static InitialContext getContext() {
        /**
         * We only keep one context around, so lazily initialize it
         */
        if (ctx == null) {
            try {
                ctx = new InitialContext();
            } catch (NamingException e) {
                throw new RuntimeException("Unable to get initial context", e);
            }
        }

        return ctx;
    }

    /**
     * The lookup method on InitialContext returns Object. This simple wrapper
     * asks first for the expected type and the for the name to find. It gets
     * the name out of JNDI and performs a simple type-check. It then casts to
     * the type provided as the first parameter.
     * 
     * This isn't strictly correct since the cast uses the expression (T), where
     * T is the generic parameter and the type is erased at run-time. However,
     * since we first perform a type check, we know this cast is safe. The -at-
     * SuppressWarnings lets the Java Compiler know that we think we know what
     * we are doing.
     * 
     * @param <T>
     *            Type type provided as the first parameter
     * @param clazz
     *            The type to cast to upon return
     * @param name
     *            The name to find in Jndi, e.g. XxxDao/local or, XxxDao/Remote
     * @return Something out of Jndi cast to the type provided as the first
     *         parameter.
     */
    @SuppressWarnings("unchecked")
    public static <T> T lookup(Class<T> clazz, String name) {
        final InitialContext ctx = getContext();
        /**
         * Perform the lookup, verify that it is type-compatible with clazz and
         * cast the return type (using the erased type because that's all we
         * have) so the client does not need to perform the cast.
         */
        try {
            final Object object = ctx.lookup(name);
            if (clazz.isAssignableFrom(object.getClass())) {
                return (T) object;
            } else {
                throw new RuntimeException(String.format(
                        "Class found: %s cannot be assigned to type: %s",
                        object.getClass(), clazz));
            }

        } catch (NamingException e) {
            throw new RuntimeException(String.format(
                    "Unable to find ejb for %s", clazz.getName()), e);
        }
    }
}
{% endhighlight %}

#### persistence.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<persistence>
   <persistence-unit name="tolltag">
      <jta-data-source>java:/HypersonicLocalServerDS</jta-data-source>
      <properties>
         <property name="hibernate.hbm2ddl.auto" value="create-drop"/>
      </properties>
   </persistence-unit>
</persistence>
{% endhighlight %}

#### AccountInventoryBeanTest.java
{% highlight java %}
package session;

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

    public static TollTag instantiateTollTag() {
        final TollTag tt = new TollTag();
        tt.setTagNumber("1234567890");
        return tt;
    }

    public static Vehicle instantiateVehicle() {
        return new Vehicle("Subaru", "Outback", "2001", "YBU 155");
    }

    @Test
    public void createAccountAddCharge() {
        final Account account = new Account();
        final TollTag tt = instantiateTollTag();
        account.addTollTag(tt);
        account.addVehicle(instantiateVehicle());

        final AccountInventory bean = getInventory();

        bean.createAccount(account);

        try {
            bean.addCharge(tt.getTagNumber(), .5);
        } finally {
            getInventory().removeAccountById(account.getId());
        }
    }
}
{% endhighlight %}

#### tolltag-jms.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<deployment xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="urn:jboss:bean-deployer bean-deployer_1_0.xsd"
            xmlns="urn:jboss:bean-deployer">
   <bean name="jboss.mq.destination:service=Queue,name=tolltag" 
         class="org.jboss.mq.kernel.Queue">
        <property name="destinationManagerPojo">
            <inject bean="jboss.mq:service=DestinationManager"/>
        </property>
        <property name="initialContextProperties">
            <inject bean="InitialContextProperties"/>
        </property>
        <property name="destinationName">tolltag</property>
   </bean>

   <bean name="jboss.mq.destination:service=Topic,name=tolltag" 
         class="org.jboss.mq.kernel.Topic">
       <property name="destinationManagerPojo">
           <inject bean="jboss.mq:service=DestinationManager"/>
       </property>
       <property name="initialContextProperties">
           <inject bean="InitialContextProperties"/>
       </property>
       <property name="destinationName">tolltag</property>
   </bean>
</deployment>
{% endhighlight %}

#### .classpath
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<classpath>
    <classpathentry kind="src" path="src"/>
    <classpathentry kind="src" path="test"/>
    <classpathentry kind="src" path="conf"/>
    <classpathentry kind="con" 
        path="org.eclipse.jdt.launching.JRE_CONTAINER"/>
    <classpathentry kind="var" path="JUnit4/junit-4.1.jar"/>
    <classpathentry kind="var" 
        path="LIBS/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/hibernate-all.jar"/>
    <classpathentry kind="var" 
        path="LIBS/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/jboss-ejb3-all.jar"/>
    <classpathentry kind="var"
        path="LIBS/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/jcainflow.jar"/>
    <classpathentry kind="var" 
        path="LIBS/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/jms-ra.jar"/>
    <classpathentry kind="var" 
        path="LIBS/jboss-EJB-3.0_Embeddable_ALPHA_9/lib/thirdparty-all.jar"/>
	<classpathentry kind="output" path="bin"/>
</classpath>
{% endhighlight %}

[<--Back](EJB_3_and_Java_Persistence_API)
