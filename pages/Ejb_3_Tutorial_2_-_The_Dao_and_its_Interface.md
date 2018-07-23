---
title: Ejb_3_Tutorial_2_-_The_Dao_and_its_Interface
---
We will create a session bean that wraps access to the company behind a session bean interface. This is another example of the Data Access Object (dao) pattern. This is one of the typical ways we use a session bean.

This dao looks pretty much the same as the session bean from our first EJB example. As with the first example, we've placed the interface in one package and the implementation (the session bean) in a second interface.

**CompanyDao.java**
```java
package dao;

import entity.Company;

/**
 * I do not define whether I am remote or local so we won't know how to lookup
 * implementations of me until we get to the concrete implementation that
 * implements me.
 */
public interface CompanyDao {
    void createCompany(Company c);

    Company update(Company c);

    Company find(Long id);
}
```

To create this interface:
# Expand **Ejb3Tutorial2** and select the **src** directory
# Right-click, select **New::Interface**
# Enter **dao** for the package and **CompanyDao** for the name
# Click **Finish**
# Type the code into the file and save it

**CompanyDaoImpl.java**
```java
package dao.impl;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import dao.CompanyDao;
import entity.Company;

/**
 * Note we've used the optional name parameter to give this bean a name in Jndi.
 * Since this class only implements one interface and since there are no uses of
 * -at- remote here or in the CompanyDao interface, this is a local bean. Thus,
 * the name to lookup will be "CompanyDao/local".
 */
@Stateless(name = "CompanyDao")
public class CompanyDaoImpl implements CompanyDao {

    /**
     * We have defined a persistence unit called custdb. To do so, we must
     * update META-INF/persistence.xml. We optionally need to define a new
     * data source (for our examples, we're using the default data source
     * used by JBoss, which is an in-memory HSQL database instance).
     * 
     * Review comments in persistence.xml regarding the details of defining
     * a different data source.
     */
    @PersistenceContext(unitName = "custdb")
    private EntityManager em;

    /**
     * This is now a method running under a transaction manager. Since we've
     * defined no transaction attribute, this method's transaction property is
     * equal to REQUIRED. If one is not started, then it will be started. So
     * when we enter this method, assuming no other transaction has started, the
     * container will start a transaction and then when we exit this method, the
     * transaction will be committed (recording any changes we've made).
     */
    public void createCompany(final Company c) {
        em.persist(c);
    }

    public Company update(final Company c) {
        return em.merge(c);
    }

    /**
     * This find method makes no changes so it can run without a transaction.
     */
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public Company find(final Long id) {
        return em.find(Company.class, id);
    }
}
```

To create this class:
# Expand **Ejb3Tutorial2** and select the **src** directory
# Right-click, select **New::Class**
# Enter **dao.impl** for the package and **CompanyDaoImpl** for the name
# Click **Finish**
# Type the code into the file and save it
