import React from 'react';
import classes from './RecentGame.module.css';
import CS from './CS/CS';
import KDA from './KDA/KDA';
import Wards from './Wards/Wards';
import ChampResult from './ChampResult/ChampResult';
import Income from './Income/Income';
import LaneRibbon from './LaneRibbon/LaneRibbon';
import OverallTime from './OverallTime/OverallTime';

const RecentGame = (props) => {
    
    const gameStats = props.recentGame.participantData.stats;
    let gameResult = 'Loss';
    
    let lane;
    
    
    const goldPerMinute = (gameStats.goldEarned / props.recentGame.gameDuration).toFixed(1);
    let entryColor = classes.Loss;
    let color = classes.LossText;

    if (props.recentGame.participantData.stats.win) {
        color = classes.WinText;
        gameResult = 'Win';
        entryColor = classes.Win;
    }

    if (!(props.recentGame.lane === 'NONE')) {
        if (props.recentGame.participantData.championInfo.tags.includes('Support') && props.recentGame.lane === "BOTTOM") {
            lane = 'SUPPORT';
        } else {
            lane = props.recentGame.lane;
        }   
    } else {
        lane = 'NO'
    }

 
    return (
        <div className={[classes.RecentGame, entryColor].join(' ')}>
            <LaneRibbon lane={lane}/>
            <ChampResult
            champion={props.recentGame.participantData.championInfo.image.full} 
            color={color}
            gameResult={gameResult}/>
            <KDA gameStats={gameStats}/>
            <CS gameStats={gameStats} gameDuration={props.recentGame.gameDuration}/>
            <Wards gameStats={gameStats}/>
            <Income gameStats={gameStats} goldPerMinute={goldPerMinute}/>

            <OverallTime gameDuration={props.recentGame.gameDuration}/>
        </div>
    );
}

export default RecentGame;