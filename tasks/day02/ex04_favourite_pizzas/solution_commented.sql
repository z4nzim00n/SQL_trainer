-- Идея: позиции меню с нужными пиццами плюс название пиццерии.
SELECT menu.pizza_name, pizzeria.name AS pizzeria_name, menu.price
FROM menu
JOIN pizzeria ON menu.pizzeria_id = pizzeria.id          -- название пиццерии по её id
WHERE menu.pizza_name = 'mushroom pizza' OR menu.pizza_name = 'pepperoni pizza'   -- один из двух видов
ORDER BY pizza_name, pizzeria_name;
