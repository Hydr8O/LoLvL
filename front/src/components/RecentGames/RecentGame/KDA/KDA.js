import React from 'react';
import classes from './KDA.module.css';

const KDA = ({gameStats}) => {
    const killingSprees = [null, 'Double kill', 'Triple kill', 'Quadra kill', 'Penta kill'];
    let killStreak = killingSprees[gameStats.largestMultiKill - 1];
    let kda = 'Perfect!';

    if (gameStats.deaths) {
        kda = Number((gameStats.kills + gameStats.assists) / gameStats.deaths).toFixed(2)
    }
    
    return (
        <div className={classes.KDA}>  
            <div>
                {gameStats.kills} / {gameStats.deaths} / {gameStats.assists}
            </div>
            <div className={classes.KDAText}>
                KDA: 
                <div>
                    {kda}
                </div>
            </div>  
            {killStreak ? <div className={classes.KillStreak}>
                {killStreak}
            </div> : null}
        </div>
    );
};

export default KDA;