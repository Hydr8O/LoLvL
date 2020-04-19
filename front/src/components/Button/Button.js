import React, { Fragment } from 'react';
import classes from './Button.module.css';
import {Link} from 'react-router-dom';

const Button = ({children, type, align, onClick, disabled, link=false, to}) => {
    let onClickListener = null;
    if (onClick) {
        onClickListener = (event) => {
            event.preventDefault();
            for (let e of onClick) {
                e.call();
            }
        }
    }
    

    const btn = link === true ? 
    <Link className={[classes.Button, classes.Link, classes[type], classes[align]].join(' ')} to={to}>{children}</Link>:
    <button disabled={disabled} className={[classes.Button, classes[type], classes[align]].join(' ')} onClick={onClickListener}>
            {children}
        </button>
    console.log(to);
    return (
        <Fragment>
            {btn}
        </Fragment>
        
    );
};

export default Button;