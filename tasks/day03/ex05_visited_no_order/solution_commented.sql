-- Идея: пиццерии, где Andrey был, минус пиццерии, где он заказывал.
SELECT pizzeria.name AS pizzeria_name
FROM person_visits
JOIN person ON person.id = person_visits.person_id
JOIN pizzeria ON pizzeria.id = person_visits.pizzeria_id
WHERE person.name = 'Andrey'                      -- где был
EXCEPT                                            -- вычитаем
SELECT pizzeria.name
FROM person_order
JOIN person ON person.id = person_order.person_id
JOIN menu ON menu.id = person_order.menu_id
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id   -- пиццерия заказа определяется по меню
WHERE person.name = 'Andrey'                      -- где заказывал
ORDER BY pizzeria_name;
