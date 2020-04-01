const axios = require('axios');
const updateInterval = 20000;
const dbPool = require('../db/dbPool');

const getGameStats = async (link, summonerId) => {
    try {
        const { data } = await axios.get(link);
        const participantId = data.participantIdentities
            .find(participant => participant.player.summonerId === summonerId).participantId;
        const gameStats = data.participants[participantId - 1].stats;
        const lane = data.participants[participantId - 1].timeline.lane;
        return {
            queueId: data.queueId,
            gameId: data.gameId,
            win: gameStats.win,
            kills: gameStats.kills,
            deaths: gameStats.deaths,
            assists: gameStats.assists,
            longestTimeSpentLiving: gameStats.longestTimeSpentLiving,
            totalDamageDealt: gameStats.totalDamageDealt,
            wardsPlaced: gameStats.wardsPlaced,
            lane: lane,
            gameDuration: Math.floor(data.gameDuration / 60),
        };
    } catch (err) {

        console.log(err.response.statusText);
    };
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const gameStatsDemon = (endpoints) => {
    
    const timeBetweenUpdates = 1 / 6; //in minutes
    const matchesCount = 3;
    const linkMatches = endpoints.matchPoint.replace('numberOfEntries', matchesCount);
    const linkGameStats = endpoints.matchInfoPoint;
    const query = `SELECT accountId, id, name FROM summoner WHERE CURRENT_TIMESTAMP - statsUpdated  > ${timeBetweenUpdates} * '1 minute'::interval`
    const interval = setInterval(() => {
        
        dbPool.query(query, (err, response) => {
            if (err) {
                console.log(err);
                return;
            }

            const toUpdate = response.rows.map(row => {
                console.log(row.name);
                return {
                    accountId: row.accountid,
                    id: row.id,
                    name: row.name
                };
            });

            const updateStats = async () => {
                for (summoner of toUpdate) {
                    try {
                        console.log(`Right now ${summoner.name} is being updated`);
                        const {data} = await axios.get(linkMatches.replace('accountId', summoner.accountId))
    

                        const gameStatsPromises = data.matches.map(match => {
                            return getGameStats(linkGameStats.replace('gameId', match.gameId), summoner.id);
                        });
                        const gameStats = await Promise.all(gameStatsPromises);
                        await axios.post('http://localhost:1234/summoner/gameStats/:summonerName', { gameStats: gameStats, summonerId: summoner.id })
                    } catch (err) {
                        console.log(err.response.statusText);
                    }
                    await sleep(1000);
                };
            };
            updateStats();
        });
    }, updateInterval);
    return interval;
};

module.exports = gameStatsDemon;