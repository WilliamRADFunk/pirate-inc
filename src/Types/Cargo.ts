export enum CargoType {
    Cotton = "Cotton",
    Gold = "Gold",
    Indigo = "Indigo",
    Silver = "Silver",
    Slaves = "Slaves",
    Tobacco = "Tobacco",
    Tools = "Tools"
}

export interface Cargo {
    type: CargoType;
    quantity: number;
}