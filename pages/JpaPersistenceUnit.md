We now need to create the Persistent Unit definition. We are going to create a file called persistence.xml in the src/META-INF directory with the following contents:
[[#Persistence_xml]]
### persistence.xml===
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
                      value="jdbc:hsqldb:mem:mem:aname" />
            <property name="hibernate.connection.username" value="sa" />

            <property name="hibernate.dialect" 
                      value="org.hibernate.dialect.HSQLDialect" />
            <property name="hibernate.hbm2ddl.auto" value="create" />
        </properties>
    </persistence-unit>
</persistence>
```

### The Steps===
# Expand your **<project>**
# Select the **src** directory
# Find the **src/META-INF** directory (if one does not exist, right-click, select **New:Folder**, enter **META-INF** and press enter)
# Right click the **src/META-INF**, select **new:File**.
# Enter **persistence.xml** for the name and press "OK" (Note: all lowercase. It won't make a difference on Windows XP but it will on Unix.)
# Copy the contents (above) into the file and save it