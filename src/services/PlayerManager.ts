import { BehaviorSubject, Observable } from 'rxjs';

export interface PlayerPositiveStats {
    Iron_Will: number;
    Cunning: number;
    Energetic: number;
    Silver_Tongue: number;
    People_Person: number;
}

export interface PlayerNegativeStats {
    Reckless: number;
    Cowardly: number;
    Lethargic: number;
    Close_Minded: number;
    Paranoid: number;
}

function statCheck(stat: number): number {
    return (stat > 1 && 9 > stat) ? stat : 5;
}

// Singleton to control the various aspects of the player object.
class PlayerManager {
    /**
     * The crownFavor associated with player.
     */
    private crownFavor: BehaviorSubject<number> = new BehaviorSubject(0);

    /**
     * game difficulty from which certain player stats are set.
     */
    private difficulty: number = 2;

    /**
     * The infamy associated with player.
     */
    private infamy: BehaviorSubject<number> = new BehaviorSubject(37);

    /**
     * The player object can only be set once. Once this flag is flipped to true, it can't be reset.
     */
    private initiated: boolean = false;

    /**
     * The name the player has chosen for themself.
     */
    private playerName: string = '';

    /**
     * The name the player has chosen for themself.
     */
    private playerStats: BehaviorSubject<PlayerPositiveStats & PlayerNegativeStats> = new BehaviorSubject({
        Iron_Will: 5,
        Cunning: 5,
        Energetic: 5,
        Silver_Tongue: 5,
        People_Person: 5,
        Cowardly: 5,
        Reckless: 5,
        Lethargic: 5,
        Close_Minded: 5,
        Paranoid: 5
    });

    /**
     * The number of action points player has left for their turn.
     */
    private remainingActionPoints: BehaviorSubject<number> = new BehaviorSubject(5);

    /**
     * The number of total action points player is capable of having in a given turn.
     */
    private totalActionPoints: BehaviorSubject<number> = new BehaviorSubject(5);

    /**
     * Gets the subscribable value of player's crownFavor.
     * @returns observable of player's crownFavor.
     */
    public getCrownFavor(): Observable<number> {
        return this.crownFavor.asObservable();
    }

    /**
     * Gets the subscribable value of player's infamy.
     * @returns observable of player's infamy.
     */
    public getInfamy(): Observable<number> {
        return this.infamy.asObservable();
    }

    /**
     * Allows subscribing to the player's pirate name.
     * @returns observable of the player's pirate name.
     */
    public getPlayerName(): string {
        return this.playerName;
    }

    /**
     * Allows subscribing to the player's remaining action points.
     * @returns observable of the player's remaining action points for current turn.
     */
    public getRemainingActionPoints(): Observable<number> {
        return this.remainingActionPoints.asObservable();
    }

    /**
     * Allows subscribing to the player's stats.
     * @returns observable of the player's stats.
     */
    public getPlayerStats(): Observable<PlayerPositiveStats & PlayerNegativeStats> {
        return this.playerStats.asObservable();
    }

    /**
     * Allows subscribing to the player's total possible action points.
     * @returns observable of the player's total possible action points for current turn.
     */
    public getTotalActionPoints(): Observable<number> {
        return this.totalActionPoints.asObservable();
    }

    public initiatePlayer(difficulty: number, name: string, stats: PlayerPositiveStats & PlayerNegativeStats): void {
        if (this.initiated) {
            return;
        }
        this.difficulty = difficulty;
        this.totalActionPoints.next(2 + this.difficulty);
        this.remainingActionPoints.next(this.totalActionPoints.value);
        this.playerName = name;
        this.playerStats.next({
            Iron_Will: statCheck(stats.Iron_Will),
            Cunning: statCheck(stats.Cunning),
            Energetic: statCheck(stats.Energetic),
            Silver_Tongue: statCheck(stats.Silver_Tongue),
            People_Person: statCheck(stats.People_Person),
            Cowardly: statCheck(stats.Cowardly),
            Reckless: statCheck(stats.Reckless),
            Lethargic: statCheck(stats.Lethargic),
            Close_Minded: statCheck(stats.Close_Minded),
            Paranoid: statCheck(stats.Paranoid)
        });
    }

    public removeActionPoints(ac: number): void {
        const currAC = this.remainingActionPoints.value;
        this.remainingActionPoints.next(currAC > 0 ? currAC - 1 : 0);
    }
}

/**
 * Singleton to control the various aspects of the player object.
 */
export const playerManager = new PlayerManager();