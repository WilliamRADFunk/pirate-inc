import { BehaviorSubject } from "rxjs";
import { HireableCrew } from "../Objects/Crew/HireableCrew";
import { HireableOfficers } from "../Objects/Officers/HireableOfficers";
import { Merchant } from "./Merchant";

/**
 * Available ports in the game.
 */
export enum PortLocation {
    AtSea = "AtSea",
    Bath = "Bath",
    CharlesTown = "Charles Town",
    Nassau = "Nassau",
    NormanIsland = "Norman Island",
    PortRoyal = "Port Royal",
    Tortuga = "Tortuga"
}

/**
 * Interface of what a port must have to be a port.
 */
export interface Port {
    availableCrewToHire: BehaviorSubject<HireableCrew>;
    availableOfficersToHire: BehaviorSubject<HireableOfficers>;
    availableProvisions: BehaviorSubject<[number, number, number]>;
    readonly colonialOptions: { [key: number]: boolean };
    readonly connectedPorts: Port[];
    readonly costScaleSize: number;
    hasArrestBeenAttempted: boolean;
    readonly isPiratePort: boolean;
    readonly merchant: Merchant;
    readonly name: PortLocation;
    provisionPrices: BehaviorSubject<[number, number, number]>;
    reputation: number;
    readonly shipyardOptions: { [key: number]: boolean };
    willArrest: boolean;
}