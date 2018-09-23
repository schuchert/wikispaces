| package |
package := Package name: 'NetHack'.
package paxVersion: 1;
	basicComment: 'HackView show
HackView showFor: ''Phlebas''

(HackView on: game) inspect.

HackView allInstances
HackView allInstances do: [: v | v close]

HackView allInstances last game player score  

================Which to save for class? ==========
- refactor/cleanup tests
- HackBuilder -> Hack (becomeA: ) just because it''s cool
- redo door connectDoor: to: --so that it always finds closest doors.
- add fog
- moving monsters
- multiple levels
- hunger
- wear/yield items
- varieties of items
- varities of monsters (e.g., some that weaken)
- slides, traps, jumps, no handrails
- score history
- move to visualworks?
- do in java (do the 62 tests provide good coverage?)
- ascii view
- pannable dungeon
-top scores?
- testClosingDoorsConnectedAtFoyerTopLeft
     --connects junctions, but maybe should connect foyers?
====================

"about 14994 milliseconds"
Time millisecondsToRun: [
500 timesRepeat:[
(HackTest new) testCreateMakesGoodRooms]
]

"about 2558 ms"
Time millisecondsToRun: [
100 timesRepeat:[
Hack new]
]


	
"rooms takes about 3 s, orig corr another second, and forGroups 5 s"
|h | h := Hack new. 
Time millisecondsToRun: [
500 timesRepeat:[
h reset. 
]]

"171"
|h | h := Hack new.
Time millisecondsToRun: [
500 timesRepeat:[
h roomGroups]
]'.

package basicPackageVersion: 'NetHack 1.1'.

