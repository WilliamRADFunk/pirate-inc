# Pirates Incorporated
(In Progress) Become a pirate captain and manage your fleet to fight and score plunder.</br></br>

***

## Intro

Your a new pirate captain. You must manage your crew, your ships, hire officers, avoid mutiny, attack merchant vessels, steal booty, avoid capture, become famous, and much more in this pirate captain simulator.</br></br>

***

## Instructions

Do stuff

***

## Endgame

Steal booty. Don't die. Retire rich or die famous.

***

## First Steps

1. Navigate to the root folder where you want your project to reside.</br></br>

2. Run `git clone https://github.com/WilliamRADFunk/pirates-inc.git`.</br></br>

3. Run `npm install`. If failure, see Common Gotchas section below.</br></br>

4. Run `npm run start` and then simply navigate to `http://localhost:3000` in your browser (should open on it's own in a few seconds).</br></br>

## Remaining TODOs

### General

:white_check_mark: Create start menu with start, load, change difficulty, and help buttons.

:white_check_mark: Pair start button with transition to the intro screen.

:white_check_mark: Load button creates control to receive and validate a load code.

:black_square_button: Create and implement algorithm that decrypts load code into a current game.

:white_check_mark: Change difficulty button has the four difficulty options that translate to a stored difficulty value.

:white_check_mark: Control that allows player to choose the help topic of their choice and switch text to that value.

:black_square_button: Add the various help descriptions inside the help section.

:black_square_button: Create a bounty system that increases with amount plundered. Stolen ships spikes a bounty. A hire level of infamy also increases bounty. The higher the bounty, the greater the chance that player will encounter a pirate hunter fleet, or be captured in a non-pirate town.

:black_square_button: Create an infamy system. The more death and destruction you create, the higher your infamy. Royal pardons can reduce a bounty, but not your infamy. Suffering defeats on the other hand lowers infamy as you appear less of a threat.

:black_square_button: Create HUD with basic info for player.

:black_square_button: Add stats selection screen after the intro but before starting. From here the player can distribute skill points as they see fit. Amount of points to distribute will be affected by difficulty chosen. (Iron, Cunning, Silver Tongue, People Person, Energetic).

:black_square_button: ...

### Ships

:white_check_mark: Create the different possible ship types and their starting stats.

:black_square_button: Create fleet object that stores all ships in a group, both for player and for encountered enemies as single place to run calculations during maintenance and fighting.

:black_square_button: ....

### Ports

:black_square_button: Define which ports will have a shipyard, and of those which will be willing to buy and sell. Repair and outfitting are the base activities of a shipyard.

:black_square_button: Define a system where the size of a port determines what kind of ships will be available for sale, and which they're willing to buy. Same system will determine how the additional cost modifier for that port.

:black_square_button: Create a randomizer to reshuffle what's available and for how much every time player visits that port.

:black_square_button: Setup each port to buy player's stolen goods, but some goods will be worth more than others depending on the port. The more of a given loot sold at a port will reduce amount paid for subsequent units as a market saturation issue.

:black_square_button: ...

### Tavern

:black_square_button: Create ability to buy certain artifacts that boost some stats (crew morale, refresh AC, etc.).

:black_square_button: Create randomizer to make officers available for hiring. Their name and stats to be affected by the port, and the player's infamy/bounty. Better officers cost more. Not all ports will have all officer types all the time.

:black_square_button: Create ability to fire specific officers. Once fired, they will only be available for rehire if there was no officer of that type at the tavern already. Once player leaves port, those officers are permanently gone.

:black_square_button: Buy round of booze for your entire crew (price depends on amount of crew).

:black_square_button: Hire crew either as a bulk purchase (bigger ports will have more than smaller), or one by one.

:black_square_button: Fire flagged crew.

:black_square_button: Buy provisions functionality, and let the quartermaster distribute it across your fleet.

### Colonial Office

:black_square_button: Bribe officials functionality that (for a price) will lower things like bounty, infamy, and decrease chance of capture at that port for that turn.

:black_square_button: Functionality for player can pay his own bounty to remove it. This will not lower infamy though. Next offense will bring infamy back into bounty equation.

:black_square_button: Add functionality to buy Writ of Protection. This is a document barring arrest in that port for x number of turns (expensive).

### Bungalow

:black_square_button: Add functionality to spend AC to research possible missions (gather intel).

:black_square_button: Add functionality to determine threat levels of pirate hunter fleets in given sectors.

:black_square_button: Create a ship manifest option that allows user to inspect properties of an individual ship, or the sum for properties of all their ships.

:black_square_button: Create a flagging system that will carry over to the shipyard to highlight ships to outfit, sell, repair, etc..

:black_square_button: Create a officer summary section that shows details of one officer or the sum stats of all officers.

:black_square_button: Create a crew manifest that shows crew stats. Can flag to be fired or to change ship. (Might need to limit this. Don't want to micromanage).

:black_square_button: Create chart area where player chooses their next move. Either hunt a specific target (pirate hunters), lay in wait for merchants in section, or travel to next port. From here, player transitions to being enroute.

:black_square_button: Player can choose to change flagship for another in their fleet.

### Captain's Quarters

:black_square_button: Chart section here is different than in Bungalow. Here player chooses to navigate when searching or going from A to B. If in battle, this is where player can choose tactics for fleet to follow.

:black_square_button: Player can choose to change their flagship to a different in their fleet. This can't be done in battle. Flagship is the only ship player has direct control over when engaged. The other follow their tactical orders and end up a statistical sum at the end of each turn.

### Doctor's Quarters

:black_square_button: ...

### Carpenter's Quarters

:black_square_button: ...

### Quartermaster's Quarters

:black_square_button: ...