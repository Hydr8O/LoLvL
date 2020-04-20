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
