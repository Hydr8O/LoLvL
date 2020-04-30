import React from 'react';
import Classes from './ServerIcon.module.css';
import SVG from '../../../../SVG/SVG';

const ServerIcon = ({iconName}) => {
    return (
    <SVG 
    className={Classes.ServerIcon} 
    fromFile={true} 
    iconName={`/servers/${iconName}.svg`}/>
    );
};

export default ServerIcon;