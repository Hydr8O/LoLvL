//Gets the needed information from a match for a given summoner

const extractGameStats = (data, summonerId, forStatistics) => {
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
            goldEarned: gameStats.goldEarned,
            minionsKilled: gameStats.totalMinionsKilled,
            longestTimeSpentLiving: gameStats.longestTimeSpentLiving,
            totalDamageDealt: gameStats.totalDamageDealt,
            wardsPlaced: gameStats.wardsPlaced,
            lane: lane,
            gameDuration: Math.floor(data.gameDuration / 60),
            gameCreation: data.gameCreation,
            forStatistics: forStatistics
    }
};

module.exports = extractGameStats;