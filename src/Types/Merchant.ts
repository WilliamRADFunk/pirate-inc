import { ConcernTypes, Features, MoodToMouth } from "./People";

/**
 * All the attributes every member of the crew must have.
 */
 export interface Merchant {
    avatar: string;
    features: Features;
    id: string;
    mood: MoodToMouth;
    nameFirst: string;
    nameLast: string;
    nameNick: string;
    haggleResistance: number;
}