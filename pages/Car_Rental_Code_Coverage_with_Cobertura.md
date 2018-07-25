---
title: Car_Rental_Code_Coverage_with_Cobertura
---
{:toc}
[<--Back]({{ site.pagesurl}}/Car_Rental_Example)  [Next-->]({{ site.pagesurl}}/Car_Rental_Code_Coverage_with_Cobertura_vehicle.type)

# Code Coverage with Cobertura

This example is based on the [[Car Rental Example]]. If you want work through this example, you need to follow [these instructions]({{_site.pagesurl}}/Car_Rental_Installation_and_Setup) first.

In this example, we add code coverage to the Car Rental Application. We then examine the results, make some changes and finish with a few conclusions. 

## Setup and Configuration
Cobertura does not currently come with a plugin, so in this example we'll use [Ant](http://ant.apache.org/) from within Eclipse. I'll warn you that I'm not much of an Ant user, so if you'd like to make recommendations, please feel free: schuchert@yahoo.com.

Let's get started:
**Download**
* Download Cobertura from [here](http://cobertura.sourceforge.net/download.html). Note I downloaded version 1.8 for this example.
* Extract the jar somewhere. I used c:\libs\, which created the directory C:\libs\cobertura-1.8.
* Start Eclipse using the Car Rental workspace. If you used my directory names, it is C:\workspaces\CarRentalExample.

**suite() method**
Ant 1.6.5 does not play nice with JUnit 4.x, so I added a [suite()]({{_site.pagesurl}}/JUnit_4.xSuite) method to each of my classes. Depending on when you downloaded this file, you already have those suite methods.
 
**Ant Script**
When you followed [these instructions]({{_site.pagesurl}}/Car_Rental_Installation_and_Setup), you should have created a workspace with three projects:
* CarRental
* LoggingUtils
* ToolConfiguration

Under CarRental there is an xml directory that contains two ant build files:
* cobertura.xml
* emma.xml

(By the way, let me give credit where it's due, I got most of this from [Cobertura Ant Task Reference](http://cobertura.sourceforge.net/anttaskreference.html).

Here's the file so we can discuss it and configure it for your situation:

----
[[#cobertura]]
## cobertura.xml
```
01: <?xml version="1.0" encoding="UTF-8"?>
02: <project name="cobertura" default="coverage-report">
03: 
04:    <property name="cobertura.dir" value="C:/libs/cobertura-1.8" />
05: 
06:    <path id="cobertura.classpath">
07:       <fileset dir="${cobertura.dir}">
08:          <include name="cobertura.jar" />
09:          <include name="lib/**/*.jar" />
10:       </fileset>
11:    </path>
12: 
13:    <taskdef classpathref="cobertura.classpath" resource="tasks.properties" />
14: 
15:    <target name="init">
16:       <property name="base.dir" value=".." />
17:       <property name="cobertura.out.dir" value="${base.dir}/cobertura_results" />
18:       <property name="cobertura.datafile" value="${cobertura.out.dir}/cobertura.ser" />
19: 
20:       <delete dir="${cobertura.out.dir}" quiet="true" />
21:       <mkdir dir="${cobertura.out.dir}" />
22: 
23:       <property name="classes.dir" value="${cobertura.out.dir}/instrumented-classes" />
24:       <property name="testreport.dir" value="${cobertura.out.dir}/reports" />
25:       <property name="spring.jar" value="C:/libs/spring-framework-2.0-rc2/dist/spring.jar" />
26:       <property name="spring.lib" value="C:/libs/spring-framework-2.0-rc2/lib" />
27:       <property name="aspectj.lib" value="C:/libs/aspectj/lib" />
28:       <property name="loggingutil.dir" value="C:/workspaces/CarRentalExample/LoggingUtils" />
29: 
30:    </target>
31: 
32:    <target name="instrument" depends="init">
33:       <cobertura-instrument todir="${classes.dir}" datafile="${cobertura.datafile}">
34:          <classpath refid="cobertura.classpath" />
35:          <classpath location="${spring.lib}/log4j/log4j-1.2.13.jar" />
36:          <instrumentationClasspath>
37:             <pathelement location="${base.dir}/bin" />
38:          </instrumentationClasspath>
39: 
40:          <includeClasses regex="vehicle.*" />
41:          <excludeClasses regex="org.*" />
42:       </cobertura-instrument>
43:    </target>
44: 
45:    <target name="cover-test" depends="instrument">
46:       <mkdir dir="${testreport.dir}/junit" />
47:       <junit dir="${cobertura.out.dir}" maxmemory="512m" failureproperty="test.failure" printSummary="withOutAndErr" fork="true" showoutput="yes" forkmode="once" haltonerror="true">
48:          <formatter type="plain" />
49:          <classpath refid="cobertura.classpath" />
50:          <classpath location="${loggingutil.dir}/bin" />
51:          <classpath location="${classes.dir}" />
52:          <classpath location="${coberutra.lib}" />
53:          <classpath location="${aspectj.lib}/aspectjlib.jar" />
54:          <classpath location="${aspectj.lib}/aspectjrt.jar" />
55:          <classpath location="${aspectj.lib}/aspectjweaver.jar" />
56:          <classpath location="${spring.jar}" />
57:          <classpath location="${spring.lib}/jakarta-commons/commons-logging.jar" />
58:          <classpath location="${spring.lib}/log4j/log4j-1.2.13.jar" />
59:          <classpath location="${base.dir}/bin/" />
60:          <batchtest todir="${testreport.dir}/junit">
61:             <fileset dir="${base.dir}/bin/">
62:                <include name="**/*Test.class" />
63:             </fileset>
64:          </batchtest>
65:       </junit>
66:    </target>
67: 
68:    <target name="coverage-report" depends="cover-test">
69:       <cobertura-report destdir="${testreport.dir}" datafile="${cobertura.datafile}">
70:          <fileset dir="${base.dir}/src">
71:             <include name="**/*.java" />
72:          </fileset>
73:          <fileset dir="${base.dir}/test">
74:             <include name="**/*.java" />
75:          </fileset>
76:       </cobertura-report>
77:    </target>
78: </project>
```

## Execution
Assuming you've updated the cobertura.xml file and set all of the relevant properties for your environment, then do the following:
* Right-click on CarRental/xml/cobertura.xml
* Select Run As:Ant Build
* Wait for a few seconds (about 5 - 10 in my case)
* Note that this ant file adds a directory called **cobertrua_results** under the CarRental directory with the execution results. To see this (if you don't automatically see it after executing this ant task), select CarRental, right-click and select refresh (or hit F5).

I considered adding the following line to cobertura.xml:
```<eclipse.refreshLocal resourcePath="CarRental" depth="infinite"/>```
This would force a refresh but it also requires that you run the ant script in the same VM as Eclipse.

## Preliminary Analysis
With your directory refreshed, you're ready to have a look at the output:
* Expand the CarRental project.
* Expand the cobertura_results directory.
* Expand the reports directory.
* Double click on index.xml (I've noticed that this sometimes fails when I'm using RAD. If this happens to you, just open this with your favorite browser).
* Here's a summary of my numbers by package:

^
|-|-|-|-|-|-|-|
|Package|#Classes|Line Coverage|covered/total|Branch Coverage|covered/total|Complexity|
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

[<--Back]({{ site.pagesurl}}/Car_Rental_Example)  [Next-->]({{ site.pagesurl}}/Car_Rental_Code_Coverage_with_Cobertura_vehicle.type)
