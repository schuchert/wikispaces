---
title: tdd_intro.CreatingAnEmptyProject
---
# Create a new project
* Use the default maven archetype:
```
    mvn archetype:generate <<enter>>
```
* Accept default project (note: the number will change from time to time, it is 670 in this example)
```
    Choose a number or apply filter (format: [groupId:]artifactId, case sensitive contains): 670: <<enter>>
```
* Accept the default version
```
    5: 1.0
    6: 1.1
    Choose a number: 6: <<enter>>
```
* Enter a group id (e.g., com.shoe)
```
    Define value for property 'groupId': : com.shoe <<enter>>
```
* Enter artifact (project name, e.g., paginator)
```
    Define value for property 'artifactId': : paginator <<enter>>
```
* Accept default version
```
    Define value for property 'version':  1.0-SNAPSHOT: : <<enter>>
```
* Enter default package (e.g., com.shoe.paginator <enter>)
    ```
Define value for property 'package':  com.shoe: : com.shoe.paginator <<enter>>
```
* Confirm the configuration
```
    Confirm properties configuration:
    groupId: com.shoe
    artifactId: paginator
    version: 1.0-SNAPSHOT
    package: com.shoe.paginator
     Y: : <<enter>>
```
# Check the project
* Change to directory created (e.g., cd paginator)
```
    cd paginator <<enter>> 
```
* Run the tests
```
    mvn test
    <<snip>>
    -------------------------------------------------------
     T E S T S
    -------------------------------------------------------
    Running com.shoe.paginator.AppTest
    Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.007 sec
    
    Results :
    
    Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
    
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time: 1.466 s
    [INFO] Finished at: 2015-10-26T00:40:22-05:00
    [INFO] Final Memory: 14M/166M
    [INFO] ------------------------------------------------------------------------
````
# Modernize the project
* Edit pom.xml
* Change JUnit version to 4.12
* Modify the target Java version (paste above <dependencies>:
```
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>3.3</version>
				<configuration>
					<source>1.8</source>
					<target>1.8</target>
				</configuration>
			</plugin>
		</plugins>
	</build>
```
* Reconfirm build
```
    mvn test <<enter>>
```
* Remove source files created by mvn archetype:generate above
```
    find . -name \*.java | xargs rm
```
# Optionally create a git repo out of this directory
```
    git init
    echo "target" > .gitignore
    git add pom.xml .gitignore
    git commit -m "Initial commit"
```
# You are ready to open pom.xml in an ide
[[media type="vimeo" key="143582262" height="313" width="500"]]
