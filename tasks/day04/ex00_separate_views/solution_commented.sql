-- Идея: два сохранённых запроса, каждый фильтрует людей по полу.
CREATE VIEW v_persons_female AS
SELECT * FROM person WHERE gender = 'female';   -- все столбцы, только женщины

CREATE VIEW v_persons_male AS
SELECT * FROM person WHERE gender = 'male';     -- все столбцы, только мужчины
