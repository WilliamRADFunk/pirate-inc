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
} from "../../types/ShipDefaults";
import { Cargo } from "../../types/Cargo";

export class EastIndiaman extends  Ship {
    constructor(name: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            armor ?? ShipDefaultArmor.EastIndiaman,     // armor
            ShipDefaultMaxCargo.EastIndiaman,           // Maximum tonnage of cargo this vessel can carry
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
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                      // current health of the ship if not full
        );
    }
}