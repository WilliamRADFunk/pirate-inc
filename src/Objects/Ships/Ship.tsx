import { Image } from 'react-bootstrap';

import { Cargo } from "../../Types/Cargo";
import { BowCanonType, MainCanonType, ShipType } from "../../Types/ShipDefaults";

export class Ship {
    private armorLevel: number = 0;

    private cannonCount: number = 0;

    private cannonTypeBow: BowCanonType = "Empty";

    private cannonTypeMain: MainCanonType = 0;

    private cargoCapacity: number = 100;

    private cargoCarried: Cargo[] = [];

    private costModifier: number = 1;

    private crewMax: number = 0;

    private crewMin: number = 0;

    private currentCrew: number = 0;

    private health: number = 100;

    private icon: JSX.Element = <Image src={''}></Image>;

    private maxCannonCount: number = 0;

    private maxHealth: number = 100;

    private name: string = 'Unnamed';

    private topSpeed: number = 1;

    private type: ShipType;

    constructor(
        armor: number,
        cargoCapacity: number,
        costModifier: number,
        crewMax: number,
        crewMin: number,
        iconUri: string,
        maxCannonCount: number,
        maxHealth: number,
        name: string,
        topSpeed: number,
        type: ShipType,
        cannonCount?: number,
        cannonTypeBow?: BowCanonType,
        cannonTypeMain?: MainCanonType,
        cargoCarried?: Cargo[],
        health?: number) {
        this.armorLevel = armor;
        this.cargoCapacity = cargoCapacity;
        this.costModifier = costModifier;
        this.crewMax = crewMax;
        this.crewMin = crewMin;
        this.icon = <Image src={iconUri}></Image>;
        this.maxCannonCount = maxCannonCount;
        this.maxHealth = maxHealth;
        this.name = name;
        this.topSpeed = topSpeed;
        this.type = type;
        this.cannonCount = cannonCount ?? 0;
        this.cannonTypeBow = cannonTypeBow ?? "Empty";
        this.cannonTypeMain = cannonTypeMain ?? 0;
        this.cargoCarried = cargoCarried ?? [];
        this.health = health || this.maxHealth;
    }

    public addMainCannons(cannons: number): boolean {
        if (this.cannonMainSlotsLeft() >= cannons) {
            this.cannonCount += cannons;
            return true;
        }
        return false;
    }

    public cannonMainSlotsLeft(): number {
        return this.maxCannonCount - this.cannonCount;
    }

    public changeBowCannon(type: BowCanonType): void {
        this.cannonTypeBow = type;
    }

    public changeMainCannon(type: MainCanonType): void {
        this.cannonTypeMain = type;
    }

    public getArmorLevel(): number {
        return this.armorLevel;
    }

    public getBowCanonType(): string {
        return this.cannonTypeBow;
    }

    public getCargoCapacity(): number {
        return this.cargoCapacity;
    }

    public getCargoCarried(): Cargo[] {
        return this.cargoCarried;
    }

    public getCostModifier(): number {
        return this.costModifier;
    }

    public getCrewMax(): number {
        return this.crewMax;
    }

    public getCrewMin(): number {
        return this.crewMin;
    }

    public getCrewCount(): number {
        return this.currentCrew;
    }

    public getFirstFireAccuracyScore(): [number, number, number] {
        if (this.cannonTypeBow === "Long Nine") {
            return [0.95, 0.85, 0.75];
        } else if (this.cannonTypeBow === "Explosive Carronade") {
            return [0.9, 0.5, 0.25];
        }
        return [0, 0, 0];
    }

    public getFirstFireDamageScore(): [number, number, number] {
        if (this.cannonTypeBow === "Long Nine") {
            return [30, 20, 10];
        } else if (this.cannonTypeBow === "Explosive Carronade") {
            return [80, 45, 35];
        }
        return  [0, 0, 0];
    }

    public getHealth(): number {
        return this.health;
    }

    public getHealthMax(): number {
        return this.maxHealth;
    }

    public getIcon(): JSX.Element {
        return this.icon;
    }

    public getMainCanonType(): string {
        return this.cannonTypeMain === 0 ? "Empty" : `${this.cannonTypeMain}-pounders`;
    }

    public getMainFireAccuracyScore(): [number, number, number] {
        const pounds = this.cannonTypeMain;
        return [(pounds * 0.95), (pounds * 0.75), (pounds * 0.6)];
    }

    public getMainFireDamageScore(): [number, number, number] {
        const pounds = this.cannonTypeMain;
        return [(pounds * 0.95), (pounds * 0.8), (pounds * 0.75)];
    }

    public getName(): string {
        return this.name;
    }

    public getTopSpeed(): number {
        const crewAvg = (this.crewMax + this.crewMin) / 2;
        const speed = (this.topSpeed * (this.cannonTypeMain / 100)) // The larger the cannon, the slower the ship
            - (this.cannonTypeBow !== "Empty" ? 1 : 0) // Having a bow cannon will lose a knot
            + (this.currentCrew >= crewAvg ? 1 : -1) // Having less than the middle possible crew will lose a know
            - ((this.maxHealth - this.health) / 100) // The greater the damage to the vessel, the slower it is
            - this.armorLevel; // The more armor plating the slower the vessel
        return speed < 1 ? 1 : speed; // Always a minimum of 1 knot.
    }

    public getType(): ShipType {
        return this.type;
    }

    public removeMainCannons(cannons: number): boolean {
        if (this.cannonCount - cannons >= 0) {
            this.cannonCount -= cannons;
            if (this.cannonCount === 0) {
                this.cannonTypeMain = 0;
            }
            return true;
        }
        return false;
    }
}