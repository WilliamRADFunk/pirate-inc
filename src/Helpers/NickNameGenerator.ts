import { uniqueNamesGenerator, adjectives, colors, animals, names } from 'unique-names-generator';

// Will make a "Adjective Animal" string
const adjAnimal = {
    dictionaries: [adjectives, animals]
};

// Will make a "Color Animal" string
const colorAnimal = {
    dictionaries: [colors, animals]
}

// Will make a "Adjective HumanName" string
const namesDic = {
    dictionaries: [adjectives, names]
}

// Will make a "Animal" string
const animalsDic = {
    dictionaries: [animals]
}

// Will make a "Color" string
const colorsDic = {
    dictionaries: [colors]
}

// Will make a "Piratey word" string
const pirateDic = {
    dictionaries: [[
        'stab',
        'spike',
        'barnacle',
        'irish',
        'dimwit',
        'blackeye',
        'poopdeck',
        'pegleg',
        'one-eye',
        'scalper',
        'speedy',
        'stumpy',
        'scurvy',
        'slim',
        'tiny',
        'limpy',
        'quickwit',
        'bones',
        'scheckles',
        'sticky Fingers',
        'whitebeard',
        'redbeard',
        'rustbeard',
        'moony',
        'flimflam',
        'ironfist',
        'lead Bottom',
        'three Ball',
        'six Finger'
    ]]
}

/**
 * A function that returns a random nick name.
 * @returns a two word space delimited string for a ship's name.
 */
export const NickNameGenerator: () => string = () => {
    let dicChoice = animalsDic;
    const random = Math.random();
    if (random < 0.15) {
        dicChoice = colorAnimal;
    } else if (random < 0.30) {
        dicChoice = namesDic;
    } else if (random < 0.45) {
        dicChoice = adjAnimal;
    } else if (random < 0.60) {
        dicChoice = colorsDic;
    } else if (random < 0.8) {
        dicChoice = pirateDic;
    }
    // Remove the _ characters this library generates and make sure each word has first char capitalized.
    return uniqueNamesGenerator(dicChoice).split('_').map(word => word.trim()).filter(x => !!x).map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}