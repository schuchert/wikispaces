---
title: JPA_Tutorial_1_-_Make_Relationship_Bi-directional
---
Now we're going to make sure the Person knows the Company for which it works. This is the "one" side of a one to many relationship. We need to explicitly set this value and map it. We also need to update the Company @OneToMany relationship so that the Entity Manager knows it is a bi-directional relationship rather than just two unidirectional relationships.

First we need to update Person:
**Person.java**
{% highlight java %}
public class Person {
    // ...

    /**
     * This relationship is optional. This means the database will allow this
     * relationship to be null. It turns out that true is the default value so
     * we only specify it to document its existence.
     */
    @ManyToOne(optional = true)
    private Company job;

    public Company getJob() {
        return job;
    }

    public void setJob(Company job) {
        this.job = job;
    }

    // ...
}
{% endhighlight %}

Next, we'll change Company to maintain both sides of the relationship:
{% highlight java %}
public class Company {
    /**
     * Adding mappedBy lets the entity manager know you mean for this
     * relationship to be bi-directional rather that two unidirectional
     * relationships.
     */
    @OneToMany(mappedBy = "job")
    private Collection<Person> employees;

    // update this method
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

    // update this method
    public void hire(final Person p) {
        getEmployees().add(p);
        p.setJob(this);
    }

    // update this method
    public void fire(final Person p) {
        getEmployees().remove(p);
        p.setJob(null);
    }
}
{% endhighlight %}

Before going any further, make sure all of your tests still run green.

We are now adding and removing Person objects from collections. To make this work, we need to add an equals() method and a hashCode() method to the Person class:
{% highlight java %}
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
{% endhighlight %}

Finally, we'll update CompanyTest in several stages:

First, add a utility method to retrieve companies by name:
{% highlight java %}
    private Company findCompanyNamed(final EntityManager em, String name) {
        return (Company) em.createQuery(
                "select c from Company c where c.name=?1")
                .setParameter(1, name).getSingleResult();
    }
{% endhighlight %}

Add another support method to create a company and hire a few people:
{% highlight java %}
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
{% endhighlight %}

The method createCompany used to directly lookup a company by name. Update the test method to use this private method by changing this line:
{% highlight java %}
        final Company foundCompany = (Company) em.createQuery(
                "select c from Company c where c.name=?1").setParameter(1,
                "The Company").getSingleResult();
{% endhighlight %}

to: 
{% highlight java %}
        final Company foundCompany = findCompanyNamed(em, "The Company");
{% endhighlight %}

Update the method createCompanyAndHirePeopl by using the support method createCompanyWithTwoEmployees():
{% highlight java %}
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
{% endhighlight %}

Finally, add an additional unit test to hire and fire people:
{% highlight java %}
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
{% endhighlight %}

Make sure everything compiles and is green.
