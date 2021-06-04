import { Ship } from "./Ship";

export class EastIndiaman extends  Ship {
    constructor(name: string) {
        super(
            2,              // armor
            5,              // cost modifier
            425,            // max crew
            150,            // min crew
            36,             // max cannons
            500,            // max health
            name,           // unique name for the vessel
            5,              // top speed of the vessel
            "East Indiaman",// vessel type
            1,              // number of cannons
            "Empty",        // type, if any, of bow cannon on board
            36              // the poundage type of the main cannons
        );
    }
}