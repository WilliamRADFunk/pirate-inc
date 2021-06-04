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

export class Pinnace extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Pinnace,          // armor
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
            health                                      // current health of the ship if not full
        );
    }
}