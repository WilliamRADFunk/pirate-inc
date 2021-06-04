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

export class Dhow extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Dhow,     // armor
            ShipDefaultCost.Dhow,               // cost modifier
            ShipDefaultMaxCrew.Dhow,            // max crew
            ShipDefaultMinCrew.Dhow,            // min crew
            ShipDefaultMaxCannon.Dhow,          // max cannons
            ShipDefaultMaxHealth.Dhow,          // max health
            name,                               // unique name for the vessel
            ShipDefaultTopSpeed.Dhow,           // top speed of the vessel
            ShipType.Dhow,                      // vessel type
            numCannon ?? 1,                     // number of cannons
            bowCannon ?? "Empty",               // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Dhow,     // the poundage type of the main cannons
            health                              // current health of the ship if not full
        );
    }
}