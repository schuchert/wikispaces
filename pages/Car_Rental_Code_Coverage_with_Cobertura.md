---
title: Car_Rental_Code_Coverage_with_Cobertura
---
{:toc}
[<--Back](Car_Rental_Example)  [Next-->](Car_Rental_Code_Coverage_with_Cobertura_vehicle.type)

# Code Coverage with Cobertura

This example is based on the [Car_Rental_Example](Car_Rental_Example). If you want work through this example, you need to follow [these instructions](Car_Rental_Installation_and_Setup) first.

In this example, we add code coverage to the Car Rental Application. We then examine the results, make some changes and finish with a few conclusions. 

## Setup and Configuration
Cobertura does not currently come with a plugin, so in this example we'll use [Ant](http://ant.apache.org/) from within Eclipse. I'll warn you that I'm not much of an Ant user, so if you'd like to make recommendations, please feel free: schuchert@yahoo.com.

Let's get started:
**Download**
* Download Cobertura from [here](http://cobertura.sourceforge.net/download.html). Note I downloaded version 1.8 for this example.
* Extract the jar somewhere. I used c:\libs\, which created the directory C:\libs\cobertura-1.8.
* Start Eclipse using the Car Rental workspace. If you used my directory names, it is C:\workspaces\CarRentalExample.

**suite() method**
Ant 1.6.5 does not play nice with JUnit 4.x, so I added a [suite()](JUnit_4.xSuite) method to each of my classes. Depending on when you downloaded this file, you already have those suite methods.
 
**Ant Script**
When you followed [these instructions](Car_Rental_Installation_and_Setup), you should have created a workspace with three projects:
* CarRental
* LoggingUtils
* ToolConfiguration

Under CarRental there is an xml directory that contains two ant build files:
* cobertura.xml
* emma.xml

(By the way, let me give credit where it's due, I got most of this from [Cobertura Ant Task Reference](http://cobertura.sourceforge.net/anttaskreference.html).

Here's the file so we can discuss it and configure it for your situation:

----
[#cobertura](#cobertura)
## cobertura.xml
{% highlight xml %}
 <?xml version="1.0" encoding="UTF-8"?>
 <project name="cobertura" default="coverage-report">
 
    <property name="cobertura.dir" value="C:/libs/cobertura-1.8" />
 
    <path id="cobertura.classpath">
       <fileset dir="${cobertura.dir}">
          <include name="cobertura.jar" />
          <include name="lib/**/*.jar" />
       </fileset>
    </path>
 
    <taskdef classpathref="cobertura.classpath" resource="tasks.properties" />
 
    <target name="init">
       <property name="base.dir" value=".." />
       <property name="cobertura.out.dir" value="${base.dir}/cobertura_results" />
       <property name="cobertura.datafile" value="${cobertura.out.dir}/cobertura.ser" />
 
       <delete dir="${cobertura.out.dir}" quiet="true" />
       <mkdir dir="${cobertura.out.dir}" />
 
       <property name="classes.dir" value="${cobertura.out.dir}/instrumented-classes" />
       <property name="testreport.dir" value="${cobertura.out.dir}/reports" />
       <property name="spring.jar" value="C:/libs/spring-framework-2.0-rc2/dist/spring.jar" />
       <property name="spring.lib" value="C:/libs/spring-framework-2.0-rc2/lib" />
       <property name="aspectj.lib" value="C:/libs/aspectj/lib" />
       <property name="loggingutil.dir" value="C:/workspaces/CarRentalExample/LoggingUtils" />
 
    </target>
 
    <target name="instrument" depends="init">
       <cobertura-instrument todir="${classes.dir}" datafile="${cobertura.datafile}">
          <classpath refid="cobertura.classpath" />
          <classpath location="${spring.lib}/log4j/log4j-1.2.13.jar" />
          <instrumentationClasspath>
             <pathelement location="${base.dir}/bin" />
          </instrumentationClasspath>
 
          <includeClasses regex="vehicle.*" />
          <excludeClasses regex="org.*" />
       </cobertura-instrument>
    </target>
 
    <target name="cover-test" depends="instrument">
       <mkdir dir="${testreport.dir}/junit" />
       <junit dir="${cobertura.out.dir}" maxmemory="512m" failureproperty="test.failure" printSummary="withOutAndErr" fork="true" showoutput="yes" forkmode="once" haltonerror="true">
          <formatter type="plain" />
          <classpath refid="cobertura.classpath" />
          <classpath location="${loggingutil.dir}/bin" />
          <classpath location="${classes.dir}" />
          <classpath location="${coberutra.lib}" />
          <classpath location="${aspectj.lib}/aspectjlib.jar" />
          <classpath location="${aspectj.lib}/aspectjrt.jar" />
          <classpath location="${aspectj.lib}/aspectjweaver.jar" />
          <classpath location="${spring.jar}" />
          <classpath location="${spring.lib}/jakarta-commons/commons-logging.jar" />
          <classpath location="${spring.lib}/log4j/log4j-1.2.13.jar" />
          <classpath location="${base.dir}/bin/" />
          <batchtest todir="${testreport.dir}/junit">
             <fileset dir="${base.dir}/bin/">
                <include name="**/*Test.class" />
             </fileset>
          </batchtest>
       </junit>
    </target>
 
    <target name="coverage-report" depends="cover-test">
       <cobertura-report destdir="${testreport.dir}" datafile="${cobertura.datafile}">
          <fileset dir="${base.dir}/src">
             <include name="**/*.java" />
          </fileset>
          <fileset dir="${base.dir}/test">
             <include name="**/*.java" />
          </fileset>
       </cobertura-report>
    </target>
 </project>
{% endhighlight %}

## Execution
Assuming you've updated the cobertura.xml file and set all of the relevant properties for your environment, then do the following:
* Right-click on CarRental/xml/cobertura.xml
* Select Run As:Ant Build
* Wait for a few seconds (about 5 - 10 in my case)
* Note that this ant file adds a directory called **cobertrua_results** under the CarRental directory with the execution results. To see this (if you don't automatically see it after executing this ant task), select CarRental, right-click and select refresh (or hit F5).

I considered adding the following line to cobertura.xml:
{% highlight xml %}
<eclipse.refreshLocal resourcePath="CarRental" depth="infinite"/>
{% endhighlight %}
This would force a refresh but it also requires that you run the ant script in the same VM as Eclipse.

## Preliminary Analysis
With your directory refreshed, you're ready to have a look at the output:
* Expand the CarRental project.
* Expand the cobertura_results directory.
* Expand the reports directory.
* Double click on index.xml (I've noticed that this sometimes fails when I'm using RAD. If this happens to you, just open this with your favorite browser).
* Here's a summary of my numbers by package:

| Package| #Classes| Line Coverage| covered/total| Branch Coverage| covered/total| Complexity|
|All_Packages|88|85%|1680/1984|88%|120/136|1.3125|
|vehicle.component.rateplan|2|87%|256/295|100%|5/5|0|
|vehicle.component.rentalagreement|2|96%|73/76|100%|5/5|0|
|vehicle.component.vehicle|2|85%|66/78|89%|8/9|0|
|vehicle.component.vehicletype|2|86%|100/116|80%|4/5|0|
|vehicle.configuration|2|71%|22/31|100%|3/3|0|
|vehicle.domain|27|86%|503/587|73%|16/22|0|
|vehicle.exception|5|69%|9/13|N/A|N/A|1.0|
|vehicle.integration|8|87%|143/164|100%|2/2|1.0|
|vehicle.integration.inmemory|5|91%|140/154|96%|44/46|2.333|
|vehicle.reference|1|81%|22/27|100%|1/1|0|
|vehicle.type|13|67%|109/163|60%|6/10|0|
|vehicle.util|4|87%|33/38|100%|4/4|4.0|
|vehicle.validation|16|84%|204/242|92%|22/24|0|

If we pay attention to just the line coverage, we see a range from 67% to 96%. Let's work with just this value and try to "improve it". The ultimate goal is 100% line coverage and 100% branch coverage. However, in practice getting this may take much longer than it is worth. Even so, we'll strive for at least 90% or better in every package.

Let's begin by working from the worst pacakge to the best package. This gives us the following packages (in order):
* vehicle.type
* vehicle.exception
* vehicle.configuration
* vehicle.reference
* vehicle.validation
* vehicle.component.vehicle
* vehicle.component.vehicletype
* vehicle.domain
* vehicle.component.rateplan
* vehicle.integration
* vehicle.util
* vehicle.integration.inmemory
* vehicle.component.rentalagreement

Even though the last two packages already have 90% coverage, we'll review them anyway.

[<--Back](Car_Rental_Example)  [Next-->](Car_Rental_Code_Coverage_with_Cobertura_vehicle.type)
