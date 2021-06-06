import { Ship } from "./Ship";
import {
    BowCanonType,
    ShipDefaultArmor,
    ShipDefaultCost,
    ShipDefaultMainCannonType,
    ShipDefaultMaxCannon,
    ShipDefaultMaxCargo,
    ShipDefaultMaxCrew,
    ShipDefaultMaxHealth,
    ShipDefaultMinCrew,
    ShipDefaultTopSpeed,
    ShipType
} from "../../Types/ShipDefaults";
import { Cargo } from "../../Types/Cargo";

export class Carrack extends Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Carrack,      // armor
            ShipDefaultMaxCargo.Carrack,            // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Carrack,                // cost modifier
            ShipDefaultMaxCrew.Carrack,             // max crew
            ShipDefaultMinCrew.Carrack,             // min crew
            ShipDefaultMaxCannon.Carrack,           // max cannons
            ShipDefaultMaxHealth.Carrack,           // max health
            name,                                   // unique name for the vessel
            ShipDefaultTopSpeed.Carrack,            // top speed of the vessel
            ShipType.Carrack,                       // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Carrack,      // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}