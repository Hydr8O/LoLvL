import React from 'react';
import classes from './QuestDescription.module.css';

const QuestDescription = ({description}) => {
    return (
        <div className={classes.QuestDescription}>
            {description}
        </div>
    );
};

export default QuestDescription;