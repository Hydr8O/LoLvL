import React from 'react';
import classes from './Jumbotron.module.css';
const Jumbotron = ({children}) => {
    return (
        <div className={classes.Jumbotron}>
            {children}
        </div>
    );
};

export default Jumbotron;