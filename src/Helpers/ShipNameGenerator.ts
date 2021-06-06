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
const adjNames = {
    dictionaries: [adjectives, names]
}

// Will make a "Color HumanName" string
const colorNames = {
    dictionaries: [colors, names]
}

/**
 * A function that returns a random ship name.
 * @returns a two word space delimited string for a ship's name.
 */
export const ShipNameGenerator: () => string = () => {
    let dicChoice = adjAnimal;
    const random = Math.random();
    if (random < 0.25) {
        dicChoice = colorAnimal;
    } else if (random < 0.5) {
        dicChoice = adjNames;
    } else if (random < 0.75) {
        dicChoice = colorNames;
    }
    // Remove the _ characters this library generates and make sure each word has first char capitalized.
    return uniqueNamesGenerator(dicChoice).split('_').map(word => word.trim()).filter(x => !!x).map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}