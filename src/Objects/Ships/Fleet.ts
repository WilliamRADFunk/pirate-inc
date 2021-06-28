import { BehaviorSubject, Observable, Subscription, zip } from "rxjs";
import { map } from 'rxjs/operators';

import { Ship } from "./Ship";

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
                this._updateFleetHealth(ships);
            })
        );
    }

    /**
     * Updates total health points of player's entire fleet.
     * @param _ships the current cipy of the shi list.
     */
    private _updateFleetHealth(_ships?: Ship[]): void {
        const ships = _ships ?? this._ships.value;
        const healthSum = ships.reduce((acc, ship) => {
            return acc + ship.getHealth();
        }, 0);
        this.fleetHealth.next(healthSum / ships.length);
    }

    public addShip(ship: Ship): boolean {
        const ships = this._ships.value;
        if (!!~ships.findIndex(sh => sh.getName() === ship.getName())) {
            ships.push(ship);
            this._ships.next(ships);
            return true;
        }
        return false;
    }

    public getFirstFireDamage(): number {
        return 1;
    }

    /**
     * Gets the subscribable value of fleet health.
     * @returns observable of player's monetary balance.
     */
    public getFleetHealth(): Observable<number> {
        return this.fleetHealth.asObservable();
    }

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

    public removeShip(ship: Ship): boolean {
        const ships = this._ships.value;
        const shipIndex = ships.findIndex(sh => sh.getName() === ship.getName());
        if (!!~shipIndex) {
            return false;
        }
        ships.splice(shipIndex, 1);
        this._ships.next(ships);
        return true;
    }
}