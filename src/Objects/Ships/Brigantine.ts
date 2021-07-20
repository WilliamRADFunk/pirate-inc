import { Ship } from "./Ship";
import {
    BowCanonType,
    ShipDefaultArmor,
    ShipDefaultCost,
    ShipDefaultMainCannonType,
    ShipDefaultMaxCannon,
    ShipDefaultMaxCargo,
    ShipDefaultMaxCrew,
    ShipDefaultMaxHealth,
    ShipDefaultMinCrew,
    ShipDefaultTopSpeed,
    ShipType
} from "../../Types/ShipDefaults";
import { Cargo } from "../../Types/Cargo";
import { ShipNameGenerator } from "../../Helpers/ShipNameGenerator";

export class Brigantine extends Ship {
    constructor(name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Brigantine,   // armor
            ShipDefaultMaxCargo.Brigantine,         // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Brigantine,             // cost modifier
            ShipDefaultMaxCrew.Brigantine,          // max crew
            ShipDefaultMinCrew.Brigantine,          // min crew
            ShipDefaultMaxCannon.Brigantine,        // max cannons
            ShipDefaultMaxHealth.Brigantine,        // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Brigantine,         // top speed of the vessel
            ShipType.Brigantine,                    // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Brigantine,   // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}