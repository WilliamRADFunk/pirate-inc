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
    ShipIconImage,
    ShipType
} from "../../Types/ShipDefaults";
import { Cargo } from "../../Types/Cargo";
import { ShipNameGenerator } from "../../Helpers/ShipNameGenerator";

export class Dhow extends  Ship {
    constructor(difficulty: number, name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            difficulty,                         // player chosen difficulty level.
            armor ?? ShipDefaultArmor.Dhow,     // armor
            ShipDefaultMaxCargo.Dhow,           // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Dhow,               // cost modifier
            ShipDefaultMaxCrew.Dhow,            // max crew
            ShipDefaultMinCrew.Dhow,            // min crew
            ShipIconImage.Dhow,                 // icon url used in fleet manifest
            ShipDefaultMaxCannon.Dhow,          // max cannons
            ShipDefaultMaxHealth.Dhow,          // max health
            name || ShipNameGenerator(),        // unique name for the vessel
            ShipDefaultTopSpeed.Dhow,           // top speed of the vessel
            ShipType.Dhow,                      // vessel type
            numCannon ?? 1,                     // number of cannons
            bowCannon ?? "Empty",               // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Dhow,     // the poundage type of the main cannons
            cargoCarried ?? [],                 // cargo ship might already be carrying when instantiated.
            health                              // current health of the ship if not full
        );
    }
}