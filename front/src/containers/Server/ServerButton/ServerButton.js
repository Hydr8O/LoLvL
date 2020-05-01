import React from 'react';
import Classes from './ServerButton.module.css';

const ServerButton = ({children, onClick}) => {
    return (
        <button
        onClick={onClick} 
        className={Classes.ServerButton}>
            {children}
        </button>
    )
};

export default ServerButton;