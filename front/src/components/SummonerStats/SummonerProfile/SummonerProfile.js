import React from 'react';
import classes from './SummonerProfile.module.css';
import Button from '../../Button/Button';
import MainChampion from './MainChampion/MainChampion';

const SummonerProfile = (props) => {

    return (
        <div className={classes.SummonerProfile}>
            <div className={classes.Profile}>
                <img className={classes.ProfileIcon} src={`/profileIcon/${props.profileIcon}.png`} alt='Profile icon'/>
                <div className={classes.NameLvl}>
                    <p className={classes.Name}>{props.name}</p>
                    <p>Level: <span className={classes.Level}>{props.level}</span></p>
                </div>  
                <Button 
                type='Primary' 
                align='Center' 
                onClick={props.analyzeSummoner}>
                    Analyze Summoner Info
                </Button>
                <MainChampion champion={props.mainChamp}/>
            </div>
        </div>
    );
}

export default SummonerProfile;