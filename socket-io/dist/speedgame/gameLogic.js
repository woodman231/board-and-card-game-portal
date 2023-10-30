"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleDiscardPilesIntoDrawPiles = exports.isGameStagnant = exports.moveCardsFromDrawPilesToDiscardPiles = exports.areBothPlayersStuck = exports.setPlayerIsStuck = exports.discardCard = exports.canPlayerDiscardCard = exports.drawFromPile = exports.canPlayerDrawFromPile = exports.isCardValueOneHigherOrOneLower = exports.getPlayerById = void 0;
const initializeCards_1 = require("./initializeCards");
function getPlayerById(input) {
    const table = input.table;
    const playerId = input.playerId;
    if (!table || !playerId) {
        return null;
    }
    if (table.playerOne.id === playerId) {
        return table.playerOne;
    }
    if (table.playerTwo.id === playerId) {
        return table.playerTwo;
    }
    return null;
}
exports.getPlayerById = getPlayerById;
function isCardValueOneHigherOrOneLower(input) {
    if (!input.cardOne || !input.cardTwo) {
        return false;
    }
    const cardValueOne = input.cardOne.valueNumber;
    const cardValueTwo = input.cardTwo.valueNumber;
    if (cardValueOne === 1) {
        return (cardValueTwo === 13 || cardValueTwo === 2);
    }
    return (cardValueOne === cardValueTwo + 1 || cardValueOne === cardValueTwo - 1);
}
exports.isCardValueOneHigherOrOneLower = isCardValueOneHigherOrOneLower;
function canPlayerDrawFromPile(input) {
    const playerId = input.playerId;
    const table = input.table;
    if (!playerId || !table) {
        return false;
    }
    const player = getPlayerById({
        table: table,
        playerId: playerId
    });
    if (!player) {
        return false;
    }
    return (player.drawPile.length > 0 && player.hand.length < 5);
}
exports.canPlayerDrawFromPile = canPlayerDrawFromPile;
function drawFromPile(input) {
    const playerId = input.playerId;
    const table = input.table;
    if (!playerId || !table) {
        return table;
    }
    const player = getPlayerById({
        table: table,
        playerId: playerId
    });
    if (!player) {
        return table;
    }
    if (!canPlayerDrawFromPile({
        playerId: playerId,
        table: table
    })) {
        return table;
    }
    const card = player.drawPile.pop();
    if (!card) {
        return table;
    }
    player.hand.push(card);
    return table;
}
exports.drawFromPile = drawFromPile;
function canPlayerDiscardCard(input) {
    const playerId = input.playerId;
    const table = input.table;
    const card = input.card;
    const discardPileIndex = input.discardPileIndex;
    if (!playerId || !table || !card || discardPileIndex < 0 || discardPileIndex > 1) {
        return false;
    }
    const player = getPlayerById({
        table: table,
        playerId: playerId
    });
    if (!player) {
        return false;
    }
    if (!player.hand.includes(card)) {
        return false;
    }
    const discardPile = (discardPileIndex === 0) ? table.leftDiscardPile : table.rightDiscardPile;
    if (discardPile.length === 0) {
        return true;
    }
    const topCard = discardPile[discardPile.length - 1];
    return isCardValueOneHigherOrOneLower({
        cardOne: card,
        cardTwo: topCard,
    });
}
exports.canPlayerDiscardCard = canPlayerDiscardCard;
function discardCard(input) {
    const playerId = input.playerId;
    const table = input.table;
    const card = input.card;
    const discardPileIndex = input.discardPileIndex;
    if (!playerId || !table || !card || discardPileIndex < 0 || discardPileIndex > 1) {
        return table;
    }
    const player = getPlayerById({
        table: table,
        playerId: playerId
    });
    if (!player) {
        return table;
    }
    if (!canPlayerDiscardCard({
        playerId: playerId,
        table: table,
        card: card,
        discardPileIndex: discardPileIndex
    })) {
        return table;
    }
    const discardPile = (discardPileIndex === 0) ? table.leftDiscardPile : table.rightDiscardPile;
    discardPile.push(card);
    const cardIndex = player.hand.indexOf(card);
    if (cardIndex === -1) {
        return table;
    }
    player.hand.splice(cardIndex, 1);
    player.isStuck = false; // In case they declared themselves stuck earlier.
    return table;
}
exports.discardCard = discardCard;
function setPlayerIsStuck(input) {
    const playerId = input.playerId;
    const table = input.table;
    if (!playerId || !table) {
        return table;
    }
    const player = getPlayerById({
        table: table,
        playerId: playerId
    });
    if (!player) {
        return table;
    }
    player.isStuck = true;
    return table;
}
exports.setPlayerIsStuck = setPlayerIsStuck;
function areBothPlayersStuck(input) {
    const table = input.table;
    if (!table) {
        return false;
    }
    const playerOne = table.playerOne;
    const playerTwo = table.playerTwo;
    if (!playerOne || !playerTwo) {
        return false;
    }
    return (playerOne.isStuck && playerTwo.isStuck);
}
exports.areBothPlayersStuck = areBothPlayersStuck;
function moveCardsFromDrawPilesToDiscardPiles(input) {
    const table = input.table;
    if (!table) {
        return table;
    }
    const areBothPlayersStuckCheck = areBothPlayersStuck({
        table: table
    });
    if (!areBothPlayersStuckCheck) {
        return table;
    }
    const leftDrawPile = table.leftDrawPile;
    if (leftDrawPile.length === 0) {
        return table;
    }
    const leftDiscardPile = table.leftDiscardPile;
    const card = leftDrawPile.pop();
    leftDiscardPile.push(card);
    const rightDrawPile = table.rightDrawPile;
    if (rightDrawPile.length === 0) {
        return table;
    }
    const rightDiscardPile = table.rightDiscardPile;
    const rightCard = rightDrawPile.pop();
    rightDiscardPile.push(rightCard);
    table.playerOne.isStuck = false;
    table.playerTwo.isStuck = false;
    return table;
}
exports.moveCardsFromDrawPilesToDiscardPiles = moveCardsFromDrawPilesToDiscardPiles;
function isGameStagnant(input) {
    const table = input.table;
    if (!table) {
        return false;
    }
    const areBothPlayersStuckCheck = areBothPlayersStuck({
        table: table
    });
    if (!areBothPlayersStuckCheck) {
        return false;
    }
    const leftDrawPile = table.leftDrawPile;
    if (leftDrawPile.length > 0) {
        return false;
    }
    const rightDrawPile = table.rightDrawPile;
    if (rightDrawPile.length > 0) {
        return false;
    }
    return true;
}
exports.isGameStagnant = isGameStagnant;
function shuffleDiscardPilesIntoDrawPiles(input) {
    const table = input.table;
    if (!table) {
        return table;
    }
    const isGameStagnantCheck = isGameStagnant({
        table: table
    });
    if (!isGameStagnantCheck) {
        return table;
    }
    // Put all of the cards together...
    const allLeftCards = table.leftDiscardPile.concat(table.leftDrawPile);
    const allRightCards = table.rightDiscardPile.concat(table.rightDrawPile);
    const allCombinedCards = allLeftCards.concat(allRightCards);
    // Shuffle the combined cards...
    const allCardsShuffled = (0, initializeCards_1.shuffleDeck)(allCombinedCards);
    // Distribute the cards to the draw piles...
    const leftDrawPile = [];
    const rightDrawPile = [];
    for (let i = 0; i < allCardsShuffled.length; i++) {
        const card = allCardsShuffled[i];
        if (i % 2 === 0) {
            leftDrawPile.push(card);
        }
        else {
            rightDrawPile.push(card);
        }
    }
    // Clear the discard piles...
    const leftDiscardPile = [];
    const rightDiscardPile = [];
    // Update the table...
    table.leftDrawPile = leftDrawPile;
    table.rightDrawPile = rightDrawPile;
    table.leftDiscardPile = leftDiscardPile;
    table.rightDiscardPile = rightDiscardPile;
    // Flip over the top card of each draw pile...
    return moveCardsFromDrawPilesToDiscardPiles({
        table: table
    });
}
exports.shuffleDiscardPilesIntoDrawPiles = shuffleDiscardPilesIntoDrawPiles;
