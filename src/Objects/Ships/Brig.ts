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

export class Brig extends Ship {
    constructor(difficulty: number, name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            difficulty,                             // player chosen difficulty level.
            armor ?? ShipDefaultArmor.Brig,         // armor
            ShipDefaultMaxCargo.Brig,               // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Brig,                   // cost modifier
            ShipDefaultMaxCrew.Brig,                // max crew
            ShipDefaultMinCrew.Brig,                // min crew
            ShipIconImage.Brig,                     // icon url used in fleet manifest
            ShipDefaultMaxCannon.Brig,              // max cannons
            ShipDefaultMaxHealth.Brig,              // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Brig,               // top speed of the vessel
            ShipType.Brig,                          // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? 'Empty',                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Brig,         // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}