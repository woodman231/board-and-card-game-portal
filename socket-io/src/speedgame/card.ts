export interface Dictionary<T> {
    [key: string]: T;
}

export enum Suite {
    Spades = 'Spades',
    Hearts = 'Hearts',
    Clubs = 'Clubs',
    Diamonds = 'Diamonds'
}

export const SuitesDictionary: Dictionary<Suite> = {
    Spades: Suite.Spades,
    Hearts: Suite.Hearts,
    Clubs: Suite.Clubs,
    Diamonds: Suite.Diamonds
};

export enum CardValueNames {
    Ace = 'Ace',
    Two = 'Two',
    Three = 'Three',
    Four = 'Four',
    Five = 'Five',
    Six = 'Six',
    Seven = 'Seven',
    Eight = 'Eight',
    Nine = 'Nine',
    Ten = 'Ten',
    Jack = 'Jack',
    Queen = 'Queen',
    King = 'King'
}

export const CardValueNamesDictionary: Dictionary<CardValueNames> = {
    Ace: CardValueNames.Ace,
    Two: CardValueNames.Two,
    Three: CardValueNames.Three,
    Four: CardValueNames.Four,
    Five: CardValueNames.Five,
    Six: CardValueNames.Six,
    Seven: CardValueNames.Seven,
    Eight: CardValueNames.Eight,
    Nine: CardValueNames.Nine,
    Ten: CardValueNames.Ten,
    Jack: CardValueNames.Jack,
    Queen: CardValueNames.Queen,
    King: CardValueNames.King
};

export enum CardValueNumbers {
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 9,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13
}

export const CardValueNumbersDictionary: Dictionary<CardValueNumbers> = {
    Ace: CardValueNumbers.Ace,
    Two: CardValueNumbers.Two,
    Three: CardValueNumbers.Three,
    Four: CardValueNumbers.Four,
    Five: CardValueNumbers.Five,
    Six: CardValueNumbers.Six,
    Seven: CardValueNumbers.Seven,
    Eight: CardValueNumbers.Eight,
    Nine: CardValueNumbers.Nine,
    Ten: CardValueNumbers.Ten,
    Jack: CardValueNumbers.Jack,
    Queen: CardValueNumbers.Queen,
    King: CardValueNumbers.King
};

export interface PlayingCard {
    suite: Suite;
    valueName: CardValueNames;
    valueNumber: CardValueNumbers;
    displayName: string;
}