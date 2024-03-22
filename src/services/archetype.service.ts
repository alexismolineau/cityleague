import {TournamentInterface} from "../models/tournament.interface";
import {ArchetypeInterface} from "../models/archetype.interface";
import {CardInterface} from "../models/card.interface";

export const getArchetypesFromTournament = (tournaments: TournamentInterface[]): ArchetypeInterface[] => {
    return tournaments
        .map(
            tournament => {
                return tournament.players?.map(player => {
                    return {
                        name: player.archetype,
                        qty:1,
                        positionMoyenne: player.position,
                        positions: [],
                        cards: player.deck
                    }
                }) || [];
            }
        ).flat(1);
}

export const handleArchetypes = (archetypes: ArchetypeInterface[]): ArchetypeInterface[] => {
    return archetypes.reduce((a, c) => {
        const obj = a.find((obj) => obj.name === c.name);
        if(!obj) {
            c.positions = [c.positionMoyenne || 0];
            a.push(c);
        }
        else {
            // nombre d'occurences
            if (obj.qty && c.qty) {
                obj.qty += c.qty;
            } else {
                obj.qty = 1;
            }
            obj.positions?.push(c.positionMoyenne || 0);
            // position moyenne
            if (obj.positionMoyenne && c.positionMoyenne) {
                obj.positionMoyenne += c.positionMoyenne;
            }
        }
        if (obj?.cards && c?.cards) {
            obj.cards = getTotalCards(obj.cards, c.cards);
        }
        return a;
    }, [] as ArchetypeInterface[])
        .sort((a, b) => {
            if (b.qty && a.qty) {
                return b.qty - a.qty;
            } else {
                return 0;
            }
        })
        .map(archetype => {
            archetype.positions?.sort((a, b) => a - b);
            if (archetype.positions && archetype.qty && archetype.qty % 2) {
                const middleIndex = Math.floor(archetype.positions.length / 2);
                archetype.positionMediane = archetype.positions[middleIndex];
            } else if (archetype.positions && archetype.qty) {
                const middleIndex = Math.floor(archetype.positions.length / 2);
                archetype.positionMediane = (archetype.positions[middleIndex - 1] + archetype.positions[middleIndex]) / 2;
            }
            if (archetype.positionMoyenne && archetype.qty) {
                archetype.positionMoyenne =  parseFloat((archetype.positionMoyenne / archetype.qty).toFixed(2));
            }

            if (archetype.cards) {
                archetype.cards.forEach(card => {
                    if (card.quantity && archetype.qty) {
                        card.quantity = card.quantity / archetype.qty;
                    }
                })
            }
            return archetype;
        })
        ;
}

const getTotalCards = (actualDeck: CardInterface[], nextDeck: CardInterface[]): CardInterface[] => {

    const mergedArray = actualDeck.concat(nextDeck);
    return mergedArray.reduce((a, c) => {
        const card = a.find((obj) => {
            return obj.set === c.set;
        });
        if(!card) {
            a.push(c);
        }
        else {
            if (card.quantity && c.quantity) {
                card.quantity +=  c.quantity;
            }
        }
        return a;
    }, [] as CardInterface[]) || [];
}