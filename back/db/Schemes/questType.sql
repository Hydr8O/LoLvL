CREATE TABLE quest_type(
    id INT NOT NULL PRIMARY KEY,
    description TEXT NOT NULL,
    quest_header VARCHAR(50) NOT NULL,
    quest_goal INT NOT NULL,
    quest_img VARCHAR(10) NOT NULL
);
