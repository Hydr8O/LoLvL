const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const versionDemon = require('./demons/getNewVersion');
const gameStatsDemon = require('./demons/getLastGameStats');
const summonerRoutes = require('./routes/summoner');


let versionDemonInterval, gameStatsDemonInterval;
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/summoner', summonerRoutes);

app.get('/match/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    axios.get(app.locals.endpoints.matchInfoPoint.replace('gameId', gameId))
        .then(({ data }) => {
            res.json(data);
        });
});

app.get('/matches/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    const numberOfEntries = req.query.numberOfEntries;
    axios.get(app.locals.endpoints.matchPoint.replace('accountId', accountId).replace('numberOfEntries', numberOfEntries))
        .then(({ data }) => {
            res.json(data);
        });
});



app.listen(1234, () => {
    versionDemon(app)
    .then(interval => {
        console.log('Version demon is up');
        versionDemonInterval = interval;
        return(gameStatsDemon(app.locals.endpoints));
    })
    .then(interval => {
        console.log('Game stats demon is up');
        gameStatsDemonInterval = interval;
    })
    .catch(err => {
        console.log(err);
    })
    console.log('server started');
});
