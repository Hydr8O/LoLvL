CREATE TABLE data_for_quests(
    id INT NOT NULL,
    win BOOLEAN NOT NULL,
    kills INT NOT NULL,
    deaths INT NOT NULL,
    assists INT NOT NULL,
    longest_time_spent_living INT NOT NULL,
    total_damage_dealt INT NOT NULL,
    wards_placed INT NOT NULL,
    lane VARCHAR(10) NOT NULL,
    game_duration INT NOT NULL,
    summoner_id TEXT NOT NULL,
    game_creation BIGINT NOT NULL UNIQUE,
    rank VARCHAR(10) NOT NULL,
    tier VARCHAR(2) NOT NULL,
    CONSTRAINT unique_game PRIMARY KEY (id, summoner_id)
);