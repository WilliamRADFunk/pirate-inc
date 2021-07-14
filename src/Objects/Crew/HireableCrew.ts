import { GUID } from '../../Helpers/GUID';
import { NickNameGenerator } from '../../Helpers/NickNameGenerator';
import { CrewMember } from '../../Types/CrewMember';
import { ConcernTypes, getAvatar, getAvatarFeatures, MoodToMouth, translateMood } from '../../Types/People';
import { Crew } from './Crew';

const random = require('random-name-redux');

export class HireableCrew extends Crew {
    constructor(reputation?: number, costScaleSize?: number) {
        super();

        if (!reputation || reputation <= 0 || !costScaleSize) {
            return;
        }

        const costScale = costScaleSize * 10;
        const maxPossible = (reputation / 100) * costScale;

        const numOfRecruits = Math.floor(Math.random() * maxPossible);
        const recruits = [];
        const concernTypes = (Object.values(ConcernTypes) as unknown) as string[];
        for (let i = 0; i < numOfRecruits; i++) {
            const newMember = {
                avatar: '',
                concern: (Math.random() > 0.5) ? concernTypes[Math.floor(Math.random() * (concernTypes.length - 0.001))] : ConcernTypes.Empty,
                deathBenefit: 0,
                hasPaidDeathBenefit: false,
                id: GUID(),
                isAlive: true,
                mood: MoodToMouth.Happy,
                morale: Math.floor((Math.random() * 50) + 50),
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
                turnsSinceDeath: 0
            } as CrewMember;
            newMember.mood = translateMood(newMember.morale);
            newMember.features = getAvatarFeatures(newMember.nameFirst, newMember.nameNick, newMember.nameLast)
            newMember.avatar = getAvatar(newMember.features, newMember.mood, newMember.isAlive, true);
            recruits.push(newMember);
        }
        super.addCrew(recruits, false);

        console.log(`Available crew for hire: ${numOfRecruits}. CostScale: ${costScale}. Port Reputation: ${reputation}. MaxPossible: ${maxPossible}`);
    }

    /**
     * Removes the hired crew member(s) from the eligible list of recruits.
     * @param crew the members of the recruit roster to remove from eligible crew.
     */
    public removeCrew(crew: CrewMember[]): void {
        super.fireCrew(crew, true);
    }
}