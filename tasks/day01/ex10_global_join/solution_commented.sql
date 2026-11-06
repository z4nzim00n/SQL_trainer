-- Идея: от заказа идём по цепочке: человек, меню, пиццерия.
SELECT person.name AS person_name,
       menu.pizza_name AS pizza_name,
       pizzeria.name AS pizzeria_name
FROM person_order
JOIN person ON person.id = person_order.person_id      -- кто заказал
JOIN menu ON menu.id = person_order.menu_id            -- что заказал
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id        -- где это меню
ORDER BY person_name, pizza_name, pizzeria_name;       -- по трём столбцам по возрастанию
