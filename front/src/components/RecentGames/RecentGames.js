import React, {Component} from 'react';
import classes from './RecentGames.module.css';
import RecentGame from './RecentGame/RecentGame';
import HeaderSecondary from '../HeaderSecondary/HeaderSecondary';

class RecentGames extends Component {
    
    shouldComponentUpdate() {
        return !this.props.allLoaded;
    }
    render() {
        const games = this.props.recentGames.map(game => {
            return <RecentGame recentGame={game} key={game.gameId}/>
        });
        console.log('updated recent games');
        return (
            <section className={classes.RecentGames}>
                <HeaderSecondary> 
                    Last {this.props.recentGames.length} Games Stats
                </HeaderSecondary>
                {games}
             </section>
        );
    }
    
}
    
export default RecentGames;