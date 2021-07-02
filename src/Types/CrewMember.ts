import { Ship } from '../Objects/Ships/Ship';

/**
 * A mapping to set facial expression (eyes) of avatar generated image to based off morale setting.
 */
export enum MoodToEyes {
    Angry = 'round',
    Disgruntled = 'round',
    Uncertain = 'round',
    Pleased = 'smiling',
    Happy = 'smiling'
}

/**
 * A mapping to set facial expression (eyebrows) of avatar generated image to based off morale setting.
 */
export enum MoodToEyebrows {
    Angry = 'down',
    Disgruntled = 'down',
    Uncertain = 'down',
    Pleased = 'up',
    Happy = 'up'
}

/**
 * A mapping to set facial expression (mouth) of avatar generated image to based off morale setting.
 */
export enum MoodToMouth {
    Angry = 'frown',
    Disgruntled = 'sad',
    Uncertain = 'pucker',
    Pleased = 'smirk',
    Happy = 'smile'
}

/**
 * A reverse mapping of MoodToMouth to make a readable version of morale.
 */
export enum MouthToMood {
    'frown' = 'Angry',
    'sad' = 'Disgruntled',
    'pucker' = 'Uncertain',
    'smirk' = 'Pleased',
    'smile' = 'Happy'
}

/**
 * Set list of possible gripes from crew members to match a bad mood.
 */
export enum ConcernTypes {
    BadFood = 'Bad Food',
    Bored = 'Bored',
    CrewmatesFired = 'Crewmates Fired',
    Empty = 'Empty',
    NotPaid = 'Not Paid',
    UntendedInjury = 'Untended Injury'
}

/**
 * List of possible head hair and facial hair colors to be used by the avatar generator.
 */
export const HairColors = ['apricot', 'coast', 'topaz', 'canary', 'calm', 'azure', 'seashell', 'mellow', 'black', 'white'];

/**
 * List of possible earing colors to be used by the avatar generator.
 */
export const EarringColor = ['mellow', 'silver'];

/**
 * List of possible eye colors to be used by the avatar generator.
 */
export const EyeColors = ['apricot', 'coast', 'topaz', 'lavender', 'sky', 'salmon', 'canary', 'calm', 'azure', 'seashell', 'mellow'];

/**
 * List of possible hairstyles the avatar generator supports.
 */
export const HairStyles = ['dougFunny', 'fonze', 'mrClean', 'mrT'];

/**
 * All the attributes every member of the crew must have.
 */
export interface CrewMember {
    avatar: string;
    concern: ConcernTypes;
    deathBenefit: number;
    features: CrewMemberFeatures;
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
 * All the physcial attributes all crew members have in their avatar.
 */
 export interface CrewMemberFeatures {
    earringColor: string;
    eyeColor: string
    facialHairColor: string;
    facialHairProbability: boolean;
    hair: string;
    hairColor: string;
    seed: string;
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