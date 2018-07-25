---
title: JMock-Example_validating_sequencing_of_method_invocations
---
This is another example where the last test actually validates that certain messages happen in a particular order. The test is called **generatesCorrectSummaryReport** and it creates a jMock "Sequence" that verifies the following:
* The method **SummaryReportPrinter.displayTransactionSummary** is called 5 times in a row with the values: 10, 20, 30, 40, 50
* Next, the method **SummaryReportPrinter.displayTotalSales** is called with a value of 150
* Finally, the method **SummaryReportPrinter.displayBalance** is called with a value of 483
* The test also allows **SummaryReportPrinter.Transaction.getBalance()** to be called any number of times

----
**PointOfSaleTerminalTest**
```java
package com.objectmentor.post;

import static org.junit.Assert.assertEquals;
import junit.framework.JUnit4TestAdapter;

import org.jmock.Expectations;
import org.jmock.Mockery;
import org.jmock.Sequence;
import org.jmock.integration.junit4.JMock;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(JMock.class)
public class PointOfSaleTerminalTest {
    public static junit.framework.Test suite() {
        return new JUnit4TestAdapter(PointOfSaleTerminalTest.class);
    }

    Mockery context = new Mockery();
    PointOfSaleTerminal pointOfSaleTerminal;

    @Before
    public void createPointOfSaleTerminal() {
        pointOfSaleTerminal = new PointOfSaleTerminal();
    }

    @Test
    public void canHaveInitialBalanceSetAndConfirmed() {
        pointOfSaleTerminal.setBalance(100000);
        assertEquals(100000, pointOfSaleTerminal.getBalance());
    }

    @Test
    public void balanceReflectsSingleSale() {
        final Transaction transacton = context.mock(Transaction.class);
        context.checking(new Expectations() {
            {
                one(transacton).getAmountDue();
                will(returnValue(15));
            }
        });

        pointOfSaleTerminal.setBalance(27);
        pointOfSaleTerminal.addTransaction(transacton);
        assertEquals(42, pointOfSaleTerminal.getBalance());
    }

    private int calculateAmount(int index) {
        return index * 10;
    }

    private void addTransaction(final int index) {
        final Transaction transaction = context.mock(Transaction.class);
        context.checking(new Expectations() {
            {
                ignoring(transaction).getAmountDue();
                will(returnValue(calculateAmount(index + 1)));
            }
        });
        pointOfSaleTerminal.addTransaction(transaction);
    }

    private void addTransactionSummaryExpectation(final SummaryReportPrinter summaryReportPrinter,
            final Sequence printSequence, final int index) {
        context.checking(new Expectations() {
            {
                one(summaryReportPrinter).displayTransactionSummary(with(equal(index)),
                        with(equal(calculateAmount(index))));
                inSequence(printSequence);
            }
        });
    }

    @Test
    public void generatesCorrectSummaryReport() {
        final int extectedBalance = 333;
        pointOfSaleTerminal.setBalance(extectedBalance);

        for (int i = 0; i < 5; ++i) {
            addTransaction(i);
        }

        final SummaryReportPrinter summaryReportPrinter = context.mock(SummaryReportPrinter.class);
        final Sequence printSequence = context.sequence("printSequence");

        context.checking(new Expectations() {
            {
                for (int i = 1; i <= 5; ++i) {
                    addTransactionSummaryExpectation(summaryReportPrinter, printSequence, i);
                }
                final int expectedTotal = 150;
                one(summaryReportPrinter).displayTotalSales(with(equal(expectedTotal)));
                inSequence(printSequence);
                one(summaryReportPrinter).displayBalance(
                        with(equal(expectedTotal + extectedBalance)));
                inSequence(printSequence);
            }
        });

        pointOfSaleTerminal.setSummaryReportPrinter(summaryReportPrinter);
        pointOfSaleTerminal.generateSummaryReport();
    }
}
```

----
**PointOfSaleTerminal**
```java
package com.objectmentor.post;

import java.util.LinkedList;
import java.util.List;

public class PointOfSaleTerminal {
    List<Transaction> transactions = new LinkedList<Transaction>();
    int initialBalance;
    private SummaryReportPrinter summaryReportPrinter;

    public void setBalance(int balance) {
        this.initialBalance = balance;
    }

    public int getBalance() {
        int balance = initialBalance;
        for (Transaction transaction : transactions) {
            balance += transaction.getAmountDue();
        }

        return balance;
    }

    public void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }

    public void generateSummaryReport() {
        int index = 0;
        for (Transaction transaction : transactions) {
            int amountDue = transaction.getAmountDue();
            summaryReportPrinter.displayTransactionSummary(++index, amountDue);
        }

        int balance = getBalance();
        int totalSales = balance - initialBalance;
        summaryReportPrinter.displayTotalSales(totalSales);
        summaryReportPrinter.displayBalance(balance);
    }

    public void setSummaryReportPrinter(SummaryReportPrinter summaryReportPrinter) {
        this.summaryReportPrinter = summaryReportPrinter;
    }
}
```

----
**SummaryReportPrinter**
```java
package com.objectmentor.post;

public interface SummaryReportPrinter {
    void displayTransactionSummary(int index, int totalAmount);
    void displayTotalSales(int totalAmount);
    void displayBalance(int amount);
}
```

----
**Transaction**
```java
package com.objectmentor.post;

public interface Transaction {
    int getAmountDue();
}
```
