-- Идея: цена = цена * 0.9 (минус 10 процентов) только для greek pizza.
UPDATE menu
SET price = price * 0.9
WHERE pizza_name = 'greek pizza';   -- без WHERE изменились бы все пиццы
