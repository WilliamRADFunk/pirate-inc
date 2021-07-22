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

export class Corvette extends Ship {
    constructor(difficulty: number, name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            difficulty,                             // player chosen difficulty level.
            armor ?? ShipDefaultArmor.Corvette,     // armor
            ShipDefaultMaxCargo.Corvette,           // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Corvette,               // cost modifier
            ShipDefaultMaxCrew.Corvette,            // max crew
            ShipDefaultMinCrew.Corvette,            // min crew
            ShipIconImage.Corvette,                 // icon url used in fleet manifest
            ShipDefaultMaxCannon.Corvette,          // max cannons
            ShipDefaultMaxHealth.Corvette,          // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Corvette,           // top speed of the vessel
            ShipType.Corvette,                      // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Corvette,     // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}