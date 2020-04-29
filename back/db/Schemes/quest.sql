CREATE TABLE quest(
    id SERIAL NOT NULL PRIMARY KEY,
    type_id INT NOT NULL,
    summoner_id TEXT NOT NULL,
    current_progress INT DEFAULT 0,
    game_progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quest_goal INT NOT NULL,
    FOREIGN KEY(summoner_id) REFERENCES summoner(id), 
    FOREIGN KEY(type_id) REFERENCES quest_type(id)
);