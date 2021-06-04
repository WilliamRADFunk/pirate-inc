import { Ship } from "./Ship";

export class Galleon extends  Ship {
    constructor(name: string) {
        super(
            5,              // armor
            7,              // cost modifier
            700,            // max crew
            300,            // min crew
            42,             // max cannons
            1000,           // max health
            name,           // unique name for the vessel
            4,              // top speed of the vessel
            "Galleon",      // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            42              // the poundage type of the main cannons
        );
    }
}