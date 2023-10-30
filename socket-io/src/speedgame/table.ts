import { PlayingCard } from "./card";
import { Player } from "./player";

export interface Table {
    id: string;
    name: string;
    playerOne: Player;
    playerTwo: Player;
    leftDrawPile: PlayingCard[];
    leftDiscardPile: PlayingCard[];
    rightDrawPile: PlayingCard[];
    rightDiscardPile: PlayingCard[];
}