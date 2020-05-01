import React from 'react';
import classes from './QuestImg.module.css';

const QuestImg = ({img}) => {
    return <img src={`/questImages/${img}.png`} alt='Quest image' className={classes.QuestImg}/>
};

export default QuestImg;