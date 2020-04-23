const dbPool = require('../../db/dbPool');
const questTypes = require('../../questTypes');

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
            const avgCS = 'AVG(minions_killed / game_duration)';
            const avgKDA = 'AVG((kills + assists) / deaths)';
            const avgGPM = 'AVG(gold_earned / game_duration)';
            const avgWards = 'AVG(wards_placed)';
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

    const insertQuest = (typeId, summonerId) => {
        return new Promise((resolve, reject) => {
            const query =
                `INSERT INTO quest(
                type_id, 
                summoner_id
            ) VALUES (
                ${typeId},
                '${summonerId}'
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
            if (summonerStats.cs < overallStats.cs) {
                await insertQuest(questTypes.minion, summonerId);
            }

            if (summonerStats.kda < overallStats.kda) {
                await insertQuest(questTypes.kda, summonerId);
            }

            if (summonerStats.gpm < overallStats.gpm) {
                await insertQuest(questTypes.gold, summonerId);
            }

            if (summonerStats.wards < overallStats.wards) {
                await insertQuest(questTypes.ward, summonerId);
            }

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
                quest_goal,
                quest_img
            FROM quest 
            JOIN quest_type 
            ON quest.type_id = quest_type.id 
            WHERE summoner_id = '${summonerId}'`,
            (err, response) => {
                if (err) {
                    reject(err);
                }
                resolve(response.rows)
            })
    });
}

exports.loadQuests = (req, res) => {
    (async () => {
        try {
            const id = req.params.summonerId;
            const tier = req.params.tier;
            const rank = req.params.rank;

            let quests = await getQuests(id);

            let data;

            if (quests.length === 0) {
                await createNewQuests(id, tier, rank);
                quests = await getQuests(id);
            }

            data = quests.map(entry => {
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

            res.json(data);
        } catch (err) {
            console.log(err);
        }
    })();
};