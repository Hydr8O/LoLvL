import React from 'react';
import classes from './Navbar.module.css';

const Navbar = ({children}) => {
    return <nav className={classes.Navbar}>{children}</nav>
}

export default Navbar;