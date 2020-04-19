const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const versionDemon = require('./demons/getNewVersion');
const gameStatsDemon = require('./demons/getLastGameStats');
const extractGameStats = require('./utils/extractGameStats');
const summonerRoutes = require('./routes/summoner');
const RANK = 'BRONZE';
const TIER = 'I';
const {summonersByRank} = require('./endpoints');


let versionDemonInterval, gameStatsDemonInterval;
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/summoner', summonerRoutes);

app.get('/match/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    axios.get(req.app.locals.endpoints.matchInfoPoint.replace('gameId', gameId))
        .then(({ data }) => {
            res.json(data);
        });
});

app.get('/matches/:accountId', (req, res) => {
    const accountId = req.params.accountId;

    let numberOfEntries = 100;
    if (req.query.numberOfEntries) {
        numberOfEntries = req.query.numberOfEntries;
    }

    axios.get(req.app.locals.endpoints.matchPoint.replace('accountId', accountId).replace('numberOfEntries', numberOfEntries))
        .then(({ data }) => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/test', (req, res) => {
    (async () => {
        try {
            ////////////////////////
            //Get data about summoners in tier, rank and queue type
            let { data } = await axios.get(summonersByRank(RANK, TIER));
            ////////////////////////
            //Extract 10 summoners ids
            const ids = extractSummonerIds(data);
            ////////////////////////
            //Get summoners' account ids
            const accIds = await getAccIds(ids);
            ////////////////////////
            //Get gameIds
            const gameIdToSummoner = await getGameIds(accIds, ids);

            //Get game stats
            const gameStatsProm = gameIdToSummoner.map(gameId => {
                return { gameStats: axios.get(`http://localhost:1234/match/${gameId.gameId}`), summonerId: gameId.summonerId };
            });
            const allGameStats = await contructAllGameStats(gameStatsProm, ids);

            for (entry of allGameStats) {
                await axios.post('http://localhost:1234/summoner/gameStats/:summonerName', {
                    gameStats: entry.gameStats,
                    summonerId: entry.summonerId,
                    table: 'dataForQuests',
                    rank: RANK,
                    tier: TIER
                });
            }

            res.send('Test');
        } catch (err) {
            console.log(err);
        };
    })()
        .catch(err => {
            console.log(err);
        });
});


app.listen(1234, () => {
    versionDemon(app)
        .then(interval => {
            console.log('Version demon is up');
            versionDemonInterval = interval;
            // return(gameStatsDemon(app.locals.endpoints));
        })
        // .then(interval => {
        //     console.log('Game stats demon is up');
        //     gameStatsDemonInterval = interval;
        // })
        .catch(err => {
            console.log(err);
        })
    console.log('server started');
});
////////////////
//Helper Functions REMEMBER TO PUT INTO SEPERATE FILES LATER!!!!
const extractSummonerIds = (data, numberOfEntries = 10) => {
    return data.map(entry => entry.summonerId)
        .slice(0, numberOfEntries);
};

const contructAllGameStats = async (gameStatsProm, ids) => {
    const allGameStats = [];
    for (id of ids) {
        const oneSummonerGames = gameStatsProm.filter(stats => {
            return id === stats.summonerId
        });
        let oneGame = [];
        for (entry of oneSummonerGames) {
            const { data } = await entry.gameStats;
            oneGame.push(extractGameStats(data, entry.summonerId, true));
            
        };
        allGameStats.push({summonerId: id, gameStats: oneGame});
    };
    return allGameStats;
};




const getAccIds = async (ids) => {
    const summonerInfoProm = ids.map(id => {
        return axios.get(`https://ru.api.riotgames.com/lol/summoner/v4/summoners/${id}?api_key=RGAPI-7dd8ae91-4815-4c56-8d5e-5e6547ad72d7`)
    })
    summonerInfo = await Promise.all(summonerInfoProm);
    return summonerInfo.map(summoner => summoner.data.accountId);
};

const getGameIds = async (accIds, ids) => {
    const matchesProm = accIds.map((id, index) => {
        return axios.get(`http://localhost:1234/matches/${id}?numberOfEntries=1`);
    });
    const matches = await Promise.all(matchesProm);
    return matches.map(({ data }, index) => {
        return data.matches.map(summonerMatch => {
            return { gameId: summonerMatch.gameId, summonerId: ids[index] };
        })
    }).reduce((prev, cur) => [...prev, ...cur]);
};



