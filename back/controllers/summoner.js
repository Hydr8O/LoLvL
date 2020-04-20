const axios = require('axios');
const dbPool = require('../db/dbPool');
const numberOfGames = 10;


const insertSummonerMainData = (summonerInfo, res) => {
    dbPool.query(`INSERT INTO 
summoner(id, name, puuid, account_id, level, revision_date, profile_icon_id) 
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
        longest_time_spent_living,
        total_damage_dealt,
        wards_placed,
        lane,
        game_duration,
        summoner_id,
        game_creation,
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
        longest_time_spent_living,
        total_damage_dealt,
        wards_placed,
        lane,
        game_duration,
        summoner_id,
        game_creation)
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

const createNewQuests = (id) => {
    questData = {
        typeId: 1,
        summonerId: id,
        currentProgress: 0
    }
    
    dbPool.query(`INSERT INTO 
    quest(
        type_id, 
        summoner_id, 
        current_progress
        ) 
    VALUES (
        ${questData.typeId},
        '${questData.summonerId}',
        ${questData.currentProgress}
    )`, (err, response) => {
        if (err) {
            return console.log(err);
        }
    });
    return questData;
}

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

    let table = 'game_stats';
    if (req.body.table) {
        table = req.body.table;
    }
    //400 - 5v5 Draft Pick games, 420 - 5v5 Ranked Solo games, 440 - 5v5 Ranked Flex games
    const neededQueue = [400, 420, 440];

    const gamesToInsert = new Promise((resolve, reject) => {
        dbPool.query(`SELECT id, game_creation FROM ${table} 
        WHERE summoner_id = '${summonerId}' ORDER BY game_creation DESC LIMIT ${numberOfGames}`,
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

exports.loadQuests = (req, res) => {
    const id = req.params.summonerId;
    dbPool.query(`SELECT * FROM quest JOIN quest_type ON quest.type_id = quest_type.id WHERE summoner_id = '${id}'`, (err, response) => {
        if (err) {
            return console.log(err);
        }

        const result = response.rows;
        let data;
        if (result.length === 0) {
            data = createNewQuests(id);
        } else {
            data = {id, name:'THD'}
            
        }
        res.json(data);
    })
    
    console.log(id);
};