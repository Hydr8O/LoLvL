import React, { Fragment, useEffect } from 'react';
import classes from './SummonerStats.module.css';
import Loading from '../Loading/Loading';
import SummonerProfile from './SummonerProfile/SummonerProfile';
import SummonerRank from './SummonerRank/SummonerRank';
import FavoriteLane from './FavoriteLane/FavoriteLane';



const SummonerStats = (props) => {

    useEffect(() => {
        window.addEventListener('scroll', props.scroll);
    }, []);
    
    return (
        <section className={classes.SummonerStats}>
            <Fragment>
                <SummonerProfile 
                name={props.name}
                level={props.level}
                profileIcon={props.profileIcon}
                mainChamp={props.masteryInfo[0]}
                analyzeSummoner={props.analyzeSummoner}
                isInDb={props.isInDb}
                showBackdrop={props.showBackdrop}
                disableBtn={props.disableBtn}
                />
                <FavoriteLane matchesHistory={props.matchesHistory}/>
                <SummonerRank rankStats={props.rankStats}/>
            </Fragment>
        </section>
    )
};

export default SummonerStats;

