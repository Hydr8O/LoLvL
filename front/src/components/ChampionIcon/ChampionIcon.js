import React from 'react';
import classes from './ChampionIcon.module.css';

const ChampionIcon = ({champion}) => {
    return (
        <img className={classes.ChampionIcon} 
        src={`/champion/${champion}`} 
        alt='Champion Icon'/>
    )
}

export default ChampionIcon;