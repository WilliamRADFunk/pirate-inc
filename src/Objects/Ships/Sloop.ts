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

export class Sloop extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Sloop,        // armor
            ShipDefaultCost.Sloop,                  // cost modifier
            ShipDefaultMaxCrew.Sloop,               // max crew
            ShipDefaultMinCrew.Sloop,               // min crew
            ShipDefaultMaxCannon.Sloop,             // max cannons
            ShipDefaultMaxHealth.Sloop,             // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Sloop,              // top speed of the vessel
            ShipType.Sloop,                         // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Sloop,        // the poundage type of the main cannons
            health                                  // current health of the ship if not full
        );
    }
}