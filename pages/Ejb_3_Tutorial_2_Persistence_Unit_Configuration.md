---
title: Ejb_3_Tutorial_2_Persistence_Unit_Configuration
---
We need to create a persistence unit to provide access to the database. In fact, the file persistence.xml must be found under a META-INF directory somewhere in the classpath or the embeddable container will not start. Also remember that the file's name is persistence.xml with a lower-case 'p'. On a Unix system, this will make a difference. On a PC, this won't make a difference and it is one of those things that might work on your machine but not on the linux build box.

To create this file:
* Expand your project (**Ejb3Tutorial2**)
* Select the **src** folder
* Right-click and select **New:Folder**
* Enter **META-INF** for the name and click **Finish**
* Right-click **META-INF** and select **New:File**
* Enter **persistence.xml** for the name and click **Finish**
* Copy and past the following example into the new **persistence.xml** file and save it

### persistence.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<persistence>
   <persistence-unit name="custdb">
   
    <!-- This persistence unit uses the default data source that JBoss    -->
    <!-- defines called DefaultDS. If we wanted to use our own data       -->
    <!-- source, we'd need to define a custom data source somewhere.      -->
    <!-- That somewhere is vendor specific.                               -->
    
    <!-- In the case of JBoss, since we're using the embedded container,  -->
    <!-- we need to add two beans in a file called                        -->
    <!-- embedded-jboss-beans.xml. We name the first                      -->
    <!-- HypersonicLocalServerDSBootstrap and we name the second          -->
    <!-- HypersonicLocalServerDS. This two step process defines a data    -->
    <!-- source.                                                          -->
    
    <!-- In the first bean definition, we additionally bind it in Jndi    -->
    <!-- under some name. If we used the name                             -->
    <!-- java:/HypersonicLocalServerDS then we would use the following    -->
    <!-- entry to use that data source instead of the default one:        -->
    <!-- <jta-data-source>java:/HypersonicLocalServerDS</jta-data-source> -->

      <jta-data-source>java:/DefaultDS</jta-data-source>
      <properties>
         <property name="hibernate.hbm2ddl.auto" value="create-drop"/>
      </properties>
   </persistence-unit>
</persistence>
{% endhighlight %}
