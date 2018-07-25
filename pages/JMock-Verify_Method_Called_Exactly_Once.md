---
title: JMock-Verify_Method_Called_Exactly_Once
---
[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)

## Verify a sequence of methods
This test method exists in a [jMock_JUnit_4_Die_Skeleton]({{site.pagesurl}}/jMock_JUnit_4_Die_Skeleton).

Make sure that the testDoubleDie method will first have its roll() method called exactly once and then its getFaceValue() method called exactly once():

```java
@Test
public void rollThenGetFaceValue() {
    context.checking(new Expectations() {
        {
            one(testDoubleDie).roll();
            one(testDoubleDie).getFaceValue();
        }
    });
    
    testDoubleDie.roll();
    testDoubleDie.getFaceValue();
}
```

**Common fixture for the test**
```java
    Withdrawal withdrawal;
    Mockery context = new Mockery();

    BankAccount account;

    @Before
    public void initialize() {
        withdrawal = new Withdrawal();
        withdrawal.setAmount(1500);
        account = context.mock(BankAccount.class);
        withdrawal.setAccount(account);
    }
```

[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)

