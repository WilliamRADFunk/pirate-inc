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

export class EastIndiaman extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            armor ?? ShipDefaultArmor.EastIndiaman,     // armor
            ShipDefaultCost.EastIndiaman,               // cost modifier
            ShipDefaultMaxCrew.EastIndiaman,            // max crew
            ShipDefaultMinCrew.EastIndiaman,            // min crew
            ShipDefaultMaxCannon.EastIndiaman,          // max cannons
            ShipDefaultMaxHealth.EastIndiaman,          // max health
            name,                                       // unique name for the vessel
            ShipDefaultTopSpeed.EastIndiaman,           // top speed of the vessel
            ShipType.EastIndiaman,                      // vessel type
            numCannon ?? 1,                             // number of cannons
            bowCannon ?? "Empty",                       // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.EastIndiaman,     // the poundage type of the main cannons
            health                                      // current health of the ship if not full
        );
    }
}