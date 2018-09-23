| package |
package := Package name: '0AtmSystem'.
package paxVersion: 1;
	basicComment: 'I assert no warranties on my original material.
The copyright on the original work is at: http://www.creativecommons.org/licenses/by-sa/2.5.
dnunn0@yahoo.com
Home: http://schuchert.wikispaces.com/  [I''m using a friend''s wiki to store this].

The code mimics the client code for an ATM. It is purposely ugly.

Here''s some workspace code to test this out:

1. Open a server
server := AtmServer newAt: 10001.
server open.

2. Run the client

atm := AtmClient new.
result := atm withdrawFrom: ''123'' amount: 400.
result ifFalse: [result halt]


Note that like all real test servers, the AtmServer is not reliable and the withdrawFrom:amount: method fails often.'.


package classNames
	add: #AtmClient;
	add: #AtmServer;
	add: #AtmServerTest;
	add: #Bank;
	add: #BankProcessingResponseCode;
	add: #BankTest;
	add: #NullListenSocket;
	yourself.

package binaryGlobalNames: (Set new
	yourself).

package globalAliases: (Set new
	yourself).

package setPrerequisites: (IdentitySet new
	add: '..\Object Arts\Dolphin\Base\Dolphin';
	add: '..\Object Arts\Dolphin\Sockets\Dolphin Sockets';
	add: '..\Camp Smalltalk\SUnit\SUnit';
	yourself).

package!

"Class Definitions"!

Object subclass: #AtmClient
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #AtmServer
	instanceVariableNames: 'listenSocket port mutex bank'
	classVariableNames: 'FailureChance'
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #Bank
	instanceVariableNames: 'accountBalance'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #BankProcessingResponseCode
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
Object subclass: #NullListenSocket
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
TestCase subclass: #AtmServerTest
	instanceVariableNames: 'server'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!
TestCase subclass: #BankTest
	instanceVariableNames: 'bank'
	classVariableNames: ''
	poolDictionaries: ''
	classInstanceVariableNames: ''!

"Global Aliases"!


"Loose Methods"!

"End of package definition"!

"Source Globals"!

"Classes"!

AtmClient guid: (GUID fromString: '{51A7B40F-2F9F-476A-B5F0-0213FBB92FE7}')!
AtmClient comment: 'Here''s some workspace code to test this out:

1. Open a server
server := AtmServer newAt: 10001.
server open.

2. Run the client

atm := AtmClient new.
result := atm withdrawFrom: ''123'' amount: 400.
result ifFalse: [result halt]


Note that like all real test servers, the AtmServer is not reliable and the withdrawFrom:amount: method fails often.'!
!AtmClient categoriesForClass!Unclassified! !
!AtmClient methodsFor!

withdrawFrom: aStringToken amount: anInteger 
| kk nmsg bar |
[ kk := Socket2 port:10001 host: '127.0.0.1' .
kk connect.
kk isText: true.
nmsg := 'ATM0001|', aStringToken
			, '|1|W|' , anInteger printString, '|'.
1 to: nmsg size do: [:index |  | ch |
	ch := nmsg at: index.
	 nmsg at: index put: (Character value: (ch asInteger + 13 )).
	].

nmsg := nmsg , (String with: Character cr).
kk send: nmsg asByteArray.
bar := kk receiveByte.
] ensure: [kk close].

^'0' = bar asCharacter asString
! !
!AtmClient categoriesFor: #withdrawFrom:amount:!public! !

AtmServer guid: (GUID fromString: '{DEEC0168-8A12-4F83-A17A-8C5DF13C98F7}')!
AtmServer comment: 'The code supplies some code for an ATM server that knows how to respond to withdraw requests in a particular encrypted format.

The server opens a listen socket on port 10000 if you execute:
 
   server := AtmServer newAt: 10000.
   server open

Also, to help simulate the unpredictable nature of developing in distributed environments, opening the server in port 10001 will, after a suitable delay, fail 50% of the time for no good reason (other than: that is how it seems when I rely on other systems to work!!). '!
!AtmServer categoriesForClass!Unclassified! !
!AtmServer methodsFor!

acceptRequests
	| serverSocket |
	Transcript
		cr;
		show: 'Server ready!!'.
	[true] whileTrue: 
			[serverSocket := [self listenSocket accept] on: SocketError
						do: 
							[:ex | 
							Transcript
								cr;
								show: 'ATM SERVER: Accept failed, Listen Socket closed?'.
							^nil].
			serverSocket notNil ifTrue: [[self respondToClient: serverSocket] ensure: [serverSocket close]]]!

close
	mutex critical: 
			[listenSocket ifNil: [^self].
			listenSocket close.
			listenSocket := nil]!

initializeAtPort: anInteger

mutex := Mutex new.
bank := Bank new.
port := anInteger!

isDevelopmentServer
	^self port == self class developmentPort!

