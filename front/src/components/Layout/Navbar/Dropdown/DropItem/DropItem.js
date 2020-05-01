import React from 'react';
import Classes from './DropItem.module.css';

const DropItem = ({children, onClick, id, active}) => {
    const activeStyle = id === active ? Classes.ActiveItem : null;
    return (
        <li className={[Classes.DropItem, activeStyle].join(' ')} onClick={() => onClick(children)}>
            {children}
        </li>
    );

};

export default DropItem;