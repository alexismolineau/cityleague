import express, {Request, Response, Router} from 'express';
import fs from 'fs';
import {TournamentInterface} from "../models/tournament.interface";
import {getArchetypesFromTournament, handleArchetypes} from '../services/archetype.service';

const router: Router = express.Router();


/**
 * Récup infos par archétype
 */
router.get('/archetypes', (req: Request, res: Response) => {
    fs.readFile('./exports/data/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        }
        const tournaments: TournamentInterface[] = JSON.parse(data);
        const archetypes = getArchetypesFromTournament(tournaments);

        const combined = handleArchetypes(archetypes);
        res.status(200).json(combined);

    });
});

router.get('/archetypes/:archetypeName', (req: Request, res: Response) => {

    const archetypeName: string = req.params.archetypeName;

    fs.readFile('./exports/data/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        }
        const tournaments: TournamentInterface[] = JSON.parse(data);
        const archetypes = getArchetypesFromTournament(tournaments);

        let combined = archetypes
            .filter(archetype => archetype.name === archetypeName)
        combined = handleArchetypes(combined);
        if (combined.length) {
            res.status(200).json(combined[0]);
        } else {
            res.status(404).json({error: 'Archetype non trouvé'});
        }
    });
});

export default router;