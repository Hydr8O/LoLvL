CREATE TABLE summoner(
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    puuid TEXT UNIQUE NOT NULL,
    account_id TEXT UNIQUE NOT NULL,
    level INT NOT NULL,
    revision_date TIMESTAMP NOT NULL,
    profile_icon_id INT NOT NULL,
    stats_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    game_creation BIGINT NOT NULL
);

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

CREATE TABLE quest_type(
    id SERIAL NOT NULL PRIMARY KEY,
    description TEXT NOT NULL,
    quest_goal INT NOT NULL
);

CREATE TABLE quest(
    id SERIAL NOT NULL PRIMARY KEY,
    type_id INT NOT NULL,
    summoner_id TEXT UNIQUE NOT NULL,
    current_progress INT DEFAULT 0,
    FOREIGN KEY(summoner_id) REFERENCES summoner(id), 
    FOREIGN KEY(type_id) REFERENCES quest_type(id)
);