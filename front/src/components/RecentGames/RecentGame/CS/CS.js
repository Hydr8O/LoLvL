import React from 'react';
import classes from './CS.module.css';

const CS = ({gameStats, gameDuration}) => {

    const CSPerMin = (gameStats.totalMinionsKilled / gameDuration).toFixed(1);
    return (
        <div className={classes.CS}>
            Overall CS
            <div>
                {gameStats.totalMinionsKilled}
            </div>
            CS per min
            <div>
                {CSPerMin}
            </div>
        </div>
    );
}

export default CS;