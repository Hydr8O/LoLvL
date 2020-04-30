import React from 'react';
import Classes from './DropItem.module.css';

const DropItem = ({children}) => {
    return (
        <li className={Classes.DropItem}>
            {children}
        </li>
    );

};

export default DropItem;