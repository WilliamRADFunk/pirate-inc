import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { SceneLocation } from '../Types/SceneLocation';

class GameManager {
    /**
     * The amount of money the player has at their disposal.
     */
    private balance: BehaviorSubject<number> = new BehaviorSubject(10000);
    /**
     * The bounty placed on player's head.
     */
    private bounty: BehaviorSubject<number> = new BehaviorSubject(500);
    /**
     * The salary paid per turn to your fleet's carpenter.
     */
    private carpenterSalary: BehaviorSubject<number> = new BehaviorSubject(200);
    /**
     * The cost per turn of a single crew member.
     */
    private crewWage: BehaviorSubject<number> = new BehaviorSubject(100);
    /**
     * The combined total of the crew's wages.
     */
    private crewWages: Subject<number> = new Subject();
    /**
     * The number of crew members on player's payroll.
     */
    private currentCrewCount: BehaviorSubject<number> = new BehaviorSubject(12);
    /**
     * The salary paid per turn to your fleet's doctor.
     */
    private doctorSalary: BehaviorSubject<number> = new BehaviorSubject(400);
    /**
     * The overall health of the player's fleet (ship damage) in percentage.
     */
    private fleetHealth: BehaviorSubject<number> = new BehaviorSubject(100);
    /**
     * The infamy associated with player.
     */
    private infamy: BehaviorSubject<number> = new BehaviorSubject(37);
    /**
     * The maximum number of crew members on player can employee (limited by size and number of ships owned).
     */
    private maxCrewCount: BehaviorSubject<number> = new BehaviorSubject(25);
    /**
     * The salary paid per turn to your fleet's quartermaster.
     */
     private quartermasterSalary: BehaviorSubject<number> = new BehaviorSubject(300);
    /**
     * The number of action points player has left for their turn.
     */
    private remainingActionPoints: BehaviorSubject<number> = new BehaviorSubject(5);
    /**
     * The combined total of the officer's salaries.
     */
    private officerSalaries: BehaviorSubject<number> = new BehaviorSubject(
        this.carpenterSalary.value + this.doctorSalary.value  + this.quartermasterSalary.value);
    /**
     * Tracks user's scene location, mostly for identifying which controls to make available on screen.
     */
    private sceneLocation: BehaviorSubject<string> = new BehaviorSubject(SceneLocation.StartMenu.toString());
    /**
     * The number of ships the player owns.
     */
    private shipCount: BehaviorSubject<number> = new BehaviorSubject(3);
    /**
     * The number of ships the player owns.
     */
    private ships: { health: number; }[] = [];
    /**
     * The number of total action points player is capable of having in a given turn.
     */
    private totalActionPoints: BehaviorSubject<number> = new BehaviorSubject(5);
    /**
     * The number of total food units of each category that player owns.
     */
    private totalProvisions: BehaviorSubject<[number, number, number]> = new BehaviorSubject([132, 74, 13]);

    constructor() {
        this.crewWages.next(this.crewWage.value * this.currentCrewCount.value);
    }

    private updateCrewWages(): void {
        this.crewWages.next(this.crewWage.value * this.currentCrewCount.value);
    }

    private updateOfficerSalaries(): void {
        this.officerSalaries.next(this.carpenterSalary.value + this.doctorSalary.value  + this.quartermasterSalary.value);
    }

    private updateFleetHealth(): void {
        this.fleetHealth.next(this.ships.filter(ship => !!ship).map(ship => ship.health).reduce((accum, val) => accum + val, 0) || 100);
    }

    public getBalance(): Observable<number> {
        return this.balance.asObservable();
    }

    public getCrewWages(): Observable<number> {
        return this.crewWages.asObservable();
    }

    public getCurrentCrewCount(): Observable<number> {
        return this.currentCrewCount.asObservable();
    }

    public getFleetHealth(): Observable<number> {
        return this.fleetHealth.asObservable();
    }

    public getInfamy(): Observable<number> {
        return this.infamy.asObservable();
    }

    public getMaxCrewCount(): Observable<number> {
        return this.maxCrewCount.asObservable();
    }

    public getOfficerSalaries(): Observable<number> {
        return this.officerSalaries.asObservable();
    }

    public getPlayerBounty(): Observable<number> {
        return this.bounty.asObservable();
    }

    public getProvisions(): Observable<[number, number, number]> {
        return this.totalProvisions.asObservable();
    }

    public getRemainingActionPoints(): Observable<number> {
        return this.remainingActionPoints.asObservable();
    }

    public getSceneLocation(): Observable<string> {
        return this.sceneLocation.asObservable();
    }

    public getShipCount(): Observable<number> {
        return this.shipCount.asObservable();
    }

    public getTotalActionPoints(): Observable<number> {
        return this.totalActionPoints.asObservable();
    }
}

export const gameManager = new GameManager();