---
title: Ejb3_Tutorial_3_Background
---
 A key difference between what we did and what we're going to do is transactional demarcation. In our JSE environment, we had a @Before method that started a transaction and an @After method that rolled the transaction back. This meant that multiple messages to, for example, the library, all happened in the same transaction. We can get similar behavior to this using EJB3 Session Beans with Extended Persistence Contexts. However, we're going to stick with Stateless Session Beans using transaction-scoped persistence contexts.

By default, each outer-most execution of a session bean method will:
* Initialize the persistence context
* Start a transaction
* Execute the method
* Commit the transaction
* Clear the persistence context

If, within a session bean, the code calls another session bean, the following happens:
* Work with existing persistence context
* Join existing transaction
* Execute the method

With a regular persistence context, committing a transaction causes everything in the persistence context to be flushed. That means two things:
* Objects are no longer managed (they are detached)
* Lazily-initialized relationships can no longer be traversed

If you use an extended persistence context, closing the transaction does not clear the persistence context. We will look at this further in a later tutorial. For now, we're sticking with the basics.
