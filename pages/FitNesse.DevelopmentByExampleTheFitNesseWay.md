---
title: FitNesse.DevelopmentByExampleTheFitNesseWay
---
## Outline
## Chapter 0: FitNesse in a Nutshell
* Setting up your environment
* Mechanics
  * Configuring FitNesse
  * Writing your first tests
  * Getting those tests to pass
* FitNesse test execution model
* A quick tour through the syntax of each type of table
  * Decision Table
  * Query Table
  * Script Table
  * Scenario Table
  * Table Table

## Introduction
### Overview
This book is certainly about FitNesse. It is also a book about practicing Test Driven Development, where FitNesse is the outer-most test tool and a traditional unit testing framework is used to fill in the gaps. To successfully accomplish this, we are taking the approach of choosing one set of technologies end-to-end, rather than keeping things high level. To be sure, the material in this book will logically work with other technologies, but for the purpose of this book, we will be sticking to Java 1.6, JUnit 4.4, Mockito 1.8.2, git xxx, and, of course FitNesse.

That's as much background as we want to discuss before getting you started on your first project.

### Setting up your Environment
What follows are one-time environment setup steps. These instructions are high-level. This book is augmented with on-line materials to keep the heavily changing material in a fluid format. So what follows are high-level details to get started. For each section, there is a link to the most up to date instructions.
#### Install Java 1.6
Please refer to <http://www.java.com/en/download/manual.jsp> for details.

Note that any version from 1.6 or later should work.

#### Install Eclipse
Please refer to <http://www.eclipse.org/downloads/> for details. Note that several versions will work, make sure to download a version with a Java support.

There is nothing particular to Eclipse that will make it work better than, say NetBeans or IntelliJ. I happen to use it and the on-line demonstrations will be in Eclipse.
#### Download Mockito
Download Mockito from here: <http://code.google.com/p/mockito/downloads/list>. As of the last time I updated the version number, I was using 1.8.2.

#### Install FitNesse
{% include include_md_file filename="FitNesse.Installing.md" %}
* When you are trying to learn something new, do you tend to look for examples that work and then spring-board from there into more complex work? That's the approach book takes. You'll begin with a simple tutorial to get your started working with FitNesse. 

## Appendix 1: Mechanics
* Downloading and Installing FitNesse
* Building from the Source and deploying

## Appendix 2: Environment
* JDK 1.5 or later
* Describe Eclipse Project Setup
* Describe IntelliJ Project Setup
* Net Beans?

?? Should these just be on a wiki somewhere?

## Part 1: Tutorials and FitNesse Features
Tutorial Sequence 1: Technical Introduction to FitNesse Tables and Fixtures
* Checking the Water Temperature: A Quick Intro (see: [[FitNesse.Tutorials.0][FitNesse Tutorial 0]]
  * Story
  * Examples
  * Representing examples in tables
  * Tutorial
  * Fixture
* Chapter describing the features of FitNesse used in previous tutorial
* Creating data using Decision Tables (see: [[FitNesse.Tutorials.1][FitNesse Decision Tables]])
* Chapter describing the features of FitNesse used in previous tutorial
* Validating data using Query Tables (see: [[FitNesse.Tutorials.2][FitNesse Query Tables]])
* Chapter describing the features of FitNesse used in previous tutorial
* Expressing flow using Script Tables: (see: [FitNesse Script Tables](FitNesse.Tutorials.ScriptTables))
* Chapter describing the features of FitNesse used in the previous tutorial
* Creating an Abstract Test Description using Scenario-Tables (see: [[FitNesse.Tutorials.ScenarioTables][FitNesse Scenario Tables]])
* Chapter describing the features of FitNesse used in the previous tutorial
* Better example expression through FitNeesse Table Tables (see: [[FitNesse.Tutorials.TableTables][FitNesse Table Tables]]
* Chapter describing the features of FitNesse used in the previous tutorial

??Tutorial Sequence 2: Story-Based Introduction to FitNesse Tables and Fixtures
* Introduction:
  * Describe Problem
  * Simple Story Diagram showing actors and stories
  * Pick a theme
  * Expand the stories
  * Develop examples
  * Implement examples

## Part 2: Best Practices
* Story Staging
* Testability
* Controlling Dates
* Cleaning up
* Making tests environment-relative
  * Environment page on master
  * Environment page on developer/test/qa boxes
  * Using imports
