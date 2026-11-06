(SELECT pizzeria.name AS pizzeria_name FROM person_visits JOIN person ON person.id = person_visits.person_id JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id WHERE person.gender = 'female'
EXCEPT ALL
SELECT pizzeria.name FROM person_visits JOIN person ON person.id = person_visits.person_id JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id WHERE person.gender = 'male')
UNION ALL
(SELECT pizzeria.name AS pizzeria_name FROM person_visits JOIN person ON person.id = person_visits.person_id JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id WHERE person.gender = 'male'
EXCEPT ALL
SELECT pizzeria.name FROM person_visits JOIN person ON person.id = person_visits.person_id JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id WHERE person.gender = 'female')
ORDER BY pizzeria_name;
