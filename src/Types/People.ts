import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/micah';
import { Hair } from '@dicebear/micah/lib/options';

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

/**
 * Picks a hair color, style, etc. from the list at random and applies it to both head and facial hair to keep them consistent.
 * @returns The partial style settings for the avatar generator to use for hair.
 */
 export function getFeatures(): Partial<Features> {
    // To keep head and facial hair consistent color.
    const hairColorIndex = Math.floor(Math.random() * (HairColors.length - 0.001));
    const hairStyleIndex = Math.floor(Math.random() * (HairStyles.length - 0.001));
    const earringColorIndex = Math.floor(Math.random() * (EarringColor.length - 0.001));
    const eyeColorIndex = Math.floor(Math.random() * (EyeColors.length - 0.001));
    return {
        earringColor: EarringColor[earringColorIndex],
        eyeColor: EyeColors[eyeColorIndex],
        facialHairColor: HairColors[hairColorIndex],
        facialHairProbability: Math.random() < 0.65,
        hair: HairStyles[hairStyleIndex],
        hairColor: HairColors[hairColorIndex]
    };
};

export function translateMood(morale: number): MoodToMouth {
    if (morale < 20) {
        return MoodToMouth.Angry;
    } else if (morale < 40) {
        return MoodToMouth.Disgruntled;
    } else if (morale < 60) {
        return MoodToMouth.Uncertain;
    } else if (morale < 80) {
        return MoodToMouth.Pleased;
    } else {
        return MoodToMouth.Happy;
    }
}

export function getAvatar(features: Features, mood: MoodToMouth, isAlive: boolean, isForHire?: boolean): string {
    return createAvatar(
        style,
        {
            backgroundColor: isForHire ? 'transparent' : (isAlive ? '#5554' : '#9004'),
            seed: features.seed,
            earringColor: [features.earringColor],
            eyes: [MoodToEyes[MouthToMood[mood]]],
            eyebrows: [MoodToEyebrows[MouthToMood[mood]]],
            eyebrowColor: [features.facialHairColor],
            facialHairColor: [features.facialHairColor],
            facialHairProbability: features.facialHairProbability ? 100 : 0,
            glassesProbability: 0,
            hair: [features.hair] as Hair,
            hairColor: [features.hairColor],
            mouth: [mood]
        });
}

export function getAvatarFeatures(first: string, nick: string, last: string): Features {
    const { earringColor, eyeColor, facialHairColor, facialHairProbability, hair, hairColor } = getFeatures() as Features;
    const seed =  `${first}-${nick}-${last}`;
    return {
        earringColor,
        eyeColor,
        facialHairColor,
        facialHairProbability,
        hair,
        hairColor,
        seed
    };
}