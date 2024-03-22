import express, { Express } from 'express';
import { config } from 'dotenv';
import path from 'path';
import cors from 'cors';
import home from './server/home';
import archetypes from './server/archetypes';
// récup variables env
config();

const app: Express = express();
const port = process.env.PORT;


// add middlewares
app.use(express.static(path.join(__dirname, "..", "src/front/build")));
app.use(express.static("src/front/public"));
app.use(cors())

app.listen(port, () => {
    console.info(`server up on port ${port}`);
});

app.use('/', home);
app.use('/', archetypes);