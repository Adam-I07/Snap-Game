const readline = require('readline');

class Player {
    // Creates a new player instance with a given name.
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    // Plays a card from the player's hand.
    playCard() {
        return this.hand.shift();
    }

    // Receives cards and adds them to the player's hand.
    receiveCards(cards) {
        this.hand.push(...cards);
    }

    // Checks if the player has any cards left.
    hasCards() {
        return this.hand.length > 0;
    }

    // Finds and plays a matching card from the computer's hand based on the match type.
    // If no matching card is found, plays the top card from the hand.
    findMatchingCard(tablePile, matchType) {
        const matchChance = 0.5; // 50% chance to play a matching card
        if (Math.random() > matchChance || tablePile.length === 0) {
            return this.playCard();
        }
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i].matches(tablePile[tablePile.length - 1], matchType)) {
                return this.hand.splice(i, 1)[0];
            }
        }
        return this.playCard(); // No matching card found, play the top card
    }
}

class UserPlayer extends Player {
    // Sets the current state of the table pile for the user player.
    setTablePile(tablePile) {
        this.tablePile = tablePile;
    }

    // Allows the user to select and play a card from their hand.
    async playCard() {
        const topCard = this.tablePile.length > 0 ? this.tablePile[this.tablePile.length - 1].toString() : 'none';
        console.log(`${this.name}'s hand:`);
        this.hand.forEach((card, index) => {
            console.log(`${index + 1}: ${card.toString()}`);
        });
        console.log(`Top card on the pile: ${topCard}`);

        const cardIndex = await this.promptUser();
        return this.hand.splice(cardIndex, 1)[0];
    }

    // Prompts the user to select a card to play.
    promptUser() {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Select a card to play (number): ', (answer) => {
                const cardIndex = parseInt(answer) - 1;
                if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= this.hand.length) {
                    console.log('Invalid selection, please try again.');
                    rl.close();
                    resolve(this.promptUser());
                } else {
                    rl.close();
                    resolve(cardIndex);
                }
            });
        });
    }
}

module.exports = { Player, UserPlayer };
