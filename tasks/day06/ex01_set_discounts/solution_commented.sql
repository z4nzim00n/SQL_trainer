-- Идея: по строке на пару (клиент, пиццерия); скидка зависит от числа заказов.
INSERT INTO person_discounts (id, person_id, pizzeria_id, discount)
SELECT ROW_NUMBER() OVER () AS id,                      -- номера 1, 2, 3, ...
       person_order.person_id,
       menu.pizzeria_id,                                -- пиццерию даёт меню
       CASE WHEN COUNT(*) = 1 THEN 10.5                 -- один заказ
            WHEN COUNT(*) = 2 THEN 22                   -- два заказа
            ELSE 30 END                                 -- три и больше
FROM person_order
JOIN menu ON menu.id = person_order.menu_id
GROUP BY person_order.person_id, menu.pizzeria_id;
