[[Spring Templates Typical JDBC|<--Back]] [[Spring Templates JDBC Strategy Is A Template|Next-->]]

# JDBC Using the Template Method Pattern
This version uses the [[http://en.wikipedia.org/wiki/Design_Patterns|GoF design pattern]] [[http://en.wikipedia.org/wiki/Template_method_pattern|Template Method]]. For more details, take a look at this [[Template Method Pattern|Template Method Pattern Example]].

In this case, we've factored out much of the code in the a base class called AbstractTemplateMethod. We have one concrete implementation of this class called Example2. The driver class, JdbcExample, now uses Exmaple2 to:
* Install the schema
* Insert some rows
* Execute a query

## Class Diagram
[[image:DesigningToSpringTemplates.v2.gif]]

## The Source
----
[[#AbstractTemplateMethod]]
## AbstractTemplateMethod.java
```java
01: package aab.valtech.jug.templatemethod;
02: 
03: import java.sql.Connection;
04: import java.sql.PreparedStatement;
05: import java.sql.ResultSet;
06: import java.sql.SQLException;
07: import java.sql.Statement;
08: 
09: import org.springframework.jdbc.datasource.DriverManagerDataSource;
10: 
11: import com.valtech.util.DatabaseUtil;
12: 
13: public abstract class AbstractTemplateMethod {
14:     private final DriverManagerDataSource dataSource;
15: 
16:     public AbstractTemplateMethod() {
17:         dataSource = new DriverManagerDataSource();
18:         dataSource.setDriverClassName("org.hsqldb.jdbcDriver");
19:         dataSource.setUrl("jdbc:hsqldb:mem:mem:aname");
20:         dataSource.setUsername("sa");
21:         dataSource.setPassword("");
22:     }
23: 
24:     public void installSchema() throws SQLException {
25:         Connection c = null; // NOPMD by brett.schuchert on 7/11/06 11:27 PM
26:         Statement s = null; // NOPMD by brett.schuchert on 7/11/06 11:27 PM
27: 
28:         try {
29:             c = dataSource.getConnection();
30:             s = c.createStatement();
31:             installSchemaImpl(s);
32:         } finally {
33:             DatabaseUtil.close(s);
34:             DatabaseUtil.close(c);
35:         }
36:     }
37: 
38:     protected abstract void installSchemaImpl(Statement s) throws SQLException;
39: 
40:     public void populateTables() throws SQLException {
41:         Connection c = null; // NOPMD by brett.schuchert on 7/11/06 11:27 PM
42:         PreparedStatement ps = null;
43: 
44:         try {
45:             c = dataSource.getConnection();
46:             ps = c.prepareStatement(getInsertStatement());
47:             populateTablesImpl(ps);
48:         } finally {
49:             DatabaseUtil.close(ps);
50:             DatabaseUtil.close(c);
51:         }
52:     }
53: 
54:     protected abstract void populateTablesImpl(PreparedStatement ps) throws SQLException;
55: 
56:     protected abstract String getInsertStatement();
57: 
58:     public void performSearch() throws SQLException {
59:         Connection c = null; // NOPMD by brett.schuchert on 7/11/06 11:27 PM
60:         PreparedStatement ps = null;
61:         ResultSet rs = null; // NOPMD by brett.schuchert on 7/11/06 11:27 PM
62: 
63:         try {
64:             c = dataSource.getConnection();
65:             ps = c.prepareStatement(getSearchStatement());
66:             performSearchImpl(ps);
67:         } finally {
68:             DatabaseUtil.close(rs);
69:             DatabaseUtil.close(ps);
70:             DatabaseUtil.close(c);
71:         }
72:     }
73: 
74:     protected abstract void performSearchImpl(PreparedStatement ps) throws SQLException;
75: 
76:     protected abstract String getSearchStatement();
77: }
```
### Interesting Lines
||Line||Description||
----
[[#Example2]]
## Example2.java
```java
01: package aab.valtech.jug.templatemethod;
02: 
03: import java.sql.PreparedStatement;
04: import java.sql.ResultSet;
05: import java.sql.SQLException;
06: import java.sql.Statement;
07: 
08: import loggingutil.ILogger;
09: import loggingutil.LoggingConfiguration;
10: 
11: import com.valtech.util.DatabaseUtil;
12: 
13: public class Example2 extends AbstractTemplateMethod {
14:     private static final ILogger logger = LoggingConfiguration
15:             .getLoggerFor(AbstractTemplateMethod.class);
16: 
17:     public static final String CREATE_TABLE = "CREATE TABLE customer (First_Name char(50), Last_Name char(50))";
18: 
19:     public static final String INSERT = "INSERT INTO customer (First_Name, Last_Name) VALUES (?, ?)";
20: 
21:     public static final String SELECT_BY_FIRST = "SELECT First_Name, Last_Name from Customer where First_Name = ?";
22: 
23:     @Override
24:     protected void installSchemaImpl(final Statement s) throws SQLException {
25:         s.executeUpdate(CREATE_TABLE);
26:     }
27: 
28:     @Override
29:     protected void populateTablesImpl(final PreparedStatement ps) throws SQLException {
30:         insertOneRecord(ps, "Brett", "Schuchert");
31:         insertOneRecord(ps, "Jeana", "Smith");
32:         insertOneRecord(ps, "Brett", "Anotherone");
33:     }
34: 
35:     private void insertOneRecord(final PreparedStatement ps, final String firstName,
36:             final String lastName) throws SQLException {
37:         ps.setString(1, firstName);
38:         ps.setString(2, lastName);
39:         ps.executeUpdate();
40:     }
41: 
42:     @Override
43:     protected String getInsertStatement() {
44:         return INSERT;
45:     }
46: 
47:     @Override
48:     protected void performSearchImpl(final PreparedStatement ps) throws SQLException {
49:         ps.setString(1, "Brett");
50:         final ResultSet rs = ps.executeQuery(); // NOPMD by brett.schuchert on
51:                                                 // 7/11/06 11:25 PM
52:         logger.debug("Records found:");
53:         while (rs.next()) {
54:             logger.debug("\n\t%s %s", rs.getString(1), rs.getString(2));
55:         }
56:         DatabaseUtil.close(rs);
57:     }
58: 
59:     @Override
60:     protected String getSearchStatement() {
61:         return SELECT_BY_FIRST;
62:     }
63: }
```
### Interesting Lines
||Line||Description||
----
[[#JdbcExample]]
## JdbcExample.java
```java
01: package aab.valtech.jug.templatemethod;
02: 
03: import java.sql.SQLException;
04: 
05: import loggingutil.ILogger;
06: import loggingutil.LoggingConfiguration;
07: 
08: public class JdbcExample {
09:     private JdbcExample() {
10:         // do not instantiate me
11:     }
12: 
13:     private static final ILogger logger = LoggingConfiguration.getLoggerFor(JdbcExample.class);
14: 
15:     public static void main(final String args[]) throws SQLException {
16:         logger.debug("Version 2");
17: 
18:         final Example2 e = new Example2();
19:         e.installSchema();
20:         e.populateTables();
21:         e.performSearch();
22:     }
23: }
```
### Interesting Lines
||Line||Description||

[[Spring Templates Typical JDBC|<--Back]] [[Spring Templates JDBC Strategy Is A Template|Next-->]]