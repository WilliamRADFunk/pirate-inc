import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConcernTypes, getAvatar, getAvatarFeatures, MoodToMouth, translateMood } from '../../Types/People';
import { BaseCarpenterSalary, BaseDoctorSalary, BaseQuartermasterSalary } from '../../Types/Constants';
import { NickNameGenerator } from '../../Helpers/NickNameGenerator';
import { GUID } from '../../Helpers/GUID';
import { Carpenter, Doctor, Officer, OfficerSkill, Quartermaster } from '../../Types/Officers';

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
    private _carpenter: BehaviorSubject<Carpenter | null> = new BehaviorSubject<Carpenter | null> (null);

    /**
     * The cloned carpenter employed by the player.
     */
    private carpenter: BehaviorSubject<Carpenter | null> = new BehaviorSubject<Carpenter | null> (this._carpenter.value);

    /**
     * The doctor employed by the player.
     */
    private _doctor: BehaviorSubject<Doctor | null> = new BehaviorSubject<Doctor | null>(null);

    /**
     * The cloned doctor employed by the player.
     */
    private doctor: BehaviorSubject<Doctor | null> = new BehaviorSubject<Doctor | null>(this._doctor.value);

    /**
     * The quartermaster employed by the player.
     */
    private _quartermaster: BehaviorSubject<Quartermaster | null> = new BehaviorSubject<Quartermaster | null>(null);

    /**
     * The cloned quartermaster employed by the player.
     */
    private quartermaster: BehaviorSubject<Quartermaster | null> = new BehaviorSubject<Quartermaster | null>(this._quartermaster.value);

    /**
     * The average morale of the officers.
     */
    private officersMorale: BehaviorSubject<number> = new BehaviorSubject<number>(100);

    /**
     * The combined total of the officers' salaries.
     */
    private officerSalaries: BehaviorSubject<number> = new BehaviorSubject<number>(
        (this._carpenter.value?.salary ?? 0) + (this._doctor.value?.salary ?? 0) + (this._quartermaster.value?.salary ?? 0));

    /**
     * The salary modifier associated with the difficulty level.
     */
    private static _salaryBase: number = 0;

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
            console.log('Officers', '_calculateDesertion', 'Carpenter deserted due to low morale.');
        }

        const doctor = this._doctor.value;
        morale = doctor?.morale ?? 100;
        if (doctor && morale < 50 && ((Math.random() * 100) + morale) <= 50) {
            // TODO: Alert player the doctor has left their employ.
            this._doctor.next(null);
            console.log('Officers', '_calculateDesertion', 'Doctor deserted due to low morale.');
        }
        
        const quartermaster = this._quartermaster.value;
        morale = quartermaster?.morale ?? 100;
        if (quartermaster && morale < 50 && ((Math.random() * 100) + morale) <= 50) {
            // TODO: Alert player the quartermaster has left their employ.
            this._quartermaster.next(null);
            console.log('Officers', '_calculateDesertion', 'Quartermaster deserted due to low morale.');
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
     * @param isHire if true, recruit is a recruit for hire and should have a transparent background.
     */
    public addOfficer(newOfficer: Officer | null, officerType: OfficerType, isRandom?: boolean, isHire?: boolean): void {
        let officerToHire;
        let skills: { [key: string]: OfficerSkill<string> } = {};
        let salary = 0;
        switch(officerType) {
            case OfficerType.Carpenter: {
                officerToHire = this._carpenter;
                skills = {
                    repair: {
                        label: 'Repair',
                        rank: Math.ceil(Math.random() * 10)
                    },
                    diyMedicine: {
                        label: 'DIY Medicine',
                        rank: Math.ceil(Math.random() * 10)
                    }
                };
                salary = BaseCarpenterSalary * Officers._salaryBase * Math.floor((skills.repair.rank + skills.diyMedicine.rank) / 2);
                break;
            }
            case OfficerType.Doctor: {
                officerToHire = this._doctor;
                skills = {
                    medicine: {
                        label: 'Medicine',
                        rank: Math.ceil(Math.random() * 10)
                    }
                };
                salary = BaseDoctorSalary * Officers._salaryBase * skills.medicine.rank;
                break;
            }
            case OfficerType.Quartermaster: {
                officerToHire = this._quartermaster;
                skills = {
                    cargoDistribution: {
                        label: 'Cargo Distribution',
                        rank: Math.ceil(Math.random() * 10)
                    },
                    humanResourcing: {
                        label: 'Human Resources',
                        rank: Math.ceil(Math.random() * 10)
                    },
                    moraleManagement: {
                        label: 'Morale Management',
                        rank: Math.ceil(Math.random() * 10)
                    }
                };
                salary = BaseQuartermasterSalary * Officers._salaryBase * Math.floor((skills.cargoDistribution.rank + skills.humanResourcing.rank + skills.moraleManagement.rank) / 3);
                break;
            }
        }
        if (isRandom) {
            const concernTypes = (Object.values(ConcernTypes) as unknown) as string[];
            const newOfficer = {
                avatar: '',
                background: 'placeholder background story',
                concern: Math.random() > 0.5 ? concernTypes[Math.floor(Math.random() * (concernTypes.length - 0.001))] : ConcernTypes.Empty,
                id: GUID(),
                mood: MoodToMouth.Happy,
                morale: Math.floor((Math.random() * 50) + 50),
                nameFirst: random.firstMale(),
                nameLast: random.last(),
                nameNick: Math.random() > 0.5 ? NickNameGenerator() : '',
                salary: salary,
                skills: skills
            } as Officer;
            newOfficer.mood = translateMood(newOfficer.morale);
            newOfficer.features = getAvatarFeatures(newOfficer.nameFirst, newOfficer.nameNick, newOfficer.nameLast)
            newOfficer.avatar = getAvatar(newOfficer.features, newOfficer.mood, true, !!isHire);
            newOfficer.type = officerType;
            officerToHire.next(newOfficer as any);
        } else if (newOfficer) {
            newOfficer.type = officerType;
            officerToHire.next(newOfficer as any);
        }
    }

    /**
     * Removes the selected officer, and adjusts morale accordingly.
     * @param officerType the type of officer to let go: carpenter, doctor, quartermaster.
     * @param preventMoraleEffect allows the removal of an officer without affecting morale (usually the hiring officer version).
     */
    public fireOfficer(officerType: OfficerType, preventMoraleEffect?: boolean): void {
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
                    officer.avatar = getAvatar(officer.features, officer.mood, true);
                    // 10% each officer's main gripe will be the loss of an officer.
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
     * Consolidates officer info into a single observable for HUD use.
     * @returns an observable of an object containing the relevant officer info for the HUD.
     */
    public getHUD(): Observable<{[key: string]: number}> {
        return zip(this.officersMorale, this.officerSalaries)
            .pipe(map(val => {
                return {
                    officersMorale: val[0],
                    officersSalaries: val[1]
                };
            }));
    }

    /**
     * Quick check to determine if player is currently employing an officer of that type.
     * @param type the type of officer to check for.
     * @returns true if the officer exists and false if the slot is empty.
     */
    public hasOfficer(type: OfficerType): boolean {
        switch (type) {
            case OfficerType.Carpenter: {
                return !!this.carpenter.value;
            }
            case OfficerType.Doctor: {
                return !!this.doctor.value;
            }
            case OfficerType.Quartermaster: {
                return !!this.quartermaster.value;
            }
            default: {
                return false;
            }
        }
    }

    /**
     * Caclulates how much to pay officers, how much is left over, and how many of the officers will leave.
     * @param balance the current amount of money the player possesses.
     * @returns the amount of money player will possess after paying their officers.
     */
    public payDay(balance: number): number {
        const carpenter = this._carpenter.value;
        const doctor = this._doctor.value;
        const quartermaster = this._quartermaster.value;
        const officers = [quartermaster, doctor, carpenter].filter(off => !!off) as unknown as Officer[];
        let remainingBalance = balance;

        officers.forEach(off => {
            if (off.salary <= remainingBalance) {
                remainingBalance -= off.salary;
                return;
            }

            // The more owed to the officer the worse of a hit to morale it will be.
            remainingBalance -= off.salary;
            const morale = off.morale - Math.ceil(Math.abs(remainingBalance / 1000));
            off.morale = morale < 0 ? 0 : morale;

            // Prevent negative values for clean calculation of next officer's morale.
            remainingBalance = 0;
        });

        // Determine if and how many officers will leave, starting with those having the lowest morale.
        this._calculateDesertion();
        return remainingBalance;
    }

    /**
     * Updates base salary modifier for any officer, caused primarily when the difficulty has changed.
     * @param difficulty the game difficulty level the player chose at start.
     */
    public updateOfficerSalaryBase(difficulty: number): void {
        Officers._salaryBase = difficulty;
        this._updateOfficerSalaries();
    }
}