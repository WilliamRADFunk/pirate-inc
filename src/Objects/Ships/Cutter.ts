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

export class Cutter extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Cutter,       // armor
            ShipDefaultMaxCargo.Cutter,             // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Cutter,                 // cost modifier
            ShipDefaultMaxCrew.Cutter,              // max crew
            ShipDefaultMinCrew.Cutter,              // min crew
            ShipDefaultMaxCannon.Cutter,            // max cannons
            ShipDefaultMaxHealth.Cutter,            // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Cutter,             // top speed of the vessel
            ShipType.Cutter,                        // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Cutter,       // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}