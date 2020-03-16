const express = require('express');
const bodyParser = require('body-parser');
const dbPool = require('./db/dbPool');
const axios = require('axios');
const cors = require('cors');
const endpoints = require('./endpoints');
const summonerRoutes = require('./routes/summoner');



const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(summonerRoutes);

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

app.post('/summoner/summonerInfo/:summonerName', (req, res) => {
    const summonerInfo = req.body.summonerInfo;
    
    dbPool.query(`INSERT INTO 
    summoner(id, name, puuid, accountId, level, revisionDate, profileIconId) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING name`,
    [
        summonerInfo.id,
        summonerInfo.name,
        summonerInfo.puuid,
        summonerInfo.accountId,
        summonerInfo.level,
        new Date(summonerInfo.revisionDate).toISOString(),
        summonerInfo.profileIconId
    ], (err, response) => {
        if (err) {
            console.log(err);
            res.end('Error');
        } else {
            res.end(response.rows[0].name)
        }
        
    });
    
});

app.post('/summoner/gameStats/:summonerName', (req, res) => {
    const gameStats = req.body.gameStats;
    console.log(gameStats)
    const gameStatsForm = gameStats.map(game => {
        return (
            `(
                ${game.gameId},
                '${game.win}', 
                ${game.kills}, 
                ${game.deaths}, 
                ${game.assists}, 
                ${game.longestTimeSpentLiving},
                ${game.totalDamageDealt},
                ${game.wardsPlaced},
                '${game.lane}',
                ${game.gameDuration}
            )`
        );
    }).join(', ');

    const gameStatsQuery = 
    `INSERT INTO
    gameStats(gameId,
        win,
        kills,
        deaths,
        assists,
        longestTimeSpentLiving,
        totalDamageDealt,
        wardsPlaced,
        lane,
        gameDuration)
    VALUES ${gameStatsForm}`;

    console.log(gameStatsQuery)

    dbPool.query(gameStatsQuery, (err, response) => {
        if (err) {
            console.log(err);
            res.end('Error');
        } else {
            res.end('OK');
        };
    });
});

app.listen(1234, () => {
    console.log('server started');
});