import React from 'react';
import classes from './Loading.module.css';

const Loading = () => (
    <div className={classes.Loading}>
        <div className={[classes.First, classes.Circle].join(' ')}></div>
        <div className={[classes.Second, classes.Circle].join(' ')}></div>
        <div className={[classes.Third, classes.Circle].join(' ')}></div>
    </div>
);

export default Loading;
