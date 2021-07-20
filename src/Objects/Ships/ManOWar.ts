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

export class ManOWar extends  Ship {
    constructor(name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.ManOWar,      // armor
            ShipDefaultMaxCargo.ManOWar,            // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.ManOWar,                // cost modifier
            ShipDefaultMaxCrew.ManOWar,             // max crew
            ShipDefaultMinCrew.ManOWar,             // min crew
            ShipDefaultMaxCannon.ManOWar,           // max cannons
            ShipDefaultMaxHealth.ManOWar,           // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.ManOWar,            // top speed of the vessel
            ShipType.ManOWar,                       // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.ManOWar,      // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}