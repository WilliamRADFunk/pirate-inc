import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdjustColonialOfficial, AdjustMerchant, CreateColonialOfficial, CreateMerchant } from '../Helpers/CreatePortPersonnel';
import { HireableCrew } from '../Objects/Crew/HireableCrew';
import { HireableOfficers } from '../Objects/Officers/HireableOfficers';
import { BaseWritOfProtectionLifespan } from '../Types/Constants';
import { MoodToMouth } from '../Types/People';

import { Port, PortLocation } from '../Types/Port';
import { playerManager } from './PlayerManager';
import { PortSceneState, stateManager } from './StateManager';

class PortManager {
    /**
     * The port where the player is currently docked. Will be null when they leave a port.
     */
    private _currentPort: BehaviorSubject<Port>;

    /**
     * The difficulty level chosen by player.
     */
    private _difficulty: number = 2;

    /**
     * Whether or not player has a bribe active.
     */
    private _hasBribe: boolean = false;

    /**
     * List of all the port object player can visit and interact with.
     */
    private _ports: Port[] = [];

    private subscriptions: Subscription[] = [];

    constructor() {
        // Creates all the ports.
        this._ports.push(
            // Sort of a neutral port in that they are under the crown, but history suggests Black Beard used it.
            {
                availableCrewToHire: new BehaviorSubject(new HireableCrew()),
                availableOfficersToHire: new BehaviorSubject(new HireableOfficers()),
                availableProvisions: new BehaviorSubject([1, 1, 1]),
                bribePrice: 0,
                colonialOfficial: CreateColonialOfficial(0, 0, false),
                colonialOptions: {
                    1: false, // Bribe
                    2: false, // Writ of Protection
                    3: false, // Royal Pardon
                },
                connectedPorts: [],
                costScaleSize: 0,
                hasArrestBeenAttempted: false,
                isPiratePort: false,
                name: PortLocation.AtSea,
                provisionPrices: new BehaviorSubject([200, 100, 50]),
                reputation: 0,
                royalPardonPrice: 0,
                shipyardOptions: {
                    1: false, // Buy
                    2: false, // Sell
                    3: false, // Repair
                    4: false // Outfit
                },
                willArrest: false,
                merchant: CreateMerchant(0, 0, false),
                writOfProtection: null,
                writOfProtectionPrice: 0
            },
            // Sort of a neutral port in that they are under the crown, but history suggests Black Beard used it.
            {
                availableCrewToHire: new BehaviorSubject(new HireableCrew()),
                availableOfficersToHire: new BehaviorSubject(new HireableOfficers()),
                availableProvisions: new BehaviorSubject([1, 1, 1]),
                bribePrice: 0,
                colonialOfficial: CreateColonialOfficial(0, 7, false),
                colonialOptions: {
                    1: true, // Bribe
                    2: true, // Writ of Protection
                    3: false, // Royal Pardon
                },
                connectedPorts: [],
                costScaleSize: 7,
                hasArrestBeenAttempted: false,
                isPiratePort: false,
                name: PortLocation.Bath,
                provisionPrices: new BehaviorSubject([200, 100, 50]),
                reputation: 0,
                royalPardonPrice: 0,
                shipyardOptions: {
                    1: true, // Buy
                    2: true, // Sell
                    3: true, // Repair
                    4: false // Outfit
                },
                willArrest: false,
                merchant: CreateMerchant(0, 7, false),
                writOfProtection: null,
                writOfProtectionPrice: 0
            },
            // A crown port with no love for pirates which is often attacked by pirates.
            {
                availableCrewToHire: new BehaviorSubject(new HireableCrew()),
                availableOfficersToHire: new BehaviorSubject(new HireableOfficers()),
                availableProvisions: new BehaviorSubject([1, 1, 1]),
                bribePrice: 0,
                colonialOfficial: CreateColonialOfficial(0, 8, false),
                colonialOptions: {
                    1: true,
                    2: true,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 8,
                hasArrestBeenAttempted: false,
                isPiratePort: false,
                name: PortLocation.CharlesTown,
                provisionPrices: new BehaviorSubject([200, 100, 50]),
                reputation: 0,
                royalPardonPrice: 0,
                shipyardOptions: {
                    1: false,
                    2: true,
                    3: true,
                    4: true
                },
                willArrest: false,
                merchant: CreateMerchant(0, 8, false),
                writOfProtection: null,
                writOfProtectionPrice: 0
            },
            // While technically under the crown, it is the capital of the pirate republic under Benjamin Hornigold.
            {
                availableCrewToHire: new BehaviorSubject(new HireableCrew()),
                availableOfficersToHire: new BehaviorSubject(new HireableOfficers()),
                availableProvisions: new BehaviorSubject([1, 1, 1]),
                bribePrice: 0,
                colonialOfficial: CreateColonialOfficial(0, 5, true),
                colonialOptions: {
                    1: true,
                    2: true,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 5,
                hasArrestBeenAttempted: false,
                isPiratePort: true,
                name: PortLocation.Nassau,
                provisionPrices: new BehaviorSubject([200, 100, 50]),
                reputation: 0,
                royalPardonPrice: 0,
                shipyardOptions: {
                    1: true,
                    2: true,
                    3: true,
                    4: true
                },
                willArrest: false,
                merchant: CreateMerchant(0, 5, true),
                writOfProtection: null,
                writOfProtectionPrice: 0
            },
            // A known pirate port with no love for the crown.
            {
                availableCrewToHire: new BehaviorSubject(new HireableCrew()),
                availableOfficersToHire: new BehaviorSubject(new HireableOfficers()),
                availableProvisions: new BehaviorSubject([1, 1, 1]),
                bribePrice: 0,
                colonialOfficial: CreateColonialOfficial(0, 3, true),
                colonialOptions: {
                    1: true,
                    2: false,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 3,
                hasArrestBeenAttempted: false,
                isPiratePort: true,
                name: PortLocation.NormanIsland,
                provisionPrices: new BehaviorSubject([200, 100, 50]),
                reputation: 0,
                royalPardonPrice: 0,
                shipyardOptions: {
                    1: false,
                    2: true,
                    3: true,
                    4: true
                },
                willArrest: false,
                merchant: CreateMerchant(0, 3, true),
                writOfProtection: null,
                writOfProtectionPrice: 0
            },
            // THE Crown port. Pirates will find no love here, but it's also where the real money can be found.
            {
                availableCrewToHire: new BehaviorSubject(new HireableCrew()),
                availableOfficersToHire: new BehaviorSubject(new HireableOfficers()),
                availableProvisions: new BehaviorSubject([1, 1, 1]),
                bribePrice: 0,
                colonialOfficial: CreateColonialOfficial(0, 10, false),
                colonialOptions: {
                    1: false,
                    2: false,
                    3: true,
                },
                connectedPorts: [],
                costScaleSize: 10,
                hasArrestBeenAttempted: false,
                isPiratePort: false,
                name: PortLocation.PortRoyal,
                provisionPrices: new BehaviorSubject([200, 100, 50]),
                reputation: 0,
                royalPardonPrice: 0,
                shipyardOptions: {
                    1: true,
                    2: false,
                    3: true,
                    4: true
                },
                willArrest: false,
                merchant: CreateMerchant(0, 10, false),
                writOfProtection: null,
                writOfProtectionPrice: 0
            },
            // A pirate stronghold with its very own castle.
            {
                availableCrewToHire: new BehaviorSubject(new HireableCrew()),
                availableOfficersToHire: new BehaviorSubject(new HireableOfficers()),
                availableProvisions: new BehaviorSubject([1, 1, 1]),
                bribePrice: 0,
                colonialOfficial: CreateColonialOfficial(0, 2, true),
                colonialOptions: {
                    1: false,
                    2: false,
                    3: false,
                },
                connectedPorts: [],
                costScaleSize: 2,
                hasArrestBeenAttempted: false,
                isPiratePort: true,
                name: PortLocation.Tortuga,
                provisionPrices: new BehaviorSubject([200, 100, 50]),
                reputation: 0,
                royalPardonPrice: 0,
                shipyardOptions: {
                    1: false,
                    2: false,
                    3: true,
                    4: false
                },
                willArrest: false,
                merchant: CreateMerchant(0, 2, true),
                writOfProtection: null,
                writOfProtectionPrice: 0
            }
        );
        this._currentPort = new BehaviorSubject<Port>(this._ports[0]);
        
        this.subscriptions.push(
            this._currentPort.subscribe(port => {
                this._setupPortContent(port);
            })
        );
    }

    /**
     * Establishes whether arrest is imminent this turn or not.
     * @returns True if the colonial official was replaced, False if they did their job and kept it.
     */
    private _rollForArrest(): boolean {
        const port = this._currentPort.value;
        if (!port) {
            return false;
        }
        // If an attempt hasn't already been made, there is no purchased protection, and reputation is low enough, arrest is possible.
        if (!port.hasArrestBeenAttempted && port.reputation < 0) {
            // Arrest is randomized and increases in chance as the negative reputation increases.
            port.willArrest = (Math.random() <= Math.abs(port.reputation));
            // One final check is make against the colonial official's willingness to arrest. If they don't, they might be replaced.
            const willArrest = port.willArrest;
            port.willArrest = ((Math.random() * 10) < port.colonialOfficial.arrestInclination);
            if (willArrest && !port.willArrest) {
                // TODO: Replace the colonial official for not doing his job, and communicate the change to the player.
                return true;
            }
        } else {
            port.willArrest = false;
        }

        // If player has a high enough cunning skill, they may disguise well enough to avoid capture this turn.
        if (port.willArrest) {
            let cunningStat = 0;
            playerManager.getPlayerStats().pipe(take(1)).subscribe(stats => cunningStat = stats.Cunning);
            // If the random roll is below player's cunning stat, they avoid imminent arrest.
            port.willArrest = Math.floor(Math.random() * 10) < cunningStat ? false : true;
        }

        return false;
    }

    private _setupPortContent(port: Port): void {
        if (port.name !== PortLocation.AtSea) {
            port.availableCrewToHire.next(new HireableCrew(port.reputation, port.costScaleSize));
            port.availableOfficersToHire.next(new HireableOfficers(port.reputation, port.costScaleSize));
            AdjustColonialOfficial(port.colonialOfficial, port.reputation, port.costScaleSize, port.isPiratePort);
            AdjustMerchant(port.merchant, port.reputation, port.costScaleSize, port.isPiratePort);
            // Min will be bribeResistance of official times $1000 times difficulty. Max will what's left out of 100 when rep is removed and all divided by 10.
            const bribePrice = (this._difficulty * 1000) * (Math.ceil(Math.random() * ((Math.floor((100 - port.reputation) / 10)) - port.colonialOfficial.bribeResistance) + port.colonialOfficial.bribeResistance));
            port.bribePrice = bribePrice <= 0 ? (this._difficulty * 1000) : bribePrice;
            // Royal pardon is based entirely off crown rep which affects reputation in non-pirate ports. The lower, the more expensive.
            const royalPardonPrice = (this._difficulty * 10000) + (port.isPiratePort ? 100000 : (port.reputation * -1000))
            port.royalPardonPrice = royalPardonPrice <= 0 ? (this._difficulty * 10000) : royalPardonPrice;
            // Writ of protection is agnostic to pirate affiliation and only applies to reputation
            port.writOfProtectionPrice = 1000 + (Math.floor((100 - port.reputation) / 10)) * (this._difficulty * 100);
        }
        // TODO: Establish how much shipyard can spend on buying player ships.
        // TODO: Establish how much money port is willing to spend on buying looted cargo.
        // TODO: Establish local prices for buying each type of local cargo.
        // TODO: Establish which special items player can buy.
        // TODO: Establish the ships available for purchase.
        // TODO: Establish how many armor upgrades are available.
        // TODO: Establish how many cannon of each type are available for purchase.
    }

    /**
     * Called when an arrest was attempted regardless of its outcome. Prevents repeat attempts every turn.
     */
    public arrestAttempted(): void {
        const port = this._currentPort.value;
        if (!port) {
            return;
        }
        port.hasArrestBeenAttempted = true;
        port.willArrest = false;
    }

    /**
     * Pays a bribe to the port's official if the player's balance is sufficient.
     * @param balance the player's current balance.
     */
    public buyBribe(balance: number): number {
        const port = this._currentPort.value;
        const remainingBalance = balance - port.bribePrice;

        if (remainingBalance < 0) {
            return balance;
        }

        this._hasBribe = true;
        return remainingBalance;
    }

    /**
     * Buy's a writ of protection at this port if 
     * @param balance the player's current balance.
     */
    public buyWrit(balance: number): number {
        const port = this._currentPort.value;
        const remainingBalance = balance - port.writOfProtectionPrice;

        if (remainingBalance < 0) {
            return balance;
        }

        port.writOfProtection = {
            originalCost: port.writOfProtectionPrice,
            port: port,
            turnsRemaining: BaseWritOfProtectionLifespan / this._difficulty
        };

        return remainingBalance;
    }

    /**
     * Called when player leaves port, so certain properties can be reset for their next visit.
     */
    public disembarkFromPort(): void {
        const port = this._currentPort.value;
        if (!port) {
            return;
        }
        port.hasArrestBeenAttempted = false;
        port.willArrest = false;
        this._hasBribe = false;
        this._currentPort.next(this._ports[0]);
        stateManager.changePortSceneState(PortSceneState.Menu, true);

        // Cancel the bribe as it only exist for one turn;
        this._hasBribe = false;
    }

    /**
     * Updates the current port to the one in which the player is arriving.
     * @param portName name of the port where the player is docked.
     */
    public enterPort(portName: PortLocation): void {
        const port = this._ports.find(p => p.name === portName) ?? this._ports[0];
        this._currentPort.next(port);
    }

    /**
     * Gets the port player is currently docked at or null if not at a port.
     * @returns the observable for current port to subscribe to while null means not at a port.
     */
    public getCurrentPort(): Observable<Port> {
        return this._currentPort.asObservable();
    }

    /**
     * Called each turn and either degrades or improves the player's reputation with each port depending on their affiliation.
     * @param infamy amount of infamy player currently has.
     * @param crownFavor amount of crown favor the player currently has.
     */
    public updatePortReputation(infamy: number, crownFavor: number): void {
        this._ports.forEach(port => {
            port.reputation += port.isPiratePort ? (infamy - crownFavor) / 100 : (crownFavor - infamy) / 100;
            // Update the port's writ since it has a limited lifespan even outside of player being in port.
            const writ = port.writOfProtection ?? { turnsRemaining: 0 };
            writ.turnsRemaining > 1 ? writ.turnsRemaining-- : port.writOfProtection = null;
        });
    }

    /**
     * Lets the port manager know what the game's difficulty level is.
     * @param diff new difficulty level chosen by player.
     */
    public updateDifficultyLevel(diff: number): void {
        if (diff < 1 || diff > 4) {
            return;
        }
        
        this._difficulty = diff;
    }

    /**
     * Each turn spent at a port starting with the player's arrival reshuffles the possibilities.
     */
    public updatePortTurn(): void {
        const port = this._currentPort.value;
        if (!port) {
            return;
        }
        
        // Check arrest potential.
        !(this._hasBribe || port.writOfProtection) ? this._rollForArrest() : null;

        // Cancel the bribe as it only exist for one turn;
        this._hasBribe = false;

        port.merchant.mood = MoodToMouth.Pleased;
    }
}

export const portManager = new PortManager();