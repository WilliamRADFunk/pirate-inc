import { Ship } from "./Ship";

export class Frigate extends  Ship {
    constructor(name: string) {
        super(
            5,              // armor
            8,              // cost modifier
            600,            // max crew
            250,            // min crew
            38,             // max cannons
            1000,           // max health
            name,           // unique name for the vessel
            7,              // top speed of the vessel
            "Frigate",      // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            36              // the poundage type of the main cannons
        );
    }
}