import React from 'react';
import classes from './FavoriteLane.module.css';

const FavoriteLane = (props) => {
    
    let gamesNumber = 0;
    const lanesCount = { 
        mid: 0,
        top: 0,
        bottom: 0,
        jungle: 0,
        support: 0
    }
    
    for (const game of props.matchesHistory) {
        if (!(game.lane === 'NONE')) {
            if (game.championInfo.tags.includes('Support')) {
                lanesCount.support += 1;
            } else {
                lanesCount[game.lane.toLowerCase()] += 1;
            }   
            gamesNumber++;
        }     
    };

    const percentage = {}

    for (let lane of Object.keys(lanesCount)) {
        percentage[lane] = Math.round(lanesCount[lane] / gamesNumber * 100);
    }

    const maxPlayed = Math.max(...Object.values(percentage));
    const favoriteLane = Object.keys(percentage).find(key => percentage[key] === maxPlayed);
    const positions = Object.keys(percentage)
    
    .map(lane => {
        return lane === favoriteLane ? (
            <div className={classes.Position} key={lane}>
                <img 
                src={`/positions/${lane}.png`} 
                alt='Position'
                className={classes.FavoritePosition}
                />
                <div className={classes.Percentage}>
                    {percentage[lane]} %
                </div>
            </div> 
        ): 
        (
            <div className={classes.Position} key={lane}>
                <img 
                src={`/positions/${lane}.png`} 
                alt='Position'
                className={classes.PositionImg}
                />
                <div className={classes.Percentage}>
                    {percentage[lane]} %
                </div>
            </div>
        )
    })
    
    return (
        <div className={classes.FavoriteLane}>
            <div>Recent lane preference (last {props.matchesHistory.length} matches)</div>
            <div className={classes.Positions}>
                {positions}
            </div>
        </div>
    );
};

export default FavoriteLane;