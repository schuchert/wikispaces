| package |
package := Package name: '0NicerSaveFix'.
package paxVersion: 1;
	basicComment: 'Dolphin Smalltalk (Community Edition) Undeclared Class Error Fix 
I assert no warranties on my original material.
The copyright on the original work is at: http://www.creativecommons.org/licenses/by-sa/2.5.
dnunn0@yahoo.com
Home: http://schuchert.wikispaces.com/  [I''m using a friend''s wiki to store this].

Normally, the method browser will balk at accepting code that refers to an undeclared class. This gets in the way of TDD--I want to be able to type my test, and write my code later.

Likewise, the same mechanism gives up for potential instance variables.

These methods splice into the save process so that 

	If it''s a valid class name:
		Prompt whether to create a class to fix the error and proceed with the accept. 
	otherwise, 
		Prompt if the variable should be declared as an instance variable '.


package methodNames
	add: #CompilerNotification -> #targetedSource;
	add: #MethodWorkspace -> #compilerNotification:offset:;
	add: #MethodWorkspace -> #fixUndeclaredClass:from:;
	add: #MethodWorkspace -> #fixUndeclaredInstanceVariable:from:;
	add: #MethodWorkspace -> #fixUndeclaredTemporaryVariable:;
	add: #MethodWorkspace -> #fixUndeclaredVariableError:;
	add: #MethodWorkspace -> #isParseTreeBroken;
	add: #SmalltalkSystem -> #createSubclass:of:inPackage:;
	add: 'CreateSubclassDialog class' -> #subclass:of:inPackage:;
	yourself.

package binaryGlobalNames: (Set new
	yourself).

package globalAliases: (Set new
	yourself).

package setPrerequisites: (IdentitySet new
	add: '..\Object Arts\Dolphin\IDE\Base\Development System';
	add: '..\Object Arts\Dolphin\Base\Dolphin';
	add: '..\Object Arts\Dolphin\MVP\Presenters\Prompters\Dolphin Choice Prompter';
	add: '..\Object Arts\Dolphin\System\Compiler\Smalltalk Parser';
	yourself).

package!

"Class Definitions"!


"Global Aliases"!


"Loose Methods"!

!CompilerNotification methodsFor!

targetedSource
^self source copyFrom: self range start to: self range stop! !
!CompilerNotification categoriesFor: #targetedSource!public! !

!CreateSubclassDialog class methodsFor!

subclass: aClassName of: aClassOrNil inPackage: aPackageOrNil
"Ask for a new subclass, tentatively named aClassName, initially thought to be a subclass of aClassOrNil and in aPackageOrNil."
	| dialog |
	dialog := self newSubclassOf: aClassOrNil inPackage: aPackageOrNil.
	dialog subclassName: aClassName.
	^dialog
		showModal;
		yourself! !
!CreateSubclassDialog class categoriesFor: #subclass:of:inPackage:!operations!public! !

!MethodWorkspace methodsFor!

compilerNotification: aCompilerNotification offset: anInteger 
"Private - Attempt to fix the notification. If it's fixed, retry whatever caused the notification. Otherwise, let the normal course of events proceed."

(self fixUndeclaredVariableError: aCompilerNotification)
	ifFalse: [^super compilerNotification: aCompilerNotification offset: anInteger]!

fixUndeclaredClass: undeclaredVariable from: aCompilerNotification
	| cls |
	cls := SmalltalkSystem current 
				createSubclass: undeclaredVariable
				of: Object
				inPackage: nil.
	cls notNil ifTrue: [aCompilerNotification retry].
	^cls notNil!

fixUndeclaredInstanceVariable: undeclaredVariable from: aCompilerNotification
	self evaluationContext addInstVarName: undeclaredVariable.
	aCompilerNotification retry!

fixUndeclaredTemporaryVariable: undeclaredVariable 

		self parseTree body addTemporaryNamed: undeclaredVariable.
		self isParseTreeBroken ifTrue:[
			| mb |
			mb := MessageBox new.
			mb caption: 'Confused'.
			mb text: 'Sorry, other errors prevent me from auto-fixing the code :-(       ' .
			mb icon: SmalltalkCompilerError severityClass icon.
			mb buttonStyle: #ok.
			mb open.
			
			^false
			].
		self text: self parseTree formattedCode.
"somewhere up in the call stack, the isModified flag is set true, and I didn't see a way to reset it 'in situ' "
		[  self accept ] fork. "assumes (ha ha) windows impl with non-preemptive threads"

	^true!

fixUndeclaredVariableError: aCompilerNotification
	"Try to fix an undeclared variable error (an Undeclared Error, on some token that's a valid name). 
Answer whether we believe we fixed the error."

	| undeclaredVariable fixed |
	"CErrUndeclared " 71= aCompilerNotification tag ifFalse: [^false].
	undeclaredVariable := aCompilerNotification targetedSource.
	fixed := false.
	(ClassBuilder isValidClassName: undeclaredVariable) 
		ifTrue: [ fixed := self fixUndeclaredClass: undeclaredVariable from: aCompilerNotification .]
		ifFalse: [
			| res |
			res := ChoicePrompter choices: #(#'Temporary Variable' #'Instance Variable' #Neither) caption: undeclaredVariable, ' needs to be declared'.
			res == #'Temporary Variable' ifTrue: [ fixed := self fixUndeclaredTemporaryVariable: undeclaredVariable ].
			res == #'Instance Variable' ifTrue: [fixed := self fixUndeclaredInstanceVariable: undeclaredVariable from: aCompilerNotification ].
		].
^fixed!

isParseTreeBroken
"Sometimes the parse tree stops early because of syntax errors. This is an attempt to find out if that's happened. Generally, the formatted size of a method is longer than the non-formatted size."
^ self parseTree formattedCode size < self parseTree source size! !
!MethodWorkspace categoriesFor: #compilerNotification:offset:!private! !
!MethodWorkspace categoriesFor: #fixUndeclaredClass:from:!public! !
!MethodWorkspace categoriesFor: #fixUndeclaredInstanceVariable:from:!public! !
!MethodWorkspace categoriesFor: #fixUndeclaredTemporaryVariable:!public! !
!MethodWorkspace categoriesFor: #fixUndeclaredVariableError:!public! !
!MethodWorkspace categoriesFor: #isParseTreeBroken!public! !

!SmalltalkSystem methodsFor!

createSubclass: aClassName of: aClass inPackage: aPackageOrNil 
"Pop a dialog to ask for a new subclass of aClass tentatively named aClassName to be placed in aPackageOrNil. Create the new class if the dialog is successful."
	| details |

	details := CreateSubclassDialog subclass: aClassName of: aClass inPackage: aPackageOrNil.
	^details answer notNil 
		ifTrue: 
			[self 
				createSubclass: details subclassName asSymbol
				of: details superclass
				package: details package
				subclasses: details subclasses]! !
!SmalltalkSystem categoriesFor: #createSubclass:of:inPackage:!public!refactoring! !

"End of package definition"!

"Source Globals"!

"Classes"!

"Binary Globals"!

