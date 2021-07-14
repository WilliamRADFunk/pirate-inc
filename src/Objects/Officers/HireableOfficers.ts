import { take } from 'rxjs/operators';
import { Officers, OfficerType } from './Officers';

export class HireableOfficers extends Officers {
    constructor(reputation?: number, costScaleSize?: number) {
        super();

        if (!reputation || reputation <= 0 || !costScaleSize) {
            return;
        }

        const costScale = costScaleSize * 10;
        const carpThreshold = 0.8;
        const docThreshold = 0.6;
        const qmcThreshold = 0.4;

        // Carpenter
        let sizeCheck = Math.floor(Math.random() * 100) <= costScale;
        let repCheck = Math.floor(Math.random() * 100) >= reputation;
        let officerCheck = Math.random() < carpThreshold;
        if (sizeCheck && repCheck && officerCheck) {
            super.addOfficer(null, OfficerType.Carpenter, true, true, costScaleSize);
            super.getCarpenter().pipe(take(1)).forEach(officer => {
                console.log(`Available carpenter for hire (Repair: ${officer?.skills?.repair.rank}, DIY Medicine: ${officer?.skills?.diyMedicine.rank}). CostScale: ${costScale}. Port Reputation: ${reputation}. Threshold: ${carpThreshold}`);
            });
        }

        // Doctor
        sizeCheck = Math.floor(Math.random() * 100) <= costScale;
        repCheck = Math.floor(Math.random() * 100) >= reputation;
        officerCheck = Math.random() < docThreshold;
        if (sizeCheck && repCheck && officerCheck) {
            super.addOfficer(null, OfficerType.Doctor, true, true, costScaleSize);
            super.getDoctor().pipe(take(1)).forEach(officer => {
                console.log(`Available doctor for hire (Medicine: ${officer?.skills?.medicine.rank}). CostScale: ${costScale}. Port Reputation: ${reputation}. Threshold: ${docThreshold}`);
            });
        }

        // Quartermaster
        sizeCheck = Math.floor(Math.random() * 100) <= costScale;
        repCheck = Math.floor(Math.random() * 100) >= reputation;
        officerCheck = Math.random() < qmcThreshold;
        if (sizeCheck && repCheck && officerCheck) {
            super.addOfficer(null, OfficerType.Quartermaster, true, true, costScaleSize);
            super.getQuartermaster().pipe(take(1)).forEach(officer => {
                console.log(`Available quartermaster for hire (Cargo Distribution: ${officer?.skills?.cargoDistribution.rank}, Human Resources: ${officer?.skills?.humanResourcing.rank}, Morale Management: ${officer?.skills?.moraleManagement.rank}). CostScale: ${costScale}. Port Reputation: ${reputation}. Threshold: ${qmcThreshold}`);
            });
        }
    }

    /**
     * Removes the hired officer from the eligible list of recruits.
     * @param officerType type of officer to remove from the recruit list.
     */
    public removeOfficer(officerType: OfficerType): void {
        super.fireOfficer(officerType, true);
    }
}