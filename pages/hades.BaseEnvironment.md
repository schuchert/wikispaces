---
title: hades.BaseEnvironment
---
These instructions summarize/make heavy use of <http://www.vogella.de/articles/JavaPersistenceAPI/article.html>.

* Download a mocking library. This example uses [JMockIt](http://code.google.com/p/jmockit/downloads/list) - version 0.999.9. You will need the following jar file**as the first entry** in your classpath:
  * jmockit.jar

(These next two steps are here for convenience, they are taken directly from <http://www.vogella.de/articles/JavaPersistenceAPI/article.html>
* Download a JPA implementation. This example uses [http://www.eclipse.org/eclipselink/downloads/|EclipseLink]] - version eclipselink-2.2.0.v20110202-r8913, which is the reference implementation. You will need the following two jar files in your classpath:
  * eclipselink.jar
  * javax.persistence_2.0.X.jar

* Download a database. This example uses [Derby](http://db.apache.org/derby/derby_downloads.html) - version 10.8.1.2. You will the following jar file in your classpath:
  * derby.jar

Follow the instructions in the tutorial as is with the following three changes.
* Update the Todo class' id filed by adding the following annotation:
{% highlight java %}
@SuppressWarnings("unused")
{% endhighlight %}

* Update the persistence XML to always drop and re-create the tables:
  * Replace this line:
{% highlight terminal %}
<property name="eclipselink.ddl-generation" value="create-tables" />
{% endhighlight %}
  * With this line:
{% highlight terminal %}
<property name="eclipselink.ddl-generation" value="drop-and-create-tables" />
{% endhighlight %}

* Instead of creating a main, create as a test:
{% highlight java %}
package shoe;

import static org.junit.Assert.*;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import de.vogella.jpa.simple.model.Todo;

public class SmokeTest {
	private EntityManagerFactory factory;
	private EntityManager em;
	private Query findAll;

	@Before
	public void setupDb() {
		factory = Persistence.createEntityManagerFactory("todos");
		em = factory.createEntityManager();
		findAll = em.createQuery("select t from Todo t");
		em.getTransaction().begin();
	}

	@After
	public void wipeTheSlateClean() {
		em.getTransaction().rollback();
		em.close();
		factory.close();
	}

	@Test
	public void initiallyEmpty() {
		assertEquals(0, getAllTodos().size());
	}

	@Test
	public void oneAddedShouldIncreaseCount() {
		Todo todo = new Todo();
		em.persist(todo);
		assertEquals(1, getAllTodos().size());
	}

	private List<Todo> getAllTodos() {
		@SuppressWarnings("unchecked")
		List<Todo> resultList = findAll.getResultList();
		return resultList;
	}
}
{% endhighlight %}