isOpen
	mutex critical: 
			[listenSocket ifNil: [^false].
			^listenSocket isOpen]!

listenSocket

mutex critical: [
	listenSocket ifNil: [^NullListenSocket new].
	^listenSocket
]!

open
	listenSocket := ServerSocket2 port: port.
	
	[self acceptRequests] fork!

port 
^port!

respondToClient: serverSocket 
	| inputMessage rs result |
	self isDevelopmentServer 
		ifTrue: 
			[(Delay forMilliseconds: 1000) wait.
			self shouldRandomlyFail ifTrue: [^nil]].
	serverSocket isText: true.
	rs := serverSocket readStream.
	inputMessage := rs upTo: Character cr.
	Transcript
		cr;
		show: 'RCVD: "' , inputMessage asString , '"'.
	result := bank execute: inputMessage.
	serverSocket send: result!

shouldRandomlyFail
| rnd |
FailureChance ifNil: [
	FailureChance := Random new.
].

rnd := FailureChance next.

^rnd >= 0.5 
		! !
!AtmServer categoriesFor: #acceptRequests!public! !
!AtmServer categoriesFor: #close!public! !
!AtmServer categoriesFor: #initializeAtPort:!public! !
!AtmServer categoriesFor: #isDevelopmentServer!public! !
!AtmServer categoriesFor: #isOpen!public! !
!AtmServer categoriesFor: #listenSocket!public! !
!AtmServer categoriesFor: #open!public! !
!AtmServer categoriesFor: #port!public! !
!AtmServer categoriesFor: #respondToClient:!public! !
!AtmServer categoriesFor: #shouldRandomlyFail!public! !

!AtmServer class methodsFor!

developmentPort
	"This is the port on which Bad Things Happen [delays and random failures]."

	^10001!

newAt: port

^self new initializeAtPort: port! !
!AtmServer class categoriesFor: #developmentPort!public! !
!AtmServer class categoriesFor: #newAt:!public! !

Bank guid: (GUID fromString: '{56E47734-B4D0-440E-8792-FC3BE72DC2BA}')!
Bank comment: ''!
!Bank categoriesForClass!Unclassified! !
!Bank methodsFor!

accountBalance
^accountBalance!

decrypt: aString

| dMsgStream |
dMsgStream := String writeStream: aString size.
aString do: [:ch|  
	dMsgStream nextPut:  (Character value: (ch asInteger - 13 )).
	].
^dMsgStream contents!

execute: aMessageString
"respond to aMessageString, which should be in the format: ATM id> | <token> | <retry #> | CommandLetter | amount | .
My answer is a response code:
	'3' = I couldn't undestand / process the message
	'2' = I don't know the command
	'0' = Command processed successfully.
	other characters are up to the specific command.
"

|substrings action |

[
substrings := self parse: aMessageString.
substrings size ~= 5 ifTrue: [^BankProcessingResponseCode  couldNotProcessRequestError ].
action := substrings at: 4.

action = 'W' ifTrue: [ ^self processWithdraw: substrings].

] on: Exception
do: [:ex | Transcript cr; show: 'Server Exception: ', ex printString.
^BankProcessingResponseCode couldNotProcessRequestError ].
^BankProcessingResponseCode unknownCommandError!

initialize

accountBalance := 900.!

parse: aMessageString
|msg subStrings|

msg := self decrypt: aMessageString.
subStrings := msg subStrings: $|.

^ subStrings !

processWithdraw: substrings 
	| amount |
	amount := (substrings at: 5) asNumber.
	amount < 0 ifTrue: [^'1'].
	accountBalance < amount ifTrue: [^'1'].
	accountBalance := accountBalance - amount.
	^'0'! !
!Bank categoriesFor: #accountBalance!public! !
!Bank categoriesFor: #decrypt:!public! !
!Bank categoriesFor: #execute:!public! !
!Bank categoriesFor: #initialize!public! !
!Bank categoriesFor: #parse:!public! !
!Bank categoriesFor: #processWithdraw:!public! !

!Bank class methodsFor!

new 
^super new initialize! !
!Bank class categoriesFor: #new!public! !

BankProcessingResponseCode guid: (GUID fromString: '{FED1B6AA-2491-45A1-90AC-08D9EF6E86FC}')!
BankProcessingResponseCode comment: ''!
!BankProcessingResponseCode categoriesForClass!Unclassified! !
!BankProcessingResponseCode class methodsFor!

couldNotProcessRequestError
^'3'!

noError
^'0'!

success
^'0'!

unknownCommandError
^'2'! !
!BankProcessingResponseCode class categoriesFor: #couldNotProcessRequestError!public! !
!BankProcessingResponseCode class categoriesFor: #noError!public! !
!BankProcessingResponseCode class categoriesFor: #success!public! !
!BankProcessingResponseCode class categoriesFor: #unknownCommandError!public! !

