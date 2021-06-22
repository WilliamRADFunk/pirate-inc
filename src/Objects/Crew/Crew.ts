import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/micah';

import { ConcernTypes, CrewMember, CrewMemberFeatures, getHair, MoodToMouth } from '../../Types/CrewMember';
import { BasePirateWage } from '../../Types/Constants';
import { NickNameGenerator } from '../../Helpers/NickNameGenerator';

const random = require('random-name');

export class Crew {
    /**
     * The real list of the player's crew
     */
    private _crew: BehaviorSubject<CrewMember[]> = new BehaviorSubject([] as CrewMember[]);

    /**
     * The cloned list of the player's crew.
     */
    private crew: BehaviorSubject<CrewMember[]> = new BehaviorSubject(this._crew.value);

    /**
     * The number of crew members that died on player's watch.
     */
    private crewCountDead: BehaviorSubject<number> = new BehaviorSubject(0);

    /**
     * The number of crew members on player's payroll.
     */
    private crewCountLiving: BehaviorSubject<number> = new BehaviorSubject(0);

    /**
     * The morale of the crew.
     */
    private crewMorale: BehaviorSubject<number> = new BehaviorSubject(100);

    /**
     * The cost per turn of a single crew member.
     */
    private crewWage: BehaviorSubject<number> = new BehaviorSubject(0);

    /**
     * The combined total of the crew's wages.
     */
    private crewWages: BehaviorSubject<number> = new BehaviorSubject(0);

    /**
     * List of subscriptions class instance is listening on.
     */
    private subscriptions: Subscription[] = [];

    constructor() {
        this.subscriptions.push(
            this._crew.subscribe(crew => {
                this.crew.next(crew.map(c => JSON.parse(JSON.stringify(c))));
            })
        );
    }

    private _calculateDesertion(): void {
        const cMorale = this.crewMorale.value;
        const currCount = this.crewCountLiving.value;
        // Roll crew morale event (leave)
        // If crew morale is below 50%, a random check is made on a 1d100.
        // If the score + current morale is higher than 50%, then no loass of crew.
        if (cMorale < 50 && ((Math.random() * 100) + cMorale) <= 50) {
            // Percentage of crew that desert (1% - 5%)
            const lostCrewPercentage = Math.ceil(Math.ceil(Math.random() * 5) / 100);
            let currCrewCount = currCount;
            const lostCrew = Math.ceil(currCrewCount * lostCrewPercentage);
            currCrewCount -= lostCrew;

            this.crewCountLiving.next(currCrewCount > 0 ? currCrewCount : 0);
        }
        // If no crew remains, set morale to 100%
        if (!this.crewCountLiving.value) {
            this.crewMorale.next(100);
        }
    }

    private _getAvatar(features: CrewMemberFeatures, mood: MoodToMouth): string {
        return createAvatar(
            style,
            {
                backgroundColor: 'salmon',
                seed: features.seed,
                facialHairColor: [features.facialHairColor],
                facialHairProbability: features.facialHairProbability ? 100 : 0,
                glassesProbability: 0,
                hair: [features.hair as any],
                hairColor: [features.hairColor],
                mouth: [mood]
            });
    }

    private _getAvatarFeatures(first: string, nick: string, last: string): CrewMemberFeatures {
        const { facialHairColor, facialHairProbability, hair, hairColor } = getHair();
        const seed =  `${first}-${nick}-${last}`;
        return {
            facialHairColor,
            facialHairProbability,
            hair,
            hairColor,
            seed
        };
    }

    private _translateMood(morale: number): MoodToMouth {
        if (morale < 20) {
            return MoodToMouth.Angry;
        } else if (morale < 40) {
            return MoodToMouth.Disgruntled;
        } else if (morale < 60) {
            return MoodToMouth.Uncertain;
        } else if (morale < 80) {
            return MoodToMouth.Pleased;
        } else {
            return MoodToMouth.Happy;
        }
    }

    /**
     * Updates base wage for the total crew, caused primarily when the amount of crew has changed.
     */
    private _updateCrewWages(): void {
        this.crewWages.next(this.crewWage.value * this.crewCountLiving.value);
    }

