-- Идея: сначала удаляем зависимые заказы, потом саму пиццу из меню.
DELETE FROM person_order
WHERE order_date = '2022-02-25';     -- новые заказы из задания 12

DELETE FROM menu
WHERE pizza_name = 'greek pizza';    -- теперь на пиццу никто не ссылается
