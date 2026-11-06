-- Идея: посещения Kate -> пиццерия -> её меню -> фильтр по цене.
SELECT menu.pizza_name, menu.price, pizzeria.name AS pizzeria_name, person_visits.visit_date
FROM person_visits
JOIN person ON person.id = person_visits.person_id          -- кто посещал
JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id    -- куда ходил
JOIN menu ON menu.pizzeria_id = pizzeria.id                 -- пиццы этой пиццерии
WHERE person.name = 'Kate' AND menu.price BETWEEN 800 AND 1000   -- границы включаются
ORDER BY pizza_name, price, pizzeria_name;
