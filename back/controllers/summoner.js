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

const constructGameStatsQuery = (games, summonerId, table, rank, tier) => {
    let gameStatsForm;
    let gameStatsQuery;
    console.log(rank)
    if (rank) {
        gameStatsForm = games.map((game) => {
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
                    '${summonerId}',
                    ${game.gameCreation},
                    '${rank}',
                    '${tier}'
                )`
            );
        }).join(', ');

        gameStatsQuery =
        `INSERT INTO
    ${table}(
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
        summonerId,
        gameCreation,
        rank,
        tier)
    VALUES ${gameStatsForm} RETURNING lane`;
    } else {
        gameStatsForm = games.map((game) => {
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
                    '${summonerId}',
                    ${game.gameCreation}
                )`
            );
        }).join(', ');

        gameStatsQuery =
        `INSERT INTO
    ${table}(
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
        summonerId,
        gameCreation)
    VALUES ${gameStatsForm} RETURNING lane`;
    
    }

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
    const rank = req.body.rank;
    const tier = req.body.tier;

    let table = 'gameStats';
    if (req.body.table) {
        table = req.body.table;
    }
    //400 - 5v5 Draft Pick games, 420 - 5v5 Ranked Solo games, 440 - 5v5 Ranked Flex games
    const neededQueue = [400, 420, 440];

    const gamesToInsert = new Promise((resolve, reject) => {
        dbPool.query(`SELECT id, gameCreation FROM ${table} 
        WHERE summonerId = '${summonerId}' ORDER BY gameCreation DESC LIMIT ${numberOfGames}`,
            (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const gamesFromDb = response.rows.map(row => row.id);
                    resolve(gameStats.filter(game => {
                        return (!gamesFromDb.includes(game.gameId) && neededQueue.includes(game.queueId))
                    }));
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

        const gameStatsQuery = constructGameStatsQuery(games, summonerId, table, rank, tier);

        console.log(gameStatsQuery)
        insertGameStatsData(gameStatsQuery, res);
    })
        .catch(err => console.log(err))
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