import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Carpenter, Doctor, Quartermaster } from '../../Types/Officers';
import { Officers, OfficerType } from './Officers';

export class HireableOfficers extends Officers {
    constructor(quantity?: number) {
        super();

        let numOfRecruits = quantity ?? 0;
        if (numOfRecruits === 3) {
            super.addOfficer(null, OfficerType.Carpenter, true);
            super.addOfficer(null, OfficerType.Doctor, true, true);
            super.addOfficer(null, OfficerType.Quartermaster, true, true);
        } else if (numOfRecruits === 2) {
            // Tie between Doctor and Quartermaster with Carpenters being common.
            Math.random() > 0.5
                ? super.addOfficer(null, OfficerType.Quartermaster, true, true)
                : super.addOfficer(null, OfficerType.Doctor, true, true);
            super.addOfficer(null, OfficerType.Carpenter, true, true);
        } else if (numOfRecruits) {
            // With only 1 possible officer, carpenter has highest chance, and the other two are tied as next in line.
            Math.random() < 0.75
                ? super.addOfficer(null, OfficerType.Carpenter, true, true)
                : (Math.random() > 0.5
                    ? super.addOfficer(null, OfficerType.Quartermaster, true, true)
                    : super.addOfficer(null, OfficerType.Doctor, true, true));
        }
    }

    /**
     * Allows the recruitable officers to be subscribed to in one observable.
     * @returns the combined three recruitable officers all in one updatable observable.
     */
    public getOfficers(): Observable<{ carpenter: Carpenter | null, doctor: Doctor | null, quartermaster: Quartermaster | null}> {
        return zip(super.getCarpenter(), super.getDoctor(), super.getQuartermaster())
            .pipe(map(val => {
                return {
                    carpenter: val[0],
                    doctor: val[1],
                    quartermaster: val[2]
                };
            }));
    }

    /**
     * Removes the hired officer from the eligible list of recruits.
     * @param officerType type of officer to remove from the recruit list.
     */
    public removeOfficer(officerType: OfficerType): void {
        super.fireOfficer(officerType, true);
    }
}