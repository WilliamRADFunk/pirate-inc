import { Style } from '@dicebear/avatars';
import * as style from '@dicebear/micah';

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
 * Set list of possible gripes from crew members to match a bad mood in array form.
 */
export const ConcernTypes = ['Not Paid', 'Bad Food', 'Bored', 'Crewmates Fired', 'Untended Injury', ''] as const;

/**
 * Set list of possible gripes from crew members to match a bad mood in type form.
 */
export type Concern = typeof ConcernTypes[number];

/**
 * List of possible head hair and facial hair colors to be used by the avatar generator.
 */
export const HairColors = ['apricot', 'coast', 'topaz', 'canary', 'calm', 'azure', 'seashell', 'mellow', 'black', 'white'];

/**
 * Picks a hair color from the list at random and applies it to both head and facial hair to keep them consistent.
 * @returns The partial style settings for the avatar generator to use for hair.
 */
export const getHairColor: () => Partial<Style<style.Options>> = () => {
    // To keep head and facial hair consistent color.
    const hairColorIndex = Math.floor(Math.random() * 9.999);
    return {
        facialHairColor: [HairColors[hairColorIndex]],
        hairColor: [HairColors[hairColorIndex]]
    } as Partial<Style<style.Options>>;
};

/**
 * All the attributes every member of the crew must have.
 */
export interface CrewMember {
    avatar: string;
    concern: Concern;
    deathBenefit: number;
    hasPaidDeathBenefit: boolean;
    isAlive: boolean;
    mood: MoodToMouth;
    morale: number;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
    ship: Ship | null;
    turnsSinceDeath: number;
}