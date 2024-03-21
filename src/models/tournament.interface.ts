import { PlayerInterface } from './player.interface';

export interface TournamentInterface {
    date?: string;
    city?: string;
    shop?: string;
    winner?: string;
    tournamentUrl?:string;
    players?: PlayerInterface[];
}