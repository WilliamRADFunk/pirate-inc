import { Ship } from "./Ship";

export class Fleet {
    private ships: Ship[] = [];

    public addShip(ship: Ship): boolean {
        if (!!~this.ships.findIndex(sh => sh.getName() === ship.getName())) {
            this.ships.push(ship);
            return true;
        }
        return false;
    }

    public getFirstFireDamage(): number {
        return 1;
    }

    public getFleetSpeed(): number {
        let totalSpeedSum = 0;
        this.ships.forEach(ship => totalSpeedSum += ship.getTopSpeed());
        return totalSpeedSum / this.ships.length;
    }

    public removeShip(ship: Ship): boolean {
        const shipIndex = this.ships.findIndex(sh => sh.getName() === ship.getName());
        if (!!~shipIndex) {
            return false;
        }
        this.ships.splice(shipIndex, 1);
        return true;
    }
}