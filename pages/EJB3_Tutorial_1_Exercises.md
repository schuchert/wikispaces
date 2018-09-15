---
title: EJB3_Tutorial_1_Exercises
---
### Track Usage
Add support in your service implementation class to track the number of times the service has been used. Add two support methods to get the count of the number of times the service has been used and a second method to reset the count back to zero.

### Keep a Historical Record
Remember the names of all the people your service has tracked avoiding duplicates. Add two methods to your service: one to report all the names your service has printed, one to clear the list of names.

Note, you'll either want to use **synchronized** for this assignment or better yet, look at the package java.util.concurrent and pay attention to the class **CopyOnWriteArraySet**.

### Advanced
Update your service to keep track of the number of times **each** name has been used. You might want to have a look at the class java.util.concurrent.ConcurrentHashmap.
