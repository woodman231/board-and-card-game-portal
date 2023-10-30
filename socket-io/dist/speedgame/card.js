"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardValueNumbersDictionary = exports.CardValueNumbers = exports.CardValueNamesDictionary = exports.CardValueNames = exports.SuitesDictionary = exports.Suite = void 0;
var Suite;
(function (Suite) {
    Suite["Spades"] = "Spades";
    Suite["Hearts"] = "Hearts";
    Suite["Clubs"] = "Clubs";
    Suite["Diamonds"] = "Diamonds";
})(Suite || (exports.Suite = Suite = {}));
exports.SuitesDictionary = {
    Spades: Suite.Spades,
    Hearts: Suite.Hearts,
    Clubs: Suite.Clubs,
    Diamonds: Suite.Diamonds
};
var CardValueNames;
(function (CardValueNames) {
    CardValueNames["Ace"] = "Ace";
    CardValueNames["Two"] = "Two";
    CardValueNames["Three"] = "Three";
    CardValueNames["Four"] = "Four";
    CardValueNames["Five"] = "Five";
    CardValueNames["Six"] = "Six";
    CardValueNames["Seven"] = "Seven";
    CardValueNames["Eight"] = "Eight";
    CardValueNames["Nine"] = "Nine";
    CardValueNames["Ten"] = "Ten";
    CardValueNames["Jack"] = "Jack";
    CardValueNames["Queen"] = "Queen";
    CardValueNames["King"] = "King";
})(CardValueNames || (exports.CardValueNames = CardValueNames = {}));
exports.CardValueNamesDictionary = {
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
var CardValueNumbers;
(function (CardValueNumbers) {
    CardValueNumbers[CardValueNumbers["Ace"] = 1] = "Ace";
    CardValueNumbers[CardValueNumbers["Two"] = 2] = "Two";
    CardValueNumbers[CardValueNumbers["Three"] = 3] = "Three";
    CardValueNumbers[CardValueNumbers["Four"] = 4] = "Four";
    CardValueNumbers[CardValueNumbers["Five"] = 5] = "Five";
    CardValueNumbers[CardValueNumbers["Six"] = 6] = "Six";
    CardValueNumbers[CardValueNumbers["Seven"] = 7] = "Seven";
    CardValueNumbers[CardValueNumbers["Eight"] = 9] = "Eight";
    CardValueNumbers[CardValueNumbers["Nine"] = 9] = "Nine";
    CardValueNumbers[CardValueNumbers["Ten"] = 10] = "Ten";
    CardValueNumbers[CardValueNumbers["Jack"] = 11] = "Jack";
    CardValueNumbers[CardValueNumbers["Queen"] = 12] = "Queen";
    CardValueNumbers[CardValueNumbers["King"] = 13] = "King";
})(CardValueNumbers || (exports.CardValueNumbers = CardValueNumbers = {}));
exports.CardValueNumbersDictionary = {
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