NullListenSocket guid: (GUID fromString: '{FED5B937-2D3E-409C-9A34-59C7CA72E8E2}')!
NullListenSocket comment: ''!
!NullListenSocket categoriesForClass!Unclassified! !
!NullListenSocket methodsFor!

accept
SocketError signal! !
!NullListenSocket categoriesFor: #accept!public! !

AtmServerTest guid: (GUID fromString: '{B1494E76-8D8A-40E2-8B23-4DF999B0631E}')!
AtmServerTest comment: ''!
!AtmServerTest categoriesForClass!Unclassified! !
!AtmServerTest methodsFor!

setUp

server := AtmServer newAt: AtmServer developmentPort +1.
server open.
!

tearDown

server close!

testCloseAfterClose

server close.
server close.
self assert: false equals: server isOpen!

testIsOpen

	self assert: true equals: server isOpen!

testIsOpenAfterClose

server close.
self assert: false equals: server isOpen!

testOpen
	| clientSocket reply |
	clientSocket := Socket2 port: server port host: '127.0.0.1'.
	reply := 
			[| msg |
			clientSocket connect.
			clientSocket isText: true.
			msg := 'NaZ===>‰aeNRd>gEEZX‰>‰d‰A==‰' , (String with: Character cr).
			clientSocket send: msg.
			clientSocket readStream next asString] 
					ensure: [clientSocket close].
	self assert: BankProcessingResponseCode success equals: reply! !
!AtmServerTest categoriesFor: #setUp!public!Running! !
!AtmServerTest categoriesFor: #tearDown!public!Running! !
!AtmServerTest categoriesFor: #testCloseAfterClose!public! !
!AtmServerTest categoriesFor: #testIsOpen!public! !
!AtmServerTest categoriesFor: #testIsOpenAfterClose!public! !
!AtmServerTest categoriesFor: #testOpen!public! !

BankTest guid: (GUID fromString: '{F8EE8584-361C-42D8-9113-FE0FDF0FCF10}')!
BankTest comment: ''!
!BankTest categoriesForClass!Unclassified! !
!BankTest methodsFor!

setUp
bank := Bank new.!

testDecrypt

|  reply |

reply := bank decrypt: 'N'.
self assert: 'A' equals: reply. 

reply := bank decrypt: 'd'.
self assert: 'W' equals: reply!

testInvalidRequest

|  reply origBalance |
origBalance := bank accountBalance.
reply := bank execute: 'ATM‰Token‰Retry‰e‰'.
self assert: BankProcessingResponseCode couldNotProcessRequestError equals: reply.
self assert: origBalance equals: bank accountBalance!

testUnknownRequest

|  reply origBalance |
origBalance := bank accountBalance.
reply := bank execute: 'ATM‰Token‰Retry‰e‰amount‰'.
self assert: BankProcessingResponseCode unknownCommandError  equals: reply.
self assert: origBalance equals: bank accountBalance!

testWithdrawNegative

| reply origBalance |
origBalance := bank accountBalance.
reply := bank execute: 'NaZ===>‰>?@‰>‰d‰:A==‰'.
self assert: '1' equals: reply.
self assert: origBalance  equals: bank accountBalance!

testWithdrawNonnumericRequest

| reply origBalance |
origBalance := bank accountBalance.
reply := bank execute: 'NaZ===>‰aeNRd>gEEZX‰>‰d‰Aae‰'.
self assert: BankProcessingResponseCode couldNotProcessRequestError equals: reply.
self assert: origBalance equals: bank accountBalance!

testWithdrawRequest

| reply origBalance |
origBalance := bank accountBalance.
reply := bank execute: 'NaZ===>‰aeNRd>gEEZX‰>‰d‰A==‰'.
self assert: BankProcessingResponseCode success equals: reply.
self assert: origBalance-400 equals: bank accountBalance!

testWithdrawTooMuchRequest

| reply origBalance |
reply := bank execute: 'NaZ===>‰aeNRd>gEEZX‰>‰d‰A==‰'.
reply := bank execute: 'NaZ===>‰aeNRd>gEEZX‰>‰d‰A==‰'.
origBalance := bank accountBalance.
reply := bank execute: 'NaZ===>‰aeNRd>gEEZX‰>‰d‰A==‰'.
self assert: '1' equals: reply.
self assert: origBalance equals: bank accountBalance! !
!BankTest categoriesFor: #setUp!public!Running! !
!BankTest categoriesFor: #testDecrypt!public! !
!BankTest categoriesFor: #testInvalidRequest!public! !
!BankTest categoriesFor: #testUnknownRequest!public! !
!BankTest categoriesFor: #testWithdrawNegative!public! !
!BankTest categoriesFor: #testWithdrawNonnumericRequest!public! !
!BankTest categoriesFor: #testWithdrawRequest!public! !
!BankTest categoriesFor: #testWithdrawTooMuchRequest!public! !

"Binary Globals"!

