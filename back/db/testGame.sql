
DELETE FROM game_stats WHERE id IN (1231341212, 1231341213, 123134121);

INSERT INTO
    game_stats(
        id,
        win,
        kills,
        deaths,
        assists,
        longest_time_spent_living,
        total_damage_dealt,
        wards_placed,
        lane,
        game_duration,
        summoner_id,
        game_creation,
        gold_earned,
        minions_killed)
    VALUES (
        123134121,
        true,
        2,
        3,
        3,
        3242,
        2234,
        15,
        'lane',
        22314431,
        '3r8TNHznMBto9WHtuTx11rWsorPgsHIftTi1k1nQ0CcZYA',
        to_char(CURRENT_TIMESTAMP, 'yyyymmddhh24miss')::bigint,
        2342,
        234
    );

    INSERT INTO
    game_stats(
        id,
        win,
        kills,
        deaths,
        assists,
        longest_time_spent_living,
        total_damage_dealt,
        wards_placed,
        lane,
        game_duration,
        summoner_id,
        game_creation,
        gold_earned,
        minions_killed)
    VALUES (
        1231341213,
        true,
        2,
        3,
        3,
        3242,
        2234,
        15,
        'lane',
        22314431,
        '3r8TNHznMBto9WHtuTx11rWsorPgsHIftTi1k1nQ0CcZYA',
        to_char(CURRENT_TIMESTAMP, 'yyyymmddhh24miss')::bigint,
        2342,
        234
    );

    INSERT INTO
    game_stats(
        id,
        win,
        kills,
        deaths,
        assists,
        longest_time_spent_living,
        total_damage_dealt,
        wards_placed,
        lane,
        game_duration,
        summoner_id,
        game_creation,
        gold_earned,
        minions_killed)
    VALUES (
        1231341212,
        true,
        2,
        3,
        3,
        3242,
        2234,
        15,
        'lane',
        22314431,
        '3r8TNHznMBto9WHtuTx11rWsorPgsHIftTi1k1nQ0CcZYA',
        to_char(CURRENT_TIMESTAMP, 'yyyymmddhh24miss')::bigint,
        2342,
        234
    );
