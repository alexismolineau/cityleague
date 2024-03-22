import express, {Request, Response, Router} from 'express';
import fs from 'fs';
import { getCitiesLeagues } from '../export/export';

const router: Router = express.Router();


/**
 * Récupération dernier export
 */
router.get('/data', async  (req: Request, res: Response) => {
    fs.readFile('./exports/data/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        }
        res.status(200).json(JSON.parse(data));
    });
});

/**
 * Lancement export cities leagues
 */
router.get('/export', (req: Request, res: Response) => {
    getCitiesLeagues();
    res.status(200).json({
        message: 'Export started, can take several hours...'
    });
});



export default router;