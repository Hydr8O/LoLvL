import React from 'react';

const SVG = ({className, iconName, fromFile}) => {
    let svg = 
    <svg className={className}>
        <use xlinkHref={`/sprite.svg#${iconName}`}/>
    </svg>

    if (fromFile) {
        svg = 
        <object type="image/svg+xml" data={iconName} className={className}>
            Your browser does not support SVG
        </object>
    }
    
    return (svg);
};

export default SVG