import React from 'react';
import classes from './Quest.module.css';
import QuestContent from './QuestContent/QuestContent';
import QuestImg from './QuestImg/QuestImg';
import QuestDescription from './QuestDescription/QuestDescription';
import QuestProgress from './QuestProgress/QuestProgress';


const Quest = ({questInfo}) => {
    console.log(questInfo)
    return (
        <div className={classes.Quest}>
            <QuestImg img={questInfo.questImg}/>
            <QuestContent>
                <QuestDescription description={questInfo.description}/>
                <QuestProgress progress={{
                    currentProgress: questInfo.currentProgress, 
                    questGoal: questInfo.questGoal
                    }}/>
            </QuestContent>
        </div>
    );
}

export default Quest;