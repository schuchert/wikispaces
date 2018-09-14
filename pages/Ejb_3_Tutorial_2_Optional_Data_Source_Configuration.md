---
title: Ejb_3_Tutorial_2_Optional_Data_Source_Configuration
---
The persistence.xml file mentions the possibility of using your own data source rather than the default data source to hit a different database.

When you use the embedded container, it looks for a file called embedded-jboss-beans.xml for its datasources (and several other things). In the one that ships with the ALPHA 9 release, you'll see the following two entries near the bottom:
{% highlight xml %}
   <bean name="DefaultDSBootstrap"
         class="org.jboss.resource.adapter.jdbc.local.LocalTxDataSource">
      <property name="driverClass">org.hsqldb.jdbcDriver</property>
      <property name="connectionURL">jdbc:hsqldb:.</property>
      <property name="userName">sa</property>
      <property name="jndiName">java:/DefaultDS</property>
      <property name="minSize">0</property>
      <property name="maxSize">10</property>
      <property name="blockingTimeout">1000</property>
      <property name="idleTimeout">100000</property>
      <property name="transactionManager">
          <inject bean="TransactionManager"/>
      </property>
      <property name="cachedConnectionManager">
          <inject bean="CachedConnectionManager"/>
      </property>
      <property name="initialContextProperties">
          <inject bean="InitialContextProperties"/>
      </property>
   </bean>

   <bean name="DefaultDS" class="java.lang.Object">
      <constructor factoryMethod="getDatasource">
         <factory bean="DefaultDSBootstrap"/>
      </constructor>
   </bean>
{% endhighlight %}

To create your own data source, you basically copy both of these and update the values accordingly. Here is one example that uses HSQL with a local server:
{% highlight xml %}
   <bean name="HypersonicLocalServerDSBootstrap" 
         class="org.jboss.resource.adapter.jdbc.local.LocalTxDataSource">
      <property name="driverClass">org.hsqldb.jdbcDriver</property>
      <property name="connectionURL">jdbc:hsqldb:hsql://localhost/xdb</property>
      <property name="userName">sa</property>
      <property name="jndiName">java:/HypersonicLocalServerDS</property>
      <property name="minSize">0</property>
      <property name="maxSize">10</property>
      <property name="blockingTimeout">1000</property>
      <property name="idleTimeout">100000</property>
      <property name="transactionManager">
          <inject bean="TransactionManager"/>
      </property>
      <property name="cachedConnectionManager">
          <inject bean="CachedConnectionManager"/>
      </property>
      <property name="initialContextProperties">
          <inject bean="InitialContextProperties"/>
      </property>
   </bean>
   
   <bean name="HypersonicLocalServerDS" class="java.lang.Object">
      <constructor factoryMethod="getDatasource">
         <factory bean="HypersonicLocalServerDSBootstrap"/>
      </constructor>
   </bean>
{% endhighlight %}

To use this, you need to do two things. Update persistence.xml and start a HSQL server.

**Update persistence.xml**
Replace the following line:
{% highlight xml %}
<jta-data-source>java:/DefaultDS</jta-data-source>
{% endhighlight %}

With this one:
{% highlight xml %}
<jta-data-source>java:/HypersonicLocalServerDS</jta-data-source>
{% endhighlight %}

To start an HSQL server, you can use the following steps:
# Under the place where you extracted HSQL (C:\libs\hsqldb if you used the same directories as the tutorial), create a new directory called "databases".
# Change to that directory
# Use the following command to start the HSQL server:
{% highlight terminal %}
java -cp ../lib/hsqldb.jar org.hsqldb.Server -database.0 file:mydb -dbname.0 xdb
{% endhighlight %}
