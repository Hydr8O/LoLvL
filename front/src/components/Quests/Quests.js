import React, { useEffect, useState, Fragment } from 'react';
import Jumbotron from '../Jumbotron/Jumbotron';
import axios from 'axios';
import classes from './Quests.module.css';
import matchInfo from '../../utils/matchInfo';
import Quest from './Quest/Quest';
import Button from '../Button/Button';
import Loading from '../Loading/Loading';

const numberOfEntries = 10;

const Quests = (props) => {
    const [questsInfo, setQuestInfo] = useState();
    const [disableBtn, setDisableBtn] = useState(false);
    let quests = null;

    const refreshQuestsHandler = async () => {
        try {
            setDisableBtn(true);
            const matchesBaseInfo = await matchInfo.matchesBaseInfo(
                numberOfEntries,
                props.accountId,
                props.mappedNames.mappedChampNames
            );
            const matchesFullInfo = await matchInfo.matches(
                matchesBaseInfo,
                props.id,
                props.mappedNames.mappedItemNames,
                props.mappedNames.mappedChampNames
            );
    
            await axios.post(`http://localhost:1234/summoner/gameStats/${props.name}`,
                {
                    gameStats: matchesFullInfo.map(game => {
                        return {
                            gameId: game.gameId,
                            win: game.participantData.stats.win,
                            kills: game.participantData.stats.kills,
                            deaths: game.participantData.stats.deaths,
                            assists: game.participantData.stats.assists,
                            longestTimeSpentLiving: game.participantData.stats.longestTimeSpentLiving,
                            totalDamageDealt: game.participantData.stats.totalDamageDealt,
                            wardsPlaced: game.participantData.stats.wardsPlaced,
                            gameDuration: game.gameDuration,
                            lane: game.lane,
                            queueId: game.queueId,
                            gameCreation: game.gameCreation,
                            minionsKilled: game.participantData.stats.totalMinionsKilled,
                            goldEarned: game.participantData.stats.goldEarned
                        }
                    }),
                    summonerId: props.id,
                }
            );
            const { data } = await axios.get(`http://localhost:1234/summoner/${props.id}/quests/${props.tier}/${props.rank}`);
            setQuestInfo([...data]);
            setDisableBtn(false);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`http://localhost:1234/summoner/${props.id}/quests/${props.tier}/${props.rank}`);
            setQuestInfo([...data]);
            console.log([...data]);
        })();
    }, []);

    if (questsInfo) {
        console.log(questsInfo)
        const questsArray = questsInfo.map(quest => {
            return (
                <Quest key={quest.id} questInfo={quest} />
            );
        })
        quests =
            <Jumbotron animation={classes.QuestsAnimation}>
                <Button onClick={[refreshQuestsHandler]} type='Primary' disabled={disableBtn}>
                {disableBtn ? <Loading small={true}/> : 'Refresh Quests'}
                </Button>
                {questsArray}
            </Jumbotron>

    }
    return (
        <Fragment>
            {quests}
        </Fragment>
    );
};

export default Quests;