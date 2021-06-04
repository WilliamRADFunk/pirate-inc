import { Ship } from "./Ship";

export class Carrack extends Ship {
    constructor(name: string) {
        super(
            2,              // armor
            5,              // cost modifier
            400,            // max crew
            100,            // min crew
            32,             // max cannons
            450,            // max health
            name,           // unique name for the vessel
            6,              // top speed of the vessel
            "Carrack",      // vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            36              // the poundage type of the main cannons
        );
    }
}