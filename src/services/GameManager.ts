import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameState, SceneState, stateManager } from './StateManager';
import { playerManager } from './PlayerManager';
import { portManager } from './PortManager';
import { Crew } from '../Objects/Crew/Crew';
import { CrewMember } from '../Types/CrewMember';

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
     * The flag to disable all player options between the end of a turn and the start of the next.
     */
    private canPlayTurn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * The salary paid per turn to your fleet's carpenter.
     */
    private carpenterSalary: BehaviorSubject<number> = new BehaviorSubject(200);

    /**
     * The crew object that manages all things crew.
     */
    private crew: Crew = new Crew();

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
     * The maximum number of crew members on player can employee (limited by size and number of ships owned).
     */
    private maxCrewCount: BehaviorSubject<number> = new BehaviorSubject(25);

    /**
     * The salary paid per turn to your fleet's quartermaster.
     */
    private quartermasterSalary: BehaviorSubject<number> = new BehaviorSubject(300);

    /**
     * The morale of the officers.
     */
    private officersMorale: BehaviorSubject<number> = new BehaviorSubject(100);

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
     * List of active subscriptions within the service.
     */
    private subscriptions: Subscription[] = [];

    /**
     * The number of total food units of each category that player owns.
     */
    private totalProvisions: BehaviorSubject<[number, number, number]> = new BehaviorSubject([132, 74, 13]);

    // constructor() {
    //     // TODO: When there are officer slots to subscribe to, updateOfficerSalaries when they change.
    // }

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

    public async endTurn(): Promise<void> {
        this.canPlayTurn.next(false);

        let currState = "";
        stateManager.getSceneState().pipe(take(1)).subscribe(state => currState = state);

        switch(currState) {
            case SceneState.Port.toString(): {
                // Deduct officer salaries
                let oMorale = this.officersMorale.value;
                const oSalaries = this.officerSalaries.value;
                let balance = this.balance.value;
                let remainingBalance = balance - oSalaries;
                this.balance.next(remainingBalance >= 0 ? remainingBalance : 0);

                // Adjust officers' morale
                if (remainingBalance < 0) {
                    oMorale -= Math.ceil(Math.abs(remainingBalance / 1000));
                    this.officersMorale.next(oMorale);
                }
                
                // Roll officers morale event (leave)
                // If officers morale is below 50%, a random check is made on a 1d100.
                // If the score + current morale is higher than 50%, then no loass of officers.
                if (oMorale < 50 && ((Math.random() * 100) + oMorale) <= 50) {
                    // The order of officers leaving are (doctor, carpenter, and then quartermaster).
                    // TODO: should have actual slots for these officers and not simply salaries.
                    if (this.doctorSalary.value) {
                        // TODO: remove doctor from slot
                        this.doctorSalary.next(0);
                    } else if (this.carpenterSalary.value) {
                        // TODO: remove carpenter from slot
                        this.carpenterSalary.next(0);
                    } else if (this.quartermasterSalary.value) {
                        // TODO: remove quartermaster from slot
                        this.quartermasterSalary.next(0);
                        this.officersMorale.next(100);
                    }
                }

                // Apply wage affects and adjust crew morale accordingly.
                this.balance.next(this.crew.payDay(this.balance.value));
                
                // Update port reputation
                await zip(playerManager.getInfamy(), playerManager.getCrownFavor())
                    .pipe(take(1))
                    .subscribe(infAndCrownFav => {
                        portManager.updatePortReputation(infAndCrownFav[0], infAndCrownFav[1]);
                    });
                portManager.updatePortTurn();

                // TODO: Roll chance for arrest
                // let port;
                // portManager.getCurrentPort().pipe(take(1)).subscribe(p => port = p);


                // TODO: Roll chance for event
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
            // TODO: Need a blocking modal summary event to show all that happened (crew or officers leaving, etc.).
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
     * Gets the subscribable value of flag allowing player to start their next turn.
     * @returns observable of player's flag allowing player to start their next turn.
     */
    public getCanPlayTurn(): Observable<boolean> {
        return this.canPlayTurn.asObservable();
    }

    /**
     * Get a clone of the crew roster to be used in populating the crew manifest and similar uses.
     * @returns the clone of the crew list.
     */
    public getCrew(): Observable<CrewMember[]> {
        return this.crew.getCrew();
    }

    /**
     * Consolidates crew info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant crew info for the HUD.
     */
    public getCrewHUD(): Observable<{[key: string]: number}> {
        return this.crew.getHUD();
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
     * Gets the subscribable value of maximum crew allowed.
     * @returns observable of player's monetary balance.
     */
    public getMaxCrewCount(): Observable<number> {
        return this.maxCrewCount.asObservable();
    }

    /**
     * Gets the subscribable value of officers morale.
     * @returns observable of the officers morale.
     */
    public getOfficersMorale(): Observable<number> {
        return this.officersMorale.asObservable();
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
            this.crew.updateCrewWage(this.difficulty.value);
            this.crew.addCrew(new Array(48 / this.difficulty.value), true);
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