import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { CrewMember } from '../../Types/CrewMember';
import { ConcernTypes, getAvatar, getAvatarFeatures, MoodToMouth, translateMood } from '../../Types/People';
import { BasePirateWage } from '../../Types/Constants';
import { NickNameGenerator } from '../../Helpers/NickNameGenerator';
import { GUID } from '../../Helpers/GUID';
import { Carpenter, Doctor, Officer, Quartermaster } from '../../Types/Officers';

const random = require('random-name-redux');

export enum OfficerType {
    Carpenter = 'Carpenter',
    Doctor = 'Doctor',
    Quartermaster = 'Quartermaster',
}

export class Officers {
    /**
     * The carpenter employed by the player.
     */
    private _carpenter: BehaviorSubject<Carpenter | null> = new BehaviorSubject(null);

    /**
     * The cloned carpenter employed by the player.
     */
    private carpenter: BehaviorSubject<Carpenter | null> = new BehaviorSubject(this._carpenter.value);

    /**
     * The doctor employed by the player.
     */
    private _doctor: BehaviorSubject<Doctor | null> = new BehaviorSubject(null);

    /**
     * The cloned doctor employed by the player.
     */
    private doctor: BehaviorSubject<Doctor | null> = new BehaviorSubject(this._doctor.value);

    /**
     * The quartermaster employed by the player.
     */
    private _quartermaster: BehaviorSubject<Quartermaster | null> = new BehaviorSubject(null);

    /**
     * The cloned quartermaster employed by the player.
     */
    private quartermaster: BehaviorSubject<Quartermaster | null> = new BehaviorSubject(this._quartermaster.value);

    /**
     * The average morale of the officers.
     */
    private officersMorale: BehaviorSubject<number> = new BehaviorSubject(100);

    /**
     * The combined total of the officers' salaries.
     */
    private officerSalaries: BehaviorSubject<number> = new BehaviorSubject(
        (this._carpenter.value?.salary ?? 0) + (this._doctor.value?.salary ?? 0) + (this._quartermaster.value?.salary ?? 0));

    /**
     * List of subscriptions class instance is listening on.
     */
    private subscriptions: Subscription[] = [];

    constructor() {
        this.subscriptions.push(
            this._carpenter.subscribe(carpenter => {
                this.carpenter.next(JSON.parse(JSON.stringify(carpenter)));
                this._updateOfficerMorale();
                this._updateOfficerSalaries();
            }),
            this._doctor.subscribe(doctor => {
                this.doctor.next(JSON.parse(JSON.stringify(doctor)));
                this._updateOfficerMorale();
                this._updateOfficerSalaries();
            }),
            this._quartermaster.subscribe(quartermaster => {
                this.quartermaster.next(JSON.parse(JSON.stringify(quartermaster)));
                this._updateOfficerMorale();
                this._updateOfficerSalaries();
            })
        );
    }

    private _calculateDesertion(): void {
        // Roll officer morale event (leave)
        // If officer morale is below 50%, a random check is made on a 1d100.
        // If the score + current morale is higher than 50%, then no loss of officer.
        
        const carpenter = this._carpenter.value;
        let morale = carpenter?.morale ?? 100;
        if (carpenter && morale < 50 && ((Math.random() * 100) + morale) <= 50) {
            // TODO: Alert player the carpenter has left their employ.
            this._carpenter.next(null);
        }

        const doctor = this._doctor.value;
        morale = doctor?.morale ?? 100;
        if (doctor && morale < 50 && ((Math.random() * 100) + morale) <= 50) {
            // TODO: Alert player the doctor has left their employ.
            this._doctor.next(null);
        }
        
        const quartermaster = this._quartermaster.value;
        morale = quartermaster?.morale ?? 100;
        if (quartermaster && morale < 50 && ((Math.random() * 100) + morale) <= 50) {
            // TODO: Alert player the quartermaster has left their employ.
            this._quartermaster.next(null);
        }
    }

    /**
     * Updates the average officer morale.
     */
    private _updateOfficerMorale(): void {
        const carp = this._carpenter.value;
        const quart = this._quartermaster.value;
        const doctor = this._doctor.value;
        const moraleCount = (doctor ? 1 : 0) + (carp ? 1 : 0) + (quart ? 1 : 0);
        const moraleSum = (doctor?.morale ?? 0) + (carp?.morale ?? 0) + (quart?.morale ?? 0);
        this.officersMorale.next(Math.floor(moraleSum / moraleCount));
    }

    /**
     * Updates total salaries of all employed officers, caused primarily when the officer positions have changed.
     */
    private _updateOfficerSalaries(): void {
        this.officerSalaries.next(
            (this._carpenter.value?.salary ?? 0) +
            (this._doctor.value?.salary ?? 0) +
            (this._quartermaster.value?.salary ?? 0));
    }

