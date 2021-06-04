import { Ship } from "./Ship";

export class Dhow extends  Ship {
    constructor(name: string) {
        super(
            0,              // armor
            3,              // cost modifier
            80,             // max crew
            20,             // min crew
            6,              // max cannons
            200,            // max health
            name,           // unique name for the vessel
            16,             // top speed of the vessel
            "Dhow",         // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            6               // the poundage type of the main cannons
        );
    }
}