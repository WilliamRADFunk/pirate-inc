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

export class Corvette extends Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.Corvette,     // armor
            ShipDefaultCost.Corvette,               // cost modifier
            ShipDefaultMaxCrew.Corvette,            // max crew
            ShipDefaultMinCrew.Corvette,            // min crew
            ShipDefaultMaxCannon.Corvette,          // max cannons
            ShipDefaultMaxHealth.Corvette,          // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Corvette,           // top speed of the vessel
            ShipType.Corvette,                      // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Corvette,     // the poundage type of the main cannons
            health                                  // current health of the ship if not full
        );
    }
}