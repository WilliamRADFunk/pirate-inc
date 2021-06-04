import { Ship } from "./Ship";

export class Corvette extends Ship {
    constructor(name: string) {
        super(
            0,              // armor
            2,              // cost modifier
            100,            // max crew
            20,             // min crew
            10,             // max cannons
            175,            // max health
            name,           // unique name for the vessel
            10,             // top speed of the vessel
            "Corvette",     // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            8               // the poundage type of the main cannons
        );
    }
}