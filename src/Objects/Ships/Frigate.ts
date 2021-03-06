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

export class Frigate extends  Ship {
    constructor(difficulty: number, name?: string, armor?: number, numCannon?: number, bowCannon?: BowCanonType, cargoCarried?: Cargo[], health?: number) {
        super(
            difficulty,                             // player chosen difficulty level.
            armor ?? ShipDefaultArmor.Frigate,      // armor
            ShipDefaultMaxCargo.Frigate,            // Maximum tonnage of cargo this vessel can carry
            ShipDefaultCost.Frigate,                // cost modifier
            ShipDefaultMaxCrew.Frigate,             // max crew
            ShipDefaultMinCrew.Frigate,             // min crew
            ShipIconImage.Frigate,                  // icon url used in fleet manifest
            ShipDefaultMaxCannon.Frigate,           // max cannons
            ShipDefaultMaxHealth.Frigate,           // max health
            name || ShipNameGenerator(),            // unique name for the vessel
            ShipDefaultTopSpeed.Frigate,            // top speed of the vessel
            ShipType.Frigate,                       // vessel type
            numCannon ?? 1,                         // number of cannons
            bowCannon ?? 'Empty',                   // type, if any, of bow cannon on board
            ShipDefaultMainCannonType.Frigate,      // the poundage type of the main cannons
            cargoCarried ?? [],                     // cargo ship might already be carrying when instantiated.
            health                                  // current health of the ship if not full
        );
    }
}