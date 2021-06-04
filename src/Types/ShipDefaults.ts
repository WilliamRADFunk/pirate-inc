export type BowCanonType = "Long Nine" | "Explosive Carronade" | "Empty";

export type MainCanonType = 42 | 36 | 32 | 24 | 18 | 12 | 9 | 8 | 6 | 0;

export enum ShipRarityValue {
    AlmostNonExistent = 1,
    Sparse = 2,
    Common = 3,
    Abundant = 4,
    Everywhere = 5
}

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

export enum ShipType {
    Barque = "Barque",
    Brig = "Brig",
    Brigantine = "Brigantine",
    Caravel = "Caravel",
    Carrack = "Carrack",
    Corvette = "Corvette",
    Cutter = "Cutter",
    Dhow = "Dhow",
    EastIndiaman = "East Indiaman",
    Frigate = "Frigate",
    Galleon = "Galleon",
    Keltch = "Keltch",
    ManOWar = "Man-O-War",
    Pinnace = "Pinnace",
    Schooner = "Schooner",
    Slaver = "Slaver",
    Sloop = "Sloop"
}