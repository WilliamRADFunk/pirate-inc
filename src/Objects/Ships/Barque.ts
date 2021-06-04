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

export class Barque extends Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            0,          // armor
            2,          // cost modifier
            100,        // max crew
            12,         // min crew
            16,         // max cannons
            200,        // max health
            name,       // unique name for the vessel
            9,          // top speed of the vessel
            "Barque",   // vessel type
            1,          // number of cannons
            "Empty",    // type, if any, of bow cannon on board
            6           // the poundage type of the main cannons
        );
    }
}