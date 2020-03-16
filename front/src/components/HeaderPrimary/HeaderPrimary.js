import React from 'react';
import classes from './HeaderPrimary.module.css';

const HeaderPrimary = ({children, type, util}) => {
    return (
        <h1 className={[classes.HeaderPrimary, classes[type], util].join(' ')}>{children}</h1>
    );
};

export default HeaderPrimary;