---
title: PPPChapter9RepackagingExercise
---

[up](Vancouver_PPP_Exercise_Ch8and9)

In parts 1 and 2 we practiced creating components from an existing system using pencil and paper. Now we'll take that one step further and create a component from actual code.

## Problem
In our existing project **Exercise9-PackageDecoupling**, we have a simple servlet framework we'd like to pull out and use in another project. The problem is that it is currently embedded. We need to pull out this "reusable" code into its own component and then make sure that it still works in the original system.

Here are some steps you can follow:
* Create a new project in your IDE. That project needs the following jars it its classpath:
  * junit (use the one provided by your IDE)
  * javax.servlet.jar (provided)
  * javax.servlet.jsp.jar (provided)
* Pull an "anchor" class into the new project
  * Find the class **ControllerServlet** in the package com.objectmentor.library.web.framework.
  * Create the package com.objectmentor.library.web.framework in your new project
  * Copy the **ControllerServlet** into this new package
* You'll notice several compilation errors. We need to fix each one of those. Here's what you should do:
  * Review each error. Most of the errors relate to missing classes.
  * For now,**ignore** the errors in ControllerServlet related to the following classes:  **Application**, **ServiceProvider**, **OnLineServiceProvider**, **OffLineServiceProvider** (we'll fix those last). These errors all in the methods: **ensureApplicationIsInSession** and **getServiceProvider**.
  * Copy each of the missing classes from the original project into your new project. As you do so, you'll occasionally need to create new packages.
  * Make sure to review the unit tests and move those as appropriate.
* You should have only a few errors left in the **ControllerServlet** class in the methods: **ensureApplicationIsInSession** and **getServiceProvider**, all related to the missing classes listed above. We deferred these changes because, unlike copying classes, we want to change our design.
* Review the method **ensureApplicationIsInSession**. Notice that it creates an instance of an **Application** if one does not exist. If you review the **Application** class, you'll notice that it has several dependencies that are specific to our application. We have a generic servlet framework that should have no application-specific knowledge. We need to break this dependency:
  * Upon further review of this method, you'll notice that it really doesn't care about the Application other than to create it. Move the creation of the application into a Factory and out of this class. The factory should be in the same project, however.
  * Make this factory "pluggable". A you might consider simply having the factory return instances of a class, which you can set.
  * What should the factory return? If it returns an application, then that class needs to be in our component. You have two options. One, have the factory return Object. Two, make an **Application** interface with no methods.
  * Notice that when you move the creation of the **Application** out of the **ControllerServlet** class, the **getServiceProvider** method is no longer used. There are two parts to this method: determine online/offline status, create instances of classes. The first part is reasonable to keep, whereas the second part does not make sense in a reusable component.
  * Assuming you maintained the **getServiceProvider** method and continued to keep the online/offline status maintained, there will be one test in **ControllerServletOnlineVsOfflineTest**, **testRunningOfflineSetsMockIsbnServiceOnApplicationAndLibraryAndCatalog**, that needs to be removed. It checks for a particular instance of a class specific to the original application. This kind of test might be appropriate in your application tests but not in the component tests.
* Run all of your tests. You'll probably notice that some of them fail. Upon review, you'll notice that your factory probably needs some configuration information set by your tests. Fix this and make sure that all of your tests pass.
* Verify that you are still compiling and green in your original project (you should not have made any changes yet).
* Have the original project **Exercise9-PackageDecoupling** depend on your newly created project (alternatively, generate a jar file from your new project and add it to the classpath of your original project.
* Remove from the **Exercise9-PackageDecoupling** project all of the classes you copied into the new project. As you do so, you'll probably have to refactor imports or recompile to make sure things compiled.
* Run all of your tests. A few may fail. Upon review, you'll notice that you probably need to update a few tests to configure the **Application** factory.
* Make sure you're green. Congratulations, you've just make a new, reusable component. What does it take to us this new component in a new application?

[up](Vancouver_PPP_Exercise_Ch8and9)
