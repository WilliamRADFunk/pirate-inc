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
} from "../../types/ShipDefaults";
import { Cargo } from "../../types/Cargo";

export class Schooner extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Schooner,         // armor
            ShipDefaultMaxCargo.Schooner,               // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Schooner,                   // cost modifier
            ShipDefaultMaxCrew.Schooner,                // max crew
            ShipDefaultMinCrew.Schooner,                // min crew
            ShipDefaultMaxCannon.Schooner,              // max cannons
            ShipDefaultMaxHealth.Schooner,              // max health
            name,                                       // unique name for the vessel
            ShipDefaultTopSpeed.Schooner,               // top speed of the vessel
            ShipType.Schooner,                          // vessel type
            numCannon ?? 1,                             // number of cannons
            bowCannon ?? "Empty",                       // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Schooner,         // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                      // current health of the ship if not full
        );
    }
}