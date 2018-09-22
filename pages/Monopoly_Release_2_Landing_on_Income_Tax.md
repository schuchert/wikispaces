---
title: Monopoly_Release_2_Landing_on_Income_Tax
---
As a Player, landing on Income Tax forces me to pay the smaller of 10% of my total worth or $200.

### User Acceptance Tests
* During a turn, a Player with an initial total worth of $1800 lands on Income Tax. The balance decreases by $180.
* During a turn, a Player with an initial total worth of $2200 lands on Income Tax. The balance decreases by $200.
* During a turn, a Player with an initial total worth of $0 lands on Income Tax. The balance decreases by $0.
* During a turn, a Player with an initial total worth of $2000 lands on Income Tax. The balance decreases by $200.
* During a turn, a Player passes over Income Tax. Nothing happens.

{% include nav prev="Monopoly_Release_2_User_Stories" %}