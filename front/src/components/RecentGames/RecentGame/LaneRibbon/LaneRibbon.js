import React from 'react';
import classes from './LaneRibbon.module.css';

const LaneRibbon = ({lane}) => {
    return (
        lane === 'NO' ? null :
        <div className={classes.LaneRibbon}>
            <span className={classes.LaneText}>{lane.slice(0, 4)}</span>
        </div>
    );
};

export default LaneRibbon;