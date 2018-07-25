---
title: Tutorial_2_-_The_First_Example
---
### Test Setup
We have a bit of setup/initialization code we need to do before we can get started. We have seen all of this code before in Tutorial 1. The difference here is that we are going to work though some refactorings to get to where we were in tutorial 1. Here are the various parts:
**Configure the Logger**
```java
    BasicConfigurator.configure();
    Logger.getLogger("org").setLevel(Level.ERROR);
```

**Create the Entity Manager Factory**
```java
    final EntityManagerFactory emf = Persistence
        .createEntityManagerFactory("examplePersistenceUnit");
```

**Create the Entity Manager**
```java
    final EntityManager em = emf.createEntityManager();
```

**Create Entities**
```java
    final Address a1 = new Address("A Rd.", "", "Dallas", "TX", "75001");
    final Person p1 = new Person("Brett", 'L', "Schuchert", a1);

    final Address a2 = new Address("B Rd.", "S2", "OkC", "OK", "73116");
    final Person p2 = new Person("FirstName" + System.currentTimeMillis(),
        'K', "LastName", a2);
```

**Use the Entity Manager**
```java
    em.getTransaction().begin();
    em.persist(p1);
    em.persist(p2);
    em.flush();
```

**Perform a Query and Verify it Works**
```java
    final int numberFound = em.createQuery("Select p from Person p")
        .getResultList().size();
    assertEquals(2, numberFound);
```

### The Whole Thing
Here's all of this put together. Note that we're going to refactor this heavily coming up.
```java
package entity;

import static org.junit.Assert.assertEquals;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.junit.Test;

public class JpaApiTests {

    @Test
    public void example1InsertTwoPeople() {
        BasicConfigurator.configure();
        Logger.getLogger("org").setLevel(Level.ERROR);

        final EntityManagerFactory emf = Persistence
                .createEntityManagerFactory("examplePersistenceUnit");
        final EntityManager em = emf.createEntityManager();

        final Address a1 = new Address("A Rd.", "", "Dallas", "TX", "75001");
        final Person p1 = new Person("Brett", 'L', "Schuchert", a1);

        final Address a2 = new Address("B Rd.", "S2", "OkC", "OK", "73116");
        final Person p2 = new Person("FirstName" + System.currentTimeMillis(),
                'K', "LastName", a2);

        em.getTransaction().begin();
        em.persist(p1);
        em.persist(p2);
        em.flush();

        final int numberFound = em.createQuery("Select p from Person p")
                .getResultList().size();
        assertEquals(2, numberFound);
    }
}
```

### Get it Running
After creating your Test Class, verify that it runs and that this test passes:
# Right-click anywhere in your class' editor pane.
# Select **Run As:JUnit Test**
