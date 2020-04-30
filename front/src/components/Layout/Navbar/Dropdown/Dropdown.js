import React from 'react';
import Classes from './Dropdown.module.css';


const Dropdown = ({ children }) => {
    return (
        <ul className={Classes.Dropdown}>
            {children}
        </ul>
    );
};

export default Dropdown;