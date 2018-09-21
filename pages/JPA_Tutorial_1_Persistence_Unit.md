---
title: JPA_Tutorial_1_Persistence_Unit
---
We now need to create the Persistent Unit definition. Create a file called persistence.xml in the src/META-INF directory with the following contents:

[#persistence_xml](#persistence_xml)
### persistence.xml
{% highlight xml %}
<persistence>
    <persistence-unit name="examplePersistenceUnit" 
                      transaction-type="RESOURCE_LOCAL">
        <properties>
            <property name="hibernate.show_sql" value="false" />
            <property name="hibernate.format_sql" value="false" />

            <property name="hibernate.connection.driver_class" 
                      value="org.hsqldb.jdbcDriver" />
            <property name="hibernate.connection.url" 
                      value="jdbc:hsqldb:mem:mem:aname" />
            <property name="hibernate.connection.username" value="sa" />

            <property name="hibernate.dialect" 
                      value="org.hibernate.dialect.HSQLDialect" />
            <property name="hibernate.hbm2ddl.auto" value="create" />
        </properties>
    </persistence-unit>
</persistence>
{% endhighlight %}
### The Steps
* Expand your project (**JpaTutorial1**)
* Select the **src/META-INF** directory
* Right click and select **new:File**
* Enter **persistence.xml** for the name and press **Finish** (Note: all lowercase. It won't make a difference on Windows XP but it will on Unix.)
* Copy the contents (above) into the file and save it.

### Verify This Works
* Select the **test**
* Right-click on **entity** and select **new:Class**
* Enter **PersonTest** and click **Finish**
* Enter the example code below:
{% highlight java %}
package entity;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class PersonTest {
    private EntityManagerFactory emf;

    private EntityManager em;

    @Before
    public void initEmfAndEm() {
        BasicConfigurator.configure();
        Logger.getLogger("org").setLevel(Level.ERROR);

        emf = Persistence.createEntityManagerFactory("examplePersistenceUnit");
        em = emf.createEntityManager();
    }

    @After
    public void cleanup() {
        em.close();
    }

    @Test
    public void emptyTest() {
    }
}
{% endhighlight %}

* When you're finished and it all compiles, right-click within the source pane, select **Run As:JUnit Test**
* You should see all green
* If you do not, comment out the following line and review the console output
{% highlight java %}
        Logger.getLogger("org").setLevel(Level.ERROR);
{% endhighlight %}
