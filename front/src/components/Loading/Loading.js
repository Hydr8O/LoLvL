import React from 'react';
import classes from './Loading.module.css';

const Loading = (props) => (
    <div className={props.small ? classes.SmallLoading : classes.Loading}>
        <div className={[classes.First, classes.Circle, props.small ? classes.Small : null].join(' ')}></div>
        <div className={[classes.Second, classes.Circle, props.small ? classes.Small : null].join(' ')}></div>
        <div className={[classes.Third, classes.Circle, props.small ? classes.Small : null].join(' ')}></div>
    </div>
);

export default Loading;
