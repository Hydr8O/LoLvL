const axios = require('axios');
const ranks = {
    // ranks: ['I', 'II', 'III', 'IV'],
    // tiers: ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND']
    ranks: ['II'],
    tiers: ['PLATINUM']
}


const { summonersByRank } = require('../endpoints');
const extractGameStats = require('../utils/extractGameStats');

const extractSummonerIds = (data, numberOfEntries = 10) => {
    return data.map(entry => entry.summonerId)
        .slice(0, numberOfEntries);
};

const contructAllGameStats = async (gameStatsProm, ids) => {
    try {
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
            allGameStats.push({ summonerId: id, gameStats: oneGame });
        };
        return allGameStats;
    } catch (err) {
        console.log(err);
    }

};




const getAccIds = async (ids, req) => {
    try {
        const summonerInfoProm = ids.map(id => {
            return axios.get(req.app.locals.endpoints.summonerByIdPoint.replace('summonerId', id));
        })
        summonerInfo = await Promise.all(summonerInfoProm);
        return summonerInfo.map(summoner => summoner.data.accountId);
    } catch (err) {
        console.log(err);
    }

};

const getGameIds = async (accIds, ids) => {
    try {
        const matchesProm = accIds.map((id, index) => {
            return axios.get(`http://localhost:1234/matches/${id}?server=ru&numberOfEntries=1`);
        });
        const matches = await Promise.all(matchesProm);
        return matches.map(({ data }, index) => {
            return data.matches.map(summonerMatch => {
                return { gameId: summonerMatch.gameId, summonerId: ids[index] };
            })
        }).reduce((prev, cur) => [...prev, ...cur]);
    } catch {
        console.log(err);
    }

};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getDataForQuests = (req, res) => {
    (async () => {
        try {
            for (tier of ranks.tiers) {
                for (rank of ranks.ranks) {
                    ////////////////////////
                    //Get data about summoners in tier, rank and queue type
                    let { data } = await axios.get(summonersByRank(tier, rank));
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
                        return { gameStats: axios.get(`http://localhost:1234/match/${gameId.gameId}?server=ru`), summonerId: gameId.summonerId };
                    });
                    const allGameStats = await contructAllGameStats(gameStatsProm, ids);

                    for (entry of allGameStats) {
                        await axios.post('http://localhost:1234/summoner/gameStats/:summonerName', {
                            gameStats: entry.gameStats,
                            summonerId: entry.summonerId,
                            table: 'data_for_quests',
                            rank: rank,
                            tier: tier
                        });
                    }
                    // await sleep(60000);
                }
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