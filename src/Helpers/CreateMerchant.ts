import { GUID } from './GUID';
import { NickNameGenerator } from './NickNameGenerator';
import { Merchant } from '../Types/Merchant';
import { getAvatar, getAvatarFeatures, MoodToMouth } from '../Types/People';

const random = require('random-name-redux');

export function CreateMerchant(reputation: number, constScaleSize: number, isPiratePort: boolean): Merchant {
    const skillMax = constScaleSize;
    let skillMin = (reputation / 10) + (isPiratePort ? 10 : -10);
    skillMin = skillMin >= skillMax ? skillMax - 1 : skillMin;

    const merchant = {
        avatar: '',
        id: GUID(),
        mood: MoodToMouth.Pleased,
        nameFirst: random.firstMale(),
        nameLast: random.last(),
        nameNick: Math.random() > 0.5 ? NickNameGenerator() : '',
        haggleResistance: Math.floor(Math.random() * (skillMax - skillMin) + skillMin)
    } as Merchant;
    merchant.features = getAvatarFeatures(merchant.nameFirst, merchant.nameNick, merchant.nameLast)
    merchant.avatar = getAvatar(merchant.features, merchant.mood, true, true);

    return merchant;
}