-- Идея: сначала отбираем нужные посещения, потом полностью соединяем с людьми и пиццериями.
SELECT COALESCE(person.name, '-') AS person_name,      -- NULL вместо имени -> '-'
       pv.visit_date,
       COALESCE(pizzeria.name, '-') AS pizzeria_name   -- NULL вместо названия -> '-'
FROM person
FULL JOIN (SELECT person_id, pizzeria_id, visit_date
           FROM person_visits
           WHERE visit_date BETWEEN '2022-01-01' AND '2022-01-03') AS pv   -- только посещения 1-3 января
       ON person.id = pv.person_id                      -- все люди, даже без посещений
FULL JOIN pizzeria ON pv.pizzeria_id = pizzeria.id      -- все пиццерии, даже без посетителей
ORDER BY person_name, visit_date, pizzeria_name;
