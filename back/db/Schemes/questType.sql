CREATE TABLE quest_type(
    id SERIAL NOT NULL PRIMARY KEY,
    description TEXT NOT NULL,
    quest_header VARCHAR(50) NOT NULL,
    quest_goal INT NOT NULL,
    quest_img VARCHAR(10) NOT NULL
);

INSERT INTO quest_type(description, quest_goal, quest_img) 
VALUES ('Place wards', 10, 'ward'), ('Earn gold', 15, 'gold');