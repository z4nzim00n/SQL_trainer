-- Идея: заказы с именем клиента, ценой и ценой со скидкой 10%.
CREATE VIEW v_price_with_discount AS
SELECT person.name,
       menu.pizza_name,
       menu.price,
       ROUND(menu.price - menu.price * 0.1) AS discount_price   -- скидка 10%, округляем до целого
FROM person_order
JOIN person ON person.id = person_order.person_id
JOIN menu ON menu.id = person_order.menu_id
ORDER BY person.name, menu.pizza_name;
