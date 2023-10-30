import { PlayingCard, SuitesDictionary, CardValueNamesDictionary, CardValueNumbersDictionary } from "./card";

// This function will initialize a standard playing card deck.
// It will return an array of PlayingCard objects.
export function initializeDeck(): PlayingCard[] {
    const deck: PlayingCard[] = [];
    for (const suite in SuitesDictionary) {
        for (const cardValue in CardValueNamesDictionary) {
            const playingCard: PlayingCard = {
                suite: SuitesDictionary[suite],
                valueName: CardValueNamesDictionary[cardValue],
                valueNumber: CardValueNumbersDictionary[cardValue],
                displayName: `${cardValue} of ${suite}`
            };

            deck.push(playingCard);
        }
    }
    return deck;
}

// This function will shuffle a deck of cards.
// It will return an array of PlayingCard objects.
export function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
    const shuffledDeck: PlayingCard[] = [];
    const deckLength = deck.length;
    for (let i = 0; i < deckLength; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        shuffledDeck.push(deck.splice(randomIndex, 1)[0]);
    }
    return shuffledDeck;
}