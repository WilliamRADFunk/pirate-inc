import { GUID } from '../../Helpers/GUID';
import { NickNameGenerator } from '../../Helpers/NickNameGenerator';
import { ConcernTypes, CrewMember, MoodToMouth } from '../../Types/CrewMember';
import { Crew, getAvatar, getAvatarFeatures, translateMood } from './Crew';

const random = require('random-name-redux');

export class HireableCrew extends Crew {
    constructor(quantity?: number) {
        super();

        const numOfRecruits = quantity ?? 0;
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
    }

    /**
     * Removes the hired crew member(s) from the eligible list of recruits.
     * @param crew the members of the recruit roster to remove from eligible crew.
     */
    public removeCrew(crew: CrewMember[]): void {
        const ogCrew = super.fireCrew(crew, true);
    }
}