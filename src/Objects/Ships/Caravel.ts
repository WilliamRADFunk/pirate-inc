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

export class Caravel extends Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, health?: number) {
        super(
            0,              // armor
            3,              // cost modifier
            100,            // max crew
            20,             // min crew
            8,              // max cannons
            150,            // max health
            name,           // unique name for the vessel
            13,             // top speed of the vessel
            "Caravel",      // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            6               // the poundage type of the main cannons
        );
    }
}