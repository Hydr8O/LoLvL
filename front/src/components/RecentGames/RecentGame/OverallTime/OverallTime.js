import React from 'react';
import classes from './OverallTime.module.css';
const OverallTime = ({gameDuration}) => {
    return (
        <div className={classes.OverallTime}>
            {gameDuration} Minutes
        </div>
    );
};

export default OverallTime;