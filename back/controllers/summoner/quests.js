const dbPool = require('../../db/dbPool');


const createNewQuests = (id) => {
    questData = {
        typeId: 1,
        summonerId: id,
        currentProgress: 0
    }
    
    dbPool.query(`INSERT INTO 
    quest(
        type_id, 
        summoner_id, 
        current_progress
        ) 
    VALUES (
        ${questData.typeId},
        '${questData.summonerId}',
        ${questData.currentProgress}
    )`, (err, response) => {
        if (err) {
            return console.log(err);
        }
    });
    return questData;
}

exports.loadQuests = (req, res) => {
    const id = req.params.summonerId;
    dbPool.query(`SELECT 
        quest.id, 
        summoner_id, 
        current_progress, 
        description, 
        quest_goal,
        quest_img
    FROM quest JOIN quest_type ON quest.type_id = quest_type.id WHERE summoner_id = '${id}'`, (err, response) => {
        if (err) {
            return console.log(err);
        }

        const result = response.rows;
        let data;
        if (result.length === 0) {
            data = createNewQuests(id);
        } else {
            data = result.map(entry => {
                return {
                    id: entry.id,
                    summonerId: entry.summoner_id,
                    currentProgress: entry.current_progress,
                    description: entry.description,
                    questGoal: entry.quest_goal,
                    questImg: entry.quest_img
                }
            });
            console.log("data", data);
            
        }
        res.json(data);
    })
    
    console.log(id);
};