import React from 'react';
import classes from './HeaderSecondary.module.css';



const HeaderSecondary = ({children}) => {
    return (
        <h2 className={classes.HeaderSecondary}>
            {children}
        </h2>
    );
};

export default HeaderSecondary;

