import { Ship } from "./Ship";
import {
    BowCanonType,
    ShipDefaultArmor,
    ShipDefaultCost,
    ShipDefaultMainCannonType,
    ShipDefaultMaxCannon,
    ShipDefaultMaxCrew,
    ShipDefaultMaxHealth,
    ShipDefaultMinCrew,
    ShipDefaultTopSpeed,
    ShipType
} from "../../types/ShipDefaults";

export class Brigantine extends Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Brigantine,   // armor
            ShipDefaultCost.Brigantine,             // cost modifier
            ShipDefaultMaxCrew.Brigantine,          // max crew
            ShipDefaultMinCrew.Brigantine,          // min crew
            ShipDefaultMaxCannon.Brigantine,        // max cannons
            ShipDefaultMaxHealth.Brigantine,        // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Brigantine,         // top speed of the vessel
            ShipType.Brigantine,                    // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Brigantine,   // the poundage type of the main cannons
            health                                  // current health of the ship if not full
        );
    }
}