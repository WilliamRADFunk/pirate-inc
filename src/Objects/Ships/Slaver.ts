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

export class Slaver extends  Ship {
    constructor(name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Slaver,       // armor
            ShipDefaultMaxCargo.Slaver,             // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Slaver,                 // cost modifier
            ShipDefaultMaxCrew.Slaver,              // max crew
            ShipDefaultMinCrew.Slaver,              // min crew
            ShipIconImage.Slaver,                   // icon url used in fleet manifest
            ShipDefaultMaxCannon.Slaver,            // max cannons
            ShipDefaultMaxHealth.Slaver,            // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Slaver,             // top speed of the vessel
            ShipType.Slaver,                        // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Slaver,       // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}