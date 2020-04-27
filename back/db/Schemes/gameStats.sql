CREATE TABLE game_stats(
    id INT NOT NULL,
    win BOOLEAN NOT NULL,
    kills INT NOT NULL,
    deaths INT NOT NULL,
    assists INT NOT NULL,
    longest_time_spent_living INT NOT NULL,
    total_damage_dealt INT NOT NULL,
    wards_placed INT NOT NULL,
    lane VARCHAR(10) DEFAULT 'Unknown',
    game_duration INT NOT NULL,
    summoner_id TEXT NOT NULL,
    CONSTRAINT one_game PRIMARY KEY (id, summoner_id),
    FOREIGN KEY(summoner_id) REFERENCES summoner(id),
    game_creation BIGINT NOT NULL,
    minions_killed INT NOT NULL,
    gold_earned INT NOT NULL,
    was_used BOOLEAN DEFAULT false
);