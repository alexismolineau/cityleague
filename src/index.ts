import puppeteer, {Browser, Page} from 'puppeteer';
import {config} from 'dotenv';
import fs from 'fs';


// récup variables env
config();



const getCitiesLeagues = async () => {

    const browser: Browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        dumpio: true
    });

    const page: Page = await browser.newPage();

    console.log(process.env.BASE_URL);

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

    let tournaments = [] as any[];

    for (let i = 0; i < pageLength; i++) {
        await delay(process.env.INTERVAL);
        console.info(page.url())
        tournaments = tournaments.concat(await getTournamentsFromPage(page));
        await clickNextPage(page);
        await page.waitForSelector('ul.pagination');
    }

    for (const tournament of tournaments) {
        // récupération joueurs par tournoi
        if (tournament.tournamentUrl) {
            await page.goto(tournament.tournamentUrl);
            await delay(process.env.INTERVAL);
            console.info(page.url());
            const players = await getTournamentPlayers(page);
            tournament.players = players;

            // récupération deck par joueur
            for (const player of players) {
                if (player.deckUrl) {
                    await page.goto(player.deckUrl);
                    await delay(process.env.INTERVAL);
                    console.info(page.url());
                    const deck = await getPlayerDeck(page);
                    player.deck = deck;
                } else {
                    console.error('deckUrl missing');
                }
            }
        } else {
            console.error('tournamentUrl missing');
        }


    }

    saveToFile(tournaments);
    await browser.close();
};

const getTournamentsFromPage = async (page: Page): Promise<any[]> => {
    await page.waitForSelector('td');
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('tr');

        const tournaments = [] as any[];
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

const getTournamentPlayers = async (page: Page): Promise<any[]> => {
    await page.waitForSelector('td');
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('tr');
        const players = [] as any[];
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

const getPlayerDeck = async (page: Page): Promise<any[]> => {
    await page.waitForSelector('span.card-count');
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('div.decklist-card') as NodeListOf<HTMLDivElement>;
        const cards = [] as any[];
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


const delay = (ms: string | undefined) => new Promise(res => {
    if (!ms) {
        ms = process.env.INTERVAL || '500';
    }
    setTimeout(res, parseInt(ms || '500'));
    console.info('awaiting ' + ms + ' ms...')
});

const saveToFile = (data: any[]) => {
    const title = Date.now().toString();
    fs.writeFileSync(`./exports/${title}-data.json`, JSON.stringify(data));
}


// Start the scraping
getCitiesLeagues();