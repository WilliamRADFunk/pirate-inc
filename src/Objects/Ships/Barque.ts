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

export class Barque extends Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Barque,       // armor
            ShipDefaultMaxCargo.Barque,             // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Barque,                 // cost modifier
            ShipDefaultMaxCrew.Barque,              // max crew
            ShipDefaultMinCrew.Barque,              // min crew
            ShipDefaultMaxCannon.Barque,            // max cannons
            ShipDefaultMaxHealth.Barque,            // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Barque,             // top speed of the vessel
            ShipType.Barque,                        // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Barque,       // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}