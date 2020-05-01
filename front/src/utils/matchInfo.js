import axios from 'axios';
import { idToName } from './mapNames';

const ITEMS = ["item0", "item1", "item2", "item3", "item4", "item5", "item6"];

const matchesBaseInfo =  async (numberOfEntries, accountId, mappedChampNames, server) => {
    const { data } = await axios.get(`http://localhost:1234/matches/${accountId}?numberOfEntries=${numberOfEntries}&server=${server}`);
    return idToName(data.matches, 'champion', mappedChampNames);
}

const matches = async (matchesBase, summonerId, mappedItemNames, mappedChampNames, server) => {
    let matchFullInfo = matchesBase.map(match => {
        return matchInfo(match, summonerId, mappedItemNames, mappedChampNames, server);
    })
    matchFullInfo = Promise.all(matchFullInfo);
    return matchFullInfo;
}


const matchInfo = async (match, summonerId, mappedItemNames, mappedChampNames, server) => {
    const { data } = await axios.get(`http://localhost:1234/match/${match.gameId}?server=${server}`);
    const participantId = data.participantIdentities
        .find(participant => participant.player.summonerId === summonerId).participantId;
    const summonerInfo = data.participants[participantId - 1];
    idToName(summonerInfo, ITEMS, mappedItemNames, true);
    idToName(summonerInfo, 'championId', mappedChampNames);
    return {
        queueId: data.queueId,
        gameId: match.gameId,
        gameCreation: data.gameCreation,
        participantData: data.participants[participantId - 1],
        lane: match.lane,
        gameDuration: Math.floor(data.gameDuration / 60),
        matchMembers: data.participants
    };
}

export default {
    matchesBaseInfo,
    matches,
    matchInfo
}