-- Идея: посещение Дмитрия 8 января + меню этой же пиццерии с ценой ниже 800.
SELECT pizzeria.name AS pizzeria_name
FROM person_visits
JOIN person ON person_visits.person_id = person.id          -- кто был
JOIN pizzeria ON person_visits.pizzeria_id = pizzeria.id    -- где был
JOIN menu ON menu.pizzeria_id = pizzeria.id                 -- что там продаётся
WHERE person.name = 'Dmitriy'
  AND person_visits.visit_date = '2022-01-08'
  AND menu.price < 800;                                     -- строго дешевле 800
