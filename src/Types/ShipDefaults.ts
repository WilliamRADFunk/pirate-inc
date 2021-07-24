/**
 * Available types of bow fixed cannon. There can be only one per ship, and is used for first attack volley.
 */
export type BowCanonType = 'Long Nine' | 'Explosive Carronade' | 'Chain Shot' | 'Empty';

/**
 * Available types of main cannons. The numerical type values also equate to their caliber in "poundage".
 */
export type MainCanonType = 42 | 36 | 32 | 24 | 18 | 12 | 9 | 8 | 6 | 0;

/**
 * A map to relay how common or rare a ship type is to be found in ports for sale, or on the open seas to battle.
 */
export enum ShipRarityValue {
    AlmostNonExistent = 1,
    Sparse = 2,
    Common = 3,
    Abundant = 4,
    Everywhere = 5
}

/**
 * A map to associate the level of armor a specific ship type starts with.
 */
export enum ShipDefaultArmor {
    Barque = 0,
    Brig = 1,
    Brigantine = 0,
    Caravel = 0,
    Carrack = 2,
    Corvette = 0,
    Cutter = 0,
    Dhow = 0,
    EastIndiaman = 2,
    Frigate = 5,
    Galleon = 5,
    Keltch = 0,
    ManOWar = 6,
    Pinnace = 3,
    Schooner = 2,
    Slaver = 2,
    Sloop = 1
}

/**
 * A map to associate the cost modifier for a specific ship type for sale or purcahse, to be applied against a separate port modifier.
 */
export enum ShipDefaultCost {
    Barque = 2,
    Brig = 4,
    Brigantine = 3,
    Caravel = 3,
    Carrack = 5,
    Corvette = 2,
    Cutter = 2,
    Dhow = 3,
    EastIndiaman = 5,
    Frigate = 8,
    Galleon = 7,
    Keltch = 1,
    ManOWar = 10,
    Pinnace = 4,
    Schooner = 3,
    Slaver = 4,
    Sloop = 3
}

/**
 * A map to associate the what main cannon type is associated to a given ship type.
 */
export enum ShipDefaultMainCannonType {
    Barque = 6,
    Brig = 9,
    Brigantine = 8,
    Caravel = 6,
    Carrack = 36,
    Corvette = 8,
    Cutter = 6,
    Dhow = 6,
    EastIndiaman = 36,
    Frigate = 36,
    Galleon = 42,
    Keltch = 6,
    ManOWar = 42,
    Pinnace = 18,
    Schooner = 12,
    Slaver = 32,
    Sloop = 24
}

/**
 * A map to associate the total number of main cannon a specific ship type can have.
 */
export enum ShipDefaultMaxCannon {
    Barque = 16,
    Brig = 18,
    Brigantine = 16,
    Caravel = 8,
    Carrack = 32,
    Corvette = 10,
    Cutter = 6,
    Dhow = 6,
    EastIndiaman = 36,
    Frigate = 38,
    Galleon = 42,
    Keltch = 4,
    ManOWar = 60,
    Pinnace = 24,
    Schooner = 12,
    Slaver = 24,
    Sloop = 12
}

/**
 * A map to associate the total amount of cargo tonnage a specific ship type can have.
 */
export enum ShipDefaultMaxCargo {
    Barque = 70,
    Brig = 70,
    Brigantine = 150,
    Caravel = 120,
    Carrack = 120,
    Corvette = 620,
    Cutter = 800,
    Dhow = 900,
    EastIndiaman = 1250,
    Frigate = 80,
    Galleon = 500,
    Keltch = 40,
    ManOWar = 600,
    Pinnace = 25,
    Schooner = 300,
    Slaver = 450,
    Sloop = 40
}

/**
 * A map to associate the total number of crew a specific ship type can have.
 */
export enum ShipDefaultMaxCrew {
    Barque = 100,
    Brig = 150,
    Brigantine = 125,
    Caravel = 100,
    Carrack = 400,
    Corvette = 100,
    Cutter = 60,
    Dhow = 80,
    EastIndiaman = 425,
    Frigate = 600,
    Galleon = 700,
    Keltch = 60,
    ManOWar = 850,
    Pinnace = 500,
    Schooner = 300,
    Slaver = 500,
    Sloop = 250
}

/**
 * A map to associate the total amount of health a specific ship type can have.
 */
export enum ShipDefaultMaxHealth {
    Barque = 200,
    Brig = 300,
    Brigantine = 250,
    Caravel = 150,
    Carrack = 450,
    Corvette = 175,
    Cutter = 100,
    Dhow = 200,
    EastIndiaman = 500,
    Frigate = 1000,
    Galleon = 1000,
    Keltch = 100,
    ManOWar = 1250,
    Pinnace = 500,
    Schooner = 250,
    Slaver = 650,
    Sloop = 450
}

/**
 * A map to associate the minumum amount of crew a specific ship type can have in order to operate.
 */
