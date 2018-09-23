| package |
package := Package name: '01SunitChanges'.
package paxVersion: 1;
	basicComment: 'Dolphin Smalltalk (Community Edition) Test Timer 
I assert no warranties on my original material.
The copyright on the original work is at: http://www.creativecommons.org/licenses/by-sa/2.5.
dnunn0@yahoo.com
Home: http://schuchert.wikispaces.com/smalltalk  [I''m using a friend''s wiki to store this].


- Add the ability to show the time it took for the tests to run in the detailed status at the bottom of the SUnit browser.

- Displays test message output in Transcript on Failure and Error.

- 1 new assert method for TestCase
  TestCase>>assert:equals:
	I find this the most useful assertion in Junit, and missed it here.


- SUnitBrowser updates to reflect new test methods after reset, and when Running All
    TestCaseDeferred, PackageSelector>>buildTestSuite* methods

	To test this last out, open a SUnitBrowser from the package browser, add a test method to the package in another browser, and press the Reset button. Used to be, the "reset" would just refresh the existing list. After installing the update, it will find your new test methods.

	The method buildTestSuite is modified with this package; however, the original source (as of the time of writing) is maintained in "buildTestSuiteOrig".

'.

package basicScriptAt: #postuninstall put: 'SUnitBrowserModel removeInstVarName: ''timeToRun''.'.
package basicScriptAt: #preinstall put: 'SUnitBrowserModel addInstVarName: ''timeToRun''.
'.

package classNames
	add: #TestSuiteDeferred;
	yourself.

package methodNames
	add: #PackageSelector -> #buildTestSuite;
	add: #PackageSelector -> #buildTestSuiteDeferred;
	add: #PackageSelector -> #buildTestSuiteOrig;
	add: #SUnitBrowser -> #runAll;
	add: #SUnitBrowser -> #runSelected;
	add: #SUnitBrowserModel -> #runIndividualTests:;
	add: #SUnitBrowserModel -> #timeToRun;
	add: #SUnitBrowserUIState -> #detailState;
	add: #TestCase -> #assert:equals:;
	add: #TestResult -> #runCase:;
	yourself.

package binaryGlobalNames: (Set new
	yourself).

package globalAliases: (Set new
	yourself).

package setPrerequisites: (IdentitySet new
	add: '..\Object Arts\Dolphin\IDE\Base\Development System';
	add: '..\Object Arts\Dolphin\Base\Dolphin';
	add: '..\Camp Smalltalk\SUnit\SUnit';
	add: '..\odellsoft\SUnitBrowser\SUnitBrowser';
	add: '..\odellsoft\SUnitBrowser\SUnitBrowserModelApp';
	yourself).

package!

"Class Definitions"!

TestSuite subclass: #TestSuiteDeferred
	instanceVariableNames: 'buildBlock'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!

"Global Aliases"!


"Loose Methods"!

!PackageSelector methodsFor!

buildTestSuite
"Modified to use deferred test suites. See buildTestSuiteOrig for the original source of this method."
	^self buildTestSuiteDeferred!

buildTestSuiteDeferred
"This method builds a TestSuiteDeferred instead of a test suite. Pretty much all else is as with buildTestSuiteOrig."

	| packages suite deferredSuite |
	packages := self selectionEnvironment.
	deferredSuite := TestSuiteDeferred named: ('Tests in <1p> [updating]' expandMacrosWith: packages).
	deferredSuite setBuildBlock: [
	suite := TestSuite named: ('Tests in <1p>' expandMacrosWith: packages).
	TestCase allSubclassesDo: 
			[:eachClass | 
			(eachClass isAbstract not and: [packages includesClass: eachClass]) 
				ifTrue: 
					[| classSuite |
					classSuite := eachClass buildSuite.
					suite addTests: (classSuite allTests 
								select: [:eachTest | packages includesSelector: eachTest selector in: eachTest class])]].
	suite].
^deferredSuite!

