import { BehaviorSubject, Observable, Subscription, zip } from "rxjs";
import { map } from 'rxjs/operators';

import { Ship } from "./Ship";

export interface FleetStats {
    armor: number;
    cannonCount: number;
    cargoCapacity: number;
    cargoCarried: number;
    crewMin: number;
    crewMax: number;
    currentCrew: number;
    firstFireDmg: number;
    health: number;
    maxCannon: number;
    speed: number;
    value: number;
}

export class Fleet {
    /**
     * The overall health of the player's fleet (ship damage) in percentage.
     */
    private fleetHealth: BehaviorSubject<number> = new BehaviorSubject(100);

    /**
     * The real list of the player's ships
     */
    private _ships: BehaviorSubject<Ship[]> = new BehaviorSubject([] as Ship[]);

    /**
     * The cloned list of the player's ships.
     */
    private ships: BehaviorSubject<Ship[]> = new BehaviorSubject(this._ships.value);

    /**
     * List of subscriptions class instance is listening on.
     */
    private subscriptions: Subscription[] = [];

    constructor() {
        this.subscriptions.push(
            this._ships.subscribe(ships => {
                this.ships.next(ships.map(s => JSON.parse(JSON.stringify(s))));
                this._updateFleetHealth();
            })
        );
    }

    /**
     * Updates total health points of player's entire fleet.
     */
    private _updateFleetHealth(): void {
        const ships = this._ships.value;
        const healthSum = ships.reduce((acc, ship) => {
            return acc + ship.getHealth();
        }, 0);
        const healthTotal = ships.reduce((acc, ship) => {
            return acc + ship.getHealthMax();
        }, 0);
        this.fleetHealth.next(Math.floor((healthSum / healthTotal) * 100));
    }

    /**
     * Adds a uniquely named ship to the player's fleet.
     * @param ship the ship to add to the player's fleet.
     * @returns True if there isn't a name clash. False if there is already a ship with that name in the fleet.
     */
    public addShip(ship: Ship): boolean {
        const ships = this._ships.value;
        if (!~ships.findIndex(sh => sh.getName() === ship.getName())) {
            console.log("SHIP!", ship);
            ships.push(ship);
            this._ships.next(ships);
            return true;
        }
        return false;
    }

    /**
     * calculates and returns the first fire damage of the player's fleet.
     * @returns the first fire damage of the player's fleet.
     */
    public getFirstFireDamage(): number {
        return 1;
    }

    /**
     * Gets the subscribable value of fleet health.
     * @returns observable of fleet health.
     */
    public getFleetHealth(): Observable<number> {
        return this.fleetHealth.asObservable();
    }

    /**
     * calculates and returns the speed of the player's fleet.
     * @returns the speed of the player's fleet.
     */
    public getFleetSpeed(): number {
        const ships = this._ships.value;
        let totalSpeedSum = 0;
        ships.forEach(ship => totalSpeedSum += ship.getTopSpeed());
        return totalSpeedSum / ships.length;
    }

    /**
     * Consolidates fleet info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant fleet info for the HUD.
     */
    public getHUD(): Observable<{[key: string]: number}> {
        return zip(this.fleetHealth)
            .pipe(map(val => {
                return {
                    fleetHealth: val[0]
                };
            }));
    }

    /**
     * Gets the subscribable value of ships in fleet.
     * @returns observable of list of ships in fleet.
     */
    public getShips(): Observable<Ship[]> {
        return this._ships.asObservable();
    }

    /**
     * Removes the ship from the player's fleet if present.
     * @param ship the ship to be removed for player's fleet.
     * @returns True if ship by that name was in the fleet. False if the ship couldn't be found.
     */
    public removeShip(ship: Ship): boolean {
        const ships = this._ships.value;
        const shipIndex = ships.findIndex(sh => sh.getName() === ship.getName());
        if (!!~shipIndex) {
            return false;
        }
        ships.splice(shipIndex, 1);
        this._ships.next(ships);
        // TODO: Put the crew somewhere else.
        // TODO: Put the cargo somewhere else.
        return true;
    }
    /**
     * Sort the ship order based on the offered params.
     * @param key the first-level nested fleet key to sort by.
     * @param secondaryKey the optional second-level nested fleet key to sort by.
     * @param asc whether to sort in ascending order or not.
     */
    public sortFleetManifest(key: string, secondaryKey: string, asc: boolean): void {
        let ships = this._ships.value.slice();
        if (secondaryKey) {
            ships = ships.sort((a: any, b: any) => {
                const aVal = a[key][secondaryKey];
                const bVal = b[key][secondaryKey];
                if (aVal < bVal) {
                    return asc ? -1 : 1;
                }
                if (aVal > bVal) {
                    return asc ? 1 : -1;
                }
                return 0;
            });
        } else {
            ships = ships.sort((a: any, b: any) => {
                const aVal = a[key];
                const bVal = b[key];
                if (aVal < bVal) {
                    return asc ? -1 : 1;
                }
                if (aVal > bVal) {
                    return asc ? 1 : -1;
                }
                return 0;
            });
        }
        this._ships.next(ships);
    }
}