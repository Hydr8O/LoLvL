import React from 'react';
import classes from './SummonerRank.module.css';
import RankCard from './RankCard/RankCard';

const SummonerRank = ({rankStats}) => {
    return (
        <div className={classes.SummonerRank}>
            <RankCard 
            rankStats={rankStats.soloRank}
            type='Solo Rank'/> 
            <RankCard 
            rankStats={rankStats.flexRank}
            type='Flex Rank'/>
        </div>
    );
}

export default SummonerRank;