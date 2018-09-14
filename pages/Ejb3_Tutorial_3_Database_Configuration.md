---
title: Ejb3_Tutorial_3_Database_Configuration
---
### persistence.xml 
As we have seen with the previous EJB tutorials, the persistence.xml looks a little different for a JEE environment. Update the persistence.xml to resemble the following:
**persistence.xml**
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<persistence>
   <persistence-unit name="lis">
      <jta-data-source>java:/HypersonicLocalServerDS</jta-data-source>
      <properties>
         <property name="hibernate.hbm2ddl.auto" value="create-drop"/>
         <property name="hibernate.show.sql" value="true"/>
      </properties>
   </persistence-unit>
</persistence>
{% endhighlight %}

### Data Source and Database 
This persistence.xml makes use of a data source that we mentioned [here](Ejb_3_Tutorial_2_Optional_Data_Source_Configuration). We're using this so that we have a database we can look at as we work through our tests to make sure we're cleaning everything up properly.

**If you're working with a preconfigured system, the startdb.bat file mentioned below will already exist, you just need to run it.**

The files you downloaded already contained changes in support of the hypersonic local server data source definition. You'll still need to start hypersonic. To do so, you can do the following:
# Change to the directory where you installed hsqldb (c:\libs\hsqldb)
# Make a new directory, called databases
# Change to that directory
# Start the database (requires you can execute a Java VM from the command line)
{% highlight terminal %}
java -cp ../lib/hsqldb.jar org.hsqldb.Server -database.0 file:mydb -dbname.0 xdb
{% endhighlight %}