    /**
     * Adds existing crew members to the crew or makes them up at random.
     * @param newCrew the new crew members to add to the roster.
     * @param isRandom if true, make up the crew at random.
     */
    public addCrew(newCrew: CrewMember[], isRandom?: boolean): void {
        if (isRandom) {
            const concernTypes = (Object.values(ConcernTypes) as unknown) as string[];
            for (let i = 0; i < newCrew.length; i++) {
                const newMember = {
                    avatar: '',
                    concern: Math.random() > 0.5 ? concernTypes[Math.floor(Math.random() * (concernTypes.length - 0.001))] : ConcernTypes.Empty,
                    deathBenefit: 0,
                    hasPaidDeathBenefit: false,
                    isAlive: true,
                    mood: MoodToMouth.Happy,
                    morale: Math.floor(Math.random() * (100 - 50) + 50),
                    nameFirst: random.middle(),
                    nameLast: random.last(),
                    nameNick: Math.random() > 0.5 ? NickNameGenerator() : '',
                    payOrder: i,
                    ship: null,
                    turnsSinceDeath: 0
                } as CrewMember;
                newMember.mood = this._translateMood(newMember.morale);
                newMember.features = this._getAvatarFeatures(newMember.nameFirst, newMember.nameNick, newMember.nameLast)
                newMember.avatar = this._getAvatar(newMember.features, newMember.mood);
                const theCrew = this._crew.value.slice();
                theCrew.push(newMember);
                this._crew.next(theCrew);
            }
        }
        this.crewCountLiving.next(this._crew.value.filter(c => c.isAlive).length);
        this._updateCrewWages();
    }

    /**
     * Get a clone of the crew roster to be used in populating the crew manifest and similar uses.
     * @returns the clone of the crew list.
     */
    public getCrew(): Observable<CrewMember[]> {
        return this.crew.asObservable();
    }

    /**
     * Gets the value of crew morale.
     * @returns value of the crew morale.
     */
    public getCrewMorale(): number {
        return this.crewMorale.value;
    }

    /**
     * Gets the value of crew wages.
     * @returns value of crew wages.
     */
    public getCrewWages(): number {
        return this.crewWages.value;
    }

    /**
     * Gets the value of current dead crew count.
     * @returns value of current dead crew count
     */
    public getDeadCrewCount(): number {
        return this.crewCountDead.value;
    }

    /**
     * Consolidates crew info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant crew info for the HUD.
     */
    public getHUD(): Observable<{[key: string]: number}> {
        return zip(this.crewCountLiving, this.crewWages)
            .pipe(map(val => {
                return {
                    crewCountLiving: val[0],
                    crewWages: val[1]
                };
            }));
    }

    /**
     * Gets the value of current living crew count.
     * @returns value of current living crew count.
     */
    public getLivingCrewCount(): number {
        return this.crewCountLiving.value;
    }

    /**
     * Caclulates how much to pay crew, how much is left over, and how many of the crew will leave.
     * @param balance the current amount of money the player possses.
     * @returns the amount of money player will possess after paying their crew.
     */
    public payDay(balance: number): number {
        // Deduct crew wages
        const cWages = this.crewWages.value;
        const remainingBalance = balance - cWages;
        balance = remainingBalance >= 0 ? remainingBalance : 0;

        // Positive amount means player could pay in full. Negative will lower morale.
        if (remainingBalance < 0) {
            const wage = this.crewWage.value;
            let amountToSpend = cWages - balance;
            const crew = this._crew.value
                .filter(c => c.isAlive)
                .sort((a, b) => a.payOrder - b.payOrder);
            crew.forEach(c => {
                    if (amountToSpend >= wage) {
                        amountToSpend -= wage;
                        if (c.concern === ConcernTypes.NotPaid) {
                            c.concern = ConcernTypes.Empty;
                        }
                    } else if (c.morale > 0) {
                        c.morale -= 1;
                        c.concern = ConcernTypes.NotPaid;
                        c.mood = this._translateMood(c.morale);
                        c.avatar = this._getAvatar(c.features, c.mood);
                    }
                });
            const moraleSum = crew.reduce((acc, crew) => {
                return acc + crew.morale;
            }, 0);
            this.crewMorale.next(moraleSum / crew.length);
            this._crew.next(crew);
        }

        // Determine if and how many crew will leave, starting with those having the lowest morale.
        this._calculateDesertion();
        return balance;
    }

    /**
     * Updates base wage for a single crew member, caused primarily when the difficulty has changed.
     * @param difficulty the game difficulty level the player chose at start.
     */
    public updateCrewWage(difficulty: number): void {
        this.crewWage.next(BasePirateWage * difficulty);
        this._updateCrewWages();
    }
}