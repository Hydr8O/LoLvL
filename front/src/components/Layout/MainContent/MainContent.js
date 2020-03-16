import React from 'react';
import classes from './MainContent.module.css';

const MainContent = ({children}) => {
    return (
        <main className={classes.MainContent}>
            {children}
        </main>
    );
}

export default MainContent