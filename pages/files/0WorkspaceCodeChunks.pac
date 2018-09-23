| package |
package := Package name: '0WorkspaceCodeChunks'.
package paxVersion: 1;
	basicComment: '
Dynamic Inheritance--change the superclass of an class (and its objects).

Display the result of each of the following statements.
--careful--this may crash the image

SmalltalkSystem current saveImage

fido := Animal name: ''fido''.
fido position

ClassBuilder moveClass: fido class toSuperclass: Ball

fido name
fido position

ClassBuilder moveClass: fido class toSuperclass: Handyman

fido position   
fido initialize.  fido addTask: [Transcript cr; show: ''woof''].  fido work

ClassBuilder moveClass: Animal  toSuperclass: Object.
SessionManager current shutdown


==============================================
Metaclasses

Display the results of each of the following statements.

a := Animal name: ''fido''.
a
a class
a class class
a class class class
a class class class class
a class class class class class

==============================================
Change the class of the object

a := Animal name: ''dog''.
Transcript cr show: ''A''''s name: '', a name.
a becomeA: TestCase.
Transcript cr show: ''A''''s name: '', a name.
a becomeA: Animal.
Transcript cr show: ''A''''s name: '', a name.


==============================================



Solutions to the Collection exercises



t := Ticket new.
#(5700 9700 3200 1600 1117 5447) do: [:dist |
	t addSegment: (Segment newWithDistance: dist).
	].
t segments do: [:aSegment | aSegment wasFlown: true].

distA := 0.
t segments do: [:seg | distA := distA + seg milesFlown ].
distA

distB := 0.
(t segments collect: [:seg | seg milesFlown]) 
	do: [:dist | distB := distB + dist ].
distB

t segments inject: 0 into: [:accum :each | accum + each milesFlown]


t segments select: [:seg | seg milesFlown > 4000]

t segments reject: [:seg | seg milesFlown <= 4000]'.


package binaryGlobalNames: (Set new
	yourself).

package globalAliases: (Set new
	yourself).

package setPrerequisites: (IdentitySet new
	yourself).

package!

"Class Definitions"!


"Global Aliases"!


"Loose Methods"!

"End of package definition"!

"Source Globals"!

"Classes"!

"Binary Globals"!

