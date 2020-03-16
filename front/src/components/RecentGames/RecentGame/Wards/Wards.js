import React from 'react';
import classes from './Wards.module.css';

const Wards = ({gameStats}) => {
    return (
        <div className={classes.Wards}>
            Wards Placed
            <div>
                {gameStats.wardsPlaced}
            </div>
            Control Wards Bought
            <div>
                {gameStats.visionWardsBoughtInGame}
            </div>
        </div>
    );
};

export default Wards;