---
title: Monopoly_Release_3_Player_Rolls_Doubles
---
As a Player, I can roll doubles and continue my turn, landing on new Locations.

### User Acceptance Tests
* During a turn, Player starts on Go, roles doubles (6) and then non-doubles of 4. Final Location is 10. The player landed on a total of two locations.
* During a turn, Player does not roll doubles. Only moves equal single roll value. The player only lands on one Location.
* During a turn, Player rolls doubles twice, they move for a total of 3 roll values and land on a total of three locations.
* During a turn, Player rolls doubles three times, they end up on Just Visiting.

### Questions
For each of these tests, there could be several side effects:
* Player might buy property,
* Player might pay rent,
* Player might land on Go To Jail, etc.
Do you think we need to include these conditions in these test? Why or why not?

{% include nav prev="Monopoly_Release_3_User_Stories" %}