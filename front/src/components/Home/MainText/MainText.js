import React from 'react';
import classes from './MainText.module.css';

const MainText = ({children}) => {
    return (
        <p>{children}</p>
    );
};

export default MainText;