import { Ship } from './Ship';
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
} from '../../Types/ShipDefaults';
import { Cargo } from '../../Types/Cargo';
import { ShipNameGenerator } from '../../Helpers/ShipNameGenerator';

export class Galleon extends  Ship {
    constructor(difficulty: number, name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            difficulty,                             // player chosen difficulty level.
            armor ?? ShipDefaultArmor.Galleon,      // armor
            ShipDefaultMaxCargo.Galleon,            // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Galleon,                // cost modifier
            ShipDefaultMaxCrew.Galleon,             // max crew
            ShipDefaultMinCrew.Galleon,             // min crew
            ShipIconImage.Galleon,                  // icon url used in fleet manifest
            ShipDefaultMaxCannon.Galleon,           // max cannons
            ShipDefaultMaxHealth.Galleon,           // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Galleon,            // top speed of the vessel
            ShipType.Galleon,                       // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? 'Empty',                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Galleon,      // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}