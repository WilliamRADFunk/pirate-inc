import { Ship } from '../Objects/Ships/Ship';
import { ConcernTypes, Features, MoodToMouth } from './People';

/**
 * All the attributes every member of the crew must have.
 */
export interface CrewMember {
    avatar: string;
    concern: ConcernTypes;
    deathBenefit: number;
    features: Features;
    hasPaidDeathBenefit: boolean;
    id: string;
    isAlive: boolean;
    mood: MoodToMouth;
    morale: number;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
    payOrder: number;
    ship: Ship | null;
    skills: CrewMemberSkills;
    turnsSinceDeath: number;
}

/**
 * All the skills a crew member has during gameplay.
 */
 export interface CrewMemberSkills {
    /**
     * Used in crew average to determine +/- to cannon accuracy and potency during combat.
     */
    cannoneering: number;
    /**
     * Used in crew average to determine +/- to chance of disease on board ship.
     */
    cleanliness: number;
    /**
     * Used as +/- to determine if crew member will desert if not paid.
     */
    greed: number;
    /**
     * Used in crew average to determine +/- to boarding actions during combat.
     */
    hand2HandCombat: number;
    /**
     * Used in crew average to determine +/- for how fast and agile the vessels are during AtSea and Battle scenarios.
     */
    sailing: number;
    /**
     * Used in crew average to determine +/- to chance of in-fighting amongst the crew.
     */
    teamwork: number;
 }