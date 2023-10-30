"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleDeck = exports.initializeDeck = void 0;
const card_1 = require("./card");
// This function will initialize a standard playing card deck.
// It will return an array of PlayingCard objects.
function initializeDeck() {
    const deck = [];
    for (const suite in card_1.SuitesDictionary) {
        for (const cardValue in card_1.CardValueNamesDictionary) {
            const playingCard = {
                suite: card_1.SuitesDictionary[suite],
                valueName: card_1.CardValueNamesDictionary[cardValue],
                valueNumber: card_1.CardValueNumbersDictionary[cardValue],
                displayName: `${cardValue} of ${suite}`
            };
            deck.push(playingCard);
        }
    }
    return deck;
}
exports.initializeDeck = initializeDeck;
// This function will shuffle a deck of cards.
// It will return an array of PlayingCard objects.
function shuffleDeck(deck) {
    const shuffledDeck = [];
    const deckLength = deck.length;
    for (let i = 0; i < deckLength; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        shuffledDeck.push(deck.splice(randomIndex, 1)[0]);
    }
    return shuffledDeck;
}
exports.shuffleDeck = shuffleDeck;
