import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameState, SceneState, stateManager } from './StateManager';
import { playerManager } from './PlayerManager';
import { portManager } from './PortManager';
import { Crew } from '../Objects/Crew/Crew';
import { CrewMember } from '../Types/CrewMember';
import { Fleet } from '../Objects/Ships/Fleet';
import { Barque } from '../Objects/Ships/Barque';
import { ShipNameGenerator } from '../Helpers/ShipNameGenerator';
import { PortLocation } from '../Types/Port';
import { Officers, OfficerType } from '../Objects/Officers/Officers';
import { Carpenter, Doctor, Quartermaster } from '../Types/Officers';

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
     * The crew object that manages all things crew.
     */
    private _crew: Crew = new Crew();

    /**
     * The player's choice of game difficulty.
     */
    private difficulty: BehaviorSubject<number> = new BehaviorSubject(2);

    /**
     * The ships the player owns.
     */
    private _fleet: Fleet = new Fleet();

    /**
     * The maximum number of crew members on player can employee (limited by size and number of ships owned).
     */
    private maxCrewCount: BehaviorSubject<number> = new BehaviorSubject(25);

    /**
     * The officers object that manages all things officers.
     */
    private _officers: Officers = new Officers();

    /**
     * The number of ships the player owns.
     */
    private shipCount: BehaviorSubject<number> = new BehaviorSubject(3);

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
    //     this.subscriptions.push(
    //         playerManager.getRemainingActionPoints().subscribe(ac => {

    //         })
    //     );
    // }

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
     * Adds existing crew members to the crew.
     * @param newCrew the new crew members to add to the roster.
     */
    public addCrew(newCrew: CrewMember[]): void {
        const crewCount = this._crew.getCrewCount() + newCrew.length;
        const maxCrew = this.maxCrewCount.value;
        if (crewCount >= maxCrew) {
            const excessCrewCount = crewCount - maxCrew;
            console.log('GameManager', 'addCrew', `Added crew exceeds player's maximum crew capacity by ${excessCrewCount}`);
            newCrew.length -= excessCrewCount;
        }
        this._crew.addCrew(newCrew, false);
        //TODO: Make sure the payorder increments appropriately.
        if (Math.random() < 0.05) {
            playerManager.removeActionPoints(1);
        }
    }

    /**
     * Adds existing officer.
     * @param officer the officer player has hired.
     * @param type the type of officer the player has hired.
     */
    public addOfficer(officer: (Carpenter | Doctor | Quartermaster | null), type: OfficerType): void {
        if (this._officers.hasOfficerType(type)) {
            this._officers.fireOfficer(type);
            this._officers.addOfficer(officer, type, false);
            return;
        }
        console.log('GameManager.addOfficer', 'Invalid officerType entered: ', type, 'for officer of type: ', officer?.type);
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
                // Apply salary affects and adjust officer morale accordingly.
                this.balance.next(this._officers.payDay(this.balance.value));

                // Apply wage affects and adjust crew morale accordingly.
                this.balance.next(this._crew.payDay(this.balance.value));

                // TODO: Reduce morale for unpaid death benefits and increase the turnsSinceDeath for each dead member unpaid.
                //      The amount owed should increase slightly for every turn player doesn't pay the death benefit.
                
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
        
        this.canPlayTurn.next(true);
    }

    /**
     * Removes the selected members of the crew, and adjust morale accordingly.
     * @param firedCrew the crew members to be 'let go' from the player's crew.
     */
    public fireCrew(firedCrew: CrewMember[]): void {
        this._crew.fireCrew(firedCrew ?? []);
    }

    /**
     * Removes the selected officer, and adjusts morale accordingly.
     * @param officerType the type of officer to let go: carpenter, doctor, quartermaster.
     */
    public fireOfficer(firedOfficerType: OfficerType): void {
        this._officers.fireOfficer(firedOfficerType);
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
     * Get a clone of the carpenter to be used in populating the officer manifest and similar uses.
     * @returns the clone of the carpenter.
     */
    public getCarpenter(): Observable<Carpenter | null> {
        return this._officers.getCarpenter();
    }

    /**
     * Get a clone of the crew roster to be used in populating the crew manifest and similar uses.
     * @returns the clone of the crew list.
     */
    public getCrew(): Observable<CrewMember[]> {
        return this._crew.getCrew();
    }

    /**
     * Consolidates crew info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant crew info for the HUD.
     */
    public getCrewHUD(): Observable<{[key: string]: number}> {
        return this._crew.getHUD();
    }

    /**
     * Gets the subscribable value of difficulty setting.
     * @returns observable of player's monetary balance.
     */
    public getDifficulty(): Observable<number> {
        return this.difficulty.asObservable();
    }

    /**
     * Get a clone of the doctor to be used in populating the officer manifest and similar uses.
     * @returns the clone of the doctor.
     */
    public getDoctor(): Observable<Doctor | null> {
        return this._officers.getDoctor();
    }

    /**
     * Consolidates fleet info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant fleet info for the HUD.
     */
    public getFleetHUD(): Observable<{[key: string]: number}> {
        return this._fleet.getHUD();
    }

    /**
     * Gets the subscribable value of maximum crew allowed.
     * @returns observable of player's monetary balance.
     */
    public getMaxCrewCount(): Observable<number> {
        return this.maxCrewCount.asObservable();
    }

    /**
     * Consolidates officers info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant officers info for the HUD.
     */
    public getOfficersHUD(): Observable<{[key: string]: number}> {
        return this._officers.getHUD();
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
     * Get a clone of the quartermaster to be used in populating the officer manifest and similar uses.
     * @returns the clone of the quartermaster.
     */
    public getQuartermaster(): Observable<Quartermaster | null> {
        return this._officers.getQuartermaster();
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
     * Opens a modal with a deeper description of the section requested in the param.
     * @param helpTitle the title of the help section to populate the help modal with.
     */
    public openHelpModal(helpTitle: string): void {
        // TODO: Open help modal
        console.log('openHelpModal', helpTitle);
    }

    /**
     * Pays the death benefits for all crew passed in up to available balance.
     * @param cMembers the dead crew members the player wishes to pay the death benefits for.
     */
    public payDeathBenefits(cMembers: CrewMember[]): void {
        this.balance.next(this._crew.payDeathBenefits(cMembers, this.balance.value));
    }

    /**
     * Sort the crew order based on the offered params.
     * @param key the first-level nested crewMember key to sort by.
     * @param secondaryKey the optional second-level nested crewMember key to sort by.
     * @param asc whether to sort in ascending order or not.
     */
    public sortCrewManifest(key: string, secondaryKey: string, asc: boolean): void {
        this._crew.sortCrewManifest(key, secondaryKey, asc);
    }

    /**
     * Gets the subscribable value of balance.
     * @returns observable of player's monetary balance.
     */
    public startGame(name: string): boolean {
        if (this.verifyPlayerName(name)) {
            this._crew.updateCrewWage(this.difficulty.value);
            this._crew.addCrew(new Array(48 / this.difficulty.value), true);

            this._fleet.addShip(new Barque(ShipNameGenerator()));
            
            this._officers.updateOfficerSalaryBase(this.difficulty.value);
            this._officers.addOfficer(null, OfficerType.Carpenter, true);
            this._officers.addOfficer(null, OfficerType.Doctor, true);
            this._officers.addOfficer(null, OfficerType.Quartermaster, true);

            playerManager.initiatePlayer(this.difficulty.value, name, {} as any);
            // Sets all port reputations to a default start based on difficulty
            // (normal mode aka difficulty = 2, renders pirate port rep = 20, and crown port = -20)
            portManager.updatePortReputation(Math.abs((1000 * this.difficulty.value) - 4000), 0);
            portManager.enterPort(PortLocation.Nassau);
            stateManager.changeGameState(GameState.Active);
            this.canPlayTurn.next(true);
            return true;
        }
        return false;
    }

    /**
     * Alters the pay priority of one crew member in the list.
     * @param payNumber the payOrder index of the crew member whose position is being altered.
     * @param isDown flag to determine which of the two direction the change moves in.
     */
    public updatePayPriority(payNumber: number, isDown: boolean): void {
        this._crew.updatePayPriority(payNumber, isDown);
    }
}

/**
 * Singleton service of the overall game manager.
 */
export const gameManager = new GameManager();