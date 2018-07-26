---
title: tdd_intro.CreatingAnEmptyProject
---
# Create a new project
* Use the default maven archetype:
{% highlight terminal %}
    mvn archetype:generate <<enter>>
{% endhighlight %}
* Accept default project (note: the number will change from time to time, it is 670 in this example)
{% highlight terminal %}
    Choose a number or apply filter (format: [groupId:]artifactId, case sensitive contains): 670: <<enter>>
{% endhighlight %}
* Accept the default version
{% highlight terminal %}
    5: 1.0
    6: 1.1
    Choose a number: 6: <<enter>>
{% endhighlight %}
* Enter a group id (e.g., com.shoe)
{% highlight terminal %}
    Define value for property 'groupId': : com.shoe <<enter>>
{% endhighlight %}
* Enter artifact (project name, e.g., paginator)
{% highlight terminal %}
    Define value for property 'artifactId': : paginator <<enter>>
{% endhighlight %}
* Accept default version
{% highlight terminal %}
    Define value for property 'version':  1.0-SNAPSHOT: : <<enter>>
{% endhighlight %}
* Enter default package (e.g., com.shoe.paginator <enter>)
{% highlight terminal %}
Define value for property 'package':  com.shoe: : com.shoe.paginator <<enter>>
{% endhighlight %}
* Confirm the configuration
{% highlight terminal %}
    Confirm properties configuration:
    groupId: com.shoe
    artifactId: paginator
    version: 1.0-SNAPSHOT
    package: com.shoe.paginator
     Y: : <<enter>>
{% endhighlight %}
# Check the project
* Change to directory created (e.g., cd paginator)
{% highlight terminal %}
    cd paginator <<enter>> 
{% endhighlight %}
* Run the tests
{% highlight terminal %}
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
{% endhighlight %}
# Modernize the project
* Edit pom.xml
* Change JUnit version to 4.12
* Modify the target Java version (paste above <dependencies>:
{% highlight terminal %}
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
{% endhighlight %}
* Reconfirm build
{% highlight terminal %}
    mvn test <<enter>>
{% endhighlight %}
* Remove source files created by mvn archetype:generate above
{% highlight terminal %}
    find . -name \*.java | xargs rm
{% endhighlight %}
# Optionally create a git repo out of this directory
{% highlight terminal %}
    git init
    echo "target" > .gitignore
    git add pom.xml .gitignore
    git commit -m "Initial commit"
{% endhighlight %}
# You are ready to open pom.xml in an ide
[media_type="vimeo"_key="143582262"_height="313"_width="500"]({{site.pagesurl}}/media_type="vimeo"_key="143582262"_height="313"_width="500")
