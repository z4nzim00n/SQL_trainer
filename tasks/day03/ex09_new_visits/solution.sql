INSERT INTO person_visits (id, person_id, pizzeria_id, visit_date)
SELECT (SELECT MAX(id) FROM person_visits) + person.id, person.id, (SELECT id FROM pizzeria WHERE name = 'Dominos'), '2022-02-24'
FROM person
WHERE person.name = 'Denis' OR person.name = 'Irina';
