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

export class Keltch extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Keltch,       // armor
            ShipDefaultCost.Keltch,                 // cost modifier
            ShipDefaultMaxCrew.Keltch,              // max crew
            ShipDefaultMinCrew.Keltch,              // min crew
            ShipDefaultMaxCannon.Keltch,            // max cannons
            ShipDefaultMaxHealth.Keltch,            // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Keltch,             // top speed of the vessel
            ShipType.Keltch,                        // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Keltch,       // the poundage type of the main cannons
            health                                  // current health of the ship if not full
        );
    }
}