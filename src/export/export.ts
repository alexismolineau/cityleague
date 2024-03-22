import puppeteer, {Browser, Page} from "puppeteer";
import { TournamentInterface } from "../models/tournament.interface";
import { PlayerInterface} from "../models/player.interface";
import {CardInterface} from "../models/card.interface";
import ScrapUtils from "./utils";


export const getCitiesLeagues = async () => {

    const browser: Browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        dumpio: true
    });

    const page: Page = await browser.newPage();

    console.info('BASE_URL: ' + process.env.BASE_URL);

    if (process.env.BASE_URL) {
        await page.goto(process.env.BASE_URL);
    } else {
        throw new Error('BASE_URL undefined');
    }
    await page.waitForSelector('tr');

    const pageLength = await getPagesLength(page);

    if (isNaN(pageLength)) {
        throw new Error('Error getting page length');
    }

    let tournaments = [] as TournamentInterface[];

    for (let i = 0; i < pageLength; i++) {
        await ScrapUtils.delay(process.env.INTERVAL);
        console.info(page.url())
        tournaments = tournaments.concat(await getTournamentsFromPage(page));
        await clickNextPage(page);
        await page.waitForSelector('ul.pagination');
    }

    for (const tournament of tournaments) {
        // récupération joueurs par tournoi
        if (tournament.tournamentUrl) {
            await page.goto(tournament.tournamentUrl);
            await ScrapUtils.delay(process.env.INTERVAL);
            console.info(page.url());
            const players: PlayerInterface[] = await getTournamentPlayers(page)
                .catch(error => {
                    console.error(`Couldn't get players for tournament ${tournament.tournamentUrl}` + error);
                    return [];
                });
            tournament.players = players;

            // récupération deck par joueur
            for (const player of players) {
                if (player.deckUrl) {
                    await page.goto(player.deckUrl);
                    await ScrapUtils.delay(process.env.INTERVAL);
                    console.info(page.url());
                    const deck: CardInterface[] = await getPlayerDeck(page)
                        .catch(error => {
                            console.error(`Couldn't get deck for ${player.deckUrl}` + error);
                            return [];
                        });
                    player.deck = deck;
                } else {
                    console.error('deckUrl missing');
                }
            }
        } else {
            console.error('tournamentUrl missing');
        }


    }

    ScrapUtils.saveToFile(tournaments);
    await browser.close();
};

const getTournamentsFromPage = async (page: Page): Promise<TournamentInterface[]> => {
    await page.waitForSelector('td');
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('tr');

        const tournaments = [] as TournamentInterface[];
        rows.forEach(row => {
            if (row.querySelectorAll('td')?.length) {
                tournaments.push({
                    date: row.dataset.date,
                    city: row.dataset.city,
                    shop: row.dataset.shop,
                    winner: row.dataset.winner,
                    tournamentUrl: row.querySelector('a')?.href
                });
            }
        });
        return tournaments;
    });
}

const getTournamentPlayers = async (page: Page): Promise<PlayerInterface[]> => {
    await page.waitForSelector('td');
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('tr');
        const players = [] as PlayerInterface[];
        rows.forEach(row => {
            if (row.querySelectorAll('td')?.length) {
                players.push({
                    position: parseInt(row.querySelectorAll('td')[0]?.innerText || '0'),
                    name: row.querySelectorAll('td')[1]?.innerText,
                    archetype: Array.from(row.querySelectorAll('td')[2]?.querySelectorAll('img') || []).map(img => img.alt).join(' '),
                    deckUrl: row.querySelectorAll('td')[2]?.querySelector('a')?.href
                });
            }
        });
        return players;
    });
}

const getPlayerDeck = async (page: Page): Promise<CardInterface[]> => {
    await page.waitForSelector('span.card-count');
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('div.decklist-card') as NodeListOf<HTMLDivElement>;
        const cards = [] as CardInterface[];
        rows.forEach(row => {
            cards.push({
                name: (row.querySelector('span.card-name') as HTMLSpanElement )?.innerText,
                quantity: parseInt((row.querySelector('span.card-count') as HTMLSpanElement )?.innerText || '0'),
                set: `${row?.dataset?.set}-${row?.dataset?.number}`,
            });
        });
        return cards;
    });
}

const getPagesLength = async (page: Page): Promise<number> => {
    await page.waitForSelector('ul.pagination');
    return await page.evaluate(() => {
        const pagination = document.querySelector('ul.pagination') as HTMLUListElement;
        return parseInt(pagination?.dataset?.max || '');
    });
}

const clickNextPage = async (page: Page): Promise<void> => {
    await page.waitForSelector('ul.pagination li:last-child');
    await page.evaluate(() => {
        (document.querySelector('ul.pagination li:last-child') as HTMLLIElement)?.click();
    });
}