const apiKey = 'RGAPI-818b3d54-78b4-4913-a8cf-99ac05af6d74';

exports.initEndpoints = (newVersion) => {
    return {
        summonerPoint: `https://ru.api.riotgames.com/lol/summoner/v4/summoners/by-name/summonerName?api_key=${apiKey}`,
        rankPoint: `https://ru.api.riotgames.com/lol/league/v4/entries/by-summoner/summonerId?api_key=${apiKey}`,
        currentGamePoint: `https://ru.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/summonerId?api_key=${apiKey}`,
        championMasteryPoint: `https://ru.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/summonerId?api_key=${apiKey}`,
        championsPoint: `http://ddragon.leagueoflegends.com/cdn/${newVersion}/data/en_US/champion.json`,
        spellPoint: `http://ddragon.leagueoflegends.com/cdn/${newVersion}/data/en_US/summoner.json`,
        itemPoint: `http://ddragon.leagueoflegends.com/cdn/${newVersion}/data/en_US/item.json`,
        matchPoint: `https://ru.api.riotgames.com/lol/match/v4/matchlists/by-account/accountId?api_key=${apiKey}&endIndex=numberOfEntries`,
        matchInfoPoint: `https://ru.api.riotgames.com/lol/match/v4/matches/gameId?api_key=${apiKey}`,
        summonerByIdPoint: `https://ru.api.riotgames.com/lol/summoner/v4/summoners/summonerId?api_key=${apiKey}`
    };
};

exports.summonersByRank = (tier, rank) => {
    return `https://ru.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${tier}/${rank}?page=1&api_key=${apiKey}`;
}