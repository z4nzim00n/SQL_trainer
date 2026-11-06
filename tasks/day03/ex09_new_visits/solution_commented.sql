-- Идея: INSERT ... SELECT: по строке посещения для каждого из двух людей.
INSERT INTO person_visits (id, person_id, pizzeria_id, visit_date)
SELECT (SELECT MAX(id) FROM person_visits) + person.id,        -- новый уникальный id
       person.id,                                              -- человек
       (SELECT id FROM pizzeria WHERE name = 'Dominos'),       -- пиццерия по названию
       '2022-02-24'
FROM person
WHERE person.name = 'Denis' OR person.name = 'Irina';
