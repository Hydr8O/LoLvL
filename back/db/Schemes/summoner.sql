CREATE TABLE summoner(
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    puuid TEXT UNIQUE NOT NULL,
    accountId TEXT UNIQUE NOT NULL,
    level INT NOT NULL,
    revisionDate TIMESTAMP NOT NULL,
    profileIconId INT NOT NULL
);

CREATE TABLE gameStats(
    gameId INT PRIMARY KEY,
    win BOOLEAN NOT NULL,
    kills INT NOT NULL,
    deaths INT NOT NULL,
    assists INT NOT NULL,
    longestTimeSpentLiving INT NOT NULL,
    totalDamageDealt INT NOT NULL,
    wardsPlaced INT NOT NULL,
    lane VARCHAR(10) DEFAULT 'Unknown',
    gameDuration INT NOT NULL
);