const Card = require('./card');

class Deck {
    // Creates the number of deck of cards (52 cards) according to the number numDeck is set by user.
    constructor(numDecks = 1) {
        this.cards = [];
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        for (let i = 0; i < numDecks; i++) {
            for (const suit of suits) {
                for (const value of values) {
                    this.cards.push(new Card(suit, value));
                }
            }
        }
    }

    // Shuffles deck using Fisher-Yates Algorithm (reference: 2).
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Evenly distributes the cards to the number of players playing.
    deal(numPlayers) {
        const hands = Array.from({ length: numPlayers }, () => []);
        while (this.cards.length > 0) {
            for (let i = 0; i < numPlayers; i++) {
                if (this.cards.length > 0) {
                    hands[i].push(this.cards.pop());
                }
            }
        }
        return hands;
    }
}

module.exports = Deck;
