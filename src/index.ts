import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import { getCitiesLeagues } from './export/export';

// récup variables env
config();

const app: Express = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.info(`server up on port ${port}`);
});

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

/**
 * Lancement export cities leagues
 */
app.get('/export', (req: Request, res: Response) => {
    getCitiesLeagues();
    res.status(200).json({
        message: 'Export started...'
    });
});
