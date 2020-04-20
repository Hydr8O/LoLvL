CREATE TABLE quest(
    id SERIAL NOT NULL PRIMARY KEY,
    type_id INT NOT NULL,
    summoner_id TEXT UNIQUE NOT NULL,
    current_progress INT DEFAULT 0,
    FOREIGN KEY(summoner_id) REFERENCES summoner(id), 
    FOREIGN KEY(type_id) REFERENCES quest_type(id)
);