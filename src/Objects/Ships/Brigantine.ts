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

export class Brigantine extends Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            0,              // armor
            3,              // cost modifier
            125,            // max crew
            25,             // min crew
            16,             // max cannons
            250,            // max health
            name,           // unique name for the vessel
            9,              // top speed of the vessel
            "Brigantine",   // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            8               // the poundage type of the main cannons
        );
    }
}