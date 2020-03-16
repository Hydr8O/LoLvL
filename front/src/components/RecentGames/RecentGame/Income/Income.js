import React from 'react';
import classes from './Income.module.css';

const Income = ({gameStats, goldPerMinute}) => {
    return (
        <div className={classes.Income}>
            Gold Earned
            <div>
                {(gameStats.goldEarned / 1000).toFixed(1)} K
            </div>
            Gold Per Minute
            <div>
                {goldPerMinute}
            </div>
        </div>
    );
};

export default Income;