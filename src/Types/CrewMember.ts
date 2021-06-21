import { Ship } from '../Objects/Ships/Ship';

export enum MoodToMouth {
    Angry = 'frown',
    Disgruntled = 'sad',
    Uncertain = 'pucker',
    Pleased = 'smirk',
    Happy = 'smile'
}

export enum MouthToMood {
    'frown' = 'Angry',
    'sad' = 'Disgruntled',
    'pucker' = 'Uncertain',
    'smirk' = 'Pleased',
    'smile' = 'Happy'
}

export type Concern = 'Not Paid' | 'Bad Food' | 'Bored' | 'Crewmates Fired' | 'Untended Injury' | '';

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
    ship: Ship | null;
    turnsSinceDeath: number;
}