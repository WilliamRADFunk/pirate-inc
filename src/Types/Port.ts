import { BehaviorSubject } from "rxjs";
import { HireableCrew } from "../Objects/Crew/HireableCrew";
import { HireableOfficers } from "../Objects/Officers/HireableOfficers";

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
    readonly colonialOptions: { [key: number]: boolean };
    readonly connectedPorts: Port[];
    readonly costScaleSize: number;
    hasArrestBeenAttempted: boolean;
    readonly isPiratePort: boolean;
    readonly name: PortLocation;
    reputation: number;
    readonly shipyardOptions: { [key: number]: boolean };
    willArrest: boolean;
}