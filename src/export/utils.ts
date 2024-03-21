import { TournamentInterface } from '../models/tournament.interface';
import fs from 'fs';

export default class ScrapUtils {
    static delay = (ms: string | undefined) => new Promise(res => {
        if (!ms) {
            ms = process.env.INTERVAL || '500';
        }
        setTimeout(res, parseInt(ms || '500'));
        console.info('awaiting ' + ms + ' ms...')
    });

    static saveToFile = (data: TournamentInterface[]) => {
        const title = Date.now().toString();
        fs.writeFileSync(`./exports/${title}-data.json`, JSON.stringify(data));
    }
}


