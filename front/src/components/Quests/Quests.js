import React, { useEffect, useState, Fragment } from 'react';
import Jumbotron from '../Jumbotron/Jumbotron';
import axios from 'axios';
import classes from './Quests.module.css';
import Quest from './Quest/Quest';

const Quests = (props) => {
    const [questsInfo, setQuestInfo] = useState();
    let quests = null;

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`http://localhost:1234/summoner/${props.id}/quests/${props.tier}/${props.rank}`);
            setQuestInfo([...data]);
            console.log([...data]);
        })();
    }, []);

    if (questsInfo) {
        console.log(questsInfo)
        const questsArray =  questsInfo.map(quest => {
            return (
                <Quest key={quest.id} questInfo={quest}/>
            );
        })
        quests = 
        <Jumbotron animation={classes.QuestsAnimation}>
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