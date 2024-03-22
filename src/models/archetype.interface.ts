import {CardInterface} from "./card.interface";

export interface ArchetypeInterface {
    name?: string;
    qty?: number;
    positions?: number[];
    positionMoyenne?: number;
    positionMediane?: number;
    cards?: CardInterface[];
}