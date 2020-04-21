import React from 'react';
import classes from './QuestProgress.module.css';

const QuestProgress = ({progress}) => {
    return (
        <div className={classes.QuestProgress}>
            {progress.currentProgress} / {progress.questGoal}
        </div>
    );
};

export default QuestProgress;