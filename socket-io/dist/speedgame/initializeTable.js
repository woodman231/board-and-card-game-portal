"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealCards = exports.initializeTable = void 0;
const initializeCards_1 = require("./initializeCards");
function initializeTable(input) {
    const freshDeck = (0, initializeCards_1.initializeDeck)();
    const shuffledDeck = (0, initializeCards_1.shuffleDeck)(freshDeck);
    const tableWithPlayers = {
        id: input.id,
        name: input.name,
        playerOne: {
            id: input.playerOne.id,
            name: input.playerOne.name,
            hand: [],
            drawPile: [],
            isStuck: false
        },
        playerTwo: {
            id: input.playerTwo.id,
            name: input.playerTwo.name,
            hand: [],
            drawPile: [],
            isStuck: false
        },
        leftDrawPile: [],
        leftDiscardPile: [],
        rightDrawPile: [],
        rightDiscardPile: []
    };
    const tableWithCards = dealCards({
        table: tableWithPlayers,
        shuffledDeck: shuffledDeck
    });
    return tableWithCards;
}
exports.initializeTable = initializeTable;
function dealCards(input) {
    const table = input.table;
    const shuffledDeck = input.shuffledDeck;
    // The left draw pile will get 5 cards.
    table.leftDrawPile = shuffledDeck.splice(0, 5);
    // The right draw pile will get 5 cards.
    table.rightDrawPile = shuffledDeck.splice(0, 5);
    // The left discard pile will get 1 card.
    table.leftDiscardPile = shuffledDeck.splice(0, 1);
    // The right discard pile will get 1 card.
    table.rightDiscardPile = shuffledDeck.splice(0, 1);
    // Player one will get 5 cards in their hand.
    table.playerOne.hand = shuffledDeck.splice(0, 5);
    // Player two will get 5 cards in their hand.
    table.playerTwo.hand = shuffledDeck.splice(0, 5);
    // The remaining cards will be split between each players draw pile.
    const playerOneDrawPile = shuffledDeck.splice(0, shuffledDeck.length / 2);
    const playerTwoDrawPile = shuffledDeck.splice(0, shuffledDeck.length);
    table.playerOne.drawPile = playerOneDrawPile;
    table.playerTwo.drawPile = playerTwoDrawPile;
    return table;
}
exports.dealCards = dealCards;
;
