---
title: TddAndConcurrency.Slides.ICantWaitWellYouShouldntHaveTo
---
[<--Back]({{ site.pagesurl}}/TddAndConcurrency.Slides.WhenItsQuietBeAfraidVeryAfraid) | [^Top^]({{ site.pagesurl}}/TddAndConcurrency.Slides) | [Next-->]({{ site.pagesurl}}/TddAndConcurrency.Slides.KeepItAwayFromMe)

# I Can't Wait Well You Shouldn't Have To
## You’re waiting for another team to load the database
This problem derives from recent consulting work. It has been changed to protect the innocent.

Problem: Database synchronization takes about 10 hours.

A Few facts
* Currently convert roughly 2 records per second
* As written, running tests requires another team to load records in to an external database.
* Think wait-time is roughly 300 – 400 ms per record (reading and writing)

Final Results: 15 threads, 28 minutes…
----
----
## Here's the code as written (not test first)
```java
public void execute() {
   service = Executors.newFixedThreadPool(THREADS);
   
   for (Long id : vendorSynchronizationService.getVendorIds()) {
      final Long finalId = id;
      service.execute(new Runnable() {
         public void run() {
            vendorSynchronizationService.synchronizeRecord(finalId);
         }
      });
   }
   service.shutdown();
}
```
----
----
## Create a Fake Vendor Synchronization Service
First the test:
```java
public class FakeVendorSynchronizationServiceTest {
   @Test
   public void convertsApproximately2PerSecond() throws Exception {
       VendorSynchronizationService service 
           new FakeVendorSynchronizationService();

       long start = System.currentTimeMillis();

       service.synchronizeRecord(0);
       service.synchronizeRecord(0);

       long stop = System.currentTimeMillis();
       long runningTime = stop - start;

       assertTrue("" + runningTime, 
          runningTime >= 900 && 
          runningTime <= 1100);
    }
}
```
----
----
## Create a Fake Vendor Synchronization Service
Next, the fake:
```java
public class FakeVendorSynchronizationService 
                                extends VendorSynchronizationService {

   public void synchronizeRecord(long recordId) {
      simulateDatabaseReadDelay();
      simulateWorkLoad();
   }

   private void simulateDatabaseReadDelay() {
      try { Thread.sleep(450); } 
      catch (InterruptedException ignored) { ; }
   }

   private BigDecimal simulateWorkLoad() {
      BigDecimal value = new BigDecimal(0);
      for (int i = 0; i < 200000; ++i)
         value = value.multiply(new BigDecimal(1023));
      return value;
   }
}
```
----
----
## Next, express how fast is fast enough
```java
public class VendorSynchronizerTest {
   private static final int DELAY = 60;

   @Test(timeout = DELAY * 1000)
   public void CanProcess120VendorsIn60Seconds() throws Exception {
      FakeVendorSynchronizationService service 
         = new FakeVendorSynchronizationService();
      VendorSynchronizer synchronizer 
         = new VendorSynchronizer(service);

      synchronizer.execute();
        
      synchronizer.service.awaitTermination(DELAY, TimeUnit.SECONDS);
        
      assertTrue(synchronizer.service.isTerminated());
    }
}
```

As a bonus, this validates MT logic as well…
----
----

[<--Back]({{ site.pagesurl}}/TddAndConcurrency.Slides.WhenItsQuietBeAfraidVeryAfraid) | [^Top^]({{ site.pagesurl}}/TddAndConcurrency.Slides) | [Next-->]({{ site.pagesurl}}/TddAndConcurrency.Slides.KeepItAwayFromMe)