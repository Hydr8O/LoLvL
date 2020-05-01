import React from 'react';
import classes from './QuestContent.module.css';

const QuestContent = ({children}) => {
    return (
        <div className={classes.QuestContent}>
            {children}
        </div>
    );
};

export default QuestContent;