import { BehaviorSubject, Observable, Subscription, zip } from "rxjs";
import { map } from 'rxjs/operators';

import { Ship } from "./Ship";

export interface FleetStats {
    armor: number;
    cargoCapacity: number;
    cargoCarried: number;
    crewMin: number;
    crewMax: number;
    currentCrew: number;
    firstFireAccuracy: [number, number, number];
    firstFireDmg: [number, number, number];
    health: number;
    mainAccuracy: [number, number, number];
    mainDamage: [number, number, number];
    speed: number;
    value: number;
}

export class Fleet {
    /**
     * The player chosen difficulty level.
     */
    private _difficulty: number = 2;

    /**
     * The overall health of the player's fleet (ship damage) in percentage.
     */
    private _fleetHealth: BehaviorSubject<number> = new BehaviorSubject(100);

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
        this._fleetHealth.next(Math.floor((healthSum / healthTotal) * 100));
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
     * Calculates and returns the average armor of the player's fleet.
     * @returns the average armor of the player's fleet.
     */
    public getArmor(): number {
        const ships = this._ships.value;
        const armorSum = ships.reduce((acc, ship) => {
            return acc + ship.getArmorLevel();
        }, 0);
        return Math.floor(armorSum / ships.length);
    }

    /**
     * Calculates and returns the total cargo capacity allowed in the player's fleet.
     * @returns the total cargo capacity allowed in the player's fleet.
     */
    public getCargoCapacity(): number {
        const ships = this._ships.value;
        const cargoCapSum = ships.reduce((acc, ship) => {
            return acc + ship.getCargoCapacity();
        }, 0);
        return cargoCapSum;
    }

    /**
     * Calculates and returns the total cargo carried in the player's fleet.
     * @returns the total cargo carried in the player's fleet.
     */
    public getCargoCarried(): number {
        const ships = this._ships.value;
        const cargoCarriedSum = ships.reduce((acc, ship) => {
            return acc + (ship.getCargoCarried().reduce((sum, cargo) => {
                return sum += cargo.quantity;
            }, 0));
        }, 0);
        return cargoCarriedSum;
    }

    /**
     * Calculates and returns the total maximum crew allowed in the player's fleet.
     * @returns the total maximum crew allowed in the player's fleet.
     */
    public getCrewMax(): number {
        const ships = this._ships.value;
        const crewMaxSum = ships.reduce((acc, ship) => {
            return acc + ship.getCrewMax();
        }, 0);
        return crewMaxSum;
    }

    /**
     * Calculates and returns the total minimum crew needed in the player's fleet.
     * @returns the total minimum crew needed in the player's fleet.
     */
    public getCrewMin(): number {
        const ships = this._ships.value;
        const crewMinSum = ships.reduce((acc, ship) => {
            return acc + ship.getCrewMin();
        }, 0);
        return crewMinSum;
    }

    /**
     * Calculates and returns the total crew in the player's fleet.
     * @returns the total crew in the player's fleet.
     */
    public getCrewCount(): number {
        const ships = this._ships.value;
        const crewCountSum = ships.reduce((acc, ship) => {
            return acc + ship.getCrewCount();
        }, 0);
        return crewCountSum;
    }

    /**
     * Calculates and returns the first fire accuracy of the player's fleet.
     * @returns the first fire accuracy of the player's fleet.
     */
    public getFirstFireAccuracy(): [number, number, number] {
        const ships = this._ships.value;
        const mainDmgSum = ships.reduce((acc, ship) => {
            ship.getFirstFireAccuracyScore().forEach((val: number, index: number) => {
                acc[index] += val;
            });
            return acc;
        }, [0, 0, 0]);
        return [
            Math.floor(mainDmgSum[0] / ships.length),
            Math.floor(mainDmgSum[1] / ships.length),
            Math.floor(mainDmgSum[2] / ships.length)
        ];
    }

    /**
     * Calculates and returns the first fire damage of the player's fleet.
     * @returns the first fire damage of the player's fleet.
     */
    public getFirstFireDamage(): [number, number, number] {
        const ships = this._ships.value;
        const mainDmgSum = ships.reduce((acc, ship) => {
            ship.getFirstFireDamageScore().forEach((val: number, index: number) => {
                acc[index] += val;
            });
            return acc;
        }, [0, 0, 0]);
        return [
            Math.floor(mainDmgSum[0] / ships.length),
            Math.floor(mainDmgSum[1] / ships.length),
            Math.floor(mainDmgSum[2] / ships.length)
        ];
    }

    /**
     * Gets the subscribable value of fleet health.
     * @returns observable of fleet health.
     */
    public getFleetHealth(): Observable<number> {
        return this._fleetHealth.asObservable();
    }

    /**
     * Gets the value of fleet health.
     * @returns current fleet health.
     */
    public getFleetOnce(): number {
        return this._fleetHealth.value;
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
     * Calculates and returns the main fire accuracy of the player's fleet.
     * @returns the main fire accuracy of the player's fleet.
     */
    public getMainAccuracy(): [number, number, number] {
        const ships = this._ships.value;
        const mainDmgSum = ships.reduce((acc, ship) => {
            ship.getMainFireAccuracyScore().forEach((val: number, index: number) => {
                acc[index] += val;
            });
            return acc;
        }, [0, 0, 0]);
        return [
            Math.floor(mainDmgSum[0] / ships.length),
            Math.floor(mainDmgSum[1] / ships.length),
            Math.floor(mainDmgSum[2] / ships.length)
        ];
    }

    /**
     * Calculates and returns the average main damage of the player's fleet.
     * @returns the average main damage of the player's fleet.
     */
    public getMainDamage(): [number, number, number] {
        const ships = this._ships.value;
        const mainDmgSum = ships.reduce((acc, ship) => {
            ship.getMainFireDamageScore().forEach((val: number, index: number) => {
                acc[index] += val;
            });
            return acc;
        }, [0, 0, 0]);
        return [
            Math.floor(mainDmgSum[0] / ships.length),
            Math.floor(mainDmgSum[1] / ships.length),
            Math.floor(mainDmgSum[2] / ships.length)
        ];
    }

    /**
     * Consolidates fleet info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant fleet info for the HUD.
     */
    public getHUD(): Observable<{[key: string]: number}> {
        return zip(this._fleetHealth)
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
     * Calculates and returns the total value of the player's fleet.
     * @returns the total value of the player's fleet.
     */
    public getValue(): number {
        const ships = this._ships.value;
        const valueSum = ships.reduce((acc, ship) => {
            return acc + ship.getValue();
        }, 0);
        return valueSum;
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