import { BehaviorSubject } from 'rxjs';
import { HireableCrew } from '../Objects/Crew/HireableCrew';
import { HireableOfficers } from '../Objects/Officers/HireableOfficers';
import { Features, MoodToMouth } from './People';

/**
 * All the attributes port colonial official must have.
 */
 export interface ColonialOfficial {
    arrestInclination: number;
    avatar: string;
    bribeResistance: number;
    features: Features;
    id: string;
    mood: MoodToMouth;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
}

/**
 * All the attributes the port merchant must have.
 */
 export interface Merchant {
    avatar: string;
    features: Features;
    id: string;
    mood: MoodToMouth;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
    haggleResistance: number;
}

/**
 * Available ports in the game.
 */
export enum PortLocation {
    AtSea = 'AtSea',
    Bath = 'Bath',
    CharlesTown = 'Charles Town',
    Nassau = 'Nassau',
    NormanIsland = 'Norman Island',
    PortRoyal = 'Port Royal',
    Tortuga = 'Tortuga'
}

/**
 * Interface of what a port must have to be a port.
 */
export interface Port {
    availableCrewToHire: BehaviorSubject<HireableCrew>;
    availableOfficersToHire: BehaviorSubject<HireableOfficers>;
    availableProvisions: BehaviorSubject<[number, number, number]>;
    bribePrice: number;
    readonly colonialOfficial: ColonialOfficial;
    readonly colonialOptions: { [key: number]: boolean };
    readonly connectedPorts: Port[];
    readonly costScaleSize: number;
    hasArrestBeenAttempted: boolean;
    readonly isPiratePort: boolean;
    readonly merchant: Merchant;
    readonly name: PortLocation;
    provisionPrices: BehaviorSubject<[number, number, number]>;
    reputation: number;
    royalPardonPrice: number;
    readonly shipyardOptions: { [key: number]: boolean };
    willArrest: boolean;
    writOfProtection: WritOfProtection | null;
    writOfProtectionPrice: number;
}

export interface WritOfProtection {
    originalCost: number;
    port: Port;
    turnsRemaining: number;
}