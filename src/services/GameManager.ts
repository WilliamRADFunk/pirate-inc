import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

import { GameState, stateManager } from './StateManager';
import { SceneLocation } from '../Types/SceneLocation';
import { BasePirateWage } from '../Types/Constants';
import { playerManager } from './PlayerManager';

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
    private crewWage: BehaviorSubject<number> = new BehaviorSubject(0);

    /**
     * The combined total of the crew's wages.
     */
    private crewWages: Subject<number> = new Subject();

    /**
     * The number of crew members on player's payroll.
     */
    private currentCrewCount: BehaviorSubject<number> = new BehaviorSubject(12);

    /**
     * The player's choice of game difficulty.
     */
    private difficulty: BehaviorSubject<number> = new BehaviorSubject(2);

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
     * The combined total of the officer's salaries.
     */
    private officerSalaries: BehaviorSubject<number> = new BehaviorSubject(
        this.carpenterSalary.value + this.doctorSalary.value  + this.quartermasterSalary.value);

    /**
     * Tracks user's scene location, mostly for identifying which controls to make available on screen.
     */
    private sceneLocation: BehaviorSubject<SceneLocation> = new BehaviorSubject(SceneLocation.Port as SceneLocation);

    /**
     * The number of ships the player owns.
     */
    private shipCount: BehaviorSubject<number> = new BehaviorSubject(3);

    /**
     * The number of ships the player owns.
     */
    private ships: { health: number; }[] = [];

    /**
     * The list of subscriptions, usually other manager services.
     */
    private subscriptions: Subscription[] = [];

    /**
     * The number of total food units of each category that player owns.
     */
    private totalProvisions: BehaviorSubject<[number, number, number]> = new BehaviorSubject([132, 74, 13]);

    constructor() {
        this.crewWage.next(BasePirateWage * this.difficulty.value);
        this.crewWages.next(this.crewWage.value * this.currentCrewCount.value);
    }

    /**
     * Updates base wage for a single crew member, caused primarily when the difficulty has changed.
     */
    private updateCrewWage(): void {
        this.crewWage.next(BasePirateWage * this.difficulty.value);
        this.updateCrewWages();
    }

    /**
     * Updates base wage for the total crew, caused primarily when the amount of crew has changed.
     */
    private updateCrewWages(): void {
        this.crewWages.next(this.crewWage.value * this.currentCrewCount.value);
    }

    /**
     * Updates combined salaries for all officers.
     */
    private updateOfficerSalaries(): void {
        this.officerSalaries.next(this.carpenterSalary.value + this.doctorSalary.value  + this.quartermasterSalary.value);
    }

    /**
     * Updates total health points of player's entire fleet.
     */
    private updateFleetHealth(): void {
        this.fleetHealth.next(this.ships.filter(ship => !!ship).map(ship => ship.health).reduce((accum, val) => accum + val, 0) || 100);
    }

    /**
     * Checks against list of profane and vulgar words to cut down on the number of offensive name choices.
     * @param name the name player has chosen and needs to be checked against.
     * @returns true if the chosen name is acceptable, false if it matches one of the entries in the list.
     */
    private verifyPlayerName(name: string): boolean {
        const badWords = [
            'asshole',
            'assholes',
            'fucker',
            'fuckers',
            'shit',
            'shits',
            'bitch',
            'bitches',
            'cock',
            'cocks',
            'cunt',
            'cunts'
        ];
        return !(!!~badWords.indexOf(name));
    }

    public changeDifficulty(newDiff: number): void {
        this.difficulty.next(newDiff);
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

    public getDifficulty(): Observable<number> {
        return this.difficulty.asObservable();
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

    public getSceneLocation(): Observable<SceneLocation> {
        return this.sceneLocation.asObservable();
    }

    public getShipCount(): Observable<number> {
        return this.shipCount.asObservable();
    }

    public loadGame(code: string): void {
        // Verify code and then load game.
    }

    public startGame(name: string): boolean {
        if (this.verifyPlayerName(name)) {
            this.updateCrewWage();
            playerManager.initiatePlayer(this.difficulty.value, name, {} as any);
            stateManager.changeGameState(GameState.Active);
            return true;
        }
        return false;
    }
}

export const gameManager = new GameManager();