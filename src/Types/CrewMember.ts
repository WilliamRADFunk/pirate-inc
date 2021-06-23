import { Ship } from '../Objects/Ships/Ship';

/**
 * A mapping to set facial expression of avatar generated image to based off morale setting.
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
 * List of possible hairstyles the avatar generator supports.
 */
export const HairStyles = ['dougFunny', 'fonze', 'mrClean', 'mrT'];

/**
 * Picks a hair color, style, etc. from the list at random and applies it to both head and facial hair to keep them consistent.
 * @returns The partial style settings for the avatar generator to use for hair.
 */
export const getHair = () => {
    // To keep head and facial hair consistent color.
    const hairColorIndex = Math.floor(Math.random() * (HairColors.length - 0.001));
    const hairStyleIndex = Math.floor(Math.random() * (HairStyles.length - 0.001));
    return {
        facialHairColor: HairColors[hairColorIndex],
        facialHairProbability: Math.random() < 0.65,
        hair: HairStyles[hairStyleIndex],
        hairColor: HairColors[hairColorIndex]
    };
};

/**
 * All the attributes every member of the crew must have.
 */
export interface CrewMember {
    avatar: string;
    concern: ConcernTypes;
    deathBenefit: number;
    features: CrewMemberFeatures;
    hasPaidDeathBenefit: boolean;
    isAlive: boolean;
    mood: MoodToMouth;
    morale: number;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
    payOrder: number;
    ship: Ship | null;
    turnsSinceDeath: number;
}

/**
 * All the physcial attributes all crew members have in their avatar.
 */
 export interface CrewMemberFeatures {
    facialHairColor: string;
    facialHairProbability: boolean;
    hair: string;
    hairColor: string;
    seed: string;
 }