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

export class Frigate extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Frigate,      // armor
            ShipDefaultMaxCargo.Frigate,            // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Frigate,                // cost modifier
            ShipDefaultMaxCrew.Frigate,             // max crew
            ShipDefaultMinCrew.Frigate,             // min crew
            ShipDefaultMaxCannon.Frigate,           // max cannons
            ShipDefaultMaxHealth.Frigate,           // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Frigate,            // top speed of the vessel
            ShipType.Frigate,                       // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Frigate,      // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}