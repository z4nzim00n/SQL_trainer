-- Идея: id и пиццерию вычисляем подзапросами, а не вписываем числами.
INSERT INTO menu (id, pizzeria_id, pizza_name, price)
VALUES ((SELECT MAX(id) FROM menu) + 1,                        -- наибольший id плюс единица
        (SELECT id FROM pizzeria WHERE name = 'Dominos'),      -- id пиццерии по названию
        'sicilian pizza', 900);
