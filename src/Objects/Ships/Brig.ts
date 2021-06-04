import { Ship } from "./Ship";

export class Brig extends Ship {
    constructor(name: string) {
        super(
            1,          // armor
            4,          // cost modifier
            150,        // max crew
            30,         // min crew
            18,         // max cannons
            300,        // max health
            name,       // unique name for the vessel
            8,          // top speed of the vessel
            "Brig",     // vessel type
            1,          // number of cannons
            "Empty",    // type, if any, of bow cannon on board
            9           // the poundage type of the main cannons
        );
    }
}