import React, {useEffect} from 'react';
import classes from './Quest.module.css';
import QuestContent from './QuestContent/QuestContent';
import QuestImg from './QuestImg/QuestImg';
import QuestDescription from './QuestDescription/QuestDescription';
import QuestProgress from './QuestProgress/QuestProgress';


const Quest = ({questInfo, completeQuestHandler}) => {


    useEffect(() => {
        console.log('Update');
        if (questInfo.gameGoal === questInfo.currentProgress) {
            completeQuestHandler(questInfo.id);
        }
    }, [questInfo, completeQuestHandler]);

    const description = questInfo.description
    .replace('$questGoal', questInfo.questGoal)
    .replace('$gameGoal', questInfo.gameGoal);

    let quest = (
        <div className={classes.Quest}>
            <QuestImg img={questInfo.questImg}/>
            <QuestContent>
                <QuestDescription description={description}/>
                <QuestProgress progress={{
                    currentProgress: questInfo.currentProgress, 
                    questGoal: questInfo.gameGoal
                    }}/>
            </QuestContent>
        </div>
    );


    return (quest);
}

export default Quest;