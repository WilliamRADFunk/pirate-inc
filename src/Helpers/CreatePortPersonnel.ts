import { GUID } from './GUID';
import { NickNameGenerator } from './NickNameGenerator';
import { ColonialOfficial, Merchant } from '../Types/Port';
import { getAvatar, getAvatarFeatures, MoodToMouth } from '../Types/People';

const random = require('random-name-redux');

export interface ColonialOfficialSkills {
    arrestInclination: number;
    haggleResistance: number;
}

export function AdjustColonialOfficial(official: ColonialOfficial, reputation: number, costScaleSize: number, isPiratePort: boolean): void {
    const statMax = costScaleSize;
    let statMin = (reputation / 10) + (isPiratePort ? 10 : -10);
    statMin = statMin >= statMax ? statMax - 1 : statMin;

    const prevArrestInclination = official.arrestInclination;
    const prevHaggleResistance = official.haggleResistance;
    
    const newArrestInclination = Math.floor(Math.random() * (statMax - statMin) + statMin);
    const newHaggleResistance = Math.floor(Math.random() * (statMax - statMin) + statMin);

    official.arrestInclination = (!prevArrestInclination || Math.abs(newArrestInclination - prevArrestInclination) <= 2)  ? newArrestInclination : prevArrestInclination;
    official.haggleResistance = (!prevHaggleResistance || Math.abs(newHaggleResistance - prevHaggleResistance) <= 2) ? newHaggleResistance : prevHaggleResistance;
}

export function AdjustMerchant(official: Merchant, reputation: number, costScaleSize: number, isPiratePort: boolean): void {
    const statMax = costScaleSize;
    let statMin = (reputation / 10) + (isPiratePort ? 10 : -10);
    statMin = statMin >= statMax ? statMax - 1 : statMin;
    
    const prevHaggleResistance = official.haggleResistance;
    const newHaggleResistance = Math.floor(Math.random() * (statMax - statMin) + statMin);

    official.haggleResistance = (!prevHaggleResistance || Math.abs(newHaggleResistance - prevHaggleResistance) <= 2) ? newHaggleResistance : prevHaggleResistance;
}

export function CreateColonialOfficial(reputation: number, costScaleSize: number, isPiratePort: boolean): ColonialOfficial {
    const colonialOfficial = {
        arrestInclination: 0,
        avatar: '',
        id: GUID(),
        mood: MoodToMouth.Pleased,
        nameFirst: random.firstMale(),
        nameLast: random.last(),
        nameNick: Math.random() > 0.5 ? NickNameGenerator() : '',
        haggleResistance: 0
    } as ColonialOfficial;
    colonialOfficial.features = getAvatarFeatures(colonialOfficial.nameFirst, colonialOfficial.nameNick, colonialOfficial.nameLast)
    colonialOfficial.avatar = getAvatar(colonialOfficial.features, colonialOfficial.mood, true, true);

    AdjustColonialOfficial(colonialOfficial, reputation, costScaleSize, isPiratePort);

    return colonialOfficial;
}

export function CreateMerchant(reputation: number, costScaleSize: number, isPiratePort: boolean): Merchant {
    const merchant = {
        avatar: '',
        id: GUID(),
        mood: MoodToMouth.Pleased,
        nameFirst: random.firstMale(),
        nameLast: random.last(),
        nameNick: Math.random() > 0.5 ? NickNameGenerator() : '',
        haggleResistance: 0
    } as Merchant;
    merchant.features = getAvatarFeatures(merchant.nameFirst, merchant.nameNick, merchant.nameLast)
    merchant.avatar = getAvatar(merchant.features, merchant.mood, true, true);
    
    AdjustMerchant(merchant, reputation, costScaleSize, isPiratePort);

    return merchant;
}