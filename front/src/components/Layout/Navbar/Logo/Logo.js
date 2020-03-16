import React from 'react';
import {Link} from 'react-router-dom';
import classes from './Logo.module.css'

const Logo = () => {
    return (
        <div className={classes.LogoBox}>
            <Link to='/' className={classes.Logo}>
                <img className={classes.LogoImg} src='/logo.png'/>
            </Link>
        </div>
    );
}

export default Logo;