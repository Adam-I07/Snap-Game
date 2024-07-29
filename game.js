const { Player, UserPlayer } = require('./player');
const Deck = require('./deck');

class Game {
    constructor(numPlayers, numDecks, maxRounds, matchType) {
        this.players = [];
        this.numPlayers = numPlayers;
        this.numDecks = numDecks;
        this.maxRounds = maxRounds;
        this.matchType = matchType;
        this.tablePile = [];
        this.roundsPlayed = 0;

        this.initialisePlayers();
        this.dealCards();
    }

    // Initialises the players in the game, one user player and the rest as computer players.
    initialisePlayers() {
        this.userPlayer = new UserPlayer('User');
        this.players.push(this.userPlayer);
        for (let i = 1; i < this.numPlayers; i++) {
            this.players.push(new Player(`Computer ${i}`));
        }
    }

    // Shuffles the deck(s) and deals the cards to the players.
    dealCards() {
        const deck = new Deck(this.numDecks);
        deck.shuffle();
        const hands = deck.deal(this.numPlayers);

        for (let i = 0; i < this.numPlayers; i++) {
            this.players[i].hand = hands[i];
        }
    }

    // Plays a single round of the game where each player plays one card.
    // The user player selects a card, while the computer players automatically choose their cards.
    async playRound() {
        this.userPlayer.setTablePile(this.tablePile);

        for (const player of this.players) {
            if (!player.hasCards()) continue;

            let card;
            if (player instanceof UserPlayer) {
                card = await player.playCard();
            } else {
                card = player.findMatchingCard(this.tablePile, this.matchType);
            }

            console.log(`${player.name} plays: ${card.toString()}`);
            if (this.tablePile.length > 0 && card.matches(this.tablePile[this.tablePile.length - 1], this.matchType)) {
                console.log(`${player.name} shouts Snap!`);
                player.receiveCards([...this.tablePile, card]);
                this.tablePile = [];
            } else {
                this.tablePile.push(card);
            }
        }
        this.roundsPlayed++;
    }

    // The game consisting of multiple rounds until the maximum set number of rounds is reached or only one players has cards.
    async playGame() {
        while (this.roundsPlayed < this.maxRounds && this.players.some(player => player.hasCards())) {
            console.log(`\nRound ${this.roundsPlayed + 1}`);
            await this.playRound();
        }

        this.declareWinner();
    }

    // Declares the winner(s) of the game based on the number of cards each player has.
    // If multiple players have the highest number of cards, it's a draw.
    declareWinner() {
        const maxCards = Math.max(...this.players.map(player => player.hand.length));
        const winners = this.players.filter(player => player.hand.length === maxCards);

        if (winners.length > 1) {
            console.log(`\nIt's a draw! The players with the most cards (${maxCards}) are:`);
            winners.forEach(winner => console.log(winner.name));
        } else {
            console.log(`\nThe winner is ${winners[0].name} with ${winners[0].hand.length} cards!`);
        }
    }
}

module.exports = Game;
