---
title: EJB3_Tutorial_6_-_Security
---
{:toc}
[<--Back]({{site.pagesurl}}/EJB_3_and_Java_Persistence_API)
# Ejb3 Tutorial 6 - Security
This simple tutorial takes the solution from [EJB3_Tutorial_5_-_Message_Driven_Beans]({{site.pagesurl}}/EJB3_Tutorial_5_-_Message_Driven_Beans) and augments the beans with the configuration information necessary to limit access declaratively.
----
## Project Setup
We recommend you create a copy of your project (or if you are using revision control software, make sure to check-in and tag your work).

We need to create a few basic files: users.properties and roles.properties.

**users.properties**
```
bschuchert=password
msmith=password
dnunn=password
student=password
```

This file defines user accounts. Note that while the use of this information is defined in the specification, exactly how it is configured is vendor specific.

This file should reside anywhere in the root of a classpath entry. Place this in the conf directory, which is configured as a source entry.

By the way, notice that it is users and not user. You can use another name, but this is the default name JBoss uses.

**roles.properties**
```
bschuchert=admin
msmith=admin
dnunn=admin
student=user
```

The comments from users.properties apply here.

----
## Update Session Bean
Next we need to configure the bean with security information. As usual, we can use either XML or annotations. Here is an updated version of AccountInventoryBean.java:

**AccountInventoryBean.java**
```java
package session;

import java.util.Calendar;
import java.util.List;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.annotation.security.SecurityDomain;

import entity.Account;
import entity.Charge;
import entity.TollTag;

/**
 * SecurityDomain is a JBoss extension that allows you to describe which
 * security domain to use. The security domain defines how validation is
 * performed. The "other" security domain, which is provided by default, simply
 * uses two files: users.properties and roles.properties for security
 * configuration. You can also store this information in a database or build a
 * bridge to your implementation. This is outside the scope of the
 * specification.
 */
@Stateless
@SecurityDomain("other")
public class AccountInventoryBean implements AccountInventory {
    @PersistenceContext(unitName = "tolltag")
    private EntityManager em;

    public EntityManager getEm() {
        return em;
    }

    /**
     * Only allow users that can play the role of admin to access this method.
     */
    @RolesAllowed( { "admin" })
    public void createAccount(final Account account) {
        getEm().persist(account);
    }

    @RolesAllowed( { "admin", "user" })
    public Account findAccountById(final Long id) {
        return getEm().find(Account.class, id);
    }

    /**
     * The default access is PermitAll if you do not otherwise specify the roles
     * allowed. You can change this default by applying the RolesAllowed
     * annotation to the class instead of a method.
     */
    @PermitAll
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

    public void removeAccountById(final Long id) {
        final Account toRemove = findAccountById(id);
        getEm().remove(toRemove);
        getEm().flush();
    }

    // ... the rest is unchanged
}
```

and the updated interface:

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
    void removeAccountById(long id);

    // . . . the rest is unchanged
}
```


----
## Updated JBossUtil
We now need to update JBossUtil once more to read our security properties. The only method that has changed is startDeployer:
```java
    public static void startDeployer() {
        if (!initialized) {
            redirectStreams();

            EJB3StandaloneBootstrap.boot(null);
            EJB3StandaloneBootstrap.deployXmlResource("jboss-jms-beans.xml");
            EJB3StandaloneBootstrap.deployXmlResource("tolltag-jms.xml");
            EJB3StandaloneBootstrap.deployXmlResource("security-beans.xml");
            EJB3StandaloneBootstrap.scanClasspath();

            initialized = true;

            restoreStreams();
        }
    }
```

This method now reads in MDB configuration information in the first two calls to deployXmlResources and configures the security settings in the third line.
----
## The Test
This test attempts one successful and four failed attempts. The names of the methods describe whether we expect success or failure:
**AccountInventoryBeanTest.java**
```java
package session;

import java.util.Properties;

import javax.ejb.EJBAccessException;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.security.auth.login.FailedLoginException;

import org.junit.BeforeClass;
import org.junit.Test;

import util.JBossUtil;
import entity.Account;
import entity.TollTag;
import entity.Vehicle;

public class AccountInventoryBeanTest {
    private static final String WRONG_ACCOUNT = "this account does not exist";
    private static final String WRONG_PASSWORD = "this is the wrong password";
    private static final String USER_ACCOUNT = "student";
    private static final String ADMIN_ACCOUNT = "bschuchert";
    private static final String PASSWORD = "password";

    @BeforeClass
    public static void initContainer() {
        JBossUtil.startDeployer();
    }

    public InitialContext getInitialContextFor(final String user,
            final String password) throws NamingException {
        final Properties p = new Properties();
        p.setProperty(Context.SECURITY_PRINCIPAL, user);
        p.setProperty(Context.SECURITY_CREDENTIALS, password);
        p.setProperty(Context.INITIAL_CONTEXT_FACTORY,
                "org.jboss.security.jndi.JndiLoginInitialContextFactory");
        return new InitialContext(p);
    }

    public static TollTag instantiateTollTag() {
        final TollTag tt = new TollTag();
        tt.setTagNumber("1234567890");
        return tt;
    }

    public static Vehicle instantiateVehicle() {
        return new Vehicle("Subaru", "Outback", "2001", "YBU 155");
    }

    public static Account instantiateAccount() {
        final Account account = new Account();
        account.addTollTag(instantiateTollTag());
        account.addVehicle(instantiateVehicle());
        return account;
    }

    private void createAccountUsing(final String userName, final String password)
            throws Exception {
        final Account account = instantiateAccount();
        final InitialContext ctx = getInitialContextFor(userName, password);
        AccountInventory bean = (AccountInventory) ctx
                .lookup("AccountInventoryBean/local");
        bean.createAccount(account);
        bean.removeAccountById(account.getId());
    }

    @Test
    public void successfulCreateAccount() throws Exception {
        createAccountUsing(ADMIN_ACCOUNT, PASSWORD);
    }

    @Test(expected = SecurityException.class)
    public void unsuccessfulCreateAccountUserNotInRoll() throws Throwable {
        try {
            createAccountUsing(USER_ACCOUNT, PASSWORD);
        } catch (EJBAccessException e) {
            throw e.getCause();
        }
    }

    @Test(expected = FailedLoginException.class)
    public void unsuccessfulCreateAccountWrongPassowrd() throws Throwable {
        try {
            createAccountUsing(ADMIN_ACCOUNT, WRONG_PASSWORD);
        } catch (Exception e) {
            throw e.getCause();
        }
    }

    @Test(expected = FailedLoginException.class)
    public void unsuccessfulCreateAccountWrongUser() throws Throwable {
        try {
            createAccountUsing(WRONG_ACCOUNT, PASSWORD);
        } catch (Exception e) {
            throw e.getCause();
        }

    }

    @Test(expected = FailedLoginException.class)
    public void unsuccessfulNoCredentials() throws Throwable {
        try {
            createAccountUsing("", "");
        } catch (EJBAccessException e) {
            throw e.getCause();
        }
    }
}
```

Notice that in all cases where the method is expected to generate an exception, we first catch EJBAccessException. EJBAccessException is a wrapper exception. We verify the contents by getting the wrapped exception and throwing it. We then let JUnit tell us if we got the exception we expected.
----
## Questions
If you do not provide a RolesAllowed, what is the default?
How do you set a different default value for all the methods in a class?

[<--Back]({{site.pagesurl}}/EJB_3_and_Java_Persistence_API)
