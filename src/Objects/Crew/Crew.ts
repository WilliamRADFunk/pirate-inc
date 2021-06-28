import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/micah';
import { Hair } from '@dicebear/micah/lib/options';

import { ConcernTypes, CrewMember, CrewMemberFeatures, getFeatures, MoodToEyebrows, MoodToEyes, MoodToMouth, MouthToMood } from '../../Types/CrewMember';
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
                this.crewCountLiving.next(this._crew.value.filter(c => c.isAlive).length);
                const moraleSum = crew.reduce((acc, crew) => {
                    return acc + crew.morale;
                }, 0);
                this.crewMorale.next(moraleSum / crew.length);
                this._updateCrewWages();
            })
        );
    }

    private _calculateDesertion(): void {
        const crew = this._crew.value;
        const remainingCrew = crew.filter(c => c.isAlive).filter(c => {
            // Roll crew morale event (leave)
            // If crew morale is below 50%, a random check is made on a 1d100.
            // If the score + current morale is higher than 50%, then no loass of crew.
            if (c.morale < 50 && ((Math.random() * 100) + c.morale) <= 50) {
                return false;
            }
            return true;
        });
        this._crew.next(remainingCrew);
    }

    private _getAvatar(features: CrewMemberFeatures, mood: MoodToMouth): string {
        return createAvatar(
            style,
            {
                backgroundColor: '#555',
                seed: features.seed,
                earringColor: [features.earringColor],
                eyes: [MoodToEyes[MouthToMood[mood]]],
                eyebrows: [MoodToEyebrows[MouthToMood[mood]]],
                eyebrowColor: [features.facialHairColor],
                facialHairColor: [features.facialHairColor],
                facialHairProbability: features.facialHairProbability ? 100 : 0,
                glassesProbability: 0,
                hair: [features.hair] as Hair,
                hairColor: [features.hairColor],
                mouth: [mood]
            });
    }

    private _getAvatarFeatures(first: string, nick: string, last: string): CrewMemberFeatures {
        const { earringColor, eyeColor, facialHairColor, facialHairProbability, hair, hairColor } = getFeatures();
        const seed =  `${first}-${nick}-${last}`;
        return {
            earringColor,
            eyeColor,
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
            const theCrew = this._crew.value.slice();
            const concernTypes = (Object.values(ConcernTypes) as unknown) as string[];
            for (let i = 0; i < newCrew.length; i++) {
                const newMember = {
                    avatar: '',
                    concern: Math.random() > 0.5 ? concernTypes[Math.floor(Math.random() * (concernTypes.length - 0.001))] : ConcernTypes.Empty,
                    deathBenefit: 0,
                    hasPaidDeathBenefit: false,
                    isAlive: true,
                    mood: MoodToMouth.Happy,
                    morale: Math.floor((Math.random() * 50) + 50),
                    nameFirst: random.middle(),
                    nameLast: random.last(),
                    nameNick: Math.random() > 0.5 ? NickNameGenerator() : '',
                    payOrder: i,
                    ship: null,
                    skills: {
                        cannoneering: Number(Math.random().toFixed(2)),
                        cleanliness: Number(Math.random().toFixed(2)),
                        greed: Number(Math.random().toFixed(2)),
                        hand2HandCombat: Number(Math.random().toFixed(2)),
                        sailing: Number(Math.random().toFixed(2)),
                        teamwork: Number(Math.random().toFixed(2))
                    },
                    turnsSinceDeath: 0
                } as CrewMember;
                newMember.mood = this._translateMood(newMember.morale);
                newMember.features = this._getAvatarFeatures(newMember.nameFirst, newMember.nameNick, newMember.nameLast)
                newMember.avatar = this._getAvatar(newMember.features, newMember.mood);
                theCrew.push(newMember);
            }
            this._crew.next(theCrew.reverse());
        }
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
        return zip(this.crewCountLiving, this.crewMorale, this.crewWages)
            .pipe(map(val => {
                return {
                    crewCountLiving: val[0],
                    crewMorale: val[1],
                    crewWages: val[2]
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
            const crew = this._crew.value.filter(c => c.isAlive);
            const sortedCrew = crew.sort((a, b) => a.payOrder - b.payOrder);
            sortedCrew.forEach(c => {
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
            this._crew.next(crew);
        }

        // Determine if and how many crew will leave, starting with those having the lowest morale.
        this._calculateDesertion();
        return balance;
    }

    /**
     * Sort the crew order based on the offered params.
     * @param key the first-level nested crewMember key to sort by.
     * @param secondaryKey the optional second-level nested crewMember key to sort by.
     * @param asc whether to sort in ascending order or not.
     */
    public sortCrewManifest(key: string, secondaryKey: string, asc: boolean): void {
        let crew = this._crew.value.slice();
        if (secondaryKey) {
            crew = crew.sort((a: any, b: any) => {
                const aVal = a[key][secondaryKey];
                const bVal = b[key][secondaryKey];
                if (aVal < bVal) {
                    return asc ? -1 : 1;
                }
                if (aVal > bVal) {
                    return asc ? 1 : -1;
                }
                return 0;
            });
        } else {
            crew = crew.sort((a: any, b: any) => {
                const aVal = a[key];
                const bVal = b[key];
                if (aVal < bVal) {
                    return asc ? -1 : 1;
                }
                if (aVal > bVal) {
                    return asc ? 1 : -1;
                }
                return 0;
            });
        }
        this._crew.next(crew);
    }

    /**
     * Updates base wage for a single crew member, caused primarily when the difficulty has changed.
     * @param difficulty the game difficulty level the player chose at start.
     */
    public updateCrewWage(difficulty: number): void {
        this.crewWage.next(BasePirateWage * difficulty);
        this._updateCrewWages();
    }

    /**
     * Alters the pay priority of one crew member in the list.
     * @param payNumber the payOrder index of the crew member whose position is being altered.
     * @param isDown flag to determine which of the two direction the change moves in.
     */
    public updatePayPriority(payNumber: number, isDown: boolean): void {
        const crew = this._crew.value.filter(c => c.isAlive).sort((a, b) => a.payOrder - b.payOrder);
        const originalCrewMember = crew[payNumber];
        if (isDown) {
            const crewMemberToSwapWith = crew[payNumber - 1];
            originalCrewMember.payOrder -= 1;
            crewMemberToSwapWith.payOrder += 1;
        } else {
            const crewMemberToSwapWith = crew[payNumber + 1];
            originalCrewMember.payOrder += 1;
            crewMemberToSwapWith.payOrder -= 1;
        }
        this._crew.next(this._crew.value);
    }
}