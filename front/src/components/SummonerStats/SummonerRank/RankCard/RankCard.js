import React from 'react';
import classes from './RankCard.module.css';

const RankCard = ({rankStats, type}) => {
    let rankImg = <img 
    className={[classes.NoRank, classes.Img].join(' ')} 
    alt='Rank tier' 
    src={`/rankedEmblems/IRON.png`}/>;
    
    let rankSt = null;
    let winRate = (
        <p className={classes.Winrate}>
            Unranked
        </p>
    );

    

    if (rankStats) {
        
        rankImg = <img 
        className={classes.Img} 
        alt='Rank tier' 
        src={`/rankedEmblems/${rankStats.tier}.png`}/>;
        rankSt = (
            <div className={classes.RankStats}>
                <p>{`${rankStats.tier} ${rankStats.rank}`}</p>
                <p>LP: <span className={classes.LP}>{rankStats.leaguePoints}</span></p>
                <p>Wins: <span className={classes.Wins}>{rankStats.wins}</span></p>
                <p>Losses: <span className={classes.Losses}>{rankStats.losses}</span></p>
            </div>
        );
        const winRatePercentage = ((rankStats.wins / (rankStats.wins + rankStats.losses)) * 100)
        .toFixed(0);

        const soloWinLose = winRatePercentage >= 50 ? classes.Wins : classes.Losses; 

        winRate = (
            <p className={classes.Winrate}>
                Winrate: <span className={soloWinLose}>{winRatePercentage} %</span>
            </p>
        );
        
    }
    return (
        <div className={classes.RankCard}>
            <h4 className={classes.RankType}>{type}</h4>
            <div className={classes.RankInfo}>
                <div className={classes.ImgContainer}>
                    {rankImg}
                </div>
                {rankSt}
            </div>
            {winRate}
        </div>
    );
}

export default RankCard;