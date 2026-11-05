-- Идея: идём по заказам, а имя человека достаём подзапросом прямо в SELECT.
SELECT (SELECT name                          -- внутренний запрос: берём имя
        FROM person
        WHERE person.id = person_order.person_id)   -- именно того человека, чей это заказ
       AS name
FROM person_order
WHERE (menu_id = 13 OR menu_id = 14 OR menu_id = 18)  -- три варианта меню (IN запрещён)
  AND order_date = '2022-01-07';                      -- и дата заказа
