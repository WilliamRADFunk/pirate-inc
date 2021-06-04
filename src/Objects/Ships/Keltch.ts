import { Ship } from "./Ship";

export class Keltch extends  Ship {
    constructor(name: string) {
        super(
            0,              // armor
            1,              // cost modifier
            60,             // max crew
            10,             // min crew
            4,              // max cannons
            100,            // max health
            name,           // unique name for the vessel
            14,             // top speed of the vessel
            "Keltch",       // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            6               // the poundage type of the main cannons
        );
    }
}