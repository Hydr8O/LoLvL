import React from 'react';
import classes from './Jumbotron.module.css';
const Jumbotron = ({children, animation}) => {
    return (
        <div className={[classes.Jumbotron, animation].join(' ')}>
            {children}
        </div>
    );
};

export default Jumbotron;