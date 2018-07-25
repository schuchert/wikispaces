---
title: JMock-Fixed_Return_Value
---
[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)

This test method exists in a [[jMock JUnit 4 Die Skeleton]].

**Common fixture for the tests**
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

### Fix the return value of the roll() method
The method "roll()" on the mock object "mockedDie" will always return the value 2. Otherwise, we state that we don't care for jMock to remember, track or in anyway care about the use of the roll() method on mockedDie.

```java
@Test
public void alwaysRoll2() throws Exception {
    context.checking(new Expectations() {
        {
            ignoring(testDoubleDie).roll();
            will(returnValue(2));
        }
    });

    for (int i = 0; i < 100; ++i) {
        assertEquals(2, testDoubleDie.roll());
    }
}
```

## Fix the return value of the faceValue() method
```java
@Test
public void faceValueAlways2() {
    context.checking(new Expectations() {
        {
            ignoring(mockedDie).getFaceValue();
            will(returnValue(2));
        }
    });

    for (int i = 0; i < 100; ++i) {
        assertEquals(2, mockedDie.getFaceValue());
    }
}
```

[<--Back]({{site.pagesurl}}/TDD_Example_Catalog)
