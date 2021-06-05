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

export class Pinnace extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Pinnace,          // armor
            ShipDefaultMaxCargo.Pinnace,                // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Pinnace,                    // cost modifier
            ShipDefaultMaxCrew.Pinnace,                 // max crew
            ShipDefaultMinCrew.Pinnace,                 // min crew
            ShipDefaultMaxCannon.Pinnace,               // max cannons
            ShipDefaultMaxHealth.Pinnace,               // max health
            name,                                       // unique name for the vessel
            ShipDefaultTopSpeed.Pinnace,                // top speed of the vessel
            ShipType.Pinnace,                           // vessel type
            numCannon ?? 1,                             // number of cannons
            bowCannon ?? "Empty",                       // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Pinnace,          // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                      // current health of the ship if not full
        );
    }
}