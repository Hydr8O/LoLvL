import React from 'react';
import classes from './Backdrop.module.css';

const Backdrop = (props) => {
    return (
        <div onClick={props.hideBackdrop} className={classes.Backdrop}>
            {props.children}
        </div>
    );
};

export default Backdrop;