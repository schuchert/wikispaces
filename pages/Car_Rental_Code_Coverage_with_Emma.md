---
title: Car_Rental_Code_Coverage_with_Emma
---
[<--Back]({{ site.pagesurl}}/Car_Rental_Example) [Next-->]({{ site.pagesurl}}/Emma_Code_Coverage_vehicle.type)

# Code Coverage with Emma

This example is based on the [Car_Rental_Example]({{site.pagesurl}}/Car_Rental_Example). If you want work through this example, you need to follow [these instructions]({{site.pagesurl}}/Car_Rental_Installation_and_Setup) first.

In this example, we add code coverage to the Car Rental Application. We then examine the results, make some changes and finish with a few conclusions. 

## Setup and Configuration
Emma does not currently come with a plugin, so in this example we'll use [Ant](http://ant.apache.org/) from within Eclipse. I'll warn you that I'm not much of an Ant user, so if you'd like to make recommendations, please feel free: schuchert@yahoo.com.

Let's get started:
**Download**
* Download Emma from [here](http://emma.sourceforge.net/downloads.html). Note I downloaded emma-2.0.5312.zip for this example.
* Extract the jar somewhere. I used c:\libs\, which created the directory C:\libs\emma-2.0.5312.
* Start Eclipse using the Car Rental workspace. If you used my directory names, it is C:\workspaces\CarRentalExample.

**suite() method**
Ant 1.6.5 does not play nice with JUnit 4.x, so I added a [suite()]({{site.pagesurl}}/JUnit_4.xSuite) method to each of my classes. Depending on when you downloaded this file, you already have those suite methods.
 
**Ant Script**
When you followed [these instructions]({{site.pagesurl}}/Car_Rental_Installation_and_Setup), you should have created a workspace with three projects:
* CarRental
* LoggingUtils
* ToolConfiguration

Under CarRental there is an xml directory that contains two ant build files:
* cobertura.xml
* emma.xml

(By the way, let me give credit where it's due, I got most of this from [Getting Started with Emma using Ant](http://emma.sourceforge.net/userguide/ar01s03.html).

* Here's the file so we can discuss it and configure it for your situation:
[#emma]({{site.pagesurl}}/#emma)
## emma.xml
```
01: <?xml version="1.0" encoding="UTF-8"?>
02: <project name="emma_run" default="run">
03: 
04: 	<property name="emma.dir" value="C:/libs/emma-2.0.5312/lib" />
05: 
06: 	<path id="emma.lib">
07: 		<pathelement location="${emma.dir}/emma.jar" />
08: 		<pathelement location="${emma.dir}/emma_ant.jar" />
09: 	</path>
10: 
11: 	<taskdef resource="emma_ant.properties" classpathref="emma.lib" />
12: 
13: 	<target name="init">
14: 		<property name="base.dir" value="C:/workspaces/CarRentalExample/CarRental" />
15: 		<property name="bin.dir" value="${base.dir}/bin" />
16: 		<property name="emmaresults.dir" value="${base.dir}/emma_results" />
17: 		<delete dir="${emmaresults.dir}/_files" quiet="true" />
18: 		<mkdir dir="${emmaresults.dir}/_files" />
19: 		<property name="testreport.dir" value="${emmaresults.dir}/reports" />
20: 		<delete dir="{testreport.dir}" quiet="true"/>
21: 		<mkdir dir="${testreport.dir}" />
22: 		<property name="spring.jar" value="C:/libs/spring-framework-2.0-rc2/dist/spring.jar" />
23: 		<property name="spring.lib" value="C:/libs/spring-framework-2.0-rc2/lib" />
24: 		<property name="aspectj.lib" value="C:/libs/aspectj/lib" />
25: 
26: 		<property name="loggingutil.dir" value="C:/workspaces/CarRentalExample/LoggingUtils" />
27: 		<property name="src.dir" value="${base.dir}/src" />
28: 		<property name="test.dir" value="${base.dir}/test" />
29: 
30: 		<path id="run.classpath">
31: 			<pathelement location="${bin.instr.dir}" />
32: 			<pathelement location="${bin.dir}" />
33: 			<pathelement location="${loggingutil.dir}/bin" />
34: 			<pathelement location="${aspectj.lib}/aspectjlib.jar" />
35: 			<pathelement location="${aspectj.lib}/aspectjrt.jar" />
36: 			<pathelement location="${aspectj.lib}/aspectjweaver.jar" />
37: 			<pathelement location="${spring.jar}" />
38: 			<pathelement location="${spring.lib}/jakarta-commons/commons-logging.jar" />
39: 			<pathelement location="${spring.lib}/log4j/log4j-1.2.13.jar" />
40: 		</path>
41: 	</target>
42: 
43: 	<target name="emma" depends="init" description="turns on EMMA instrumentation/reporting">
44: 		<property name="emma.enabled" value="true" />
45: 		<property name="out.instr.dir" value="${emmaresults.dir}/bin_instr" />
46: 	</target>
47: 
48: 	<target name="run" depends="init, emma" description="runs the examples">
49: 		<emma enabled="${emma.enabled}">
50: 			<instr instrpathref="run.classpath" destdir="${out.instr.dir}" metadatafile="${emmaresults.dir}/metadata.emma" merge="false">
51: 				<filter value="+vehicle.*" />
52: 			</instr>
53: 		</emma>
54: 
55: 		<junit dir="${testreport.dir}" maxmemory="512m" failureproperty="test.failure" printSummary="withOutAndErr" fork="true" showoutput="yes" forkmode="once" haltonerror="true">
56: 			<jvmarg value="-Demma.coverage.out.file=${emmaresults.dir}/coverage.emma" />
57: 			<jvmarg value="-Demma.coverage.out.merge=false" />
58: 			<formatter type="plain" />
59: 			<classpath>
60: 				<pathelement location="${out.instr.dir}" />
61: 				<path refid="run.classpath" />
62: 				<path refid="emma.lib" />
63: 			</classpath>
64: 			<classpath location="${loggingutil.dir}/bin" />
65: 			<classpath location="${aspectj.lib}/aspectjlib.jar" />
66: 			<classpath location="${aspectj.lib}/aspectjrt.jar" />
67: 			<classpath location="${aspectj.lib}/aspectjweaver.jar" />
68: 			<classpath location="${spring.jar}" />
69: 			<classpath location="${spring.lib}/jakarta-commons/commons-logging.jar" />
70: 			<classpath location="${spring.lib}/log4j/log4j-1.2.13.jar" />
71: 			<classpath location="${base.dir}/bin/" />
72: 			<batchtest todir="${testreport.dir}">
73: 				<fileset dir="${base.dir}/bin/">
74: 					<include name="**/*Test.class" />
75: 				</fileset>
76: 			</batchtest>
77: 		</junit>
78: 
79: 		<emma enabled="${emma.enabled}">
80: 			<report sourcepath="${src.dir};${test.dir}">
81: 				<fileset dir="${emmaresults.dir}">
82: 					<include name="*.emma" />
83: 				</fileset>
84: 
85: 				<txt outfile="${emmaresults.dir}/coverage.txt" />
86: 				<html outfile="${emmaresults.dir}/coverage.html" />
87: 			</report>
88: 		</emma>
89: 
90: 		<delete dir="${out.instr.dir}" />
91: 	</target>
92: 
93: </project>
```
### Interesting Lines
N/A.

**Update Tests**

## Execution
Assuming you've updated the emma.xml file and set all of the relevant properties for your environment, then do the following:
* Right-click on CarRental/xml/emma.xml
* Select Run As:Ant Build
* Wait for a few seconds (about 5 - 10 in my case)
* Note that this ant file adds a directory called **emma_results** under the CarRental directory with the execution results. To see this (if you don't automatically see it after executing this ant task), select CarRental, right-click and select refresh (or hit F5).

I considered adding the following line to emma.xml:
>  <eclipse.refreshLocal resourcePath="CarRental" depth="infinite"/>
This would force a refresh but it also requires that you run the ant script in the same VM as Eclipse.

## Preliminary Analysis
With your directory refreshed, you're ready to have a look at the output:
* Expand the CarRental project.
* Expand the emma_results directory.
* Double click on coverage.html.
* Here's what I get when I run it (well almost): [[file:coverage.html]]
* Because this is just the top-level file from my machine, it is missing some links.
* Here's a summary of my numbers by package:

|-|-|-|-|-|
| name| class, % | method, % |block, % | line, % |
|all classes|94% (78/83)|83% (527/636)|80% (6040/7578)|81% (1579.7/1956)|
|vehicle.type|83% (10/12)|68% (56/82)|63% (437/692)|67% (104.4/155)|
|vehicle.configuration|100%(2/2)|80% (8/10)|67% (73/109)|68% (21/31)|
|vehicle.integration|100%(4/4)|84% (37/44)|71% (470/662)|72% (118.7/164)|
|vehicle.component.vehicletype|100%(2/2)|77% (23/30)|73% (320/438)|71% (82.5/116)|
|vehicle.component.rateplan|100%(2/2)|87% (46/53)|76% (804/1061)|74% (219.1/295)|
|vehicle.reference|100%(1/1)|62% (5/8)|78% (84/108)|81% (22/27)|
|vehicle.component.vehicle|100%(2/2)|87% (20/23)|83% (216/259)|81% (63.4/78)|
|vehicle.domain|100%(26/26)|86% (199/231)|84% (1908/2275)|87% (502/575)|
|vehicle.validation|88% (14/16)|85% (58/68)|84% (669/793)|85% (198/234)|
|vehicle.util|100%(4/4)|80% (12/15)|85% (109/128)|84% (32/38)|
|vehicle.exception|80% (4/5)|67% (4/6)|89% (70/79)|69% (9/13)|
|vehicle.component.rentalagreement|100%(2/2)|95% (21/22)|89% (230/257)|90% (68.2/76)|
|vehicle.integration.inmemory|100%(5/5)|86% (38/44)|91% (650/717)|90% (139.4/154)|

So I have roughly 81% code coverage with 106 unit tests and I have a few problem areas:
* vehicle.type
* vehicle.configuration
* vehicle.integration
* ...

Over the next several sections, we will look at each package with less than 80% code coverage, assess each class and plan out our changes. For you to follow along, you'll need to execute the Emma ant script and then look at the classes to understand the assessments.

[<--Back]({{ site.pagesurl}}/Car_Rental_Example) [Next-->]({{ site.pagesurl}}/Emma_Code_Coverage_vehicle.type)
