const dbPool = require('../../db/dbPool');
const questTypes = require('../../questTypes');


const kda = '(kills + assists) / deaths';
const gpm = 'gold_earned / game_duration';
const wards = 'wards_placed';
const cs = 'minions_killed / game_duration';

const createNewQuests = async (summonerId, tier, rank) => {
    console.log(tier, rank);
    const statsQuery = (table) => {
        return new Promise((resolve, reject) => {
            let condition = `tier = '${tier}' and rank = '${rank}'`;
            console.log(table);
            console.log(summonerId);

            if (table === 'game_stats') {
                condition = `summoner_id = '${summonerId}'`;
            }
            const avgCS = `AVG(${cs})`;
            const avgKDA = `AVG(${kda})`;
            const avgGPM = `AVG(${gpm})`;
            const avgWards = `AVG(${wards})`;
            const query =
                `SELECT 
                ${avgCS} AS cs, 
                ${avgKDA} AS kda, 
                ${avgGPM} AS gpm,
                ${avgWards} AS wards
            FROM ${table} WHERE ${condition} and deaths != 0`;
            console.log(query);
            dbPool.query(
                query,
                (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(response.rows[0]);
                }
            );
        })
    };

    const insertQuest = (typeId, summonerId, questGoal) => {
        console.log(questGoal);
        return new Promise((resolve, reject) => {
            const query =
                `INSERT INTO quest(
                type_id, 
                summoner_id,
                quest_goal
            ) VALUES (
                ${typeId},
                '${summonerId}',
                ${Math.floor(questGoal)}
            )`;
            console.log(query);
            dbPool.query(query, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


    
        try {
            const overallStats = await statsQuery('data_for_quests');
            const summonerStats = await statsQuery('game_stats');
            const goalOffsets = {
                cs: Math.floor(Math.random() * 2),
                kda: Math.floor(Math.random() * 3),
                gpm: Math.floor(Math.random() * 15),
                wards: Math.floor(Math.random() * 3)
            }
            console.log(goalOffsets);
            if (Number(summonerStats.cs) < Number(overallStats.cs)) {
                await insertQuest(questTypes.minion, summonerId, Number(overallStats.cs) + Number(goalOffsets.cs));
            }

            if (Number(summonerStats.kda) < Number(overallStats.kda)) {
                await insertQuest(questTypes.kda, summonerId, Number(overallStats.kda) + Number(goalOffsets.kda));
            }

            if (Number(summonerStats.gpm) < Number(overallStats.gpm)) {
                await insertQuest(questTypes.gold, summonerId, Number(overallStats.gpm) + Number(goalOffsets.gpm));
            }

            if (Number(summonerStats.wards) < Number(overallStats.wards)) {
                await insertQuest(questTypes.ward, summonerId, Number(overallStats.wards) + Number(goalOffsets.wards));
            }
            console.log(summonerStats.wards, overallStats.wards);
            console.log(overallStats);
            console.log(summonerStats);
        } catch (err) {
            console.log(err);
        }
}

const getQuests = (summonerId) => {
    return new Promise((resolve, reject) => {
        dbPool.query(
            `SELECT 
                quest.id, 
                summoner_id, 
                current_progress, 
                description, 
                game_goal,
                quest_goal,
                quest_img,
                type_id
            FROM quest 
            JOIN quest_type 
            ON quest.type_id = quest_type.id 
            WHERE summoner_id = '${summonerId}'`,
            (err, response) => {
                if (err) {
                    reject(err);
                }
                resolve(response.rows.map(row => {
                    return {
                        id: row.id,
                        summonerId: row.summoner_id,
                        currentProgress: row.current_progress,
                        description: row.description,
                        gameGoal: row.game_goal,
                        questImg: row.quest_img,
                        typeId: row.type_id,
                        questGoal: row.quest_goal
                    }
                }))
            })
    });
}

const statsToConsider = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                created_at
            FROM quest
            WHERE summoner_id = '${id}'
        `;
        dbPool.query(
            query,
            (err, response) => {
                if (err) {
                    reject(err);
                };

                for (row of response.rows) {
                    dbPool.query(`
                    UPDATE game_stats
                    SET was_used = true
                    WHERE game_creation > ${row.created_at} 
                    AND was_used = false
                    AND deaths != 0
                    RETURNING 
                        ${wards} AS wards, 
                        ${kda} AS kda, 
                        ${gpm} AS gpm, 
                        ${cs} AS cs
                    `,
                    (err, response) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(response.rows);
                    })
                };
            } 
        )
    });
}

const getStatsAndGoals = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                type_id, 
                quest_goal 
            FROM quest_type 
            JOIN quest 
            ON quest_type.id = quest.type_id 
            WHERE quest.summoner_id = '${id}'
        `;
        dbPool.query(
            query,
            (err, response) => {
                if (err) {
                    reject(err);
                };

                const result = {};

                for (row of response.rows) {
                    result[row.type_id] = row.quest_goal;
                }

                
                resolve(result);
            } 
        )
    });
}

const updateQuest = (id, typeId, count) => {
    console.log(id, typeId, count);
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE quest
            SET current_progress = ${count}
            WHERE type_id = ${typeId} 
            AND summoner_id = '${id}'
        `;
        dbPool.query(
            query,
            (err, response) => {
                if (err) {
                    console.log('Fail updateQuest');
                    reject(err);
                };

                resolve('Ok');
            } 
        )
    });
}

const isQuestCompleted = () => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE
            FROM quest
            WHERE quest.id 
            IN(
                SELECT 
                    quest.id
                FROM quest
                JOIN quest_type
                ON quest.type_id = quest_type.id
                WHERE current_progress >= game_goal
            )
        `;

        dbPool.query(query, (err, response) => {
            if (err) {
                reject(err);
            }
            console.log('isQuestCompleted');
            resolve('Ok');
        })
    });
}

