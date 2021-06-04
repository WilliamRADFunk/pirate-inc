import { Ship } from "./Ship";

export class Cutter extends  Ship {
    constructor(name: string) {
        super(
            0,              // armor
            2,              // cost modifier
            60,             // max crew
            10,             // min crew
            6,              // max cannons
            100,            // max health
            name,           // unique name for the vessel
            17,             // top speed of the vessel
            "Cutter",       // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            6               // the poundage type of the main cannons
        );
    }
}