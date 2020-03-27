import React from 'react';
import classes from './Popup.module.css';

const Popup = ({children}) => {
    return (
        <div className={classes.Popup}>
            {children}
        </div>
    );
};

export default Popup;