exports.loadQuests = (req, res) => {
    console.log('load quest');
    (async () => {
        try {
            const id = req.params.summonerId;
            const tier = req.params.tier;
            const rank = req.params.rank;

            

            let quests = await getQuests(id);

            if (quests.length !== 0) {
                const stats = await statsToConsider(id);
                const typesAndGoals = await getStatsAndGoals(id);
                const count = {};
                console.log(quests);
                for (quest of quests) {
                    if (quest.typeId === questTypes.ward) {
                        count.ward = quest.currentProgress;
                    }

                    if (quest.typeId === questTypes.minion) {
                        count.minion = quest.currentProgress;
                    }

                    if (quest.typeId === questTypes.gold) {
                        count.gold = quest.currentProgress;
                    }

                    if (quest.typeId === questTypes.kda) {
                        count.kda = quest.currentProgress;
                    }
                }
                
                console.log(count);
                console.log(stats);
                for (row of stats) {
                    if (row.wards >= typesAndGoals[questTypes.ward]) {
                        count.ward++;
                        console.log('Wards');
                    }
    
                    if (row.cs >= typesAndGoals[questTypes.minion]) {
                        count.minion++;
                        console.log('CS');
                    }
    
                    if (row.gpm >= typesAndGoals[questTypes.gold]) {
                        count.gold++;
                        console.log('GPM');
                    }
    
                    if (row.kda >= typesAndGoals[questTypes.kda]) {
                        count.kda++;
                        console.log('KDA');
                    }   
                }
                
                for (key of Object.keys(count)) {
                    console.log(await updateQuest(id, questTypes[key], count[key]));
                    console.log(await isQuestCompleted());
                }

                quests = await getQuests(id);
            } else {
                await createNewQuests(id, tier, rank);
                quests = await getQuests(id);
            }      

            res.json(quests);
        } catch (err) {
            console.log(err);
        }
    })();
};