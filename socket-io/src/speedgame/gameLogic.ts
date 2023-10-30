import { Player } from "./player";
import { Table } from "./table";
import { PlayingCard, CardValueNumbers } from "./card";
import { shuffleDeck } from "./initializeCards";

// This function will get a player by id from a table.
// It will return a player or null.
interface GetPlayerByIdInput {
    table: Table;
    playerId: string;
}

export function getPlayerById(input: GetPlayerByIdInput): Player | null {
    const table: Table = input.table;
    const playerId: string = input.playerId;

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

// This function will determine if a card value is one higher or one lower than another card value.
// It will return a boolean.
interface IsCardValueOneHigherOrOneLowerInput {
    cardOne: PlayingCard;
    cardTwo: PlayingCard;
}

export function isCardValueOneHigherOrOneLower(input: IsCardValueOneHigherOrOneLowerInput): boolean {
    if (!input.cardOne || !input.cardTwo) {
        return false;
    }

    const cardValueOne: CardValueNumbers = input.cardOne.valueNumber;
    const cardValueTwo: CardValueNumbers = input.cardTwo.valueNumber;

    if (cardValueOne === 1) {
        return (cardValueTwo === 13 || cardValueTwo === 2);
    }

    return (cardValueOne === cardValueTwo + 1 || cardValueOne === cardValueTwo - 1)
}

// This function will determine if a player can draw from their pile
// It will return a boolean.
interface CanPlayerDrawFromPileInput {
    playerId: string;
    table: Table;
}

export function canPlayerDrawFromPile(input: CanPlayerDrawFromPileInput): boolean {
    const playerId: string = input.playerId;
    const table: Table = input.table;

    if (!playerId || !table) {
        return false;
    }

    const player: Player | null = getPlayerById({
        table: table,
        playerId: playerId
    });

    if (!player) {
        return false;
    }

    return (player.drawPile.length > 0 && player.hand.length < 5);
}

// This function will determine if a player can draw from their pile
// If they can then it will draw a card from their pile and add it to their hand.
// It will return a table.
interface DrawFromPileInput {
    playerId: string;
    table: Table;
}

export function drawFromPile(input: DrawFromPileInput): Table {
    const playerId: string = input.playerId;
    const table: Table = input.table;

    if (!playerId || !table) {
        return table;
    }

    const player: Player | null = getPlayerById({
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

    const card: PlayingCard | undefined = player.drawPile.pop();

    if (!card) {
        return table;
    }

    player.hand.push(card);

    return table;
}

// This function will determine if a player can discard a card from their hand to a specific discard pile.
// It will return a boolean.
interface CanPlayerDiscardCardInput {
    playerId: string;
    table: Table;
    card: PlayingCard;
    discardPileIndex: number;
}

export function canPlayerDiscardCard(input: CanPlayerDiscardCardInput): boolean {
    const playerId: string = input.playerId;
    const table: Table = input.table;
    const card: PlayingCard = input.card;
    const discardPileIndex: number = input.discardPileIndex;

    if (!playerId || !table || !card || discardPileIndex < 0 || discardPileIndex > 1) {
        return false;
    }

    const player: Player | null = getPlayerById({
        table: table,
        playerId: playerId
    });

    if (!player) {
        return false;
    }

    if (!player.hand.includes(card)) {
        return false;
    }

    const discardPile: PlayingCard[] = (discardPileIndex === 0) ? table.leftDiscardPile : table.rightDiscardPile;

    if (discardPile.length === 0) {
        return true;
    }

    const topCard: PlayingCard = discardPile[discardPile.length - 1];

    return isCardValueOneHigherOrOneLower({
        cardOne: card,
        cardTwo: topCard,
    });
}

// This function will modify the table state if a player can discard a card from their hand to a specific discard pile.
// It will return a table.
interface DiscardCardInput {
    playerId: string;
    table: Table;
    card: PlayingCard;
    discardPileIndex: number;
}

export function discardCard(input: DiscardCardInput): Table {
    const playerId: string = input.playerId;
    const table: Table = input.table;
    const card: PlayingCard = input.card;
    const discardPileIndex: number = input.discardPileIndex;

    if (!playerId || !table || !card || discardPileIndex < 0 || discardPileIndex > 1) {
        return table;
    }

    const player: Player | null = getPlayerById({
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

    const discardPile: PlayingCard[] = (discardPileIndex === 0) ? table.leftDiscardPile : table.rightDiscardPile;

    discardPile.push(card);

    const cardIndex: number = player.hand.indexOf(card);

    if (cardIndex === -1) {
        return table;
    }

    player.hand.splice(cardIndex, 1);
    player.isStuck = false; // In case they declared themselves stuck earlier.

    return table;
}

// This function will set a player as stuck
// It will return a table.
interface SetPlayerStuckInput {
    playerId: string;
    table: Table;
}

export function setPlayerIsStuck(input: SetPlayerStuckInput): Table {
    const playerId: string = input.playerId;
    const table: Table = input.table;

    if (!playerId || !table) {
        return table;
    }

    const player: Player | null = getPlayerById({
        table: table,
        playerId: playerId
    });

    if (!player) {
        return table;
    }

    player.isStuck = true;

    return table;
}

// This function will determine if both players are stuck
// It will return a boolean.
interface AreBothPlayersStuckInput {
    table: Table;
}

export function areBothPlayersStuck(input: AreBothPlayersStuckInput): boolean {
    const table: Table = input.table;

    if (!table) {
        return false;
    }

    const playerOne: Player = table.playerOne

    const playerTwo: Player = table.playerTwo

    if (!playerOne || !playerTwo) {
        return false;
    }

    return (playerOne.isStuck && playerTwo.isStuck);
}

// This function will check if both player are stuck
// If they are then it will move a card from the left draw pile to the left discard pile and a card from the right draw pile to the right discard pile
// It will return a table.
interface MoveCardsFromDrawPilesToDiscardPilesInput {
    table: Table;
}

export function moveCardsFromDrawPilesToDiscardPiles(input: MoveCardsFromDrawPilesToDiscardPilesInput): Table {
    const table: Table = input.table;

    if (!table) {
        return table;
    }

    const areBothPlayersStuckCheck: boolean = areBothPlayersStuck({
        table: table
    });

    if (!areBothPlayersStuckCheck) {
        return table;
    }

    const leftDrawPile: PlayingCard[] = table.leftDrawPile;

    if (leftDrawPile.length === 0) {
        return table;
    }

    const leftDiscardPile: PlayingCard[] = table.leftDiscardPile;

    const card: PlayingCard = leftDrawPile.pop() as PlayingCard;

    leftDiscardPile.push(card);

    const rightDrawPile: PlayingCard[] = table.rightDrawPile;

    if (rightDrawPile.length === 0) {
        return table;
    }

    const rightDiscardPile: PlayingCard[] = table.rightDiscardPile;

    const rightCard: PlayingCard = rightDrawPile.pop() as PlayingCard;

    rightDiscardPile.push(rightCard);

    table.playerOne.isStuck = false;
    table.playerTwo.isStuck = false;

    return table;
}

// This function will check to see if both draw piles are empty and if both players are stuck
// It will return a boolean.
interface IsGameStagnantInput {
    table: Table;
}

export function isGameStagnant(input: IsGameStagnantInput): boolean {
    const table: Table = input.table;

    if (!table) {
        return false;
    }

    const areBothPlayersStuckCheck: boolean = areBothPlayersStuck({
        table: table
    });

    if (!areBothPlayersStuckCheck) {
        return false;
    }

    const leftDrawPile: PlayingCard[] = table.leftDrawPile;

    if (leftDrawPile.length > 0) {
        return false;
    }

    const rightDrawPile: PlayingCard[] = table.rightDrawPile;

    if (rightDrawPile.length > 0) {
        return false;
    }

    return true;
}

// This function will check if the game is stagnant
// If it is then it will take the cards from the discard piles, shuffle them, then put them to the draw piles
// It will return a table.
interface ShuffleDiscardPilesIntoDrawPilesInput {
    table: Table;
}

export function shuffleDiscardPilesIntoDrawPiles(input: ShuffleDiscardPilesIntoDrawPilesInput): Table {
    const table: Table = input.table;

    if (!table) {
        return table;
    }

    const isGameStagnantCheck: boolean = isGameStagnant({
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
    const allCardsShuffled = shuffleDeck(allCombinedCards);

    // Distribute the cards to the draw piles...
    const leftDrawPile: PlayingCard[] = [];
    const rightDrawPile: PlayingCard[] = [];

    for (let i = 0; i < allCardsShuffled.length; i++) {
        const card: PlayingCard = allCardsShuffled[i];

        if (i % 2 === 0) {
            leftDrawPile.push(card);
        } else {
            rightDrawPile.push(card);
        }
    }

    // Clear the discard piles...
    const leftDiscardPile: PlayingCard[] = [];
    const rightDiscardPile: PlayingCard[] = [];

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
