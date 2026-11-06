-- Способ 1: NOT IN. Исключаем пиццерии, чей id встречается среди посещений.
SELECT name
FROM pizzeria
WHERE id NOT IN (SELECT pizzeria_id FROM person_visits);

-- Способ 2 (тот же результат): NOT EXISTS
-- SELECT name FROM pizzeria
-- WHERE NOT EXISTS (SELECT 1 FROM person_visits WHERE person_visits.pizzeria_id = pizzeria.id);