    /**
     * Adds existing officer or makes them up at random.
     * @param newOfficer the new officer to add to the roster.
     * @param officerType the type of officer to add: carpenter, doctor, quartermaster.
     * @param isRandom if true, make up the officer at random.
     */
    public addOfficer(newOfficer: Officer, officerType: OfficerType, isRandom?: boolean): void {
        const theCrew = this._crew.value.slice();
        if (isRandom) {
            const concernTypes = (Object.values(ConcernTypes) as unknown) as string[];
            let payOrder = 0;
            for (let i = 0; i < newCrew.length; i++) {
                // TODO: Remove dead crew member when no longer testing.
                const alive = Math.random() < 0.8;
                payOrder = alive ? payOrder + 1 : payOrder;
                const newMember = {
                    avatar: '',
                    concern: (alive && Math.random() > 0.5) ? concernTypes[Math.floor(Math.random() * (concernTypes.length - 0.001))] : ConcernTypes.Empty,
                    id: GUID(),
                    mood: MoodToMouth.Happy,
                    morale: alive ? Math.floor((Math.random() * 50) + 50) : 0,
                    nameFirst: random.firstMale(),
                    nameLast: random.last(),
                    nameNick: Math.random() > 0.5 ? NickNameGenerator() : '',
                    skills: {}
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
     * Removes the selected officer, and adjusts morale accordingly.
     * @param firedOfficer the officer to be 'let go' from the player's employ.
     * @param officerType the type of officer to let go: carpenter, doctor, quartermaster.
     * @param preventMoraleEffect allows the removal of an officer without affecting morale (usually the hiring officer version).
     */
    public fireOfficer(firedOfficer: Officer, officerType: OfficerType, preventMoraleEffect?: boolean): void {
        let officerToFire;
        let otherOfficers: BehaviorSubject<Officer>[] = [];
        switch(officerType) {
            case OfficerType.Carpenter: {
                officerToFire = this._carpenter;
                otherOfficers = [ this._doctor, this._quartermaster ].filter(off => !!off?.value) as unknown as BehaviorSubject<Officer>[];
                break;
            }
            case OfficerType.Doctor: {
                officerToFire = this._doctor;
                otherOfficers = [ this._carpenter, this._quartermaster ].filter(off => !!off?.value) as unknown as BehaviorSubject<Officer>[];
                break;
            }
            case OfficerType.Quartermaster: {
                officerToFire = this._quartermaster;
                otherOfficers = [ this._carpenter, this._doctor ].filter(off => !!off?.value) as unknown as BehaviorSubject<Officer>[];
                break;
            }
        }
        if (!officerToFire?.value) {
            return;
        }

        // Fire the officer.
        officerToFire.next(null);

        // Determine morale affect on the other officers.
        if (!preventMoraleEffect) {
            otherOfficers.forEach(off => {
                const officer = off.value;
                const random = Math.random();
                // 50% morale will lower per officer.
                if (random < 0.5 && officer.morale > 0) {
                    officer.morale -= 1;
                    officer.mood = translateMood(officer.morale);
                    officer.avatar = getAvatar(officer.features, officer.mood, officer.isAlive);
                    // 20% each officer's main gripe will be the loss of an officer.
                    if (random < 0.1) {
                        officer.concern = ConcernTypes.CrewmatesFired;
                    }

                    off.next(officer);
                }
            });
        }
    }

    /**
     * Get a clone of the carpenter the player has employed.
     * @returns the clone of the carpenter.
     */
    public getCarpenter(): Observable<Carpenter | null> {
        return this.carpenter.asObservable();
    }

    /**
     * Get a clone of the doctor the player has employed.
     * @returns the clone of the doctor.
     */
    public getDoctor(): Observable<Doctor | null> {
        return this.doctor.asObservable();
    }

    /**
     * Get a clone of the quartermaster the player has employed.
     * @returns the clone of the quartermaster.
     */
    public getQuartermaster(): Observable<Quartermaster | null> {
        return this.quartermaster.asObservable();
    }

    /**
     * Gets the value of officers morale.
     * @returns value of the officers morale.
     */
    public getOfficersMorale(): number {
        return this.officersMorale.value;
    }

    /**
     * Gets the value of officer wages.
     * @returns value of officer wages.
     */
    public getOfficersSalaries(): number {
        return this.officerSalaries.value;
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
    public updateOfficerSalaryBase(difficulty: number): void {
        this.salaryBase.next(BaseOfficerSalary * difficulty);
        this._updateOfficerSalaries();
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