package imageStripperBytes: (ByteArray fromBase64String: 'IVNUQiAzIEYPDQAEAAAASW1hZ2VTdHJpcHBlcgAAAABSAAAABwAAAE5ldEhhY2tSAAAADgAAAE5v
dE5ldEhhY2suZXhlmgAAAFIAAAAHAAAATmV0SGFja1IAAAAYAAAATm90TmV0SGFja1Nlc3Npb25N
YW5hZ2Vy778nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=').

package classNames
	add: #AbstractHack;
	add: #Door;
	add: #DoorOnBottom;
	add: #DoorOnLeft;
	add: #DoorOnRight;
	add: #DoorOnTop;
	add: #Hack;
	add: #HackPoint;
	add: #HackTest;
	add: #HackView;
	add: #NotNetHackSessionManager;
	add: #Player;
	add: #Room;
	add: #RoomTest;
	yourself.

package methodNames
	add: #Character -> #+;
	add: #Collection -> #removeAll:ifAbsent:;
	add: #TestCase -> #assert:equals:tolerance:;
	add: #TestCase -> #ignore:;
	yourself.

package binaryGlobalNames: (Set new
	yourself).

package globalAliases: (Set new
	yourself).

package setPrerequisites: (IdentitySet new
	add: '..\Object Arts\Dolphin\Base\Dolphin';
	add: '..\Object Arts\Dolphin\MVP\Base\Dolphin MVP Base';
	add: '..\Object Arts\Dolphin\MVP\Presenters\Prompters\Dolphin Prompter';
	add: '..\Object Arts\Dolphin\MVP\Gdiplus\Gdiplus ImageView';
	add: '..\Object Arts\Dolphin\Lagoon\Lagoon Image Stripper';
	add: '..\Camp Smalltalk\SUnit\SUnit';
	yourself).

package!

"Class Definitions"!

Object subclass: #AbstractHack
	instanceVariableNames: 'rooms player items monsters turnsTaken world visibleWorld'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #HackPoint
	instanceVariableNames: 'tile pos'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #Player
	instanceVariableNames: 'game pos inventory hp maxHp strength kills itemsUsed finalScore name'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
AbstractHack subclass: #Hack
	instanceVariableNames: ''
	classVariableNames: 'RandomSource'
	poolDictionaries: ''
	classInstanceVariableNames: ''!
HackPoint subclass: #Door
	instanceVariableNames: 'corridor foyer junction'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Door subclass: #DoorOnBottom
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Door subclass: #DoorOnLeft
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Door subclass: #DoorOnRight
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Door subclass: #DoorOnTop
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Rectangle subclass: #Room
	instanceVariableNames: 'doors exclusionZone center'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
RuntimeSessionManager subclass: #NotNetHackSessionManager
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
TestCase subclass: #HackTest
	instanceVariableNames: 'game'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
TestCase subclass: #RoomTest
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
DoubleBufferedView subclass: #HackView
	instanceVariableNames: 'game displayedStats displayedItems displayedKills lastTurnUpdateTime'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!

"Global Aliases"!


"Loose Methods"!

!Character methodsFor!

+ anInteger
^self class value: (self asInteger + anInteger)! !
!Character categoriesFor: #+!accessing!public! !

!Collection methodsFor!

removeAll: oldElements ifAbsent: niladicBlock
	"Remove each element of the <collection>, oldElements, from the receiver, raising
	an Exception if any are not elements of the receiver. Answer oldElements."

	oldElements do: [:each | self remove: each ifAbsent: niladicBlock ].
	^oldElements! !
!Collection categoriesFor: #removeAll:ifAbsent:!public!removing! !

!TestCase methodsFor!

assert: originalValue equals: actualValue tolerance: tolerance 
| description |
	description := 'Expected: <' , originalValue printString , '> within +/- ', tolerance printString, ', but was: <' , actualValue printString, '>'.
	self assert: (originalValue - actualValue) abs < tolerance description: description.!

ignore: aString

Transcript cr show: self name, '       ', aString! !
!TestCase categoriesFor: #assert:equals:tolerance:!public! !
!TestCase categoriesFor: #ignore:!Accessing!public! !

"End of package definition"!

"Source Globals"!

"Classes"!

AbstractHack guid: (GUID fromString: '{40CD1970-B0C9-4B59-8D3D-22ACAD895D1F}')!
AbstractHack comment: 'to make it easier if I ever extract a useful builder'!
!AbstractHack categoriesForClass!Unclassified! !
HackPoint guid: (GUID fromString: '{79B86550-6495-4631-802F-57AB0142A51B}')!
HackPoint comment: ''!
!HackPoint categoriesForClass!Kernel-Objects! !
!HackPoint methodsFor!

canMoveTo
^self tile == #roomFloor or: [ tile == #door or: [tile == #tunnel ]]!

initializeAt: aPoint 
tile := #dirt.
pos := aPoint.!

moveBy: delta

pos := pos + delta!

pos 
^pos!

printOn: aStream

tile == #dirt ifTrue: [aStream nextPutAll: ' '.].
tile == #roomFloor ifTrue: [aStream nextPutAll: '.'.].
tile == #door ifTrue: [aStream nextPutAll: 'o'.].
tile == #wall ifTrue: [aStream nextPutAll: '='.].
tile == #tunnel ifTrue: [aStream nextPutAll: 'o'.].!

tile
^tile!

tile: aSymbol 
	tile := aSymbol! !
!HackPoint categoriesFor: #canMoveTo!public! !
!HackPoint categoriesFor: #initializeAt:!private! !
!HackPoint categoriesFor: #moveBy:!private! !
!HackPoint categoriesFor: #pos!private! !
!HackPoint categoriesFor: #printOn:!public! !
!HackPoint categoriesFor: #tile!public! !
!HackPoint categoriesFor: #tile:!private! !

!HackPoint class methodsFor!

newAt: aPoint
^super new initializeAt: aPoint! !
!HackPoint class categoriesFor: #newAt:!public! !

Player guid: (GUID fromString: '{68196AC0-5805-455F-B8C9-F2B172B7BEC4}')!
Player comment: ''!
!Player categoriesForClass!Unclassified! !
!Player methodsFor!

attack: monster 

	self hitFor: monster attackForceMustered .
	monster hitFor: self attackForceMustered .
	monster isDead ifTrue: [self notchAKill].
	^monster isDead!

attackForceMustered

^Hack randomBetween: 1 and: self strength!

changePosition: delta 
	| item newPos monster |
	self isDead ifTrue: [^self].
	game tookATurn.
	newPos := pos + delta.
	(game canMoveTo: newPos) ifFalse: [^nil].
	monster := game monsters detect: [:mon | mon position = newPos] ifNone: [].
	monster notNil ifTrue: [
		| retry |
		retry := self attack: monster.
		retry ifTrue: [ self changePosition: delta].
		^self].
	pos := newPos.
	
	item := game removeItemAt: pos.
	item notNil 
		ifTrue: 
			[inventory add: item.
			]!

dropItem: anItem 
	self isDead ifTrue: [^self].
	game tookATurn.
	(game canDropItemAt: self position) 
		ifTrue: 
			[inventory remove: anItem.
			game placeItem: anItem at: self position]!

gold 
^0!

hitFor: anInteger 
	hp := (hp - anInteger min: maxHp) floor.
	self isDead ifTrue: [
		game monsters remove: self  ifAbsent: []].!

hp

^hp!

initializeIn: aGame at: apos

kills := 0.
name := ''.
itemsUsed := 0.
inventory := OrderedCollection new.
game := aGame.
pos := apos.
strength := game startingStrength.
hp := game startingHp.
maxHp := hp.
!

inventory
^inventory!

isDead
^hp <= 0!

kills
^kills!

name
^name !

name: aString
name := aString!

notchAKill
kills := kills + 1.
maxHp := maxHp + 0.5.!

position
^pos!

regenPeriod
	^12!

room

^game roomContaining: pos!

score
| score |

finalScore notNil ifTrue: [^finalScore].
score := 3000 - game turnsTaken max: 0.
score := score - (10*itemsUsed).
score := score + (10*kills).
score := score + (Hack randomBetween: 10 and: 300).
game isOver ifTrue: [finalScore := score. self isDead ifTrue: [finalScore := 0]].
^score!

strength

^strength!

useItem
	| item |
	game tookATurn.
	item := self inventory removeFirstIfAbsent: [^self].
	itemsUsed := itemsUsed + 1.
	item == #food ifTrue: [self hitFor: -1 * (maxHp // 3)].
	item == #boost ifTrue: [self weaken: -1]!

weaken: damage 
	strength := strength - damage! !
!Player categoriesFor: #attack:!public! !
!Player categoriesFor: #attackForceMustered!public! !
!Player categoriesFor: #changePosition:!public! !
!Player categoriesFor: #dropItem:!public! !
!Player categoriesFor: #gold!public! !
!Player categoriesFor: #hitFor:!public! !
!Player categoriesFor: #hp!public! !
!Player categoriesFor: #initializeIn:at:!private! !
!Player categoriesFor: #inventory!public! !
!Player categoriesFor: #isDead!public! !
!Player categoriesFor: #kills!public! !
!Player categoriesFor: #name!public! !
!Player categoriesFor: #name:!private! !
!Player categoriesFor: #notchAKill!public! !
!Player categoriesFor: #position!public! !
!Player categoriesFor: #regenPeriod!public! !
!Player categoriesFor: #room!public! !
!Player categoriesFor: #score!public! !
!Player categoriesFor: #strength!public! !
!Player categoriesFor: #useItem!public! !
!Player categoriesFor: #weaken:!public! !

!Player class methodsFor!

newIn: aGame at: pos

^self new initializeIn: aGame at: pos! !
!Player class categoriesFor: #newIn:at:!public! !

Hack guid: (GUID fromString: '{586BA04F-680C-4F1E-8D2E-AF8026D5C0F3}')!
Hack comment: 'Hack game--rogue like.
HackView showFor: ''Phlebas''

or 

HackView on: (Hack new)'!
!Hack categoriesForClass!Unclassified! !
!Hack methodsFor!

addRoom
	| r o |
	r := Room new.
	
	[| x y |
	x := Hack randomBetween: self class margin and: self width - r maxSize - self class margin.
	y := Hack randomBetween: self class margin and: self height - r maxSize - self class margin.
	o := x @ y.
	r moveBy: o.
	rooms anySatisfy: [:room | room exclusionZone intersects: r exclusionZone]] 
			whileTrue: [r moveBy: -1 * o].
	rooms add: r!

at: aPoint

^(world at: aPoint x) at: aPoint y!

canDropItemAt: aPoint 
	| isOccupied |
	isOccupied := (self itemAt: aPoint) notNil.
	^isOccupied not!

canMoveTo: aPoint
(aPoint x< 1 or: [aPoint y < 1]) ifTrue: [^false].
^(self at: aPoint) canMoveTo
!

closeUnconnectedDoors
	
	self rooms do: 
			[:aRoom | 
			aRoom doors copy do: 
					[:door | 
					door isConnected 
						ifFalse: 
							[  | neighbors |
							neighbors := self neighborsOf: door junction.
							neighbors remove: (self at: door foyer).
							(neighbors allSatisfy: [:pt | pt tile == #dirt]) ifTrue: [(self at: door junction) tile: #dirt].
							neighbors := self neighborsOf: door foyer.
							neighbors remove: (self at: door pos).
							(neighbors allSatisfy: [:pt | pt tile == #dirt]) 
								ifTrue: 
									[(self at: door foyer) tile: #dirt.
									(self at: door pos) tile: #wall.
									aRoom doors remove: door]]]]!

connectGroups: roomGroups usingPairs: roomPairs 
	| pair  pairs |
	
	pairs := roomPairs.
	[| isConn |
	pair := pairs removeFirst.
	isConn := self connectRoom: pair first to: pair second.
"Transcript cr show: 'connecting pair, ' , isConn printString."
	isConn ifTrue: [ | rg1  |
		rg1 := pair last.

		pairs := pairs reject: [: p | ((rg1 includes: p first) ) ] .
		(Time now asMilliseconds % 2 == 1) ifTrue: [ pairs := pairs reject: [: p | ((rg1 includes: p second) ) ] .]
		].
	pairs isEmpty] 
			whileFalse.
	"Transcript cr show: 'rgs ' , self roomGroups size printString"!

connectRoom: room to: candidateOther 
	| term door points hitsWall |
	term := candidateOther closestDoorTo: room center.
	door := room closestDoorTo: term junction.
	term := candidateOther closestDoorTo: door junction.
	door type == #top ifTrue: [points := self pointsToConnectTopBottomDoor: door of: room to: term of: candidateOther].
	door type == #right ifTrue: [points := self pointsToConnectLeftRightDoor: door of: room to: term of: candidateOther].
	door type == #bottom ifTrue: [points := self pointsToConnectTopBottomDoor: door of: room to: term of: candidateOther].
	door type == #left ifTrue: [points := self pointsToConnectLeftRightDoor: door of: room to: term of: candidateOther].
	hitsWall := points anySatisfy: [:point | point tile == #wall].
	hitsWall ifTrue: [^false].
		
	door corridor add: candidateOther.
	term corridor add: room.
	points := points reject: [:pt | pt tile == #door or: [pt tile == #roomFloor]].
	points do: [:pt | pt tile: #tunnel].
	^true
!

emptySpotsIn: aRoom 
	| points |

	points := aRoom nonWallPoints .
	points := points select: [:aPos | self canDropItemAt: aPos].
	points removeAll: (monsters collect: [:mon | mon position]) ifAbsent: [].
	points remove: (player position) ifAbsent: [].
	^points!

generate: anInteger monstersIn: aRoom 
	| pos monster counter |
	counter := 0.
	anInteger timesRepeat: 
			[pos := self nextEmptySpotIn: aRoom.
			pos isNil ifTrue: [^counter].
			counter := counter + 1.
			monster := Player newIn: self at: pos.
			monster weaken: (Hack randomBetween: -2 and: 2).
			monsters add: monster].
	^counter!

height
"1024 x 768, can really only see ~670 in the height."
^85!

initialize
| retry |
retry := 0.
	[self reset. retry := retry + 1.
	self initializeRooms.
	self initializeCorridors.
	self initializePlayer.
	self initializeItems.
	self initializeMonsters.
self closeUnconnectedDoors.]
	on: Error
	do: [:ex | (Transcript respondsTo: #cr) ifTrue: [ Transcript cr show: 'Failed building dungeon, retrying: ', retry printString.]. "complicated for stripped image"
		(ex messageText = #RoomGroupsCannotBeConnected) ifTrue: [
			retry < 3 ifTrue: [^ex retry].
		].
		^ex signal
]!

initializeCorridors
	self initializeCorridorsRoomPairs. "provides a pleasing inter-connectedness on top of Group combining"
	self initializeCorridorsForGroups:0.
!

initializeCorridorsForGroups: attempt 
	"Private - for each room, find closest room in outlying groups. Pick closest pair, connect them. try again."

	| pairs rgs otherRgs otherRooms |
	rgs := self roomGroups.
	rgs size <= 1 ifTrue: [^self].
	attempt > self rooms size ifTrue: [Object error: #RoomGroupsCannotBeConnected].
	pairs := OrderedCollection new.
	rgs do: 
			[:myRg | 
			otherRgs := rgs copyWithout: myRg.
			otherRooms := otherRgs inject: Set new
						into: [:accum :each | accum addAll: each.	accum].
			myRg do: 
					[:room | | closestRoom |
					closestRoom := (otherRooms 
								asSortedCollection: [:r1 :r2 | (r1 distanceFrom: room center) <= (r2 distanceFrom: room center)]) 
									first.
					pairs add: (Array 
								with: room
								with: closestRoom
								with: (room distanceFrom: closestRoom center)
								with: myRg)]].
	pairs := pairs asSortedCollection: [:p1 :p2 | (p1 at: 3) <= (p2 at: 3)].
	self connectGroups: rgs usingPairs: pairs.
	^self initializeCorridorsForGroups: attempt + 1!

initializeCorridorsRoomPairs
	| otherRooms sortedRooms connections candidateOther |
	sortedRooms := rooms 
				asSortedCollection: [:r1 :r2 | (r1 distanceFrom: 0 @ 0) <= (r2 distanceFrom: 0 @ 0)].
	connections := Set new.
	sortedRooms do: 
			[:room | 
			otherRooms := sortedRooms copy.
			otherRooms removeAll: connections.
			otherRooms remove: room ifAbsent: [].
			otherRooms := otherRooms 
						asSortedCollection: [:r1 :r2 | (r1 distanceFrom: room center) <= (r2 distanceFrom: room center)].
			candidateOther := otherRooms detect: [:r | r isConnected not] ifNone: [].
			candidateOther notNil 
				ifTrue: 
					[(self connectRoom: room to: candidateOther) 
						ifTrue: 
							[connections
								add: room;
								add: candidateOther]]]!

initializeItems
	| itemTypes |
	itemTypes := #(#food #food #boost #boost).
	(Hack randomBetween: self rooms size // 4 and: self rooms size * 3) timesRepeat: 
			[| item r pos |
			item := itemTypes at: (Hack randomBetween: 1 and: itemTypes size).
			
			[r := rooms at: (Hack randomBetween: 1 and: rooms size).
			pos := self nextEmptySpotIn: r.
			pos notNil] 
					whileFalse.
			items at: pos put: item]!

initializeMonsters
	| numMon |
	numMon := Hack randomBetween: self rooms size // 4 and: self rooms size * 2.
	[numMon > 0 ] whileTrue: [
		| roomMon roomIndex |
		roomMon := Hack randomBetween: 0 and: ((numMon*0.5) max: 1).
		roomIndex := Hack randomBetween: 1 and: self rooms size.
		roomMon := roomMon min: (self rooms at: roomIndex) numPoints.
		roomMon := self generate: roomMon monstersIn: (self rooms at: roomIndex).
		numMon := numMon - roomMon.

]!

initializePlayer
	player := Player newIn: self at: rooms first origin + 1.
	!

initializeRooms
	15 timesRepeat: [self addRoom].
	self markWorldForRooms!

initializeVisibleWorld

visibleWorld := OrderedCollection new: 3000.
world do: [:col |
	visibleWorld addAll: (col select: [ : each | (each tile ~~ #dirt) ]).
].!

initializeWorld
	world := Array new: self width.
	(1 to: self width) do: 
			[:x | 
			| col |
			col := Array new: self height.
			(1 to: self height) do: [:y | col at: y put: (HackPoint newAt: x @y)].
			world at: x put: col].

	!

inject: init into: dyadicBlock 
	| accum |
	accum := init.
	world do: [:col | accum := accum + (col inject: init into: dyadicBlock)].
^accum!

isOver
	^player isNil or: [player isDead or: [ self items isEmpty and: [self monsters isEmpty
]]]!

isStarted
	^turnsTaken > 0!

itemAt: aPoint

^items at: aPoint ifAbsent: [nil]!

items
^items!

markDoor: door 
	| point |
	point := self at: door pos.
	point tile: #door.
	(self at: door foyer) tile: #door.
	(self at: door junction) tile: #door!

markDoorUndo: door 
	| point |
	point := self at: door pos.
	point tile: #wall.
	(self at: door foyer) tile: #dirt.
	(self at: door junction) tile: #dirt!

markWorldForRooms
	
	rooms do: 
			[:aRoom | 
			aRoom nonWallPoints do: 
					[:pos | 
					| point |
					point := self at: pos.
					point tile: #roomFloor].
			aRoom wallPoints do: 
					[:pos | 
					| point |
					point := self at: pos.
					point tile: #wall].
			aRoom doors do: 
					[:door | 
					self markDoor: door]]!

monsters
	^monsters!

neighborsOf: aPoint

^OrderedCollection with: (self at: (aPoint + (-1@0))) with: (self at: (aPoint + (0@1))) with: (self at: (aPoint + (1@0))) with: (self at: (aPoint + (0@-1)))!

nextEmptySpotIn: aRoom 
	| points |

	points := self emptySpotsIn: aRoom.
	^points isEmpty ifTrue: [nil] ifFalse: [points at: (Hack randomBetween: 1 and: points size)]
!

placeItem: anItem at: aPoint
aPoint ifNil: [^false].
(self canMoveTo: aPoint ) ifTrue: [items at: aPoint put: anItem.]!

player
^player!

pointsToConnectLeftRightDoor: door of: room to: term of: otherRoom 
	| pt points leeway |
	leeway := room height - 2 max: otherRoom height - 2. 
	(door junction y - term junction y) abs <= leeway 
		ifTrue: 
			[self markDoorUndo: door.
			self markDoorUndo: term.
			room tryMovingLRDoor: door toMatch: term.
			otherRoom tryMovingLRDoor: term toMatch: door.
			self markDoor: door.
			self markDoor: term].

	points := OrderedCollection new.
	"down to point term junction y where both can met"
	pt := door junction.
	door junction y + 1 to: term junction y
		do: 
			[:ty | 
			pt := pt + (0 @ 1).
			points add: (self at: pt)].
	"right to underneath terminal door"
	pt x + 1 to: term junction x
		do: 
			[:tx | 
			pt := pt + (1 @ 0).
			points add: (self at: pt)].
	"Ok, maybe left to be underneath terminal door"
	pt x - 1 to: term junction x + 1
		by: -1
		do: 
			[:tx | 
			pt := pt + (-1 @ 0).
			points add: (self at: pt)].

	"up until hit terminal door"
	(pt y to: term junction y + 1 by: -1) do: 
			[:ty | 
			pt := pt + (0 @ -1).
			points add: (self at: pt)].
	^points!

pointsToConnectTopBottomDoor: door of: room to: term of: otherRoom 
	| pt points leeway directionIncrement start end |
	leeway := room width - 2 max: otherRoom width - 2.
	(door junction x - term junction x) abs <= leeway 
		ifTrue: 
			[self markDoorUndo: door.
			self markDoorUndo: term.
			room tryMovingTBDoor: door toMatch: term.
			otherRoom tryMovingTBDoor: term toMatch: door.
			self markDoor: door.
			self markDoor: term].
	points := OrderedCollection new.
	"up  or down to point term junction y where both can met (first keep going in direction of door)"
	pt := door junction.
	directionIncrement := door junction y - door foyer y.
	start := door junction y + directionIncrement.
	end := term junction y.
	start to: end
		by: directionIncrement
		do: 
			[:ty | 
			pt := pt + (0 @ directionIncrement).
			points add: (self at: pt)].
	"right to underneath terminal door"
	pt x to: term junction x - 1
		do: 
			[:tx | 
			pt := pt + (1 @ 0).
			points add: (self at: pt)].
	"Ok, maybe left to be underneath terminal door"
	pt x to: term junction x + 1
		by: -1
		do: 
			[:tx | 
			pt := pt + (-1 @ 0).
			points add: (self at: pt)].
	^points!

positionOfItem: anItem

items associationsDo: [:anAssoc |
	anAssoc value = anItem ifTrue: [^anAssoc key]].
^nil!

printOn: aStream


1 to: self height do: [:y | 	aStream cr.
 1 to: self width do: [:x |
		(self at: (x@y)) printOn: aStream]]!

removeItemAt: aPoint

^items removeKey: aPoint ifAbsent: [nil]!

reset
	turnsTaken := 0.
	items := Dictionary new.
	rooms := OrderedCollection new.
	monsters := OrderedCollection new.
	visibleWorld := nil.
	self initializeWorld.

	!

roomContaining: pos

^rooms detect: [:room | room contains: pos] ifNone: []!

roomGroups
	"Private - return the collection of collection of connected rooms"

	| targetRoom  roomGroups remainingRooms  |
	roomGroups := OrderedCollection new.
	remainingRooms := self rooms copy.
	[remainingRooms isEmpty] whileFalse: 
			[ | connectedSet |
			connectedSet  := Set new.
			targetRoom := remainingRooms asOrderedCollection first.
			self roomsConnectedTo: targetRoom in: remainingRooms trail: connectedSet.
			roomGroups add: connectedSet.
			remainingRooms := remainingRooms asSet - connectedSet].
	^roomGroups!

rooms

^rooms!

roomsConnectedTo: targetRoom in: remainingRooms trail: visitedRooms 
	| initialConnectedSet roomsToVisit doors |
	visitedRooms add: targetRoom.
	doors := targetRoom doors select: [:door | door isConnected].
	initialConnectedSet := Set new.
	doors do: [:door | initialConnectedSet addAll: door corridor].
	roomsToVisit := initialConnectedSet - visitedRooms.
	roomsToVisit do: [:room | self roomsConnectedTo: room in: remainingRooms trail: visitedRooms].
	^visitedRooms!

startingHp
^15!

startingStrength
^6!

tookATurn
	turnsTaken := turnsTaken + 1.
	turnsTaken % player regenPeriod = 0 ifTrue: [player hitFor: -1] !

turnsTaken
	^turnsTaken!

visibleWorld
visibleWorld isNil ifTrue: [self initializeVisibleWorld].
^visibleWorld!

width
^100!

world
^world! !
!Hack categoriesFor: #addRoom!game creation!private! !
!Hack categoriesFor: #at:!game play!public! !
!Hack categoriesFor: #canDropItemAt:!game play!public! !
!Hack categoriesFor: #canMoveTo:!game play!public! !
!Hack categoriesFor: #closeUnconnectedDoors!game creation!private! !
!Hack categoriesFor: #connectGroups:usingPairs:!game creation!private! !
!Hack categoriesFor: #connectRoom:to:!game creation!private! !
!Hack categoriesFor: #emptySpotsIn:!game creation!private! !
!Hack categoriesFor: #generate:monstersIn:!game creation!private! !
!Hack categoriesFor: #height!game play!public! !
!Hack categoriesFor: #initialize!game play!public! !
!Hack categoriesFor: #initializeCorridors!game creation!private! !
!Hack categoriesFor: #initializeCorridorsForGroups:!game creation!private! !
!Hack categoriesFor: #initializeCorridorsRoomPairs!game creation!private! !
!Hack categoriesFor: #initializeItems!game creation!private! !
!Hack categoriesFor: #initializeMonsters!game creation!private! !
!Hack categoriesFor: #initializePlayer!game creation!private! !
!Hack categoriesFor: #initializeRooms!game creation!private! !
!Hack categoriesFor: #initializeVisibleWorld!game creation!private! !
!Hack categoriesFor: #initializeWorld!game creation!private! !
!Hack categoriesFor: #inject:into:!game creation!private! !
!Hack categoriesFor: #isOver!game play!public! !
!Hack categoriesFor: #isStarted!game play!public! !
!Hack categoriesFor: #itemAt:!game play!public! !
!Hack categoriesFor: #items!game play!public! !
!Hack categoriesFor: #markDoor:!game creation!private! !
!Hack categoriesFor: #markDoorUndo:!game creation!private! !
!Hack categoriesFor: #markWorldForRooms!game creation!private! !
!Hack categoriesFor: #monsters!game play!public! !
!Hack categoriesFor: #neighborsOf:!game creation!private! !
!Hack categoriesFor: #nextEmptySpotIn:!game creation!private! !
!Hack categoriesFor: #placeItem:at:!game play!public! !
!Hack categoriesFor: #player!game play!public! !
!Hack categoriesFor: #pointsToConnectLeftRightDoor:of:to:of:!game creation!private! !
!Hack categoriesFor: #pointsToConnectTopBottomDoor:of:to:of:!game creation!private! !
!Hack categoriesFor: #positionOfItem:!game creation!private! !
!Hack categoriesFor: #printOn:!game play!public! !
!Hack categoriesFor: #removeItemAt:!game play!public! !
!Hack categoriesFor: #reset!game creation!private! !
!Hack categoriesFor: #roomContaining:!game play!public! !
!Hack categoriesFor: #roomGroups!game creation!private! !
!Hack categoriesFor: #rooms!game play!public! !
!Hack categoriesFor: #roomsConnectedTo:in:trail:!game creation!private! !
!Hack categoriesFor: #startingHp!game play!public! !
!Hack categoriesFor: #startingStrength!game play!public! !
!Hack categoriesFor: #tookATurn!game play!public! !
!Hack categoriesFor: #turnsTaken!game play!public! !
!Hack categoriesFor: #visibleWorld!game play!public! !
!Hack categoriesFor: #width!game play!public! !
!Hack categoriesFor: #world!game play!public! !

!Hack class methodsFor!

icon
	^Icon fromId: 179 in: ShellLibrary default!

margin
^4!

new
^super new initialize!

newBarren
"rooms, players, corridors, but no monsters or items"
^super basicNew reset; initializeRooms;
	initializeCorridors;
	markWorldForRooms;
	initializePlayer!

newEmpty
"an empty world, player is somewhere embedded in stone"
^super basicNew reset!

newFor: aName
| g |
g :=  self new.
g player name: aName.
^g!

randomBetween: lower and: upper 
	| raw range |
	upper < lower ifTrue: [Object error: 'Incoherent Range ', lower printString, ' ', upper printString].
	RandomSource isNil ifTrue: [RandomSource := Random new].
	range := upper - lower + 1.
	raw := RandomSource next.
	^(raw * range) floor + lower! !
!Hack class categoriesFor: #icon!public! !
!Hack class categoriesFor: #margin!private! !
!Hack class categoriesFor: #new!public! !
!Hack class categoriesFor: #newBarren!public! !
!Hack class categoriesFor: #newEmpty!public! !
!Hack class categoriesFor: #newFor:!public! !
!Hack class categoriesFor: #randomBetween:and:!public! !

Door guid: (GUID fromString: '{6DDB77C3-D86C-4BE4-88C6-66CB2F67C754}')!
Door comment: ''!
!Door categoriesForClass!Unclassified! !
!Door methodsFor!

canMoveTo
^true!

corridor
^corridor!

distanceFrom: aPoint

^((junction x - aPoint x) squared + (junction y - aPoint y) squared) sqrt!

foyer
^foyer!

initializeAt: aPoint 
super initializeAt: aPoint.
tile := #door.
corridor := OrderedCollection new.!

isConnected
^corridor isEmpty not!

junction 
^junction!

moveBy: delta
pos := (self pos + delta).
foyer := foyer + delta.
junction := junction + delta.!

printOn: aStream

aStream nextPutAll: (
self isConnected ifTrue: [ 'c']
	ifFalse: ['o'])
!

tile 
^#door!

type
^#huh! !
!Door categoriesFor: #canMoveTo!public! !
!Door categoriesFor: #corridor!private! !
!Door categoriesFor: #distanceFrom:!private! !
!Door categoriesFor: #foyer!private! !
!Door categoriesFor: #initializeAt:!private! !
!Door categoriesFor: #isConnected!private! !
!Door categoriesFor: #junction!private! !
!Door categoriesFor: #moveBy:!private! !
!Door categoriesFor: #printOn:!private! !
!Door categoriesFor: #tile!public! !
!Door categoriesFor: #type!public! !

DoorOnBottom guid: (GUID fromString: '{A4775FA1-6F57-49B1-B214-5201476BEAA1}')!
DoorOnBottom comment: ''!
!DoorOnBottom categoriesForClass!Unclassified! !
!DoorOnBottom methodsFor!

initializeAt: aPoint

super initializeAt: aPoint.
foyer := aPoint + (0@1).
junction := foyer + (0@1).!

type
^#bottom! !
!DoorOnBottom categoriesFor: #initializeAt:!private! !
!DoorOnBottom categoriesFor: #type!public! !

DoorOnLeft guid: (GUID fromString: '{D19B1A08-EB36-433C-BA15-80B31F8D3254}')!
DoorOnLeft comment: ''!
!DoorOnLeft categoriesForClass!Unclassified! !
!DoorOnLeft methodsFor!

initializeAt: aPoint

super initializeAt: aPoint.
foyer := aPoint + (-1@0).
junction := foyer + (-1@0).!

type
^#left! !
!DoorOnLeft categoriesFor: #initializeAt:!private! !
!DoorOnLeft categoriesFor: #type!public! !

DoorOnRight guid: (GUID fromString: '{319283A2-022E-4216-BCCA-FFAE7BD12AD0}')!
DoorOnRight comment: ''!
!DoorOnRight categoriesForClass!Unclassified! !
!DoorOnRight methodsFor!

initializeAt: aPoint

super initializeAt: aPoint.
foyer := aPoint + (1@0).
junction := foyer + (1@0).!

type
^#right! !
!DoorOnRight categoriesFor: #initializeAt:!private! !
!DoorOnRight categoriesFor: #type!public! !

DoorOnTop guid: (GUID fromString: '{1D3215B7-7068-4102-A11C-07CDF3F29F96}')!
DoorOnTop comment: ''!
!DoorOnTop categoriesForClass!Unclassified! !
!DoorOnTop methodsFor!

initializeAt: aPoint

super initializeAt: aPoint.
foyer := aPoint + (0@-1).
junction := foyer + (0@-1).!

type
^#top! !
!DoorOnTop categoriesFor: #initializeAt:!private! !
!DoorOnTop categoriesFor: #type!public! !

Room guid: (GUID fromString: '{230AD5EF-BD02-4A25-B801-B032CDD36D18}')!
Room comment: 'A "room" idea, useful only in game layout creation. not used during actual game play (except possibly when the "i" key is pressed).'!
!Room categoriesForClass!Unclassified! !
!Room methodsFor!

center
center isNil ifTrue: [center := super center].
^center!

closestDoorTo: aPoint

^(doors asSortedCollection: [: x : y | (x distanceFrom: aPoint) <= (y distanceFrom: aPoint) ]) first!

contains: aPoint

^super containsPoint: aPoint
!

distanceFrom: aPoint 
	
	^((aPoint x- self center x) squared + (aPoint y- self center y) squared) sqrt!

doors
	^doors!

exclusionZone
^exclusionZone!

initialize
| height width  |
height := Hack randomBetween: self minSize and: self maxSize.
width := Hack randomBetween: self minSize and: self maxSize. 
self initializeToWidth: width height:  height!

initializeToWidth: width height:  height
self origin: 0@0  extent: width@height.
exclusionZone := self expandedBy: 2.
doors := OrderedCollection new.
doors add: (DoorOnTop newAt: ( (width-1/2)rounded  @ 0)).
doors add: (DoorOnRight newAt: ( width -1@ ((height-1/2)rounded))).
doors add: (DoorOnBottom newAt: ( (width-1/2)rounded @ (height-1))).
doors add: (DoorOnLeft newAt: ( 0 @ ((height-1/2) rounded))).
!

isConnected

^doors anySatisfy: [:each | each isConnected]!

maxSize
^10!

minSize
^5!

moveBy: delta 
exclusionZone moveBy: delta.
self doors isEmpty ifFalse: [ 
	doors do: [:door | door moveBy: delta.].].
center := nil.

^super moveBy: delta !

nonWallPoints
	| points |

	points := Set new.
	self area <= 4 ifTrue: [^points].

	(self origin x +1 to: self corner x - 2) 
		do: [: x | (self origin y + 1 to: self corner y - 2) do: [: y | points add: x  @ y ]].
^points asSortedCollection!

numPoints
	| unusableWallPoints points |
	self area < 4 ifTrue: [^ 0 ].
	unusableWallPoints := 2* (self height + self width) - 4. "points overlap at 4 corners, "
	points := self area - unusableWallPoints.
	
	^points!

species
^Rectangle!

tryMovingLRDoor: door toMatch: term 
	| delta newY |
	(door isConnected ) ifTrue: [^self].
	delta :=  (term pos y - door pos y).
	newY := door pos y + delta.

	(newY <= self origin y or: [newY >= (self corner y-1)]) ifTrue: [^self].
	door moveBy: 0@delta!

tryMovingTBDoor: door toMatch: term 
	| delta newX |
	(door isConnected) ifTrue: [^self].
	delta := (term pos x - door pos x).
	newX := door pos x + delta.
	(newX <= self origin x or: [newX >= (self corner x-1)]) ifTrue: [^self].
	door moveBy: delta@0!

wallPoints
	| points |
	self area = 0 ifTrue: [^Set new.].
	points := Set new: self area .
	points add: self origin.
	(self origin x + 1 to: self corner x - 1) do: 
			[:x | 
			points add: x @ self origin y.
			points add: x @ self corner y - 1].
	(self origin y + 1 to: self corner y - 1) do: 
			[:y | 
			points add: self origin x @ y.
			points add: (self corner x - 1) @ y].
	^points ! !
!Room categoriesFor: #center!private! !
!Room categoriesFor: #closestDoorTo:!private! !
!Room categoriesFor: #contains:!private! !
!Room categoriesFor: #distanceFrom:!private! !
!Room categoriesFor: #doors!private! !
!Room categoriesFor: #exclusionZone!private! !
!Room categoriesFor: #initialize!private! !
!Room categoriesFor: #initializeToWidth:height:!private! !
!Room categoriesFor: #isConnected!private! !
!Room categoriesFor: #maxSize!private! !
!Room categoriesFor: #minSize!private! !
!Room categoriesFor: #moveBy:!private! !
!Room categoriesFor: #nonWallPoints!private! !
!Room categoriesFor: #numPoints!private! !
!Room categoriesFor: #species!private! !
!Room categoriesFor: #tryMovingLRDoor:toMatch:!private! !
!Room categoriesFor: #tryMovingTBDoor:toMatch:!private! !
!Room categoriesFor: #wallPoints!private! !

!Room class methodsFor!

new

^super new initialize! !
!Room class categoriesFor: #new!public! !

NotNetHackSessionManager guid: (GUID fromString: '{A7330D49-BE10-4760-921C-95E460256B7E}')!
NotNetHackSessionManager comment: ''!
!NotNetHackSessionManager categoriesForClass!System-Support! !
!NotNetHackSessionManager methodsFor!

main
	"Start the  application."

	| pad |
	pad := self mainShellClass show.
	self argc > 1 ifTrue: [pad game player name: (self argv at: 2)]! !
!NotNetHackSessionManager categoriesFor: #main!public! !

!NotNetHackSessionManager class methodsFor!

mainShellClass
	"Answer the class of the application's main window (a <Shell> presenter)."

	^HackView! !
!NotNetHackSessionManager class categoriesFor: #mainShellClass!public! !

HackTest guid: (GUID fromString: '{696220CB-7A0E-49CE-B486-3AB820E66BDA}')!
HackTest comment: ''!
!HackTest categoriesForClass!Unclassified! !
!HackTest methodsFor!

createBoringGame
"answer a game with just a player, no items, no monsters"

	game := Hack newBarren.
	^game!

createEmptyGame
"answer a game with just a player, no items, no monsters"

	game := Hack newEmpty.
	^game!

createJailCell
"one room with player, no doors, no monsters, no items"


game := self createEmptyGame.
game addRoom; markWorldForRooms .
game initializePlayer; closeUnconnectedDoors.
^game!

createRoomAt: origin width: width height: height
| aRoom |
aRoom := Room new initializeToWidth: width height: height.
aRoom moveBy: origin.
game rooms add: aRoom.
game markWorldForRooms.


^aRoom
	!

testClosingDoors
	|  leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 4 width: 10 height: 8.
	rightRoom := self createRoomAt: 19@4 width: 8 height: 8.
	
	game connectRoom: leftRoom to: rightRoom.
	game closeUnconnectedDoors.
	self assert: leftRoom equals: rightRoom doors first corridor first.
	self assert: rightRoom equals: leftRoom doors first corridor first.
	self assert: 1 equals: leftRoom doors size.
	self assert: 1 equals: rightRoom doors size.
	self assert: 6
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 1
		equals: (game inject: 0
				into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])])!

testClosingDoorsConnectedAtFoyer
	"the doors are already connected at their foyer, no points were needed"

	|  leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 4 width: 10 height: 8.
	rightRoom := self createRoomAt: 16@4 width: 8 height: 8.

	game connectRoom: leftRoom to: rightRoom.
	game closeUnconnectedDoors.
	self assert: leftRoom equals: rightRoom doors first corridor first.
	self assert: rightRoom equals: leftRoom doors first corridor first.
	self assert: 1 equals: leftRoom doors size.
	self assert: 1 equals: rightRoom doors size.
	self assert: 4
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 0
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])])!

testClosingDoorsConnectedAtFoyerTopLeft
	"the doors are already connected at their foyer, no points were needed"

	|  bottomRoom rightRoom |
	self createEmptyGame.
	bottomRoom := self createRoomAt: 5@9 width: 6 height: 9.
	rightRoom := self createRoomAt: 16@4 width: 8 height: 8.
	game markDoorUndo: (bottomRoom doors at: 2).
	bottomRoom doors remove: (bottomRoom doors at: 2).

	game connectRoom: bottomRoom to: rightRoom.
	game closeUnconnectedDoors.

	self assert: bottomRoom equals: rightRoom doors first corridor first.
	self assert: rightRoom equals: bottomRoom doors first corridor first.
	self assert: 1 equals: bottomRoom doors size.
	self assert: 1 equals: rightRoom doors size.
	self assert: 6
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 6
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])])!

testClosingDoorsConnectedAtJunction
	"the doors are already connected, no points were needed"

	| leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 4 width: 10 height: 8.
	rightRoom := self createRoomAt: 18@4 width: 8 height: 8.
	game connectRoom: leftRoom to: rightRoom.
	game closeUnconnectedDoors.
	self assert: leftRoom equals: rightRoom doors first corridor first.
	self assert: rightRoom equals: leftRoom doors first corridor first.
	self assert: 1 equals: leftRoom doors size.
	self assert: 1 equals: rightRoom doors size.
	self assert: 6
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 0
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])])!

testCreate
	| pointsUsed |
	game := Hack new.
	self assert: 0 equals: game turnsTaken.
	self assert: false equals: game isStarted.
	self assert: false equals: game isOver.
	self assert: game rooms first equals: game player room.
	self assert: 0 equals: game player gold.
	self assert: game startingHp equals: game player hp.
	self assert: game startingStrength equals: game player strength.
	game items do: 
			[:anItem | 
			self assert: (game roomContaining: (game positionOfItem: anItem)) isNil not
				description: 'item pos ' , anItem printString , ' - ' , (game positionOfItem: anItem) printString].
	pointsUsed := Bag new.
	pointsUsed addAll: (game monsters collect: [:mon | mon position]).
	pointsUsed addAll: game items keys.
	pointsUsed add: game player position.
	pointsUsed valuesAndCountsDo: 
			[:v :c | self assert: 1 =  c description: 'point used more than once: ' , v printString , ' ' , c printString].
!

testCreateItemsToFillRoom
| room numFreePoints  |
	self createJailCell.
	room := game rooms first.
	numFreePoints := (game emptySpotsIn: room) size.
	numFreePoints timesRepeat: [ game placeItem: #test at: (game nextEmptySpotIn: room) ].
	self assert: numFreePoints equals: game items size.
!

testCreateMakesGoodRooms
	| floorSpace flooredTiles wallSpace wallTiles doorSpace doorTiles unusedJunctions |
	game := Hack new.
	self assert: game rooms size > 0.
	game rooms do: 
			[:aRoom | 
			| otherRooms |
			otherRooms := game rooms copy.
			otherRooms remove: aRoom.
			self assert: (otherRooms anySatisfy: [:r | r exclusionZone intersects: aRoom exclusionZone] ) not ].

	self assert: 1 equals: game roomGroups size.
	self assert: game rooms size equals: game roomGroups first size.

	floorSpace := game rooms inject: 0 into: [:accum :each | accum + each numPoints].
	doorSpace := game rooms inject: 0 into: [:accum :each | accum + each doors size].
	wallSpace := (game rooms inject: 0 into: [:accum :each | accum + each wallPoints size]) - doorSpace.

	flooredTiles := game inject: 0 into: [: accum : point | accum + (point tile == #roomFloor ifTrue: [1] ifFalse: [0]).].
	self assert: floorSpace equals: flooredTiles.

	wallTiles := game world inject: 0 into:  [: accum : col | accum + (col select: [:point | point tile == #wall]) size].
	self assert: wallSpace equals: wallTiles.

	doorTiles := game world inject: 0 into:  [: accum : col | accum + (col select: [:point | point tile == #door]) size].

	unusedJunctions := game rooms inject: 0 into:  [ : accum :room | accum +  (room doors select: [:door |  ((game at: door junction) tile ~~ #door) ]) size].
	self assert: doorSpace*3 - unusedJunctions equals: doorTiles!

testCreateMonsters
	|  aRoom numFreePoints positions |
	self createJailCell.
	aRoom := game rooms first.
	numFreePoints := (game emptySpotsIn: aRoom) size.
	game generate: numFreePoints monstersIn: aRoom.
	self assert: numFreePoints equals: game monsters size.
	self assert: 0 equals: 	(game emptySpotsIn: aRoom) size.

	positions := game monsters collect: [:mon | mon position].
	positions := positions asSet.
	self assert: numFreePoints equals: positions size.
	game monsters 
		do: [:aMonster | self assert: aRoom equals: (game roomContaining: aMonster position)]!

testCreateTooManyItemsInFullRoom
|  room numFreePoints  res |
	self createJailCell.
	room := game rooms first.
	numFreePoints := (game emptySpotsIn: room) size.
	numFreePoints  timesRepeat: [ game placeItem: #test at: (game nextEmptySpotIn: room) ].
	res := game placeItem: #OneMoreWaferThinMint at: (game nextEmptySpotIn: room).
	self assert: false equals: res.
	self assert: numFreePoints equals: game items size.
!

testDropItem

| player |

self createJailCell.

player := game player.
player inventory add: #test.
player dropItem: #test.
self assert: 0 equals: player inventory size.
self assert: #test equals: (game itemAt: player position).
self assert: 1 equals: game turnsTaken.
self assert: true equals: game isStarted.!

testDropItemAfterDeath

|  oldPos    player |

self createJailCell.

player := game player.
oldPos := player position.
player inventory add: #test.
player hitFor: player hp.
player dropItem: #test.
self assert: 1 equals: player inventory size.
self assert: nil equals: (game itemAt: oldPos)!

testDropItemNoInventory
	| player |
	self createJailCell.
	player := game player.
	player inventory add: #test.
	player dropItem: #test.
	player changePosition: 1 @ 1.
	
	[player dropItem: #test.
	self assert: false] on: NotFoundError
			do: [:ex | self assert: ex tag equals: #test]!

testDropItemOnTopOfAnother

|  oldPos    player |

self createJailCell.

player := game player.
oldPos := player position.
player inventory add: #test1.
player inventory add: #test2.
player dropItem: #test1.
player dropItem: #test2.
self assert: 1 equals: player inventory size.
self assert: #test2 equals: player inventory first.
self assert: #test1 equals: (game itemAt: oldPos)!

testFightAndKillMonster
	| oldPos delta player monHp playerHp newPos monster |
	self createJailCell.
	game generate: 1 monstersIn: game rooms first.
	monster := game monsters first.
	monHp := monster hp.
	player := game player.
	player weaken: player strength - 1.
	monster weaken: monster strength - 1.
	playerHp := game player hp.
	oldPos := player position.
	delta := monster position - oldPos.
	newPos := oldPos + delta.
	monHp timesRepeat: [player changePosition: delta].
	self assert: newPos equals: player position.
	self assert: playerHp - monHp + (monHp // player regenPeriod) equals: player hp.
	self assert: 0 equals: monster hp.
	self assert: monster isDead.
	self assert: 1 equals: player kills!

testFightAttackForce
	| player tries range res num tolerance expCount |
	self createJailCell.
	player := game player.
	tries := 5000.
	range := player strength.
	res := Array new: range withAll: 0.
	tries timesRepeat: 
			[num := player attackForceMustered.
			res at: num put: (res at: num) + 1].
	tolerance := 0.02 * tries.
	expCount := tries / range.
	res do: 
			[:count | 
			self 
				assert: expCount
				equals: count
				tolerance: tolerance]!

testFightMonster
	|  oldPos delta player monHp playerHp |
	self createJailCell.
	game generate: 1 monstersIn: game rooms first.
	game player weaken: game player strength - 1.
	game monsters first weaken: game monsters first strength - 1.
	monHp := game monsters first hp.
	player := game player.
	playerHp := game player hp.
	oldPos := player position.
	delta := game monsters first position - oldPos.

	player changePosition: delta.
	self assert: oldPos equals: player position.
	self assert: playerHp - 1 equals: player hp.
	self assert: monHp - 1 equals: game monsters first hp.
	self assert: 0 equals: player kills!

testFightMonsterAndDie
	|  oldPos delta player monHp playerHp monster  |
	self createJailCell.
	game generate: 1 monstersIn: game rooms first.
	monster := game monsters first.
	game player weaken: game player strength - 1.
	game monsters first weaken: game monsters first strength - 1.
	monHp := monster hp.
	player := game player.
	playerHp := game player hp.
	oldPos := player position.
	delta := monster position - oldPos.

	player hitFor: playerHp - 1.
	player changePosition: delta.
	self assert: oldPos equals: player position.
	self assert: 0 equals: player hp.
	self assert: player isDead.
	self assert: monHp - 1 equals: monster hp.
	self assert: game isOver!

testGameInjectInto
	| count |
	self createEmptyGame.

	count := game inject: 0 into: [:accum :each | accum + ((each tile == #dirt) ifTrue: [1] ifFalse: [0])].
	self assert: game height * game width equals: count.!

testItemBoostAugmentsStr
self createJailCell.
game player inventory add: #boost.
game player useItem.
self assert: 7 equals: game player strength.
self assert: 15 equals: game player hp.
self assert: 0 equals: game player inventory size.
self assert: 1 equals: game turnsTaken.!

testItemFoodRestoresHp

self createJailCell.
game player inventory add: #food.
game player hitFor: 4.
game player useItem.
self assert: 15 equals: game player hp.
self assert: 6 equals: game player strength.
self assert: 0 equals: game player inventory size.
self assert: 1 equals: game turnsTaken!

testItemNoInventory

self createJailCell.
game player useItem.
self assert: 6 equals: game player strength.
self assert: 15 equals: game player hp.
self assert: 0 equals: game player inventory size.
self assert: 1 equals: game turnsTaken!

testMovePlayer

|  oldPos delta expectedPos room player |

self createJailCell.

room := game rooms first.
player := game player.
oldPos := player position.
delta := room extent - (2@2)-  (oldPos-room origin).
expectedPos := oldPos + delta.
player changePosition: delta.
self assert: expectedPos equals: player position.
self assert: 1 equals: game turnsTaken.
self assert: true equals: game isStarted!

testMovePlayerIntoMonster

|   oldPos delta  player |
self createJailCell.

game generate: 1 monstersIn: game rooms first.
player := game player.
oldPos := player position.
delta :=  game monsters first position - oldPos.
player changePosition: delta.
self assert: oldPos equals: player position.
!

testMovePlayerIntoWallLRC

|  oldPos delta expectedPos corner |
self createJailCell .

oldPos := game player position.
corner := game rooms first corner.
delta := corner - (1@1) - oldPos.
expectedPos := oldPos.
game player changePosition: delta.
self assert: expectedPos equals: game player position.!

testMovePlayerIntoWallOnBottom

|  oldPos delta expectedPos  |
self createJailCell .

oldPos := game player position.
delta := (0)@(game rooms first corner y-oldPos y- 1).
expectedPos := oldPos.
game player changePosition: delta.
self assert: expectedPos equals: game player position.!

testMovePlayerIntoWallOnLeft

|  oldPos delta expectedPos  |

self createJailCell .

oldPos := game player position.
delta := (game rooms first origin x-oldPos x+ 1)@0.
expectedPos := oldPos.
game player changePosition: delta.
self assert: expectedPos equals: game player position.!

testMovePlayerIntoWallOnRight

|  oldPos delta expectedPos  |
self createJailCell .

oldPos := game player position.
delta := (game rooms first corner x-oldPos x - 1)@0.
expectedPos := oldPos.
game player changePosition: delta.
self assert: expectedPos equals: game player position.!

testMovePlayerIntoWallULC

|  oldPos delta expectedPos  |

self createJailCell .
oldPos := game player position.
delta := game rooms first origin+ (1@1)-oldPos.
expectedPos := oldPos.
game player changePosition: delta.
self assert: expectedPos equals: game player position.!

testMovePlayerOntoItem

|  oldPos delta expectedPos player |

self createJailCell.

player := game player.
oldPos := player position.
delta := 1@0.
game placeItem: #test at: oldPos + delta.
expectedPos := oldPos + delta.
player changePosition: delta.
self assert: expectedPos equals: player position.
self assert: #test equals: player inventory first.
self assert: nil equals: (game itemAt: oldPos + delta).!

testMovePlayerToDoor

|  oldPos delta expectedPos  |

self createBoringGame.

oldPos := game player position.
delta := (game rooms first doors first pos -oldPos ).
expectedPos := oldPos+delta.
game player changePosition: delta. 
self assert: expectedPos equals: game player position.!

testMovePlayerToWallOnBottom

|  oldPos delta expectedPos  |

self createJailCell .


oldPos := game player position.
delta := (0)@(game rooms first corner y-oldPos y- 2).

expectedPos := oldPos+delta.
game player changePosition: delta.
self assert: expectedPos equals: game player position.!

testMovePlayerToWallOnRight

|   oldPos delta expectedPos  |

self createJailCell .


oldPos := game player position.
delta := (game rooms first corner x-oldPos x - 2)@0.
expectedPos := oldPos+delta.
game player changePosition: delta.
self assert: expectedPos equals: game player position.!

testMovingAfterDeath
	|  oldPos  player  playerHp   |
	self createJailCell.
	
	player := game player.
	
	playerHp := player hp.
	oldPos := player position.

	
	player hitFor: playerHp.
	player changePosition: 1@0.
	self assert: oldPos equals: player position.
	self assert: 0 equals: player hp.
	self assert: player isDead.
	self assert: game isOver.
	!

testRandomGenerator
	| tries range res num tolerance expCount |
	tries := 5000.
	range := 5.
	res := Array new: range withAll: 0.
	tries timesRepeat: 
			[num := Hack randomBetween: 1 and: range.
			res at: num put: (res at: num) + 1].
	tolerance := 0.02 * tries.

	expCount := tries / range.
	res do: [:count | self assert: expCount equals: count tolerance: tolerance]!

testRandomGeneratorFlexibleRange
	| tries lower upper |
	tries := 5000.
	lower := -3.
	upper := 30.
	tries timesRepeat: [self assert: ((Hack randomBetween: lower and: upper) between: lower and: upper)]!

testRandomGeneratorIncoherentRange
	|  lower upper |
	lower := 1.
	upper := 0.
	[Hack randomBetween: lower and: upper .
	self assert: false description: 'Should have thrown exception'.]
		on: Error	
		do: [:ex |	self assert: 'Incoherent Range 1 0' equals: ex messageText]!

testRandomGeneratorSmallRange
	| tries lower upper |
	tries := 1000.
	lower := 1.
	upper := 1.
	tries timesRepeat: [self assert: ((Hack randomBetween: lower and: upper) between: lower and: upper)]!

testRegenAfterDamage
	|  player origHp |
	self createJailCell.
	player := game player.
	player hitFor: 2.
	origHp := player hp.
	player regenPeriod timesRepeat: [game tookATurn].
	self assert: origHp + 1 equals: player hp!

testRegenAtFullHealth
	|  player origHp |
	self createJailCell.
	player := game player.
	origHp := player hp.
	player regenPeriod timesRepeat: [game tookATurn].
	self assert: origHp equals: player hp!

testRoomConfigIntersectCorridor

	|  leftRoom rightRoom bottomRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3 width: 5 height: 6.
	rightRoom := self createRoomAt: (3 + 5 + 8) @ 3 width: 7 height: 6.

	game connectRoom: leftRoom to: rightRoom.
	bottomRoom := self createRoomAt: (3 + 5 + 3) @ 10 width: 5 height: 5.

	game connectRoom: bottomRoom to: rightRoom. 
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: rightRoom equals: (bottomRoom doors first) corridor first.
	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: bottomRoom equals: rightRoom doors last corridor second.
	self assert: 36
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 5
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
!

testRoomConfigLeftLowerThanRight


	|  leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3 @ 16 width: 5 height: 6.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 6.

	rightRoom doors remove: (rightRoom doors at: 1).

	game connectRoom: leftRoom to: rightRoom.

	self assert: leftRoom equals: (rightRoom doors at: 2) corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 17
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
!

testRoomConfigRightToLeft
	"left door to right door"

	|  leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 9 @ 49 width: 10 height: 5.
	rightRoom := self createRoomAt: 26 @ 57 width: 7 height: 5.

	game connectRoom: rightRoom to: leftRoom.
	"(HackView on: game) inspect."
	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 11
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
!

testRoomConfigSideBySide
	"place two rooms near each other, side by side left to right, see that they connect right door of left room to left door of right room"

	|  leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3 width: 10 height: 6.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 9.

	game connectRoom: leftRoom to: rightRoom.
	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: 23
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 0
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
!

testRoomConfigSideBySideNoExtraTunnel
	"place two rooms near each other, side by side left to right, see that they connect right door of left room to left door of right room"

	| leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3 width: 5 height: 6.
	rightRoom := self createRoomAt: 12 @ 3 width: 5 height: 6.

	game connectRoom: leftRoom to: rightRoom.
	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 0
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
!

testRoomConfigSideBySideOneUpLeftRoomFirst
	"place two rooms near each other, side by side left to right, see that they connect "

	| leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3@4 width: 5 height: 5.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 5.

	game connectRoom: leftRoom to: rightRoom.  

	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 4
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
	!

testRoomConfigSideBySideOneUpLeftRoomFirstMoveDoorLotsDown
	"place two rooms near each other, side by side left to right, see that they connect "

	| leftRoom rightRoom leftRoomsDoorOrigPos rightRoomsDoorOrigPos |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3@4 width: 5 height: 5.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 10.

	leftRoomsDoorOrigPos := leftRoom doors second pos.
	rightRoomsDoorOrigPos := rightRoom doors last pos.
	game connectRoom: leftRoom to: rightRoom.

	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: leftRoomsDoorOrigPos equals: leftRoom doors second pos.
	self assert: rightRoomsDoorOrigPos- (0 @ 2) equals: rightRoom doors last pos .
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 4
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
!

testRoomConfigSideBySideOneUpLeftRoomFirstMoveDoorLotsUp
	"place two rooms near each other, side by side left to right, see that they connect "

	|  leftRoom rightRoom leftRoomsDoorOrigPos rightRoomsDoorOrigPos |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3@8 width: 5 height: 5.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 10.

	leftRoomsDoorOrigPos := leftRoom doors second pos.
	rightRoomsDoorOrigPos := rightRoom doors last pos.
	game connectRoom: leftRoom to: rightRoom.
	
	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: leftRoomsDoorOrigPos equals: leftRoom doors second pos.
	self assert: rightRoomsDoorOrigPos+(0@2) equals: rightRoom doors last pos .
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 4
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
!

testRoomConfigSideBySideOneUpRightRoomFirst
	"place two rooms near each other, side by side left to right, see that they connect "

	| leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3@4 width: 5 height: 5.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 5.

	game connectRoom: rightRoom to: leftRoom.
	self assert: leftRoom equals: rightRoom doors last corridor first.
	self assert: rightRoom equals: leftRoom doors second corridor first.
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 4
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])])!

testRoomConfigTopBottomBelowIt
	| topRoom botRoom |
	self createEmptyGame.
	topRoom := self createRoomAt: 3 width: 5 height: 16.
	botRoom := self createRoomAt: 12 @ 18 width: 5 height: 6.

	game connectRoom: topRoom to: botRoom. 
	self assert: topRoom equals: (botRoom doors first) corridor first.
	self assert: botRoom equals: topRoom doors second corridor first.
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 9
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])])!

testRoomConfigTopBottomNoExtraTunnel

	| topRoom botRoom |
	self createEmptyGame.
	topRoom := self createRoomAt: 3 width: 5 height: 6.
	botRoom := self createRoomAt: 3 @ 13 width: 5 height: 6.

	game connectRoom: topRoom to: botRoom.
	self assert: topRoom equals: (botRoom doors first) corridor first.
	self assert: botRoom equals: (topRoom doors at: 3) corridor first.
	self assert: 24
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 0
		equals: (game inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])])!

testRoomGroupsConnected
	"right door to bottom door"

	| leftRoom rightRoom righterRoom lonelyRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3@16 width: 5 height: 6.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 6.
	righterRoom := self createRoomAt: 32 @ 3 width: 5 height: 6.
	lonelyRoom := self createRoomAt: 32 @ 32 width: 5 height: 6.

	game connectRoom: leftRoom to: rightRoom.
	game connectRoom: rightRoom to: righterRoom.
	"(HackView on: game) inspect."
	self assert: 2 equals: game roomGroups size.
	self assert: 3 equals: game roomGroups first size.
	self assert: 1 equals: game roomGroups second size.
	self assert: lonelyRoom equals: game roomGroups second asOrderedCollection first!

testRoomGroupsSimple
	"right door to bottom door"

	| leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3@16 width: 5 height: 6.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 6.

	"(HackView on: game) inspect."
	self assert: 2 equals: game roomGroups size.
	self assert: 1 equals: game roomGroups first size.
	self assert: 1 equals: game roomGroups second size.
	self assert: (game roomGroups first asOrderedCollection first ~= game roomGroups second asOrderedCollection first)!

testVisibleWorld
	"right door to bottom door"

	|  leftRoom rightRoom |
	self createEmptyGame.
	leftRoom := self createRoomAt: 3@16 width: 5 height: 6.
	rightRoom := self createRoomAt: 16 @ 3 width: 5 height: 6.

	game connectRoom: leftRoom to: rightRoom.
	"(HackView on: game) inspect."
	self assert: 93 equals: game visibleWorld size.
	self assert: 24
		equals: (game visibleWorld inject: 0 into: [:accum :each | accum + (each tile == #door ifTrue: [1] ifFalse: [0])]).
	self assert: 17
		equals: (game visibleWorld inject: 0 into: [:accum :each | accum + (each tile == #tunnel ifTrue: [1] ifFalse: [0])]).
	self assert: 24
		equals: (game visibleWorld inject: 0 into: [:accum :each | accum + (each tile == #roomFloor ifTrue: [1] ifFalse: [0])]).
	self assert: 28
		equals: (game visibleWorld inject: 0 into: [:accum :each | accum + (each tile == #wall ifTrue: [1] ifFalse: [0])]).
	self assert: 0
		equals: (game visibleWorld inject: 0 into: [:accum :each | accum + (each tile == #dirt ifTrue: [1] ifFalse: [0])]).!

testVisibleWorldEmpty
	"right door to bottom door"

	| game  |
	game := self createEmptyGame.
	self assert: 0 equals: game visibleWorld size.
	
	!

testWinning

	| game  |
	game := self createJailCell.
	self assert: true equals: game isOver! !
!HackTest categoriesFor: #createBoringGame!public! !
!HackTest categoriesFor: #createEmptyGame!public! !
!HackTest categoriesFor: #createJailCell!public! !
!HackTest categoriesFor: #createRoomAt:width:height:!public! !
!HackTest categoriesFor: #testClosingDoors!public! !
!HackTest categoriesFor: #testClosingDoorsConnectedAtFoyer!public! !
!HackTest categoriesFor: #testClosingDoorsConnectedAtFoyerTopLeft!public! !
!HackTest categoriesFor: #testClosingDoorsConnectedAtJunction!public! !
!HackTest categoriesFor: #testCreate!public! !
!HackTest categoriesFor: #testCreateItemsToFillRoom!public! !
!HackTest categoriesFor: #testCreateMakesGoodRooms!public! !
!HackTest categoriesFor: #testCreateMonsters!public! !
!HackTest categoriesFor: #testCreateTooManyItemsInFullRoom!public! !
!HackTest categoriesFor: #testDropItem!public! !
!HackTest categoriesFor: #testDropItemAfterDeath!public! !
!HackTest categoriesFor: #testDropItemNoInventory!public! !
!HackTest categoriesFor: #testDropItemOnTopOfAnother!public! !
!HackTest categoriesFor: #testFightAndKillMonster!public! !
!HackTest categoriesFor: #testFightAttackForce!public! !
!HackTest categoriesFor: #testFightMonster!public! !
!HackTest categoriesFor: #testFightMonsterAndDie!public! !
!HackTest categoriesFor: #testGameInjectInto!public! !
!HackTest categoriesFor: #testItemBoostAugmentsStr!public! !
!HackTest categoriesFor: #testItemFoodRestoresHp!public! !
!HackTest categoriesFor: #testItemNoInventory!public! !
!HackTest categoriesFor: #testMovePlayer!public! !
!HackTest categoriesFor: #testMovePlayerIntoMonster!public! !
!HackTest categoriesFor: #testMovePlayerIntoWallLRC!public! !
!HackTest categoriesFor: #testMovePlayerIntoWallOnBottom!public! !
!HackTest categoriesFor: #testMovePlayerIntoWallOnLeft!public! !
!HackTest categoriesFor: #testMovePlayerIntoWallOnRight!public! !
!HackTest categoriesFor: #testMovePlayerIntoWallULC!public! !
!HackTest categoriesFor: #testMovePlayerOntoItem!public! !
!HackTest categoriesFor: #testMovePlayerToDoor!public! !
!HackTest categoriesFor: #testMovePlayerToWallOnBottom!public! !
!HackTest categoriesFor: #testMovePlayerToWallOnRight!public! !
!HackTest categoriesFor: #testMovingAfterDeath!public! !
!HackTest categoriesFor: #testRandomGenerator!public! !
!HackTest categoriesFor: #testRandomGeneratorFlexibleRange!public! !
!HackTest categoriesFor: #testRandomGeneratorIncoherentRange!public! !
!HackTest categoriesFor: #testRandomGeneratorSmallRange!public! !
!HackTest categoriesFor: #testRegenAfterDamage!public! !
!HackTest categoriesFor: #testRegenAtFullHealth!public! !
!HackTest categoriesFor: #testRoomConfigIntersectCorridor!public! !
!HackTest categoriesFor: #testRoomConfigLeftLowerThanRight!public! !
!HackTest categoriesFor: #testRoomConfigRightToLeft!public! !
!HackTest categoriesFor: #testRoomConfigSideBySide!public! !
!HackTest categoriesFor: #testRoomConfigSideBySideNoExtraTunnel!public! !
!HackTest categoriesFor: #testRoomConfigSideBySideOneUpLeftRoomFirst!public! !
!HackTest categoriesFor: #testRoomConfigSideBySideOneUpLeftRoomFirstMoveDoorLotsDown!public! !
!HackTest categoriesFor: #testRoomConfigSideBySideOneUpLeftRoomFirstMoveDoorLotsUp!public! !
!HackTest categoriesFor: #testRoomConfigSideBySideOneUpRightRoomFirst!public! !
!HackTest categoriesFor: #testRoomConfigTopBottomBelowIt!public! !
!HackTest categoriesFor: #testRoomConfigTopBottomNoExtraTunnel!public! !
!HackTest categoriesFor: #testRoomGroupsConnected!public! !
!HackTest categoriesFor: #testRoomGroupsSimple!public! !
!HackTest categoriesFor: #testVisibleWorld!public! !
!HackTest categoriesFor: #testVisibleWorldEmpty!public! !
!HackTest categoriesFor: #testWinning!public! !

RoomTest guid: (GUID fromString: '{E1E23654-CFE8-4773-946D-7ACF51992775}')!
RoomTest comment: ''!
!RoomTest categoriesForClass!SUnit! !
!RoomTest methodsFor!

testGoodRoom
	| room doorsNotInWalls   |
	#(#(3 3) #(3 8) #(5 5) #(10 20)) do: 
			[:sample | 
			room := Room new. 
			room initializeToWidth: sample first height:  sample second.
			self assert: 4 equals: room doors size.
			doorsNotInWalls := room doors reject: [: door | room wallPoints includes: door pos].
			self assert: 0 equals: doorsNotInWalls size].
	!

testNonWallPoints
	| room | 
	room := Room new.
	#( #(0 0 0) #(1 1 0) #(2 2 0) #(5 5 9)  #( 6 6 16 ) (10 20 144)  ) do: [: sample |
	room width: sample first.
	room height: sample second.
	self assert: sample last equals: room nonWallPoints size]!

testNumPoints
	| room | 
	room := Room new.
	#( #(0 0 0) #(1 1 0) #(2 2 0) #(5 5 9)  #( 6 6 16 ) (10 20 144)  ) do: [: sample |
	room width: sample first.
	room height: sample second.
	self assert: sample last equals: room numPoints]!

testRandomRoomCreation
	| room minArea maxArea |
	room := Room new.
	minArea := room minSize * room minSize.
	self assert: minArea > 4 description: 'min area'.
	maxArea := room maxSize * room maxSize.
	500 timesRepeat: 
			[room := Room new.
			self assert: (room area between: minArea and: maxArea) description: 'Room size ' , room printString]!

testWallPoints
	| room | 
	room := Room new.
	#( #(0 0 0) #(1 1 1) #(2 2 4) #(5 5 16)  #( 6 6 20 ) (10 20 56)  ) do: [: sample |
	room width: sample first.
	room height: sample second.
	self assert: sample last equals: room wallPoints size]! !
!RoomTest categoriesFor: #testGoodRoom!public! !
!RoomTest categoriesFor: #testNonWallPoints!public! !
!RoomTest categoriesFor: #testNumPoints!public! !
!RoomTest categoriesFor: #testRandomRoomCreation!public! !
!RoomTest categoriesFor: #testWallPoints!public! !

HackView guid: (GUID fromString: '{F446BDA2-5410-41F3-A1AA-27F3F8F3D6B7}')!
HackView comment: 'self show

HackPresenter show'!
!HackView categoriesForClass!Unclassified! !
!HackView methodsFor!

defaultExtent
	^930 @ 710!

defaultWindowProcessing: message wParam: wParam lParam: lParam
"| sel |
sel := MessageMap at: message + 1.
(#(#wmSetCursor:wParam:lParam:
#wmMouseMove:wParam:lParam:
#wmNcHitTest:wParam:lParam:
) includes: sel) ifFalse: [ Transcript cr show: sel printString.]."

^super defaultWindowProcessing: message wParam: wParam lParam: lParam

!

displayedStatsStartingPoint
^ 715 @ self defaultExtent y
		!

dropItem
game player inventory isEmpty ifTrue: [Sound beep. ^self ].
game player dropItem: (game player inventory last).
self step.


!

game
^game!

game: aGame
game := aGame!

initialize
	super initialize.
	lastTurnUpdateTime := Time now asMilliseconds.
	self backcolor: Color black.
	self text: 'NotNetHack'.

!

inspectRoom
| pos pt |

pos := self cursorPosition.

pt := pos * (1/7).
pt x: (pt x rounded).
pt y: (pt y rounded).
(game roomContaining: pt) inspect



!

inventoryRectangle

^Rectangle origin: (self pointOffsetFromLlc: self inventoryStartingPoint)
		extent: 100 @ 300!

inventoryStartingPoint
	| yOffset invFont lineHeight  |


	invFont := Font name: 'Arial' pointSize: 12.
	invFont isBold: true.
	lineHeight := (invFont pixelSize * 1.1) rounded.
	yOffset := 26 * lineHeight.
^720@yOffset
	!

moveDir: dir
| jump |
jump := dir.
Keyboard default isShiftDown ifTrue: [jump := dir*2].
game player changePosition: jump.
self step.

!

moveDown

self moveDir: 0@1.


!

moveLeft

self moveDir: -1@0.
self step.

!

moveRight
self moveDir: 1@0.
self step.

!

moveUp

self moveDir: 0@-1.
self step.

!

onInputMaskRequired: anEvent
	"Handler for a WM_GETDLGCODE request from Windows. Answer a combination
	of DLGC_xxxx flags which specify the set of keyboard inputs desired."
	
	^DLGC_WANTALLKEYS!

onKeyPressed: aKeyEvent 
	"Handler for a WM_KEYDOWN by moving selection with arrow keys."

	| keyCode period |
"Transcript cr tab show: 'key pr   ', aKeyEvent code printString."
			keyCode := aKeyEvent code.
			period := 190.

			keyCode == VK_LEFT ifTrue: [self moveLeft].
			keyCode == VK_RIGHT ifTrue: [ self moveRight].
			keyCode == VK_DOWN ifTrue: [ self moveDown].
			keyCode == VK_UP ifTrue: [self moveUp].
			keyCode == $D asInteger ifTrue: [ self dropItem].
			keyCode == Character space asInteger ifTrue: [ self useItem].
			keyCode == period ifTrue: [ self rest].
			keyCode == $R asInteger ifTrue: [ self restartWorld].
			keyCode == $I asInteger ifTrue: [ self inspectRoom].
			
	"^super onKeyPressed: aKeyEvent"
^false

!

onPaintRequired: aPaintEvent
	"Handler for aPaintEvent. 
	This is called whenever the receiver window needs to be completely or partially redrawn."

	| canvas |


	canvas := aPaintEvent canvas.
	self renderOn: canvas for: aPaintEvent paintStruct rcPaint asRectangle!

onViewCreated
	self beActive.
	
!

paintDungeonOn: aCanvas for: damagedArea 
	| gameRect atomicSize |
	gameRect := 1 @ 1 extent: game width @ game height.
	gameRect := gameRect scaleBy: 7 @ 7.
	aCanvas 
		drawEdge: (gameRect expandBy: 2)
		edge: (GdiplusImageView edgeStyleTable at: #sunken)
		grfFlags: 15.
	game rooms do: 
			[:aRoom | 
			self 
				paintRoom: aRoom
				on: aCanvas
				for: damagedArea].
	atomicSize := 7 @ 7.
	game visibleWorld do: 
			[:aGamePoint | 
			| aColor aRectangle |
			aColor := Color gray.
			aGamePoint tile == #wall ifTrue: [aColor := Color darkShadow3d].
			aRectangle := (aGamePoint pos + (1 @ 1) extent: 1 @ 1) scaleBy: atomicSize.
			(aRectangle intersects: damagedArea) ifTrue: [aCanvas fillRectangle: aRectangle color: aColor]]!

paintInventory: aCollection on: aCanvas 
	| yOffset invFont lineHeight itemLabel startingPoint |


	invFont := Font name: 'Arial' pointSize: 12.
	invFont isBold: true.
	
	startingPoint := self inventoryStartingPoint.
	aCanvas
		font: invFont;
		forecolor: Color white;
		text: 'Inventory'
		at: (self pointOffsetFromLlc: startingPoint).
	lineHeight := (invFont pixelSize * 1.1) rounded.
	yOffset := startingPoint y - lineHeight.
	invFont := Font name: 'Arial' pointSize: 12.
	invFont isBold: false.
	lineHeight := (invFont pixelSize * 1.1) rounded.
	itemLabel := $a.
	aCollection do: 
			[:anItem | 
			self showMessage: itemLabel printString , '->' , anItem printString on: aCanvas at: 720 @ yOffset.
			yOffset := yOffset - lineHeight.
			itemLabel := itemLabel + 1].

	displayedItems := aCollection copy.!

paintPlayerOn: aCanvas 
	| color scale rect |
	color := Color darkGreen.
	game player isNil 
		ifTrue: 
			[^self 
				showMessage: 'no one alive'
				on: aCanvas
				at: self displayedStatsStartingPoint].
	game player isDead ifTrue: [color := Color black].
	scale := 7 @ 7.
	game isStarted not ifTrue: [scale := 14 @ 14].
	rect := Rectangle origin: (game player position + (1 @ 1)) * (7 @ 7) extent: scale.
	aCanvas
		pen: (Pen color: color);
		brush: color brush;
		ellipse: rect.
	self 
		showMessage: self statString
		on: aCanvas
		at: self displayedStatsStartingPoint.
	self 
		showMessage: 'KILLS: ' , game player kills printString
		on: aCanvas
		at: self displayedStatsStartingPoint - (0 @ 25).
	displayedStats := self statString.
	displayedKills := game player kills!

paintRoom: aRoom on: aCanvas for: damagedArea
	"aCanvas fillRectangle: (Rectangle center: start extent: self rectangleExtent)
		color: Color green"

	| aRectangle aColor |
	aRectangle := aRoom.
	aRectangle := (aRectangle translateBy: (1@1)) scaleBy: 7@7.
	(damagedArea intersects: aRectangle) ifTrue: [
	aColor := Color gray.
	aCanvas fillRectangle: aRectangle color: aColor]!

paintThingAt: aPoint on: aCanvas color: aColor for: damagedArea
| rect |
rect := (Rectangle origin: (aPoint+(1@1))*(7@7)  extent: 7@7).

(rect intersects: damagedArea) ifTrue: [
	aCanvas
		pen: (Pen color: aColor);
		brush: aColor brush;
		ellipse: (rect)]
!

pointOffsetFromLlc: distance 
"Transcript cr show: (distance x @ (self clientExtent y - distance y)) printString."
^ distance x @ (self clientExtent y - distance y)!

problemWithParser
" -- it's the missing ( in drawEdge that makes the parser ignore the rest of the statement.
renderOn: aCanvas 
	""Private - Render the background image""

	aCanvas backcolor: Color black.
	aCanvas erase.
	gameRect := 0@0 extent: game width@game height.
	aCanvas 
		drawEdge: gameRect expandBy: 2)
		edge: (GdiplusImageView edgeStyleTable at: #sunken)
		grfFlags: 15.

	game rooms do: [:aRoom | self paintRoom: aRoom on: aCanvas].
	self paintPlayerOn: aCanvas.
	game items keysDo: 
			[:aPoint | 
			self 
				paintThingAt: aPoint
				on: aCanvas
				color: Color blue].
	game monsters do: 
			[:aMonster | 
			self 
				paintThingAt: aMonster position
				on: aCanvas
				color: Color red].
	self paintInventory: game player inventory on: aCanvas.
	self showStatusOn: aCanvas.
	game isOver ifTrue: [self showGameOverMessageOn: aCanvas].
	
	aCanvas free	""useful to avoid build up of finalizable garbage"!

render
	"Private - Render the background image"

	| canvas |
	canvas := self canvas.
	self renderOn: canvas for: self canvas clipBox.
	super render!

renderOn: aCanvas for: aRectangle
	"Private - Render the background image"

	
"Transcript cr show: 'invalidated ', aRectangle printString."
	aCanvas backcolor: Color black.
	aCanvas fillRectangle: aRectangle color: aCanvas backcolor .
	"Note that we could use aCanvas clipBox everywhere, but it's quite a bit slower"

	self paintDungeonOn: aCanvas for: aRectangle.
	self paintPlayerOn: aCanvas.
	game items keysDo: 
			[:aPoint | 
			self 
				paintThingAt: aPoint
				on: aCanvas
				color: Color blue
				for: aRectangle].
	game monsters do: 
			[:aMonster | 
			self 
				paintThingAt: aMonster position
				on: aCanvas
				color: Color red
				for: aRectangle].
	(aRectangle intersects: self inventoryRectangle) ifTrue: [
		game player notNil ifTrue: [
			self paintInventory: game player inventory on: aCanvas]].
	self showStatusOn: aCanvas.
	game isOver ifTrue: [self showGameOverMessageOn: aCanvas].
	aCanvas free	"useful to avoid build up of finalizable garbage"!

rest
game tookATurn.
self step.

!

restartWorld
	| oldName |
	oldName := game player name.
	game initialize.
	game player name: oldName.
	self invalidate!

showGameOverMessageOn: aCanvas 
	| f col |
	game player isNil ifTrue: [^self].
	f := Font name: 'Arial' pointSize: 24.
	f isBold: true.
	col := Color red.
	game player hp > 0 ifTrue: [col := Color green].
	aCanvas
		font: f;
		forecolor: col;
		text: 'Game Over!! -- ', game player name, '''s Score: ', game player score printString at: (self pointOffsetFromLlc: 100 @ 300)!

showMessage: aString on: aCanvas at: aPoint

	aCanvas 
		font: (Font name: 'Arial' pointSize: 12);
		forecolor: Color white;
		text:  aString
			at: (self pointOffsetFromLlc: aPoint )!

showStatusOn: aCanvas

	"aCanvas 
		font: (Font name: 'Arial' pointSize: 12);
		forecolor: Color white;
		text: 'Use Down cursor to start, then move player with other cursors'
			at: (self pointOffset: 30@30 fromLlcOf: aCanvas)"
game isStarted 
	ifTrue: [

		self showMessage: game turnsTaken printString on: aCanvas at: 30@30.
		self showMessage: game player score printString on: aCanvas at: 90@30.

 ]
	ifFalse: [
self showMessage: 'Use Down-Arrow to start, then move player with other Arrow keys' on: aCanvas at: 30@30.].

		self showMessage: 'r -> restart game' on: aCanvas at: 720@30.
!

statString
^'HP: ', game player hp printString, '    FURY: ', game player strength printString.!

step
	"really should use that 'dependency' model thing we hear so much about."

	| pixToClear currentTime |
	game isOver ifTrue: [^self invalidate].
	self invalidateRect: (Rectangle center: (game player position + 1) * 7 extent: 28 @ 28) erase: false.
	currentTime := Time now asMilliseconds.
	currentTime - lastTurnUpdateTime > 1500 
		ifTrue: 
			[pixToClear := 120.
			game turnsTaken == 1 ifTrue: [pixToClear := 600].
			self invalidateRect: (Rectangle origin: (self pointOffsetFromLlc: 30 @ 30) extent: pixToClear @ 30)
				erase: true.
			lastTurnUpdateTime := currentTime].
	(displayedStats ~= self statString or: [displayedKills ~~ game player kills]) 
		ifTrue: 
			[self invalidateRect: (Rectangle origin: (self pointOffsetFromLlc: self displayedStatsStartingPoint)
						extent: 170 @ 90)
				erase: false].
	displayedItems = game player inventory 
		ifFalse: [self invalidateRect: self inventoryRectangle erase: false]!

useItem

game player useItem.
self step.

!

wmGetDlgCode: message wParam: wParam lParam: aMSGAddress 
	"Private - Low-level handler for a WM_GETDLGCODE sent by Windows to determine what
	input a particular window would like (usually when the window receivers focus).
	The lParam is a pointer to the MSG that may be sent depending on the response.
	The answer should be some combination of DLGC_XXXX flags (e.g. DLGC_WANTARROWS |
	DLGC_WANTTAB)."

"be my own presenter"
	^self onInputMaskRequired: (WindowsEvent 
				handle: handle
				message: message
				wParam: wParam
				lParam: aMSGAddress)! !
!HackView categoriesFor: #defaultExtent!public! !
!HackView categoriesFor: #defaultWindowProcessing:wParam:lParam:!private! !
!HackView categoriesFor: #displayedStatsStartingPoint!operations!private! !
!HackView categoriesFor: #dropItem!event handling!public! !
!HackView categoriesFor: #game!displaying!private! !
!HackView categoriesFor: #game:!displaying!private! !
!HackView categoriesFor: #initialize!event handling!private! !
!HackView categoriesFor: #inspectRoom!event handling!public! !
!HackView categoriesFor: #inventoryRectangle!operations!private! !
!HackView categoriesFor: #inventoryStartingPoint!displaying!private! !
!HackView categoriesFor: #moveDir:!event handling!private! !
!HackView categoriesFor: #moveDown!event handling!public! !
!HackView categoriesFor: #moveLeft!event handling!public! !
!HackView categoriesFor: #moveRight!event handling!public! !
!HackView categoriesFor: #moveUp!event handling!public! !
!HackView categoriesFor: #onInputMaskRequired:!private! !
!HackView categoriesFor: #onKeyPressed:!event handling!private! !
!HackView categoriesFor: #onPaintRequired:!operations!private! !
!HackView categoriesFor: #onViewCreated!event handling!private! !
!HackView categoriesFor: #paintDungeonOn:for:!displaying!private! !
!HackView categoriesFor: #paintInventory:on:!displaying!private! !
!HackView categoriesFor: #paintPlayerOn:!displaying!private! !
!HackView categoriesFor: #paintRoom:on:for:!displaying!private! !
!HackView categoriesFor: #paintThingAt:on:color:for:!displaying!private! !
!HackView categoriesFor: #pointOffsetFromLlc:!displaying!private! !
!HackView categoriesFor: #problemWithParser!operations!private! !
!HackView categoriesFor: #render!operations!private! !
!HackView categoriesFor: #renderOn:for:!operations!private! !
!HackView categoriesFor: #rest!event handling!public! !
!HackView categoriesFor: #restartWorld!event handling!public! !
!HackView categoriesFor: #showGameOverMessageOn:!public! !
!HackView categoriesFor: #showMessage:on:at:!displaying!private! !
!HackView categoriesFor: #showStatusOn:!displaying!private! !
!HackView categoriesFor: #statString!operations!private! !
!HackView categoriesFor: #step!operations!private! !
!HackView categoriesFor: #useItem!event handling!public! !
!HackView categoriesFor: #wmGetDlgCode:wParam:lParam:!private! !

!HackView class methodsFor!

displayString 
^'Not NetHack'!

icon
	^Icon fromId: 251 in: ShellLibrary default!

on: aGame 
	"Answer and show an instance of the receiver"

	| v |
	v := self new.
	v game: aGame.
	v showShell.
	v topShell text: self displayString, ' for ',  aGame player name.
	^v !

onStartup
super onStartup.

self allInstances do: [:hv | hv game initialize. hv invalidate]!

show
| n hv |
n := Prompter prompt: 'name'.
n isNil ifTrue:[n := 'Lazy'].
	hv := self on: (Hack newFor: n).

^hv!

showFor: aName
|  hv |

	hv := self on: (Hack newFor: aName).

^hv! !
!HackView class categoriesFor: #displayString!public! !
!HackView class categoriesFor: #icon!public! !
!HackView class categoriesFor: #on:!public! !
!HackView class categoriesFor: #onStartup!public! !
!HackView class categoriesFor: #show!public! !
!HackView class categoriesFor: #showFor:!public! !

"Binary Globals"!

