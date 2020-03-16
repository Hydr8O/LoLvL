import React from 'react';
import classes from './RecentGames.module.css';
import RecentGame from './RecentGame/RecentGame';
import HeaderSecondary from '../HeaderSecondary/HeaderSecondary';

const RecentGames = (props) => {
    const games = props.recentGames.map(game => {
        return <RecentGame recentGame={game} key={game.gameId}/>
    });
    console.log('updated');

    return (
        <section className={classes.RecentGames}>
            <HeaderSecondary> 
                Last {props.recentGames.length} Games Stats
            </HeaderSecondary>
            {games}
         </section>
    );
}
    
export default RecentGames;