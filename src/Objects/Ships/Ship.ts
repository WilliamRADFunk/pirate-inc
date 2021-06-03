export type BowCanonType = "Long Nine" | "Explosive Carronade" | "Empty";

export type MainCanonType = 42 | 36 | 32 | 24 | 18 | 12 | 9 | 8 | 6 | 0;

export type ShipType =
    "Barque" |
    "Brig" |
    "Brigatine" |
    "Caravel" |
    "Carrack" |
    "Corvette" |
    "Cutter" |
    "Dhow" |
    "East Indiaman" |
    "Frigate" |
    "Galleon" |
    "Keltch" |
    "Man-O-War" |
    "Pinnace" |
    "Schooner" |
    "Slaver" |
    "Sloop";

export class Ship {
    private armorLevel: number = 0;

    private crewMax: number = 0;

    private crewMin: number = 0;

    private cannonTypeBow: BowCanonType = "Empty";

    private cannonTypeMain: MainCanonType = 0;

    private health: number = 100;

    private name: string = 'Unnamed';

    private topSpeed: number = 1;

    private type: ShipType;

    constructor(
        armor: number,
        crewMax: number,
        crewMin: number,
        name: string,
        topSpeed: number,
        type: ShipType,
        cannonTypeBow?: BowCanonType,
        cannonTypeMain?: MainCanonType,
        health?: number) {
        this.armorLevel = armor;
        this.crewMax = crewMax;
        this.crewMin = crewMin;
        this.name = name;
        this.topSpeed = topSpeed;
        this.type = type;
        this.cannonTypeBow = cannonTypeBow || "Empty";
        this.cannonTypeMain = cannonTypeMain || 0;
        this.health = health ?? 100;
    }

    public getArmorLevel(): number {
        return this.armorLevel;
    }

    public getBowCanonType(): string {
        return this.cannonTypeBow;
    }

    public getCrewMax(): number {
        return this.crewMax;
    }

    public getCrewMin(): number {
        return this.crewMin;
    }

    public getHealth(): number {
        return this.health;
    }

    public getMainCanonType(): string {
        return this.cannonTypeMain === 0 ? "Empty" : `${this.cannonTypeMain}-pounders`;
    }

    public getName(): string {
        return this.name;
    }

    public getTopSpeed(): number {
        return this.topSpeed;
    }

    public getType(): ShipType {
        return this.type;
    }
}