export enum ShipDefaultMinCrew {
    Barque = 12,
    Brig = 30,
    Brigantine = 25,
    Caravel = 20,
    Carrack = 100,
    Corvette = 20,
    Cutter = 10,
    Dhow = 20,
    EastIndiaman = 150,
    Frigate = 250,
    Galleon = 300,
    Keltch = 10,
    ManOWar = 300,
    Pinnace = 150,
    Schooner = 50,
    Slaver = 150,
    Sloop = 50
}

/**
 * A map to associate the total speed a specific ship type can hope to achieve under optimal conditions.
 */
export enum ShipDefaultTopSpeed {
    Barque = 9,
    Brig = 8,
    Brigantine = 9,
    Caravel = 13,
    Carrack = 6,
    Corvette = 10,
    Cutter = 17,
    Dhow = 16,
    EastIndiaman = 5,
    Frigate = 7,
    Galleon = 4,
    Keltch = 14,
    ManOWar = 8,
    Pinnace = 9,
    Schooner = 16,
    Slaver = 5,
    Sloop = 12
}

/**
 * An image of a ship icon used for the fleet manifest to represent the ship's type.
 */
export enum ShipIconImage {
    Barque = 'images/icon-ship-barque.ICO',
    Brig = 'images/icon-ship-brig.ICO',
    Brigantine = 'images/icon-ship-brigantine.ICO',
    Caravel = 'images/icon-ship-caravel.ICO',
    Carrack = 'images/icon-ship-carrack.ICO',
    Corvette = 'images/icon-ship-corvette.ICO',
    Cutter = 'images/icon-ship-cutter.ICO',
    Dhow = 'images/icon-ship-dhow.ICO',
    EastIndiaman = 'images/icon-ship-eastindiaman.ICO',
    Frigate = 'images/icon-ship-frigate.ICO',
    Galleon = 'images/icon-ship-galleon.ICO',
    Keltch = 'images/icon-ship-keltch.ICO',
    ManOWar = 'images/icon-ship-manowar.ICO',
    Pinnace = 'images/icon-ship-pinnace.ICO',
    Schooner = 'images/icon-ship-schooner.ICO',
    Slaver = 'images/icon-ship-slaver.ICO',
    Sloop = 'images/icon-ship-sloop.ICO'
}

/**
 * A map to associate how rare a specific ship type is to be found for sale in any port.
 */
export enum ShipPurchaseRarityType {
    Barque = ShipRarityValue.Abundant,
    Brig = ShipRarityValue.AlmostNonExistent,
    Brigantine = ShipRarityValue.Sparse,
    Caravel = ShipRarityValue.Common,
    Carrack = ShipRarityValue.Sparse,
    Corvette = ShipRarityValue.Common,
    Cutter = ShipRarityValue.Abundant,
    Dhow = ShipRarityValue.AlmostNonExistent,
    EastIndiaman = ShipRarityValue.Sparse,
    Frigate = ShipRarityValue.AlmostNonExistent,
    Galleon = ShipRarityValue.Sparse,
    Keltch = ShipRarityValue.Common,
    ManOWar = ShipRarityValue.AlmostNonExistent,
    Pinnace = ShipRarityValue.Sparse,
    Schooner = ShipRarityValue.Common,
    Slaver = ShipRarityValue.Common,
    Sloop = ShipRarityValue.Everywhere
}

/**
 * A map to associate how rare a specific ship type is to be found on the open seas as a target.
 */
export enum ShipTargetRarityType {
    Barque = ShipRarityValue.Abundant,
    Brig = ShipRarityValue.Sparse,
    Brigantine = ShipRarityValue.Sparse,
    Caravel = ShipRarityValue.Abundant,
    Carrack = ShipRarityValue.Common,
    Corvette = ShipRarityValue.Abundant,
    Cutter = ShipRarityValue.Abundant,
    Dhow = ShipRarityValue.AlmostNonExistent,
    EastIndiaman = ShipRarityValue.Common,
    Frigate = ShipRarityValue.Sparse,
    Galleon = ShipRarityValue.Common,
    Keltch = ShipRarityValue.Common,
    ManOWar = ShipRarityValue.Sparse,
    Pinnace = ShipRarityValue.Common,
    Schooner = ShipRarityValue.Common,
    Slaver = ShipRarityValue.Common,
    Sloop = ShipRarityValue.Everywhere
}

/**
 * Available types of ships.
 */
export enum ShipType {
    Barque = 'Barque',
    Brig = 'Brig',
    Brigantine = 'Brigantine',
    Caravel = 'Caravel',
    Carrack = 'Carrack',
    Corvette = 'Corvette',
    Cutter = 'Cutter',
    Dhow = 'Dhow',
    EastIndiaman = 'East Indiaman',
    Frigate = 'Frigate',
    Galleon = 'Galleon',
    Keltch = 'Keltch',
    ManOWar = 'Man-O-War',
    Pinnace = 'Pinnace',
    Schooner = 'Schooner',
    Slaver = 'Slaver',
    Sloop = 'Sloop'
}