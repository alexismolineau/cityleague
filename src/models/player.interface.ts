import { CardInterface } from './card.interface';

export interface PlayerInterface {
    position?: number;
    name?: string;
    archetype?: string;
    deckUrl?: string;
    deck?: CardInterface[];

}