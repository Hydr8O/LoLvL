import React, {Component} from 'react';
import classes from './RecentGames.module.css';
import RecentGame from './RecentGame/RecentGame';
import HeaderSecondary from '../HeaderSecondary/HeaderSecondary';

class RecentGames extends Component {
    
    shouldComponentUpdate(prevProps) {
        return prevProps.recentGames !== this.props.recentGames;
    }

    componentDidMount() {
        console.log('Recent Games mounted');
    }

    componentDidUpdate() {
        console.log('Recent Games updated');
    }

    render() {
        const games = this.props.recentGames.map(game => {
            return <RecentGame recentGame={game} key={game.gameId}/>
        });
        
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