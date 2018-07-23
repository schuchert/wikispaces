---
title: Emma_Code_Coverage_vehicle.integration
---
[<--Back]({{ site.pagesurl}}/Emma Code Coverage vehicle.configuration) [Next-->]({{ site.pagesurl}}/Emma Code Coverage vehicle.component.vehicletype)

# Emma Code Coverage vehicle.integration Package

This package starts with 72% coverage. Here are the details for each class:
|name|class, %|method, %|block, %|line, %| 
|IVehicleDaoTest.java|100% (1/1)|78%  (7/9)|51%  (64/126)|52%  (14/27)|
|IRatePlanDaoTest.java|100% (1/1)|78%  (7/9)|56%  (69/123)|55%  (15/27)|
|IRentalAgreementDaoTest.java|100% (1/1)|92%  (12/13)|75%  (134/179)|76%  (40.8/54)|
|IVehicleTypeDaoTest.java|100% (1/1)|85%  (11/13)|87%  (203/234)|87%  (48.9/56)|

## The Plan
**IVehicleDaoTest.java**
This first class is a bit of a mess. First, if you read the Emma documentation you'll understand why all of the finally blocks are yellow (partially covered) instaead of fully covered. In a nutshell, the VM does not have direct support for finally blocks. Instead, the compiler is required to make sure every path out of a method executes the finally code. Since we only go through these tests once and only thorugh one path, we cannot execute all the ways in which the finally block could get executed.

I'm sure this is a nice feature of Emma. I don't care for it but given more experience with Emma, I can see how this could be useful information.

There are two tests that are meant to genreate exceptions. So Emma says those lines are not covered. This is frustrating because I think the results are wrong. I don't know of a way to tell Emma to treat this situation in a special way short of putting these tests in another class and excluding the class from coverage.

Finally, there's some very useful information for the createDuplicateVehicle test method. The first line generates an exception (apparently the one I was expecting) and the rest of the test does not execute. This test is simply wrong but generates a false positive. I'll make changes to this test (missed some required setup).

**IRatePlanDaoTest.java**
The same comments apply for this test as for IVehicleDaoTest. There is one broken test: createRatePlanThatAlreadyExists. I'll fix that (false positive) test and ignore everything else.

**IRentalAgreementDaoTest.java**
Third verse, same as the first. In this case I have the following broken test: createRentalAgreementWithDuplicateId.

**IVehicleTypeDaoTest.java**
I have two broken tests: addVehicleWithNameConflict, addVehicleWithNameConflictAndVehicleInvalid.

With all of these broken tests, I'm starting to think that maybe the @Test(expected=...) in JUnit 4 is at first convenient but has short comings. As of writing this I'm considering not using it since it does not offer a way to inspect the contents of the exception.

If I had written these tests like the following:
```
    @Test 
    public void addVehicleWithNameConflictAndVehicleInvalid() { 
        dao.addVehicleType(makeVehicleTypeNamed(TEST, ValidState.invalid)); 
        try {
            dao.addVehicleType(makeVehicleTypeNamed(TEST, ValidState.invalid)); 
        } catch(ObjectExists e) {
            // verify that e has the right type in it with an assert)
        }
    } 
```
Then the test would have not generated a false positive.

## The Results

[<--Back]({{ site.pagesurl}}/Emma Code Coverage vehicle.configuration) [Next-->]({{ site.pagesurl}}/Emma Code Coverage vehicle.component.vehicletype)