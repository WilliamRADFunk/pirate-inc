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

export class Galleon extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Galleon,      // armor
            ShipDefaultCost.Galleon,                // cost modifier
            ShipDefaultMaxCrew.Galleon,             // max crew
            ShipDefaultMinCrew.Galleon,             // min crew
            ShipDefaultMaxCannon.Galleon,           // max cannons
            ShipDefaultMaxHealth.Galleon,           // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Galleon,            // top speed of the vessel
            ShipType.Galleon,                       // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Galleon,      // the poundage type of the main cannons
            health                                  // current health of the ship if not full
        );
    }
}