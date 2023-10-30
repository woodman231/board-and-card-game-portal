import { PlayingCard } from "./card";
import { Player } from "./player";
import { Table } from "./table";
import { initializeDeck, shuffleDeck } from "./initializeCards";

interface InitailizeTablePlayerInput {
    id: string;
    name: string;
}

interface InitializeTableInput {
    id: string;
    name: string;
    playerOne: InitailizeTablePlayerInput;
    playerTwo: InitailizeTablePlayerInput;
}

export function initializeTable(input: InitializeTableInput): Table {
    const freshDeck: PlayingCard[] = initializeDeck();
    const shuffledDeck: PlayingCard[] = shuffleDeck(freshDeck);

    const tableWithPlayers: Table = {
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

    const tableWithCards: Table = dealCards({
        table: tableWithPlayers,
        shuffledDeck: shuffledDeck
    });

    return tableWithCards;
}

interface DealCardsInput {
    table: Table;
    shuffledDeck: PlayingCard[];
}

export function dealCards(input: DealCardsInput): Table {
    const table: Table = input.table;
    const shuffledDeck: PlayingCard[] = input.shuffledDeck;

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
    const playerOneDrawPile: PlayingCard[] = shuffledDeck.splice(0, shuffledDeck.length / 2);
    const playerTwoDrawPile: PlayingCard[] = shuffledDeck.splice(0, shuffledDeck.length);

    table.playerOne.drawPile = playerOneDrawPile;
    table.playerTwo.drawPile = playerTwoDrawPile;

    return table;
};
