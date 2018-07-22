[[TDD Example Catalog|<--Back]]

## Introduction==
This is a complete, albeit simple, example using jMock. To get this running, you'll need to do the following
# Use Java 5 or later
# Add JUnit 4 to your classpath
# Download [[http://www.jmock.org/download.html|jMock]]
# Extract the download and add the 4 jars into your classpath (note your version numbers might be different):
** jmock-2.0.0.jar
** jmock-junit4-2.0.0.jar
** hamcrest-api-1.0.jar
** hamcrest-library-1.0.jar
# Take each of the following files and add them into a project in your favorite IDE

## WithdrawalTest.java==
```java
package com.objectmentor.jmock;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import junit.framework.JUnit4TestAdapter;

import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.integration.junit4.JMock;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(JMock.class)
public class WithdrawalTest {
    public static junit.framework.Test suite() {
        return new JUnit4TestAdapter(WithdrawalTest.class);
    }

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

    @Test
    public void failExecutionIfBalanceInadequate() {
        context.checking(new Expectations() {
            {
                one(account).getBalance();
                will(returnValue(1000));
            }
        });

        boolean exceptionThrown = false;

        try {
            withdrawal.execute();
        } catch (InsufficientFunds e) {
            // success
            exceptionThrown = true;
        }
        assertTrue("Should have thrown: " + InsufficientFunds.class,
                exceptionThrown);
    }

    @Test
    public void executeWithdrawChangesBalanceAndSetsExecuted() {
        context.checking(new Expectations() {
            {
                ignoring(account).getBalance();
                will(returnValue(2500));
                one(account).deduct(with(equal(1500)));
            }
        });

        withdrawal.execute();

        assertEquals(true, withdrawal.isExecuted());
    }

    @Test
    public void methodThatWeExpectWillThrowAnException() {
        boolean expectedThrown = false;

        try {
            throw new RuntimeException();
        } catch (RuntimeException e) {
            expectedThrown = true;
        }

        assertTrue(expectedThrown);
    }
}
```

## BankAccount.java==
```java
package com.objectmentor.jmock;

public interface BankAccount {
    int getBalance();
    void deduct(int i);
}
```

## Withdrawal.java==
```java
package com.objectmentor.jmock;

public class Withdrawal {
    private BankAccount account;
    private int amount;
    public boolean executed;

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public void setAccount(BankAccount account) {
        this.account = account;
    }

    public void execute() {
        if (account.getBalance() < amount) {
            throw new InsufficientFunds();
        }
        account.deduct(amount);
        executed = true;
    }

    public boolean isExecuted() {
        return executed;
    }
}
```

## InsufficientFunds.java==

```java
package com.objectmentor.jmock;

public class InsufficientFunds extends RuntimeException {
    private static final long serialVersionUID = 1L;
}
```

[[TDD Example Catalog|<--Back]]