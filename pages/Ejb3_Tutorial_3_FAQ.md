---
title: Ejb3_Tutorial_3_FAQ
---
### Q/A
* **@EJB**  //Automatically filling in a dao. If the type of the Bean is unambigious, then JNDI will automatically insert your session bean reference.//
* **Would local interface imply different semantics than remote?**  // The strictness could be better for testing...fail faster.//
* **Brett: Why use EJB3?**  //class: security, easy web services, . brett: transaction demarcation, organizational mandate, standard (community+materials), entity beans done right (jpa), commercial support, //
* **Could you explain injection again?**  //A mechanism to implement Inversion of Control.  An object is told how to get ahold of something it needs by setting the reference before it becomes active.//
* **How is sun making any money?**  ////
* **Brett: Why should you use or not use stateful/stateless session beans? ** // Stateless session beans: things you can fire and forget, lookups, etc.  Stateful: Things where requirements dictate holding on to objects.// 
* **How do you hold on to the same stateful bean object across requests?** // Store the delegate/ref in the httpsession.//
* ** ** // //
* ** ** // //

### Take Aways
* persistence.xml must be in right location or le be your butt.
* Generated values might not make it back to your object if it runs outside the context of a transaction.
* Merge returns a new object (unless the object is already managed)
* Injection using @EJB
* **Use a set when possible (instead of list).   Generally speaking, replace lists with collections**  ////
* **Name magic for mappedBy:  Side with 'mappedBy' is the inverse side.  Other side is the owner ('can exist alone'). * ** ** //visual side discussion//
* **How to know when something detached/attached.**  ////
* **Bi-directional relationships: how to properly delete (+verify it's cleaned up)**  ////
* **Try/catch/finally (in test) sometimes better than @Before/@After for certain init/cleanup**  ////
* **There's some value in having to suffer. (learning how to debug jpa issues)**  ////
* Extended Context: use w/stateful beans, keeps the cache open after the end of transaction 
* ** **  ////
* ** **  ////
