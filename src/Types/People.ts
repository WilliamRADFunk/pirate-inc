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
 * All the physcial attributes all crew members have in their avatar.
 */
 export interface Features {
    earringColor: string;
    eyeColor: string
    facialHairColor: string;
    facialHairProbability: boolean;
    hair: string;
    hairColor: string;
    seed: string;
}