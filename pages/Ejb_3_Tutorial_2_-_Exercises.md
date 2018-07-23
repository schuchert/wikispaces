---
title: Ejb_3_Tutorial_2_-_Exercises
---
## Fetching and Lazy Initialization
The Company entity has one attribute where we've specified the fetch type. Review the employees attribute in Company.java. Remove the **```fetch = FetchType.EAGER```** and execute the tests.  

There's another way to make this "work" by manually reading the contents of the collection. Experiment with that and see if you can get it to work using this technique.  What is the impact of //@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)// on a lazy fetch? (Hint: you might have some issues with this combination.)

**Review** 
* Which approach do you prefer?
* What are the advantages/disadvantages?
* Give one example where you'd use each technique.
* Suggest a way to rewrite this or the test or both to remove the need to perform eager fetching.

Hint: You can compare the SQL from each approach by adding the following line to the persistence.xml:

```
         <property name="hibernate.show_sql" value="true" />
```

## Fetch and Lazy Initialization Revisited
Add a unit test where you:
# Create a person
# Create a company
# Hire the person
# Retrieve the person (you can add a new DAO or simply add a method to the Company Dao)
# Verify that they have one job and that it is for the expected company.
**Review**
* Did this test work? If not, why? If so, what can you say about @OneToMany versus @ManyToOne?
* If it did not work, fix it.

## Add Tests
Review the driver from the first JPA tutorial. Use that as example source from which you can derive tests.

In addition, add the following tests:
**Attempt to Hire Person Already Hired**
Write a test that creates a Person and 2 companies. Hire the person at the first company. Attempt to hire the person for the second company.

The results should be one of two things (you choose):
* The test expects some kind of exception like "Person Has a Job" to be thrown.
* You change the relationship between Person and Company to be bi-direction and many to many so that a Person can work for multiple companies.

**Hire Person with Same Name/Address**
Create two people and hire them both. Make sure this works.

Question, do you think it should work? If not, then update the equals and hashCode method and make this test be one that only works if the attempt fails.

## Test Isolation
Use the installed QuantumDB Perspective to discover if our tests are leaving around objects after they have completed. Assuming they have, write code to have each test clean up after itself.
