## Overview
This page describes the steps I follow to setup an Eclipse-based project for developing a new Wicket project. These steps are really just a detailed version of what you can find at: [[http://wicket.apache.org/quickstart.html|the Wicket quickstart page]].

## Create a Space
* Begin by creating a source directory. For this example, I'll create a directory called CheesrWorkspace (example project from the [[http://www.amazon.com/Wicket-Action-Martijn-Dashorst/dp/1932394982/ref=sr_1_1?ie=UTF8&s=books&qid=1253681267&sr=8-1|Wicket in Action]] book.
```
macintosh-4% cd ~/src
/Users/schuchert/src
macintosh-4% mkdir CheesrWorkspace
macintosh-4% cd CheesrWorkspace
/Users/schuchert/src/CheesrWorkspace
macintosh-4% git init
Initialized empty Git repository in /Users/schuchert/src/CheesrWorkspace/.git/
macintosh-4% 
```

Note: I'll be using git for revision control, so I also added in that last step to init this newly-created subdirectory as a git repository.

## Create Project Using Maven 2
There's a simple form you can fill out on [[http://wicket.apache.org/quickstart.html|the Wicket quickstart page]] to create a maven command that will create the project structure.

* Fill out the form (I used com.om for the groupid and Cheesr for the artifactid), which produces the following command:
```
mvn archetype:create -DarchetypeGroupId=org.apache.wicket \
   -DarchetypeArtifactId=wicket-archetype-quickstart \
   -DarchetypeVersion=1.4.1 -DgroupId=com.om -DartifactId=Cheesr
```

* Execute that command:
```
macintosh-4% pwd
/Users/schuchert/src/CheesrWorkspace
macintosh-4% mvn archetype:create -DarchetypeGroupId=org.apache.wicket \
   -DarchetypeArtifactId=wicket-archetype-quickstart -DarchetypeVersion=1.4.1 \
   -DgroupId=com.om -DartifactId=Cheesr
[INFO] Scanning for projects...
[INFO] Searching repository for plugin with prefix: 'archetype'.
[INFO] ------------------------------------------------------------------------
[INFO] Building Maven Default Project
[INFO]    task-segment: [archetype:create] (aggregator-style)
[INFO] ------------------------------------------------------------------------
[INFO] Setting property: classpath.resource.loader.class => 'org.codehaus.plexus.velocity.<snip>'.
[INFO] Setting property: velocimacro.messages.on => 'false'.
[INFO] Setting property: resource.loader => 'classpath'.
[INFO] Setting property: resource.manager.logwhenfound => 'false'.
[INFO] [archetype:create]
[WARNING] This goal is deprecated. Please use mvn archetype:generate instead
[INFO] Defaulting package to group ID: com.om
[INFO] ----------------------------------------------------------------------------
[INFO] Using following parameters for creating OldArchetype: wicket-archetype-quickstart:1.4.1
[INFO] ----------------------------------------------------------------------------
[INFO] Parameter: groupId, Value: com.om
[INFO] Parameter: packageName, Value: com.om
[INFO] Parameter: package, Value: com.om
[INFO] Parameter: artifactId, Value: Cheesr
[INFO] Parameter: basedir, Value: /Users/schuchert/src/CheesrWorkspace
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] ********************* End of debug info from resources from generated POM ***********************
[INFO] OldArchetype created in dir: /Users/schuchert/src/CheesrWorkspace/Cheesr
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESSFUL
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2 seconds
[INFO] Finished at: Tue Sep 22 23:55:13 CDT 2009
[INFO] Final Memory: 11M/79M
[INFO] ------------------------------------------------------------------------
macintosh-4% 
```

## Update POM
By default, the project depends on JUnit 3.x, so I update the POM.xml to instead depend on a newer version of JUnit.

* Edit pom.xml under the Cheesr directory
```
macintosh-4% cd Cheesr 
/Users/schuchert/src/CheesrWorkspace/Cheesr
macintosh-4% ls
pom.xml		src/
macintosh-4% vi pom.xml
```

* Search for "junit"
* Update the following line:
```
<version>3.8.2</version>
```
* Use a newer version:
```
<version>4.7</version>
```

## Create Eclipse Project Information
Now that you have an updated POM, you can create the eclipse project. The [[http://wicket.apache.org/quickstart.html|the Wicket quickstart page]] has instructions at the bottom. 

* Make sure you are in the project directory created by the initial mvn command.
* Execute: mvn eclipse:eclipse -DdownloadSources=true
```
macintosh-4% pwd
/Users/schuchert/src/CheesrWorkspace/Cheesr
macintosh-4% mvn eclipse:eclipse -DdownloadSources=true
[INFO] Scanning for projects...
[INFO] Searching repository for plugin with prefix: 'eclipse'.
[INFO] ------------------------------------------------------------------------
[INFO] Building quickstart
[INFO]    task-segment: [eclipse:eclipse]
[INFO] ------------------------------------------------------------------------
[INFO] Preparing eclipse:eclipse
[INFO] No goals needed for project - skipping
[INFO] [eclipse:eclipse]
[INFO] Using Eclipse Workspace: null
[INFO] Adding default classpath container: org.eclipse.jdt.launching.JRE_CONTAINER
[INFO] Resource directory's path matches an existing source directory. Resources will <snip>
[INFO] Resource directory's path matches an existing source directory. Resources will <snip>
[INFO] Wrote settings to /Users/schuchert/src/CheesrWorkspace/Cheesr/.settings/org.eclipse.jdt.core.prefs
[INFO] Wrote Eclipse project for "Cheesr" to /Users/schuchert/src/CheesrWorkspace/Cheesr.
[INFO] 
       Javadoc for some artifacts is not available.
       Please run the same goal with the -DdownloadJavadocs=true parameter <snip>
       List of artifacts without a javadoc archive:
         o junit:junit:4.7
         o log4j:log4j:1.2.14
         o org.apache.wicket:wicket:1.4.1
         o org.slf4j:slf4j-api:1.4.2
         o org.mortbay.jetty:jetty:6.1.4
         o org.mortbay.jetty:jetty-util:6.1.4
         o org.mortbay.jetty:servlet-api-2.5:6.1.4
         o org.mortbay.jetty:jetty-management:6.1.4
         o mx4j:mx4j:3.0.1
         o mx4j:mx4j-tools:3.0.1
         o org.slf4j:slf4j-log4j12:1.4.2

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESSFUL
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 3 seconds
[INFO] Finished at: Wed Sep 23 00:02:17 CDT 2009
[INFO] Final Memory: 14M/79M
[INFO] ------------------------------------------------------------------------
macintosh-4% 
```

## Start Eclipse and Create Java Project
Now we need to start Eclipse and make a few minor corrections:

* Start Eclipse.
* When asked for a directory, select the original directory you created (in my case, that's /Users/schuchert/src/CheesrWorkspace)
* Import existing project:
** Right-click in Project Explorer
** Select Import::Import...
** Open General
** Select Existing Projects into Workspace
** Click **Next**
** Click **Browse**
** Click **Open**
** Click **Finish**

The generated classpath uses a classpath variable: M2_REPO. Fix that next:
* Go to the Eclipse Preferences Window (windows->Window:Preferences, Mac->Command,)
* In the filter, type classpath
* Select Classpath Variables under Java:Build Path
* Click **New**
* For the name, enter M2_REPO
* For the path, enter the location of your Maven 2 repository. (In my case, it is ~/.m2/repository, but you must enter the full path, so it is actually: /Users/schuchert/.m2/repository.)
* Click **Ok**
* When asked to rebuild all, select **Yes**

## Verify Everything Works
You can start you server to verify that it is working:
* Find the Start.java class under src/test/java (in the one package created in the first step above)
* Run it as a Java application
* Start a browser (or browse to the following URL in Eclipse): http://localhost:8080/
* You should see something like the following:
```
Wicket Quickstart Archetype Homepage

If you see this message wicket is properly configured and running
```

Congratulations, you are done.


