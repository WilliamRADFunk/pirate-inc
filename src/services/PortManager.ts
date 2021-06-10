import { BehaviorSubject, Observable } from "rxjs";
import { take } from "rxjs/operators";

import { Port, PortLocation } from "../Types/Port";
import { playerManager } from "./PlayerManager";
import { PortSceneState, stateManager } from "./StateManager";

class PortManager {
    /**
     * The port where the player is currently docked. Will be null when they leave a port.
     */
    private currentPort: BehaviorSubject<Port | null> = new BehaviorSubject<Port | null>(null);

    /**
     * List of all the port object player can visit and interact with.
     */
    private ports: Port[] = [];

    constructor() {
        // Creates all the ports.
        this.ports.push(
            // Sort of a neutral port in that they are under the crown, but history suggests Black Beard used it.
            {
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
                reputation: 0,
                shipyardOptions: {
                    1: true, // Buy
                    2: true, // Sell
                    3: true, // Repair
                    4: false // Outfit
                },
                willArrest: false
            },
            // A crown port with no love for pirates which is often attacked by pirates.
            {
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
                reputation: 0,
                shipyardOptions: {
                    1: false,
                    2: true,
                    3: true,
                    4: true
                },
                willArrest: false
            },
            // While technically under the crown, it is the capital of the pirate republic under Benjamin Hornigold.
            {
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
                reputation: 0,
                shipyardOptions: {
                    1: true,
                    2: true,
                    3: true,
                    4: true
                },
                willArrest: false
            },
            // A known pirate port with no love for the crown.
            {
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
                reputation: 0,
                shipyardOptions: {
                    1: false,
                    2: true,
                    3: true,
                    4: true
                },
                willArrest: false
            },
            // THE Crown port. Pirates will find no love here, but it's also where the real money can be found.
            {
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
                reputation: 0,
                shipyardOptions: {
                    1: true,
                    2: false,
                    3: true,
                    4: true
                },
                willArrest: false
            },
            // A pirate stronghold with its very own castle.
            {
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
                reputation: 0,
                shipyardOptions: {
                    1: false,
                    2: false,
                    3: true,
                    4: false
                },
                willArrest: false
            }
        );
    }

    /**
     * Establishes whether arrest is imminent this turn or not.
     */
    private rollForArrest(): void {
        const port = this.currentPort.value;
        if (!port) {
            return;
        }
        // If an attempt hasn't already been made, there is no purchased protection, and reputation is low enough, arrest is possible.
        if (!port.hasArrestBeenAttempted && port.reputation < 0) {
            // Arrest is randomized and increases in chance as the negative reputation increases.
            port.willArrest = Math.random() <= Math.abs(port.reputation) ? true : false;

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
    }

    /**
     * Called when an arrest was attempted regardless of its outcome. Prevents repeat attempts every turn.
     */
    public arrestAttempted(): void {
        const port = this.currentPort.value;
        if (!port) {
            return;
        }
        port.hasArrestBeenAttempted = true;
        port.willArrest = false;
    }

    /**
     * Called when player leaves port, so certain properties can be reset for their next visit.
     */
    public disembarkFromPort(): void {
        const port = this.currentPort.value;
        if (!port) {
            return;
        }
        port.hasArrestBeenAttempted = false;
        port.willArrest = false;
        this.currentPort.next(null);
        stateManager.changePortSceneState(PortSceneState.Menu, true);
    }

    /**
     * Updates the current port to the one in which the player is arriving.
     * @param portName name of the port where the player is docked.
     */
    public enterPort(portName: PortLocation): void {
        const port = this.ports.find(p => p.name === portName) ?? null;
        this.currentPort.next(port);
    }

    /**
     * Gets the port player is currently docked at or null if not at a port.
     * @returns the observable for current port to subscribe to while null means not at a port.
     */
    public getCurrentPort(): Observable<Port | null> {
        return this.currentPort.asObservable();
    }

    /**
     * Called each turn and either degrades or improves the player's reputation with each port depending on their affiliation.
     * @param infamy amount of infamy player currently has.
     * @param crownFavor amount of crown favor the player currently has.
     */
    public updatePortReputation(infamy: number, crownFavor: number): void {
        this.ports.forEach(port => {
            port.reputation += port.isPiratePort ? (infamy - crownFavor) / 100 : (crownFavor - infamy) / 100;
        });
    }

    /**
     * Each turn spent at a port starting with the player's arrival reshuffles the possibilities.
     * @param hasWritOrBribe whether or not the player has used bribery or purchased a writ of protection to avoid arrest.
     */
    public updatePortTurn(hasWritOrBribe?: boolean): void {
        const port = this.currentPort.value;
        if (!port) {
            return;
        }
        
        // Check arrest potential.
        !hasWritOrBribe ? this.rollForArrest() : null;
    }
}

export const portManager = new PortManager();