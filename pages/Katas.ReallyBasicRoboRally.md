---
title: Katas.ReallyBasicRoboRally
---
# Overview
[[@http://en.wikipedia.org/wiki/RoboRally|Robo Rally]] is a board game from the '90 where you are pitted against a number of other players and obstacles. The goal is to move from one place to a number of other places, identified by flags, while dealing with moving floors, damage from the world and other players and having a limited number of moves from which to pick.

# Basic Game Play
There is a playing board with a number of locations. The original game had a number of same-sized board, which could be connected on any end. So the fully laid out playing area need not be a square. For our purposes it will be.

Each location on the board may have an effect, e.g. move the player in any direction, a number of locations (typically 1 to 3), rotate the player, do damage to the player. A location could have walls, which would disallow movement in a direction. Those walls might be up or down depending on which "step" in a turn you are on.

At the beginning of a round, each player is given a number of cards, up to 9, though the number of cards is reduced by 1 for each point of damage the player is carrying. Those cards have two characteristics: action, priority. The priority is a number and it is used to determine within a step, which player goes first, second, etc. The action could be a number of things such as: move 1, move 2, move 3 spaces in the direction facing. Move 1, 2, or 3 backwards. Rotate 90, 180, 270 or even 360 degrees. Each player is given a limited amount of time to "program" up to 5 cards.

Each round consists of 5 steps. For each step, find the player with the highest-priority card and perform that action. Continue for each of the players. Next, apply board actions. Those board actions are in priority groups, e.g, conveyor belts first, push-walls second, lasers third.

When a player moves, it might interact with the world:
* it might run into another robot, in which case it pushes it in the direction of movement
* it might run into a wall, in which case it doesn't move for that turn
* it might fall into a pit or off the edge of the world

# At the beginning
All robots start on the same location and are "virtual". A robot remains virtual until it solely occupies a location at the end of a turn, whereupon it becomes real. When it is real, it interacts with other robots. When it is virtual, it does not. Virtual robots can take damage and they do interact with the location effects.

# Damage
Robots have 9 health to begin with. As robots take damage, their health goes down. This is important because:
* A player with 0 health dies and goes back to the last save point (either the start or most recent flag touched)
* A player gets a number of programming cards equal to their healt
* If a player has less than 5 health at the end of a round, the player must lock in programming steps from the end of their current program. Those steps remain fixed until the player heals (or dies and comes back with full health).
* A player can die 2 times. Upon the third death, they are out of the game.
* A player can choose to "shutdown" for a full round. If this happens, a player does not move but it still interacts with the floor and other players. At the end of a round where a player shutdown, it heals one point.

# There is so much more...
But this is more than enough to have plenty to work on. I recommend you create a board and handle basic movement first. Then interaction with the world and move on to damage.
