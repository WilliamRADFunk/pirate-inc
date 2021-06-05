export enum CargoType {
    Beer = "Beer",
    Cocoa = "Cocoa",
    Cotton = "Cotton",
    Gold = "Gold",
    Flintlocks = "Flintlocks",
    Hardwood = "Hardwood",
    Iron = "Iron",
    Indigo = "Indigo",
    Linen = "Linen",
    Livestock = "Livestock",
    Medicine = "Medicine",
    Silk = "Silk",
    Silver = "Silver",
    Slaves = "Slaves",
    Sugar = "Sugar",
    Swords = "Swords",
    Tobacco = "Tobacco",
    Tools = "Tools",
    TropicalFlowers = "Tropical Flowers",
    TropicalFruit = "Tropical Fruit",
    Vegetables = "Vegetables",
    Wine = "Wine",
    Wool = "Wool"
}

export interface Cargo {
    type: CargoType;
    quantity: number;
}