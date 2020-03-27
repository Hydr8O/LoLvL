const axios = require('axios');
const updateInterval = 3600000;
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
        console.log(err);
    };
};

const gameStatsDemon = (endpoints) => {
    const timeBetweenUpdates = 1 / 6; //in minutes
    const matchesCount = 3;
    const linkMatches = endpoints.matchPoint.replace('numberOfEntries', matchesCount);
    const linkGameStats = endpoints.matchInfoPoint;
    const query = `SELECT accountId, id FROM summoner WHERE CURRENT_TIMESTAMP - statsUpdated  > ${timeBetweenUpdates} * '1 minute'::interval`
    const interval = setInterval(() => {
        dbPool.query(query, (err, response) => {
            if (err) {
                console.log(err);
                return;
            }


            const toUpdate = response.rows.map(row => {
                return {
                    accountId: row.accountid,
                    id: row.id
                };
            });


            console.log(toUpdate);
            for (summoner of toUpdate) {
                axios.get(linkMatches.replace('accountId', summoner.accountId))
                    .then(({ data }) => {
                        const gameStatsPromises = data.matches.map(match => {
                            return getGameStats(linkGameStats.replace('gameId', match.gameId), summoner.id);
                        });
                        const gameStats = Promise.all(gameStatsPromises);
                        return (gameStats);
                    })
                    .then(gameStats => {
                        axios.post('http://localhost:1234/summoner/gameStats/:summonerName', {gameStats: gameStats, summonerId: summoner.id})
                        .catch(err => {
                            console.log(err);
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        });
    }, updateInterval);

    return interval;
};

module.exports = gameStatsDemon;