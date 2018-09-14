---
title: Team_Jeopardy_User_Stories
---
## Must haves
----
### For the MC 
**As an MC, I can create a game that players can join.**
* Any number of players can join while the game is accepting players.
* No new players may join after the game is started.
** Nice to have if you can get it
* An existing player can rejoin if they need to reconnect to the game.

**As an MC, I can start the game.**
* I can start the game with at least one player
* When the game is started, one of the players is randomly selected as the current player

**As an MC, I can indicate a player got the question correct or incorrect.**
* An answer-question must be selected and a player must have taken it
* If correct and the time is not up, the player gets the points
* If incorrect or the time is up, the player loses the points
* If points awarded, player selected becomes current player
* If points not awarded, current player remains unchanged.

**As an MC, I can indicate that players are not going to take the answer.**
* An answer-question must be selected and a player must not have taken it.

**As an MC, I can review the existing list of categories and dollar amounts.**

**As an MC, I can complete the game ahead of finishing all answer-questions.**

----

### For the Player 
**As a player, I can join a game that has not yet started.**
* I am uniquely identified via my name
* Two players cannot have the same name
* Once the game has started, a player with a name can only restart if their connection is lost

**As the current player, I can select a category and dollar amount.**
* There must still be available questions.
* The selected category and amount must be available.
* The timer for the question begins immediately.
* All players must be informed of the category, amount and answer.

**As a player, I can take an answer that's been selected.**
* No other players can have the question for me to receive it

**As a player, I can take a question that another player answered incorrectly.**
* The MC must have indicated an incorrect response
* Overall time for a given answer must not have expired.

----

### From the game 
**As the game, I am able to broadcast the just-selected category, dollar-amount, and answer to all players.**

----

## Nice to haves
**As a player, I can join a game that I was already a member of in case of a crash.**
**As the game, I can indicate that the current answer-question has timed out.**
**Research a "fair" way to select who took an answer-question first.**
