-- Идея: забытые позиции меню (как в задании 01) плюс название пиццерии.
SELECT menu.pizza_name, menu.price, pizzeria.name AS pizzeria_name
FROM menu
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id               -- название пиццерии
WHERE menu.id NOT IN (SELECT menu_id FROM person_order)       -- позиции, которые никто не заказывал
ORDER BY pizza_name, price;
