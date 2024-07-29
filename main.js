const Game = require('./game');

// Allows to ask the user a question and return their input. (Reference: 3)
async function askQuestion(query) {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, answer => {
        rl.close();
        resolve(answer);
    }));
}

// Allow to ask the user a question and validate their response using the provided validation function.
async function getValidatedInput(query, validationFn) {
    let input;
    do {
        input = await askQuestion(query);
    } while (!validationFn(input));
    return input;
}

// Validation functions for various inputs used in the game setup.
function validateNumberOfPlayers(input) {
    const num = parseInt(input);
    return !isNaN(num) && num >= 2 && num <= 4;
}

function validateNumberOfDecks(input) {
    const num = parseInt(input);
    return !isNaN(num) && num >= 1 && num <= 4;
}

function validateMaxRounds(input) {
    const num = parseInt(input);
    return !isNaN(num) && num > 0;
}

function validateMatchType(input) {
    return input === 'face' || input === 'faceAndSuit';
}

// Start of the program
// Asks user numerous questions to set up the game then starts it with the user inputted settings
(async function main() {
    const numPlayers = await getValidatedInput('Enter number of players (2-4): ', validateNumberOfPlayers);
    const numDecks = await getValidatedInput('Enter number of decks (1-4): ', validateNumberOfDecks);
    const maxRounds = await getValidatedInput('Enter maximum number of rounds: ', validateMaxRounds);
    const matchType = await getValidatedInput('Enter match type (face/faceAndSuit): ', validateMatchType);

    const game = new Game(parseInt(numPlayers), parseInt(numDecks), parseInt(maxRounds), matchType);
    await game.playGame();
})();
