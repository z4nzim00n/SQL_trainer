-- Идея: заказы -> цена из меню -> пиццерия; считаем метрики по группе.
SELECT pizzeria.name,
       COUNT(*) AS count_of_orders,                       -- число заказов
       ROUND(AVG(menu.price), 2) AS average_price,        -- средняя цена, 2 знака
       MAX(menu.price) AS max_price,
       MIN(menu.price) AS min_price
FROM person_order
JOIN menu ON menu.id = person_order.menu_id
JOIN pizzeria ON pizzeria.id = menu.pizzeria_id
GROUP BY pizzeria.name
ORDER BY pizzeria.name;
