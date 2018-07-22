[[TDD Example Catalog|<--Back]]

||**Line**||**Effect**||
||5||Ignore any calls of the method getBalance() on the account object. Note if we don't do this, then calling getBalance one or more times will cause the test to fail.||
||6||The method getBalance() will return 2500 every time it is called. We've effectively stubbed this method.||
||7||We will call the method deduct() exactly once on the account object. When it is called, the value 1500 will be the value of the parameter passed.||

```java
01: @Test
02: public void executeWithdrawChangesBalanceAndSetsExecuted() {
03:     context.checking(new Expectations() {
04:         {
05:             ignoring(account).getBalance();
06:             will(returnValue(2500));
07:             one(account).deduct(with(equal(1500)));
08:         }
09:     });
10: 
11:     withdrawal.execute();
12: 
13:     assertEquals(true, withdrawal.isExecuted());
14: }
```

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

[[TDD Example Catalog|<--Back]]

