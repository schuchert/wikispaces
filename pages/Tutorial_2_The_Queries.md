---
title: Tutorial_2_The_Queries
---
### Queries
In these example, the variable "em" is an entity manger initialized just like it was in the first tutorial.

**Empty String**
Setup: None required
{% highlight java %}
em.createQuery(""); 

{% endhighlight %}

**Unknown Class**
Setup: None required
{% highlight java %}
em.createQuery("from IncorrectClassName"); 

{% endhighlight %}

**Minimal "Get All"**
Setup: None required
{% highlight java %}
em.createQuery("from Person").getResultList(); 
{% endhighlight %}

**Successfully Get a Single Object**
Setup: Insert exactly 1 Person entity in the database
{% highlight java %}
final Person p = (Person) em.createQuery("from Person").getSingleResult(); 
{% endhighlight %}

**Unsuccessfully Try to get a Single Object When There Are None**
Setup: Make sure there are no Person entities in the database
{% highlight java %}
 em.createQuery("from Person").getSingleResult(); 
{% endhighlight %}

**Unsuccessfully Try to get a Single Object With Too Many**
Setup: Insert two or more Person entities in the database
{% highlight java %}
em.createQuery("from Person").getSingleResult(); 
{% endhighlight %}

**Find By Primary Key**
Setup: Insert a Person in the database, make sure to get the key of the object inserted
{% highlight java %}
final Person p = em.find(Person.class, personKey);
{% endhighlight %}

**Unsuccessfully Find by Primary Key**
Setup: None required
{% highlight java %}
final Person p = em.find(Person.class, -42);
{% endhighlight %}

**Search Using Query Parameter and Storing Result as List<?>**
Setup: Insert one person record where the Person's first name = "Brett".
{% highlight java %}
    final List<?> list = em.createQuery("from Person where p.firstName = ?1")
        .setParameter(1, "Brett").getResultList();

{% endhighlight %}

**Search Using Query Parameter and Storing Result as List<Person>**
Setup: Insert one person record where the Person's first name = "Brett".
{% highlight java %}
    final List<Person> list = em.createQuery(
        "from Person where firstName = ?1").setParameter(1, "Brett")
        .getResultList();

{% endhighlight %}

**Do Find by Primary Key and Queries Return == Objects**
Setup: Insert one person record and store the primary key. Also make sure the first name of the person equals "Brett".
{% highlight java %}
    final Person pByKey = em.find(Person.class, personKey);

    final Person pByWhere = (Person) em.createQuery(
        "SELECT p from Person p where firstName='Brett'")
        .getSingleResult();

{% endhighlight %}

**Use Wrong Class Name**
Setup: None required
{% highlight java %}
em.createQuery("from PERSON").getSingleResult(); 
{% endhighlight %}

**Use Wrong Field Name**
Setup: None required
{% highlight java %}
em.createQuery("from Person p where p.FirstName='Brett'"); 
{% endhighlight %}

**Use Column Name Instead of Field Name**
Setup: None required, but maybe insert a single person whose first name = "Brett".
{% highlight java %}
 em.createQuery("from Person p where p.firstName='Brett'").getResultList(); 
{% endhighlight %}

**Use a Parameter but Provide Wrong Index**
Setup: None required
{% highlight java %}
 em.createQuery("from Person p where p.firstName=?1").setParameter(0, "Brett"); 
{% endhighlight %}

**Set Parameter Where There are None: Version 1**
Setup: None required
{% highlight java %}
 em.createQuery("from Person p where p.firstName='Brett'").setParameter(1, "Brett"); 
{% endhighlight %}

**Set Parameter When There Are None: Version 2**
Setup: None required
{% highlight java %}
 em.createQuery("from Person p where p.firstName='?1'").setParameter(1, "Brett"); 
{% endhighlight %}
