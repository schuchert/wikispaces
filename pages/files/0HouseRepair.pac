| package |
package := Package name: '0HouseRepair'.
package paxVersion: 1;
	basicComment: 'I assert no warranties on my original material.
The copyright on the original work is at: http://www.creativecommons.org/licenses/by-sa/2.5.
dnunn0@yahoo.com
Home: http://schuchert.wikispaces.com/  [I''m using a friend''s wiki to store this].

The code supplies some samples to see BlockClosures in action.

Example:

house := House newNamed: ''Bird Haven''.
handyman := Handyman new.
caretaker := Caretaker newFor: house withWorker: handyman.

caretaker fixWindows.  "inspect caretaker, look at the worker''s task list afterwards"
caretaker work		  "inspect caretaker, look at the worker''s task list afterwards"


"===Evaluate as one chunk of work==="
caretaker fixPipes.
caretaker fixWindows.
caretaker work
'.


package classNames
	add: #Caretaker;
	add: #Handyman;
	add: #House;
	yourself.

package binaryGlobalNames: (Set new
	yourself).

package globalAliases: (Set new
	yourself).

package setPrerequisites: (IdentitySet new
	add: '..\Object Arts\Dolphin\Base\Dolphin';
	yourself).

package!

"Class Definitions"!

Object subclass: #Caretaker
	instanceVariableNames: 'house worker'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #Handyman
	instanceVariableNames: 'tasks'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #House
	instanceVariableNames: 'windowState pipeState name'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!

"Global Aliases"!


"Loose Methods"!

"End of package definition"!

"Source Globals"!

"Classes"!

Caretaker guid: (GUID fromString: '{A089CE9E-70D5-4DA9-B7CE-19DCD7D98631}')!
Caretaker comment: ''!
!Caretaker categoriesForClass!Kernel-Objects! !
!Caretaker methodsFor!

fixPipes
worker addTask: [house fixPipes]
!

fixWindows
worker addTask: [house fixWindows]
!

initializeFor: aHouse withWorker: aHandyman
house := aHouse.
worker:= aHandyman
!

work
worker work
! !
!Caretaker categoriesFor: #fixPipes!public! !
!Caretaker categoriesFor: #fixWindows!public! !
!Caretaker categoriesFor: #initializeFor:withWorker:!public! !
!Caretaker categoriesFor: #work!public! !

!Caretaker class methodsFor!

newFor: aHouse withWorker: aHandyman	
^self new initializeFor: aHouse withWorker: aHandyman
! !
!Caretaker class categoriesFor: #newFor:withWorker:!public! !

Handyman guid: (GUID fromString: '{2B9E4637-55A6-4AF5-8E62-77B05ED90ACF}')!
Handyman comment: ''!
!Handyman categoriesForClass!Kernel-Objects! !
!Handyman methodsFor!

addTask: aBlock
tasks add: aBlock
!

initialize
tasks := OrderedCollection new
!

work
tasks do: [:aBlock | aBlock value ].
self initialize
! !
!Handyman categoriesFor: #addTask:!public! !
!Handyman categoriesFor: #initialize!public! !
!Handyman categoriesFor: #work!public! !

!Handyman class methodsFor!

new		
^super new initialize
! !
!Handyman class categoriesFor: #new!public! !

House guid: (GUID fromString: '{4E1DEA22-9474-4D91-8BAD-A7F32DC17230}')!
House comment: ''!
!House categoriesForClass!Kernel-Objects! !
!House methodsFor!

fixPipes
pipeState := #good.
Transcript cr; show: name, ' pipes fixed!! '
!

fixWindows
windowState := #good.
Transcript cr; show: name, ' Windows fixed!!'
!

initializeNamed: aString
windowState := #broken.
pipeState := #burst.
name := aString
! !
!House categoriesFor: #fixPipes!public! !
!House categoriesFor: #fixWindows!public! !
!House categoriesFor: #initializeNamed:!public! !

!House class methodsFor!

newNamed: aString			
^self new initializeNamed: aString
! !
!House class categoriesFor: #newNamed:!public! !

"Binary Globals"!

