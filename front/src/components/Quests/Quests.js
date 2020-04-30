import React, { useEffect, useState, Fragment } from 'react';
import Jumbotron from '../Jumbotron/Jumbotron';
import axios from 'axios';
import classes from './Quests.module.css';
import matchInfo from '../../utils/matchInfo';
import Quest from './Quest/Quest';
import Button from '../Button/Button';
import Loading from '../Loading/Loading';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';

const numberOfEntries = 10;

const Quests = (props) => {
    const [questsInfo, setQuestsInfo] = useState();
    const [disableBtn, setDisableBtn] = useState(false);
    const [completedQuests, setCompletedQuests] = useState([]);
    let quests = null;

    const completeQuestHandler = (questId) => {
        setCompletedQuests([...completedQuests, questId]);
    };

    const refreshQuests = async () => {
        const { data } = await axios.get(`http://localhost:1234/summoner/${props.id}/quests/${props.tier}/${props.rank}`);
        setQuestsInfo([...data]);
        
    }

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
            await refreshQuests();
            
            
            setDisableBtn(false);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (completedQuests.length !== 0) {
            (async () => {
                console.log('deleting')
                await axios.post('http://localhost:1234/summoner/quests/delete', {completedQuests});
                await refreshQuests();
                console.log('completed');
            })(); 
        }  
    }, [completedQuests]);

    useEffect(() => {
        (async () => {
            await refreshQuests();
        })();
    }, []);

    if (questsInfo) {
        const questsArray = questsInfo.map(quest => {
            return (
                <CSSTransition key={quest.id} classNames='fade-slide' timeout={2000}>
                    <Quest questInfo={quest} completeQuestHandler={completeQuestHandler}/>
                </CSSTransition>
            );
        })
        quests =
            <Jumbotron animation={classes.QuestsAnimation}>
                <Button type='Primary' link={true} to={`/summoner/${props.name}`}>
                    Back To Profile
                </Button>
                <Button onClick={[refreshQuestsHandler]} type='Primary' disabled={disableBtn}>
                {disableBtn ? <Loading small={true}/> : 'Refresh Quests'}
                </Button>
                <TransitionGroup className={classes.Quests}>
                    {questsArray}
                </TransitionGroup>
            </Jumbotron>

    }
    return (
        <Fragment>
            {quests}
        </Fragment>
    );
};

export default Quests;