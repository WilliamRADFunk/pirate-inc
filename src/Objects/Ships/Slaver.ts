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

export class Slaver extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Slaver,       // armor
            ShipDefaultCost.Slaver,                 // cost modifier
            ShipDefaultMaxCrew.Slaver,              // max crew
            ShipDefaultMinCrew.Slaver,              // min crew
            ShipDefaultMaxCannon.Slaver,            // max cannons
            ShipDefaultMaxHealth.Slaver,            // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Slaver,             // top speed of the vessel
            ShipType.Slaver,                        // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Slaver,       // the poundage type of the main cannons
            health                                  // current health of the ship if not full
        );
    }
}