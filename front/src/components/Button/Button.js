import React from 'react';
import classes from './Button.module.css';

const Button = ({children, type, align, onClick, disabled}) => {
    return (
        <button disabled={disabled} className={[classes.Button, classes[type], classes[align]].join(' ')} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;