import React from 'react';
import classes from './ChampResult.module.css';
import ChampionIcon from '../../../ChampionIcon/ChampionIcon';

const ChampResult = (props) => {
    return (
        <div className={classes.ChampResult}>
            <ChampionIcon champion={props.champion}/>
            <div className={[classes.ResultText, props.color].join(' ')}>{props.gameResult}</div>
        </div>
    );
};

export default ChampResult;