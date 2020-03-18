const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const initEndpoints = require('./endpoints');
const versionDemon = require('./demons/getNewVersion');
const summonerRoutes = require('./routes/summoner');



const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/summoner', summonerRoutes);

app.get('/match/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    axios.get(endpoints.matchInfoPoint.replace('gameId', gameId))
        .then(({ data }) => {
            res.json(data);
        });
});

app.get('/matches/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    const numberOfEntries = req.query.numberOfEntries;
    axios.get(endpoints.matchPoint.replace('accountId', accountId).replace('numberOfEntries', numberOfEntries))
        .then(({ data }) => {
            res.json(data);
        });
});



app.listen(1234, () => {
    versionDemon(app);
    console.log('server started');
});
