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

export class Sloop extends  Ship {
    constructor(name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.Sloop,        // armor
            ShipDefaultMaxCargo.Sloop,              // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Sloop,                  // cost modifier
            ShipDefaultMaxCrew.Sloop,               // max crew
            ShipDefaultMinCrew.Sloop,               // min crew
            ShipIconImage.Sloop,                    // icon url used in fleet manifest
            ShipDefaultMaxCannon.Sloop,             // max cannons
            ShipDefaultMaxHealth.Sloop,             // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Sloop,              // top speed of the vessel
            ShipType.Sloop,                         // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? "Empty",                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Sloop,        // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}