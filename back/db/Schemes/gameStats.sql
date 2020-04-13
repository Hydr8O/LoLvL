CREATE TABLE gameStats(
    id INT NOT NULL,
    win BOOLEAN NOT NULL,
    kills INT NOT NULL,
    deaths INT NOT NULL,
    assists INT NOT NULL,
    longestTimeSpentLiving INT NOT NULL,
    totalDamageDealt INT NOT NULL,
    wardsPlaced INT NOT NULL,
    lane VARCHAR(10) DEFAULT 'Unknown',
    gameDuration INT NOT NULL,
    summonerId TEXT NOT NULL,
    CONSTRAINT oneGame PRIMARY KEY (id, summonerId),
    FOREIGN KEY(summonerId) REFERENCES summoner(id),
    gameCreation BIGINT NOT NULL UNIQUE DEFAULT 'None'
);