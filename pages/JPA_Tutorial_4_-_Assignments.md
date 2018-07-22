### Director <--> DVD===
Right now the relationship between Director and DVD is one-way. Make it bidirectional.

### Experiment with Inheritance Types===
We use InheritanceType.JOINED. There are two others, SINGLE_TABLE, TABLE_PER_CLASS. Try out both of those and see if you can figure out what is happening for each of them.  Be sure to re-run all the unit tests after switching to each type.

# When you switch to the SINGLE_TABLE approach, what happens with column nullability, the isbn column (from Book), and the Dvd class?
# When you switch to the TABLE_PER_CLASS approach, why does the key generation strategy have to change to in order fix the 'Cannot use identity column key generation' error?  What did you change to, and why?
# Can you sum up the advantages/disadvantages of each approach?   


### Sub-resource queries===
Create a query that returns only Books or only Dvds.

### Draw Tables===
Create a visual representation of the database tables generated. Consider using SQuirreL SQL Client or the Quantum DB plugin for eclipse.

### Update UI===
Update your UI to allow a user to add a new DVD and a Patron to check out dvd's.

### Name Equality===
During the first offering of the class, one student asked about the Name object, which is used in an {{equals()}} and {{hashCode()}} method. It turns out that the unit tests written did not expose the fact that the Name class lacks these methosd.

Here's a unit test, add it and get it to work:
```java
package entity;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class NameTest {
    @Test
    public void nameSame() {
        final Name n1 = new Name("John", "Doe");
        final Name n2 = new Name("John", "Doe");

        assertEquals(n1, n2);
        assertEquals(n1.hashCode(), n2.hashCode());
    }
}
```
