This example uses the game [[http://www.hasbro.com/monopoly/|Monopoly]] as the basis for learning Object Oriented Design following both a [[Test Driven Development]] approach as well as a [[Test First Development]] approach. In this example we only use the game as a basis but change the rules as necessary to emphasize certain kinds of design problems.

This problem is different from the [[RPN Calculator]] in that we do not start with user stories but rather a description of each release. In a classroom setting, we'd start each release with a user story workshop to determine possible work. We'd then sequence the user stories and being implemented the user stories.

[[#Release1]]
# Release 1: Basic Board and Player Movement
[[include page="Monopoly(r) Release 1 Theme Description"]]

[[Monopoly(r) Release 1 User Stories|User Stories]]

----

[[#Release2]]
# Release 2: Go, Go To Jail, Income Tax, Luxury Tax
When a player lands on go, they receive $200. When a player passes go, they receive $200. Note they get the money at the time they land on or pass over go, not the next turn. The do not get any money for leaving go (e.g. during the first turn or if they landed on go the previous turn).

When a player lands on go to jail, they are moved directly to "Just Visiting". They do not receive any money for passing go since they went directly to just visiting. Note that we are making this simple for now, we deal with the details of jail later.

When a player lands on Income Tax, they must pay 20% of their net worth or $200, whichever is the smaller amount (a simplified version of the rule).

When a player lands on luxury tax, they must pay $75.

[[Monopoly(r) Release 2 User Stories|User Stories]]

----

[[#Release3]]
# Release 3: Real Estate
Players can purchase railroads, utilities and Properties. When a player lands on unowned real estate, they immediately purchase it and the price is deducted from their balance (you can allow the player's balance to go below 0 or you can cancel the purchase if they cannot afford it).

When a player lands on an owned real estate, they must pay rent equal to the rent amount to the owner (assuming they are not the owner). 

When a player lands on a mortgaged property, nothing happens.

A player has the option of mortgaging a property or paying off the mortgage of a property at the beginning of their turn or at the end of their turn.

Properties: If a player owns all of the properties in a color group, the rent doubles. 

Utilities: If only one utility is owned, then rent is equal to 4 times the value currently shown on the dice. If both utilities are owned (not necessarily by the same person), then rent is equal to 10 times the value currently shown on the dice.

Railroads: If a player owns one railroad, rent is $25. If a player owns two, rent is $50, 3 is $100 and 4 is $200.

## Optional
If a player rolls doubles, they get to continue their turn and roll again. If they roll doubles three times in a row, they go directly to jail immediately after rolling doubles a third time.

[[Monopoly(r) Release 3 User Stories|User Stories]]

----

[[#Release4]]
# Release 4: Jail
A player can land in jail when:
# S/he lands on "go To Jail"
# S/he draws a "Go To Jail" card
# Throws doubles three times in a row

When a player goes to jail, s/he does not collect $200 for passing go since s/he moves directly to jail.

A player can get out of jail in any of the following ways:
# By throwing Doubles on any of the next three turns after landing in Jail. If the player rolls doubles but does not pay (or use a get out of jail free card), then the player moves forward the number of locations indicated by the dice but does not continue rolling the dice.
# By using a "Get out of Jail Free" card from another player. (A player can purchase a "Get out of Jail Free" card from another player.
# By paying a $50 fine before throwing the dice, in which case the player is no "Just Visiting"

If a player is still in jail after rolling dice (and not paying a fine) on the third turn, they must pay $50 and moves ahead the number of locations shown on the dice.

[[Monopoly(r) Release 4 User Stories|User Stories]]

----

[[#Release5]]
# Release 5: Community Chest and Chance
Community chest and chance each have a single stack of cards. There is one stack of cards shared by all community chest locations and one stack of cards shared by all chance locations. The order of the cards is initially determined randomly. Once determined, the order remains the same (this iteration skips the get out of jail free card).

When a player lands on either of these locations, the next card (from the top of the deck) is removed, the player must follow the instructions on the card. The card is the placed back onto the deck at the bottom.

There are several kinds of community chest and chance cards. To find out more, see:
* [[http://en.wikipedia.org/wiki/Chance_cards|List of Chance Cards]]
* [[http://en.wikipedia.org/wiki/Community_Chest_cards|List of Community Chest Cards]]

[[Monopoly(r) Release 5 User Stories|User Stories]]
