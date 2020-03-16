import React from 'react';
import ChampionIcon from '../../../ChampionIcon/ChampionIcon';
import classes from './MainChampion.module.css';

const MainChampion = (props) => {
    return (
        <div className={classes.MainChampion}>
            <div className={classes.Title}>
                Main Champion
            </div>
            <ChampionIcon champion={props.champion.championInfo.image.full}/>
            <div className={classes.Mastery}>
                <div className={classes.MasteryPointsTitle}>
                    Mastery points:
                </div>
                <div className={classes.MasteryPoints}>
                    {props.champion.championPoints}
                </div>
            </div>
        </div>
    )
}

export default MainChampion;