import React, {useState, useEffect} from 'react';
import classes from './SummonerProfile.module.css';
import Button from '../../Button/Button';
import MainChampion from './MainChampion/MainChampion';
import Loading from '../../Loading/Loading';
import {withRouter} from 'react-router-dom';


const SummonerProfile = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoadingHandler = () => {
        setIsLoading(true);
    }
    console.log(props)
    return (
        <div className={classes.SummonerProfile}>
            <div className={classes.Profile}>
                <img className={classes.ProfileIcon} src={`/profileIcon/${props.profileIcon}.png`} alt='Profile icon'/>
                <div className={classes.NameLvl}>
                    <p className={classes.Name}>{props.name}</p>
                    <p>Level: <span className={classes.Level}>{props.level}</span></p>
                </div>  
                {
                    !props.isInDb ? 
                    <Button 
                    type='Primary' 
                    align='Center' 
                    disabled={props.disableBtn}
                    onClick={[props.analyzeSummoner, setLoadingHandler]}>
                        {isLoading ? <Loading small={true}/> :
                        "Analyze Summoner"}
                    </Button> : 
                    <Button 
                    to={`/summoner/${props.name}/quests`}
                    type='Primary' 
                    align='Center' 
                    disabled={props.disableBtn}
                    link={true}
                    >
                        Quests
                    </Button>
                }
                <MainChampion champion={props.mainChamp}/>
            </div>
        </div>
    );
}

export default withRouter(SummonerProfile);