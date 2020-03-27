const axios = require('axios');
const dbPool = require('../db/dbPool');
const numberOfGames = 10;


const insertSummonerMainData = (summonerInfo, res) => {
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
            // console.log(err);
            res.end('Error');
        } else {
            res.end(response.rows[0].name)
        };
    });
};

const constructGameStatsQuery = (games, summonerId) => {
    const gameStatsForm = games.map(game => {
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
                ${game.gameDuration},
                '${summonerId}'
            )`
        );
    }).join(', ');
    
    const gameStatsQuery =
        `INSERT INTO
    gameStats(
        id,
        win,
        kills,
        deaths,
        assists,
        longestTimeSpentLiving,
        totalDamageDealt,
        wardsPlaced,
        lane,
        gameDuration,
        summonerId)
    VALUES ${gameStatsForm} RETURNING lane`;

    return gameStatsQuery;
};

const insertGameStatsData = (gameStatsQuery, res) => {
    dbPool.query(gameStatsQuery, (err, response) => {
        if (err) {
            console.log(err);
            res.end('Error');
        } else {
            console.log(response.rows);
            res.end('OK');
        };
    });
};

/////////////////////////////////////////
//Requests to riot API
exports.getSummonerData = (req, res) => {
    const summonerName = req.params.summonerName;
    console.log(encodeURI(req.app.locals.endpoints.summonerPoint.replace('summonerName', summonerName)));
    axios.get(encodeURI(req.app.locals.endpoints.summonerPoint.replace('summonerName', summonerName)))
        .then(({ data }) => {
            res.json(data);
        })
        .catch(err => {
            console.log(`${err}`);
        });
};

exports.getRankData = (req, res) => {
    const summonerId = req.params.summonerId;
    axios.get(req.app.locals.endpoints.rankPoint.replace('summonerId', summonerId))
        .then(({ data }) => {
            res.json(data);
        }).catch(err => {
            console.log(err.response.status);
        });
};

exports.getMasteryData = (req, res) => {
    const summonerId = req.params.summonerId;
    axios.get(req.app.locals.endpoints.championMasteryPoint.replace('summonerId', summonerId))
        .then(({ data }) => {
            res.json(data);
        }).catch(err => {
            console.log(err.response.status);
        });
};


///////////////////////////////////////////
//Working with our db
exports.insertSummonerData = (req, res) => {
    const summonerInfo = req.body.summonerInfo;
    insertSummonerMainData(summonerInfo, res);
};

exports.insertGameStats = (req, res) => {
    const gameStats = req.body.gameStats;
    const summonerId = req.body.summonerId;
    const neededQueue = [400, 440]; //only normal 5v5 and ranked

    const gamesToInsert = new Promise((resolve, reject) => {
        dbPool.query(`SELECT id FROM gameStats 
        WHERE summonerId = '${summonerId}' LIMIT ${numberOfGames}`,
            (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const gamesFromDb = response.rows.map(row => row.id);
                    resolve(gameStats.filter(game => (!gamesFromDb.includes(game.gameId) && neededQueue.includes(game.queueId))));
                }
            }
        );
    });

    gamesToInsert.then((games) => {
        if (games.length === 0) {
            console.log('Nothing to insert');
            res.end('OK');
            return;
        };

        const gameStatsQuery = constructGameStatsQuery(games, summonerId);
    
        console.log(gameStatsQuery)
        insertGameStatsData(gameStatsQuery, res);
    });
};

exports.isInDb = (req, res) => {
    const id = req.params.summonerId;

    dbPool.query(`SELECT id FROM summoner WHERE id = '${id}'`, (err, response) => {
        if (err) {
            console.log(err);
            return;
        }
        
        res.json({
            isInDb: response.rows.length === 0 ? false : true
        });
    });
};