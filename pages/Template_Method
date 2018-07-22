# Template Method Pattern
This is an example of the [[http://en.wikipedia.org/wiki/Design_Patterns|GoF design pattern]] [[http://en.wikipedia.org/wiki/Template_method_pattern|Template Method]]. Here's an example taken from [[http://en.wikipedia.org/wiki/Monopoly_(game)|Monopoly]].

Imagine the game of Monopoly. There are several kinds of (read this as classes of) squares, e.g. Go, Go To Jail, Free Parking, Real Estate. Under Real Estate there are three kinds:
* Railroads
* Utilities
* Property

Here's an algorithm for what happens when the current player lands on a square: 
```
public void landOn(Player p) {
   if(isOwnedBy(p) || isMortgaged()) {
      // player does not pay itself
      // rent not collected if mortgaged
      return;
   }

   if(isOwned()) {
      int rent = calculateRent();
      p.payPlayer(this, rent);
   } else {
      // offer myself for sale to p
   }
}
```

How do you calculate rent? Here are the three ways you calculate rent:
||Type||Algorithm||
||Railroad||25 * number of railroads owned by same player||
||Utility||4 * current dice roll if only one owned or 10 * current dice roll if both are owned (contrary to popular belief, both do not have to be owned by the same player to get 10X and you do not re-roll the dice either)||
||Property||Some base value modified by houses or hotels on the property||

Notice that the rules for landing are the same:
# If the {railroad, utility, property} is mortgaged or owned by the current player do nothing
# If the {railroad, utility, property} is owned, then (because of the first check) the current player owes money to the owner
# If the {railroad, utility, property} is not owned, then the current player has the option of buying it

The only step that varies is the calculation of the rent. So we create an abstract base class, called Real Estate, that implements the landOn method AND has one abstract method:
```
protected int calculateRent();
```

We then write three derived classes, Railroad, Utility, Property, that each implement calculate rent:
**Railroad**
```
class Railroad extends RealEstate {
   protected int calculateRent() {
      Player owner = getOwner();
      PropertyGroup group = getPropertyGroup();
      int numberOwnedBySamePlayer = group.calculateNmberOwnedBy(owner);
      return 25 * numberOwnedBySamePlayer;
   }
}
```
**Utility**
```
class Utility extends RealEstate {
   protected int calculateRent() {
      Dice dice = getDice();
      int currentRollValue = dice.getValue();
      PropertyGroup group = getPropertyGroup();
      int numberOwned = group.getNumberOwned();

      int rentMultiplier = 4;
      if(numberOwned == 2) {
         rentMultiplier = 10;
      }
      return rentMultiplier * currentRollValue;
   }
}
```
**Property**
```
class Property extends RealEstate {
   protected int calculateRent() {
      int baseRent = getBaseRent();
      int houses = getNumberOfHouses();
      // calcualte actual rent value using baseRent and houses
      return calculateActualRent(baseRent, houses);
   }
}
```

So when a player lands on any kind of RealEstate square, the landOn method in RealEstate performs some basic checks that are true for all kinds of RealEstate types. It then polymorphically the {railroad, utility, property} to calculate the rent, if appropriate, and charges the rent to the current player.
