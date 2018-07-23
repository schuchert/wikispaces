---
title: QuantumDB_Configuration
---
# QuantumDb Configuration

QuantumDb is an Eclipse plugin that lets you view a database. This is a quick start guide.

## Download and Install
# Download GEF (a required package) from [here](http://www.eclipse.org/downloads/download.php?file=/tools/gef/downloads/drops/R-3.2.1-200609211617/GEF-ALL-3.2.1.zip)
# Download QuantumDb from [here](http://sourceforge.net/project/showfiles.php?group_id=7746&package_id=57047)
# Open the GEF zip file and extract just the **plugins** and **features** directories directly into you eclipse installation (c:\eclipse)
# Open the QuantumDb zip file and extract just the **plugins** and **features** directories directly into your eclipse installation (c:\eclipse)
# Restart Eclipse

[[#StartYourDatabase]]
## Start your Database
This example assumes hypersonic is running with the following startup script:
```
org.hsqldb.Server -database.0 file:mydb -dbname.0 xdb
```

In our examples, we created a folder called database under the installation directory of hypersonic, so the full folder name is:
```
C:\libs\hsqldb\database
```

Assuming java is in your classpath, the following command will start hypersonic:
```
java -cp ../lib/hsqldb.jar org.hsqldb.Server -database.0 file:mydb -dbname.0 xdb
```

[[#JPAinJSE]]
## JPA in JSE Settings
**persistence.xml**
```xml
<persistence>
    <persistence-unit name="examplePersistenceUnit" 
                      transaction-type="RESOURCE_LOCAL">
        <properties>
            <property name="hibernate.show_sql" value="false" />
            <property name="hibernate.format_sql" value="false" />
 
            <property name="hibernate.connection.driver_class" 
                      value="org.hsqldb.jdbcDriver" />
            <property name="hibernate.connection.url" 
                      value="jdbc:hsqldb:hsql://localhost/xdb" />
            <property name="hibernate.connection.username" value="sa" />
 
            <property name="hibernate.dialect" 
                      value="org.hibernate.dialect.HSQLDialect" />
            <property name="hibernate.hbm2ddl.auto" value="create" />
        </properties>
    </persistence-unit>
</persistence>
```

## JPA in JEE Settings
This assumes you are using the JBoss Embedded container.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence>
   <persistence-unit name="custdb">
      <jta-data-source>java:/HypersonicLocalServerDS</jta-data-source>
      <properties>
         <property name="hibernate.hbm2ddl.auto" value="create-drop"/>
      </properties>
   </persistence-unit>
</persistence>
```

And the additions to embedded-jboss-bean.xml:
```xml
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
```

## Using the Perspective
Now that everything is setup, you'll need to open the perspective and form a connection to the database.

# Click the Open Perspective button and select **Other**
# Select **Quantum DB** and click **OK**
# Right-click in **Database Bookmarks** pane and select **New Bookmark...**
# Click on the **Add Driver** button
# Click on **Add External Jar...**
# Find **hsqldb.jar** (c:\libs\hsqldb\lib\hsqldb.jar) and click **Open**
# Click on **Browse...**
# Select **org.hsqldb.jdbcDriver**  and click **ok**
# Click on **Finish**
# Select the driver you just added (it is probably the first in the list but look in the **JDBC Driver Name** column for **org.hsqldb.jdbcDriver**
# Click **Next**
# In the **Userid** field, enter **sa**
# Leave the **Password** field blank
# Leave **Prompt for Password** unselected
# In the **JDBC URL** filed, enter **jdbc:hsqldb:hsql://localhost/xdb**
# Name your bookmark **HypersonicLocalServer** and click **Finish**
# Double-click on you new **HypersonicLocalServer** Bookmark
# Expand **PUBLIC**
# Expand **Tables**

At this point you can experiment with the plugin.