-- Идея: сначала меняем исходные данные, потом обновляем снимок.
INSERT INTO person_visits (id, person_id, pizzeria_id, visit_date)
VALUES ((SELECT MAX(id) FROM person_visits) + 1,                -- новый id без числа
        (SELECT id FROM person WHERE name = 'Dmitriy'),         -- человек по имени
        (SELECT id FROM pizzeria WHERE name = 'DoDo Pizza'),    -- другая пиццерия, где есть пицца дешевле 800
        '2022-01-08');

REFRESH MATERIALIZED VIEW mv_dmitriy_visits_and_eats;           -- пересчитать снимок
