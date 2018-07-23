---
title: JMock-Verify_Method_Called_Exactly_Once_
---
[[TDD Example Catalog|<--Back]]

## Verify a sequence of methods
This test method exists in a [[jMock JUnit 4 Die Skeleton]].

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

[[TDD Example Catalog|<--Back]]

