import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameState, SceneState, stateManager } from './StateManager';
import { BasePirateWage } from '../Types/Constants';
import { playerManager } from './PlayerManager';

// Singleton service of the overall game manager.
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
     * The number of ships the player owns.
     */
    private shipCount: BehaviorSubject<number> = new BehaviorSubject(3);

    /**
     * The number of ships the player owns.
     */
    private ships: { health: number; }[] = [];

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

    /**
     * Update the difficulty setting to the user's new choice.
     * @param newDiff new difficulty setting for the game.
     */
    public changeDifficulty(newDiff: number): void {
        this.difficulty.next(newDiff);
    }

    public endTurn(): void {
        let currState = "";
        stateManager.getSceneState().pipe(take(1)).subscribe(state => currState = state);

        switch(currState) {
            case SceneState.Port.toString(): {
                // Deduct crew wages
                // Adjust crew morale
                // Update port reputation
                // Roll chance for arrest
                // Roll chance for event
                break;
            }
            case SceneState.AtSea.toString(): {
                // Deduct provisions
                // Adjust crew morale
                // Update port reputation
                // Roll chance for event
                break;
            }
            case SceneState.Battle.toString(): {
                // Fleet fires
                // Ammunition deducted
                // Enemy Fleet fires
                // Roll chance for event
                // Roll for enemy surrender or sunk ships
                break;
            }
        }
    }

    /**
     * Gets the subscribable value of balance.
     * @returns observable of player's monetary balance.
     */
    public getBalance(): Observable<number> {
        return this.balance.asObservable();
    }

    /**
     * Gets the subscribable value of crew wages.
     * @returns observable of player's monetary balance.
     */
    public getCrewWages(): Observable<number> {
        return this.crewWages.asObservable();
    }

    /**
     * Gets the subscribable value of current crew count.
     * @returns observable of player's monetary balance.
     */
    public getCurrentCrewCount(): Observable<number> {
        return this.currentCrewCount.asObservable();
    }

    /**
     * Gets the subscribable value of difficulty setting.
     * @returns observable of player's monetary balance.
     */
    public getDifficulty(): Observable<number> {
        return this.difficulty.asObservable();
    }

    /**
     * Gets the subscribable value of fleet health.
     * @returns observable of player's monetary balance.
     */
    public getFleetHealth(): Observable<number> {
        return this.fleetHealth.asObservable();
    }

    /**
     * Gets the subscribable value of player's infamy.
     * @returns observable of player's monetary balance.
     */
    public getInfamy(): Observable<number> {
        return this.infamy.asObservable();
    }

    /**
     * Gets the subscribable value of maximum crew allowed.
     * @returns observable of player's monetary balance.
     */
    public getMaxCrewCount(): Observable<number> {
        return this.maxCrewCount.asObservable();
    }

    /**
     * Gets the subscribable value of officer combined salaries.
     * @returns observable of player's monetary balance.
     */
    public getOfficerSalaries(): Observable<number> {
        return this.officerSalaries.asObservable();
    }

    /**
     * Gets the subscribable value of player's bounty.
     * @returns observable of player's monetary balance.
     */
    public getPlayerBounty(): Observable<number> {
        return this.bounty.asObservable();
    }

    /**
     * Gets the subscribable value of provisions.
     * @returns observable of player's monetary balance.
     */
    public getProvisions(): Observable<[number, number, number]> {
        return this.totalProvisions.asObservable();
    }

    /**
     * Gets the subscribable value of ship count.
     * @returns observable of player's monetary balance.
     */
    public getShipCount(): Observable<number> {
        return this.shipCount.asObservable();
    }

    /**
     * Loads a previous game using a save code.
     * @param code a save code with game data to load from.
     */
    public loadGame(code: string): void {
        // Verify code and then load game.
    }

    /**
     * Gets the subscribable value of balance.
     * @returns observable of player's monetary balance.
     */
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

/**
 * Singleton service of the overall game manager.
 */
export const gameManager = new GameManager();