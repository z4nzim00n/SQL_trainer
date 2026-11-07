-- Идея: заказы -> человек -> позиция меню -> пиццерия; оставляем заказы Дениса и Анны.
-- DISTINCT убирает повторы, если одну и ту же пиццу заказывали несколько раз.
SELECT DISTINCT menu.pizza_name, pizzeria.name AS pizzeria_name
FROM person_order
JOIN person ON person_order.person_id = person.id        -- чьи заказы
JOIN menu ON person_order.menu_id = menu.id              -- что заказали
JOIN pizzeria ON menu.pizzeria_id = pizzeria.id          -- где заказали
WHERE person.name = 'Denis' OR person.name = 'Anna'
ORDER BY pizza_name, pizzeria_name;
