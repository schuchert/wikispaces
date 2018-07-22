### Queries===
In these example, the variable "em" is an entity manger initialized just like it was in the first tutorial.

**Empty String**
Setup: None required
> {{em.createQuery(""); }}

**Unknown Class**
Setup: None required
> {{em.createQuery("from IncorrectClassName"); }}

**Minimal "Get All"**
Setup: None required
> {{em.createQuery("from Person").getResultList(); }}

**Successfully Get a Single Object**
Setup: Insert exactly 1 Person entity in the database
> {{final Person p = (Person) em.createQuery("from Person").getSingleResult(); }}

**Unsuccessfully Try to get a Single Object When There Are None**
Setup: Make sure there are no Person entities in the database
> {{ em.createQuery("from Person").getSingleResult(); }}

**Unsuccessfully Try to get a Single Object With Too Many**
Setup: Insert two or more Person entities in the database
> {{em.createQuery("from Person").getSingleResult(); }}

**Find By Primary Key**
Setup: Insert a Person in the database, make sure to get the key of the object inserted
> {{final Person p = em.find(Person.class, personKey);}}

**Unsuccessfully Find by Primary Key**
Setup: None required
> {{final Person p = em.find(Person.class, -42);}}

**Search Using Query Parameter and Storing Result as List<?>**
Setup: Insert one person record where the Person's first name = "Brett".
```java
    final List<?> list = em.createQuery("from Person where p.firstName = ?1")
        .setParameter(1, "Brett").getResultList();
```

**Search Using Query Parameter and Storing Result as List<Person>**
Setup: Insert one person record where the Person's first name = "Brett".
```java
    final List<Person> list = em.createQuery(
        "from Person where firstName = ?1").setParameter(1, "Brett")
        .getResultList();
```

**Do Find by Primary Key and Queries Return == Objects**
Setup: Insert one person record and store the primary key. Also make sure the first name of the person equals "Brett".
```java
    final Person pByKey = em.find(Person.class, personKey);

    final Person pByWhere = (Person) em.createQuery(
        "SELECT p from Person p where firstName='Brett'")
        .getSingleResult();
```

**Use Wrong Class Name**
Setup: None required
> {{em.createQuery("from PERSON").getSingleResult(); }}

**Use Wrong Field Name**
Setup: None required
> {{em.createQuery("from Person p where p.FirstName='Brett'"); }}

**Use Column Name Instead of Field Name**
Setup: None required, but maybe insert a single person whose first name = "Brett".
> {{ em.createQuery("from Person p where p.firstName='Brett'").getResultList(); }}

**Use a Parameter but Provide Wrong Index**
Setup: None required
> {{ em.createQuery("from Person p where p.firstName=?1").setParameter(0, "Brett"); }}

**Set Parameter Where There are None: Version 1**
Setup: None required
> {{ em.createQuery("from Person p where p.firstName='Brett'").setParameter(1, "Brett"); }}

**Set Parameter When There Are None: Version 2**
Setup: None required
> {{ em.createQuery("from Person p where p.firstName='?1'").setParameter(1, "Brett"); }}
