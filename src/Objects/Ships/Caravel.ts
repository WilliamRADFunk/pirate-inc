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

export class Caravel extends Ship {
    constructor(difficulty: number, name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            difficulty,                             // player chosen difficulty level.
            armor ?? ShipDefaultArmor.Caravel,      // armor
            ShipDefaultMaxCargo.Caravel,            // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Caravel,                // cost modifier
            ShipDefaultMaxCrew.Caravel,             // max crew
            ShipDefaultMinCrew.Caravel,             // min crew
            ShipIconImage.Caravel,                  // icon url used in fleet manifest
            ShipDefaultMaxCannon.Caravel,           // max cannons
            ShipDefaultMaxHealth.Caravel,           // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Caravel,            // top speed of the vessel
            ShipType.Caravel,                       // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? 'Empty',                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Caravel,      // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}