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

export class Frigate extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Frigate,      // armor
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
            health                                  // current health of the ship if not full
        );
    }
}