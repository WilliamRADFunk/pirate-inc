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

export class EastIndiaman extends  Ship {
    constructor(difficulty: number, name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            difficulty,                                 // player chosen difficulty level.
            armor ?? ShipDefaultArmor.EastIndiaman,     // armor
            ShipDefaultMaxCargo.EastIndiaman,           // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.EastIndiaman,               // cost modifier
            ShipDefaultMaxCrew.EastIndiaman,            // max crew
            ShipDefaultMinCrew.EastIndiaman,            // min crew
            ShipIconImage.EastIndiaman,                 // icon url used in fleet manifest
            ShipDefaultMaxCannon.EastIndiaman,          // max cannons
            ShipDefaultMaxHealth.EastIndiaman,          // max health
            name || ShipNameGenerator(),                // unique name for the vessel
            ShipDefaultTopSpeed.EastIndiaman,           // top speed of the vessel
            ShipType.EastIndiaman,                      // vessel type
            numCannon ?? 1,                             // number of cannons
            bowCannon ?? "Empty",                       // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.EastIndiaman,     // the poundage type of the main cannons
            cargoCarried ?? [],                         // cargo ship might already be carrying when instantiated.
            health                                      // current health of the ship if not full
        );
    }
}