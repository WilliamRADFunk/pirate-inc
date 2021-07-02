import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/micah';
import { Hair } from '@dicebear/micah/lib/options';

import {
    ConcernTypes,
    CrewMember,
    CrewMemberFeatures,
    EarringColor,
    EyeColors,
    HairColors,
    HairStyles,
    MoodToEyebrows,
    MoodToEyes,
    MoodToMouth,
    MouthToMood
} from '../../Types/CrewMember';
import { BasePirateWage } from '../../Types/Constants';
import { NickNameGenerator } from '../../Helpers/NickNameGenerator';
import { GUID } from '../../Helpers/GUID';

const random = require('random-name-redux');

export function getAvatar(features: CrewMemberFeatures, mood: MoodToMouth, isAlive: boolean, isForHire?: boolean): string {
    return createAvatar(
        style,
        {
            backgroundColor: isForHire ? 'transparent' : (isAlive ? '#555' : '#900'),
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

export function getAvatarFeatures(first: string, nick: string, last: string): CrewMemberFeatures {
    const { earringColor, eyeColor, facialHairColor, facialHairProbability, hair, hairColor } = getFeatures() as CrewMemberFeatures;
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

/**
 * Picks a hair color, style, etc. from the list at random and applies it to both head and facial hair to keep them consistent.
 * @returns The partial style settings for the avatar generator to use for hair.
 */
 export function getFeatures(): Partial<CrewMemberFeatures> {
    // To keep head and facial hair consistent color.
    const hairColorIndex = Math.floor(Math.random() * (HairColors.length - 0.001));
    const hairStyleIndex = Math.floor(Math.random() * (HairStyles.length - 0.001));
    const earringColorIndex = Math.floor(Math.random() * (EarringColor.length - 0.001));
    const eyeColorIndex = Math.floor(Math.random() * (EyeColors.length - 0.001));
    return {
        earringColor: EarringColor[earringColorIndex],
        eyeColor: EyeColors[eyeColorIndex],
        facialHairColor: HairColors[hairColorIndex],
        facialHairProbability: Math.random() < 0.65,
        hair: HairStyles[hairStyleIndex],
        hairColor: HairColors[hairColorIndex]
    };
};

export function translateMood(morale: number): MoodToMouth {
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
        const theCrew = this._crew.value.slice();
        if (isRandom) {
            const concernTypes = (Object.values(ConcernTypes) as unknown) as string[];
            for (let i = 0; i < newCrew.length; i++) {
                // TODO: Remove dead crew member when no longer testing.
                const alive = Math.random() < 0.8;
                const newMember = {
                    avatar: '',
                    concern: (alive && Math.random() > 0.5) ? concernTypes[Math.floor(Math.random() * (concernTypes.length - 0.001))] : ConcernTypes.Empty,
                    deathBenefit: alive ? 0 : this.crewWage.value * 10,
                    hasPaidDeathBenefit: false,
                    id: GUID(),
                    isAlive: alive,
                    mood: MoodToMouth.Happy,
                    morale: alive ? Math.floor((Math.random() * 50) + 50) : 0,
                    nameFirst: random.firstMale(),
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
                    turnsSinceDeath: alive ? 0 : Math.floor(Math.random() * 10)
                } as CrewMember;
                newMember.mood = translateMood(newMember.morale);
                newMember.features = getAvatarFeatures(newMember.nameFirst, newMember.nameNick, newMember.nameLast)
                newMember.avatar = getAvatar(newMember.features, newMember.mood, newMember.isAlive);
                theCrew.push(newMember);
            }
            this._crew.next(theCrew.reverse());
        } else {
            theCrew.push(...newCrew);
            this._crew.next(theCrew);
        }
    }

    /**
     * Removes the selected members of the crew, and adjust morale accordingly.
     * @param firedCrew the crew members to be 'let go' from the player's crew.
     */
    public fireCrew(firedCrew: CrewMember[]): void {
        const remainingCrew = this._crew.value.filter(c => {
            return !firedCrew.find(fCrew => fCrew.id === c.id);
        });
        remainingCrew.forEach(c => {
            if (c.isAlive) {
                const random = Math.random();
                // 50% morale will lower per crew member.
                if (random < 0.5 && c.morale > 0) {
                    c.morale -= 1;
                    c.mood = translateMood(c.morale);
                    c.avatar = getAvatar(c.features, c.mood, c.isAlive);
                    // 20% each crew member's main gripe will be the loss of crewmates.
                    if (random < 0.1) {
                        c.concern = ConcernTypes.CrewmatesFired;
                    }
                }
            }
        });
        // Adjust payOrders to accomodate the new gap in the roster.
        let payCounter = 0;
        remainingCrew.slice()
            .sort((a, b) => a.payOrder - b.payOrder)
            .forEach(c => {
                if (c.isAlive) {
                    c.payOrder = payCounter;
                    payCounter++;
                }
            });
        this._crew.next(remainingCrew);
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
     * Gets the value of crew wage.
     * @returns value of crew wage.
     */
    public getCrewWage(): number {
        return this.crewWage.value;
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
                        c.mood = translateMood(c.morale);
                        c.avatar = getAvatar(c.features, c.mood, c.isAlive);
                    }
                });
            this._crew.next(crew);
        }

        // Determine if and how many crew will leave, starting with those having the lowest morale.
        this._calculateDesertion();
        return balance;
    }

    /**
     * Pays the death benefits for all crew passed in up to available balance.
     * @param cMembers the dead crew members the player wishes to pay the death benefits for.
     * @param balance the amount of money player currently has.
     * @returns the balance after paying crew death benefits.
     */
    public payDeathBenefits(cMembers: CrewMember[], balance: number): number {
        const crew = this._crew.value;
        const deadUnpaidCrew = crew.slice()
            .filter(c => !c.isAlive && !c.hasPaidDeathBenefit)
            .filter(c => cMembers.find(dCrew => dCrew.id === c.id));

        let remainingBalance = balance;
        // Pay those that the balance will allow.
        deadUnpaidCrew.forEach(c => {
                if (remainingBalance >= c.deathBenefit) {
                    remainingBalance -= c.deathBenefit;
                    c.hasPaidDeathBenefit = true;
                    c.turnsSinceDeath = 0;
                }
            });

        this._crew.next(crew);
        return remainingBalance;
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