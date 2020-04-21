const axios = require('axios');
const RANK = 'GOLD';
const TIER = 'II';
const {summonersByRank} = require('../endpoints');
const extractGameStats = require('../utils/extractGameStats');

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




const getAccIds = async (ids, req) => {
    const summonerInfoProm = ids.map(id => {
        return axios.get(req.locals.endpoints.summonerByIdPoint.replace('summonerId', id));
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


const getDataForQuests = (req, res) => {
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
            const accIds = await getAccIds(ids, req);
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
                    table: 'data_for_quests',
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
};

module.exports = getDataForQuests;