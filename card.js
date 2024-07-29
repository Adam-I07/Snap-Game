class Card {
    // Set structure of a playing card.
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    // Determines if the current card matches another card based on the match type.
    matches(card, matchType) {
        if (!card) return false;
        if (matchType === 'face') {
            return this.value === card.value;
        } else if (matchType === 'faceAndSuit') {
            return this.value === card.value && this.suit === card.suit;
        }
        return false;
    }

    // Returns the string representation e.g. "3 of Spades".
    toString() {
        return `${this.value} of ${this.suit}`;
    }
}

module.exports = Card;