buildTestSuiteOrig
	| packages suite |
	packages := self selectionEnvironment.
	suite := TestSuite named: ('Tests in <1p>' expandMacrosWith: packages).
	TestCase allSubclassesDo: 
			[:eachClass | 
			(eachClass isAbstract not and: [packages includesClass: eachClass]) 
				ifTrue: 
					[| classSuite |
					classSuite := eachClass buildSuite.
					suite addTests: (classSuite allTests 
								select: [:eachTest | packages includesSelector: eachTest selector in: eachTest class])]].
	^suite! !
!PackageSelector categoriesFor: #buildTestSuite!commands!public! !
!PackageSelector categoriesFor: #buildTestSuiteDeferred!commands!public! !
!PackageSelector categoriesFor: #buildTestSuiteOrig!commands!public! !

!SUnitBrowser methodsFor!

runAll
#dpn. "clear, and show detail after run so that timing info shows up"
	Transcript clear.
	self reset.
	self model runAll.
	self setDetailState.!

runSelected
#dpn. "show detail after run so that timing info shows up"
	self model runSelected.
	self setDetailState.! !
!SUnitBrowser categoriesFor: #runAll!commands!private! !
!SUnitBrowser categoriesFor: #runSelected!commands!private! !

!SUnitBrowserModel methodsFor!

runIndividualTests: tests 
	"tests - a collection of either TestCases or TestSuites"

#dpn.  "Added timing to running tests"
	#oaModified.	"Refactored so can use for debugging too"
	timeToRun := [self individualTests: tests do: [:each | self runTest: each]] millisecondsToRepeat: 1.!

timeToRun
#dpn. "show the new instVar, timeToRun"
^timeToRun! !
!SUnitBrowserModel categoriesFor: #runIndividualTests:!actions!private! !
!SUnitBrowserModel categoriesFor: #timeToRun!actions!private! !

!SUnitBrowserUIState methodsFor!

detailState

	| aStream |

	aStream := WriteStream on: (String new: 60).
#dpn. "modified to get timing info into display"
	^aStream
		nextPutAll: self testResult passedCount printString;
		nextPutAll: ' passed, ';
		nextPutAll: self testResult failureCount printString;
		nextPutAll: ' failure(s), ';
		nextPutAll: self testResult errorCount printString;
		nextPutAll: ' error(s) out of ';
		nextPutAll: self model numberOfTests printString;
		nextPutAll: ' test(s) in ';
		nextPutAll: self model timeToRun printString; 
		nextPutAll: ' ms';
		contents! !
!SUnitBrowserUIState categoriesFor: #detailState!public!strings! !

!TestCase methodsFor!

assert: expectedValue equals: actualValue

	| description |
	description := 'Expected: <' , expectedValue printString , '>, but was: <' , actualValue printString, '>'.
	self assert: expectedValue = actualValue description: description.! !
!TestCase categoriesFor: #assert:equals:!public! !

!TestResult methodsFor!

runCase: aTestCase
	| testCasePassed |

	testCasePassed :=
		[
			[
				aTestCase runCase.
				true]
					sunitOn: self class failure
					do: [:signal |
Transcript cr show: 'F-', aTestCase printString, '           ', signal printString.
						self failures add: aTestCase.
						signal sunitExitWith: false]]
							sunitOn: self class error
							do: [:signal |
Transcript cr show: 'E*', aTestCase printString, '           ', signal printString.
								self errors add: aTestCase.
								signal sunitExitWith: false].

	testCasePassed
		ifTrue: [self passed add: aTestCase]! !
!TestResult categoriesFor: #runCase:!public!Running! !

"End of package definition"!

"Source Globals"!

"Classes"!

TestSuiteDeferred guid: (GUID fromString: '{C82EBF1A-6286-4D39-8B17-807D3E4546A7}')!
TestSuiteDeferred comment: 'part of Test Environment Enhancements --

Dynamically build the test suite based on the build block.'!
!TestSuiteDeferred categoriesForClass!Unclassified! !
!TestSuiteDeferred methodsFor!

buildSuite
	| orig |
	orig := buildBlock value.
	^orig!

setBuildBlock: aBlock
buildBlock := aBlock! !
!TestSuiteDeferred categoriesFor: #buildSuite!public! !
!TestSuiteDeferred categoriesFor: #setBuildBlock:!public! !

"Binary Globals"!

