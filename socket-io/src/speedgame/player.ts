import { PlayingCard } from "./card";

export interface Player {
    id: string;
    name: string;
    hand: PlayingCard[];
    drawPile: PlayingCard[];
    isStuck: boolean;
}