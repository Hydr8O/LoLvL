import React, { useEffect, useState } from 'react';
import Jumbotron from '../Jumbotron/Jumbotron';
import axios from 'axios';
const Quests = (props) => {
    const [questInfo, setQuestInfo] = useState();
    let quests = null;

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`http://localhost:1234/summoner/${props.id}/quests`);
            setQuestInfo({...data});
            console.log({...data});
        })();
    }, []);

    if (questInfo) {
        quests = <p>{questInfo.summonerId}</p>;
    }
    return (
        <Jumbotron>
            {quests}
        </Jumbotron>
    );
};

export default Quests;