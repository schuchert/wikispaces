| package |
package := Package name: '0PackageBrowserFixCommunityEdition'.
package paxVersion: 1;
	basicComment: 'Dolphin Smalltalk (Community Edition) Test Environment Enhancements 
I assert no warranties on my original material.
The copyright on the original work is at: http://www.creativecommons.org/licenses/by-sa/2.5.
dnunn0@yahoo.com
Home: http://schuchert.wikispaces.com/  [I''m using a friend''s wiki to store this].

This small package adds the method

Behavior>>methodFor:

This method is called from the Package Browser in the Test menu, but is not in the community edition. '.


package methodNames
	add: #Behavior -> #methodFor:;
	yourself.

package binaryGlobalNames: (Set new
	yourself).

package globalAliases: (Set new
	yourself).

package setPrerequisites: (IdentitySet new
	add: 'Object Arts\Dolphin\Base\Dolphin';
	yourself).

package!

"Class Definitions"!


"Global Aliases"!


"Loose Methods"!

!Behavior methodsFor!

methodFor: aSymbol
"Make it so that the PackageBrowser's Tests menu works. It calls this method instead of compiledMethodAt: for an unknown reason."

^ self compiledMethodAt: aSymbol
	
! !
!Behavior categoriesFor: #methodFor:!methods-accessing!public! !

"End of package definition"!

"Source Globals"!

"Classes"!

"Binary Globals"!

