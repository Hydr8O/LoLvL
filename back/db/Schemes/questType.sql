CREATE TABLE quest_type(
    id SERIAL NOT NULL PRIMARY KEY,
    description TEXT NOT NULL,
    quest_goal INT NOT NULL
);

INSERT INTO quest_type(description, quest_goal) 
VALUES ('Privet', 10), ('Pola', 15);