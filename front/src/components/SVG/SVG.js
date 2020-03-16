import React from 'react';

const SVG = ({className, iconName}) => (
    <svg className={className}>
        <use xlinkHref={`/sprite.svg#${iconName}`}/>
    </svg>
);

export default SVG